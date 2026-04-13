'use client';

import { Instagram, ArrowRight, Camera, Heart, MessageCircle } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/ui/AnimatedSection';

const instagramStats = [
  { label: 'Followers', value: '1,500+' },
  { label: 'Transformations', value: '500+' },
  { label: 'Patient Reviews', value: '4.9/5' },
];

const previewImages = [
  {
    src: 'https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Advanced clinical precision in every case.',
    likes: 124
  },
  {
    src: 'https://images.pexels.com/photos/6502019/pexels-photo-6502019.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Transforming smiles, transforming lives.',
    likes: 89
  },
  {
    src: 'https://images.pexels.com/photos/3783335/pexels-photo-3783335.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Modern dentistry with a human touch.',
    likes: 156
  },
  {
    src: 'https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Restoring confidence through clinical mastery.',
    likes: 92
  }
];

function MagneticButton({ children, href }) {
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
    x.set((e.clientX - centerX) * 0.35);
    y.set((e.clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[hsl(var(--color-primary))] text-white font-black rounded-2xl transition-all shadow-2xl shadow-[hsl(var(--color-primary))]/30 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
      <Instagram className="w-5 h-5 text-[hsl(var(--color-accent))]" />
      <span className="relative z-10 tracking-tight">Follow @aesthedent_pune</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
    </motion.a>
  );
}

export default function InstagramShowcase() {
  const instagramLink = 'https://www.instagram.com/drwathodkar_aesthedent_clinic?igsh=azFlYTc2b25xaDFn';

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden relative">
      {/* High-Tech Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[5%] w-1 h-1 bg-[hsl(var(--color-accent))] rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        <div className="absolute top-[40%] right-[10%] w-1.5 h-1.5 bg-[hsl(var(--color-primary))] rounded-full animate-pulse delay-700 shadow-[0_0_20px_rgba(0,0,0,0.2)]" />
        <div className="absolute bottom-[20%] left-[15%] w-1 h-1 bg-[hsl(var(--color-accent))] rounded-full animate-pulse delay-1000 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      </div>

      <div className="main-container">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Left Side: Content */}
          <div className="lg:w-2/5">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--color-primary))]/5 border border-[hsl(var(--color-primary))]/10 rounded-full text-[hsl(var(--color-primary))] font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
                <Camera size={14} className="text-[hsl(var(--color-accent))]" />
                Digital Smile Gallery
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[hsl(var(--color-primary))] leading-[0.9] tracking-tighter mb-8 italic">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))]">Art of</span> <br />
                <span className="relative inline-block mt-2">
                  Transformation.
                  <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-[hsl(var(--color-accent))] rounded-full opacity-30" />
                </span>
              </h2>

              <p className="text-xl text-[hsl(var(--color-text-muted))] font-light leading-relaxed mb-12 max-w-sm">
                Advanced clinical mastery meets modern aesthetic engineering. See the precision behind every smile.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-16 border-l-2 border-[hsl(var(--color-accent))]/20 pl-8">
                {instagramStats.map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-2xl font-black text-[hsl(var(--color-primary))] tracking-tighter">{stat.value}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--color-text-muted))/60]">{stat.label}</span>
                  </div>
                ))}
              </div>

              <MagneticButton href={instagramLink} />
            </AnimatedSection>
          </div>

          {/* Right Side: Visual Grid */}
          <div className="lg:w-3/5 w-full relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              {previewImages.map((image, i) => (
                <AnimatedSection key={i} delay={i * 0.15} direction={i % 2 === 0 ? 'up' : 'down'}>
                  <div className={`relative aspect-square rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] ${i % 2 !== 0 ? 'lg:translate-y-16' : ''}`}>
                    <Image 
                      src={image.src}
                      alt={image.caption}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Glassmorphic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col justify-end p-8 sm:p-10">
                       <p className="text-white text-base font-bold mb-6 tracking-tight leading-tight">"{image.caption}"</p>
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 py-1 px-3 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                             <Heart size={14} className="text-[hsl(var(--color-accent))]" fill="currentColor" />
                             <span className="text-xs font-black text-white">{image.likes}</span>
                          </div>
                          <div className="flex items-center gap-2 py-1 px-3 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                             <MessageCircle size={14} className="text-white" />
                             <span className="text-xs font-black text-white">{Math.floor(image.likes / 10)}</span>
                          </div>
                       </div>
                    </div>

                    {/* High-Tech Instagram Tag */}
                    <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center text-white/50 group-hover:text-[hsl(var(--color-accent))] group-hover:border-[hsl(var(--color-accent))/30] transition-all duration-500 shadow-xl">
                      <Instagram size={24} />
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Futuristic Glow Layers */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[hsl(var(--color-accent))]/10 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[hsl(var(--color-primary))]/5 rounded-full blur-[140px] mix-blend-multiply pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
