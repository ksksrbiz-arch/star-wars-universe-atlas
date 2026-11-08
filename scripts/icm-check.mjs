#!/usr/bin/env node
// icm-check: verifies a project follows the ICM (Interpretable Context Methodology) layout:
// a short root router, small references, and per-workflow CONTEXT.md contracts.
// Zero dependencies. Usage:
//   node scripts/icm-check.mjs [projectDir] [--root-only]    (or: npm run check:icm)
//
// Rules (defaults; override in <projectDir>/.icmcheck.json):
//   - CLAUDE.md exists and is a router: <= rootMax lines (80) and <= rootMaxBytes (3072)
//   - AGENTS.md, when present, is a pointer: <= entryMaxBytes (3072)
//   - CLAUDE.md has a "Load | Do not load" table and an exclusion rule
//   - <context>/references/*.md are <= refMax lines (200)       (context = "context" or ".ai")
//   - every <context>/workflows/**/CONTEXT.md has Input, Process, Output, Completion sections
//     (and Stop conditions when "requireStopConditions" is true)
//   - every top-level workflow has its own "Load | Do not load" table
//   - every top-level workflow directory is routed from CLAUDE.md
//   - relative markdown links in CLAUDE.md, AGENTS.md, context files and evidence/release-history.md resolve
//   - backticked repo paths and `npm run` scripts named in CLAUDE.md and context files exist
// Byte caps are defaults; override rootMaxBytes/entryMaxBytes in .icmcheck.json for other projects.
// --root-only checks only the root router (for repos that are not themselves ICM projects).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

export const DEFAULTS = { rootMax: 80, rootMaxBytes: 3072, entryMaxBytes: 3072, refMax: 200, requireStopConditions: false, contextDirs: ['context', '.ai'] };

const lineCount = (text) => text.replace(/\n$/, '').split('\n').length;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (name === 'node_modules' || name === '.git') continue;
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

