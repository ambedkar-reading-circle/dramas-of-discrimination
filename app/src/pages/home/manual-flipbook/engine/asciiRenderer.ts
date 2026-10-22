import { asciiDensity, asciiGlyphs } from './asciiField'
import type { AsciiInput } from './asciiField'
import { asciiVariants } from './asciiPatterns'
import type { AsciiVariant } from './asciiPatterns'
import { asciiFragmentShader, asciiVertexShader } from './asciiShader'

export interface AsciiRenderer {
  kind: 'webgl' | '2d'
  draw: (time: number, input: AsciiInput) => void
  colors: () => void
  dispose: () => void
}

const rgb = (color: string) =>
  (color.match(/[\d.]+/g) ?? ['0', '0', '0'])
    .slice(0, 3)
    .map((channel) => Number(channel) / 255)

export function createAsciiRenderer(
  canvas: HTMLCanvasElement,
  seed: number,
  variant: AsciiVariant,
): AsciiRenderer | null {
  const style = getComputedStyle(canvas)
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (!width || !height) return null
  canvas.width = Math.round(width * ratio)
  canvas.height = Math.round(height * ratio)
  const columns = Math.max(24, Math.min(64, Math.round(width / 9)))
  const rows = Math.round(((columns * height) / width) * 0.72)
  const atlas = document.createElement('canvas')
  atlas.width = 32 * asciiGlyphs.length
  atlas.height = 32
  const ink = atlas.getContext('2d')
  if (!ink) return null
  ink.font = `26px ${style.fontFamily}`
  ink.fillStyle = 'white'
  ink.textAlign = 'center'
  ink.textBaseline = 'middle'
  for (const [index, glyph] of [...asciiGlyphs].entries())
    ink.fillText(glyph, index * 32 + 16, 17)

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    preserveDrawingBuffer: true,
  })
  if (gl) {
    const program = gl.createProgram()
    const texture = gl.createTexture()
    const shaders: WebGLShader[] = []
    const dispose = () => {
      shaders.forEach((shader) => gl.deleteShader(shader))
      gl.deleteTexture(texture)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    try {
      for (const [type, source] of [
        [gl.VERTEX_SHADER, asciiVertexShader],
        [gl.FRAGMENT_SHADER, asciiFragmentShader],
      ] as const) {
        const shader = gl.createShader(type)
        if (!shader) throw new Error('No shader')
        shaders.push(shader)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
          throw new Error('Shader compilation failed')
        gl.attachShader(program, shader)
      }
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error('Shader link failed')
      gl.useProgram(program)
      gl.viewport(0, 0, canvas.width, canvas.height)
      // Canvas texture upload and filtering follow the WebGL texture API:
      // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const uniform = (name: string) => gl.getUniformLocation(program, name)
      const timeUniform = uniform('u_time')
      const pointerUniform = uniform('u_pointer')
      const strengthUniform = uniform('u_strength')
      const phaseUniform = uniform('u_phase')
      gl.uniform1i(uniform('u_atlas'), 0)
      gl.uniform2f(uniform('u_resolution'), canvas.width, canvas.height)
      gl.uniform2f(uniform('u_grid'), columns, rows)
      gl.uniform1f(uniform('u_seed'), seed)
      gl.uniform1i(uniform('u_pattern'), asciiVariants.indexOf(variant))
      const colors = () => {
        const current = getComputedStyle(canvas)
        gl.uniform3fv(uniform('u_front'), rgb(current.color))
        gl.uniform3fv(uniform('u_back'), rgb(current.backgroundColor))
      }
      colors()
      return {
        kind: 'webgl',
        colors,
        dispose,
        draw(time, input) {
          gl.uniform1f(timeUniform, time)
          gl.uniform2f(pointerUniform, input.x, input.y)
          gl.uniform1f(strengthUniform, input.strength)
          gl.uniform1f(phaseUniform, input.phase)
          gl.drawArrays(gl.TRIANGLES, 0, 3)
        },
      }
    } catch {
      dispose()
      return null // The static ASCII layer remains available on shader failure.
    }
  }

  const context = canvas.getContext('2d')
  if (!context) return null
  let front = style.color
  let back = style.backgroundColor
  return {
    kind: '2d',
    colors() {
      const current = getComputedStyle(canvas)
      front = current.color
      back = current.backgroundColor
    },
    dispose() {
      context.clearRect(0, 0, canvas.width, canvas.height)
    },
    draw(time, input) {
      context.fillStyle = back
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = front
      context.font = `${(canvas.height / rows) * 0.9}px ${style.fontFamily}`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < columns; x++) {
          const glyph =
            asciiGlyphs[
              Math.floor(
                asciiDensity(
                  (x + 0.5) / columns,
                  (y + 0.5) / rows,
                  width / height,
                  time,
                  seed,
                  input,
                  variant,
                ) * asciiGlyphs.length,
              )
            ]
          if (glyph !== ' ')
            context.fillText(
              glyph,
              ((x + 0.5) * canvas.width) / columns,
              ((y + 0.5) * canvas.height) / rows,
            )
        }
    },
  }
}
