#!/bin/bash
# 원본 영상 → 웹용 MP4(H.264) 변환 스크립트
#
# 왜 필요한가: 원본이 HEVC(H.265)로 저장돼 있으면 일부 브라우저(파이어폭스, 일부 윈도우 PC)에서 재생이 안 됨.
#             H.264로 바꾸면 사실상 모든 브라우저·휴대폰에서 재생됨.
#
# 사용법:  bash scripts/encode-videos.sh <원본폴더> [파일당 목표 MB, 기본 24]
#   원본폴더 안에 아래 이름으로 파일을 넣어두면 public/films/ 에 결과가 생김
#   nagoya.mp4  wedding-part-1.mp4  wedding-part-2.mp4  discontinue.mp4  zara.mp4  busan-pork-cutlet.mp4
#   (ffmpeg 필요: 맥은 `brew install ffmpeg`)
#
# 왜 '목표 용량'으로 만드나: 정적 호스팅에는 파일 하나당 크기 제한이 있음
#   (Cloudflare Pages 25MiB, GitHub 웹 업로드 25MB). 그래서 영상 길이에 맞춰 비트레이트를 계산해
#   항상 제한 안에 들어오게 2-pass(두 번 훑어서 정확히 맞추기) 인코딩을 함.
#   지금 들어 있는 영상은 Claude 미리보기 링크 제한(15MB)에 맞춘 버전 → 이 스크립트로 24MB 버전을 만들면 화질이 좋아짐.
#   원본 그대로의 화질이 필요하면 Vimeo/YouTube에 올리고 사이트에서 연결하는 방식을 추천.
set -e
SRC="${1:?원본 폴더를 지정하세요}"
TARGET_MB="${2:-24}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/films"
TMP="$(mktemp -d)"
mkdir -p "$OUT"

enc() { # 이름, 화면처리
  local in="$SRC/$1.mp4"
  local dur
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
  # 전체 비트(kbit) ÷ 길이(초) − 오디오 128k − 여유분 = 영상 비트레이트
  local vk
  vk=$(python3 -c "print(min(4500, int($TARGET_MB*8*1024*0.97/$dur - 128)))")
  echo "▶ $1 (${dur}s) → 영상 ${vk}kbps"
  ffmpeg -v error -y -i "$in" -vf "$2" -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
    -b:v ${vk}k -maxrate $((vk*2))k -bufsize $((vk*4))k -pass 1 -passlogfile "$TMP/$1" -an -f mp4 /dev/null
  ffmpeg -v error -y -i "$in" -vf "$2" -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
    -b:v ${vk}k -maxrate $((vk*2))k -bufsize $((vk*4))k -pass 2 -passlogfile "$TMP/$1" \
    -c:a aac -b:a 128k -ac 2 -movflags +faststart "$OUT/$1.mp4"
}
enc nagoya            "crop=1920:820:0:130,scale=1600:-2"  # 위아래 검은 띠 제거 (시네마스코프 2.34:1)
enc wedding-part-1    "scale=960:720"
enc wedding-part-2    "scale=1200:900"
enc discontinue       "scale=1280:720"
enc zara              "scale=720:1280"
enc busan-pork-cutlet "scale=-2:720"   # ⚠ 받은 파일이 저화질(406×720) — 원본 받으면 "scale=720:1280" 으로
rm -rf "$TMP"
ls -lh "$OUT"/*.mp4
echo "완료: $OUT"
