import { useEffect, useRef, useState, type CSSProperties } from 'react'

const INFINITY_PATH =
  'M20 30 C20 16 34 16 42 30 C50 44 64 44 64 30 C64 16 50 16 42 30 C34 44 20 44 20 30 Z'

const SESSION_KEY = 'invio-intro-played'

type Phase = 'glyph' | 'words' | 'wipe' | 'done'

const WORDS: { text: string; accent?: boolean }[] = [
  { text: 'BUILD.' },
  { text: 'AUTOMATE.', accent: true },
  { text: 'SCALE.' },
]

export default function IntroSequence({ onDone }: { onDone: () => void }) {
  // Decide synchronously so the homepage never flashes before the overlay.
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false

    // A hard refresh (or the very first visit) should replay the intro; only
    // in-session React re-mounts should be skipped via the session flag.
    const nav = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined
    const isReload = nav?.type === 'reload' || nav?.type === 'navigate'
    if (isReload) {
      sessionStorage.removeItem(SESSION_KEY)
      return true
    }
    return !sessionStorage.getItem(SESSION_KEY)
  })
  const [phase, setPhase] = useState<Phase>('glyph')
  const [wordIndex, setWordIndex] = useState(0)
  const [showSkip, setShowSkip] = useState(false)
  const timers = useRef<number[]>([])
  const finished = useRef(false)

  const finish = () => {
    if (finished.current) return
    finished.current = true
    sessionStorage.setItem(SESSION_KEY, '1')
    timers.current.forEach(clearTimeout)
    // let the wipe play, then unmount
    setPhase('wipe')
    window.setTimeout(() => {
      setActive(false)
      onDone()
    }, 700)
  }

  useEffect(() => {
    if (!active) {
      onDone()
      return
    }
    const mobile = window.matchMedia('(max-width: 640px)').matches
    const glyphMs = mobile ? 900 : 1500
    const wordMs = 400

    const t = timers.current
    t.push(window.setTimeout(() => setShowSkip(true), 1000))
    // Beat 1+2 → glyph draws, then the word flashes begin
    t.push(window.setTimeout(() => setPhase('words'), glyphMs))
    WORDS.forEach((_, i) => {
      t.push(window.setTimeout(() => setWordIndex(i), glyphMs + i * wordMs))
    })
    // Beat 4 → wipe reveal after the last word
    t.push(window.setTimeout(finish, glyphMs + WORDS.length * wordMs))

    return () => t.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!active) return null

  const wiping = phase === 'wipe'

  const overlay: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    overflow: 'hidden',
    // diagonal wipe: the whole overlay tears away along a slanted edge
    clipPath: wiping
      ? 'polygon(0 0, 0 0, -40% 100%, -40% 100%)'
      : 'polygon(0 0, 140% 0, 100% 100%, 0 100%)',
    transition: 'clip-path 0.7s cubic-bezier(0.76,0,0.24,1)',
  }

  return (
    <div style={overlay} aria-hidden>
      {/* Beat 1+2 — honeydew stage, the "8" draws itself into existence */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-honeydew"
        style={{
          opacity: phase === 'glyph' ? 1 : 0,
          transition: 'opacity 0.25s ease-out',
        }}
      >
        <svg width="180" height="128" viewBox="0 0 84 60" fill="none">
          <path
            d={INFINITY_PATH}
            stroke="#a8dadc"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={INFINITY_PATH}
            stroke="#1d3557"
            strokeWidth={3}
            strokeLinecap="round"
            style={{
              strokeDasharray: 320,
              animation: 'draw-in 1.2s cubic-bezier(0.16,1,0.3,1) 0.15s both',
            }}
          />
          <circle cx="42" cy="30" r="3" fill="#e63946">
            <animate
              attributeName="opacity"
              values="0;0;1"
              dur="1.4s"
              fill="freeze"
            />
          </circle>
        </svg>
      </div>

      {/* Beat 3 — rapid full-bleed word flashes on Deep Space Blue */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-space"
        style={{
          opacity: phase === 'words' || wiping ? 1 : 0,
          transition: 'opacity 0.15s ease-out',
        }}
      >
        {phase === 'words' && (
          <span
            key={wordIndex}
            className="inline-block font-display font-extrabold tracking-tight text-center"
            style={{
              fontSize: 'clamp(1.5rem, 8vw, 9rem)',
              color: WORDS[wordIndex].accent ? '#e63946' : '#f1faee',
              animation: 'word-flash 0.38s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {WORDS[wordIndex].text}
          </span>
        )}
      </div>

      {showSkip && !wiping && (
        <button
          onClick={finish}
          className="absolute bottom-6 right-6 z-10 text-xs font-medium uppercase tracking-widest text-steel transition-colors hover:text-strawberry"
        >
          Skip →
        </button>
      )}
    </div>
  )
}
