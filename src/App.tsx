import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import wordmark from '@/imports/lanscape.png'
import glyphMark from '@/imports/final00.jpg'
import IntroSequence from '@/IntroSequence'
import CursorEffect from '@/CursorEffect'
import BookingModal from '@/BookingModal'
import NewsletterSignup from '@/NewsletterSignup'
import Lenis from 'lenis'

/* ------------------------------------------------------------------ */
/* Touch detection — used to disable hover-only effects on touch       */
/* ------------------------------------------------------------------ */

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

import HeroScene from '@/HeroScene'

/* ------------------------------------------------------------------ */
/* Brand mark — the "8" / infinity loop that signs the whole site      */
/* ------------------------------------------------------------------ */

const INFINITY_PATH =
  'M20 30 C20 16 34 16 42 30 C50 44 64 44 64 30 C64 16 50 16 42 30 C34 44 20 44 20 30 Z'

function InfinityGlyph({
  size = 30,
  stroke = 3,
  color = '#e63946',
  draw = false,
  className = '',
}: {
  size?: number
  stroke?: number
  color?: string
  draw?: boolean
  className?: string
}) {
  return (
    <svg
      width={size}
      height={(size * 60) / 84}
      viewBox="0 0 84 60"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d={INFINITY_PATH}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          draw
            ? ({
                '--dash': 320,
                strokeDasharray: 320,
                animation: 'draw-in 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s both',
              } as CSSProperties)
            : undefined
        }
      />
    </svg>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <img
      src={wordmark}
      alt="Invio Social - Website Design and Automation Agency"
      className={
        light
          ? 'h-11 w-auto select-none rounded-[3px] bg-honeydew px-2 py-1'
          : 'h-10 w-auto select-none'
      }
      style={{ mixBlendMode: light ? 'normal' : 'multiply' }}
      width={176}
      height={44}
      decoding="async"
    />
  )
}

/* ------------------------------------------------------------------ */
/* Scroll reveal — varied per-variant with spring easings              */
/* ------------------------------------------------------------------ */

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'blur' | 'flip'
const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: '',
  left: 'rv-left',
  right: 'rv-right',
  scale: 'rv-scale',
  blur: 'rv-blur',
  flip: 'rv-flip',
}

