# Plan: Replace 3D hero object with a lightweight 2D interactive "Living Infinity Loop"

## Context
The hero currently renders a React Three Fiber scene (`src/HeroScene.tsx`) — a glassy torus-knot with `MeshTransmissionMaterial`, `Environment`, lightformers, and contact shadows. This pulls in a ~950KB (gzip ~260KB) three.js chunk that, while code-split, is heavy to download and expensive to render on mid-end devices (GPU transmission material, per-frame refraction). The user wants a **2D element** that is far lighter, still **reacts to the mouse** so it feels interactive, and **stays on-theme** (the brand infinity/"8" loop motif, palette `ink / space / steel / frosted / strawberry`, Manrope headings).

Chosen concept (confirmed with user): **Living Infinity Loop** — a layered ∞ glyph with a glowing node endlessly traveling the loop path, parallax depth layers, and a cursor-follow glow.

Outcome: the hero right column shows a crisp, animated, mouse-reactive SVG composition; the three.js dependency is no longer loaded by the running app.

## Approach

### 1. New component `src/HeroLoop2D.tsx`
Pure SVG + CSS + a single throttled `requestAnimationFrame` loop. No canvas required; no new dependencies.

Structure (all inside a container sized to match the current slot: `h-[440px] w-full xl:h-[580px]`):

- **Mouse tracking** — `onPointerMove` on the container computes a normalized pointer `{x,y}` in `[-1,1]`. Store in a `useRef` (not state) and apply through the rAF loop / CSS custom properties to avoid re-renders — mirrors the ref+rAF pattern already used in `src/CursorEffect.tsx`. `onPointerLeave` eases the pointer back to `{0,0}`.
- **Parallax depth layers** — 3 stacked SVG/`div` layers at different depth factors. Each gets `transform: translate3d()` + slight `rotate` driven by the eased pointer via a CSS variable, so the loop tilts/parallaxes toward the cursor. Reuse the site's existing `translate3d` parallax idiom (see `useParallax`/`ParallaxLayer` in `src/App.tsx`).
  - Back layer: large faint concentric rings / dashed orbit ring, slow continuous CSS rotation.
  - Mid layer: the main ∞ path drawn with a brand gradient stroke (steel → frosted, strawberry accent), plus a soft duplicate for glow (blur filter).
  - Front layer: the traveling node + short trail (strongest parallax).
- **Traveling node ("always running")** — reuse the shared `INFINITY_PATH` constant (already defined at `src/App.tsx:24`; extract/duplicate into the new file or a small shared spot). In the rAF loop, advance a `t` along the path using a hidden `<path ref>` and `path.getTotalLength()` / `getPointAtLength(t)`; position a glowing `<circle>` (strawberry core + frosted halo) at that point. Keep a few fading trail circles behind it for the "flow" feel. Pointer influence nudges the node's glow/position slightly so motion feels reactive without leaving the path.
- **Cursor-follow glow** — a radial-gradient blob (frosted/steel) that eases toward the pointer position behind the loop, using the same eased pointer values.
- **Gradient + filter defs** — SVG `<defs>` with `<linearGradient>` in brand colors and a `<filter>` gaussian blur for the glow duplicate.

### 2. Reduced-motion + low-power handling
- Respect `prefers-reduced-motion: reduce`: skip the rAF loop and CSS rotations; render a static, centered composition (loop drawn + node parked at a pleasing point). Reuse the existing detection approach from `src/HeroScene.tsx:76`.
- Pointer parallax gated to `(pointer: fine)` so touch devices get the static/auto-animated version without jitter (same gate `src/CursorEffect.tsx:16` uses).

### 3. Wire into the hero (`src/App.tsx`)
- Remove the lazy import `const HeroScene = lazy(() => import('@/HeroScene'))` (`src/App.tsx:18`) and add a normal import `import HeroLoop2D from '@/HeroLoop2D'`.
- Replace the `<Suspense fallback={...}><HeroScene /></Suspense>` block in the hero right column (`src/App.tsx:660-672`) with `<HeroLoop2D />`. No `Suspense`/`lazy` needed anymore.
- Drop the now-unused `lazy` and `Suspense` from the React import (`src/App.tsx:2-3`) to satisfy `noUnusedLocals`. Keep `glyphMark` only if still referenced elsewhere (it is — footer/marquee); leave it.

### 4. Remove the heavy 3D module
- Delete `src/HeroScene.tsx` (no longer imported).
- Leave the `three` / `@react-three/*` entries in `package.json` as-is for this change (removing the file already stops them from being bundled). Optionally note: they can be uninstalled later with `pnpm remove three @react-three/fiber @react-three/drei @types/three` if a fully slim dependency tree is wanted — flagged, not done by default.

### 5. Optional CSS keyframes (`src/index.css`)
Add a slow `orbit-rotate` keyframe (0→360deg) for the back ring if not composable from existing keyframes. `loop-float`/`ribbon-spin` already exist and may be reused. Keep any new keyframe inside the existing `@media (prefers-reduced-motion: reduce)` disable block.

## Theming notes
- Colors via existing tokens/classes: `text-strawberry`, `bg-steel`, `frosted`, etc.; hex fallbacks in inline SVG (`#457b9d` steel, `#a8dadc` frosted, `#e63946` strawberry, `#1d3557` space) matching values already used across the file.
- Odd-numbers preference (memory `odd-numbers-preference.md`): any free-choice counts (e.g. number of orbit rings, trail dots) should be odd — use 3 layers, 3 rings, 7 trail dots.

## Critical files
- `src/HeroLoop2D.tsx` — **new**, the 2D interactive element.
- `src/App.tsx` — swap import + hero right-column usage (lines ~2-3, 18, 660-672); reuse `INFINITY_PATH` (line 24).
- `src/HeroScene.tsx` — **delete**.
- `src/index.css` — optional keyframe for the orbit ring.

## Verification
1. `npx tsc --noEmit` — clean (watch for unused `lazy`/`Suspense`).
2. `npx vite build` from repo root `/workspaces/default/code` — succeeds; confirm the large `HeroScene`/three.js chunk is **gone** from the build output (previously `HeroScene-*.js ~956KB`).
3. In the running preview: hero shows the animated loop; moving the mouse over it tilts the parallax layers and the glow follows the cursor; the node travels the ∞ path continuously.
4. Toggle OS "reduce motion" (or emulate) → animation stops, static composition renders, no errors.
5. Narrow viewport / touch emulation → no pointer jitter; loop still reads correctly.
