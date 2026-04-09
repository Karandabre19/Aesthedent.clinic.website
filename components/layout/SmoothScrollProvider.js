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
    try {
      const Lenis = require('lenis').default;
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
    } catch (error) {
      console.warn('[v0] Lenis failed to initialize:', error);
      return undefined;
    }

    return () => {
      try {
        lenis?.destroy?.();
        lenisRef.current = null;
      } catch (error) {
        console.warn('[v0] Error destroying Lenis:', error);
      }
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        lenisRef.current?.resize?.();
      } catch (error) {
        console.warn('[v0] Error resizing Lenis:', error);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
