#!/usr/bin/env node
// Builds every logo file in ghanshyam-group/assets/img/brand/ from the logo's own
// artwork (assets/js/core/logo.js) and colours (assets/css/tokens.css):
//
//   ghanshyam-<company>.svg / .png         the full logo, for light surfaces
//   ghanshyam-<company>-white.svg / .png   reversed, for dark surfaces
//   ghanshyam-group-horizontal(-white)     the G beside the name and label
//   ghanshyam-mark(-white)                 the G on its own
//   ghanshyam-seal, favicon, phone icons
//
// The label and tagline are set in Montserrat Medium and turned into outlines,
// so the files look the same on a computer without the font. The proportions
// match assets/css/logo.css.
//
//   node tools/logo-kit.mjs
//
// Needs Node 22+, an internet connection (for the font) and Google Chrome.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'ghanshyam-group');
const OUT = join(SITE, 'assets/img/brand');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9473;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BRANCHES = [['group', 'GROUP'], ['silica-sand', 'SILICA SAND'], ['kaolin', 'KAOLIN'],
  ['minerals', 'MINERALS'], ['processors', 'PROCESSORS'], ['farm-house', 'FARM HOUSE']];
const TAGLINE = [['PURE BY ', 0], ['NATURE.', 1], [' PERFECT BY ', 0], ['CHOICE.', 1]];

