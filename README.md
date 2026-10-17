Ajaw
====================================

Ajaw is a GNOME Shell extension for the Cholq'ij Mayan Calendar.

Also known as the Sacred Calendar, Tzolkin, Lunar Calendar, or the Count of Days.
It has 260 days, divided into 13 periods of 20 energies each, which repeat cyclically.
It contains the knowledge and wisdom of the Mayan Civilization, a legacy that has been passed down from generation to generation through oral tradition and documentary references.

![alt text](https://github.com/silexcorp/ajaw_gnome_extension/blob/master/screenshot/ubuntu.png?raw=true)

## Compatibility

- GNOME Shell 45 and 46 (including 46.x)

## Testing and Development

Follow these steps to test the extension locally:

### 1) Link or Copy Extension to GNOME Extensions Directory

Create the extensions folder (if it doesn't already exist) and link the project repository directly:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions
ln -s "$(pwd)" ~/.local/share/gnome-shell/extensions/ajaw@weareokan.com
```

> **Note:** If you already have an installed version of Ajaw, remove it first:
> ```bash
> rm -rf ~/.local/share/gnome-shell/extensions/ajaw@weareokan.com
> ```

### 2) Reload GNOME Shell

GNOME Shell needs to be reloaded to discover new extensions:

- **On X11 (default on many desktop setups):**
  Press `Alt + F2`, type `r`, and press `Enter`.
- **On Wayland:**
  Log out and log back in (or restart your session).

### 3) Enable the Extension

Enable the extension using the command line:

```bash
gnome-extensions enable ajaw@weareokan.com
```

Or verify its status:

```bash
gnome-extensions info ajaw@weareokan.com
```

### 4) Inspect Logs / Debugging

To monitor output or errors in real time:

```bash
journalctl -f -o cat /usr/bin/gnome-shell
```

Or filter specifically for Ajaw messages:

```bash
journalctl /usr/bin/gnome-shell -f | grep -i ajaw
```

## Packaging the Extension

To build a zip file ready for distribution:

```bash
gnome-extensions pack --extra-source=icons --extra-source=numbers --force
```

## Credits
Ajaw was created by [We Are Okan](http://tech.weareokan.com)

## Icons

### Original Theme
* (We are Okan) Ajaw - Calendario Maya [ajaw](https://play.google.com/store/apps/details?id=com.alexandermateo.ajaw).
* Icons created by [fredymateo](https://github.com/fredymateo).

