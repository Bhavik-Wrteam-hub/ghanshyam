#!/usr/bin/env bash
# Builds the film in the homepage's About section: an excavator loading a truck.
#
#   shots    generated-images/about/truck-load.mp4     the excavator fills the parked truck
#            generated-images/about/truck-leave.mp4    the full truck drives away (optional)
#            generated-images/about/truck-arrive.mp4   the next truck backs in (optional)
#   output   ghanshyam-group/assets/video/about/
#              excavator-large.mp4 / .webm   1080 x 1320 (desktop, tablets)
#              excavator-small.mp4 / .webm   720 x 880 (phones, slow connections)
#              excavator.webp, excavator-small.webp   poster frames
#
# Each shot starts on the picture the one before it ended on, so a dissolve of a
# few frames joins them and the last shot runs back into the first. Until both
# optional shots exist, the loading shot loops on its own.
# To swap the film: replace the shots (same names), run this, reload the site.
#
#   tools/about-film.sh
#   TOP=20 tools/about-film.sh      where the 9:11 crop starts, in % from the top
#
# Needs ffmpeg and cwebp:  brew install ffmpeg webp
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/generated-images/about"
OUT="$ROOT/ghanshyam-group/assets/video/about"
TOP="${TOP:-16}"
FPS=24
JOIN=6                # frames of dissolve between two shots
LOOP=12               # frames of dissolve where the film returns to its start
CRF="${CRF:-23}"
VP9="${VP9:-33}"

command -v ffmpeg >/dev/null || { echo "ffmpeg is missing: brew install ffmpeg"; exit 1; }
command -v cwebp >/dev/null || { echo "cwebp is missing: brew install webp"; exit 1; }
[ -f "$DIR/truck-load.mp4" ] || { echo "No film at generated-images/about/truck-load.mp4"; exit 1; }
mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

shots=("$DIR/truck-load.mp4")
if [ -f "$DIR/truck-leave.mp4" ] && [ -f "$DIR/truck-arrive.mp4" ]; then
  shots+=("$DIR/truck-leave.mp4" "$DIR/truck-arrive.mp4")
fi

count() { ffprobe -v error -select_streams v -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$1"; }
sec() { awk -v n="$1" -v f="$FPS" 'BEGIN { printf "%.4f", n / f }'; }

# one stream: each shot dissolves into the next
inputs=(); graph=""; total=0; last=""
for i in "${!shots[@]}"; do
  inputs+=(-i "${shots[$i]}")
  graph+="[$i:v]fps=$FPS,format=yuv420p,settb=AVTB,setsar=1[s$i];"
  n="$(count "${shots[$i]}")"
  if [ "$i" -eq 0 ]; then
    last="s0"; total="$n"
  else
    graph+="[$last][s$i]xfade=transition=fade:duration=$(sec "$JOIN"):offset=$(sec $((total - JOIN)))[x$i];"
    last="x$i"; total=$((total + n - JOIN))
  fi
done

# the loop: the film's last moment dissolves into its first
rest=$((total - LOOP))
graph+="[$last]split=3[a][b][c];\
[a]trim=start_frame=$LOOP:end_frame=$rest,setpts=PTS-STARTPTS[main];\
[b]trim=start_frame=$rest,setpts=PTS-STARTPTS[tail];\
[c]trim=end_frame=$LOOP,setpts=PTS-STARTPTS[head];\
[tail][head]xfade=transition=fade:duration=$(sec "$LOOP"):offset=0[join];\
[main][join]concat=n=2:v=1:a=0,format=yuv420p[out]"
ffmpeg -nostdin -loglevel error -y "${inputs[@]}" -filter_complex "$graph" \
  -map "[out]" -an -c:v libx264 -preset veryfast -crf 12 "$TMP/loop.mp4"

# the most bits a second each cut may use, so a longer film stays light on the web
secs="$(sec "$rest")"
rate() { awk -v kb="$1" -v most="$2" -v d="$secs" 'BEGIN { r = kb * 8 / d; if (r > most) r = most; printf "%dk", r }'; }

crop="crop=iw:trunc(iw*11/9/2)*2:0:trunc(ih*${TOP}/100/2)*2"
h264() {
  ffmpeg -nostdin -loglevel error -y -i "$TMP/loop.mp4" -vf "$crop,scale=$1:-2:flags=lanczos" -an -c:v libx264 \
    -preset slow -crf "$CRF" -maxrate "$2" -bufsize "$2" -profile:v high -pix_fmt yuv420p -g 48 -keyint_min 24 \
    -sc_threshold 0 -movflags +faststart "$3"
}
vp9() {
  ffmpeg -nostdin -loglevel error -y -i "$TMP/loop.mp4" -vf "$crop,scale=$1:-2:flags=lanczos" -an -c:v libvpx-vp9 \
    -crf "$VP9" -b:v "$2" -maxrate "$2" -bufsize "$2" -row-mt 1 -tile-columns 1 -g 48 -deadline good -cpu-used 2 \
    -pix_fmt yuv420p "$3"
}
poster() {
  ffmpeg -nostdin -loglevel error -y -i "$TMP/loop.mp4" -vf "$crop,scale=$1:-2:flags=lanczos" -frames:v 1 -pix_fmt rgb24 "$TMP/poster.png"
  cwebp -quiet -q 80 -metadata none "$TMP/poster.png" -o "$2"
}

h264 1080 "$(rate 6500 3400)" "$OUT/excavator-large.mp4"
vp9  1080 "$(rate 5600 2600)" "$OUT/excavator-large.webm"
h264 720  "$(rate 3200 1600)" "$OUT/excavator-small.mp4"
vp9  720  "$(rate 2800 1200)" "$OUT/excavator-small.webm"
poster 1080 "$OUT/excavator.webp"
poster 720  "$OUT/excavator-small.webp"

echo "${#shots[@]} shot(s), ${secs} s"
for f in "$OUT"/excavator*; do echo "$(basename "$f"): $(( $(wc -c < "$f") / 1024 )) KB"; done
