#!/usr/bin/env bash
# Builds the five branch videos on the homepage's first screen.
#
#   source   generated-images/branches/<branch>.mp4   the final film, when it exists
#            generated-images/footage/<clip>.mp4      otherwise, the placeholder
#   output   ghanshyam-group/assets/video/branches/
#              <branch>-wide.mp4 / .webm   up to 1920 wide (laptops and desktops)
#              <branch>-720.mp4  / .webm   1280 wide (small screens, slow connections)
#              <branch>-tall.mp4 / .webm   a 9:16 crop (phones, portrait tablets)
#              <branch>.webp, <branch>-tall.webp   poster frames (the first frame)
#
# Each film becomes a seamless loop: its last second fades into its first.
# To swap a film: put the new one at generated-images/branches/<branch>.mp4,
# run this script, reload the site. No code changes.
#
#   tools/branch-films.sh            build all five
#   tools/branch-films.sh kaolin     build one
#   CRF=25 VP9=36 tools/branch-films.sh    smaller files (lower is sharper)
#
# Needs ffmpeg and cwebp:  brew install ffmpeg webp
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FINAL="$ROOT/generated-images/branches"
HOLD="$ROOT/generated-images/footage"
OUT="$ROOT/ghanshyam-group/assets/video/branches"
CRF="${CRF:-23}"
VP9="${VP9:-33}"
ONLY="${1:-}"

# branch, its placeholder clip, and how far across the frame its subject sits (%)
# in the placeholder and in a final film. The phone crop is centred there.
TABLE="silica quarry 60 72
kaolin kaolin 50 80
minerals minerals 60 68
processors processors 62 78
farm farm 72 68"

command -v ffmpeg >/dev/null || { echo "ffmpeg is missing: brew install ffmpeg"; exit 1; }
command -v cwebp >/dev/null || { echo "cwebp is missing: brew install webp"; exit 1; }
mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# $4 is the most bits a second this cut may use, so a busy shot stays light on the web
h264() {
  ffmpeg -nostdin -loglevel error -y -i "$1" -vf "$2" -an -c:v libx264 -preset slow -crf "$CRF" \
    -maxrate "$4" -bufsize "$4" -profile:v high -pix_fmt yuv420p -g 48 -keyint_min 24 -sc_threshold 0 \
    -movflags +faststart "$3"
}
vp9() {
  ffmpeg -nostdin -loglevel error -y -i "$1" -vf "$2" -an -c:v libvpx-vp9 -crf "$VP9" -b:v "$4" \
    -maxrate "$4" -bufsize "$4" -row-mt 1 -tile-columns 2 -g 48 -deadline good -cpu-used 2 -pix_fmt yuv420p "$3"
}
poster() {
  ffmpeg -nostdin -loglevel error -y -i "$1" -vf "$2" -frames:v 1 -pix_fmt rgb24 "$TMP/poster.png"
  cwebp -quiet -q 78 -metadata none "$TMP/poster.png" -o "$3"
}
kb() { echo "$(( $(wc -c < "$1") / 1024 ))"; }

count=0
while read -r id clip hold_x final_x; do
  if [ -n "$ONLY" ] && [ "$id" != "$ONLY" ]; then continue; fi
  if [ -f "$FINAL/$id.mp4" ]; then src="$FINAL/$id.mp4"; x="$final_x"; kind="final";
  else src="$HOLD/$clip.mp4"; x="$hold_x"; kind="placeholder"; fi

  # the loop: the last second blends into the first
  dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")"
  body="$(awk -v d="$dur" 'BEGIN { printf "%.3f", d - 1 }')"
  ffmpeg -nostdin -loglevel error -y -i "$src" -filter_complex \
    "[0:v]split=3[a][b][c];\
     [a]trim=start=1:end=${body},setpts=PTS-STARTPTS[mid];\
     [b]trim=start=${body},setpts=PTS-STARTPTS[tail];\
     [c]trim=end=1,setpts=PTS-STARTPTS[head];\
     [tail][head]xfade=transition=fade:duration=1:offset=0[blend];\
     [blend][mid]concat=n=2:v=1:a=0,format=yuv420p[out]" \
    -map "[out]" -an -c:v libx264 -preset veryfast -crf 12 "$TMP/$id.mp4"

  crop169="crop='trunc(min(iw,ih*16/9)/2)*2':'trunc(min(ih,iw*9/16)/2)*2'"
  wide="$crop169,scale='min(1920,iw)':-2:flags=lanczos"
  small="$crop169,scale=1280:720:flags=lanczos"
  tall="crop='trunc(ih*9/16/2)*2':ih:'max(0,min(iw-ow,iw*${x}/100-ow/2))':0"

  h264 "$TMP/$id.mp4" "$wide" "$OUT/$id-wide.mp4" 3600k
  vp9  "$TMP/$id.mp4" "$wide" "$OUT/$id-wide.webm" 2800k
  h264 "$TMP/$id.mp4" "$small" "$OUT/$id-720.mp4" 2000k
  vp9  "$TMP/$id.mp4" "$small" "$OUT/$id-720.webm" 1500k
  h264 "$TMP/$id.mp4" "$tall" "$OUT/$id-tall.mp4" 1500k
  vp9  "$TMP/$id.mp4" "$tall" "$OUT/$id-tall.webm" 1100k
  poster "$TMP/$id.mp4" "$wide" "$OUT/$id.webp"
  poster "$TMP/$id.mp4" "$tall" "$OUT/$id-tall.webp"

  size="$(ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0:s=x "$OUT/$id-wide.mp4")"
  echo "$id ($kind, $size): wide $(kb "$OUT/$id-wide.mp4")/$(kb "$OUT/$id-wide.webm") KB, 720 $(kb "$OUT/$id-720.mp4")/$(kb "$OUT/$id-720.webm") KB, tall $(kb "$OUT/$id-tall.mp4")/$(kb "$OUT/$id-tall.webm") KB, posters $(kb "$OUT/$id.webp")/$(kb "$OUT/$id-tall.webp") KB"
  count=$((count + 1))
done <<< "$TABLE"

if [ "$count" -eq 0 ]; then echo "No branch named $ONLY."; exit 1; fi
echo "Built $count branch film(s) in ${OUT#$ROOT/}"
