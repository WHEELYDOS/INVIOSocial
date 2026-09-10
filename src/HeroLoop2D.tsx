import { useEffect, useRef } from 'react'

/* The signature "8" / infinity loop, drawn big for the hero canvas. */
const INFINITY_PATH =
  'M20 30 C20 16 34 16 42 30 C50 44 64 44 64 30 C64 16 50 16 42 30 C34 44 20 44 20 30 Z'

const TRAIL = 7 // odd, per house style

/**
 * A living infinity loop — pure SVG + one rAF loop. A glowing node runs the
 * brand "8" forever; depth layers parallax toward the cursor and a soft glow
 * chases the pointer. Far lighter than the R3F scene, and interactive.
 */
export default function HeroLoop2D() {
  const wrap = useRef<HTMLDivElement>(null)
  const scene = useRef<SVGSVGElement>(null)
  const backLayer = useRef<SVGGElement>(null)
  const midLayer = useRef<SVGGElement>(null)
  const frontLayer = useRef<SVGGElement>(null)
  const glow = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const node = useRef<SVGGElement>(null)
  const trailRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()

    // pointer target + eased value (both normalized -1..1)
    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    let dist = 0 // distance travelled along the loop
    let raf = 0

    // park the node at a pleasing spot for the static / reduced case
    const place = (d: number, glowScale: number) => {
      const p = path.getPointAtLength(d % len)
      if (node.current) {
        node.current.setAttribute('transform', `translate(${p.x} ${p.y})`)
      }
      // stagger the trail behind the head
      for (let i = 0; i < TRAIL; i++) {
        const tp = path.getPointAtLength((d - (i + 1) * len * 0.012 + len) % len)
        const c = trailRefs.current[i]
        if (c) {
          c.setAttribute('cx', String(tp.x))
          c.setAttribute('cy', String(tp.y))
          c.setAttribute('opacity', String((1 - i / TRAIL) * 0.5 * glowScale))
        }
      }
    }

    if (reduced) {
      place(len * 0.18, 1)
      return
    }

    const onMove = (e: PointerEvent) => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2
      if (glow.current) {
        glow.current.style.left = `${e.clientX - r.left}px`
        glow.current.style.top = `${e.clientY - r.top}px`
        glow.current.style.opacity = '1'
      }
    }
    const onLeave = () => {
      target.x = 0
      target.y = 0
      if (glow.current) glow.current.style.opacity = '0'
    }

    const tick = () => {
      // the node never stops — the "always running" motif
      dist += len * 0.0016
      // pointer easing (only when a real pointer is present)
      eased.x += (target.x - eased.x) * 0.06
      eased.y += (target.y - eased.y) * 0.06

      place(dist, 1)

      // parallax depth — each layer leans a different amount toward the cursor
      const lean = (depth: number) =>
        `translate3d(${eased.x * depth}px, ${eased.y * depth}px, 0) rotate(${eased.x * depth * 0.12}deg)`
      if (backLayer.current) backLayer.current.style.transform = lean(6)
      if (midLayer.current) midLayer.current.style.transform = lean(14)
      if (frontLayer.current) frontLayer.current.style.transform = lean(26)

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    if (fine) {
      const el = wrap.current
      el?.addEventListener('pointermove', onMove)
      el?.addEventListener('pointerleave', onLeave)
      return () => {
        cancelAnimationFrame(raf)
        el?.removeEventListener('pointermove', onMove)
        el?.removeEventListener('pointerleave', onLeave)
      }
    }
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={wrap}
      className="relative flex h-[440px] w-full items-center justify-center overflow-hidden xl:h-[580px]"
    >
      {/* cursor-following glow, behind the loop */}
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(168,218,220,0.35), rgba(69,123,157,0.12) 45%, transparent 70%)',
        }}
      />

      <svg
        ref={scene}
        viewBox="0 0 84 60"
        className="relative h-full w-full max-w-[560px]"
        fill="none"
        aria-label="Invio Social — an endlessly running loop"
      >
        <defs>
          <linearGradient id="loopStroke" x1="0" y1="0" x2="84" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#457b9d" />
            <stop offset="0.55" stopColor="#a8dadc" />
            <stop offset="1" stopColor="#457b9d" />
          </linearGradient>
          <filter id="loopBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <radialGradient id="nodeCore" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe3e6" />
            <stop offset="0.4" stopColor="#e63946" />
            <stop offset="1" stopColor="#e63946" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* BACK — faint concentric orbit rings, slowly rotating */}
        <g ref={backLayer} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <g className="hero-orbit" style={{ transformOrigin: '42px 30px' }}>
            <ellipse cx="42" cy="30" rx="33" ry="21" stroke="#457b9d" strokeOpacity="0.14" strokeWidth="0.4" />
            <ellipse cx="42" cy="30" rx="27" ry="16" stroke="#a8dadc" strokeOpacity="0.10" strokeWidth="0.4" strokeDasharray="1.5 3" />
            <ellipse cx="42" cy="30" rx="21" ry="11" stroke="#457b9d" strokeOpacity="0.12" strokeWidth="0.4" />
          </g>
        </g>

        {/* MID — the loop itself: soft glow duplicate + crisp gradient stroke */}
        <g ref={midLayer} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <path
            d={INFINITY_PATH}
            stroke="#a8dadc"
            strokeOpacity="0.35"
            strokeWidth="3.4"
            strokeLinecap="round"
            filter="url(#loopBlur)"
          />
          <path
            d={INFINITY_PATH}
            stroke="url(#loopStroke)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* hidden geometry the rAF loop measures for node placement */}
          <path ref={pathRef} d={INFINITY_PATH} stroke="none" opacity={0} />
        </g>

        {/* FRONT — the traveling node + its fading trail */}
        <g ref={frontLayer} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {Array.from({ length: TRAIL }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => {
                trailRefs.current[i] = el
              }}
              r={1.6 - (i / TRAIL) * 1}
              fill="#e63946"
              opacity={0}
            />
          ))}
          <g ref={node}>
            <circle r="4" fill="url(#nodeCore)" />
            <circle r="1.5" fill="#ffffff" />
          </g>
        </g>
      </svg>
    </div>
  )
}