function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className = '',
  threshold = 0.05,
}: {
  children: ReactNode
  delay?: number
  variant?: RevealVariant
  className?: string
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`reveal ${VARIANT_CLASS[variant]} ${inView ? 'in-view' : ''} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll-linked parallax — consolidated single listener               */
/* All parallax elements share ONE scroll handler instead of 5+        */
/* ------------------------------------------------------------------ */

type ParallaxEntry = { el: HTMLDivElement; strength: number }
const parallaxEntries: ParallaxEntry[] = []
let parallaxRaf = 0
let parallaxListenerAttached = false

function updateAllParallax() {
  const vh = window.innerHeight
  const updates = parallaxEntries.map(({ el, strength }) => {
    const rect = el.getBoundingClientRect()
    const center = rect.top + rect.height / 2 - vh / 2
    return { el, transform: `translate3d(0, ${(-center * strength).toFixed(1)}px, 0)` }
  })
  for (const { el, transform } of updates) {
    el.style.transform = transform
  }
  parallaxRaf = 0
}

function onParallaxScroll() {
  if (!parallaxRaf) parallaxRaf = requestAnimationFrame(updateAllParallax)
}

function attachParallaxListener() {
  if (parallaxListenerAttached) return
  parallaxListenerAttached = true
  window.addEventListener('scroll', onParallaxScroll, { passive: true })
  window.addEventListener('resize', onParallaxScroll)
}

function useParallax(strength = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const entry: ParallaxEntry = { el, strength }
    parallaxEntries.push(entry)
    attachParallaxListener()
    // Initial position
    onParallaxScroll()

    return () => {
      const idx = parallaxEntries.indexOf(entry)
      if (idx >= 0) parallaxEntries.splice(idx, 1)
      if (parallaxEntries.length === 0 && parallaxListenerAttached) {
        window.removeEventListener('scroll', onParallaxScroll)
        window.removeEventListener('resize', onParallaxScroll)
        parallaxListenerAttached = false
        if (parallaxRaf) { cancelAnimationFrame(parallaxRaf); parallaxRaf = 0 }
      }
    }
  }, [strength])
  return ref
}

function ParallaxLayer({
  children,
  strength = 0.15,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useParallax(strength)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll progress — gradient bar at top                               */
/* ------------------------------------------------------------------ */

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      if (barRef.current) {
        const h = document.documentElement.scrollHeight - window.innerHeight
        const p = h > 0 ? window.scrollY / h : 0
        barRef.current.style.transform = `scaleX(${p})`
      }
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="fixed left-0 top-0 z-[95] h-[3px] w-full bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="scroll-progress-fill h-full origin-left bg-gradient-to-r from-strawberry to-aero"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section gradient divider — replaces LoopDivider                     */
/* ------------------------------------------------------------------ */

function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="pointer-events-none relative h-24 w-full sm:h-32"
      aria-hidden
      style={{
        background: flip
          ? 'linear-gradient(to top, rgba(11,22,38,0), rgba(241,250,238,0.04) 40%, rgba(69,123,157,0.06) 60%, rgba(11,22,38,0))'
          : 'linear-gradient(to bottom, rgba(11,22,38,0), rgba(69,123,157,0.06) 40%, rgba(168,218,220,0.04) 60%, rgba(11,22,38,0))',
      }}
    >
      <div className="absolute inset-x-0 top-1/2 mx-auto h-px w-48 max-w-[40vw] -translate-y-1/2 bg-gradient-to-r from-transparent via-steel/30 to-transparent" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section content                                                     */
/* ------------------------------------------------------------------ */

const NAV = ['Services', 'Process', 'Why Us', 'Work', 'Testimonials', 'FAQ']

const SERVICES = [
  {
    title: 'Web Design',
    desc: 'Sharp, fast marketing sites and product surfaces built to convert - designed pixel-first and engineered to load in a blink.',
    icon: 'M4 6h16M4 12h10M4 18h16',
    features: ['Marketing sites', 'Product UI', 'Design systems'],
  },
  {
    title: 'Automation Workflows',
    desc: 'Self-running pipelines that move work between your tools untouched, so the busywork closes itself while your team stays on the work that matters.',
    icon: 'M6 4v6a6 6 0 0 0 12 0V4M6 20h12',
    features: ['Zapier / Make', 'Custom APIs', 'Data sync'],
  },
  {
    title: 'Social Systems',
    desc: 'Content engines that schedule, publish and report on autopilot - a loop that keeps your brand in motion without a person babysitting it.',
    icon: 'M12 3v18M3 12h18',
    features: ['Scheduling', 'Auto-reporting', 'Content ops'],
  },
  {
    title: 'Integrations',
    desc: 'Every platform wired into one loop - data flows where it should, nothing leaks, and every tool finally speaks the same language.',
    icon: 'M8 8h8v8H8z M4 12h4 M16 12h4',
    features: ['CRM + billing', 'Webhooks', 'Single source'],
  },
]

const STEPS = [
  { n: '01', t: 'Map', d: 'We chart every manual handoff across your stack.' },
  { n: '02', t: 'Build', d: 'We wire the loops - designed, tested, documented.' },
  { n: '03', t: 'Launch', d: 'Systems go live with monitoring from day one.' },
  { n: '04', t: 'Refine', d: 'The loop learns; we tune it as you scale.' },
]

const METRICS = [
  { v: '93%', l: 'less manual work for a 39-person ops team' },
  { v: '5.1x', l: 'faster lead response after automating intake' },
  { v: '17k', l: 'hours returned to clients across last year' },
]

const WHY_CHOOSE_US = [
  {
    title: 'Engineered for Speed',
    desc: 'We hand-code every surface without clunky builders, ensuring your site loads in a blink. Performance is the foundation.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    stat: '0.8s',
    statLabel: 'average load time',
  },
  {
    title: 'Built to Scale',
    desc: 'We architect robust systems that grow with you - from startup to enterprise, without rebuilding.',
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    stat: '10x',
    statLabel: 'growth handled without changes',
  },
  {
    title: 'Zero Babysitting',
    desc: 'Set it and forget it. Monitoring from day one means it runs silently. If something breaks, we know before you do.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    stat: '24/7',
    statLabel: 'uptime monitoring included',
  },
  {
    title: 'Transparent Pricing',
    desc: 'No hidden fees, no surprise invoices. You see the full scope and cost before we write a single line.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    stat: '$0',
    statLabel: 'hidden fees, ever',
  },
]

const QUOTES = [
  {
    q: 'Invio rebuilt our entire intake as one loop. What took three people now runs while we sleep.',
    n: 'Dana Whitfield',
    r: 'COO, Northwind Labs',
    initials: 'DW',
    color: '#457b9d',
  },
  {
    q: 'The site is sharp and the automation behind it is sharper. Leads never sit idle anymore.',
    n: 'Marcus Reyes',
    r: 'Founder, Cadence Studio',
    initials: 'MR',
    color: '#e63946',
  },
  {
    q: 'We went from 12 manual steps to 2 clicks. The ROI paid for the project in the first month.',
    n: 'Aisha Patel',
    r: 'Head of Ops, Meridian Health',
    initials: 'AP',
    color: '#a8dadc',
  },
]

const TRUST_COMPANIES = [
  'Northwind Labs',
  'Cadence Studio',
  'Meridian Health',
  'Atlas Ventures',
  'Prism Digital',
  'Vertex Partners',
]

const FAQ_ITEMS = [
  {
    q: 'How long does a typical website project take?',
    a: 'Most marketing sites go from kickoff to launch in 3-5 weeks. Complex product surfaces or apps with deep automation layers run 6-10 weeks. We give you a firm timeline before we start.',
  },
  {
    q: 'What does "automation" actually mean for my business?',
    a: 'It means the repetitive work your team does by hand - moving data between tools, sending follow-ups, generating reports - gets wired into self-running pipelines. You set the rules once, and the system handles the rest.',
  },
  {
    q: 'Do I need to know how to code to manage the systems you build?',
    a: 'Not at all. Everything we build comes with a dashboard and plain-English documentation. If you can use a spreadsheet, you can manage your loops.',
  },
  {
    q: 'What happens if something breaks after launch?',
    a: 'Every project includes monitoring from day one. We get alerted before you even notice. Our standard support window covers the first 30 days post-launch, and extended plans are available.',
  },
  {
    q: 'How much does a project cost?',
    a: "Projects start at $3,500 for a focused marketing site and scale based on complexity. Automation integrations are scoped and quoted individually. Book a call and we will give you a real number within 48 hours - no ballparks.",
  },
]

/* Big always-running type strip */
const MARQUEE_WORDS = [
  'automation',
  'websites',
  'workflows',
  'social systems',
  'integrations',
  'reputation growth',
  'always running',
]

function LogoMarquee() {
  return (
    <div className="overflow-hidden border-y border-space/10 bg-honeydew py-6 sm:py-12">
      <div
        className="flex w-max items-center"
        style={{ animation: 'marquee 40s linear infinite' }}
      >
        {[0, 1].map((dup) => (
          <div
            key={dup}
            className="flex items-center"
            aria-hidden={dup === 1}
          >
            {MARQUEE_WORDS.map((word, i) => {
              const outlined = i % 2 === 1
              return (
                <div key={i} className="flex items-center">
                  <span
                    className="whitespace-nowrap px-6 sm:px-8 font-heading text-5xl sm:text-7xl xl:text-8xl font-extrabold tracking-tight"
                    style={
                      outlined
                        ? {
                            color: 'transparent',
                            WebkitTextStroke: '1.5px rgba(29,53,87,0.55)',
                          }
                        : { color: '#1d3557' }
                    }
                  >
                    {word}
                  </span>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full bg-strawberry sm:h-4 sm:w-4"
                    aria-hidden
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Interactive card — spotlight + 3D tilt + glow ring                  */
/* ------------------------------------------------------------------ */

function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Disable 3D tilt on touch devices — causes jank and no visible cursor
  const onMove = IS_TOUCH ? undefined : (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const rx = (y / r.height - 0.5) * -8
    const ry = (x / r.width - 0.5) * 8
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    el.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px) scale(1.01)`
  }
  const onLeave = IS_TOUCH ? undefined : () => {
    const el = ref.current
    if (el) {
      el.style.transform = ''
    }
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`card-glow group relative h-full overflow-hidden rounded-lg border border-white/[0.07] bg-panel/90 backdrop-blur-sm ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: IS_TOUCH ? 'auto' : 'transform' }}
    >
      {/* cursor-follow glow — warmer, larger radius */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(400px circle at var(--mx) var(--my), rgba(168,218,220,0.12), rgba(69,123,157,0.04) 40%, transparent 70%)',
        }}
      />
      {/* top accent — draws from center outward */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[2px] w-full origin-center scale-x-0 bg-gradient-to-r from-transparent via-steel to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
      />
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Magnetic button — subtly follows cursor on hover                    */
/* ------------------------------------------------------------------ */

function MagneticButton({
  children,
  className = '',
  pulse = false,
  onClick,
}: {
  children: ReactNode
  className?: string
  pulse?: boolean
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  // Disable magnetic follow on touch — no visible cursor, doesn't make sense
  const onMove = IS_TOUCH ? undefined : (e: ReactPointerEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width / 2) * 0.2
    const dy = (e.clientY - r.top - r.height / 2) * 0.2
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
  }
  const onLeave = IS_TOUCH ? undefined : () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`btn-magnetic group inline-flex items-center gap-2 bg-strawberry px-6 py-3 font-display text-sm font-semibold text-honeydew hover:shadow-[0_12px_28px_rgba(230,57,70,0.35)] ${pulse ? 'cta-pulse' : ''} ${className}`}
      style={{ borderRadius: 4 }}
    >
      {children}
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
        &rarr;
      </span>
    </button>
  )
}

function ArrowCta({
  children = 'Book a call',
  pulse = false,
  subtitle,
  onClick,
}: {
  children?: ReactNode
  pulse?: boolean
  subtitle?: string
  onClick?: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <MagneticButton pulse={pulse} onClick={onClick}>{children}</MagneticButton>
      {subtitle && (
        <span className="text-xs text-frosted/50">{subtitle}</span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Count-up with spring easing                                         */
/* ------------------------------------------------------------------ */

function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const match = value.match(/^([\d.]+)(.*)$/)
    if (!match) {
      setDisplay(value)
      return
    }
    const num = parseFloat(match[1])
    const suffix = match[2]
    const decimals = (match[1].split('.')[1] || '').length
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        obs.disconnect()
        const dur = 1800
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur)
          // spring overshoot easing
          const eased = t < 0.6
            ? 1 - Math.pow(1 - t / 0.6, 3) * (1 - 0.9)
            : 1 + Math.sin((t - 0.6) / 0.4 * Math.PI) * 0.03
          setDisplay((num * Math.min(1, eased)).toFixed(decimals) + suffix)
          if (t < 1) requestAnimationFrame(tick)
          else setDisplay(value)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div ref={ref} className={className}>
      {display}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile Navigation                                                   */
/* ------------------------------------------------------------------ */

function MobileNav({
  open,
  onClose,
  onBooking,
}: {
  open: boolean
  onClose: () => void
  onBooking: () => void
}) {
  const [closing, setClosing] = useState(false)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 300)
  }, [onClose])

  if (!open && !closing) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm"
        onClick={handleClose}
        style={{
          opacity: closing ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
        }}
      />
      <nav
        className={`fixed right-0 top-0 z-[61] flex h-full w-72 flex-col bg-panel/95 backdrop-blur-xl px-8 pt-20 pb-10 shadow-2xl ${closing ? 'mobile-nav-closing' : 'mobile-nav-open'}`}
        aria-label="Mobile navigation"
      >
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-frosted/80 transition-all duration-200 hover:border-strawberry/40 hover:text-honeydew"
          aria-label="Close navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col gap-1">
          {NAV.map((n, i) => (
            <a
              key={n}
              href={`#${n.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={handleClose}
              className="rounded-lg px-4 py-3 font-display text-lg font-semibold text-honeydew/80 transition-all duration-200 hover:bg-white/5 hover:text-honeydew hover:pl-6"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {n}
            </a>
          ))}
        </div>
        <div className="mt-auto">
          <ArrowCta pulse onClick={() => { handleClose(); onBooking() }}>Start a project</ArrowCta>
        </div>
      </nav>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Floating Mobile CTA                                                 */
