/* ==========================================================================
   SAND SCENE: a photoreal, scroll-driven silica sand pour (WebGL2).

   What makes it read as real, and how each piece is done:
   - Individual crystals: every grain is a camera-facing sprite drawn from a
     procedurally generated atlas of faceted, slightly elongated quartz grains
     (normal + occlusion + alpha), lit per pixel, so highlights stay true to
     the scene light as grains tumble.
   - Optics: thin-lens depth of field (focus on the front of the heap, so the
     falling stream and the foreground scatter go soft) and shutter motion
     blur (moving grains are stretched and sampled along their velocity).
   - Light: one soft key light from the upper left, a cool fill from the
     right, wrap lighting for translucency, facet glints, crevice occlusion.
   - Grounding: a soft heap shadow and a contact shadow under every loose grain.
   - Physics: the stream falls under gravity and widens; impacts throw grains
     that bounce and roll down the 31 degree slope; the heap grows in shells,
     each new grain rolling from the top to its resting place; loose grains
     hop out onto the floor.

   The hero's pour valve decides the heap's volume and how hard sand flows; the
   stream, bounces and rolls run in real time and come to rest when the valve
   closes, so nothing renders while the scene is still.
   Interface matches the canvas fallback in hero.js:
     resize(), frame(volume, flow, dt), still(hf), alive(), stats()
   ========================================================================== */
