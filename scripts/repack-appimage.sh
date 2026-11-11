#!/usr/bin/env bash
# Rebuilds a release's Linux AppImage without the bundled libwayland libraries.
# The bundled copies clash with the system EGL stack and make WebKit abort on start.
set -euo pipefail

TAG="${1:?usage: repack-appimage.sh <tag>}"
ROOT="$(pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
cd "$WORK"

gh release download "$TAG" --pattern '*_amd64.AppImage' --pattern 'latest.json'
APPIMAGE="$(basename "$(ls ./*_amd64.AppImage)")"

chmod +x "$APPIMAGE"
"./$APPIMAGE" --appimage-extract >/dev/null
rm -f squashfs-root/usr/lib/libwayland-*.so*
chmod -R a+rX squashfs-root

curl -fsSL -o appimagetool https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage
chmod +x appimagetool
mkdir out
APPIMAGE_EXTRACT_AND_RUN=1 ARCH=x86_64 ./appimagetool squashfs-root "out/$APPIMAGE"

(cd "$ROOT" && pnpm exec tauri signer sign "$WORK/out/$APPIMAGE")

jq --arg sig "$(cat "out/$APPIMAGE.sig")" \
    '.platforms["linux-x86_64"].signature = $sig | .platforms["linux-x86_64-appimage"].signature = $sig' \
    latest.json > out/latest.json

gh release upload "$TAG" "out/$APPIMAGE" "out/$APPIMAGE.sig" out/latest.json --clobber