// ---- the logo's artwork and colours -------------------------------------------
const source = await readFile(join(SITE, 'assets/js/core/logo.js'), 'utf8');
const art = (name) => new RegExp(`var ${name} = '([^']+)'`).exec(source)[1];
const BODY = art('BODY'), WAVE = art('WAVE'), WORD = art('WORD'), PEAKS = art('PEAKS');
const tokens = await readFile(join(SITE, 'assets/css/tokens.css'), 'utf8');
const token = (name) => new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`).exec(tokens)[1];
const C = {
  ink: token('logo-ink'), inkLight: token('logo-ink-light'), inkDeep: token('logo-ink-deep'),
  wave: token('logo-wave'), waveLight: token('logo-wave-light'), waveDeep: token('logo-wave-deep'),
  tagGold: token('logo-tag-gold'), rev: token('logo-ink-rev'), waveRev: token('logo-wave-rev')
};
const STRATA = [1, 2, 3, 4, 5].map((i) => token('stratum-' + i));

// ---- proportions, in logo units: the wordmark is 1108 wide (see logo.css) -------
const L = 1108;
const P = {
  mark: L * 0.4, markGap: L * 0.05, word: 120,
  labelTop: L * 0.0295, labelH: L * 0.0568, labelGap: L * 0.034, rule: L * 0.0036, labelTrack: 0.32,
  tagTop: L * 0.031, tagSize: L * 0.0292, tagTrack: 0.17
};

// ---- a small Chrome driver ------------------------------------------------------
const profile = await mkdtemp(join(tmpdir(), 'gg-logo-kit-'));
const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 80 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page'); } catch { /* starting */ }
  if (!target) await sleep(150);
}
if (!target) { proc.kill(); throw new Error('Chrome did not start'); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let seq = 0;
const waiting = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && waiting.has(d.id)) { const w = waiting.get(d.id); waiting.delete(d.id); d.error ? w.rej(new Error(JSON.stringify(d.error))) : w.res(d.result); }
};
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; waiting.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
const run = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
await send('Page.enable');
const open = async (html, wait) => {
  await send('Page.navigate', { url: 'data:text/html;base64,' + Buffer.from(html).toString('base64') });
  await sleep(wait);
};

// ---- text to outlines: drawn large, then traced ----------------------------------
const SCALE = 10;
await open('<!doctype html><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=block"><body>', 1500);
const fontOk = await run(`document.fonts.load('500 40px Montserrat').then(() => document.fonts.ready).then(() => document.fonts.check('500 40px Montserrat'))`);
if (!fontOk) throw new Error('Montserrat did not load');

function trace(a, w, h, T = 127.5) {
  const key = (x, y, o) => (y * w + x) * 2 + o;    // o = 0: edge to the right of (x,y); 1: edge below it
  const spot = (k) => {
    const o = k % 2, i = (k - o) / 2, x = i % w, y = (i - x) / w;
    const v0 = a[i], v1 = o ? a[i + w] : a[i + 1], t = (T - v0) / (v1 - v0);
    return o ? [x, y + t] : [x + t, y];
  };
  const next = new Map();
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const i = y * w + x;
      const c = (a[i] >= T ? 8 : 0) | (a[i + 1] >= T ? 4 : 0) | (a[i + w + 1] >= T ? 2 : 0) | (a[i + w] >= T ? 1 : 0);
      if (c === 0 || c === 15) continue;
      const top = key(x, y, 0), right = key(x + 1, y, 1), bottom = key(x, y + 1, 0), left = key(x, y, 1);
      const links = { 1: [[left, bottom]], 2: [[bottom, right]], 3: [[left, right]], 4: [[right, top]], 5: [[left, bottom], [right, top]],
        6: [[bottom, top]], 7: [[left, top]], 8: [[top, left]], 9: [[top, bottom]], 10: [[top, right], [bottom, left]], 11: [[top, right]],
        12: [[right, left]], 13: [[right, bottom]], 14: [[bottom, left]] }[c];
      links.forEach(([p, q]) => next.set(p, q));
    }
  }
  const loops = [];
  while (next.size) {
    const first = next.keys().next().value, ring = [];
    let k = first;
    while (next.has(k)) { const n = next.get(k); next.delete(k); ring.push(spot(k)); k = n; }
    if (ring.length > 6) loops.push(ring);
  }
  return loops;
}
function simplify(ring, tol) {       // Ramer-Douglas-Peucker on a closed ring
  const far = ring.reduce((b, p, i) => { const d = (p[0] - ring[0][0]) ** 2 + (p[1] - ring[0][1]) ** 2; return d > b[0] ? [d, i] : b; }, [-1, 0])[1];
  const part = (pts) => {
    const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
    const stack = [[0, pts.length - 1]];
    while (stack.length) {
      const [s, e] = stack.pop(); let best = -1, at = -1;
      const [ax, ay] = pts[s], dx = pts[e][0] - ax, dy = pts[e][1] - ay, len = Math.hypot(dx, dy) || 1;
      for (let i = s + 1; i < e; i++) { const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / len; if (d > best) { best = d; at = i; } }
      if (best > tol) { keep[at] = 1; stack.push([s, at], [at, e]); }
    }
    return pts.filter((_, i) => keep[i]);
  };
  return [...part(ring.slice(0, far + 1)), ...part([...ring.slice(far), ring[0]]).slice(1, -1)];
}
const textCache = new Map();
async function outline(text, size, track) {
  const id = `${text}|${size}|${track}`;
  if (textCache.has(id)) return textCache.get(id);
  const px = size * SCALE, sp = px * track;
  const r = await run(`(() => {
    const cv = document.createElement('canvas'), x = cv.getContext('2d', { willReadFrequently: true });
    const style = () => { x.font = '500 ${px}px Montserrat'; x.letterSpacing = '${sp}px'; x.textBaseline = 'alphabetic'; x.fillStyle = '#000'; };
    style();
    const t = ${JSON.stringify(text)}, m = x.measureText(t), pad = 24;
    const asc = Math.ceil(m.fontBoundingBoxAscent), desc = Math.ceil(m.fontBoundingBoxDescent);
    cv.width = Math.ceil(m.width) + pad * 2; cv.height = asc + desc + pad * 2;
    style();
    x.fillText(t, pad, pad + asc);
    const d = x.getImageData(0, 0, cv.width, cv.height).data, a = new Uint8Array(cv.width * cv.height);
    for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
    let s = ''; for (let i = 0; i < a.length; i += 8192) s += String.fromCharCode.apply(null, a.subarray(i, i + 8192));
    return { w: cv.width, h: cv.height, pad, asc: asc, desc: desc, adv: m.width, a: btoa(s) };
  })()`);
  const alpha = Uint8Array.from(Buffer.from(r.a, 'base64'));
  const f = (v) => (Math.round(v * 100) / 100).toString();
  const d = trace(alpha, r.w, r.h).map((ring) => {
    const pts = simplify(ring, 0.42).map(([x, y]) => [(x - r.pad) / SCALE, (y - r.pad - r.asc) / SCALE]);
    return 'M' + pts.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
  }).join('');
  const res = { d, adv: r.adv / SCALE, asc: r.asc / SCALE, desc: r.desc / SCALE, track: sp / SCALE };
  textCache.set(id, res);
  return res;
}

// ---- the parts ----------------------------------------------------------------------
const n = (v) => (Math.round(v * 100) / 100).toString();
const defs = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.inkLight}"/><stop offset=".55" stop-color="${C.ink}"/><stop offset="1" stop-color="${C.inkDeep}"/></linearGradient>` +
  `<linearGradient id="w" x1="0" y1="0" x2="1" y2=".5"><stop offset="0" stop-color="${C.waveDeep}"/><stop offset=".42" stop-color="${C.waveLight}"/><stop offset="1" stop-color="${C.wave}"/></linearGradient></defs>`;
