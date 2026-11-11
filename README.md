# Stremio Aether

Desktop app for Stremio built with [Tauri](https://tauri.app). Stremio Aether is a fork of [Stremio Horizon](https://github.com/Aqu1tain/stremio-horizon-app), maintained by Zetsukae.

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
```

## How it works

Tauri serves the frontend over `localhost` and spawns `stream-server --no-tray` as a sidecar process. ffmpeg and ffprobe sit next to it in the app's `binaries/` resource folder.

## Development

### Prerequisites

- [Rust](https://rustup.rs)
- [pnpm](https://pnpm.io) 11+
- [Node.js](https://nodejs.org) 22+

### Setup

1. Install dependencies:

```bash
pnpm install
pnpm --dir web install
```

2. Stage the streaming server and ffmpeg in `src-tauri/binaries/`.

Download `stream-server-linux-amd64` (Linux) or `stream-server-windows-amd64.exe` (Windows) from the [perpetus/stream-server v0.1.8 release](https://github.com/perpetus/stream-server/releases/tag/v0.1.8), check it against `SHA256SUMS.txt`, and save it as `src-tauri/binaries/stream-server` (or `stream-server.exe`).

Copy ffmpeg from the [stremio-service fork](https://github.com/Aqu1tain/stremio-service) at `v0.1.0-horizon.2`:

- Linux: `resources/bin/linux/ffmpeg` and `ffprobe`
- Windows: `resources/bin/windows/ffmpeg.exe`, `ffprobe.exe` and every `*.dll` beside them

On Linux, `stream-server` also needs `libtorrent-rasterbar` 2.0 installed (`libtorrent-rasterbar2.0t64` on Ubuntu 24.04, `rb_libtorrent` on Fedora).

3. Run in development mode:

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

This builds the web UI from `web/` into `dist/`, then packages the app. Output goes to `src-tauri/target/release/bundle/`: `.AppImage` / `.deb` (Linux) or `.msi` / `.exe` (Windows).

## Related repos

- [stream-server](https://github.com/perpetus/stream-server): streaming backend
- [stremio-service (fork)](https://github.com/Aqu1tain/stremio-service): source of the bundled ffmpeg and ffprobe

## Credits

Built on top of [stremio-service](https://github.com/Stremio/stremio-service) by [Smart Code](https://www.stremio.com) and [stremio-web](https://github.com/Stremio/stremio-web), and on Stremio Horizon by Aqu1tain. The web UI in `web/` is the Stremio Horizon source.

## License

GPL-2.0. See [LICENSE.md](LICENSE.md).
