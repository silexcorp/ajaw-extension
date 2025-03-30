const { St, Gio, GLib, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

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
        _init() {
            super._init(0.0, 'Ajaw', false);

            this.icon = new St.Icon({
                gicon: Gio.icon_new_for_string(Me.path + '/icons/ajaw.png'),
                style_class: 'system-status-icon',
            });

            this.add_child(this.icon);

            this._updateGlyph();
        }

        _updateGlyph() {
            let glyph = Utils.calculate();

            this.menu.removeAll();

            // Content for glyph
            let box = new St.BoxLayout({
                vertical: true,
                style_class: 'ajaw-box',
                x_align: St.Align.MIDDLE, 
                y_align: St.Align.MIDDLE  
            });
            
            // Horizontal content for (energy and name)
            let boxHorizontal = new St.BoxLayout({
                vertical: false,
                style_class: 'ajaw-box-horizontal',
                x_align: St.Align.MIDDLE,
            });

            // Big icon for glyph
            let glyphIcon = new St.Icon({
                gicon: Gio.icon_new_for_string(Me.path + '/icons/' + glyph.icon),
                icon_size: 120,
                style_class: 'ajaw-glyph',
            });
            box.add_child(glyphIcon);

            // Number of energy
            let energyLabel = new St.Label({
                text: glyph.energy.toString(),
                style_class: 'ajaw-energy'
            });
            boxHorizontal.add_child(energyLabel);

            // Name of glyph
            let nameLabel = new St.Label({
                text: " " + glyph.name,
                style_class: 'ajaw-name',
            });
            boxHorizontal.add_child(nameLabel);
            box.add_child(boxHorizontal);
            
            //Add glyph, name and icon to container
            let glyphItem = new PopupMenu.PopupBaseMenuItem({ reactive: false });
            glyphItem.add_child(box);
            this.menu.addMenuItem(glyphItem);

            // Developer webpage
            let menuItem = new PopupMenu.PopupMenuItem('Developer');
            menuItem.connect('activate', () => {
                Gio.AppInfo.launch_default_for_uri('http://tech.weareokan.com', null);
            });
            this.menu.addMenuItem(menuItem);
        }
    }
)

let ajawIndicator;

function init() {}

function enable() {
    ajawIndicator = new AjawIndicator();
    Main.panel.addToStatusArea('ajawIndicator', ajawIndicator);
}

function disable() {
    if (ajawIndicator) {
        ajawIndicator.destroy();
        ajawIndicator = null;
    }
}