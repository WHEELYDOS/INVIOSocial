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
import HeroMockup from '@/HeroMockup'
import BookingModal from '@/BookingModal'
import { subscribeNewsletter } from '@/supabase'
import Lenis from 'lenis'

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
  // The wordmark ships on its own honeydew field; on dark surfaces we keep it
  // on a small honeydew chip so it never sits directly on Deep Space Blue.
  return (
    <img
      src={wordmark}
      alt="Invio Social"
      className={
        light
          ? 'h-11 w-auto select-none rounded-[3px] bg-honeydew px-2 py-1'
          : 'h-10 w-auto select-none'
      }
      style={{ mixBlendMode: light ? 'normal' : 'multiply' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Scroll reveal wrapper                                               */
/* ------------------------------------------------------------------ */

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'blur'
const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: '',
  left: 'rv-left',
  right: 'rv-right',
  scale: 'rv-scale',
  blur: 'rv-blur',
}

function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className = '',
}: {
  children: ReactNode
  delay?: number
  variant?: RevealVariant
  className?: string
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
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

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

/* scroll-linked parallax — moves an element as it passes through the viewport */
function useParallax(strength = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      el.style.transform = `translate3d(0, ${(-center * strength).toFixed(1)}px, 0)`
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
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}

/* top-of-page scroll progress bar */
function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(h > 0 ? window.scrollY / h : 0)
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
    <div className="fixed left-0 top-0 z-[95] h-[3px] w-full bg-transparent">
      <div
        className="h-full origin-left bg-strawberry"
        style={{ transform: `scaleX(${p})`, transition: 'transform 0.1s linear' }}
      />
    </div>
  )
}

