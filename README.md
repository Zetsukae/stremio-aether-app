# Stremio Aether

> **Archived:** This project is archived and will no longer receive updates or maintenance.

Desktop app for Stremio built with [Tauri](https://tauri.app). Stremio Aether was a fork of [Stremio Horizon](https://github.com/Aqu1tain/stremio-horizon-app), previously maintained by Zetsukae.

It bundles the Stremio Horizon web UI with [stream-server](https://github.com/perpetus/stream-server) for local streaming.

> This is not a replacement for [Stremio](https://www.stremio.com). Go star Stremio!

## Changes compared to Stremio Horizon

- Custom title bar on desktop, with the close button on the right, left or center (Settings > Interface)
- Mobile bottom pill navigation (Home, Discover, Library, Downloads, Calendar, Search) that replaces the vertical navigation bar. Addons are reachable from the user menu on mobile
- Desktop search is part of the top navigation pill
- Native VLC playback on macOS, Windows and Linux, with resume, progress sync and language and subtitle preferences passed to VLC
- Native Discord Rich Presence
- Download manager with resumable transfers and offline HLS playback
- About page notes the fork and its maintainer

## Download

| Platform | Download |
|----------|----------|
| Linux (x64) | [.AppImage / .deb](https://github.com/Zetsukae/stremio-aether-app/releases/latest) |
| Windows (x64) | [.msi / .exe](https://github.com/Zetsukae/stremio-aether-app/releases/latest) |

Release history is on the [Releases page](https://github.com/Zetsukae/stremio-aether-app/releases).

### macOS: app is damaged / can't be opened

macOS quarantines apps downloaded outside the App Store. If you get a warning, run:

```bash
sudo xattr -rd com.apple.quarantine /Applications/Stremio\ Aether.app
