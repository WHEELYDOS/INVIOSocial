import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/* A hand-annotated product mockup: a stack of glassy app windows sketching
   "ideas → automation → growth", ringed by sticky notes, doodle arrows and
   marker-pen notes. Parallax depth layers lean toward the cursor; cards drift. */

function Par({
  depth,
  className = '',
  style,
  children,
}: {
  depth: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div
      className={`hero-par absolute ${className}`}
      style={{ ...style, '--depth': depth } as CSSProperties}
    >
      {children}
    </div>
  )
}

function Hand({
  className = '',
  style,
  children,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <span
      className={`font-hand leading-none text-frosted/70 ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}

const NAV = [
  { label: 'Home', active: true, d: 'M3 10.5 12 3l9 7.5M6 9.5V20h12V9.5' },
  { label: 'Leads', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0' },
  { label: 'Automation', d: 'M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-7 7-2 2m0-11 2 2m7 7 2 2' },
  { label: 'Analytics', d: 'M5 20V10m7 10V4m7 16v-7' },
  { label: 'Settings', d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3-1.8-.6.3-2-2-.8-1.2 1.6-1.9-.6-1.9.6L10.3 8l-2 .8.3 2L6.8 11.4l-1.8.6 1.8.6-.3 2 2 .8 1.2-1.6 1.9.6 1.9-.6 1.2 1.6 2-.8-.3-2z' },
]

export default function HeroMockup() {
  const stage = useRef<HTMLDivElement>(null)

  // React to the pointer anywhere on the page, not just over the mockup.
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let mx = 0
    let my = 0
    const onMove = (e: PointerEvent) => {
      // normalized -1..1 across the viewport
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          const el = stage.current
          if (!el) return
          el.style.setProperty('--mx', mx.toFixed(3))
          el.style.setProperty('--my', my.toFixed(3))
        })
      }
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={stage}
      className="hero-stage relative mx-auto h-[440px] w-full max-w-[640px] xl:h-[560px]"
    >
      {/* faint brush-stroke "8" behind everything */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.03]"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <path
          d="M28 78 C10 60 20 34 42 40 C64 46 80 26 66 14"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>

      {/* stacked ghost windows behind the main card → depth */}
      <Par depth={5} className="right-[6%] top-[16%] h-[62%] w-[74%]">
        <div className="h-full w-full rounded-2xl border border-white/5 bg-white/[0.02]" />
      </Par>
      <Par depth={7} className="right-[10%] top-[13%] h-[62%] w-[74%]">
        <div className="h-full w-full rounded-2xl border border-white/[0.07] bg-white/[0.03]" />
      </Par>

      {/* MAIN app window */}
      <Par depth={12} className="left-[8%] top-[18%] w-[80%]">
        <div className="hero-float overflow-hidden rounded-2xl border border-white/10 bg-panel/80 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] backdrop-blur-sm">
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-strawberry" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <div className="flex">
            {/* sidebar */}
            <div className="w-[38%] border-r border-white/10 p-3">
              <span className="mb-4 block font-heading text-sm font-extrabold tracking-tight text-honeydew">
                INVIO
              </span>
              <ul className="space-y-1">
                {NAV.map((n) => (
                  <li
                    key={n.label}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium ${
                      n.active
                        ? 'bg-steel/25 text-frosted'
                        : 'text-frosted/55'
                    }`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d={n.d} />
                    </svg>
                    {n.label}
                  </li>
                ))}
              </ul>
            </div>
            {/* whiteboard */}
            <div className="relative flex-1 p-5">
              <Hand className="block text-2xl text-honeydew/90">Ideas</Hand>
              <Hand className="my-1 block text-lg text-steel">↓</Hand>
              <Hand className="block text-2xl text-honeydew/90">Automation</Hand>
              <Hand className="my-1 block text-lg text-steel">↓</Hand>
              <Hand className="block text-2xl text-strawberry">Growth</Hand>
              {/* blue underline swoosh */}
              <svg className="mt-1 h-3 w-24" viewBox="0 0 100 12" fill="none" aria-hidden>
                <path d="M2 8 C25 2 60 2 98 6" stroke="#457b9d" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {/* rocket doodle */}
              <svg className="absolute right-3 top-3 h-10 w-10 text-frosted/70" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M16 3c4 2 6 6 6 11l-3 3h-6l-3-3c0-5 2-9 6-11Z" />
                <circle cx="16" cy="12" r="2" />
                <path d="M13 20l-2 4m8-4 2 4m-6-1v4" stroke="#e63946" />
              </svg>
              {/* cursor */}
              <svg className="absolute bottom-4 right-6 h-6 w-6 text-honeydew" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M5 3l14 7-6 2-2 6z" />
              </svg>
            </div>
          </div>
          {/* business growth chart strip */}
          <div className="border-t border-white/10 p-4">
            <span className="mb-3 block font-heading text-xs font-bold text-honeydew/90">
              Business Growth
            </span>
            <div className="flex h-16 items-end gap-2">
              {[35, 45, 40, 62, 100].map((h, i) => (
                <span
                  key={i}
                  className={`w-full origin-bottom rounded-sm ${i === 4 ? 'bg-steel' : 'bg-white/12'}`}
                  style={{
                    height: `${h}%`,
                    animation: `bar-grow 0.9s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.12}s both`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Par>

      {/* sticky note — LESS MANUAL WORK (blue) */}
      <Par depth={20} className="left-[2%] top-[6%]">
        <div className="hero-float">
          <div className="w-28 rotate-[-6deg] rounded-sm bg-[#5ea0e0] px-3 py-3 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)]">
            <Hand className="block text-xl font-bold text-[#0a1a2e]">Less manual work</Hand>
          </div>
        </div>
      </Par>

      {/* sticky note — MORE GROWTH (white) */}
      <Par depth={24} className="right-[-2%] top-[46%]">
        <div className="hero-float-slow">
          <div className="w-24 rotate-[7deg] rounded-sm bg-honeydew px-3 py-3 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)]">
            <Hand className="block text-xl font-bold text-space">More growth</Hand>
          </div>
        </div>
      </Par>

      {/* checklist annotations — top right */}
      <Par depth={9} className="right-[-4%] top-[2%] hidden sm:block">
        <ul className="space-y-0.5">
          {['Websites', 'Automation', 'SEO', 'Content', 'Real results'].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <span className="text-steel">✓</span>
              <Hand className="text-lg uppercase tracking-wide">{t}</Hand>
            </li>
          ))}
        </ul>
      </Par>

      {/* curved doodle arrow, top */}
      <Par depth={14} className="left-[24%] top-[1%] hidden text-steel sm:block">
        <svg width="90" height="46" viewBox="0 0 90 46" fill="none" aria-hidden>
          <path d="M4 8 C40 -6 78 6 82 34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="180" strokeDashoffset="180" style={{ animation: 'dash-draw 1.2s ease-out 0.4s forwards' }} />
          <path d="M74 30 82 34 84 25" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Par>

      {/* ON AUTO-PILOT circled doodle */}
      <Par depth={18} className="bottom-[10%] left-[40%] hidden text-steel sm:block">
        <div className="relative">
          <Hand className="text-lg uppercase text-frosted/80">On auto-pilot</Hand>
          <svg className="absolute -inset-2" width="120" height="44" viewBox="0 0 120 44" fill="none" aria-hidden>
            <ellipse cx="60" cy="22" rx="56" ry="19" stroke="currentColor" strokeWidth="1.8" strokeDasharray="260" strokeDashoffset="260" style={{ animation: 'dash-draw 1.4s ease-out 0.8s forwards' }} />
          </svg>
        </div>
      </Par>

      {/* corner marker notes */}
      <Par depth={7} className="bottom-[-2%] right-[2%] hidden text-right md:block">
        <Hand className="block text-lg uppercase leading-tight text-frosted/55">
          Build
          <br />
          Automate
          <br />
          Scale
        </Hand>
      </Par>
    </div>
  )
}
