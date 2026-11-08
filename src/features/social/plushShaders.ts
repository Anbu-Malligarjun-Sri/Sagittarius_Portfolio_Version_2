// GLSL for the plush tile. The strand shape is evaluated entirely on the GPU from per-hair attributes.

export const HAIR_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uBreeze;
uniform float uGrow;
uniform float uPuff;
uniform float uClump;
uniform float uPx;       // world units per device pixel at the tile plane
uniform float uRadius;
uniform vec2  uMouse;    // pointer in tile space
uniform float uPart;     // how hard the pointer is parting the fur (0..1.5)

attribute vec2 iRoot;
attribute vec3 iColor;
attribute vec4 iData;    // length, comb angle, random A, random B
attribute vec2 iClump;

varying vec3  vColor;
varying float vT;
varying vec3  vTan;
varying float vRand;
varying float vRim;

float tileSdf(vec2 p) {
  vec2 q = abs(p) - vec2(1.0 - uRadius);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
}

// Cushion profile: flat at the edge, rising to uPuff over the bevel.
float dome(float s) {
  float k = clamp(s / 0.42, 0.0, 1.0);
  return uPuff * (1.0 - (1.0 - k) * (1.0 - k));
}

vec3 gRoot; vec3 gN; vec3 gComb; vec3 gPerp;
float gLen; float gR1; float gR2; float gLean;

vec3 strandPos(float t) {
  // Combed pile: the hair rises a little off the surface, then lies down along the comb direction.
  float rise = mix(0.34, 0.12, gLean);
  vec3 p = gRoot + gN * (gLen * (rise * t - 0.14 * t * t)) + gComb * (gLen * t * (0.95 + 0.25 * (gR2 - 0.5)));

  // Frizz: a little sideways wander that grows toward the tip.
  p += gPerp * gLen * (0.34 * (gR2 - 0.5) * t * t + 0.07 * sin(t * 4.0 + gR1 * 20.0) * t);

  // Tuft: tips lean toward their clump centre, opening dark partings between tufts.
  p.xy += iClump * uClump * t * t;

  // Breeze: slow drift of the tips.
  p.xy += vec2(
    sin(uTime * 1.7 + gR1 * 6.2831 + gRoot.x * 2.0),
    cos(uTime * 1.3 + gR2 * 6.2831 + gRoot.y * 2.0)
  ) * 0.011 * uBreeze * t * t;

  // Pointer: hairs fall away from it and lie down, parting the pile.
  vec2 dm = gRoot.xy - uMouse;
  float d = length(dm);
  float f = exp(-d * d / (2.0 * 0.3 * 0.3)) * uPart;
  vec2 dir = d > 1e-4 ? dm / d : vec2(1.0, 0.0);
  p.xy += dir * f * (0.2 * t * t + 0.09 * t);
  p.z *= 1.0 - 0.6 * f * t;
  return p;
}

void main() {
  float side = position.x;
  float t = position.y;

  vec2 root = iRoot;
  float sd = tileSdf(root);
  float s = -sd;

  vec2 e = vec2(0.01, 0.0);
  vec2 g = vec2(tileSdf(root + e.xy) - tileSdf(root - e.xy), tileSdf(root + e.yx) - tileSdf(root - e.yx)) / (2.0 * e.x);
  float dS = (s > 0.0 && s < 0.42) ? uPuff * 2.0 * (1.0 - s / 0.42) / 0.42 : 0.0;

  gN = normalize(vec3(dS * g, 1.0));
  gRoot = vec3(root, dome(max(s, 0.0)));

  vec3 c = vec3(cos(iData.y), sin(iData.y), 0.0);
  gComb = normalize(c - gN * dot(c, gN));
  gPerp = normalize(cross(gN, gComb));
  gR1 = iData.z;
  gR2 = iData.w;

  float outside = smoothstep(0.0, 0.05, sd);
  gLean = outside;
  float grow = smoothstep(0.0, 1.0, clamp(uGrow * 1.7 - gR1 * 0.7, 0.0, 1.0));
  gLen = iData.x * (1.0 - 0.45 * outside) * grow;

  vec3 p = strandPos(t);
  vec3 pn = strandPos(min(t + 0.06, 1.06));
  vec3 tangent = normalize(pn - p + vec3(0.0, 0.0, 1e-5));

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec3 vt = normalize((modelViewMatrix * vec4(tangent, 0.0)).xyz);
  vec2 sideDir = normalize(vec2(-vt.y, vt.x) + vec2(1e-5));
  float w = uPx * 1.5 * (1.0 - 0.7 * t);
  mv.xy += sideDir * w * 0.5 * side;
  gl_Position = projectionMatrix * mv;

  vColor = iColor;
  vT = t;
  vTan = tangent;
  vRand = gR1;
  vRim = smoothstep(-0.28, 0.06, sd);
}
`;

// Kajiya-Kay strand shading: a top softbox, a warm floor bounce and a backlit rim, over dark roots.
export const HAIR_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3  vColor;
varying float vT;
varying vec3  vTan;
varying float vRand;
varying float vRim;

float sinTL(vec3 T, vec3 L) { return sqrt(max(0.0, 1.0 - pow(dot(T, L), 2.0))); }

void main() {
  vec3 T = normalize(vTan);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 albedo = pow(vColor, vec3(2.2));

  vec3 L1 = normalize(vec3(0.05, 0.8, 0.6));   // top softbox
  vec3 L2 = normalize(vec3(0.0, -0.7, 0.45));  // warm floor bounce
  vec3 L3 = normalize(vec3(0.0, 0.25, -1.0));  // backlight

  float d1 = sinTL(T, L1);
  float d2 = sinTL(T, L2);
  float spec = pow(sinTL(T, normalize(L1 + V)), 90.0);
  float rimSpec = pow(sinTL(T, normalize(L3 + V)), 24.0);

  float ao = mix(0.10, 1.0, pow(vT, 0.65));      // dark undercoat at the roots
  float tint = 0.86 + 0.28 * vRand;

  vec3 col = albedo * (0.10 + 0.95 * d1 * vec3(1.0, 0.97, 0.92) + 0.28 * d2 * vec3(1.0, 0.72, 0.5)) * ao * tint;
  col += vec3(1.0, 0.97, 0.9) * spec * 0.26 * ao;
  col += (albedo * 0.7 + vec3(0.5, 0.58, 0.7) * 0.3) * rimSpec * vRim * 0.55 * vT;

  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}
`;

// The dark undercoat under the pile, so partings read as depth.
export const BASE_VERTEX = /* glsl */ `
varying vec2 vP;
void main() {
  vP = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const BASE_FRAGMENT = /* glsl */ `
precision highp float;
uniform sampler2D uArt;
uniform vec3 uFur;
uniform float uRadius;
varying vec2 vP;

float tileSdf(vec2 p) {
  vec2 q = abs(p) - vec2(1.0 - uRadius);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
}

void main() {
  if (tileSdf(vP) > 0.0) discard;
  vec4 art = texture2D(uArt, vec2(vP.x * 0.5 + 0.5, vP.y * 0.5 + 0.5));
  vec3 dye = mix(uFur, art.rgb, art.a);
  gl_FragColor = vec4(0.018 + dye * 0.07, 1.0);
}
`;
