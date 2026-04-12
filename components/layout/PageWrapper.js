'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';

// Lazy-load below-the-fold components to reduce initial JS bundle
const Footer = dynamic(() => import('./Footer'), {
  loading: () => <footer className="bg-[hsl(var(--color-primary))] h-64" />,
});
const WhatsAppButton = dynamic(() => import('../ui/WhatsAppButton'), {
  ssr: false,
});

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export default function PageWrapper({ children, hideFooter = false }) {
  return (
    <>
      <Navbar />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen"
      >
        {children}
      </motion.main>
      {!hideFooter && <Footer />}
      <WhatsAppButton />
    </>
  );
}