/* thin looping divider that draws itself into view */
function LoopDivider() {
  const ref = useRef<SVGPathElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setInView(true), obs.disconnect()),
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div className="mx-auto flex max-w-[1600px] justify-center px-6 lg:px-16 py-4">
      <svg width="120" height="42" viewBox="0 0 84 60" fill="none" aria-hidden>
        <path
          ref={ref}
          d={INFINITY_PATH}
          stroke="#457b9d"
          strokeWidth={2}
          strokeLinecap="round"
          style={{
            strokeDasharray: 320,
            strokeDashoffset: inView ? 0 : 320,
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section content                                                     */
/* ------------------------------------------------------------------ */

const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Why Us', href: '#why' },
  { label: 'Work', href: '#work' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

const SERVICES = [
  {
    title: 'Web Design',
    desc: 'Sharp, fast marketing sites and product surfaces built to convert — designed pixel-first and engineered to load in a blink.',
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
    desc: 'Content engines that schedule, publish and report on autopilot — a loop that keeps your brand in motion without a person babysitting it.',
    icon: 'M12 3v18M3 12h18',
    features: ['Scheduling', 'Auto-reporting', 'Content ops'],
  },
  {
    title: 'Integrations',
    desc: 'Every platform wired into one loop — data flows where it should, nothing leaks, and every tool finally speaks the same language.',
    icon: 'M8 8h8v8H8z M4 12h4 M16 12h4',
    features: ['CRM + billing', 'Webhooks', 'Single source'],
  },
]

const STEPS = [
  { n: '01', t: 'Map', d: 'We chart every manual handoff across your stack.' },
  { n: '02', t: 'Build', d: 'We wire the loops — designed, tested, documented.' },
  { n: '03', t: 'Launch', d: 'Systems go live with monitoring from day one.' },
  { n: '04', t: 'Refine', d: 'The loop learns; we tune it as you scale.' },
]

const METRICS = [
  { v: '93%', l: 'less manual work for a 39-person ops team' },
  { v: '5.1x', l: 'faster lead response after automating intake' },
  { v: '17k', l: 'hours returned to clients across last year' },
]

const QUOTES = [
  {
    q: 'Invio rebuilt our entire intake as one loop. What took three people now runs while we sleep.',
    n: 'Dana Whitfield',
    r: 'COO, Northwind Labs',
    initials: 'DW',
    avatar: '#457b9d',
  },
  {
    q: 'The site is sharp and the automation behind it is sharper. Leads never sit idle anymore.',
    n: 'Marcus Reyes',
    r: 'Founder, Cadence Studio',
    initials: 'MR',
    avatar: '#e63946',
  },
  {
    q: 'We went from 12 manual steps to 2 clicks. The ROI paid for the project in the first month.',
    n: 'Aisha Patel',
    r: 'Head of Ops, Meridian Health',
    initials: 'AP',
    avatar: '#a8dadc',
  },
]

/* Why-choose-us advantages — alternating stat / narrative halves */
const ADVANTAGES = [
  {
    n: '01',
    t: 'Engineered for Speed',
    d: 'We hand-code every surface without clunky builders, ensuring your site loads in a blink. Performance is the foundation.',
    stat: '0.8s',
    label: 'Average load time',
    icon: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  },
  {
    n: '02',
    t: 'Built to Scale',
    d: 'We architect robust systems that grow with you — from startup to enterprise, without rebuilding.',
    stat: '10x',
    label: 'Growth handled without changes',
    icon: 'M12 3l7 4v10l-7 4-7-4V7z',
  },
  {
    n: '03',
    t: 'Zero Babysitting',
    d: 'Set it and forget it. Monitoring from day one means it runs silently. If something breaks, we know before you do.',
    stat: '24/7',
    label: 'Uptime monitoring included',
    icon: 'M9 12l2 2 4-4M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  },
  {
    n: '04',
    t: 'Transparent Pricing',
    d: 'No hidden fees, no surprise invoices. You see the full scope and cost before we write a single line.',
    stat: '$0',
    label: 'Hidden fees, ever',
    icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM14.5 9.2A2.4 2.4 0 0 0 12 7.5c-1.4 0-2.5.9-2.5 2s1.1 2 2.5 2 2.5.9 2.5 2-1.1 2-2.5 2a2.4 2.4 0 0 1-2.5-1.7M12 6v1.5M12 16.5V18',
  },
]

const FAQS = [
  {
    q: 'How long does a typical website project take?',
    a: 'Most builds ship in three to five weeks. We map the loops in week one, wire and test through the middle, and launch with monitoring on — timelines flex with scope, never with polish.',
  },
  {
    q: 'What does "automation" actually mean for my business?',
    a: 'It means the repetitive work your team does by hand - moving data between tools, sending follow-ups, generating reports - gets wired into self-running pipelines. You set the rules once, and the system handles the rest.',
  },
  {
    q: 'Do I need to know how to code to manage the systems you build?',
    a: "No. Everything ships with plain-language controls and a short walkthrough. If you can send an email, you can steer the loop — and we're one message away when you want a change.",
  },
  {
    q: 'What happens if something breaks after launch?',
    a: 'We monitor every system from day one, so we usually catch issues before you notice them. When something does slip, alerts reach us first and fixes go out fast.',
  },
  {
    q: 'How much does a project cost?',
    a: 'It scales with scope — a focused site starts lean, a full automation stack more. You see the entire number before we write a single line, with no surprises after.',
  },
]

/* Big always-running type strip — filled + outlined words on a light band */
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
    <div className="overflow-hidden border-y border-space/10 bg-honeydew py-8 sm:py-12">
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
                    className="whitespace-nowrap px-8 font-heading text-6xl font-extrabold tracking-tight sm:text-7xl xl:text-8xl"
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

/* Interactive card — cursor spotlight + gentle 3D tilt on hover. */
function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const rx = (y / r.height - 0.5) * -6
    const ry = (x / r.width - 0.5) * 6
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`
  }
  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`spotlight group relative h-full overflow-hidden border border-white/10 bg-panel transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-steel/60 hover:shadow-[0_20px_50px_-12px_rgba(4,16,31,0.7)] ${className}`}
      style={{ borderRadius: 6, transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* cursor-follow glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(340px circle at var(--mx) var(--my), rgba(168,218,220,0.16), transparent 60%)',
        }}
      />
      {/* top accent line grows on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-steel via-frosted to-strawberry transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      {children}
    </div>
  )
}

/* number counts up when it scrolls into view */
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
        const dur = 1500
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur)
          const eased = 1 - Math.pow(1 - t, 3)
          setDisplay((num * eased).toFixed(decimals) + suffix)
          if (t < 1) requestAnimationFrame(tick)
          else setDisplay(value)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
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

function ArrowCta({
  children = 'Book a call',
  onClick,
  className = '',
}: {
  children?: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 bg-strawberry px-6 py-3 font-display text-sm font-semibold text-honeydew transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(230,57,70,0.35)] cursor-pointer ${className}`}
      style={{ borderRadius: 3 }}
    >
      {children}
      <span className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </button>
  )
}

/* Light-surface card — white on the honeydew bands, with a steel cursor
   spotlight and a gentle lift. Mirror of SpotlightCard for pale sections. */
function LightCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const rx = (y / r.height - 0.5) * -5
    const ry = (x / r.width - 0.5) * 5
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`
  }
  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group relative h-full overflow-hidden rounded-2xl border border-space/10 bg-white transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_30px_60px_-24px_rgba(29,53,87,0.4)] ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', boxShadow: '0 18px 40px -28px rgba(29,53,87,0.35)' }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--mx) var(--my), rgba(69,123,157,0.10), transparent 60%)',
        }}
      />
      {children}
    </div>
  )
}

/* five-star rating, amber fills */
function Stars() {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f4a01c">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.5 6.8L12 17.6 5.8 20.4l1.5-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  )
}

/* single FAQ row — expands on click, +/× toggle */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-honeydew/12">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-lg font-semibold text-honeydew sm:text-xl">
          {q}
        </span>
        <span
          className="grid h-6 w-6 shrink-0 place-items-center text-2xl font-light text-steel transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-base leading-relaxed text-frosted/75">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

/* A single loose brush-stroke, echoing the marker doodles in the brand. */
function Brush({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 200"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M20 150 C40 60 120 40 160 90 C200 140 250 120 280 50"
        stroke="currentColor"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <path
        d="M55 175 C90 120 150 130 200 150"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* Moving background graphics for the hero — drifting brush strokes over a
   faint navy wash + softly panning grid. Sits behind the hero content. */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* faint ambient wash */}
      <div
        className="absolute -left-[10%] top-[-20%] h-[70vh] w-[70vh] rounded-full blur-[110px]"
        style={{
          background:
            'radial-gradient(circle, rgba(69,123,157,0.18), transparent 65%)',
          animation: 'aurora-a 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[30%] h-[55vh] w-[55vh] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(230,57,70,0.10), transparent 65%)',
          animation: 'aurora-b 26s ease-in-out infinite reverse',
        }}
      />

      {/* big drifting brush scribbles, concentrated behind the mockup */}
      <div
        className="bg-graphic absolute right-[6%] top-[8%] h-[70vh] w-[45vw] text-white/[0.04]"
        style={{ animation: 'drift-a 19s ease-in-out infinite' }}
      >
        <Brush className="h-full w-full" />
      </div>
      <div
        className="bg-graphic absolute right-[24%] top-[24%] h-[46vh] w-[30vw] rotate-[24deg] text-white/[0.035]"
        style={{ animation: 'drift-b 23s ease-in-out infinite' }}
      >
        <Brush className="h-full w-full" />
      </div>
      <div
        className="bg-graphic absolute left-[38%] top-[2%] h-[40vh] w-[24vw] -rotate-[18deg] text-steel/[0.06]"
        style={{ animation: 'drift-c 17s ease-in-out infinite' }}
      >
        <Brush className="h-full w-full" />
      </div>

      {/* softly panning grid, masked to the centre */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(168,218,220,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,218,220,0.5) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          maskImage:
            'radial-gradient(circle at 65% 45%, #000 20%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(circle at 65% 45%, #000 20%, transparent 70%)',
          animation: 'grid-pan 9s linear infinite',
        }}
      />
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
    }, 280)
  }, [onClose])

  if (!open && !closing) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm"
        onClick={handleClose}
        style={{
          opacity: closing ? 0 : 1,
          transition: 'opacity 0.28s ease-out',
        }}
      />
      <nav
        className={`fixed right-0 top-0 z-[61] flex h-full w-72 flex-col bg-panel/95 backdrop-blur-xl px-8 pt-20 pb-10 shadow-2xl ${closing ? 'mobile-nav-closing' : 'mobile-nav-open'}`}
        aria-label="Mobile navigation"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-frosted/80 transition-all duration-200 hover:border-strawberry/40 hover:text-honeydew cursor-pointer"
          aria-label="Close navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col gap-1">
          {NAV.map((n, i) => (
            <a
              key={n.label}
              href={n.href}
              onClick={handleClose}
              className="rounded-lg px-4 py-3 font-display text-lg font-semibold text-honeydew/80 transition-all duration-200 hover:bg-white/5 hover:text-honeydew hover:pl-6"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {n.label}
            </a>
          ))}
        </div>
        <div className="mt-auto">
          <ArrowCta onClick={() => { handleClose(); onBooking() }}>Start a project</ArrowCta>
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
        type="button"
        onClick={onOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-strawberry text-honeydew shadow-[0_8px_24px_rgba(230,57,70,0.4)] transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
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
/* Footer Newsletter Form                                              */
/* ------------------------------------------------------------------ */

function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }
    setStatus('loading')
    const res = await subscribeNewsletter(email.trim())
    if (res.success) {
      setStatus('success')
      setMessage(res.message)
      setEmail('')
    } else {
      setStatus('error')
      setMessage(res.message)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-honeydew/15 bg-white/[0.04] py-1.5 pl-4 pr-1.5"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="text-frosted/60">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== 'idle') setStatus('idle')
          }}
          disabled={status === 'loading'}
          placeholder={status === 'success' ? 'Subscribed!' : 'your@email.com'}
          className="w-40 bg-transparent text-sm text-honeydew placeholder:text-frosted/50 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-1 rounded-full bg-steel px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-frosted hover:text-space cursor-pointer disabled:opacity-50"
        >
          {status === 'loading' ? '...' : status === 'success' ? '✓' : 'Join →'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-1 pl-3 text-[11px] text-red-400">{message}</p>
      )}
      {status === 'success' && (
        <p className="mt-1 pl-3 text-[11px] text-green-400">{message}</p>
      )}
    </div>
  )
}

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string | undefined>()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const openBooking = useCallback((service?: string) => {
    setSelectedService(service)
    setBookingModalOpen(true)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    // smooth-scroll in-page anchor links
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!
      if (id.length > 1) {
        const el = document.querySelector(id)
        if (el) {
          e.preventDefault()
          lenis.scrollTo(el as HTMLElement, { offset: -80 })
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
      {/* The whole page rides above a full-viewport footer, sliding up to
          reveal it — a classic parallax-reveal footer. */}
      <div
        className="relative z-10 bg-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
        style={{ marginBottom: '100vh' }}
      >
      {/* ambient depth glows, fixed inside the scrolling stage */}
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
      <IntroSequence onDone={() => {}} />
      <FloatingCta onOpen={() => openBooking()} />
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onBooking={() => openBooking()}
      />
      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        defaultService={selectedService}
      />

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 lg:px-16 py-4">
          <Logo light />
          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-sm font-medium text-frosted/80 transition-colors hover:text-honeydew"
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <ArrowCta onClick={() => openBooking()}>Start a project</ArrowCta>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-frosted/80 transition-all duration-200 hover:border-steel/40 hover:text-honeydew md:hidden cursor-pointer"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* moving background graphics — drifting brush strokes + faint ambient */}
        <HeroBackdrop />
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-8 px-6 lg:px-16 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-24">
          <div>
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-steel/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-frosted/80"
              style={{
                animation: 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
              }}
            >
              <span className="h-2 w-2 rounded-full bg-steel" /> Website ·
              Automation · Growth
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-honeydew sm:text-6xl lg:text-7xl xl:text-[7.5rem]">
              <span
                className="block"
                style={{
                  animation:
                    'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                }}
              >
                Automation
              </span>
              <span
                className="block"
                style={{
                  animation:
                    'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}
              >
                that <span className="text-strawberry">runs</span>
              </span>
              <span
                className="relative block w-fit"
                style={{
                  animation:
                    'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both',
                }}
              >
                <span className="text-strawberry">itself.</span>
                {/* hand-drawn underline swoosh */}
                <svg
                  className="absolute -bottom-3 left-0 w-[62%]"
                  viewBox="0 0 200 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 11 C55 3 130 3 197 8"
                    stroke="#457b9d"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="220"
                    strokeDashoffset="220"
                    style={{ animation: 'dash-draw 0.9s ease-out 0.7s forwards' }}
                  />
                </svg>
              </span>
            </h1>
            <p
              className="mt-6 max-w-md text-lg leading-relaxed text-frosted/80 xl:max-w-lg xl:text-xl"
              style={{
                animation: 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both',
              }}
            >
              We design sharp websites and wire the automation loops behind them —
              so your business keeps moving while you don't have to.
            </p>
            <div
              className="mt-8 flex flex-wrap items-center gap-4"
              style={{
                animation:
                  'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.55s both',
              }}
            >
              <ArrowCta onClick={() => openBooking()}>Book a call</ArrowCta>
              <a
                href="#services"
                className="border border-steel px-6 py-3 font-display text-sm font-semibold text-frosted/80 transition-colors duration-200 hover:bg-steel hover:text-honeydew"
                style={{ borderRadius: 3 }}
              >
                See what we build
              </a>
            </div>
            {/* trusted-by — overlapping avatars + marker note */}
            <div
              className="mt-9 flex items-center gap-3"
              style={{
                animation: 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.7s both',
              }}
            >
              <div className="flex -space-x-2">
                {['#457b9d', '#a8dadc', '#1d3557'].map((c) => (
                  <span
                    key={c}
                    className="h-7 w-7 rounded-full border-2 border-ink"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span className="text-steel">←</span>
              <span className="font-hand text-xl uppercase leading-none tracking-wide text-frosted/70">
                Trusted by local businesses
              </span>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* always-running type strip, straight under the hero */}
      <LogoMarquee />

      <LoopDivider />

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-[1600px] px-6 lg:px-16 py-20">
        <Reveal variant="blur">
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
              Every system.
              <br />
              One continuous loop.
            </h2>
            <span className="hidden text-sm text-frosted/80 sm:block">01 / Services</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 90} variant="scale">
              <SpotlightCard className="flex min-h-[24rem] flex-col p-9 lg:p-11">
                {/* oversized ghost numeral drifting behind the card */}
                <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[11rem] font-extrabold leading-none text-white/[0.035] transition-colors duration-500 group-hover:text-steel/[0.09]">
                  0{i + 1}
                </span>
                <div className="relative flex items-start justify-between">
                  {/* icon tile that fills + turns on hover */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-frosted transition-all duration-300 group-hover:-rotate-6 group-hover:border-steel group-hover:bg-steel/20">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    >
                      <path d={s.icon} />
                    </svg>
                  </div>
                </div>
                <h3 className="relative mt-8 font-display text-2xl font-semibold text-honeydew sm:text-3xl">
                  {s.title}
                </h3>
                <p className="relative mt-3 max-w-md flex-1 text-base leading-relaxed text-frosted/80">
                  {s.desc}
                </p>
                <div className="relative mt-8 flex flex-wrap items-center gap-2">
                  {s.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-frosted/80 transition-colors duration-300 group-hover:border-steel/40"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => openBooking(s.title)}
                  className="relative mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-steel transition-all duration-300 group-hover:gap-3 cursor-pointer text-left"
                >
                  Explore this system
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* centered mid-page CTA */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-16 pb-10 text-center">
        <Reveal variant="scale">
          <ArrowCta onClick={() => openBooking()}>Ready to automate?</ArrowCta>
          <p className="mt-4 text-sm text-frosted/70">
            Free strategy session · No commitment
          </p>
        </Reveal>
      </div>

      {/* PROCESS — light band, the automation cycle */}
      <section id="process" className="relative overflow-hidden bg-honeydew">
        {/* faint watermark loop */}
        <ParallaxLayer
          strength={0.2}
          className="pointer-events-none absolute -left-24 top-16 opacity-[0.05]"
        >
          <InfinityGlyph size={360} color="#1d3557" stroke={2} />
        </ParallaxLayer>
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-16 py-24">
          <Reveal variant="blur">
            <div className="mb-14 text-center">
              <span className="text-sm text-space/50">02 / Process</span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-space sm:text-4xl">
                The automation cycle
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120} variant="up">
                <LightCard className={`p-7 ${i % 2 ? 'lg:mt-16' : ''}`}>
                  {/* ghost numeral */}
                  <span className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-8xl font-extrabold leading-none text-space/[0.05] transition-colors duration-300 group-hover:text-steel/10">
                    {s.n}
                  </span>
                  <div className="relative">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-steel/40 font-display text-sm font-bold text-steel transition-colors duration-300 group-hover:bg-steel group-hover:text-white">
                        {s.n}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-space/15 to-transparent" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-space">
                      {s.t}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-space/60">
                      {s.d}
                    </p>
                  </div>
                </LightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US — alternating advantage rows */}
      <section id="why" className="relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-16 py-24">
          <Reveal variant="blur">
            <div className="mb-14">
              <span className="text-sm text-frosted/80">03 / Why Choose Us</span>
              <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
                Why teams partner with us
              </h2>
            </div>
          </Reveal>
          <div className="flex flex-col gap-6">
            {ADVANTAGES.map((a, i) => {
              const flip = i % 2 === 1
              const statHalf = (
                <div className="flex flex-col items-center justify-center px-8 py-14 text-center">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-frosted transition-all duration-300 group-hover:-rotate-6 group-hover:border-steel/60 group-hover:bg-steel/15">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d={a.icon} />
                    </svg>
                  </div>
                  <span className="font-display text-6xl font-extrabold tracking-tight text-honeydew sm:text-7xl">
                    {a.stat}
                  </span>
                  <span className="mt-4 text-xs uppercase tracking-[0.22em] text-steel">
                    {a.label}
                  </span>
                </div>
              )
              const textHalf = (
                <div className={`flex flex-col justify-center px-8 py-14 ${flip ? 'items-start text-left' : 'items-end text-right'}`}>
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-strawberry/40 bg-strawberry/10 px-3 py-1 text-xs font-semibold text-strawberry">
                    <span className="h-1.5 w-1.5 rounded-full bg-strawberry" />
                    Advantage {a.n}
                  </span>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
                    {a.t}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-frosted/70">
                    {a.d}
                  </p>
                  <span className="mt-6 block h-[3px] w-14 rounded-full bg-strawberry transition-all duration-500 group-hover:w-24" />
                </div>
              )
              return (
                <Reveal key={a.n} delay={i * 80} variant={flip ? 'right' : 'left'}>
                  <SpotlightCard className="grid grid-cols-1 divide-y divide-white/8 md:grid-cols-2 md:divide-x md:divide-y-0">
                    {flip ? (
                      <>
                        {textHalf}
                        {statHalf}
                      </>
                    ) : (
                      <>
                        {statHalf}
                        {textHalf}
                      </>
                    )}
                  </SpotlightCard>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* WORK / RESULTS — light band */}
      <section id="work" className="relative overflow-hidden bg-honeydew">
        <ParallaxLayer
          strength={0.2}
          className="pointer-events-none absolute -left-24 top-10 opacity-[0.05]"
        >
          <InfinityGlyph size={360} color="#1d3557" stroke={2} />
        </ParallaxLayer>
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-16 py-24">
          <Reveal variant="blur">
            <div className="mb-14">
              <span className="text-sm text-space/50">04 / Work</span>
              <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight text-space sm:text-4xl">
                Loops we've closed for teams that were drowning in busywork.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {METRICS.map((m, i) => (
              <Reveal key={m.v} delay={i * 120} variant="up">
                <LightCard className={`flex min-h-[19rem] flex-col p-9 ${i % 2 ? 'sm:mt-12' : ''}`}>
                  {/* oversized ghost glyph of the stat's unit */}
                  <span className="pointer-events-none absolute -bottom-6 right-2 select-none font-display text-[10rem] font-extrabold leading-none text-space/[0.04]">
                    {m.v.replace(/[\d.]/g, '') || '·'}
                  </span>
                  <div className="relative flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-steel/40 font-display text-xs font-bold text-steel">
                      0{i + 1}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-space/15 to-transparent" />
                  </div>
                  <div className="relative mt-auto">
                    <CountUp
                      value={m.v}
                      className="font-display text-7xl font-extrabold tracking-tight text-space sm:text-8xl"
                    />
                    <p className="mt-4 text-base leading-relaxed text-space/60">
                      {m.l}
                    </p>
                  </div>
                </LightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-[1600px] px-6 lg:px-16 py-24">
        <Reveal variant="blur">
          <div className="mb-12">
            <span className="text-sm text-frosted/80">05 / Testimonials</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
              What our clients say
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {QUOTES.map((qt, i) => (
            <Reveal key={qt.n} delay={i * 120} variant={i === 1 ? 'up' : i === 0 ? 'left' : 'right'}>
              <SpotlightCard className={`flex h-full min-h-[22rem] flex-col justify-between p-9 lg:p-10 ${i === 1 ? 'lg:mt-14' : ''}`}>
                {/* oversized quote mark */}
                <span className="pointer-events-none absolute right-6 top-3 select-none font-display text-[7rem] leading-none text-strawberry/10 transition-colors duration-500 group-hover:text-strawberry/20">
                  ”
                </span>
                <div className="relative">
                  <Stars />
                  <blockquote className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight text-honeydew sm:text-2xl">
                    "{qt.q}"
                  </blockquote>
                </div>
                <figcaption className="relative mt-8 flex items-center gap-3 border-t border-honeydew/15 pt-6">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: qt.avatar }}
                  >
                    {qt.initials}
                  </span>
                  <span>
                    <span className="block font-display text-sm font-semibold text-honeydew">
                      {qt.n}
                    </span>
                    <span className="text-xs text-frosted/70">{qt.r}</span>
                  </span>
                </figcaption>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-[1600px] px-6 lg:px-16 py-24">
        <Reveal variant="blur">
          <div className="mb-10 text-center">
            <span className="text-sm text-frosted/80">06 / FAQ</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-honeydew sm:text-4xl">
              Questions we hear most
            </h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA BAND — red gradient */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(105deg, #e84855 0%, #d0313d 44%, #7a1b3a 100%)',
        }}
      >
        <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-10 px-6 lg:px-16 py-24 lg:flex-row lg:items-center lg:justify-between">
          <Reveal variant="left">
            <h2 className="max-w-xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Let's build the loop that
              <span className="text-white/70"> runs your business.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
              Book a free strategy call. We'll map your workflows, find the
              bottlenecks, and show you exactly what can run on autopilot.
            </p>
          </Reveal>
          <Reveal delay={120} variant="right">
            <div className="lg:text-right">
              <button
                type="button"
                onClick={() => openBooking()}
                className="group inline-flex items-center gap-2 rounded-[3px] bg-honeydew px-6 py-3 font-display text-sm font-semibold text-space transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.25)] cursor-pointer"
              >
                Book a call
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
              <p className="mt-4 text-sm text-white/60">
                Free strategy session · No commitment · 30 minutes
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      </div>

      {/* PARALLAX FOOTER — a full-viewport stage revealed beneath the page */}
      <footer className="fixed bottom-0 left-0 z-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-space">
        {/* faint oversized loop mark drifting behind the footer content */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 60% at 20% 90%, rgba(69,123,157,0.28), transparent 60%), radial-gradient(55% 50% at 90% 10%, rgba(230,57,70,0.12), transparent 60%)',
          }}
          aria-hidden
        />
        <ParallaxLayer
          strength={0.12}
          className="pointer-events-none absolute -bottom-[18%] right-[-6%] w-[70vw] max-w-[900px] opacity-[0.06]"
        >
          <InfinityGlyph color="#a8dadc" className="h-auto w-full" />
        </ParallaxLayer>

        {/* top — big sign-off */}
        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 lg:px-16">
          <Reveal variant="blur">
            <span className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-frosted/70">
              <span className="h-px w-8 bg-strawberry" />
              Keep it in motion
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-honeydew sm:text-7xl xl:text-[8rem]">
              Let's build the
              <span className="text-strawberry"> loop.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <a
              href="mailto:inviosocial@gmail.com"
              className="mt-8 inline-flex items-center gap-3 text-lg font-medium text-honeydew/90 transition-colors hover:text-strawberry"
            >
              inviosocial@gmail.com
              <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>

        {/* middle — link columns */}
        <div className="relative mx-auto w-full max-w-[1600px] px-6 lg:px-16">
          <div className="flex flex-col justify-between gap-10 border-t border-honeydew/15 py-10 sm:flex-row">
            <div>
              <Logo light />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-frosted/80">
                Website + automation systems that keep moving so you don't have
                to.
              </p>
            </div>
            <div className="flex gap-16">
              <div className="flex flex-col gap-2">
                <span className="mb-1 text-xs uppercase tracking-widest text-frosted/80">
                  Agency
                </span>
                {NAV.map((n) => (
                  <a
                    key={n.label}
                    href={n.href}
                    className="text-sm text-honeydew/80 transition-colors hover:text-honeydew"
                  >
                    {n.label}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <span className="mb-1 text-xs uppercase tracking-widest text-frosted/80">
                  Connect
                </span>
                {[
                  { label: 'inviosocial@gmail.com', href: 'mailto:inviosocial@gmail.com' },
                  {
                    label: 'LinkedIn',
                    href: 'https://www.linkedin.com/company/inviosocial/',
                    external: true,
                  },
                  {
                    label: 'X / Twitter',
                    href: 'https://x.com/inviosocial',
                    external: true,
                  },
                ].map((n) => (
                  <a
                    key={n.label}
                    href={n.href}
                    target={n.external ? '_blank' : undefined}
                    rel={n.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-honeydew/80 transition-colors hover:text-honeydew"
                  >
                    {n.label}
                  </a>
                ))}
                <span className="mb-1 mt-6 text-xs uppercase tracking-widest text-frosted/80">
                  Stay in the loop
                </span>
                <FooterNewsletter />
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="relative mx-auto w-full max-w-[1600px] px-6 lg:px-16 pb-8">
          <div className="flex items-center justify-between border-t border-honeydew/10 pt-6">
            <span className="text-xs text-frosted/60">
              © 2026 Invio Social. All rights reserved.
            </span>
            <img
              src={glyphMark}
              alt="Invio Social mark"
              className="h-8 w-8 rounded-[3px] bg-honeydew object-contain p-0.5"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
