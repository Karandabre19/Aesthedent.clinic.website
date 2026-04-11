'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from '@/components/ui/tooltip';

export default function WhatsAppButton() {
  const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-lg shadow-[hsl(var(--color-primary))]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:opacity-90 animate-pulse-soft"
          aria-label="Chat on WhatsApp"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.a>
      </TooltipTrigger>
      <TooltipContent 
        side="left" 
        sideOffset={12}
        className="px-4 py-3 bg-white border border-black/15 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),0_20px_50px_-20px_rgba(0,0,0,0.1)] rounded-2xl animate-in zoom-in-90 slide-in-from-right-4 duration-300"
      >
        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-green-600">Online now</span>
          </div>
          <p className="text-sm font-semibold text-[hsl(var(--color-primary))] leading-tight">
            How can we help?
          </p>
          <p className="text-[11px] text-[hsl(var(--color-text-muted))]">
            Typically replies in minutes
          </p>
        </div>
        <TooltipArrow className="fill-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.05)]" width={14} height={7} />
      </TooltipContent>
    </Tooltip>
  );
}
