'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

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

  console.log('[v0] SmoothScrollProvider rendering');

  useEffect(() => {
    console.log('[v0] SmoothScrollProvider useEffect - shouldEnableSmoothScroll:', shouldEnableSmoothScroll());
    
    if (!shouldEnableSmoothScroll()) {
      console.log('[v0] Smooth scroll disabled');
      return undefined;
    }

    try {
      const lenis = new Lenis({
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

      console.log('[v0] Lenis initialized:', !!lenis);
      lenisRef.current = lenis;

      return () => {
        lenis.destroy();
        lenisRef.current = null;
      };
    } catch (error) {
      console.error('[v0] Lenis error:', error);
      return undefined;
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      lenisRef.current?.resize();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
