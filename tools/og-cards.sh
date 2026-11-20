#!/usr/bin/env bash
# Builds the six link-preview cards (the picture shown when a page is shared)
# from tools/og-card.html, with Google Chrome:
#
#   ghanshyam-group/assets/img/og-image.jpg        the group (homepage)
#   ghanshyam-group/assets/img/og-<company>.jpg    each company's page
#
# Run from anywhere:  tools/og-cards.sh
# Needs Google Chrome (in /Applications) and macOS's built-in sips.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$ROOT/ghanshyam-group/assets/img"
[ -x "$CHROME" ] || { echo "Google Chrome is missing from /Applications"; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

render() {   # $1: the address ending (a ?company=... or nothing), $2: the file to make
  "$CHROME" --headless --hide-scrollbars --window-size=1200,630 --virtual-time-budget=6000 \
    --allow-file-access-from-files --user-data-dir="$TMP/profile" \
    --screenshot="$TMP/card.png" "file://$ROOT/tools/og-card.html$1" >/dev/null 2>&1
  sips -s format jpeg -s formatOptions 86 "$TMP/card.png" --out "$OUT/$2" >/dev/null
  echo "built ghanshyam-group/assets/img/$2"
}

render "" og-image.jpg
for id in silica kaolin minerals processors farm; do
  render "?company=$id" "og-$id.jpg"
done
