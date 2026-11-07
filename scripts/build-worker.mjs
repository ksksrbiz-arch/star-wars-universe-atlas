import { build } from 'esbuild';
await build({entryPoints:['cloudflare/worker.mjs'],outfile:'dist-worker/worker.mjs',bundle:true,platform:'node',format:'esm',target:'es2022',external:['pg-native'],banner:{js:"import { createRequire } from 'node:module'; const require = createRequire(import.meta.url || 'file:///worker.mjs');"},minify:true});

