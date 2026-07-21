import { useEffect, useRef, useState } from 'react'

/**
 * A branded pointer: an instant Strawberry Red dot, a frosted ring that eases
 * along behind it, and a faint loop trail — echoing the "continuous flow"
 * motif. The ring blooms and inverts when over interactive elements.
 *
 * Performance: the RAF loop pauses after 150ms of inactivity and the canvas
 * is cleared, so an idle page consumes zero GPU budget from this effect.
 */
export default function CursorEffect() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const trail = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Skip on touch / coarse pointers — a custom cursor only helps a mouse.
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const target = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...target }
    let hovering = false
    let down = false
    let isText = false
    let lastTarget: EventTarget | null = null
    let raf = 0
    let idleTimer = 0
    let isIdle = false

    const canvas = trail.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const resize = () => {
      if (!isIdle) {
        canvas.width = innerWidth
        canvas.height = innerHeight
      }
    }
    resize()

    type Pt = { x: number; y: number; life: number }
    const pts: Pt[] = []

    const startLoop = () => {
      if (isIdle) {
        isIdle = false
        // Restore canvas dimensions when waking up
        canvas.width = innerWidth
        canvas.height = innerHeight
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const goIdle = () => {
      isIdle = true
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      // Clear canvas and release GPU memory
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.length = 0
    }

    const resetIdleTimer = () => {
      clearTimeout(idleTimer)
      idleTimer = window.setTimeout(goIdle, 150)
      startLoop()
    }

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY

      if (lastTarget !== e.target) {
        lastTarget = e.target
        const el = e.target as HTMLElement
        // Safely call closest in case it's not an element (e.g. document/SVG)
        isText = !!(el?.closest && el.closest('input, textarea'))
        hovering = !!(el?.closest && el.closest('a, button, [role="button"], select'))
      }

      pts.push({ x: e.clientX, y: e.clientY, life: 1 })
      if (pts.length > 22) pts.shift()

      resetIdleTimer()
    }

    const onDown = () => (down = true)
    const onUp = () => (down = false)

    const tick = () => {
      if (isIdle) return

      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
        dot.current.style.opacity = isText ? '0' : '1'
      }

      if (ring.current) {
        ring.current.style.opacity = isText ? '0' : '1'
      }

      if (canvas) {
        canvas.style.opacity = isText ? '0' : '1'
      }

      // ring eases toward the pointer for a springy lag
      ringPos.x += (target.x - ringPos.x) * 0.16
      ringPos.y += (target.y - ringPos.y) * 0.16
      const scale = (hovering ? 1.9 : 1) * (down ? 0.7 : 1)
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`
        ring.current.style.borderColor = hovering ? '#e63946' : '#457b9d'
        ring.current.style.backgroundColor = hovering
          ? 'rgba(230,57,70,0.10)'
          : 'rgba(168,218,220,0.08)'
      }

      // loop trail
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineCap = 'round'
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1]
        const p1 = pts[i]
        p1.life *= 0.92
        const t = i / pts.length
        ctx.strokeStyle = `rgba(69,123,157,${p1.life * 0.5 * t})`
        ctx.lineWidth = t * 3
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', resize)
    document.documentElement.style.cursor = 'none'

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idleTimer)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', resize)
      document.documentElement.style.cursor = ''
    }
  }, [])

  return (
    <div
      style={{ opacity: enabled ? 1 : 0 }}
      className="transition-opacity duration-200"
    >
      <canvas
        ref={trail}
        className="pointer-events-none fixed inset-0 z-[9990] transition-opacity duration-200"
        aria-hidden
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[9991] h-9 w-9 rounded-full border transition-opacity duration-200"
        style={{
          borderColor: '#457b9d',
          backgroundColor: 'rgba(168,218,220,0.08)',
          transition:
            'border-color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease',
          willChange: 'transform',
        }}
        aria-hidden
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9992] h-2 w-2 rounded-full bg-strawberry transition-opacity duration-200"
        style={{ willChange: 'transform' }}
        aria-hidden
      />
    </div>
  )
}
