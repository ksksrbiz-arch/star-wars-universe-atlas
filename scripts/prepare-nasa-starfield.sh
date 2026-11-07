#!/usr/bin/env bash
# Reproduce local web derivatives from the reviewed public-domain NASA SVS4856 source.
# Run from the repository root; ffmpeg needs EXR, zscale and libwebp support.
set -euo pipefail
mkdir -p work/media public/visuals
curl --fail --silent --show-error --location --proto '=https' https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004856/starmap_random_2020_4k.exr -o work/media/nasa-elsewhere-starfield-4k.exr
curl --fail --silent --show-error --location --proto '=https' https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004856/starmap_random_2020_4k_print.jpg -o work/media/nasa-elsewhere-starfield-preview.jpg
printf '%s\n' 'e388901e81b7fc730baed87b07bfbf3f8cf30548e238e482f232b853348d13a4  work/media/nasa-elsewhere-starfield-4k.exr' '86f5862882298f713dc7539a47b669ed1e3644acf50877139663eddf988491f4  work/media/nasa-elsewhere-starfield-preview.jpg' | sha256sum --check
ffmpeg -y -hide_banner -loglevel error -i work/media/nasa-elsewhere-starfield-4k.exr -frames:v 1 -vf 'format=gbrpf32le,zscale=transferin=linear:transfer=iec61966-2-1:primariesin=bt709:primaries=bt709:matrixin=gbr:matrix=gbr,format=rgb24' -c:v libwebp -quality 82 work/media/nasa-elsewhere-starfield-4k.webp
ffmpeg -y -hide_banner -loglevel error -i work/media/nasa-elsewhere-starfield-4k.exr -frames:v 1 -vf 'format=gbrpf32le,zscale=transferin=linear:transfer=iec61966-2-1:primariesin=bt709:primaries=bt709:matrixin=gbr:matrix=gbr,scale=2048:1024:flags=lanczos,format=rgb24' -c:v libwebp -quality 72 work/media/nasa-elsewhere-starfield-2k.webp
cp work/media/nasa-elsewhere-starfield-preview.jpg work/media/nasa-elsewhere-starfield-2k.webp work/media/nasa-elsewhere-starfield-4k.webp public/visuals/
# Validate resulting dimensions/bytes/hashes against src/mediaAssets.ts before updating that registry.
