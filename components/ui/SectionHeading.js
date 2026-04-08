'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function SectionHeading({ 
  badge, 
  title, 
  subtitle, 
  centered = true,
  light = false 
}) {
  return (
    <motion.div 
      className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''} mb-12 lg:mb-16`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
    >
      {badge && (
        <Badge 
          variant="secondary" 
          className={`mb-4 ${
            light 
              ? 'bg-[hsl(var(--primary-foreground))]/10 text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-foreground))]/20' 
              : 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20'
          }`}
        >
          {badge}
        </Badge>
      )}
      <h2 className={`text-3xl lg:text-4xl font-semibold mb-4 leading-tight ${
        light ? 'text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--color-text))]'
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${
          light ? 'text-[hsl(var(--primary-foreground))]/70' : 'text-[hsl(var(--color-text-muted))]'
        }`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
