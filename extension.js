const { St, Gio, GLib, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

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
            let glyph = this._calculateGlyph();

            this.menu.removeAll();

            // Content for glyph
            let box = new St.BoxLayout({
                vertical: true,
                style_class: 'ajaw-box',
                x_align: St.Align.MIDDLE, 
                y_align: St.Align.MIDDLE  
            });
            
            // Horizontal contetn for (energy and name)
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

            // Number of nenergy
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

        //Calculate glyph name and energy
        _calculateGlyph() {
        
            let startDate = new Date(2018, 1, 2);
            let now = new Date();
            let difference = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

            let energy = (difference % 13) + 1;
            let position = (difference % 20) + 1;

            return {
                energy: energy,
                name: this._getNameMaya(position),
                icon: this._getGlyphIcon(position) + '.png'
            };
        }

        //Get glpyh name
        _getNameMaya(position) {
            const names = [
                'Tijax', 'Toj', "Tz'i'", "B'atz'", 'E', 'Aj', "I'x", 'Tz\'ikin', 'Ajmaq', "No'j",
                'Tijax', 'Kawoq', 'Ajpu', 'Imox', "Iq'", "Aq'ab'al", "K'at", 'Kan', 'Kame', "Q'anil"
            ];
            return names[position - 1] || 'Ajaw';
        }

        //get glyph icon
        _getGlyphIcon(position) {
            const icons = [
                'glifo_chinax', 'glifo_mulu', 'glifo_elab', 'glifo_batz', 'glifo_eyub', 'glifo_ben',
                'glifo_ix', 'glifo_tzikin', 'glifo_txabin', 'glifo_kixkab', 'glifo_chinax', 'glifo_kaq',
                'glifo_ajaw', 'glifo_imox', 'glifo_iq', 'glifo_watan', 'glifo_kana', 'glifo_abak',
                'glifo_tox', 'glifo_chej'
            ];
            return icons[position - 1] || 'ajaw';
        }
    }
);

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