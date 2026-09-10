/**
 * src/ModalIllustration.tsx
 * High-detail isometric desk illustration matching the reference mockup:
 * - 3D-angled laptop with window chrome, skeleton wireframes, and checklist
 *   (IDEAS, AUTOMATE, SCALE, GROW) with glowing cyan checkmarks
 * - Sky blue sticky note with "MORE LEADS LESS MANUAL WORK"
 * - White ceramic coffee mug with "GOOD BUSINESSES GROW :)" and steam
 * - Hand-drawn chalk arrows and text: "LOCAL BUSINESSES REAL IMPACT" & "YOUR IDEAS OUR AUTOMATION"
 */

export default function ModalIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full select-none ${className}`}>
      <svg
        viewBox="0 0 470 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl overflow-visible"
      >
        <defs>
          {/* Screen gradient */}
          <linearGradient id="laptopScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10192b" />
            <stop offset="100%" stopColor="#080d16" />
          </linearGradient>

          {/* Outer Screen Bezel */}
          <linearGradient id="screenBezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Keyboard Deck Gradient */}
          <linearGradient id="deckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="40%" stopColor="#182232" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Edge Bevel Highlight */}
          <linearGradient id="edgeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Sticky note gradient */}
          <linearGradient id="stickyBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Mug body gradient */}
          <linearGradient id="mugGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="75%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Soft blur */}
          <filter id="deskGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Ambient background glow beneath desk */}
        <ellipse cx="240" cy="235" rx="160" ry="30" fill="#38bdf8" opacity="0.09" filter="url(#deskGlow)" />
        <ellipse cx="110" cy="165" rx="55" ry="35" fill="#38bdf8" opacity="0.08" filter="url(#deskGlow)" />

        {/* ── 1. STICKY NOTE (POST-IT) ON LEFT ─────────────────────── */}
        <g transform="translate(42, 110) rotate(-8)">
          {/* Drop shadow */}
          <rect x="5" y="7" width="82" height="82" rx="3" fill="#000000" opacity="0.45" />
          {/* Post-it body */}
          <rect x="0" y="0" width="82" height="82" rx="3" fill="url(#stickyBlueGrad)" />
          {/* Subtle top light crease */}
          <path d="M 0 3 Q 41 0 82 3 L 82 9 Q 41 6 0 9 Z" fill="#ffffff" opacity="0.22" />
          {/* Bottom subtle peel shadow */}
          <path d="M 68 82 L 82 68 L 82 82 Z" fill="#0369a1" opacity="0.4" />

          {/* Text: MORE LEADS LESS MANUAL WORK */}
          <text x="41" y="20" textAnchor="middle" fill="#051528" fontFamily="Inter, Manrope, sans-serif" fontWeight="900" fontSize="11" letterSpacing="-0.02em">
            MORE
          </text>
          <text x="41" y="34" textAnchor="middle" fill="#051528" fontFamily="Inter, Manrope, sans-serif" fontWeight="900" fontSize="11" letterSpacing="-0.02em">
            LEADS
          </text>
          <text x="41" y="48" textAnchor="middle" fill="#051528" fontFamily="Inter, Manrope, sans-serif" fontWeight="900" fontSize="11" letterSpacing="-0.02em">
            LESS
          </text>
          <text x="41" y="62" textAnchor="middle" fill="#051528" fontFamily="Inter, Manrope, sans-serif" fontWeight="900" fontSize="9.5" letterSpacing="-0.02em">
            MANUAL
          </text>
          <text x="41" y="75" textAnchor="middle" fill="#051528" fontFamily="Inter, Manrope, sans-serif" fontWeight="900" fontSize="10.5" letterSpacing="-0.02em">
            WORK
          </text>
        </g>

        {/* ── 2. LAPTOP (ISOMETRIC / 3D VIEW) ─────────────────────── */}
        <g id="laptop">
          {/* Desk shadow under laptop */}
          <path
            d="M 100 248 L 310 248 L 332 195 L 140 195 Z"
            fill="#000000"
            opacity="0.6"
            filter="url(#deskGlow)"
          />

          {/* Screen Outer Bezel */}
          <path
            d="M 148 42 L 314 36 C 320 36 324 39 326 45 L 335 188 L 142 192 L 140 48 C 140 44 144 42 148 42 Z"
            fill="url(#screenBezelGrad)"
            stroke="#475569"
            strokeWidth="1.8"
          />

          {/* Screen Inner Display */}
          <path
            d="M 148 47 L 314 41 C 316 41 318 43 319 46 L 327 182 L 149 185 L 146 51 C 146 48 147 47 148 47 Z"
            fill="url(#laptopScreenGrad)"
            stroke="#1e293b"
            strokeWidth="1"
          />

          {/* Screen Header Bar */}
          <path
            d="M 148 47 L 314 41 L 316 66 L 147 70 Z"
            fill="#131e33"
          />
          {/* Window Title "INVIO" */}
          <text
            x="158"
            y="61"
            fill="#ffffff"
            fontFamily="Inter, Manrope, sans-serif"
            fontWeight="900"
            fontSize="10"
            letterSpacing="0.05em"
          >
            INVIO
          </text>
          {/* Window Header Right Controls */}
          <circle cx="304" cy="51" r="3.5" fill="#334155" />
          <circle cx="292" cy="52" r="2.5" fill="#38bdf8" />

          {/* Left Wireframe Skeleton Bars on Screen */}
          <line x1="154" y1="79" x2="198" y2="78" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="154" y1="90" x2="188" y2="89" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <line x1="154" y1="101" x2="194" y2="100" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <line x1="154" y1="112" x2="182" y2="111" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <line x1="154" y1="125" x2="196" y2="124" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="154" y1="136" x2="186" y2="135" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <line x1="154" y1="147" x2="192" y2="146" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

          {/* Screen Center Divider */}
          <line x1="208" y1="74" x2="210" y2="178" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 2" />

          {/* ── Checklist Items on Screen ── */}
          {/* 1. IDEAS */}
          <g transform="translate(218, 77)">
            <rect x="0" y="0" width="13" height="13" rx="2.5" fill="#081b30" stroke="#38bdf8" strokeWidth="1.6" />
            <path d="M 3 6.5 L 5.5 10 L 10.5 3.5" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="19" y="10.5" fill="#f8fafc" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.04em">
              IDEAS
            </text>
          </g>

          {/* 2. AUTOMATE */}
          <g transform="translate(219, 101)">
            <rect x="0" y="0" width="13" height="13" rx="2.5" fill="#081b30" stroke="#38bdf8" strokeWidth="1.6" />
            <path d="M 3 6.5 L 5.5 10 L 10.5 3.5" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="19" y="10.5" fill="#f8fafc" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.04em">
              AUTOMATE
            </text>
          </g>

          {/* 3. SCALE */}
          <g transform="translate(220, 125)">
            <rect x="0" y="0" width="13" height="13" rx="2.5" fill="#081b30" stroke="#38bdf8" strokeWidth="1.6" />
            <path d="M 3 6.5 L 5.5 10 L 10.5 3.5" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="19" y="10.5" fill="#f8fafc" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.04em">
              SCALE
            </text>
          </g>

          {/* 4. GROW */}
          <g transform="translate(221, 149)">
            <rect x="0" y="0" width="13" height="13" rx="2.5" fill="#081b30" stroke="#38bdf8" strokeWidth="1.6" />
            <path d="M 3 6.5 L 5.5 10 L 10.5 3.5" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="19" y="10.5" fill="#38bdf8" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="10" letterSpacing="0.04em">
              GROW
            </text>
          </g>

          {/* ── Laptop Base & Keyboard Deck ── */}
          {/* Deck Body */}
          <path
            d="M 142 190 L 335 186 L 316 246 C 314 248 311 250 307 250 L 118 250 C 113 250 109 248 108 244 Z"
            fill="url(#deckGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Front Beveled Edge Highlight */}
          <path
            d="M 108 244 L 118 250 L 307 250 L 316 246 L 313 252 L 112 252 Z"
            fill="url(#edgeHighlight)"
          />

          {/* Keyboard Inset Well */}
          <path
            d="M 148 193 L 322 190 L 307 225 L 130 227 Z"
            fill="#090f1b"
            stroke="#1e293b"
            strokeWidth="1"
          />

          {/* Keyboard Keys Rows */}
          <g stroke="#263449" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
            <line x1="149" y1="197" x2="318" y2="194" />
            <line x1="145" y1="204" x2="314" y2="201" />
            <line x1="141" y1="211" x2="311" y2="208" />
            <line x1="136" y1="219" x2="308" y2="216" />
          </g>

          {/* Key Vertical Dividers */}
          <g stroke="#1a2538" strokeWidth="1" opacity="0.6">
            <line x1="162" y1="197" x2="157" y2="220" />
            <line x1="179" y1="196" x2="175" y2="219" />
            <line x1="196" y1="196" x2="193" y2="218" />
            <line x1="213" y1="195" x2="211" y2="218" />
            <line x1="230" y1="195" x2="229" y2="217" />
            <line x1="247" y1="194" x2="247" y2="217" />
            <line x1="264" y1="194" x2="265" y2="216" />
            <line x1="281" y1="193" x2="283" y2="215" />
            <line x1="298" y1="192" x2="301" y2="214" />
          </g>

          {/* Trackpad */}
          <path
            d="M 196 230 L 254 229 L 252 246 L 194 246 Z"
            fill="#121b2c"
            stroke="#334155"
            strokeWidth="1"
            rx="1.5"
          />
        </g>

        {/* ── 3. COFFEE MUG (RIGHT OF LAPTOP) ──────────────────────── */}
        <g id="coffeeMug" transform="translate(332, 128)">
          {/* Mug shadow */}
          <ellipse cx="28" cy="80" rx="22" ry="8" fill="#000000" opacity="0.5" filter="url(#deskGlow)" />

          {/* Steam Doodle Waves */}
          <g stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9">
            <path d="M 20 8 C 15 -1, 25 -8, 19 -17 C 16 -23, 22 -28, 19 -33" />
            <path d="M 31 6 C 26 -2, 34 -10, 29 -19 C 26 -25, 32 -31, 30 -35" />
            <path d="M 41 9 C 37 2, 45 -5, 41 -12" />
          </g>

          {/* Handle */}
          <path
            d="M 48 30 C 64 32, 64 60, 48 64"
            fill="none"
            stroke="#0b111e"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 48 30 C 64 32, 64 60, 48 64"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Mug Body */}
          <path
            d="M 6 24 L 9 72 C 9 79, 18 82, 29 82 C 40 82, 49 79, 49 72 L 52 24 Z"
            fill="url(#mugGrad)"
            stroke="#0b111e"
            strokeWidth="2.2"
          />

          {/* Mug Inner Rim & Coffee */}
          <ellipse cx="29" cy="24" rx="23" ry="7" fill="#1c0f08" stroke="#0b111e" strokeWidth="2.2" />
          <ellipse cx="29" cy="24" rx="19.5" ry="5.2" fill="#30190e" />
          <path d="M 19 23 Q 28 21 37 23" stroke="#78472a" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Mug Typography: GOOD BUSINESSES GROW :) */}
          <text x="29" y="41" textAnchor="middle" fill="#0b111e" fontFamily="Inter, Manrope, sans-serif" fontWeight="900" fontSize="8" letterSpacing="-0.02em">
            GOOD
          </text>
          <text x="29" y="52" textAnchor="middle" fill="#0b111e" fontFamily="Inter, Manrope, sans-serif" fontWeight="900" fontSize="7" letterSpacing="-0.02em">
            BUSINESSES
          </text>
          <text x="29" y="63" textAnchor="middle" fill="#0b111e" fontFamily="Inter, Manrope, sans-serif" fontWeight="900" fontSize="8.5" letterSpacing="-0.02em">
            GROW
          </text>
          <text x="29" y="74" textAnchor="middle" fill="#0b111e" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="9">
            :)
          </text>
        </g>

        {/* ── 4. CHALK DOODLE ANNOTATIONS ─────────────────────────── */}

        {/* Bottom Left: LOCAL BUSINESSES REAL IMPACT */}
        <g id="localBusinessesDoodle">
          <text x="44" y="246" fill="#94a3b8" fontFamily="Caveat, cursive" fontWeight="700" fontSize="15" letterSpacing="0.04em">
            LOCAL
          </text>
          <text x="40" y="263" fill="#94a3b8" fontFamily="Caveat, cursive" fontWeight="700" fontSize="15" letterSpacing="0.04em">
            BUSINESSES
          </text>
          <text x="38" y="280" fill="#94a3b8" fontFamily="Caveat, cursive" fontWeight="700" fontSize="15" letterSpacing="0.04em">
            REAL IMPACT
          </text>

          {/* Chalk arrow pointing up-right towards laptop */}
          <path
            d="M 66 226 C 75 220, 86 218, 96 221"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 90 215 L 96 221 L 91 227"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Bottom Right: YOUR IDEAS OUR AUTOMATION */}
        <g id="yourIdeasDoodle">
          {/* Curved chalk arrow looping around */}
          <path
            d="M 276 256 C 265 264, 266 278, 279 283 C 285 285, 292 283, 297 279"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 290 275 L 297 279 L 294 287"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="306" y="262" fill="#cbd5e1" fontFamily="Caveat, cursive" fontWeight="700" fontSize="16" letterSpacing="0.04em">
            YOUR IDEAS
          </text>
          <text x="306" y="279" fill="#cbd5e1" fontFamily="Caveat, cursive" fontWeight="700" fontSize="16" letterSpacing="0.04em">
            OUR AUTOMATION
          </text>

          {/* Cyan double scribble underline */}
          <path
            d="M 306 287 C 334 284, 362 285, 388 287"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M 318 292 C 340 289, 362 290, 380 292"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}