const ruleDefs = (gold) => `<defs><linearGradient id="r1"><stop offset="0" stop-color="${gold}" stop-opacity="0"/><stop offset=".34" stop-color="${gold}"/></linearGradient>` +
  `<linearGradient id="r2"><stop offset=".66" stop-color="${gold}"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></linearGradient></defs>`;
const palette = (dark) => (dark
  ? { body: C.rev, wave: C.waveRev, ink: C.rev, gold: C.waveRev, tagGold: C.waveRev }
  : { body: 'url(#g)', wave: 'url(#w)', ink: C.ink, gold: C.wave, tagGold: C.tagGold });
const markAt = (x, y, size, c) => `<g transform="translate(${n(x)} ${n(y)}) scale(${n(size / 1000 * 1000) / 1000})"><path fill="${c.body}" fill-rule="evenodd" d="${BODY}"/><path fill="${c.wave}" d="${WAVE}"/></g>`;
const wordAt = (x, y, c) => `<g transform="translate(${n(x + 1)} ${n(y - 450)})"><path fill="${c.ink}" fill-rule="evenodd" d="${WORD}"/><path fill="${c.gold}" d="${PEAKS}"/></g>`;
async function labelAt(text, x, y, c) {
  const t = await outline(text, P.labelH, P.labelTrack);
  const visible = t.adv - t.track, left = x + (L - visible) / 2;
  const base = y + (P.labelH - (t.asc + t.desc)) / 2 + t.asc, mid = y + P.labelH / 2;
  const ruleL = left - P.labelGap - x, ruleR = x + L - (left + visible + P.labelGap);
  return `<path fill="${c.ink}" fill-rule="evenodd" transform="translate(${n(left)} ${n(base)})" d="${t.d}"/>` +
    `<rect fill="url(#r1)" x="${n(x)}" y="${n(mid - P.rule / 2)}" width="${n(ruleL)}" height="${n(P.rule)}"/>` +
    `<rect fill="url(#r2)" x="${n(left + visible + P.labelGap)}" y="${n(mid - P.rule / 2)}" width="${n(ruleR)}" height="${n(P.rule)}"/>`;
}
async function tagAt(y, c) {
  const runs = [];
  for (const [text] of TAGLINE) runs.push(await outline(text, P.tagSize, P.tagTrack));
  const total = runs.reduce((s, r) => s + r.adv, 0) - runs[0].track;
  const base = y + (P.tagSize - (runs[0].asc + runs[0].desc)) / 2 + runs[0].asc;
  let x = (L - total) / 2, out = '';
  TAGLINE.forEach(([, gold], i) => {
    out += `<path fill="${gold ? c.tagGold : c.ink}" fill-rule="evenodd" transform="translate(${n(x)} ${n(base)})" d="${runs[i].d}"/>`;
    x += runs[i].adv;
  });
  return out;
}
const file = (w, h, title, body, x = 0, y = 0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(x)} ${n(y)} ${n(w)} ${n(h)}" role="img" aria-labelledby="t"><title id="t">${title}</title>${body}</svg>\n`;

