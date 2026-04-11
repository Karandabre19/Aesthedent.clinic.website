'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

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

export default function WhatsAppButton() {
  const [showBubble, setShowBubble] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';

  const getClinicStatus = () => {
    const day = currentTime.getDay();
    const hour = currentTime.getHours();

    if (day === 3) {
      return {
        dotColor: 'bg-red-500',
        pingColor: 'bg-red-400',
        header: 'WEEKLY HOLIDAY',
        headerColor: 'text-red-600',
        main: "The clinic is away today",
        sub: "Available for emergencies only"
      };
    }

    if (hour >= 10 && hour < 20) {
      return {
        dotColor: 'bg-green-500',
        pingColor: 'bg-green-400',
        header: 'ONLINE NOW',
        headerColor: 'text-green-600',
        main: "How can we help?",
        sub: "Typically replies in minutes"
      };
    }

    return {
      dotColor: 'bg-orange-500',
      pingColor: 'bg-orange-400',
      header: 'CLOSED',
      headerColor: 'text-orange-600',
      main: "We'll be back at 10 AM",
      sub: "Message us, we'll reply first thing"
    };
  };

  const status = getClinicStatus();

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 2 * 60 * 1000);

    const showTimer = setTimeout(() => {
      if (!hasBeenDismissed) {
        setShowBubble(true);
      }
    }, 5000);

    return () => {
      clearInterval(statusInterval);
      clearTimeout(showTimer);
    };
  }, [hasBeenDismissed]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0,
              y: [0, -10, 0],
            }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            className="absolute right-16 mr-4 px-4 py-3 bg-white border border-black/15 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),0_20px_50px_-20px_rgba(0,0,0,0.1)] rounded-2xl min-w-[210px] sm:min-w-[240px]"
          >
            <button 
              onClick={() => {
                setShowBubble(false);
                setHasBeenDismissed(true);
              }}
              className="absolute -top-2 -right-2 z-10 p-1.5 bg-white border border-black/10 rounded-full shadow-md hover:bg-gray-50 transition-colors text-[hsl(var(--color-primary))]"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 mb-0.5">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.pingColor} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dotColor}`}></span>
                </span>
                <span className={`text-[10px] uppercase tracking-[0.15em] font-bold ${status.headerColor}`}>{status.header}</span>
              </div>
              <p className="text-base font-bold text-[hsl(var(--color-primary))] leading-tight">
                {status.main}
              </p>
              <p className="text-xs text-[hsl(var(--color-text-muted))] leading-relaxed">
                {status.sub}
              </p>
            </div>

            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-black/15 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => !hasBeenDismissed && setShowBubble(true)}
        className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_-5px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_30px_-5px_rgba(37,211,102,0.6)] active:scale-95 group"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-30 transition-opacity" />
        <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 relative z-10 drop-shadow-sm" />
      </motion.a>
    </div>
  );
}
