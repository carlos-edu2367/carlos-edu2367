export const PARTICLE_VERTEX_SHADER = /* glsl */ `
attribute float aScale;
attribute float aPhase;
attribute float aSpeed;

uniform float uTime;
uniform float uPixelRatio;
uniform float uPulse;
uniform float uKonami;
uniform vec3 uCursorWorld;

varying float vHeat;
varying float vAlpha;

void main() {
  vec3 pos = position;

  float speedMult = 1.0 + uKonami * 1.65;
  float angle = uTime * aSpeed * 0.22 * speedMult + aPhase;
  float ca = cos(angle);
  float sa = sin(angle);

  vec2 rotatedXZ = mat2(ca, -sa, sa, ca) * pos.xz;
  pos.x = rotatedXZ.x;
  pos.z = rotatedXZ.y;
  pos.y += sin(uTime * 0.7 * speedMult + aPhase * 2.0) * 0.18;

  vec3 toParticle = pos - uCursorWorld;
  float distCursor = length(toParticle);
  float repelRadius = 2.15;
  float repelFactor = smoothstep(repelRadius, 0.05, distCursor);
  vec3 repelDir = distCursor > 0.001 ? normalize(toParticle) : vec3(0.0, 1.0, 0.0);
  pos += repelDir * repelFactor * 0.95;

  float coreDist = length(pos);
  vec3 radialDir = coreDist > 0.001 ? pos / coreDist : vec3(0.0, 1.0, 0.0);
  pos += radialDir * uPulse * (0.65 / (0.6 + coreDist * 0.45));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float sizeBoost = 1.0 + repelFactor * 1.1 + uPulse * 0.7;
  gl_PointSize = clamp((24.0 * aScale * sizeBoost * uPixelRatio) / max(-mvPosition.z, 0.8), 1.5, 42.0);

  vHeat = clamp(repelFactor * 0.85 + uPulse * 0.55 + fract(aPhase * 0.37) * 0.35 + uKonami * 0.3, 0.0, 1.0);
  vAlpha = smoothstep(7.8, 1.4, coreDist) * (0.55 + 0.45 * sin(uTime * 1.6 + aPhase * 3.1));
}
`;

export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
uniform float uKonami;

varying float vHeat;
varying float vAlpha;

void main() {
  vec2 centered = gl_PointCoord - vec2(0.5);
  float d = length(centered);
  if (d > 0.5) {
    discard;
  }

  float softGlow = pow(1.0 - d * 2.0, 2.2);
  float coreDot = smoothstep(0.22, 0.02, d);

  vec3 crimson = vec3(0.88, 0.08, 0.22);
  vec3 electricRed = vec3(1.0, 0.15, 0.28);
  vec3 hotPink = vec3(1.0, 0.42, 0.54);
  vec3 sparkWhite = vec3(1.0, 0.92, 0.94);
  vec3 arcadeCyan = vec3(0.25, 0.95, 1.0);

  vec3 col = mix(crimson, electricRed, vHeat);
  col = mix(col, hotPink, vHeat * 0.7);
  if (uKonami > 0.5) {
    col = mix(col, arcadeCyan, step(0.72, vHeat) * 0.65);
  }
  col = mix(col, sparkWhite, coreDot * (0.45 + vHeat * 0.45));

  float alpha = softGlow * vAlpha * 0.92;
  gl_FragColor = vec4(col * (1.25 + vHeat * 0.8), alpha);
}
`;
