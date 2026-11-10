export const CORE_VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uDistort;
uniform float uPulse;
uniform float uKonami;
uniform vec2 uPointer;

varying vec3 vNormalW;
varying vec3 vWorldPos;
varying float vDisplacement;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float displaceAt(vec3 dir) {
  float t = uTime * (0.48 + uKonami * 0.65);
  float n1 = snoise(dir * 1.55 + vec3(t, -t * 0.7, t * 0.4));
  float n2 = snoise(dir * 3.2 - vec3(t * 1.2, t * 0.8, -t)) * 0.38;
  float ripple = sin(dir.y * 10.0 - uTime * 9.0) * uPulse * 0.24;
  float raw = (n1 + n2) * uDistort + ripple + uPulse * 0.14;
  if (uKonami > 0.5) {
    raw = floor(raw * 14.0) / 14.0 + sin(dir.y * 24.0 + uTime * 16.0) * 0.025;
  }
  return raw;
}

void main() {
  vUv = uv;
  vec3 n = normalize(normal);
  float d0 = displaceAt(n);
  vDisplacement = d0;

  vec3 up = abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(cross(up, n));
  vec3 bitangent = cross(n, tangent);
  float eps = 0.035;

  vec3 p0 = position + n * d0;
  vec3 n1 = normalize(n + tangent * eps);
  vec3 n2 = normalize(n + bitangent * eps);
  vec3 p1 = (position + tangent * eps) + n1 * displaceAt(n1);
  vec3 p2 = (position + bitangent * eps) + n2 * displaceAt(n2);

  vec3 displacedNormal = normalize(cross(p1 - p0, p2 - p0));
  if (dot(displacedNormal, n) < 0.0) {
    displacedNormal = -displacedNormal;
  }

  vec4 worldPos = modelMatrix * vec4(p0, 1.0);
  vWorldPos = worldPos.xyz;
  vNormalW = normalize(mat3(modelMatrix) * displacedNormal);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const CORE_FRAGMENT_SHADER = /* glsl */ `
uniform float uTime;
uniform float uPulse;
uniform float uKonami;

varying vec3 vNormalW;
varying vec3 vWorldPos;
varying float vDisplacement;
varying vec2 vUv;

void main() {
  vec3 N = normalize(vNormalW);
  if (uKonami > 0.5) {
    vec3 flatN = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
    N = normalize(mix(N, flatN, 0.55));
  }

  vec3 V = normalize(cameraPosition - vWorldPos);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);

  vec3 keyDir = normalize(vec3(2.4, 2.8, 3.2));
  vec3 rimDir = normalize(vec3(-3.0, -1.4, 1.5));

  float diffKey = max(dot(N, keyDir), 0.0);
  float diffRim = max(dot(N, rimDir), 0.0);

  vec3 H1 = normalize(keyDir + V);
  vec3 H2 = normalize(rimDir + V);
  float spec1 = pow(max(dot(N, H1), 0.0), 72.0);
  float spec2 = pow(max(dot(N, H2), 0.0), 28.0);

  vec3 obsidian = vec3(0.035, 0.008, 0.022);
  vec3 blood = vec3(0.498, 0.114, 0.114);
  vec3 crimson = vec3(1.0, 0.122, 0.239);
  vec3 hot = vec3(1.0, 0.302, 0.427);
  vec3 cyber = vec3(0.15, 0.92, 1.0);

  float dispBand = smoothstep(-0.28, 0.35, vDisplacement);
  vec3 base = mix(obsidian, blood, dispBand * 0.72 + diffKey * 0.45);
  base += crimson * (diffRim * 0.42 + dispBand * 0.22);

  vec3 rimGlow = mix(crimson, hot, fresnel) * fresnel * (1.85 + uPulse * 1.4);
  if (uKonami > 0.5) {
    float scan = sin(vWorldPos.y * 34.0 - uTime * 14.0) * 0.5 + 0.5;
    rimGlow = mix(rimGlow * 1.35, cyber * 1.6, scan * 0.38 * fresnel);
  }

  vec3 specColor = mix(hot, vec3(1.0, 0.92, 0.94), 0.65) * spec1 * 1.45;
  specColor += crimson * spec2 * 0.55;

  float scanline = sin(vWorldPos.y * 48.0 + uTime * 2.5) * 0.035;
  vec3 finalColor = base + rimGlow + specColor + crimson * uPulse * 0.45 + scanline;

  gl_FragColor = vec4(finalColor, 0.96);
}
`;
