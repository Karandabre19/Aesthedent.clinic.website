'use client';

import { X, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

const WhatsAppIcon = ({ className }) => (
  <svg 
    viewBox="0 0 448 512" 
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.4 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.3 2.5-2.4 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.4-29.8-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6-3.2-.1-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

function MagneticAction({ children, className, glowColor }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${glowColor} animate-pulse-slow`} />
      <div className={className}>
        {children}
      </div>
    </motion.div>
  );
}

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [showBubble, setShowBubble] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isExperiencePage = pathname === '/aesthedent-experience';

  const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';
  const instagramLink = 'https://www.instagram.com/drwathodkar_aesthedent_clinic?igsh=azFlYTc2b25xaDFn';

  const getClinicStatus = () => {
    const day = currentTime.getDay();
    const hour = currentTime.getHours();

    if (day === 3) {
      return {
        dotColor: 'bg-red-500',
        pingColor: 'bg-red-400',
        header: 'WEEKLY HOLIDAY',
        headerColor: 'text-red-800',
        main: "Away today",
        sub: "Emergency? Call us."
      };
    }

    if (hour >= 10 && hour < 20) {
      return {
        dotColor: 'bg-green-500',
        pingColor: 'bg-green-400',
        header: 'ONLINE NOW',
        headerColor: 'text-green-800',
        main: "How can we help?",
        sub: "Replies in minutes"
      };
    }

    return {
      dotColor: 'bg-orange-500',
      pingColor: 'bg-orange-400',
      header: 'CLOSED',
      headerColor: 'text-orange-800',
      main: "Back at 10 AM",
      sub: "Message us anytime"
    };
  };

  const status = getClinicStatus();

  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (!hasBeenDismissed) setShowBubble(true);
    }, isExperiencePage ? 8000 : 5000);
    return () => clearTimeout(showTimer);
  }, [hasBeenDismissed, isExperiencePage]);

  return (
    <div className={`fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-4 sm:gap-5 ${isExperiencePage ? 'mb-4 sm:mb-0' : ''}`}>
      
      {/* Instagram Floating Action - Hidden on experience page */}
      {!isExperiencePage && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
        >
          <MagneticAction 
            glowColor="bg-pink-500" 
            className="group relative"
          >
            {/* Tooltip Label */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-2xl">
              Live Cases & Results
            </div>
            
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Follow on Instagram"
            >
              <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
          </MagneticAction>
        </motion.div>
      )}

      {/* WhatsApp Section */}
      <div className="relative flex items-center justify-end">
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="absolute right-16 mr-4 p-4 bg-white/95 backdrop-blur-xl border border-black/10 shadow-2xl rounded-[2rem] min-w-[200px] sm:min-w-[220px]"
            >
              <button 
                onClick={() => {
                  setShowBubble(false);
                  setHasBeenDismissed(true);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-white border border-black/5 rounded-full shadow-lg hover:bg-gray-50 transition-colors text-[hsl(var(--color-primary))]"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.pingColor} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dotColor}`}></span>
                  </span>
                  <span className={`text-[9px] uppercase tracking-widest font-black ${status.headerColor}`}>{status.header}</span>
                </div>
                <p className="text-sm font-black text-[hsl(var(--color-primary))] leading-tight">
                  {status.main}
                </p>
                <p className="text-[11px] text-[hsl(var(--color-text-muted))] font-medium">
                  {status.sub}
                </p>
              </div>
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white/95 backdrop-blur-xl border-r border-t border-black/10 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <MagneticAction 
          glowColor="bg-green-500"
          className="relative"
        >
          <motion.a
            id="floating-whatsapp-btn"
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => !hasBeenDismissed && setShowBubble(true)}
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 group"
            aria-label="Chat on WhatsApp"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-10 group-hover:opacity-25" />
            <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 relative z-10" />
          </motion.a>
        </MagneticAction>
      </div>
    </div>
  );
}