(function () {
  'use strict';
  var GG = (window.GG = window.GG || {});
  var DEG = Math.PI / 180;

  /* ---- Scene constants (world units: heap base radius = 1) -------------- */
  var R = 1;                              /* final heap base radius */
  var REPOSE = 31 * DEG;                  /* angle of repose of dry quartz sand */
  var H = Math.tan(REPOSE) * R;           /* final heap height */
  var D = 0.031;                          /* mean grain diameter (coarse, clearly visible grains) */
  var LAYERS = 24;                        /* grain shapes in the atlas */
  var TILE = 64;                          /* atlas tile size in px */
  var SPR = 24;                           /* grain radius inside a tile, px */
  var MAXDYN = 2400;                      /* falling + bouncing grains */
  var WINDOW = 1.6;                       /* visible depth of the heap, in grain layers */
  var FALL_TIME = 0.9;                    /* seconds from the top of the screen to the heap: slow motion */
  var V0 = 0.85;                          /* mean speed grains leave the spout with */

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function smooth(p, a, b) { var t = clamp((p - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  /* ---- Matrices (column-major) ----------------------------------------- */
  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }
  function lookAt(e, t, u) {
    var zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2];
    var l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
    var xx = u[1] * zz - u[2] * zy, xy = u[2] * zx - u[0] * zz, xz = u[0] * zy - u[1] * zx;
    l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l;
    var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
      -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]);
  }
  function mulVec(m, x, y, z) {
    return [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13],
      m[2] * x + m[6] * y + m[10] * z + m[14], m[3] * x + m[7] * y + m[11] * z + m[15]];
  }
  function rotVec(m, x, y, z) {
    var a = [m[0] * x + m[4] * y + m[8] * z, m[1] * x + m[5] * y + m[9] * z, m[2] * x + m[6] * y + m[10] * z];
    var l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l];
  }

  /* The heap profile: a cone at the angle of repose with a rounded crown. */
  function heapY(s, t) {
    var y = H * s * Math.max(0, 1 - t);
    y -= H * s * 0.07 * Math.exp(-(t * t) / 0.012);
    return Math.max(0, y);
  }
  function surfaceY(s, r) { return s <= 0 ? 0 : heapY(s, r / (R * s)); }

  /* ---- Shaders ------------------------------------------------------------ */
  var COMMON = [
    '#version 300 es',
    'precision highp float;',
    'precision highp int;',
    'uniform mat4 uProj, uView;',
    'uniform vec2 uViewport;',
    'uniform float uTime, uScur, uR, uH, uD;',
    'const float PI = 3.14159265;',
    'vec3 heapPoint(float s, float th, float t) {',
    '  float r = uR * s * t;',
    '  float y = uH * s * max(0.0, 1.0 - t);',
    '  y -= uH * s * 0.07 * exp(-(t * t) / 0.012);',
    '  return vec3(sin(th) * r, max(y, 0.0), cos(th) * r);',
    '}',
    'vec3 heapNormal(float th) { return normalize(vec3(sin(th) * uH, uR, cos(th) * uH)); }'
  ].join('\n');

  var GRAIN_VS = COMMON + '\n' + [
    'layout(location=0) in vec2 aCorner;',
    'layout(location=1) in vec4 aA;',
    'layout(location=2) in vec4 aB;',
    'layout(location=3) in vec4 aC;',
    'uniform int uMode;          // 0 heap, 1 loose floor grains, 2 falling and bouncing grains',
    'uniform float uFocus, uCoc, uShutter, uCocScale;',
    'out vec2 vQ; out float vRs; out vec2 vStreak; out vec2 vRot; out float vLayer; out float vLod;',
    'out vec3 vMacro; out float vAO; out float vSeed; out float vAlpha; out float vSpin;',
    'void hide() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }',
    'void main() {',
    '  vec3 P; vec3 vel = vec3(0.0); float size; float layer; float rot; float seed; float alpha = 1.0;',
    '  vec3 macro = vec3(0.0, 0.3, 1.0); float ao = 1.0; float spin = 0.0;',
    '  if (uMode == 2) {',
    '    P = aA.xyz; size = aA.w; vel = aB.xyz; layer = aB.w; rot = aC.x; seed = aC.y; alpha = aC.z; spin = 1.0;',
    '  } else {',
    '    size = aA.w; layer = aB.x; rot = aB.y; seed = aB.z;',
    '    float act = aC.x;',
    '    if (act == 0.0) { hide(); return; }',
    '    float age = act > 0.0 ? uTime - act : 100.0;',
    '    if (age < 0.0) { hide(); return; }',
    '    float fade = 1.0;',
    '    if (act < 0.0) { fade = 1.0 - (uTime + act) / 0.22; if (fade <= 0.0) { hide(); return; } }',
    '    if (uMode == 0) {',
    '      float th = aA.x, t = aA.y, s = aA.z, bury = aB.w;',
    '      float dur = 0.3 + 0.75 * t;',
    '      float k = clamp(age / dur, 0.0, 1.0);',
    '      float e = 1.0 - (1.0 - k) * (1.0 - k);',
    '      float tt = t * e;',
    '      vec3 n = heapNormal(th);',
    '      P = heapPoint(s, th, tt) + n * size * (0.42 - bury * 0.6);',
    '      P.y += abs(sin(k * PI * 2.5)) * (1.0 - k) * size * 0.9;',
    '      rot += (tt * uR * s) / size * (fract(seed * 13.7) > 0.5 ? 1.1 : -1.1);',
    '      macro = mat3(uView) * n;',
    '      ao = 1.0 - bury * 0.5;',
    '      ao *= mix(0.86, 1.0, 1.0 - smoothstep(0.6, 0.86, t));',
    '      spin = 1.0 - k;',
    '    } else {',
    '      float phi = aA.x, r = aA.y;',
    '      if (uScur * uR > r - size * 0.3) { hide(); return; }',
    '      float k = clamp(age / 0.6, 0.0, 1.0);',
    '      vec3 from = heapPoint(uScur, phi, 0.12);',
    '      vec3 to = vec3(sin(phi) * r, size * 0.4, cos(phi) * r);',
    '      float e = 1.0 - pow(1.0 - k, 1.6);',
    '      P = mix(from, to, e);',
    '      float hop = k < 0.7 ? sin(k / 0.7 * PI) * 0.16 : sin((k - 0.7) / 0.3 * PI) * 0.025;',
    '      P.y += hop * uScur;',
    '      macro = mat3(uView) * vec3(0.0, 1.0, 0.0);',
    '      ao = 0.96;',
    '      spin = 1.0 - k;',
    '      rot += e * 11.0 * (seed - 0.5);',
    '    }',
    '    alpha = fade;',
    '    size *= mix(0.55, 1.0, fade);',
    '  }',
    '  vec4 vc = uView * vec4(P, 1.0);',
    '  float vz = max(-vc.z, 0.01);',
    '  vec4 c0 = uProj * vc;',
    '  float sizePx = size * uProj[1][1] * uViewport.y * 0.5 / vz;',
    '  float coc = uCoc * uCocScale * abs(vz - uFocus) / vz;',
    '  float rs = sizePx * 0.5 + coc * 0.45;',
    '  if (uMode == 2) alpha *= clamp(pow(sizePx * 0.5 / rs, 2.0) * 1.3, 0.06, 1.0);',
    '  vec2 streak = vec2(0.0);',
    '  if (uMode == 2) {',
    '    vec4 c1 = uProj * (uView * vec4(P - vel * uShutter, 1.0));',
    '    streak = (c0.xy / c0.w - c1.xy / c1.w) * 0.5 * uViewport;',
    '  }',
    '  float sl = length(streak);',
    '  vec2 dir = sl > 0.5 ? streak / sl : vec2(1.0, 0.0);',
    '  vec2 perp = vec2(-dir.y, dir.x);',
    '  vec2 off = dir * aCorner.x * (rs + sl * 0.5) + perp * aCorner.y * rs;',
    '  vec4 clip = c0;',
    '  clip.xy += (off - streak * 0.5) * 2.0 / uViewport * clip.w;',
    '  gl_Position = clip;',
    '  vQ = off; vStreak = streak; vRs = rs;',
    '  vRot = vec2(cos(rot), sin(rot));',
    '  vLayer = layer;',
    '  vLod = log2(1.0 + sl / max(rs * 2.0, 1.0)) * 0.9 + log2(max(1.0, ' + (SPR * 2).toFixed(1) + ' / max(sizePx, 1.0))) + log2(1.0 + coc / max(sizePx, 1.0)) * 1.7;',
    '  vMacro = macro; vAO = ao; vSeed = seed; vAlpha = alpha; vSpin = spin;',
    '}'
  ].join('\n');

  var GRAIN_FS = [
    '#version 300 es',
    'precision highp float;',
    'precision highp int;',
    'precision highp sampler2DArray;',
    'uniform sampler2DArray uAtlas;',
    'uniform vec3 uLight, uFill;',
    'uniform float uTime, uTopFade, uPx;',
    'uniform int uBlend, uNoMSAA, uTaps;',
    'in vec2 vQ; in float vRs; in vec2 vStreak; in vec2 vRot; in float vLayer; in float vLod;',
    'in vec3 vMacro; in float vAO; in float vSeed; in float vAlpha; in float vSpin;',
    'out vec4 o;',
    'vec4 tap(vec2 q) {',
    '  vec2 r = vec2(vRot.x * q.x + vRot.y * q.y, -vRot.y * q.x + vRot.x * q.y);',
    '  vec2 uv = 0.5 + r / vRs * ' + (SPR / TILE).toFixed(5) + ';',
    '  return textureLod(uAtlas, vec3(uv, vLayer), vLod);',
    '}',
    'void main() {',
    '  vec4 t;',
    '  if (uTaps > 1 && length(vStreak) > 0.75) {',
    '    t = vec4(0.0);',
    '    for (int i = 0; i < 12; i++) { float f = float(i) / 11.0 - 0.5; t += tap(vQ + vStreak * f); }',
    '    t /= 12.0;',
    '  } else { t = tap(vQ); }',
    '  float a = t.a * vAlpha;',
    '  if (uTopFade > 0.0) a *= smoothstep(uTopFade * 0.5, uTopFade, uPx - gl_FragCoord.y);',
    '  if (a < 0.004) discard;',
    '  if (uBlend == 0) { a = smoothstep(0.32, 0.68, a); if (uNoMSAA == 1 && a < 0.5) discard; }',
    '  vec3 tx = t.rgb / max(t.a, 1e-4);',
    '  vec2 n2 = tx.rg * 2.0 - 1.0;',
    '  n2 = vec2(vRot.x * n2.x - vRot.y * n2.y, vRot.y * n2.x + vRot.x * n2.y);',
    '  vec3 N = vec3(n2, sqrt(max(0.0, 1.0 - dot(n2, n2))));',
    '  N = normalize(N + vec3(vMacro.xy * 0.75, 0.0));',
    '  float ao = tx.b * vAO;',
    '  float form = clamp(dot(normalize(vMacro), uLight) * 0.5 + 0.5, 0.0, 1.0);',
    '  float ndl = dot(N, uLight);',
    '  float wrap = clamp((ndl + 0.55) / 1.55, 0.0, 1.0);',
    '  float diff = wrap;',
    '  float fill = clamp(dot(N, uFill) * 0.5 + 0.5, 0.0, 1.0);',
    '  vec3 Hh = normalize(uLight + vec3(0.0, 0.0, 1.0));',
    '  float sp = pow(max(dot(N, Hh), 0.0), 110.0);',
    '  float facet = 0.35 + 0.65 * step(0.45, fract(vSeed * 17.31));',
    '  float flick = 1.0 + vSpin * 2.0 * pow(max(0.0, sin(uTime * 21.0 + vSeed * 63.0)), 10.0);',
    '  float shade = fract(vSeed * 3.71);',
    '  vec3 albedo = vec3(0.958, 0.967, 0.963) * (0.9 + 0.1 * shade) * (shade < 0.08 ? 0.95 : 1.0);',
    '  vec3 col = albedo * (vec3(0.905, 0.925, 0.93) * 0.70 + vec3(1.0, 0.994, 0.982) * diff * 0.34 + vec3(0.86, 0.9, 0.93) * fill * 0.07);',
    '  col *= mix(0.72, 1.0, ao) * mix(0.8, 1.04, form);',
    '  col += vec3(1.0) * sp * facet * flick * 0.55;',
    '  col += vec3(0.98, 1.0, 1.0) * pow(1.0 - tx.b, 2.0) * wrap * 0.07;',
    '  col = clamp(col, 0.0, 1.0);',
    '  o = uBlend == 1 ? vec4(col * a, a) : vec4(col, a);',
    '}'
  ].join('\n');

  var CORE_VS = COMMON + '\n' + [
    'layout(location=0) in vec2 aTT;',
    'out vec3 vN; out vec2 vSurf; out float vT;',
    'void main() {',
    '  float th = aTT.x, t = aTT.y;',
    '  vec3 n = heapNormal(th);',
    '  vec3 P = heapPoint(uScur, th, t) - n * uD * 0.55;',
    '  P.y = max(P.y, 0.0005);',
    '  vN = mat3(uView) * n;',
    '  float slant = sqrt(uR * uR + uH * uH);',
    '  vSurf = vec2(th * uR * uScur * max(t, 0.02), t * slant * uScur);',
    '  vT = t;',
    '  gl_Position = uProj * uView * vec4(P, 1.0);',
    '}'
  ].join('\n');

  var CORE_FS = [
    '#version 300 es',
    'precision highp float;',
    'precision highp int;',
    'uniform vec3 uLight; uniform float uD;',
    'in vec3 vN; in vec2 vSurf; in float vT;',
    'out vec4 o;',
    'vec2 hash2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }',
    'void main() {',
    '  vec2 g = vSurf / (uD * 0.9);',
    '  vec2 i = floor(g), f = fract(g);',
    '  float d1 = 8.0, d2 = 8.0; vec2 id = vec2(0.0);',
    '  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {',
    '    vec2 b = vec2(float(x), float(y));',
    '    vec2 r = b + hash2(i + b) - f;',
    '    float d = dot(r, r);',
    '    if (d < d1) { d2 = d1; d1 = d; id = i + b; } else if (d < d2) { d2 = d; }',
    '  }',
    '  float edge = smoothstep(0.0, 0.35, sqrt(d2) - sqrt(d1));',
    '  vec2 h = hash2(id * 1.37);',
    '  vec3 N = normalize(normalize(vN) + vec3((h - 0.5) * 1.1, 0.0));',
    '  float w = clamp((dot(N, uLight) + 0.55) / 1.55, 0.0, 1.0);',
    '  float form = clamp(dot(normalize(vN), uLight) * 0.5 + 0.5, 0.0, 1.0);',
    '  vec3 col = vec3(0.93, 0.945, 0.942) * (0.66 + 0.2 * w) * mix(0.93, 1.0, edge) * (0.9 + 0.1 * h.x) * mix(0.8, 1.02, form);',
    '  o = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var BG_VS = [
    '#version 300 es',
    'void main() {',
    '  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);',
    '  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  var BG_FS = [
    '#version 300 es',
    'precision highp float;',
    'precision highp int;',
    'uniform vec2 uViewport; uniform float uFloorY;',
    'out vec4 o;',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / uViewport;',
    '  float y = 1.0 - uv.y;',
    '  float asp = uViewport.x / uViewport.y;',
    '  vec3 c = mix(vec3(0.958, 0.966, 0.962), vec3(0.934, 0.946, 0.938), smoothstep(0.0, 0.55, y));',
    '  c = mix(c, vec3(0.893, 0.912, 0.902), smoothstep(0.5, uFloorY, y));',
    '  c = mix(c, vec3(0.905, 0.921, 0.913), smoothstep(uFloorY, 1.0, y));',
    '  vec2 d = vec2((uv.x - 0.24) * asp, y - 0.08);',
    '  c += vec3(0.045, 0.043, 0.04) * exp(-dot(d, d) * 2.4);',
    '  vec2 v = vec2((uv.x - 0.5) * asp, y - 0.5);',
    '  c *= 1.0 - 0.055 * dot(v, v);',
    '  o = vec4(c, 1.0);',
    '}'
  ].join('\n');

  var SHADOW_VS = COMMON + '\n' + [
    'layout(location=0) in vec2 aCorner;',
    'layout(location=1) in vec4 aA;',
    'layout(location=2) in vec4 aB;',
    'layout(location=3) in vec4 aC;',
    'uniform int uShadowMode;   // 0 the heap, 1 loose floor grains',
    'uniform vec3 uShadowDir;   // floor offset direction away from the light',
    'out vec2 vC; out float vK; out float vRel;',
    'void main() {',
    '  vec3 P;',
    '  if (uShadowMode == 0) {',
    '    float rs = uR * uScur;',
    '    P = vec3(aCorner.x, 0.0, aCorner.y) * rs * 2.4 + uShadowDir * rs * 0.42;',
    '    vC = aCorner * 2.4 * rs;                  // floor coords around the shadow centre',
    '    vRel = rs; vK = 1.0;',
    '  } else {',
    '    float act = aC.x;',
    '    float age = act > 0.0 ? uTime - act : -1.0;',
    '    float phi = aA.x, r = aA.y, size = aA.w;',
    '    if (act <= 0.0 || age < 0.35 || uScur * uR > r - size * 0.3) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }',
    '    vec3 base = vec3(sin(phi) * r, 0.0, cos(phi) * r);',
    '    P = base + uShadowDir * size * 0.45 + vec3(aCorner.x, 0.0, aCorner.y) * size * 1.25;',
    '    vC = aCorner; vRel = 1.0; vK = smoothstep(0.35, 0.6, age);',
    '  }',
    '  P.y = 0.0004;',
    '  gl_Position = uProj * uView * vec4(P, 1.0);',
    '}'
  ].join('\n');

  var SHADOW_FS = [
    '#version 300 es',
    'precision highp float;',
    'precision highp int;',
    'uniform int uShadowMode; uniform float uScur, uR; uniform vec3 uShadowDir;',
    'in vec2 vC; in float vK; in float vRel;',
    'out vec4 o;',
    'void main() {',
    '  float amt;',
    '  if (uShadowMode == 0) {',
    '    vec2 q = vC + uShadowDir.xz * vRel * 0.42;     // heap-centred floor coords',
    '    float r = length(q) / max(vRel, 1e-3);',
    '    vec2 e = vC / max(vRel, 1e-3);                // shadow-centred',
    '    float castS = exp(-dot(e * vec2(0.82, 1.05), e * vec2(0.82, 1.05)) * 1.6) * 0.17;',
    '    float ring = exp(-pow((r - 1.0) / 0.045, 2.0)) * 0.26 * step(0.94, r);',
    '    float skirt = (1.0 - smoothstep(1.0, 1.45, r)) * 0.07;',
    '    amt = castS + ring + skirt;',
    '  } else {',
    '    amt = exp(-dot(vC, vC) * 3.2) * 0.42 * vK;',
    '  }',
    '  vec3 tint = vec3(0.76, 0.80, 0.83);',
    '  o = vec4(mix(vec3(1.0), tint, clamp(amt, 0.0, 0.85)), 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(sh));
    return sh;
  }
  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
    var u = {};
    var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var info = gl.getActiveUniform(p, i); u[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, info.name); }
    return { p: p, u: u };
  }

  /* ---- The grain atlas: faceted quartz crystals, built once ------------- */
  function buildAtlas() {
    var S = TILE, data = new Uint8Array(S * S * 4 * LAYERS);
    var rnd = GG.rng(1729);
    var Hf = new Float32Array(S * S);
    function smin(a, b, k) { var h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1); return b + (a - b) * h - k * h * (1 - h); }
    for (var L = 0; L < LAYERS; L++) {
      var K = 6 + Math.floor(rnd() * 5);
      var planes = [];
      var rot0 = rnd() * Math.PI * 2;
      for (var k = 0; k < K; k++) {
        var az = rot0 + (k / K) * Math.PI * 2 + (rnd() - 0.5) * 0.7;
        var tilt = (30 + rnd() * 32) * DEG;
        var st = Math.sin(tilt);
        planes.push([Math.cos(az) * st, Math.sin(az) * st, Math.cos(tilt), st * (0.74 + rnd() * 0.2)]);
      }
      var tops = 1 + (rnd() < 0.55 ? 1 : 0);
      for (k = 0; k < tops; k++) {
        var az2 = rnd() * Math.PI * 2, t2 = (4 + rnd() * 16) * DEG;
        planes.push([Math.cos(az2) * Math.sin(t2), Math.sin(az2) * Math.sin(t2), Math.cos(t2), 0.46 + rnd() * 0.22]);
      }
      var sx = 0.84 + rnd() * 0.42, sy = (0.9 + rnd() * 0.14) / sx;
      var ca = Math.cos(rot0), sa = Math.sin(rot0);
      var round = 0.03 + rnd() * 0.05;
      var hmax = 0;
      for (var y = 0; y < S; y++) {
        for (var x = 0; x < S; x++) {
          var u = (x + 0.5 - S / 2) / SPR, v = (y + 0.5 - S / 2) / SPR;
          var uu = (u * ca + v * sa) / sx, vv = (-u * sa + v * ca) / sy;
          var h = 9;
          for (k = 0; k < planes.length; k++) {
            var pl = planes[k];
            h = smin(h, (pl[3] - (pl[0] * uu + pl[1] * vv)) / pl[2], round);
          }
          /* frosted surface: a whisper of value noise */
          h += (Math.sin(uu * 37.1 + L) * Math.sin(vv * 41.3 - L) ) * 0.006;
          Hf[y * S + x] = h;
          if (h > hmax) hmax = h;
        }
      }
      for (y = 0; y < S; y++) {
        for (x = 0; x < S; x++) {
          var i = y * S + x;
          var hc = Hf[i];
          var hx = (Hf[y * S + Math.min(S - 1, x + 1)] - Hf[y * S + Math.max(0, x - 1)]) * 0.5 * SPR;
          var hy = (Hf[Math.min(S - 1, y + 1) * S + x] - Hf[Math.max(0, y - 1) * S + x]) * 0.5 * SPR;
          var nx = -hx, ny = -hy, nz = 1, l = Math.hypot(nx, ny, nz);
          nx /= l; ny /= l; nz /= l;
          var a = smooth(hc, 0, 0.05);
          var ao = clamp(Math.pow(clamp(hc / (hmax * 0.6), 0, 1), 0.5), 0, 1) * 0.5 + 0.5;
          var o = (L * S * S + i) * 4;
          data[o] = Math.round((nx * 0.5 + 0.5) * a * 255);
          data[o + 1] = Math.round((ny * 0.5 + 0.5) * a * 255);
          data[o + 2] = Math.round(ao * a * 255);
          data[o + 3] = Math.round(a * 255);
        }
      }
    }
    return data;
  }

  /* ---- Grain populations --------------------------------------------------- */
  function genHeap(rnd) {
    var slant = Math.hypot(R, H);
    var coverage = 1.65 / (Math.PI * (D / 2) * (D / 2));
    var layerS = D / (R * H / slant);
    var K = coverage * Math.PI * R * slant / layerS;
    var S0 = 0.2, S03 = S0 * S0 * S0;   /* small enough for the opening pour's first heap */
    var N = Math.round(K / 3 * (1 - S03));
    var p = new Float32Array(N * 8), s = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      var si = Math.cbrt(S03 + ((i + rnd()) / N) * (1 - S03));
      s[i] = si;
      var o = i * 8;
      p[o] = rnd() * Math.PI * 2;                       /* angle around the heap */
      p[o + 1] = Math.sqrt(rnd()) * 1.045;               /* position from crown (0) to foot (1) */
      p[o + 2] = si;                                     /* the shell it belongs to */
      p[o + 3] = D * (0.66 + 0.68 * Math.pow(rnd(), 1.35));
      p[o + 4] = Math.floor(rnd() * LAYERS);
      p[o + 5] = rnd() * Math.PI * 2;
      p[o + 6] = rnd();
      p[o + 7] = Math.pow(rnd(), 1.5);                   /* how deep it sits in the surface */
    }
    return { p: p, s: s, n: N, layerS: layerS };
  }
  function genScatter(rnd) {
    var N = 1700, p = new Float32Array(N * 8), s = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      var v = 0.012 + 0.988 * (i + rnd()) / N;
      var si = Math.cbrt(v);
      s[i] = si;
      var e = R * 0.085 * -Math.log(1 - rnd() * 0.985);
      if (rnd() < 0.1) e += R * 0.45 * rnd();
      var o = i * 8;
      p[o] = rnd() * Math.PI * 2;
      p[o + 1] = si * R + D * 0.5 + e;
      p[o + 2] = si;
      p[o + 3] = D * (0.6 + 0.6 * Math.pow(rnd(), 1.4));
      p[o + 4] = Math.floor(rnd() * LAYERS);
      p[o + 5] = rnd() * Math.PI * 2;
      p[o + 6] = rnd();
      p[o + 7] = 0;
    }
    return { p: p, s: s, n: N };
  }
  function upperBound(arr, x) {
    var lo = 0, hi = arr.length;
    while (lo < hi) { var m = (lo + hi) >> 1; if (arr[m] <= x) lo = m + 1; else hi = m; }
    return lo;
  }

  /* ---- The scene ------------------------------------------------------------ */
  function SandScene(canvas, opts) {
    opts = opts || {};
    var gl = canvas.getContext('webgl2', { antialias: true, alpha: false, depth: true, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;

    var grain = program(gl, GRAIN_VS, GRAIN_FS);
    var core = program(gl, CORE_VS, CORE_FS);
    var bg = program(gl, BG_VS, BG_FS);
    var shadow = program(gl, SHADOW_VS, SHADOW_FS);
    var msaa = gl.getParameter(gl.SAMPLES) > 0;

    /* atlas */
    var atlas = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, atlas);
    gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA8, TILE, TILE, LAYERS, 0, gl.RGBA, gl.UNSIGNED_BYTE, buildAtlas());
    gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAX_LEVEL, 5);

    /* quad corners */
    var cornerBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    var rnd = GG.rng(2003);
    var heap = genHeap(rnd);
    var scat = genScatter(rnd);
    var heapAct = new Float32Array(heap.n);
    var scatAct = new Float32Array(scat.n);

    function makeSet(params, act) {
      var pb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pb);
      gl.bufferData(gl.ARRAY_BUFFER, params, gl.STATIC_DRAW);
      var ab = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, ab);
      gl.bufferData(gl.ARRAY_BUFFER, act, gl.DYNAMIC_DRAW);
      var vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      [1, 2, 3].forEach(function (l) { gl.enableVertexAttribArray(l); gl.vertexAttribDivisor(l, 1); });
      gl.bindVertexArray(null);
      return { pb: pb, ab: ab, vao: vao };
    }
    function bindRange(set, start) {
      gl.bindVertexArray(set.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, set.pb);
      gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, start * 32);
      gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 32, start * 32 + 16);
      gl.bindBuffer(gl.ARRAY_BUFFER, set.ab);
      gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 4, start * 4);
    }
    var heapSet = makeSet(heap.p, heapAct);
    var scatSet = makeSet(scat.p, scatAct);

    /* falling and bouncing grains */
    var dynData = new Float32Array(MAXDYN * 12);
    var dynBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dynBuf);
    gl.bufferData(gl.ARRAY_BUFFER, dynData.byteLength, gl.DYNAMIC_DRAW);
    var dynVAO = gl.createVertexArray();
    gl.bindVertexArray(dynVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, dynBuf);
    for (var l = 1; l <= 3; l++) {
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, 4, gl.FLOAT, false, 48, (l - 1) * 16);
      gl.vertexAttribDivisor(l, 1);
    }
    gl.bindVertexArray(null);

    /* the heap core: a cone just under the grain shell, seen through gaps */
    var NA = 120, NT = 32, coreV = [], coreI = [];
    for (var a = 0; a <= NA; a++) {
      for (var t = 0; t <= NT; t++) coreV.push(-Math.PI + (a / NA) * Math.PI * 2, Math.pow(t / NT, 1.15) * 1.03);
    }
    for (a = 0; a < NA; a++) {
      for (t = 0; t < NT; t++) {
        var i0 = a * (NT + 1) + t, i1 = (a + 1) * (NT + 1) + t;
        coreI.push(i0, i1, i0 + 1, i1, i1 + 1, i0 + 1);
      }
    }
    var coreVAO = gl.createVertexArray();
    gl.bindVertexArray(coreVAO);
    var cvb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cvb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coreV), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var cib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(coreI), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    var coreCount = coreI.length;

    var shadowVAO = gl.createVertexArray();
    gl.bindVertexArray(shadowVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    var bgVAO = gl.createVertexArray();

    /* ---- camera, light and timing ------------------------------------------ */
    var W = 1, Hpx = 1, dpr = 1, maxDpr = Math.min(1.5, window.devicePixelRatio || 1);
    var proj, view, focus = 6, cocPx = 50, floorY = 0.86, lightV, fillV, yTop = 2.5;
    var lightW = [-0.62, 0.72, 0.5], fillW = [0.85, 0.15, 0.45];
    var shadowDir = (function () { var x = -lightW[0], z = -lightW[2] * 0.6, l = Math.hypot(x, z); return [x / l, 0, z / l]; })();
    var t0 = performance.now();
    function now() { return (performance.now() - t0) / 1000 + 10; }
    var framing = 0.34;

    function camera() {
      var aspect = W / Hpx;
      var fov = 19 * DEG;
      var elev = 13 * DEG;
      var tanX = Math.tan(fov / 2) * aspect;
      /* size the final heap: about 62% of the width, or the height share asked for */
      var dist = R / ((aspect < 1 ? 0.84 : 0.56) * tanX);   /* portrait screens: a wider heap */
      var distH = (H * 1.18) / (framing * 2 * Math.tan(fov / 2));
      dist = Math.max(dist, distH);
      var target = [0, H * 0.42, 0];
      function place() {
        for (var it = 0; it < 3; it++) {
          var eye = [0, target[1] + Math.sin(elev) * dist, Math.cos(elev) * dist];
          proj = perspective(fov, aspect, 0.4, 40);
          view = lookAt(eye, target, [0, 1, 0]);
          var c = mulVec(view, 0, 0, R);
          var cc = mulVec(proj, c[0], c[1], c[2]);
          var sy = 0.5 - (cc[1] / cc[3]) * 0.5;    /* screen y of the heap's front foot, 0 top */
          target[1] -= (sy - 0.9) * 2 * Math.tan(fov / 2) * dist;
        }
      }
      function crownY() {
        var c = mulVec(view, 0, H, 0);
        var cc = mulVec(proj, c[0], c[1], c[2]);
        return 0.5 - (cc[1] / cc[3]) * 0.5;
      }
      place();
      /* keep the finished crown below the middle of the screen, clear of the headline and buttons */
      for (var guard = 0; guard < 12 && crownY() < 0.54; guard++) { dist *= 1.05; place(); }
      var fc = mulVec(view, 0, H * 0.3, R * 0.62);
      focus = -fc[2];
      cocPx = 62 * (Hpx / 900);
      lightV = rotVec(view, lightW[0], lightW[1], lightW[2]);
      fillV = rotVec(view, fillW[0], fillW[1], fillW[2]);
      var foot = mulVec(view, 0, 0, R);
      var fp = mulVec(proj, foot[0], foot[1], foot[2]);
      floorY = 0.5 - (fp[1] / fp[3]) * 0.5;
      /* the height that sits just above the top of the screen, for the stream */
      var ct = mulVec(view, 0, 0, 0);
      var z = -ct[2];
      yTop = target[1] + Math.tan(fov / 2) * z * 1.05;
    }

    function resize() {
      dpr = maxDpr;
      W = Math.max(1, canvas.clientWidth);
      Hpx = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(Hpx * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      camera();
    }

    var kHeap = 0, kScat = 0, fadeHeapHi = 0, fadeScatHi = 0, fadeUntil = 0, busyUntil = 0;
    var first = true;
    /* While the heap grows, new grains take up to ~1.25 s to roll from the crown to
       their place. The core and the visible grain layers follow the smallest size of
       that window, so the surface is always covered while fresh sand avalanches over it. */
    var SETTLE = 1.3, hist = [];
    function settledS(tNow, sCur) {
      hist.push(tNow, sCur);
      while (hist.length > 2 && hist[0] < tNow - SETTLE) hist.splice(0, 2);
      var m = sCur;
      for (var i = 1; i < hist.length; i += 2) if (hist[i] < m) m = hist[i];
      return m;
    }
    function activate(sCur, tNow, instant) {
      var k = upperBound(heap.s, sCur);
      if (k > kHeap) {
        for (var i = kHeap; i < k; i++) heapAct[i] = instant ? 1 : tNow + rnd() * 0.16;
        gl.bindBuffer(gl.ARRAY_BUFFER, heapSet.ab);
        gl.bufferSubData(gl.ARRAY_BUFFER, kHeap * 4, heapAct.subarray(kHeap, k));
        busyUntil = Math.max(busyUntil, tNow + 1.3);
      } else if (k < kHeap) {
        for (i = k; i < kHeap; i++) heapAct[i] = instant ? 0 : -tNow;
        gl.bindBuffer(gl.ARRAY_BUFFER, heapSet.ab);
        gl.bufferSubData(gl.ARRAY_BUFFER, k * 4, heapAct.subarray(k, kHeap));
        fadeHeapHi = Math.max(fadeHeapHi, kHeap);
        fadeUntil = tNow + 0.25;
      }
      kHeap = k;
      var ks = upperBound(scat.s, sCur);
      if (ks > kScat) {
        for (i = kScat; i < ks; i++) scatAct[i] = instant ? 1 : tNow + rnd() * 0.2;
        gl.bindBuffer(gl.ARRAY_BUFFER, scatSet.ab);
        gl.bufferSubData(gl.ARRAY_BUFFER, kScat * 4, scatAct.subarray(kScat, ks));
        busyUntil = Math.max(busyUntil, tNow + 1.0);
      } else if (ks < kScat) {
        for (i = ks; i < kScat; i++) scatAct[i] = instant ? 0 : -tNow;
        gl.bindBuffer(gl.ARRAY_BUFFER, scatSet.ab);
        gl.bufferSubData(gl.ARRAY_BUFFER, ks * 4, scatAct.subarray(ks, kScat));
        fadeScatHi = Math.max(fadeScatHi, kScat);
        fadeUntil = tNow + 0.25;
      }
      kScat = ks;
    }

    /* ---- the stream and its bounces (real time) ----------------------------- */
    var dyn = [];
    var spawnAcc = 0;
    function spawn(sCur, flow) {
      /* a valve opening wider gives a wider stream */
      var r = Math.sqrt(rnd()) * 0.06 * (0.45 + 0.55 * flow), a = rnd() * Math.PI * 2;
      dyn.push({
        x: Math.cos(a) * r, y: yTop + rnd() * 0.25, z: Math.sin(a) * r,
        vx: (rnd() - 0.5) * 0.06, vy: -(0.6 + rnd() * 0.5), vz: (rnd() - 0.5) * 0.06,
        size: D * (0.78 + 0.8 * Math.pow(rnd(), 1.3)), layer: Math.floor(rnd() * LAYERS),
        rot: rnd() * 6.283, spin: (rnd() - 0.5) * 16, seed: rnd(), alpha: 1, bounce: false, age: 0, life: 0
      });
    }
    function simulate(dt, sCur, sSet, flow) {
      var G = 2 * Math.max(0.3, (yTop - H * sCur) - V0 * FALL_TIME) / (FALL_TIME * FALL_TIME);
      spawnAcc += dt * 760 * flow;
      if (flow <= 0) spawnAcc = 0;
      while (spawnAcc >= 1) { spawnAcc -= 1; if (dyn.length < MAXDYN) spawn(sCur, flow); }
      for (var i = dyn.length - 1; i >= 0; i--) {
        var g = dyn[i];
        g.age += dt;
        g.vy -= G * dt;
        if (!g.bounce) {
          /* a widening stream: a little sideways wander as it falls */
          g.vx += (rnd() - 0.5) * 0.9 * dt;
          g.vz += (rnd() - 0.5) * 0.9 * dt;
        }
        g.x += g.vx * dt; g.y += g.vy * dt; g.z += g.vz * dt;
        g.rot += g.spin * dt;
        var r = Math.hypot(g.x, g.z);
        var ySurf = surfaceY((sCur + sSet) * 0.5, r) + g.size * 0.42;
        if (g.y <= ySurf) {
          g.y = ySurf;
          if (!g.bounce) {
            if (rnd() < 0.4) {
              g.bounce = true;
              var ang = rnd() * Math.PI * 2, out = 0.25 + rnd() * 0.75;
              g.vx = Math.cos(ang) * out; g.vz = Math.sin(ang) * out;
              g.vy = 0.25 + rnd() * 0.55;
              g.spin = (rnd() - 0.5) * 22;
              g.life = 0.35 + rnd() * 0.45;
              g.age = 0;
            } else { dyn.splice(i, 1); continue; }
          } else {
            var onHeap = r < R * sCur * 0.98;
            if (g.vy < 0) g.vy = -g.vy * 0.22;
            if (g.vy < 0.05) g.vy = 0;                     /* no micro-bouncing at rest */
            var fr = Math.pow(onHeap ? 0.4 : 0.0008, dt);  /* rolling friction per second: slope vs floor */
            g.vx *= fr; g.vz *= fr;
            if (!onHeap && g.vx * g.vx + g.vz * g.vz < 0.0025) g.life = Math.min(g.life, g.age);   /* at rest: fade out */
            if (onHeap && r > 1e-4) {
              /* gravity along the slope pulls it outward and down */
              var acc = G * Math.sin(REPOSE) * Math.cos(REPOSE) * 0.55 * dt;
              g.vx += g.x / r * acc; g.vz += g.z / r * acc;
            }
          }
        }
        if (g.bounce && g.age > g.life) {
          g.alpha -= dt / 0.22;
          if (g.alpha <= 0) { dyn.splice(i, 1); continue; }
        }
      }
    }
    function packDyn() {
      /* back to front, so the soft grains blend correctly */
      var vz2 = view[2], vz6 = view[6], vz10 = view[10];
      for (var i = 0; i < dyn.length; i++) { var g = dyn[i]; g.d = vz2 * g.x + vz6 * g.y + vz10 * g.z; }
      dyn.sort(function (a, b) { return a.d - b.d; });
      for (i = 0; i < dyn.length; i++) {
        var q = dyn[i], o = i * 12;
        dynData[o] = q.x; dynData[o + 1] = q.y; dynData[o + 2] = q.z; dynData[o + 3] = q.size;
        dynData[o + 4] = q.vx; dynData[o + 5] = q.vy; dynData[o + 6] = q.vz; dynData[o + 7] = q.layer;
        dynData[o + 8] = q.rot; dynData[o + 9] = q.seed; dynData[o + 10] = Math.max(0, q.alpha); dynData[o + 11] = 0;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, dynBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, dynData.subarray(0, dyn.length * 12));
    }

    /* ---- drawing ---------------------------------------------------------------- */
    function setCommon(prog, sCur, tNow) {
      var u = prog.u;
      if (u.uProj) gl.uniformMatrix4fv(u.uProj, false, proj);
      if (u.uView) gl.uniformMatrix4fv(u.uView, false, view);
      if (u.uViewport) gl.uniform2f(u.uViewport, canvas.width, canvas.height);
      if (u.uTime) gl.uniform1f(u.uTime, tNow);
      if (u.uScur) gl.uniform1f(u.uScur, sCur);
      if (u.uR) gl.uniform1f(u.uR, R);
      if (u.uH) gl.uniform1f(u.uH, H);
      if (u.uD) gl.uniform1f(u.uD, D);
      if (u.uLight) gl.uniform3fv(u.uLight, lightV);
    }

    function render(sCur, sSet, tNow, withDyn) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0.93, 0.945, 0.937, 1);
      gl.clearDepth(1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      /* 1. the studio backdrop */
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.useProgram(bg.p);
      gl.uniform2f(bg.u.uViewport, canvas.width, canvas.height);
      gl.uniform1f(bg.u.uFloorY, floorY);
      gl.bindVertexArray(bgVAO);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      /* 2. shadows, multiplied onto the floor */
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.DST_COLOR, gl.ZERO);
      gl.useProgram(shadow.p);
      setCommon(shadow, sSet, tNow);
      gl.uniform3fv(shadow.u.uShadowDir, shadowDir);
      gl.uniform1i(shadow.u.uShadowMode, 0);
      gl.bindVertexArray(shadowVAO);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.uniform1i(shadow.u.uShadowMode, 1);
      var scatHi = Math.max(kScat, tNow < fadeUntil ? fadeScatHi : 0);
      if (scatHi > 0) { bindRange(scatSet, 0); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, scatHi); }

      /* 3. the heap core */
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.useProgram(core.p);
      setCommon(core, sSet, tNow);
      gl.bindVertexArray(coreVAO);
      gl.drawElements(gl.TRIANGLES, coreCount, gl.UNSIGNED_SHORT, 0);

      /* 4. heap and floor grains: sharp edges via alpha to coverage */
      gl.useProgram(grain.p);
      setCommon(grain, sCur, tNow);
      gl.uniform3fv(grain.u.uFill, fillV);
      gl.uniform1f(grain.u.uFocus, focus);
      gl.uniform1f(grain.u.uCoc, cocPx * dpr);
      gl.uniform1f(grain.u.uShutter, 1 / 85);
      gl.uniform1f(grain.u.uPx, canvas.height);
      gl.uniform1i(grain.u.uNoMSAA, msaa ? 0 : 1);
      gl.uniform1i(grain.u.uAtlas, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, atlas);
      gl.uniform1i(grain.u.uBlend, 0);
      gl.uniform1i(grain.u.uTaps, 1);
      gl.uniform1f(grain.u.uTopFade, 0);
      if (msaa) gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
      var heapHi = Math.max(kHeap, tNow < fadeUntil ? fadeHeapHi : 0);
      var heapLo = upperBound(heap.s, sSet - heap.layerS * WINDOW);
      if (heapHi > heapLo) {
        gl.uniform1f(grain.u.uCocScale, 0.3);
        gl.uniform1i(grain.u.uMode, 0);
        bindRange(heapSet, heapLo);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, heapHi - heapLo);
      }
      if (scatHi > 0) {
        gl.uniform1f(grain.u.uCocScale, 0.45);
        gl.uniform1i(grain.u.uMode, 1);
        bindRange(scatSet, 0);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, scatHi);
      }
      gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);

      /* 5. the stream and its bounces: soft, motion blurred, blended back to front */
      if (withDyn && dyn.length) {
        packDyn();
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
        gl.uniform1f(grain.u.uCocScale, 0.85);
        gl.uniform1i(grain.u.uMode, 2);
        gl.uniform1i(grain.u.uBlend, 1);
        gl.uniform1i(grain.u.uTaps, 7);
        gl.uniform1f(grain.u.uTopFade, 165 * dpr);
        gl.bindVertexArray(dynVAO);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dyn.length);
        gl.depthMask(true);
      }
      gl.bindVertexArray(null);
    }

    /* ---- adaptive quality: drop resolution if frames run long --------------- */
    var slow = 0;
    function watch(dt) {
      if (dt > 0.026) slow++; else slow = Math.max(0, slow - 1);
      if (slow > 24 && maxDpr > 1) { maxDpr = 1; slow = 0; resize(); }
    }

    var lost = false;
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      lost = true;
      if (opts.onLost) opts.onLost();
    });

    return {
      kind: 'webgl',
      resize: resize,
      frame: function (v, flow, dt) {
        if (lost) return;
        var tNow = now();
        var sCur = Math.cbrt(v);
        activate(sCur, tNow, first);
        first = false;
        var sSet = settledS(tNow, sCur);
        simulate(Math.min(dt, 0.05), sCur, sSet, flow);
        render(sCur, sSet, tNow, true);
        watch(dt);
      },
      still: function (hf) {
        if (lost) return;
        framing = hf || 0.27;
        resize();
        dyn.length = 0;
        var tNow = now();
        kHeap = 0; kScat = 0;
        heapAct.fill(0); scatAct.fill(0);
        activate(1, tNow, true);
        hist.length = 0;
        render(1, 1, tNow, false);
        framing = 0.34;
      },
      alive: function () { return dyn.length > 0 || now() < busyUntil || now() < fadeUntil || (hist.length > 2 && hist[1] < hist[hist.length - 1] - 1e-6); },
      stats: function () { return { falling: dyn.length }; }
    };
  }

  SandScene.supported = function () {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
    } catch (e) { return false; }
  };
  GG.SandScene = SandScene;
})();
