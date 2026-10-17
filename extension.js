import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

class Utils {
    static getDifferenceBetweenDays() {
        const strD1 = '2018/02/02';

        // Convert String to Date Object
        const d1 = new Date(strD1);
        const d2 = new Date();

        // Difference in days
        const delta = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
        return delta;
    }

    // Get glyph name
    static _getNameMaya(language) {
        const names = [
            "Toj", "Tz'i'", "B'atz'", "E", "Aj", "I'x", "Tz'ikin", "Ajmaq", "No'j",
            "Tijax", "Kawoq", "Ajpu", "Imox", "Iq'", "Aq'ab'al", "K'at", "Kan", "Kame", "Kej",
            "Q'anil"
        ];
        return names[language] || "Tijax";
    }

    // Get glyph icon
    static _getGlyphIcon(language) {
        const glyphs = [
            "glifo_mulu", "glifo_elab", "glifo_batz", "glifo_eyub", "glifo_ben",
            "glifo_ix", "glifo_tzikin", "glifo_txabin", "glifo_kixkab", "glifo_chinax", "glifo_kaq",
            "glifo_ajaw", "glifo_imox", "glifo_iq", "glifo_watan", "glifo_kana", "glifo_abak",
            "glifo_tox", "glifo_chej", "glifo_lambat"
        ];
        return glyphs[language] || "glifo_chinax";
    }

    // Calculate glyph name and energy
    static calculate() {
        const valor = Utils.getDifferenceBetweenDays();
        const number = valor % 13;
        const letter = valor % 20;

        const num = number + 1;
        const name = Utils._getNameMaya(letter);
        const icon = Utils._getGlyphIcon(letter) + ".png";

        return new Glyph(name, num, icon);
    }
}

class Glyph {
    constructor(name, energy, icon) {
        this.name = name;
        this.energy = energy;
        this.icon = icon;
    }
}

const AjawIndicator = GObject.registerClass(
    class AjawIndicator extends PanelMenu.Button {
        _init(extensionPath) {
            super._init(0.0, 'Ajaw', false);
            this._extensionPath = extensionPath;

            this.icon = new St.Icon({
                gicon: Gio.icon_new_for_string(`${this._extensionPath}/icons/ajaw.png`),
                style_class: 'system-status-icon',
            });

            this.add_child(this.icon);

            this._updateGlyph();
        }

        _updateGlyph() {
            const glyph = Utils.calculate();

            this.menu.removeAll();

            // Main vertical container
            const box = new St.BoxLayout({
                vertical: true,
                style_class: 'ajaw-box',
                x_align: Clutter.ActorAlign.CENTER, 
                y_align: Clutter.ActorAlign.CENTER  
            });
            
            // Top row: [Number] [Glyph Icon] side-by-side
            const topRow = new St.BoxLayout({
                vertical: false,
                style_class: 'ajaw-top-row',
                x_align: Clutter.ActorAlign.CENTER,
                y_align: Clutter.ActorAlign.CENTER,
            });

            // Mayan number image on the left
            const energyIcon = new St.Icon({
                gicon: Gio.icon_new_for_string(`${this._extensionPath}/numbers/${glyph.energy}.png`),
                icon_size: 70,
                width: 70,
                height: 70,
                x_align: Clutter.ActorAlign.CENTER,
                y_align: Clutter.ActorAlign.CENTER,
                x_expand: false,
                y_expand: false,
                style_class: 'ajaw-energy-icon',
            });
            topRow.add_child(energyIcon);

            // Mayan glyph icon on the right
            const glyphIcon = new St.Icon({
                gicon: Gio.icon_new_for_string(`${this._extensionPath}/icons/${glyph.icon}`),
                icon_size: 100,
                width: 100,
                height: 100,
                x_align: Clutter.ActorAlign.CENTER,
                y_align: Clutter.ActorAlign.CENTER,
                x_expand: false,
                y_expand: false,
                style_class: 'ajaw-glyph',
            });
            topRow.add_child(glyphIcon);

            box.add_child(topRow);

            // Name of glyph centered below
            const nameLabel = new St.Label({
                text: glyph.name,
                style_class: 'ajaw-name',
                x_align: Clutter.ActorAlign.CENTER,
                y_align: Clutter.ActorAlign.CENTER,
            });
            box.add_child(nameLabel);
            
            // Add container to menu item
            const glyphItem = new PopupMenu.PopupBaseMenuItem({ reactive: false });
            glyphItem.add_child(box);
            this.menu.addMenuItem(glyphItem);

            // Developer webpage
            const menuItem = new PopupMenu.PopupMenuItem('Desarrollador');
            menuItem.connect('activate', () => {
                Gio.AppInfo.launch_default_for_uri('http://tech.weareokan.com', null);
            });
            this.menu.addMenuItem(menuItem);
        }
    }
);

export default class AjawExtension extends Extension {
    enable() {
        this._indicator = new AjawIndicator(this.path);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}