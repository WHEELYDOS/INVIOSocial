"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// ---------------------------------------------------------------------------
// Utility: detect fine pointer (mouse) vs touch/coarse pointer
// ---------------------------------------------------------------------------
function useHasPointer() {
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    // SSR-safe: only runs in browser
    const mql = window.matchMedia("(pointer: fine)");
    setHasPointer(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setHasPointer(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return hasPointer;
}

// Detect prefers-reduced-motion
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

// ---------------------------------------------------------------------------
// CustomCursor — dot + ring, direct DOM manipulation, no React re-renders
// ---------------------------------------------------------------------------
export function CustomCursor() {
  const hasPointer = useHasPointer();
  const reducedMotion = usePrefersReducedMotion();
  const { theme } = useTheme();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Smooth trailing for the ring via lerp
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!hasPointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // --- Mouse move handler (passive, no state) ---
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Move the dot instantly (no lag)
      dot.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0) scale(${isHovering.current ? 1.5 : 1})`;

      // Check interactive target
      const target = e.target as HTMLElement;
      const interactive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        target.classList.contains("cursor-interactive");

      if (interactive !== isHovering.current) {
        isHovering.current = interactive;
        // Update dot scale
        dot.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0) scale(${interactive ? 1.5 : 1})`;
        // Update ring visual
        ring.style.opacity = interactive ? "1" : "0.5";
        ring.style.borderWidth = interactive ? "3px" : "2px";
        // Toggle mix-blend-mode for hover
        dot.style.mixBlendMode = interactive ? "difference" : "normal";
        ring.style.mixBlendMode = interactive ? "difference" : "normal";
      }
    };

    // --- Ring lerp loop (smooth trailing) ---
    const lerpSpeed = reducedMotion ? 1 : 0.15;

    const animate = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * lerpSpeed;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * lerpSpeed;

      ring.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0) scale(${isHovering.current ? 1.4 : 1})`;

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [hasPointer, reducedMotion]);

  // Don't render anything on touch devices
  if (!hasPointer) return null;

  // Colors based on theme
  const cursorColor = theme === "light" ? "#000000" : "#0E79B2";

  return (
    <>
      {/* Cursor dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: cursorColor,
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          transition: "background-color 0.3s, scale 0.15s ease-out",
        }}
      />

      {/* Cursor ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `2px solid ${cursorColor}`,
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0.5,
          willChange: "transform",
          transition: "opacity 0.2s, border-width 0.2s, border-color 0.3s",
        }}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// MouseSpotlight — subtle gradient glow following the mouse
// ---------------------------------------------------------------------------
export function MouseSpotlight() {
  const hasPointer = useHasPointer();
  const reducedMotion = usePrefersReducedMotion();
  const spotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!hasPointer) return;

    const el = spotRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const lerpSpeed = reducedMotion ? 1 : 0.08;

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * lerpSpeed;
      pos.current.y += (mouse.current.y - pos.current.y) * lerpSpeed;

      el.style.transform = `translate3d(${pos.current.x - 192}px, ${pos.current.y - 192}px, 0)`;

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [hasPointer, reducedMotion]);

  if (!hasPointer) return null;

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 384,
        height: 384,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(14,121,178,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 9998,
        willChange: "transform",
      }}
    />
  );
}
