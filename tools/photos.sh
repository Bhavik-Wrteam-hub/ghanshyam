#!/usr/bin/env bash
# Builds the website photos from the original images.
#
#   originals  generated-images/companies/*.jpg
#              generated-images/grades/*.jpg
#              generated-images/products/*.jpg
#              generated-images/sections/about-*.jpg
#   output     ghanshyam-group/assets/img/photos/<name>-<width>.webp
#
# Each photo is made in 480, 800 and 1200 px widths (never wider than the
# original), straight from the original, so every file gets exactly one
# compression pass. The originals stay outside the website folder.
#
# To swap a photo: replace the original (same file name), run this script,
# reload the site. site-content.js already points at the right files.
#
#   tools/photos.sh                 build every photo
#   tools/photos.sh company-farm    build one photo
#   QUALITY=84 tools/photos.sh      change the WebP quality (default 82)
#
# Needs ffmpeg and cwebp:  brew install ffmpeg webp
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/generated-images"
OUT="$ROOT/ghanshyam-group/assets/img/photos"
QUALITY="${QUALITY:-82}"
ONLY="${1:-}"

command -v ffmpeg >/dev/null || { echo "ffmpeg is missing: brew install ffmpeg"; exit 1; }
command -v cwebp >/dev/null || { echo "cwebp is missing: brew install webp"; exit 1; }

mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

count=0
for f in "$SRC"/companies/*.jpg "$SRC"/grades/*.jpg "$SRC"/products/*.jpg "$SRC"/sections/about-*.jpg; do
  [ -e "$f" ] || continue
  name="$(basename "$f" .jpg)"
  if [ -n "$ONLY" ] && [ "$name" != "$ONLY" ]; then continue; fi
  w="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f")"

  widths=""
  for t in 480 800; do
    if [ "$t" -lt "$w" ]; then widths="$widths $t"; fi
  done
  if [ "$w" -lt 1200 ]; then widths="$widths $w"; else widths="$widths 1200"; fi

  line="$name:"
  for t in $widths; do
    # Lanczos resize to a lossless PNG, then the single WebP encode.
    ffmpeg -loglevel error -y -i "$f" -vf "scale=${t}:-2:flags=lanczos" -frames:v 1 -pix_fmt rgb24 "$TMP/$name-$t.png"
    cwebp -quiet -q "$QUALITY" -af -m 6 -sharp_yuv -metadata none "$TMP/$name-$t.png" -o "$OUT/$name-$t.webp"
    kb=$(( $(wc -c < "$OUT/$name-$t.webp") / 1024 ))
    line="$line ${t}w ${kb}KB"
  done
  echo "$line"
  count=$((count + 1))
done

if [ "$count" -eq 0 ]; then echo "No originals found${ONLY:+ for $ONLY}."; exit 1; fi
echo "Built $count photo(s) in ${OUT#$ROOT/}"