async function stacked(text, dark) {
  const c = palette(dark);
  let y = P.mark + P.markGap;
  let body = (dark ? '' : defs) + ruleDefs(c.gold) + markAt((L - P.mark) / 2, 0, P.mark, c) + wordAt(0, y, c);
  y += P.word + P.labelTop;
  body += await labelAt(text, 0, y, c);
  y += P.labelH + P.tagTop;
  body += await tagAt(y, c);
  return file(L, y + P.tagSize + 4, `GHANSHYAM ${text}`, body);
}
async function horizontal(text, dark) {
  const c = palette(dark), size = L * 0.25, gap = L * 0.06, blockH = P.word + P.labelTop + P.labelH;
  const H = Math.max(size, blockH), tx = size + gap, ty = (H - blockH) / 2;
  const row = await labelAt(text, tx, ty + P.word + P.labelTop, c);
  const body = (dark ? '' : defs) + ruleDefs(c.gold) + markAt(0, (H - size) / 2, size, c) + wordAt(tx, ty, c) + row;
  return file(tx + L, H, `GHANSHYAM ${text}`, body);
}
const markFile = (dark) => { const c = palette(dark); return file(1000, 1000, 'GHANSHYAM mark', (dark ? '' : defs) + markAt(0, 0, 1000, c)); };
function ringArc(i) {
  const R = 88, gap = 9, a0 = -126 + gap / 2 + i * 72, a1 = a0 + 72 - gap;
  const pt = (deg) => { const r = deg * Math.PI / 180; return `${(100 + R * Math.cos(r)).toFixed(2)} ${(100 + R * Math.sin(r)).toFixed(2)}`; };
  return `<path d="M${pt(a0)}A${R} ${R} 0 0 1 ${pt(a1)}" fill="none" stroke="${STRATA[i]}" stroke-width="5" stroke-linecap="round"/>`;
}
const rev = { body: C.rev, wave: C.waveRev };
const seal = file(200, 200, 'GHANSHYAM GROUP monogram seal', `<circle cx="100" cy="100" r="100" fill="${C.inkDeep}"/>${[0, 1, 2, 3, 4].map(ringArc).join('')}${markAt(48, 48, 104, rev)}`);
// the favicon drops the ring: at 16 px it would only blur the G
const favicon = file(200, 200, 'GHANSHYAM GROUP', `<circle cx="100" cy="100" r="100" fill="${C.inkDeep}"/>${markAt(30, 30, 140, rev)}`);
// app icons are full squares: the phone rounds the corners itself
const appIcon = file(200, 200, 'GHANSHYAM GROUP', `<rect width="200" height="200" fill="${C.inkDeep}"/>${markAt(40, 40, 120, rev)}`);

// ---- write everything -----------------------------------------------------------------
const files = {};
for (const [slug, text] of BRANCHES) {
  files[`ghanshyam-${slug}`] = await stacked(text, false);
  files[`ghanshyam-${slug}-white`] = await stacked(text, true);
}
files['ghanshyam-group-horizontal'] = await horizontal('GROUP', false);
files['ghanshyam-group-horizontal-white'] = await horizontal('GROUP', true);
files['ghanshyam-mark'] = markFile(false);
files['ghanshyam-mark-white'] = markFile(true);
files['ghanshyam-seal'] = seal;
for (const [name, svg] of Object.entries(files)) await writeFile(join(OUT, name + '.svg'), svg);
await writeFile(join(OUT, 'favicon.svg'), favicon);

await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
async function png(svg, w, h, name) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await open(`<!doctype html><style>html,body{margin:0;background:transparent}img{display:block;width:${w}px;height:${h}px}</style><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}">`, 260);
  await run(`document.images[0].decode()`);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
  await writeFile(join(OUT, name + '.png'), Buffer.from(shot.data, 'base64'));
}
for (const [name, svg] of Object.entries(files)) {
  const [, , vw, vh] = /viewBox="([^"]+)"/.exec(svg)[1].split(' ').map(Number);
  const w = name === 'ghanshyam-seal' ? 512 : name.includes('mark') ? 1000 : 1600;
  await png(svg, w, Math.round(w * vh / vw), name);
}
await png(favicon, 32, 32, 'favicon-32');
await png(appIcon, 180, 180, 'apple-touch-icon');
await png(appIcon, 192, 192, 'icon-192');
await png(appIcon, 512, 512, 'icon-512');

try { await send('Browser.close'); } catch { /* closed */ }
ws.close();
proc.kill();
await sleep(200);
await rm(profile, { recursive: true, force: true }).catch(() => {});
console.log(`Built ${Object.keys(files).length} logo files as SVG and PNG, plus the favicon and phone icons.`);
process.exit(0);