/* ------------------------------------------------------------------ */

function FloatingCta({ onOpen }: { onOpen: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="floating-cta fixed bottom-6 right-6 z-[55] md:hidden">
      <button
        onClick={onOpen}
        className="cta-pulse flex h-14 w-14 items-center justify-center rounded-full bg-strawberry text-honeydew shadow-[0_8px_24px_rgba(230,57,70,0.4)] transition-transform duration-300 hover:scale-110 active:scale-95"
        aria-label="Book a call"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Trust Bar — stagger children                                        */
/* ------------------------------------------------------------------ */

function TrustBar() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="border-b border-white/5 bg-ink/50 py-6 sm:py-8">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-16">
        <Reveal variant="blur">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-frosted/40">
            Trusted by teams at
          </p>
        </Reveal>
        <div
          ref={ref}
          className={`stagger-children flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6 ${inView ? 'in-view' : ''}`}
        >
          {TRUST_COMPANIES.map((company) => (
            <span
              key={company}
              className="font-display text-base font-bold tracking-tight text-frosted/20 transition-all duration-500 hover:text-frosted/50 hover:scale-105 sm:text-xl"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ Section                                                         */
/* ------------------------------------------------------------------ */

function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-[1600px] px-6 lg:px-16 py-16 md:py-20 lg:py-24">
      <Reveal variant="blur">
        <div className="mb-14 text-center">
          <span className="text-sm text-frosted/60">06 / FAQ</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
            Questions we hear most
          </h2>
        </div>
      </Reveal>
      <div className="mx-auto max-w-3xl">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={i} delay={i * 60} variant="up">
            <details className="faq-item">
              <summary>
                {item.q}
                <svg
                  className="faq-icon ml-4 h-5 w-5 text-steel"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="faq-answer">
                <p className="pb-5 text-base leading-relaxed text-frosted/60">
                  {item.a}
                </p>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Animated Page Background — floating shapes, particles, grain        */
/* ------------------------------------------------------------------ */

function PageBackground() {
  return (
    <>
      {/* Film grain overlay */}
      <div className="noise-grain" aria-hidden />

      {/* Ripple rings — expanding from center-ish positions */}
      <div className="pointer-events-none fixed inset-0 z-[11] overflow-hidden" aria-hidden>
        <div
          className="ripple-ring"
          style={{ width: 300, height: 300, left: '20%', top: '40%', animationDelay: '0s' }}
        />
        <div
          className="ripple-ring"
          style={{ width: 200, height: 200, left: '70%', top: '25%', animationDelay: '2.5s' }}
        />
        <div
          className="ripple-ring"
          style={{ width: 260, height: 260, left: '50%', top: '65%', animationDelay: '5s' }}
        />
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Main App                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const openBooking = useCallback(() => setBookingModalOpen(true), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return // skip Lenis on touch devices

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      syncTouch: true,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!
      if (id.length > 1) {
        const el = document.querySelector(id)
        if (el) {
          e.preventDefault()
          lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.6 })
        }
      }
    }
    document.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-space font-sans text-honeydew">
      <div
        className="relative z-10 bg-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
        style={{ marginBottom: '100vh' }}
      >
      {/* ambient depth glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 75% 8%, rgba(69,123,157,0.22), transparent 60%), radial-gradient(50% 40% at 10% 40%, rgba(168,218,220,0.10), transparent 55%), radial-gradient(45% 40% at 85% 85%, rgba(230,57,70,0.08), transparent 60%)',
        }}
        aria-hidden
      />
      <ScrollProgress />
      <CursorEffect />
      <PageBackground />
      <IntroSequence onDone={() => {}} />
      <FloatingCta onOpen={openBooking} />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} onBooking={openBooking} />
      <BookingModal open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />

      {/* ─── NAV ─── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink/60 backdrop-blur-xl" role="banner">
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 lg:px-16 py-4" aria-label="Primary navigation">
          <Logo light />
          <div className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase().replace(/\s+/g, '-')}`}
                className="nav-link text-sm font-medium text-frosted/70 transition-colors duration-200 hover:text-honeydew"
              >
                {n}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ArrowCta onClick={openBooking}>Start a project</ArrowCta>
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-frosted/80 transition-all duration-200 hover:border-steel/40 hover:text-honeydew md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <main>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center" aria-labelledby="hero-heading">
        {/* Aurora background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div
            className="absolute -left-[10%] top-[-20%] h-[70vh] w-[70vh] rounded-full blur-[60px]"
            style={{
              background: 'radial-gradient(circle, rgba(69,123,157,0.4), transparent 65%)',
              animation: 'aurora-a 18s ease-in-out infinite',
            }}
          />
          <div
            className="absolute right-[-10%] top-[10%] h-[60vh] w-[60vh] rounded-full blur-[60px]"
            style={{
              background: 'radial-gradient(circle, rgba(168,218,220,0.25), transparent 65%)',
              animation: 'aurora-b 22s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-[-15%] left-[35%] h-[45vh] w-[45vh] rounded-full blur-[70px]"
            style={{
              background: 'radial-gradient(circle, rgba(230,57,70,0.14), transparent 65%)',
              animation: 'aurora-a 26s ease-in-out infinite reverse',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(168,218,220,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,218,220,0.5) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(circle at 50% 40%, #000 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 40%, #000 30%, transparent 75%)',
              animation: 'grid-pan 8s linear infinite',
            }}
          />
        </div>

        {/* Two-column hero layout */}
        <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-16 py-16 sm:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-4">

            {/* Left column — text content */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl pointer-events-none">
              {/* Badge */}
              <div
                className="mb-8 inline-flex items-center gap-2.5 border border-steel/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-frosted/80 bg-ink/60 backdrop-blur-md pointer-events-auto"
                style={{
                  borderRadius: 4,
                  animation: 'pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
                  boxShadow: '0 0 20px rgba(69,123,157,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <InfinityGlyph size={18} color="#457b9d" stroke={5} />Website &middot;
                Automation Agency
              </div>

              {/* Heading */}
              <h1
                id="hero-heading"
                className="font-display font-extrabold tracking-[-0.03em] text-honeydew"
                style={{
                  perspective: '600px',
                  fontSize: 'clamp(2.5rem, 7vw, 7rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                }}
              >
                <span
                  className="block"
                  style={{
                    animation: 'hero-word 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.15s both',
                    textShadow: '0 2px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  Automation
                </span>
                <span
                  className="block mt-1 sm:mt-2"
                  style={{
                    animation: 'hero-word 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.35s both',
                    textShadow: '0 2px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  that{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #e63946 0%, #ff6b7a 50%, #e63946 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    runs itself.
                  </span>
                </span>
              </h1>

              {/* Subtext */}
              <p
                className="mt-7 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed font-medium"
                style={{
                  animation: 'gentle-rise 0.8s ease-out 0.5s both',
                  color: 'rgba(168,218,220,0.85)',
                  textShadow: '0 1px 20px rgba(0,0,0,0.5)',
                }}
              >
                We design sharp websites and wire the automation loops behind them —
                so your business keeps moving while you don't have to.
              </p>

              {/* CTAs */}
              <div
                className="mt-10 flex flex-col items-center lg:items-start gap-3 pointer-events-auto"
                style={{
                  animation: 'gentle-rise 0.8s ease-out 0.65s both',
                }}
              >
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <ArrowCta pulse onClick={openBooking}>Book a call</ArrowCta>
                  <a
                    href="#services"
                    className="group relative overflow-hidden border border-steel/40 px-6 py-3 font-display text-sm font-semibold text-frosted/80 transition-all duration-300 hover:border-steel hover:text-honeydew bg-ink/50 backdrop-blur-md"
                    style={{ borderRadius: 4 }}
                  >
                    <span className="relative z-10">See what we build</span>
                    <span className="absolute inset-0 origin-left scale-x-0 bg-steel transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </a>
                </div>
                <span
                  className="text-xs text-frosted/50 bg-ink/50 px-3 py-1.5 rounded-sm backdrop-blur-md mt-2"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
                >
                  Free strategy session — No commitment
                </span>
              </div>
            </div>

            {/* Right column — Spline 3D scene */}
            <div
              className="flex-1 relative w-full pointer-events-none"
              style={{
                minHeight: '400px',
                height: 'clamp(400px, 50vh, 650px)',
              }}
              aria-hidden
            >
              <HeroScene />
            </div>

          </div>
        </div>
      </section>

      {/* Trust bar */}
      <TrustBar />

      {/* Marquee */}
      <LogoMarquee />



      {/* ─── SERVICES ─── */}
      <section id="services" className="relative mx-auto max-w-[1600px] px-6 lg:px-16 py-16 md:py-20 lg:py-24" aria-labelledby="services-heading">
        <ParallaxLayer
          strength={0.15}
          className="pointer-events-none absolute right-[-5%] top-[10%] opacity-[0.03] rotate-[15deg]"
        >
          <InfinityGlyph size={480} color="#a8dadc" stroke={1.5} />
        </ParallaxLayer>
        <div className="dot-grid-bg" aria-hidden />
        <Reveal variant="blur">
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 id="services-heading" className="font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
              Every system.
              <br />
              One continuous loop.
            </h2>
            <span className="hidden text-sm text-frosted/50 sm:block">01 / Services</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} variant="flip">
              <SpotlightCard className="flex min-h-[20rem] sm:min-h-[24rem] flex-col p-7 sm:p-9 lg:p-11">
                <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[11rem] font-extrabold leading-none text-white/[0.025] transition-colors duration-700 group-hover:text-steel/[0.08]">
                  0{i + 1}
                </span>
                <div className="relative flex items-start justify-between">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-frosted/80 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:border-steel/50 group-hover:bg-steel/15 group-hover:text-steel">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="sm:h-7 sm:w-7">
                      <path d={s.icon} />
                    </svg>
                  </div>
                </div>
                <h3 className="relative mt-8 font-display text-2xl font-semibold text-honeydew sm:text-3xl">
                  {s.title}
                </h3>
                <p className="relative mt-3 max-w-md flex-1 text-base leading-relaxed text-frosted/65">
                  {s.desc}
                </p>
                <div className="relative mt-8 flex flex-wrap items-center gap-2">
                  {s.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs font-medium text-frosted/60 transition-all duration-400 group-hover:border-steel/30 group-hover:text-frosted/80"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <span className="relative mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-steel/70 transition-all duration-400 group-hover:gap-3 group-hover:text-steel">
                  Explore this system
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                </span>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={450} variant="scale">
          <div className="mt-14 flex flex-col items-center gap-2">
            <ArrowCta pulse subtitle="Free strategy session - No commitment" onClick={openBooking}>Ready to automate?</ArrowCta>
          </div>
        </Reveal>
      </section>

      {/* ─── PROCESS — light section ─── */}
      <section id="process" className="section-light relative overflow-hidden" aria-labelledby="process-heading">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-16 py-16 md:py-20 lg:py-24">
          <Reveal variant="blur">
            <div className="mb-14 text-center">
              <span className="text-sm" style={{ color: 'rgba(29,53,87,0.4)' }}>02 / Process</span>
              <h2 id="process-heading" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: '#1d3557' }}>
                The automation cycle
              </h2>
            </div>
          </Reveal>
          <div className="relative">
            <ParallaxLayer
              strength={0.2}
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]"
            >
              <InfinityGlyph size={420} color="#1d3557" stroke={2} />
            </ParallaxLayer>
            <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 100} variant="up">
                  <div
                    className={`group relative h-full overflow-hidden rounded-2xl border border-space/[0.08] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgb(29,53,87,0.12)] hover:border-steel/30 ${i % 2 ? 'lg:mt-16' : ''}`}
                  >
                    {/* Background number watermark */}
                    <span className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-9xl font-extrabold leading-none text-space/[0.03] transition-all duration-500 group-hover:text-steel/[0.08] group-hover:-translate-x-4 group-hover:translate-y-4">
                      {s.n}
                    </span>
                    
                    {/* Glowing orb accent on hover */}
                    <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-steel/[0.05] blur-3xl transition-all duration-700 group-hover:bg-steel/[0.15]" />

                    <div className="relative z-10">
                      <div className="mb-6 sm:mb-8 flex items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-steel/20 bg-steel/[0.02] font-display text-sm font-bold text-steel transition-all duration-500 group-hover:scale-110 group-hover:bg-steel group-hover:text-white group-hover:shadow-[0_0_20px_rgb(69,123,157,0.4)]">
                          {s.n}
                        </span>
                        <span className="h-px flex-1 bg-gradient-to-r from-space/10 via-space/5 to-transparent transition-all duration-500 group-hover:from-steel/40" />
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-space transition-colors duration-300 group-hover:text-steel">
                        {s.t}
                      </h3>
                      <p className="mt-4 text-base leading-relaxed text-space/70">
                        {s.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider flip />

      {/* ─── WHY CHOOSE US ─── */}
      <section id="why-us" className="relative mx-auto max-w-[1600px] px-6 lg:px-16 py-16 md:py-20 lg:py-24" aria-labelledby="why-us-heading">
        <ParallaxLayer
          strength={-0.12}
          className="pointer-events-none absolute left-[-10%] top-[40%] opacity-[0.03] rotate-[-20deg]"
        >
          <InfinityGlyph size={550} color="#e63946" stroke={2} />
        </ParallaxLayer>
        <Reveal variant="blur">
          <div className="mb-14 text-center">
            <span className="text-sm text-frosted/50">03 / Why Choose Us</span>
            <h2 id="why-us-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
              Why teams partner with us
            </h2>
          </div>
        </Reveal>
        <div className="space-y-5">
          {WHY_CHOOSE_US.map((item, i) => {
            const isReversed = i % 2 === 1
            return (
              <Reveal key={item.title} delay={i * 80} variant={isReversed ? 'right' : 'left'}>
                <div className="card-glow group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-steel/30 hover:bg-panel/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-steel/[0.05]">
                  <div className={`grid grid-cols-1 lg:grid-cols-2`}>
                    {/* Stat / Icon Side */}
                    <div className={`flex flex-col items-center justify-center p-8 sm:p-10 lg:p-14 ${isReversed ? 'lg:order-2 lg:border-l lg:border-white/[0.06]' : 'lg:border-r lg:border-white/[0.06]'}`}>
                      <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-steel/20 bg-gradient-to-br from-steel/10 to-transparent text-steel transition-all duration-600 group-hover:scale-110 group-hover:border-steel/40 group-hover:from-steel/20 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(69,123,157,0.3)] lg:h-32 lg:w-32">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="lg:h-12 lg:w-12">
                          <path d={item.icon} />
                        </svg>
                      </div>
                      <span className="mt-6 sm:mt-8 font-display text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 lg:text-6xl">
                        {item.stat}
                      </span>
                      <span className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-steel">
                        {item.statLabel}
                      </span>
                    </div>
                    {/* Text Side */}
                    <div className={`flex flex-col justify-center p-8 sm:p-10 lg:p-14 ${isReversed ? 'lg:order-1 lg:items-end lg:text-right' : 'lg:items-start lg:text-left'}`}>
                      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-strawberry/20 bg-strawberry/10 px-3 py-1.5 text-xs font-semibold text-strawberry">
                        <span className="h-1.5 w-1.5 rounded-full bg-strawberry shadow-[0_0_8px_rgba(230,57,70,0.6)] animate-pulse" />
                        Advantage 0{i + 1}
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-frosted/60">
                        {item.desc}
                      </p>
                      <div className={`mt-8 flex h-1 w-12 overflow-hidden rounded-full bg-white/5 transition-all duration-500 group-hover:w-32 ${isReversed ? 'ml-auto' : ''}`}>
                         <div className="h-full w-full bg-gradient-to-r from-strawberry to-strawberry/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>



      {/* ─── WORK / RESULTS ─── */}
      <section id="work" className="section-light relative overflow-hidden" aria-labelledby="work-heading">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-16 py-16 md:py-20 lg:py-24">
          <ParallaxLayer
            strength={0.18}
            className="pointer-events-none absolute -left-24 top-10 opacity-[0.05]"
          >
            <InfinityGlyph size={360} color="#1d3557" stroke={2} />
          </ParallaxLayer>
          <Reveal variant="blur">
            <div className="mb-14">
              <span className="text-sm" style={{ color: 'rgba(29,53,87,0.4)' }}>04 / Work</span>
              <h2 id="work-heading" className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: '#1d3557' }}>
                Loops we've closed for teams that were drowning in busywork.
              </h2>
            </div>
          </Reveal>
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
            {METRICS.map((m, i) => {
              const symbol = m.v.replace(/[\d.]/g, '') || '+'
              return (
                <Reveal key={m.v} delay={i * 140} variant="scale">
                  <div className={`group relative h-full overflow-hidden rounded-2xl border border-space/[0.08] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgb(29,53,87,0.12)] hover:border-steel/30 flex flex-col justify-between ${i === 1 ? 'sm:mt-10' : ''}`}>
                    {/* Background symbol watermark */}
                    <span className="pointer-events-none absolute -right-6 -bottom-10 select-none font-display text-[14rem] font-extrabold leading-none text-space/[0.025] transition-all duration-500 group-hover:text-steel/[0.08] group-hover:-translate-x-4 group-hover:-translate-y-4">
                      {symbol}
                    </span>
                    
                    {/* Glowing orb accent on hover */}
                    <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-steel/[0.05] blur-3xl transition-all duration-700 group-hover:bg-steel/[0.15]" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-6 sm:mb-8 flex items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-steel/20 bg-steel/[0.02] font-display text-sm font-bold text-steel transition-all duration-500 group-hover:scale-110 group-hover:bg-steel group-hover:text-white group-hover:shadow-[0_0_20px_rgb(69,123,157,0.4)]">
                          0{i + 1}
                        </span>
                        <span className="h-px flex-1 bg-gradient-to-r from-space/10 via-space/5 to-transparent transition-all duration-500 group-hover:from-steel/40" />
                      </div>
                      
                      <div className="mt-auto pt-16">
                        <CountUp
                          value={m.v}
                          className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-space transition-colors duration-300 group-hover:text-steel"
                        />
                        <p className="mt-3 sm:mt-5 text-sm sm:text-base leading-relaxed text-space/70">
                          {m.l}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="relative mx-auto max-w-[1600px] px-6 lg:px-16 py-16 md:py-20 lg:py-24" aria-labelledby="testimonials-heading">
        <ParallaxLayer
          strength={0.14}
          className="pointer-events-none absolute right-[10%] top-[-10%] opacity-[0.03] rotate-[45deg]"
        >
          <InfinityGlyph size={400} color="#457b9d" stroke={2} />
        </ParallaxLayer>
        <div className="dot-grid-bg" style={{ animationDelay: '1.5s' }} aria-hidden />
        <Reveal variant="blur">
          <div className="mb-10">
            <span className="text-sm text-frosted/50">05 / Testimonials</span>
            <h2 id="testimonials-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
              What our clients say
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {QUOTES.map((qt, i) => (
            <Reveal key={qt.n} delay={i * 120} variant="flip">
              <article>
                <SpotlightCard className={`flex min-h-[20rem] sm:min-h-[22rem] flex-col justify-between p-8 sm:p-10 lg:p-12 ${i === 1 ? 'lg:mt-8' : ''}`}>
                  <span className="pointer-events-none absolute right-6 top-2 select-none font-display text-[9rem] leading-none text-strawberry/[0.06] transition-colors duration-700 group-hover:text-strawberry/[0.15]">
                    &ldquo;
                  </span>
                  <div className="star-rating relative mb-4 text-base" aria-label="5 out of 5 stars">
                    &#9733;&#9733;&#9733;&#9733;&#9733;
                  </div>
                  <blockquote className="relative font-display text-lg sm:text-xl lg:text-2xl font-semibold leading-snug tracking-tight text-honeydew">
                    &ldquo;{qt.q}&rdquo;
                  </blockquote>
                  <figcaption className="relative mt-8 flex items-center gap-4 border-t border-honeydew/10 pt-5">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-honeydew transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundColor: qt.color }}
                    >
                      {qt.initials}
                    </div>
                    <div>
                      <span className="block font-display text-sm font-semibold text-honeydew">
                        {qt.n}
                      </span>
                      <span className="text-xs text-frosted/60">{qt.r}</span>
                    </div>
                  </figcaption>
                </SpotlightCard>
              </article>
            </Reveal>
          ))}
        </div>
      </section>



      {/* FAQ */}
      <FaqSection />

      {/* ─── CTA BAND ─── */}
      <section className="cta-gradient relative overflow-hidden" aria-labelledby="cta-heading">
        {/* floating glow orbs inside the gradient */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-[10%] top-[-20%] h-[50vh] w-[50vh] rounded-full bg-white/[0.04] blur-[80px]" />
          <div className="absolute -right-[5%] bottom-[-15%] h-[40vh] w-[40vh] rounded-full bg-white/[0.03] blur-[80px]" />
        </div>
        <div className="relative mx-auto flex max-w-[1600px] flex-col items-start gap-8 px-6 lg:px-16 py-16 sm:py-20 lg:py-24 lg:flex-row lg:items-center lg:justify-between">
          <Reveal variant="left">
            <h2 id="cta-heading" className="max-w-xl font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-honeydew">
              Let's build the loop that
              <span className="text-honeydew/80"> runs your business.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm sm:text-base text-honeydew/60">
              Book a free strategy call. We'll map your workflows, find the bottlenecks, and show you exactly what can run on autopilot.
            </p>
          </Reveal>
          <Reveal delay={120} variant="right">
            <div className="flex flex-col items-start gap-3">
              <MagneticButton className="!bg-honeydew !text-space px-8 py-4 text-base font-bold hover:shadow-[0_12px_28px_rgba(241,250,238,0.25)]" onClick={openBooking}>
                Book a call
              </MagneticButton>
              <span className="text-xs text-honeydew/40">Free strategy session - No commitment - 30 minutes</span>
            </div>
          </Reveal>
        </div>
      </section>

      </main>
      </div>

      {/* ─── PARALLAX FOOTER ─── */}
      <footer
        className="fixed bottom-0 left-0 z-[2] flex h-screen w-full flex-col justify-between bg-space"
        style={{ isolation: 'isolate', overflow: 'clip', contain: 'layout style paint', willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
        role="contentinfo"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${glyphMark})`,
            opacity: 0.02,
            backgroundSize: '120px',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-[18%] right-[-6%] w-[70vw] max-w-[900px] opacity-[0.04]"
          aria-hidden
        >
          <InfinityGlyph color="#a8dadc" className="h-auto w-full" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 lg:px-16">
          <Reveal variant="blur">
            <span className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-frosted/50">
              <span className="h-px w-8 bg-strawberry" />
              Keep it in motion
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="max-w-4xl font-display text-4xl sm:text-6xl lg:text-7xl xl:text-[8rem] font-extrabold leading-[0.95] tracking-tight text-honeydew">
              Let's build the
              <span className="text-strawberry"> loop.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <a
              href="mailto:hello@invio.social"
              className="nav-link mt-8 inline-flex w-fit items-center gap-3 text-lg font-medium text-honeydew/80 transition-colors duration-300 hover:text-strawberry"
            >
              hello@invio.social
              <span aria-hidden>&rarr;</span>
            </a>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-6 lg:px-16">
          <div className="flex flex-col justify-between gap-8 sm:gap-10 py-8 sm:py-10 sm:flex-row" style={{ boxShadow: 'inset 0 1px 0 0 rgba(241,250,238,0.1)' }}>
            <div>
              <Logo light />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-frosted/60">
                Website + automation systems that keep moving so you don't have to.
              </p>
            </div>
            <div className="flex gap-10 sm:gap-16 flex-wrap">
              <div className="flex flex-col gap-2">
                <span className="mb-1 text-xs uppercase tracking-widest text-frosted/50">
                  Agency
                </span>
                {NAV.map((n) => (
                  <a
                    key={n}
                    href={`#${n.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-honeydew/60 transition-colors duration-200 hover:text-honeydew"
                  >
                    {n}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <span className="mb-1 text-xs uppercase tracking-widest text-frosted/50">
                  Connect
                </span>
                {[
                  { label: 'hello@invio.social', href: 'mailto:hello@invio.social' },
                  { label: 'LinkedIn', href: '#' },
                  { label: 'X / Twitter', href: '#' },
                ].map((n) => (
                  <a
                    key={n.label}
                    href={n.href}
                    className="text-sm text-honeydew/60 transition-colors duration-200 hover:text-honeydew"
                  >
                    {n.label}
                  </a>
                ))}
                <span className="mb-1 mt-4 text-xs uppercase tracking-widest text-frosted/50">
                  Stay in the loop
                </span>
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-6 lg:px-16 pb-8">
          <div className="flex items-center justify-between pt-6" style={{ boxShadow: 'inset 0 1px 0 0 rgba(241,250,238,0.06)' }}>
            <span className="text-xs text-frosted/40">
              &copy; 2026 Invio Social. All rights reserved.
            </span>
            <img
              src={glyphMark}
              alt="Invio Social brand mark"
              className="h-8 w-8 rounded-[3px] bg-honeydew object-contain p-0.5"
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
