"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Intersection Observer hook ─────────────────────────── */

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ── Count-up animation hook ────────────────────────────── */

export function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return count;
}

/* ── Stagger delay helper ───────────────────────────────── */

export function staggerStyle(inView: boolean, index: number, baseDelay = 0) {
  const delay = baseDelay + index * 0.08;
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  } as const;
}

export function slideInLeft(inView: boolean, delay = 0) {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateX(0)" : "translateX(-40px)",
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  } as const;
}

export function slideInRight(inView: boolean, delay = 0) {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateX(0)" : "translateX(40px)",
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  } as const;
}

export function fadeIn(inView: boolean, delay = 0) {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  } as const;
}

export function scaleIn(inView: boolean, delay = 0) {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "scale(1)" : "scale(0.92)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  } as const;
}
