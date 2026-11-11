# Stremio Aether

Desktop app for Stremio built with [Tauri](https://tauri.app). Stremio Aether is a fork of [Stremio Horizon](https://github.com/Aqu1tain/stremio-horizon-app), maintained by Zetsukae.

It bundles the Stremio Horizon web UI with a [forked stremio-service](https://github.com/Aqu1tain/stremio-service) for local streaming.

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

Tauri serves the frontend over `localhost` and spawns `stremio-service` as a sidecar process. The forked service has CORS disabled and auto-update removed so it works seamlessly inside the app.

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

2. Place stremio-service binaries in `src-tauri/binaries/`.

The fork is source-only, so build it at the tag the release workflow uses:

```bash
git clone --branch v0.1.0-horizon.2 https://github.com/Aqu1tain/stremio-service
cd stremio-service
cargo build --release --features bundled
```

Copy `target/release/stremio-service` and everything in `resources/bin/<os>/` (`server.js`, `stremio-runtime`, `ffmpeg`, `ffprobe`) into `src-tauri/binaries/`.

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

- [stremio-service (fork)](https://github.com/Aqu1tain/stremio-service): streaming backend

## Credits

Built on top of [stremio-service](https://github.com/Stremio/stremio-service) by [Smart Code](https://www.stremio.com) and [stremio-web](https://github.com/Stremio/stremio-web), and on Stremio Horizon by Aqu1tain. The web UI in `web/` is the Stremio Horizon source.

## License

GPL-2.0. See [LICENSE.md](LICENSE.md).
