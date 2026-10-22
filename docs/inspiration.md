# Inspiration — Techniques for a Cinematic, Low-Dependency Web

Techniques extracted from two heavily-engineered sites that achieve a "designed" feel with almost no third-party runtime code. Organized by **technique** — what it is and how it works. Sources are footnotes (`[1]`, `[2]`) at the end, for reference and as live examples.

---

## 1. Two philosophies for bespoke visuals

There are two fundamentally different ways to get a distinctive, non-template look. Both sites picked one and went deep.

### 1a. Synthesize on the GPU — raw WebGL fragment shaders `[1]`

**What:** a fullscreen canvas behind/around the content, where every pixel is computed by a hand-written GLSL fragment shader each frame. No Three.js, no scene graph — the entire "3D scene" (a pear, in `[1]`'s case) is raymarched/computed in one shader.

**How:**

- Context: `getContext('webgl', { alpha: false, antialias: false, depth: false })` — no depth buffer or MSAA because a fullscreen 2D shader doesn't need them; each dropped feature saves GPU cost.
- Draw a single fullscreen triangle (3 vertices, covers the screen, cheaper than a quad).
- Drive everything through shader **uniforms** — `uTime`, scroll position, transition states (50+ in `[1]`) — updated per frame from JS.
- **Mobile variant:** compile a different (cheaper) fragment shader when `innerWidth <= 720`, rather than running the desktop shader on weak GPUs.
- Ship shaders as JS strings; compile/link at boot.

**Cost:** months to learn (GLSL + math). Payoff: infinite, resolution-independent visuals that weigh ~10 KB of code instead of MBs of media.

### 1b. Choreograph pre-rendered media — scroll-scrubbed video `[2]`

**What:** pre-rendered MP4 footage whose playhead is bound to the scrollbar. Scrolling *is* the timeline. The "cinematic" feel comes from the footage, not from code.

**How:**

- Each chapter is a `<figure>` with a WebP poster `<img>` plus a `<video muted playsinline preload="metadata">` whose real `src` is deferred into `data-src` until needed.
- On scroll: `target = chapterProgress * video.duration`, then `video.fastSeek(target)` (or `currentTime =`) — but only if `video.seekable.end(...) >= duration - 0.1` (the whole byte range is buffered).
- **Fallback:** if the range isn't buffered, the active scene plays in real time instead — the page never stalls waiting for bytes.
- **Preload strategy:** desktop primes *all* videos; mobile primes only current + next scene, promoted from `metadata` to `auto` on demand.
- Avoid re-seeking while `video.seeking`, and skip if `|currentTime - target| < 0.035s` (below perceptibility).

**Cost:** days of JS. The real effort is the **media pipeline** — encoding scrub-friendly MP4s (keyframe-dense) and WebP posters. Payoff is proportional to the quality of the footage.

---

## 2. Scroll-driven animation without libraries

Neither site uses GSAP, Framer Motion, or a scroll library. The engine is ~50–150 lines of vanilla code.

**The tall-track pattern `[2]`:** a 1px-wide, `Nvh`-tall invisible `<div>` creates the scrollable length; the actual visual stage is `position: fixed` and re-rendered from scroll progress. Content doesn't move — the scrollbar is just a big slider.

**Progress math:**

```js
const pageProgress = clamp(scrollY / maxScroll);        // 0..1 over the whole page
const position     = pageProgress * transitions;        // e.g. 3.42 across 7 chapter changes
const leg          = Math.floor(position);              // which transition we're in
const local        = position - leg;                    // 0..1 within it
```

**Easing:** hand-rolled `smoothstep` instead of a library — `x*x*(3-2x)` gives smooth acceleration/deceleration between any two points:

```js
const smoothstep = (start, end, value) => {
  const x = clamp((value - start) / (end - start));
  return x * x * (3 - 2 * x);
};
```

**Spring/lerp physics `[1]`:** for buttery, slightly-lagging motion, keep `target`/`current` pairs and nudge `current` toward `target` every frame (`lerp` or a damped spring) rather than snapping.

**The rAF-throttled scroll handler** (the standard pattern, both sites use a variant):

```js
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(render);   // render() resets ticking = false
}, { passive: true });
```

**CSS custom properties as the JS→CSS bridge `[2]`:** JS writes `--scene-scale`, `--scene-blur`, `--scene-clip`; CSS consumes them in `transform`, `filter`, `clip-path`. This keeps JS out of the per-property styling business and lets CSS own the layout rules while JS owns only the numbers.

**Compositor discipline (both):** animate only `transform` and `opacity` (plus `clip-path` where needed), hoist with `will-change`, never animate layout properties. `[1]` even ships a built-in frame-budget profiler (per-frame ms overlay) to catch violations during development.

---

## 3. SVG as a visual-effects engine

Cheap, dependency-free effects that punch far above their weight:

| Effect | How | Used for |
|---|---|---|
| Ink/tear distortion `[1]` | `feTurbulence` + `feDisplacementMap` applied to text | Typographic warping on headlines |
| Glow `[2]` | `feGaussianBlur` + `feMerge` (blur merged under source) | Route lines, active nodes |
| Line drawing `[2]` | `pathLength="1"` + `stroke-dasharray: 1` + `stroke-dashoffset = 1 - progress` | Flight path that draws itself with scroll — no length measuring, no per-pixel math |
| Tangent rotation `[2]` | Sample `getPointAtLength()` slightly ahead/behind, `atan2` the delta, rotate the marker | Plane that flies along the path facing its direction |
| SVG→screen coords `[2]` | `getScreenCTM()` + `createSVGPoint()` + `matrixTransform()` | Anchoring a `clip-path: circle()` origin to a point on the map |
| Film grain `[2]` | Inline data-URI SVG `feTurbulence`, animated by `steps(8)` keyframes | Cinematic texture for ~0 bytes of JS |

Also: arc/flight paths as quadratic Béziers with computed control points (`Q`, arc height ∝ distance).

---

## 4. Typography and fonts

Two valid endpoints of the same spectrum:

- **Self-host everything `[1]`:** commercial fonts via `@font-face`, subsetting, and a documented decision to *remove* Google Fonts because the `css2` chain cost a `connect` + `fetch` on every cold load. The fallback stays only in the `font-family` stack.
- **Ship no fonts at all `[2]`:** pure system stacks (`Iowan Old Style, Baskerville…` / `SFMono-Regular, Consolas…`) — zero font requests, zero FOIT, and the design leans on layout and motion instead of the typeface.

Either way: no third-party font CDN.

---

## 5. Performance discipline

- Above-fold media: `fetchpriority="high"` + `<link rel="preload">` on the first two images `[2]`; later scenes `loading="lazy"`.
- Cheaper code paths for weaker devices: mobile shader variant `[1]`; mobile-only priming of adjacent videos `[2]`; per-scene `object-position` art direction for small screens `[2]`.
- Safe-area insets (`env(safe-area-inset-*)`) and dedicated landscape-phone media queries `[2]`.
- Instrument your own site: `[1]` embeds a frame-time profiler (`fps worst Xms` overlay) in the production bundle — measure, don't guess.
- Caching: content-hashed filenames from a bundler `[1]` vs manual `?v=N` query busting on a no-build site `[2]` — both work; hashes scale better, queries are honest about being hand-managed.

---

## 6. Accessibility of cinematic pages

Both treat motion as a progressive enhancement:

- `prefers-reduced-motion`: kill all animations/transitions, hide grain, use `auto` instead of `smooth` scrolling — and `[2]` **shortens the scroll track itself** (105vh vs 280vh per chapter) so reduced-motion users don't scroll through empty time.
- Keyboard: arrow keys scroll by ~⅓ viewport `[2]`.
- Live regions: `aria-live="polite"` chapter readout, `aria-current="step"` on the timeline nav `[2]`.
- `noscript` fallback with a link to a plain text version `[2]`.
- The real content lives in semantic HTML underneath the effects (both) — the canvas/video layer is `aria-hidden`.

---

## 7. SEO without a server

- **No-SSR SPA trick `[1]`:** at build time, a headless-browser snapshot of the rendered DOM is inlined into `#root` in the served HTML. There's no hydration — React re-renders over the snapshot at runtime. Crawlers and noscript users see full content; the app stays a simple static SPA.
- **Simpler alternative `[2]`:** real semantic HTML is the page; JS only enhances it.
- Standard layer regardless: Open Graph (+ 1200×630 image), Twitter cards, canonical URL, robots meta, JSON-LD `schema.org` structured data `[1]`.
- Zero analytics/trackers on either site — privacy as a design constraint, not an afterthought.

---

## 8. The zero-dependency philosophy

The unifying idea: **every dependency you don't ship is a faster, more private, more durable site.**

- `[1]` ships exactly React + React DOM (with the React Compiler for memoization). No router, no GSAP, no Three.js, no font CDN, no analytics.
- `[2]` ships *nothing* — hand-authored HTML/CSS/JS on GitHub Pages, served unminified with comments, and it still feels more expensive than most agency sites.

The visual distinctiveness comes from bespoke work (shaders, choreography, SVG craft) that a library could only approximate — while the boring parts (scroll math, easing, throttling) turn out to be ~100 lines each, too small to justify a dependency.

---

## 9. Applicability to Dramas of Discrimination

**Scope rule:** these techniques belong on the **public surface** (homepage, manifesto portal) — not behind the auth wall where the collaborative tool lives. Our foundation already matches `[1]` (React 19, Vite, Tailwind v4, Cloudflare via Wrangler), so the gaps are additive.

| Step | Technique (§) | Where in our app |
|---|---|---|
| 1. Self-host remaining fonts (Miriam Libre, Italianno via `@fontsource`) | §4 | `app/src/styles/theme.css` |
| 2. Enable React Compiler | §8 | `app/vite.config.ts` |
| 3. Ink-distortion SVG filter on the wordmark | §3 | `app/src/features/home/HomeHero.tsx` |
| 4. Fullscreen shader canvas as hero background (`uTime` plasma first) | §1a | Hero background |
| 5. Scroll-driven workshop journey (scenario → map → stage → manifesto) with tall-track + smoothstep | §2 | `app/src/features/home/HomeStorySections.tsx` |
| 6. Bespoke shader scene replacing static illustration | §1a | `WorkshopIllustration` |
| 7. Scroll-scrubbed video chapters | §1b | Workshop story sections |
| 8. Prerender/SSR for the public surface | §7 | TanStack Start (already a candidate in our stack) |

Steps 1–3 are days; 4–5 are weeks; 6–7 are the multi-month craft. Steps 1–5 deliver ~80% of the perceived quality.

---

## Sources

*[1] **pear.no** — studio/agency site for Pear AS (Norway). React 19.2.8 + React Compiler, Vite, Tailwind v4.3.3, hand-written WebGL 1 shader engine (no Three.js), custom spring/rAF animation engine with frame profiler, self-hosted GT Standard fonts, SVG turbulence filters, prerendered-DOM-in-`#root` SEO, Cloudflare. Zero third-party runtime requests. Techniques: §1a, §2 (spring), §3, §4, §5, §6, §7.*

*[2] **gvrkiran.github.io/about-journey.html** — personal academic-journey page (GitHub Pages). No framework, no build step, no dependencies: hand-authored HTML/CSS + one vanilla JS IIFE, scroll-scrubbed MP4 video scenes, SVG route map, system font stacks, unminified code cache-busted with `?v=N`. Techniques: §1b, §2 (smoothstep scroll math), §3, §4, §5, §6, §7.*
