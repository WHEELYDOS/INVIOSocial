"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ---------------------------------------------------------------------------
// Utility: detect fine pointer (mouse) vs touch/coarse pointer
// ---------------------------------------------------------------------------
function useHasPointer() {
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
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
// CustomCursor — High-end Double Cursor (Dot + Trailer) with mix-blend-mode
// ---------------------------------------------------------------------------
export function CustomCursor() {
  const hasPointer = useHasPointer();
  const reducedMotion = usePrefersReducedMotion();

  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast spring for the inner dot
  const dotSpringConfig = reducedMotion
    ? { damping: 100, stiffness: 1000 }
    : { damping: 25, stiffness: 400, mass: 0.2 };
    
  // Slower, liquid spring for the outer ring/trailer
  const ringSpringConfig = reducedMotion
    ? { damping: 100, stiffness: 1000 }
    : { damping: 30, stiffness: 150, mass: 0.6 };

  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    if (!hasPointer) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;

      // Look for the closest interactive element or one explicitly stating data-cursor
      const interactiveEl = target.closest(
        "button, a, input, textarea, .cursor-interactive, [data-cursor]"
      );

      if (interactiveEl) {
        setIsHovering(true);
        // Extract optional custom text like 'VIEW' or 'DRAG'
        const customText = interactiveEl.getAttribute("data-cursor");
        setHoverText(customText || "");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [hasPointer, mouseX, mouseY]);

  if (!hasPointer) return null;

  return (
    <>
      {/* INNER DOT (Fast) */}
      <motion.div
        aria-hidden="true"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        animate={{
          width: isHovering ? 0 : 8,
          height: isHovering ? 0 : 8,
          backgroundColor: "rgba(255, 255, 255, 1)",
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />

      {/* OUTER RING / HOVER STATE (Slow, Flowing) */}
      <motion.div
        aria-hidden="true"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center rounded-full mix-blend-difference"
        animate={{
          width: isHovering ? 72 : 36,
          height: isHovering ? 72 : 36,
          backgroundColor: isHovering 
            ? "rgba(255, 255, 255, 1)" 
            : "rgba(255, 255, 255, 0)",
          border: isHovering 
            ? "0px solid rgba(255, 255, 255, 0)" 
            : "1px solid rgba(255, 255, 255, 0.4)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      >
        {/* Optional text revealed on hover inside the expanded cursor */}
        {hoverText && isHovering && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-[10px] uppercase font-bold text-black tracking-widest mix-blend-difference whitespace-nowrap"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}

export function MouseSpotlight() {
  return null;
}
