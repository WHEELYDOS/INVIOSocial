import { lazy, Suspense, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/* Low-end device detection                                            */
/* Skip the heavy Spline WebGL scene on devices that can't handle it  */
/* ------------------------------------------------------------------ */

function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return true;

  // Navigator hints (Chromium-based browsers)
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    connection?: { effectiveType?: string; saveData?: boolean };
  };

  // Very low memory (≤ 2GB)
  if (nav.deviceMemory && nav.deviceMemory <= 2) return true;

  // Very few CPU cores
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return true;

  // Slow connection or data-saver mode
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType === '2g' || nav.connection?.effectiveType === 'slow-2g') return true;

  // Touch device with small screen (likely a phone)
  if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 768) return true;

  return false;
}

/* ------------------------------------------------------------------ */
/* Lazy-loaded Spline (only downloaded on capable devices)             */
/* ------------------------------------------------------------------ */

const LazySpline = lazy(() => import('@splinetool/react-spline'));

/* ------------------------------------------------------------------ */
/* Lightweight CSS fallback for low-end devices                        */
/* Animated gradient orb that echoes the 3D scene's visual feel       */
/* ------------------------------------------------------------------ */

function HeroFallback() {
  return (
    <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden xl:h-[700px] flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(69,123,157,0.3) 0%, rgba(168,218,220,0.15) 40%, transparent 70%)',
          animation: 'aurora-a 12s ease-in-out infinite',
        }}
      />
      {/* Inner accent */}
      <div
        className="absolute rounded-full"
        style={{
          width: '35%',
          height: '35%',
          background: 'radial-gradient(circle, rgba(168,218,220,0.25) 0%, rgba(69,123,157,0.1) 50%, transparent 75%)',
          animation: 'aurora-b 16s ease-in-out infinite',
        }}
      />
      {/* Strawberry dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: '8%',
          height: '8%',
          background: 'radial-gradient(circle, rgba(230,57,70,0.35), transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Loading placeholder (shown while Spline downloads)                  */
/* ------------------------------------------------------------------ */

function SplineLoadingPlaceholder() {
  return (
    <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden xl:h-[700px] flex items-center justify-center">
      <div
        className="absolute rounded-full opacity-50"
        style={{
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(69,123,157,0.2), transparent 70%)',
          animation: 'aurora-a 8s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main export                                                         */
/* ------------------------------------------------------------------ */

export default function HeroScene() {
  const lowEnd = useMemo(() => isLowEndDevice(), []);

  if (lowEnd) {
    return <HeroFallback />;
  }

  return (
    <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden xl:h-[700px] flex items-center justify-center" style={{ pointerEvents: 'none' }}>
      <div className="w-full h-full scale-[1.3] sm:scale-[1.5] md:scale-[1.3] origin-center">
        <Suspense fallback={<SplineLoadingPlaceholder />}>
          <LazySpline
            scene="https://prod.spline.design/6yD6FSIerDpK6Xmx/scene.splinecode"
          />
        </Suspense>
      </div>
    </div>
  );
}
