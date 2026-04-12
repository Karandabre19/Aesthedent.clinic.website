'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function shouldEnableSmoothScroll() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const isSmallViewport = window.matchMedia('(max-width: 1024px)').matches;
  const deviceMemory = navigator.deviceMemory ?? 8;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const isLowPowerDevice = deviceMemory <= 4 || hardwareConcurrency <= 6;

  return !isLowPowerDevice && !(isTouchDevice && isSmallViewport);
}

export default function SmoothScrollProvider({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!shouldEnableSmoothScroll()) {
      return undefined;
    }

    let lenis;
    let cancelled = false;

    // Dynamically import Lenis to avoid adding ~23KB to initial bundle
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
        lerp: 0.12,
        anchors: true,
        prevent: (node) =>
          node?.closest?.(
            '[data-lenis-prevent], [data-radix-scroll-area-viewport], [data-scroll-locked]'
          ),
      });

      lenisRef.current = lenis;
    });

    return () => {
      cancelled = true;
      if (lenis) {
        lenis.destroy();
      }
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      lenisRef.current?.resize();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}

