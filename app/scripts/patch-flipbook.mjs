// Small, version-checked patches to the published upstream builds. Keeping the
// replacements here avoids committing entire minified bundles. Run on install;
// an unexpected upstream build fails closed instead of silently skipping a fix.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../node_modules/', import.meta.url)
async function patch(packageName, version, files, replacements) {
  const folder = new URL(`${packageName}/`, root)
  const manifest = JSON.parse(
    await readFile(new URL('package.json', folder), 'utf8'),
  )
  if (manifest.version !== version)
    throw new Error(`Review patches for ${packageName}@${manifest.version}`)
  for (const file of files) {
    const path = new URL(file, folder)
    let source = (await readFile(path, 'utf8')).replaceAll('\r\n', '\n')
    for (const [before, after, count = 1] of replacements(file)) {
      if (source.split(after).length - 1 === count) continue
      if (source.split(before).length - 1 !== count) {
        throw new Error(
          `Patch mismatch in ${fileURLToPath(path)}: ${before.slice(0, 80)}`,
        )
      }
      source = source.replaceAll(before, after)
    }
    await writeFile(path, source)
  }
}

await patch(
  'page-flip',
  '2.0.7',
  ['dist/js/page-flip.browser.js', 'dist/js/page-flip.module.js'],
  () => [
    // Stop the recursive render loop without committing a half-finished turn.
    [
      'start(){this.update();const t=e=>{this.render(e),requestAnimationFrame(t)};requestAnimationFrame(t)}',
      'start(){this.stopped=false;this.update();const t=e=>{if(this.stopped)return;this.render(e);if(!this.stopped)this.frame=requestAnimationFrame(t)};this.frame=requestAnimationFrame(t)}stop(){this.stopped=true;cancelAnimationFrame(this.frame);this.animation=null}',
    ],
    // React owns the host and original leaves; restore them before removing the
    // engine wrappers. Default destroy() still removes the host for vanilla users.
    [
      'destroy(){this.ui.destroy(),this.block.remove()}',
      'destroy(preserveHost=false){if(this.destroyed)return;this.destroyed=true;clearTimeout(this.initTimer);this.render?.stop();this.events.clear();if(this.pages)for(const page of this.pages.getPages())page.hideTemporaryCopy();if(preserveHost)this.ui?.clear?.();this.ui?.destroy();if(!preserveHost)this.block.remove()}',
    ],
    [
      'this.pages.show(this.setting.startPage),setTimeout(()=>{this.ui.update(),this.trigger("init",this,{page:this.setting.startPage,mode:this.render.getOrientation()})},1)',
      'this.pages.show(this.setting.startPage),this.initTimer=setTimeout(()=>{if(this.destroyed)return;this.ui.update();this.trigger("init",this,{page:this.pages.getCurrentPageIndex(),mode:this.render.getOrientation()})},1)',
      2,
    ],
    // Resize is subscribed even when pointer input is disabled.
    [
      'destroy(){this.app.getSettings().useMouseEvents&&this.removeHandlers(),this.distElement.remove(),this.wrapper.remove()}',
      'destroy(){this.touchPoint=null;this.removeHandlers();this.distElement.remove();this.wrapper.remove()}',
    ],
    // Progress comes from the fold calculation, not elapsed wall-clock time.
    [
      'this.render.setShadowData(this.calc.getShadowStartPoint(),this.calc.getShadowAngle(),t,this.calc.getDirection())',
      'this.render.setShadowData(this.calc.getShadowStartPoint(),this.calc.getShadowAngle(),t,this.calc.getDirection()),this.app.trigger("turnProgress",this.app,{progress:t/100,direction:this.calc.getDirection()})',
    ],
  ],
)

await patch(
  'react-pageflip',
  '2.0.3',
  ['build/index.es.js', 'build/index.js'],
  (file) => {
    const hook = file.endsWith('index.es.js') ? '' : 'React.'
    const engine = file.endsWith('index.es.js') ? 'pageFlip' : 'pageFlip$1'
    return [
      [
        `const htmlElementRef = ${hook}useRef(null);`,
        `const propsRef = ${hook}useRef(props);\n    propsRef.current = props;\n    const htmlElementRef = ${hook}useRef(null);`,
      ],
      // Keep callbacks fresh when the scroll destination changes during a turn.
      ...[
        'onFlip',
        'onChangeOrientation',
        'onChangeState',
        'onInit',
        'onUpdate',
      ].map((event) => [`props.${event}(e)`, `propsRef.current.${event}?.(e)`]),
      [
        "flip.off('update');",
        "flip.off('update');\n            flip.off('turnProgress');",
      ],
      [
        'if (props.onUpdate) {',
        "flip.on('turnProgress', (e) => propsRef.current.onTurnProgress?.(e));\n                if (props.onUpdate) {",
      ],
      // Subscribe before load/update so synchronous page changes cannot be lost.
      [
        `if (!${engine}.current.getFlipController()) {`,
        `setHandlers();\n            if (!${engine}.current.getFlipController()) {`,
      ],
      [
        '            setHandlers();\n        }\n        // eslint-disable-next-line react-hooks/exhaustive-deps\n    }, [pages]);',
        `        }\n        return () => {\n            ${engine}.current?.destroy(true);\n            ${engine}.current = undefined;\n        };\n        // eslint-disable-next-line react-hooks/exhaustive-deps\n    }, [pages]);`,
      ],
    ]
  },
)
console.log(
  'Applied flipbook lifecycle, React ownership, and geometric progress patches.',
)
