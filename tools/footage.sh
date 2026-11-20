#!/usr/bin/env bash
# Builds the website's short looping videos from the original clips.
#
#   originals  generated-images/footage/<name>.mp4   (never uploaded)
#   output     ghanshyam-group/assets/video/footage/<name>.mp4   960 px wide, no sound
#              ghanshyam-group/assets/video/footage/<name>.webp  its still (phones, "reduce motion")
#
# Each clip becomes a seamless loop: its last second fades into its first,
# so the loop never jumps. To swap a clip: replace the original (same name),
# run this script, reload the site.
#
#   tools/footage.sh            build every clip
#   tools/footage.sh quarry     build one clip
#   CRF=28 tools/footage.sh     smaller files (default 27; lower is sharper)
#
# Needs ffmpeg and cwebp:  brew install ffmpeg webp
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/generated-images/footage"
OUT="$ROOT/ghanshyam-group/assets/video/footage"
CRF="${CRF:-27}"
ONLY="${1:-}"

command -v ffmpeg >/dev/null || { echo "ffmpeg is missing: brew install ffmpeg"; exit 1; }
command -v cwebp >/dev/null || { echo "cwebp is missing: brew install webp"; exit 1; }
mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

count=0
for f in "$SRC"/*.mp4; do
  [ -e "$f" ] || continue
  name="$(basename "$f" .mp4)"
  if [ -n "$ONLY" ] && [ "$name" != "$ONLY" ]; then continue; fi
  dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
  # seconds kept before the blend, and the blend length
  body="$(awk -v d="$dur" 'BEGIN { printf "%.3f", d - 1 }')"
  ffmpeg -loglevel error -y -i "$f" -filter_complex \
    "[0:v]split=3[a][b][c];\
     [a]trim=start=1:end=${body},setpts=PTS-STARTPTS[mid];\
     [b]trim=start=${body},setpts=PTS-STARTPTS[tail];\
     [c]trim=end=1,setpts=PTS-STARTPTS[head];\
     [tail][head]xfade=transition=fade:duration=1:offset=0[blend];\
     [blend][mid]concat=n=2:v=1:a=0,scale=960:-2:flags=lanczos,format=yuv420p[out]" \
    -map "[out]" -an -c:v libx264 -preset slow -crf "$CRF" -profile:v high -g 48 -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -loglevel error -y -i "$OUT/$name.mp4" -frames:v 1 -pix_fmt rgb24 "$TMP/$name.png"
  cwebp -quiet -q 80 -metadata none "$TMP/$name.png" -o "$OUT/$name.webp"
  echo "$name: video $(( $(wc -c < "$OUT/$name.mp4") / 1024 ))KB, still $(( $(wc -c < "$OUT/$name.webp") / 1024 ))KB"
  count=$((count + 1))
done
if [ "$count" -eq 0 ]; then echo "No originals found${ONLY:+ for $ONLY}."; exit 1; fi
echo "Built $count clip(s) in ${OUT#$ROOT/}"
