"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SmoothScroller() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    // Use native hardware-accelerated momentum scrolling on touch/mobile devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    if (isTouch) return;

    let lenisInstance: import("lenis").default | null = null;
    let rafId: number;

    import("lenis").then(({ default: Lenis }) => {
      // Re-verify in case screen resized
      if (window.innerWidth < 768) return;

      lenisInstance = new Lenis({
        duration: 1.0,
        lerp: 0.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
      });

      function raf(time: number) {
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, [isAdmin]);

  return null;
}
