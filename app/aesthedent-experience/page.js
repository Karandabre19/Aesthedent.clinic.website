'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { HeroParticles, MagneticWrapper } from '@/components/ui/InteractiveHighTech';
import { landingPageContent } from '@/lib/landing-page-content';
import { services } from '@/lib/services';
import { useGSAP } from '@gsap/react';
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  Eye,
  GlassWater,
  Hand,
  Heart,
  Info,
  MessageCircle,
  Monitor,
  Phone,
  Play,
  Search,
  Shield,
  Smile,
  Star,
  Target,
  Trees,
  User,
  Users,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const whatsappNumber = '919309816336';
const phoneNumber = '+919309816336';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'm interested in the Aesthedent experience. Can we schedule a consultation?")}`;

function HeroWord({ children, className = '', stagger = 0.02 }) {
  const text = String(children);
  return (
    <span className={`hero-word-shell inline-flex overflow-hidden align-top pb-[0.4em] -mb-[0.4em] pl-[0.05em] pr-[0.4em] ${className}`} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span className="hero-word inline-flex will-change-transform" aria-hidden="true">
        {text.split('').map((char, index) => (
          <span
            key={`${text}-${index}`}
            className="hero-char inline-block translate-y-[1.15em] opacity-0 will-change-transform transform-gpu"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  );
}



function AdvancedPromiseCard({ num, title, desc, icon: Icon, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-[2rem] bg-white/5 backdrop-blur-xl border-2 p-6 sm:p-8 transition-all duration-300 z-10 ${isLast
        ? 'border-[hsl(var(--color-accent))]/30 hover:border-[hsl(var(--color-accent))]/60 shadow-[0_20px_50px_rgba(255,184,0,0.1)]'
        : 'border-white/10 hover:border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
        }`}
    >
      {/* Background Decorative Icon (Smaller) */}
      <div className="absolute -right-6 -top-6 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-500 pointer-events-none transform group-hover:scale-125 group-hover:rotate-12">
        <Icon className="w-32 h-32 text-white" />
      </div>

      <div className="flex items-center justify-between w-full mb-6">
        <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isLast ? 'bg-[hsl(var(--color-accent))] text-[hsl(var(--color-primary-dark))] shadow-[0_0_30px_rgba(255,184,0,0.3)]' : 'bg-white/10 text-white group-hover:bg-[hsl(var(--color-accent))] group-hover:text-[hsl(var(--color-primary-dark))]'}`}>
          <Icon className="w-7 h-7" />
          {isLast && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--color-accent))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--color-accent))]"></span>
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-black text-white/10 group-hover:text-[hsl(var(--color-accent))]/20 transition-colors duration-500 uppercase italic tracking-tighter">
            {num}
          </span>
          <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-[hsl(var(--color-accent))]/40 mt-1" />
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-3 group-hover:text-[hsl(var(--color-accent))] transition-colors duration-300 tracking-tight">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-white/60 leading-relaxed font-light group-hover:text-white/90 transition-colors duration-300">
          {desc}
        </p>
      </div>
      
      {/* Interactive Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))]/0 to-transparent group-hover:via-[hsl(var(--color-accent))]/50 transition-all duration-500" />
    </motion.div>
  );
}

export default function ExperiencePage() {
  const heroRef = useRef(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Mouse-driven parallax for hero depth perception
  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to('.hero-parallax-layer', {
      x: x * 15,
      y: y * 10,
      duration: 1.2,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to('.hero-orb-exp', {
      x: x * 30,
      y: y * 20,
      duration: 1.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  // Restore body opacity when returning to this page
  useEffect(() => {
    gsap.set('body', { opacity: 1 });
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Animate ambient orbs into view
    tl.fromTo('.hero-orb-exp', {
      scale: 0.5,
      opacity: 0,
    }, {
      scale: 1,
      opacity: 1,
      duration: 1.8,
      stagger: 0.25,
      ease: 'power2.out',
    }, 0)
      .to('.hero-char', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.02,
        delay: 0.3,
      }, 0.2)
      .to('.hero-copy', {
        y: 0,
        opacity: 1,
        duration: 1,
      }, '-=0.8')
      .to('.hero-action', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
      }, '-=0.6')
      .fromTo('.hero-divider-exp',
        { scaleX: 0, autoAlpha: 0 },
        { scaleX: 1, autoAlpha: 1, duration: 0.8 },
        0.3
      );

    // Continuous ambient orb floating animation
    const ambient = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'sine.inOut' },
      delay: 1.5,
    });

    ambient
      .to('.hero-orb-exp-1', { x: 25, y: -18, duration: 5.5 }, 0)
      .to('.hero-orb-exp-2', { x: -30, y: 14, duration: 6.2 }, 0.3)
      .to('.hero-orb-exp-3', { x: 18, y: -12, duration: 5.8 }, 0.6);

    return () => {
      tl.kill();
      ambient.kill();
    };
  }, { scope: heroRef });

  return (
    <PageWrapper>
      <section ref={heroRef} className="relative h-screen min-h-[850px] flex items-center justify-center overflow-hidden bg-black" onMouseMove={handleMouseMove}>
        <motion.div className="absolute inset-0 hero-parallax-layer" style={{ scale: heroScale, opacity: heroOpacity }}>
          <HeroParticles count={12} color="bg-white" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/95 z-10" />
          <Image
            src="/clinic/clinic-wide.jpeg"
            alt="Aesthedent Premium Clinic Portfolio"
            fill
            priority
            className="w-full h-full object-cover opacity-70"
            sizes="100vw"
          />
        </motion.div>

        {/* Floating Ambient Orbs — Home Page Design Language */}
        <div className="hero-orb-exp hero-orb-exp-1 pointer-events-none absolute -left-16 top-[15%] w-[280px] h-[280px] rounded-full bg-[hsl(var(--color-accent))]/12 blur-[80px] opacity-0 transform-gpu will-change-transform z-[11]" />
        <div className="hero-orb-exp hero-orb-exp-2 pointer-events-none absolute right-[-5%] top-[35%] w-[320px] h-[320px] rounded-full bg-white/[0.06] blur-[70px] opacity-0 transform-gpu will-change-transform z-[11]" />
        <div className="hero-orb-exp hero-orb-exp-3 pointer-events-none absolute left-[20%] bottom-[10%] w-[200px] h-[200px] rounded-full bg-[hsl(var(--color-primary-light))]/10 blur-[60px] opacity-0 transform-gpu will-change-transform z-[11]" />

        {/* Directional Light Flow — Guides Eye Across Canvas */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-[500px] bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))]/[0.03] to-transparent blur-2xl z-[11]"
          animate={{ x: ['-500px', '110vw'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />

        <div className="main-container relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-2 border border-[hsl(var(--color-accent))]/30 rounded-full bg-[hsl(var(--color-accent))]/5 backdrop-blur-xl mb-6"
          >
            <Shield size={16} className="text-[hsl(var(--color-accent))]" />
            <span className="text-[10px] md:text-sm font-black tracking-[0.4em] uppercase text-white shadow-sm">Specialized Unique Treatments</span>
          </motion.div>

          {/* Divider — mirrors Home page eyebrow divider */}
          <div className="hero-divider-exp mx-auto mb-8 h-px w-28 origin-center bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))] to-transparent opacity-0 transform-gpu" />

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1] mb-8 tracking-tighter">
            <span className="inline-block pb-2">
              <HeroWord>RECLAIM</HeroWord>
            </span> <br />
            <span className="inline-block pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-accent))] via-white to-[hsl(var(--color-accent))] bg-[length:200%_auto] animate-shimmer">
              YOUR
            </span>{" "}
            <span className="inline-block pb-2">
              <HeroWord>SMILE</HeroWord>
            </span>
          </h1>

          <div className="hero-copy opacity-0 translate-y-8 max-w-2xl mx-auto">
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-10 font-light">
              At Aesthedent, our <span className="text-[hsl(var(--color-accent))] font-bold">specialized unique treatments</span> are led by a master Prosthodontist—the architect of dentistry. We go beyond standard care to deliver precise, engineered outcomes that restore both your clinical health and your natural confidence permanently.
            </p>

            <div className="hero-action opacity-0 translate-y-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <MagneticWrapper className="w-full sm:w-auto">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full px-7 py-4 sm:px-10 sm:py-5 bg-[hsl(var(--color-accent))] text-[hsl(var(--color-primary-dark))] rounded-2xl font-black text-base sm:text-lg shadow-2xl shadow-[hsl(var(--color-accent))]/30 transition-all duration-300 text-center block"
                >
                  Schedule Consultation
                </a>
              </MagneticWrapper>

              <MagneticWrapper className="w-full sm:w-auto">
                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full px-7 py-4 sm:px-10 sm:py-5 bg-white/10 border-2 border-white/20 text-white rounded-2xl font-black text-base sm:text-lg backdrop-blur-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center block"
                >
                  Direct Call Expert
                </a>
              </MagneticWrapper>
            </div>
          </div>
        </div>

        {/* Scroll Indicator — Enhanced */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-7 h-12 border-2 border-white/30 rounded-full flex justify-center p-1.5 backdrop-blur-sm">
            <motion.div
              className="w-1.5 h-3 bg-[hsl(var(--color-accent))] rounded-full"
              animate={{ y: [0, 18, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

      </section>



      {/* Specialized Treatments Section - AD MODE PRIMARY FOCUS */}
      <section id="services-grid-section" className="py-20 md:py-28 bg-[hsl(var(--color-primary))] relative overflow-hidden">
        {/* Subtle high-tech background pulse */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-pulse-slow" />

        <div className="main-container relative z-10">
          <AnimatedSection className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase">
              Prosthodontist Specialist Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter mb-4 sm:mb-6 italic">
              Specialized <span className="text-[hsl(var(--color-accent))]">Unique</span> Treatments.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
              Precision-engineered solutions for complex clinical cases. Engineered for longevity and natural aesthetics.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 sm:gap-12 max-w-7xl mx-auto">
            {services
              .filter(s => ['dental-implants', 'full-mouth-rehabilitation', 'dentures', 'digital-smile-design'].includes(s.slug))
              .map((service, i) => (
                <AnimatedSection key={service.slug} delay={i * 0.08}>
                  <div className="group relative overflow-hidden rounded-[2.5rem] bg-[hsl(var(--color-primary-dark))] border border-white/10 transition-all duration-500 shadow-2xl hover:shadow-[hsl(var(--color-accent))]/10 flex flex-col h-full">
                    {/* Image Area - More Compact */}
                    <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-[hsl(var(--bg-alt))] relative">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={600}
                        height={350}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-primary-dark))] to-transparent opacity-60" />
                      
                      {/* Specialist Badge - Mini */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-md text-[9px] font-black text-white uppercase tracking-widest shadow-xl">
                          Specialist Choice
                        </div>
                        {service.benefit && (
                          <div className="px-3 py-1 bg-[hsl(var(--color-accent))]/90 backdrop-blur-xl rounded-md text-[9px] font-black text-[hsl(var(--color-primary-dark))] uppercase tracking-widest shadow-xl animate-pulse-slow">
                            {service.benefit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Area - Compact Padding */}
                    <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black mb-2 text-white group-hover:text-[hsl(var(--color-accent))] transition-colors tracking-tight">
                          {service.title}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm mb-6 font-light leading-relaxed line-clamp-2">
                          {service.shortDesc}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <MagneticWrapper offset={0.1} className="w-full sm:flex-1">
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-[hsl(var(--color-accent))] text-[hsl(var(--color-primary-dark))] rounded-xl text-sm font-black shadow-lg hover:shadow-[hsl(var(--color-accent))]/40 transition-all whitespace-nowrap"
                          >
                            <MessageCircle className="w-5 h-5 flex-shrink-0" />
                            Inquire Now
                          </a>
                        </MagneticWrapper>

                        <a
                          href={`tel:${phoneNumber}`}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-white/20 text-white rounded-xl text-sm font-bold hover:bg-white/5 transition-all whitespace-nowrap"
                        >
                          <Phone className="w-5 h-5 flex-shrink-0" />
                          Call Specialist
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-[hsl(var(--color-primary-dark))] py-20 sm:py-28 md:py-36 overflow-hidden">
        {/* Architectural Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="main-container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <AnimatedSection>
              <div className="inline-block px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[hsl(var(--color-accent))] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-8 shadow-xl">
                The Elite Guarantee
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8 pt-4">
                THE <span className="text-[hsl(var(--color-accent))] bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--color-accent))] via-white to-[hsl(var(--color-accent))] bg-[length:200%_auto] animate-shimmer">SPECIALIST</span> <br />
                PROMISE.
              </h2>
              <p className="text-lg md:text-2xl text-white/60 leading-relaxed font-light max-w-2xl mx-auto">
                Engineering trust through transparency. We've built our entire specialist architecture around single-patient focus and surgical precision.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <AdvancedPromiseCard
              num="01"
              icon={Clock}
              title="Unhurried Clinical Excellence"
              desc="We refuse 'conveyor-belt' dentistry. Because we dedicate so much time to each individual, our weekly consultation slots are strictly limited. Book today to secure your time with Dr. Sahil."
            />
            <AdvancedPromiseCard
              num="02"
              icon={Eye}
              title="Purposeful Communication"
              desc="Clear vision leads to clear confidence. We prioritize eye-to-eye consultations, using advanced 3D imaging not just to diagnose, but to educate. You leave with a complete understanding, not just a prescription."
            />
            <AdvancedPromiseCard
              num="03"
              icon={Info}
              title="Sensory Transparency"
              desc="We bridge the gap of clinical anxiety by narrating each step of your treatment in real-time—preparing you for every sensation. When you know exactly what’s coming, the fear of the unexpected fades."
            />
            <AdvancedPromiseCard
              num="04"
              icon={Hand}
              isLast={true}
              title="Your Safety, Your Signal"
              desc="Ethical care means you are always the primary decision-maker. We implement a specific 'rest signal' before any procedure. If you raise your hand, our tools are down instantly. We pause as often as you need."
            />
          </div>
        </div>
      </section>

      {/* 
        THE PROSTHODONTIST EDGE: 
        Building trust through specialization.
      */}
      <section className="py-20 md:py-28 bg-[hsl(var(--color-bg-alt))]/40 relative overflow-hidden">
        <div className="main-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">

            <AnimatedSection>
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="absolute -inset-4 bg-[hsl(var(--color-primary))]/10 rounded-3xl transform -rotate-3" />
                <Image
                  src="/clinic/treatment-process.2jpeg.jpeg"
                  alt="Aesthedent Specialist Architecture"
                  width={600}
                  height={750}
                  className="relative rounded-2xl shadow-xl w-full aspect-[4/5] object-cover"
                />

                <div className="absolute -bottom-6 -right-6 hidden sm:block bg-white/95 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[hsl(var(--color-accent))]/20 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                    </div>
                    <div>
                      <p className="font-bold text-[hsl(var(--color-primary))] text-sm mb-0.5">
                        The Blueprint
                      </p>
                      <p className="text-xs text-[hsl(var(--color-text-muted))]">
                        Digital Mapping
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="inline-block px-4 py-2 bg-[hsl(var(--color-primary))]/5 rounded-full text-[hsl(var(--color-primary))] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6">Specialist-Led Approach</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[hsl(var(--color-primary))] mb-6 leading-tight tracking-tighter">Why the <span className="text-[hsl(var(--color-accent))]">Specialist</span> Matters.</h2>
              <p className="text-base sm:text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-10 font-light">
                A Prosthodontist is the "architect" of dentistry. At Aesthedent, we don't just fix a single tooth; we plan the entire biomechanical harmony of your mouth.
              </p>

              <div className="space-y-8">
                {[
                  { title: "Architectural Planning", desc: "Long-term structural success for implants and full mouth rehab." },
                  { title: "Advanced Biomechanics", desc: "Ensuring your bite is healthy, comfortable, and natural-feeling." },
                  { title: "Complex Aesthetic Artistry", desc: "Crafting smiles that are indistinguishable from natural teeth." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 sm:gap-6 group">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-accent))]/10 flex items-center justify-center text-[hsl(var(--color-accent))] group-hover:bg-[hsl(var(--color-accent))] group-hover:text-white transition-colors flex-shrink-0">
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-[hsl(var(--color-primary))] leading-tight mb-1">{item.title}</h4>
                      <p className="text-sm sm:text-base text-[hsl(var(--color-text-muted))] font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>


      {/* 
        TECHNOLOGY PORTFOLIO: 
        4 Pillars of Clinical Excellence.
      */}
      <section className="py-20 md:py-28 bg-[hsl(var(--color-bg-alt))]/50">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Clinical Technology Portfolio</h2>
            <p className="text-base text-[hsl(var(--color-text-muted))] max-w-2xl mx-auto font-light">The software and hardware that drive our 98% success rate.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Monitor, title: "Intraoral Scanners", desc: "No more messy clay impressions. Fast, accurate, 3D digital replicas." },
              { icon: Cpu, title: "Guided Surgery", desc: "Pre-planned implant placement using advanced navigational software." },
              { icon: Activity, title: "Modern Sedation", desc: "Painless protocols that ensure safety and zero procedure anxiety." },
              { icon: GlassWater, title: "Biocompatible Materials", desc: "Using only premium, body-friendly materials for long-term health." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-[hsl(var(--border))] group hover:-translate-y-3 transition-all duration-500 hover:shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--color-primary))]/5 flex items-center justify-center text-[hsl(var(--color-primary))] mb-8 group-hover:bg-[hsl(var(--color-accent))] group-hover:text-white transition-colors">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--color-primary))] mb-4">{item.title}</h3>
                <p className="text-sm text-[hsl(var(--color-text-muted))] leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        SPECIALIST CLINICAL STANDARDS: 
        Replaces pricing with high-authority clinical identity.
      */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        {/* Subtle background text for SEO and texture */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[15vw] font-black text-[hsl(var(--color-primary))]/[0.02] select-none pointer-events-none whitespace-nowrap orientation-vertical">
          PROSTHODONTICS
        </div>

        <div className="main-container">
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
            <div className="max-w-2xl">
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[hsl(var(--color-primary))]/5 border border-[hsl(var(--color-primary))]/10 rounded-full text-[hsl(var(--color-primary))] font-bold text-[10px] uppercase tracking-widest mb-6">Mastery & Specialization</div>
                <h2 className="text-4xl md:text-6xl font-black text-[hsl(var(--color-primary))] leading-[0.9] tracking-tighter mb-8">
                  The Specialist <br /><span className="text-[hsl(var(--color-accent))]">Clinical Standard.</span>
                </h2>
                <p className="text-lg md:text-xl text-[hsl(var(--color-text-muted))] font-light leading-relaxed mb-8">
                  Aesthedent is not just a dental clinic; it is a dedicated <span className="text-[hsl(var(--color-primary))] font-bold">Prosthodontist Clinic</span>. In the world of dentistry, a Prosthodontist is the recognized specialist for the restoration and replacement of teeth.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[hsl(var(--color-primary))] bg-[hsl(var(--color-accent))]/10 px-4 py-2 rounded-xl">
                    <Award size={18} className="text-[hsl(var(--color-accent))]" />
                    MDS in Prosthodontics
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/5 px-4 py-2 rounded-xl">
                    <Shield size={18} className="text-[hsl(var(--color-primary))]" />
                    Implant Specialist
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection className="flex-1 w-full" delay={0.2}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-[hsl(var(--color-accent))]/20 to-transparent rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-[hsl(var(--color-primary))] p-10 md:p-12 rounded-[3.5rem] shadow-4xl text-white overflow-hidden border border-white/10">
                  <div className="absolute top-0 right-0 p-12 opacity-10 scale-150 rotate-12">
                    <Users size={120} />
                  </div>
                  <h4 className="text-2xl font-bold mb-6 text-[hsl(var(--color-accent))]">The Specialist Advantage</h4>
                  <p className="text-white/80 leading-relaxed font-light mb-8">
                    While general dentistry focuses on basic care and maintenance, a Prosthodontist undergoes three additional years of rigorous hospital-based residency. We are the architects who design your entire oral biomechanics from the ground up.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Precision Dental Implants & Multi-Unit Bridges",
                      "Complex Full-Mouth Rehabilitation",
                      "Specialized Aesthetic Smile Design",
                      "Advanced TMJ & Bite Corection"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 size={18} className="text-[hsl(var(--color-accent))]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Evidence-Based Planning",
                desc: "We don't guess; we engineer. Every restorative case at Aesthedent begins with a comprehensive structural analysis using 3D digital mapping to ensure lifetime stability.",
                icon: Target
              },
              {
                title: "Bio-Harmonious Aesthetics",
                desc: "Our restorations are indistinguishable from natural teeth. We study your facial proportions and lip dynamics to craft prosthetics that look and feel naturally yours.",
                icon: Smile
              },
              {
                title: "Longevity Focused",
                desc: "Our goal is a 'once-in-a-lifetime' outcome. By using premium biocompatible materials and specialist-only protocols, we maximize the success rate of every implant and crown.",
                icon: Heart
              }
            ].map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-[hsl(var(--color-bg-alt))]/30 border border-[hsl(var(--border))] hover:border-[hsl(var(--color-accent))]/40 transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[hsl(var(--color-accent))] mb-8 group-hover:scale-110 group-hover:bg-[hsl(var(--color-accent))] group-hover:text-white transition-all duration-500">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[hsl(var(--color-primary))] mb-4">{feature.title}</h3>
                  <p className="text-sm text-[hsl(var(--color-text-muted))] leading-relaxed font-light">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 
        THE JOURNEY: 
        Minimalist, high-authority process.
      */}
      <section className="py-32 bg-[hsl(var(--color-bg-alt))]/50">
        <div className="main-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-[0.02em] leading-[0.9] text-[hsl(var(--color-primary))]">The Clinical <br /><span className="text-[hsl(var(--color-accent))]">Journey.</span></h2>
              <div className="space-y-12">
                {[
                  { icon: Search, title: "Discovery & Mapping", desc: "A deep clinical dive including 3D imaging and structural analysis." },
                  { icon: Target, title: "Strategic Roadmap", desc: "Presenting your comprehensive, specialist-designed clinical roadmap." },
                  { icon: Zap, title: "Precise Execution", desc: "Expert intervention using world-class hardware and protocols." },
                  { icon: Smile, title: "Outcome Monitoring", desc: "Ongoing specialized support to ensure lifetime success." }
                ].map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.1} className="flex gap-8 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-white border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--color-accent))] group-hover:bg-[hsl(var(--color-accent))] group-hover:text-white transition-all shadow-sm">
                      <item.icon size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[hsl(var(--color-primary))] mb-1">{item.title}</h4>
                      <p className="text-[hsl(var(--color-text-muted))] font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-10 bg-gradient-to-br from-[hsl(var(--color-accent))]/20 via-transparent to-[hsl(var(--color-primary))]/10 blur-[100px] rounded-full" />
              <div className="relative z-10 bg-white p-6 rounded-[5rem] shadow-4xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/clinic/dentist-chair-proper.jpeg"
                  width={600}
                  height={750}
                  alt="Modern Dental Chair at Aesthedent Clinic"
                  className="w-full h-auto rounded-[4rem] aspect-[4/5] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        COMPREHENSIVE FAQS: 
        Depth section for trust and SEO.
      */}
      <section className="py-20 md:py-28 bg-white">
        <div className="main-container max-w-4xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[hsl(var(--color-primary))] mb-4 tracking-tight">Clinical Q&A</h2>
            <p className="text-base text-[hsl(var(--color-text-muted))] font-light">Honest answers to the most common patient concerns.</p>
          </AnimatedSection>

          <div className="space-y-6">
            {landingPageContent.faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-[hsl(var(--color-primary))]">
        <TestimonialsSection
          title="Real Outcomes"
          subtitle="Explore the transformations that define our clinical standard."
          variant="light"
          limit={3}
        />
        
        <div className="main-container mt-12 text-center">
          <AnimatedSection>
            <a
              href="https://www.google.com/maps/place/Aesthedent+Dental+Clinic,+Kothrud/@18.4972761,73.8108921,17z/data=!3m1!5s0x3bc2bfc407d2eb7d:0xeb43317068a295aa!4m8!3m7!1s0x3bc2bfa49403bd57:0xb59ec17e89bd289f!8m2!3d18.497271!4d73.813467!9m1!1b1!16s%2Fg%2F11j2v_ph1x?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white font-black hover:text-[hsl(var(--color-accent))] transition-colors text-lg italic tracking-tight"
            >
              View all 260+ patient stories
              <ArrowRight className="w-5 h-5" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* 
        FINAL CTA: 
        Direct, confident push.
      */}
      <section className="py-24 md:py-32 bg-white overflow-hidden relative">
        <div className="main-container relative z-10 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--color-accent))]/10 border border-[hsl(var(--color-accent))]/20 rounded-full text-[hsl(var(--color-accent))] font-bold text-xs uppercase tracking-widest mb-8">Take the First Step</div>
            <h2 className="text-4xl md:text-6xl font-black text-[hsl(var(--color-primary))] mb-8 leading-[0.9] tracking-tighter">Your Future <br />Smile Starts <br /> <span className="text-[hsl(var(--color-accent))]">Today.</span></h2>
            <p className="text-base md:text-lg text-[hsl(var(--color-text-muted))] max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Stop letting dental anxiety and uncertainty delay your health. Secure your 1-on-1 specialist consultation today and get a clear, honest roadmap for your smile.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticWrapper className="w-full sm:w-auto">
                <a
                  id="final-cta-whatsapp"
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-8 py-4 bg-[hsl(var(--color-primary))] text-white rounded-2xl font-bold text-base shadow-xl hover:bg-[hsl(var(--color-primary-dark))] transition-all duration-300 hover:scale-105 text-center"
                >
                  Start with WhatsApp
                </a>
              </MagneticWrapper>
              <MagneticWrapper className="w-full sm:w-auto">
                <a
                  id="final-cta-call"
                  href={`tel:${phoneNumber}`}
                  className="block w-full px-8 py-4 border-2 border-[hsl(var(--color-primary))] text-[hsl(var(--color-primary))] rounded-2xl font-bold text-base hover:bg-[hsl(var(--color-primary))]/5 transition-all duration-300 text-center"
                >
                  Direct Call Expert
                </a>
              </MagneticWrapper>
            </div>

            <p className="mt-10 text-xs text-[hsl(var(--color-text-muted))] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Shield size={16} className="text-[hsl(var(--color-accent))]" />
              Clinically safe, specialist-led, lifetime focused.
            </p>
          </AnimatedSection>
        </div>
      </section>

    </PageWrapper>
  );
}

// Updated FAQItem with premium design
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`group border-b border-[hsl(var(--border))] transition-all duration-500 ${isOpen ? 'bg-[hsl(var(--color-bg-alt))]/30 px-6 py-4 rounded-3xl mb-4' : 'py-8'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left gap-4"
      >
        <span className={`text-base sm:text-lg lg:text-xl font-bold transition-colors ${isOpen ? 'text-[hsl(var(--color-primary))]' : 'text-[hsl(var(--color-text))] group-hover:text-[hsl(var(--color-primary))]'}`}>
          {question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[hsl(var(--border))] flex items-center justify-center transition-all ${isOpen ? 'bg-[hsl(var(--color-primary))] text-white border-transparent' : 'text-[hsl(var(--color-text-muted))] group-hover:border-[hsl(var(--color-primary))] group-hover:text-[hsl(var(--color-primary))]'}`}>
          <ChevronDown className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} size={20} />
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="overflow-hidden"
      >
        <div className="pt-4 sm:pt-6 pb-2 sm:pb-4 pr-10">
          <p className="text-sm sm:text-base text-[hsl(var(--color-text-muted))] font-light leading-relaxed">
            {answer}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
