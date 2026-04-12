'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * Wraps children with framer-motion's LazyMotion provider.
 * Uses `domAnimation` feature set (tree-shakeable, ~16 KB instead of ~60 KB)
 * which includes all DOM animation features but excludes layout animations
 * and advanced features like AnimatePresence layout transitions.
 * 
 * Components should use `m` instead of `motion` for tree-shaking benefits,
 * but `motion` still works — it just won't benefit from reduced bundle size
 * for that specific usage.
 */
export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      {children}
    </LazyMotion>
  );
}