export function check(projectDir, options = {}) {
  const root = resolve(projectDir);
  const problems = [];
  const fail = (msg) => problems.push(msg);
  const rel = (p) => relative(root, p).split('\\').join('/');

  let cfg = { ...DEFAULTS };
  const cfgPath = join(root, '.icmcheck.json');
  if (existsSync(cfgPath)) {
    try { cfg = { ...cfg, ...JSON.parse(readFileSync(cfgPath, 'utf8')) }; }
    catch (e) { fail(`.icmcheck.json is not valid JSON: ${e.message}`); }
  }

  // Root router.
  const claudePath = join(root, 'CLAUDE.md');
  if (!existsSync(claudePath)) {
    fail('CLAUDE.md is missing (the root router)');
    return { problems, summary: null };
  }
  const claude = readFileSync(claudePath, 'utf8');
  const rootLines = lineCount(claude);
  if (rootLines > cfg.rootMax) fail(`CLAUDE.md is ${rootLines} lines; router cap is ${cfg.rootMax}`);
  const rootBytes = Buffer.byteLength(claude, 'utf8');
  if (rootBytes > cfg.rootMaxBytes) fail(`CLAUDE.md is ${rootBytes} bytes; router byte cap is ${cfg.rootMaxBytes} (move batch/status prose to evidence/ or context/)`);
  const agentsPath = join(root, 'AGENTS.md');
  if (existsSync(agentsPath)) {
    const agentsBytes = Buffer.byteLength(readFileSync(agentsPath, 'utf8'), 'utf8');
    if (agentsBytes > cfg.entryMaxBytes) fail(`AGENTS.md is ${agentsBytes} bytes; entry-pointer byte cap is ${cfg.entryMaxBytes}`);
  }
  if (!/\|\s*Load\s*\|\s*Do not load\s*\|/i.test(claude)) fail('CLAUDE.md needs a table with "Load" and "Do not load" columns');
  if (!/exclusion/i.test(claude)) fail('CLAUDE.md needs an explicit exclusion rule (say what NOT to load)');

  if (options.rootOnly) {
    return { problems, summary: `root router ${rootLines}/${cfg.rootMax} lines, ${rootBytes}/${cfg.rootMaxBytes} bytes (root-only check)` };
  }

  // Context directory.
  const ctxName = cfg.contextDirs.find((d) => existsSync(join(root, d)) && statSync(join(root, d)).isDirectory());
  if (!ctxName) {
    fail(`no context directory found (looked for: ${cfg.contextDirs.join(', ')})`);
    return { problems, summary: null };
  }
  const ctx = join(root, ctxName);
  const ctxFiles = [...walk(ctx)].filter((p) => p.endsWith('.md'));

  // References stay small.
  const refDir = join(ctx, 'references');
  const refs = existsSync(refDir) ? ctxFiles.filter((p) => p.startsWith(refDir)) : [];
  for (const f of refs) {
    const n = lineCount(readFileSync(f, 'utf8'));
    if (n > cfg.refMax) fail(`${rel(f)} is ${n} lines; reference cap is ${cfg.refMax}`);
  }

  // Workflow contracts.
  const wfRoot = join(ctx, 'workflows');
  const contracts = existsSync(wfRoot) ? ctxFiles.filter((p) => p.startsWith(wfRoot) && p.endsWith('CONTEXT.md')) : [];
  const sections = [
    [/^## Inputs?\b/m, 'Input'],
    [/^## Process\b/m, 'Process'],
    [/^## Outputs?\b/m, 'Output'],
    [/^## Completion\b/m, 'Completion'],
  ];
  if (cfg.requireStopConditions) sections.push([/^## Stop conditions\b/m, 'Stop conditions']);
  for (const f of contracts) {
    const text = readFileSync(f, 'utf8');
    for (const [re, name] of sections) if (!re.test(text)) fail(`${rel(f)} is missing "## ${name}"`);
  }
  const topLevelDirs = existsSync(wfRoot) ? readdirSync(wfRoot).filter((n) => statSync(join(wfRoot, n)).isDirectory()) : [];
  for (const w of topLevelDirs) {
    const f = join(wfRoot, w, 'CONTEXT.md');
    if (!existsSync(f)) { fail(`${ctxName}/workflows/${w}/ has no CONTEXT.md`); continue; }
    if (!/\|\s*Load\s*\|\s*Do not load\s*\|/i.test(readFileSync(f, 'utf8'))) fail(`${rel(f)} needs a "Load | Do not load" table`);
    if (!claude.includes(`${ctxName}/workflows/${w}/`) && !claude.includes(`workflows/${w}/`)) {
      fail(`CLAUDE.md does not route to ${ctxName}/workflows/${w}/`);
    }
  }

  // Named paths and npm scripts exist.
  let scripts = null;
  const pkgPath = join(root, 'package.json');
  if (existsSync(pkgPath)) {
    try { scripts = JSON.parse(readFileSync(pkgPath, 'utf8')).scripts || {}; } catch { fail('package.json is not valid JSON'); }
  }
  const docs = [claudePath, ...(existsSync(agentsPath) ? [agentsPath] : []), ...ctxFiles];
  const skipToken = (t) => /[*<>{}…]|\.\.\./.test(t);
  for (const f of docs) {
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/`([^`\s]+)`/g)) {
      const t = m[1].replace(/[.,;:]+$/, '');
      if (skipToken(t)) continue;
      if (t.startsWith(`${ctxName}/`)) {
        if (!existsSync(join(root, t))) fail(`${rel(f)} names a path that does not exist: ${t}`);
      } else if (/^(workflows|references)\//.test(t)) {
        if (!existsSync(join(ctx, t))) fail(`${rel(f)} names a context path that does not exist: ${ctxName}/${t}`);
      }
    }
    if (scripts) {
      for (const m of text.matchAll(/npm run ([a-z0-9:_-]+)/gi)) {
        if (!scripts[m[1]]) fail(`${rel(f)} names an npm script that does not exist: ${m[1]}`);
      }
    }
  }

  const linkDocs = [...docs, join(root, 'evidence', 'release-history.md')].filter((f) => existsSync(f));
  for (const f of linkDocs) {
    for (const m of readFileSync(f, 'utf8').matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const href = m[1].split('#')[0];
      if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href)) continue;
      if (!existsSync(resolve(dirname(f), href))) fail(`${rel(f)} has a broken relative link: ${m[1]}`);
    }
  }

  return {
    problems,
    summary: `router ${rootLines}/${cfg.rootMax} lines, ${rootBytes}/${cfg.rootMaxBytes} bytes, ${contracts.length} workflow contracts, ${refs.length} references (context dir: ${ctxName}/)`,
  };
}

// CLI
const { fileURLToPath } = await import('node:url');
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const rootOnly = args.includes('--root-only');
  const dir = args.find((a) => !a.startsWith('--')) || '.';
  const { problems, summary } = check(dir, { rootOnly });
  if (problems.length) {
    console.error(`ICM check FAILED for ${resolve(dir)}:\n - ${problems.join('\n - ')}`);
    process.exit(1);
  }
  console.log(`ICM check OK: ${summary}`);
}

