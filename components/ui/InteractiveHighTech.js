'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/**
 * MagneticWrapper: Makes any child element "magnetic" to the cursor.
 * Perfect for high-tech CTAs.
 */
export function MagneticWrapper({ children, className = '', offset = 0.35 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * offset);
    y.set((e.clientY - centerY) * offset);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * HeroParticles: Floating, pulsing data-nodes for high-tech clinical background.
 * Optimized to prevent hydration mismatch.
 */
export function HeroParticles({ count = 8, color = 'bg-[hsl(var(--color-accent))]' }) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate static random values on client mount to prevent hydration mismatch
    const p = [...Array(count)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
    }));
    setParticles(p);
    setMounted(true);
  }, [count]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 opacity-30 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 ${color} rounded-full`}
          style={{
            top: p.top,
            left: p.left,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
