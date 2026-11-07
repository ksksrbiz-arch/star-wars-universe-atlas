/** Audited local media: presentation imagery never establishes atlas geography. */
export const NASA_STARFIELD = {
  "id": "nasa-svs-4856",
  "title": "An Elsewhere Starfield",
  "provider": "NASA Scientific Visualization Studio",
  "providerId": "4856",
  "sourceUrl": "https://svs.gsfc.nasa.gov/4856/",
  "sourceDownloadUrl": "https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004856/starmap_random_2020_4k.exr",
  "sourceSha256": "e388901e81b7fc730baed87b07bfbf3f8cf30548e238e482f232b853348d13a4",
  "credit": "NASA’s Scientific Visualization Studio; visualization by Ernie Wright and Tom Bridgman. Background data: ESA/Gaia/DPAC; Tycho 2.",
  "rights": "Public domain under NASA SVS reuse guidance; no item-specific restriction identified.",
  "rightsUrl": "https://svs.gsfc.nasa.gov/help/",
  "rightsExcerpt": "All of our content is in the public domain (unless otherwise noted), meaning that it is free to download, use, and redistribute for whatever purposes you see fit.",
  "retrievedOn": "2026-11-07",
  "meaning": "Randomized astronomical starfield derived from real-sky catalogs. Decorative atmosphere only; not Star Wars geography, an official screenshot, or evidence of any fictional world.",
  "alt": "Illustrative randomized starfield from NASA’s Scientific Visualization Studio",
  "fallback": "Retain the existing CSS gradient and original procedural galaxy if image loading fails.",
  "transform": "Provider JPEG preview unchanged. EXR derivatives convert linear RGB to sRGB; 2k derivative uses Lanczos resampling; WebP quality72 (2k),82 (4k). No stars, objects, or labels added.",
  "files": [
    {
      "src": "/visuals/nasa-elsewhere-starfield-preview.jpg",
      "width": 1024,
      "height": 512,
      "bytes": 38031,
      "sha256": "86f5862882298f713dc7539a47b669ed1e3644acf50877139663eddf988491f4",
      "format": "image/jpeg"
    },
    {
      "src": "/visuals/nasa-elsewhere-starfield-2k.webp",
      "width": 2048,
      "height": 1024,
      "bytes": 143878,
      "sha256": "3ec1b28eab93ac5430879ddd0dcd4d324207bf25a55c282bf97d44d96154fcf0",
      "format": "image/webp"
    },
    {
      "src": "/visuals/nasa-elsewhere-starfield-4k.webp",
      "width": 4096,
      "height": 2048,
      "bytes": 1617056,
      "sha256": "8a82ef34a40c0abb6524a9216d7b5d754e6d4b144bbedc66f882ffe422dccea6",
      "format": "image/webp"
    }
  ]
} as const;
