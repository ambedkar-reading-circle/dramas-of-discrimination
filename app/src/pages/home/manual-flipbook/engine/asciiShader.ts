// Original GLSL: a procedural two-color field quantized into a Handlee glyph
// atlas. Inspired by the public Paper Shaders dithering preview, not its code.
export const asciiVertexShader = `#version 300 es
void main() {
  vec2 position = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}`

export const asciiFragmentShader = `#version 300 es
precision highp float;
uniform sampler2D u_atlas;
uniform vec2 u_resolution;
uniform vec2 u_grid;
uniform vec2 u_pointer;
uniform vec3 u_front;
uniform vec3 u_back;
uniform float u_time;
uniform float u_seed;
uniform float u_strength;
uniform float u_phase;
uniform int u_pattern;
out vec4 outColor;

// Mirrors patternDensity in asciiPatterns.ts for the animated 2D fallback.
float patternDensity(vec2 p, float t) {
  float wave;
  if (u_pattern == 0) {
    wave = sin(p.x * 9.0 + 2.0 * sin(p.y * 4.0 + t) + sin(p.x * 4.0 - p.y * 3.0 - t * 0.6));
  } else if (u_pattern == 1) {
    wave = sin(p.x * 5.0 + p.y * 3.0 + 3.0 * sin(p.y * 3.0 + sin(p.x * 3.0 + t * 0.4)) + t * 0.7);
  } else if (u_pattern == 2) {
    wave = sin(p.x * 16.0 + sin(p.y * 7.0 + t)) * cos(p.y * 13.0 + sin(p.x * 5.0 - t * 0.8));
  } else if (u_pattern == 3) {
    wave = sin(p.y * 13.0 + sin(p.x * 5.0 + t) + 0.7 * sin(p.x * 11.0 - p.y * 3.0 - t * 0.6));
  } else {
    wave = sin(p.x * 10.0 + p.y * 8.0 + t * 0.5 + 2.0 * sin(p.x * 4.0 - p.y * 5.0 - t * 0.7)) * cos(p.x * 7.0 - p.y * 9.0 + sin(p.y * 4.0 + t));
  }
  return 0.58 + 0.5 * wave;
}

void main() {
  vec2 uv = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_resolution;
  vec2 cell = floor(uv * u_grid);
  vec2 center = (cell + 0.5) / u_grid;
  float aspect = u_resolution.x / u_resolution.y;
  float t = u_time * 0.35 + u_seed + u_phase * 2.3;
  vec2 p = (center - 0.5) * vec2(aspect, 1.0) * 3.0;
  p.x += sin(p.y * 2.0 + t) * 0.18;
  p.y += cos(p.x * 1.7 - t * 0.7) * 0.18;
  float distanceToPointer = length((center - u_pointer) * vec2(aspect, 1.0) * 3.0);
  float ripple = exp(-distanceToPointer * distanceToPointer * 2.0)
    * cos(distanceToPointer * 15.0 - t * 3.0) * u_strength * 0.35;
  float density = clamp(patternDensity(p, t) + ripple, 0.0, 0.999);
  float glyph = floor(density * 8.0);
  vec2 local = fract(uv * u_grid);
  float ink = texture(u_atlas, vec2((glyph + local.x) / 8.0, 1.0 - local.y)).a;
  outColor = vec4(mix(u_back, u_front, ink), 1.0);
}`
