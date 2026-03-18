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
// CustomCursor — dot + ring that changes color based on section background
// ---------------------------------------------------------------------------
export function CustomCursor() {
  const hasPointer = useHasPointer();
  const reducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Smooth trailing for the ring via lerp
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isOverDark = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!hasPointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Determine if cursor is over a dark-background section
    const checkDarkSection = (_x: number, y: number) => {
      // Check Hero section
      const hero = document.getElementById("home");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        if (y >= rect.top && y <= rect.bottom) return true;
      }
      // Check Footer
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (y >= rect.top && y <= rect.bottom) return true;
      }
      return false;
    };

    // Update cursor colors
    const updateCursorColor = (overDark: boolean) => {
      const isDarkTheme = document.documentElement.classList.contains("dark");
      let dotColor: string;
      let ringColor: string;

      if (isDarkTheme || overDark) {
        // Over dark background → white cursor
        dotColor = "#ffffff";
        ringColor = "rgba(255, 255, 255, 0.8)";
      } else {
        // Over light background → dark cursor
        dotColor = "#191923";
        ringColor = "rgba(25, 25, 35, 0.6)";
      }

      dot.style.backgroundColor = dotColor;
      ring.style.borderColor = ringColor;
    };

    // --- Mouse move handler (passive, no state) ---
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Move the dot instantly (no lag)
      dot.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0) scale(${isHovering.current ? 1.4 : 1})`;

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
        dot.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0) scale(${interactive ? 1.4 : 1})`;
        ring.style.opacity = interactive ? "1" : "0.6";
        ring.style.borderWidth = interactive ? "2.5px" : "2px";
      }

      // Detect dark section (throttled — check every move for responsiveness)
      const overDark = checkDarkSection(e.clientX, e.clientY);
      if (overDark !== isOverDark.current) {
        isOverDark.current = overDark;
        updateCursorColor(overDark);
      }
    };

    // --- Ring lerp loop (smooth trailing) ---
    const lerpSpeed = reducedMotion ? 1 : 0.15;

    const animate = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * lerpSpeed;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * lerpSpeed;

      ring.style.transform = `translate3d(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px, 0) scale(${isHovering.current ? 1.3 : 1})`;

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    // Initial color — force update immediately and after a short delay for hydration
    const isDarkNow = document.documentElement.classList.contains("dark");
    updateCursorColor(isDarkNow);
    const timer = setTimeout(() => {
      const isDarkDelayed = document.documentElement.classList.contains("dark");
      updateCursorColor(isDarkDelayed);
    }, 150);

    // Watch for dark class changes on <html> (theme toggle)
    const observer = new MutationObserver(() => {
      const isDarkMutated = document.documentElement.classList.contains("dark");
      updateCursorColor(isDarkMutated || isOverDark.current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [hasPointer, reducedMotion, resolvedTheme]);

  // Don't render anything on touch devices
  if (!hasPointer) return null;

  // Initial color (will be updated dynamically via DOM)
  const isDarkInit = resolvedTheme === "dark";
  const initialColor = isDarkInit ? "#ffffff" : "#191923";
  const initialRingColor = isDarkInit ? "rgba(255, 255, 255, 0.8)" : "rgba(25, 25, 35, 0.6)";

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
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: initialColor,
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          transition: "background-color 0.3s ease, scale 0.15s ease-out",
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
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `2px solid ${initialRingColor}`,
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0.6,
          willChange: "transform",
          transition: "opacity 0.2s, border-width 0.2s, border-color 0.3s ease",
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
