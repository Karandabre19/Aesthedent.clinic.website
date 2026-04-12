'use client';

import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { landingPageContent } from '@/lib/landing-page-content';
import { services } from '@/lib/services';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  Star,
  ArrowRight,
  ChevronDown,
  Check,
  Clock,
  Award,
  Smile,
  Sparkles,
  Quote,
  Zap,
  Shield,
  Monitor,
  Heart,
  Search,
  Target,
  Users,
  Timer,
  Cpu,
  GlassWater,
  Activity,
  CheckCircle2,
  Eye,
  Info,
  Hand,
  Play
} from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const whatsappNumber = '919309816336';
const phoneNumber = '+919309816336';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'm interested in the Aesthedent experience. Can we schedule a consultation?")}`;

function HeroWord({ children, className = '' }) {
  const text = String(children);
  return (
    <span className={`hero-word-shell inline-flex overflow-hidden align-top pb-[0.2em] -mb-[0.2em] ${className}`} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span className="hero-word inline-flex will-change-transform" aria-hidden="true">
        {text.split('').map((char, index) => (
          <span
            key={`${text}-${index}`}
            className={`hero-char inline-block translate-y-[1.15em] opacity-0 will-change-transform transform-gpu ${char !== ' ' ? 'mx-[0.01em]' : ''}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  );
}

function StatNumber({ value, decimals = 0, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.8 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplayValue(latest);
      },
    });
    return () => controls.stop();
  }, [delay, isInView, value]);

  const formattedValue = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toString();
  return <span ref={ref}>{formattedValue}{suffix}</span>;
}

const trustStats = [
  { value: 5, decimals: 1, suffix: '', label: 'Google Rating', sub: '263 Reviews' },
  { value: 10, decimals: 0, suffix: '+', label: 'Years', sub: 'Experience' },
  { value: 5000, decimals: 0, suffix: '+', label: 'Happy', sub: 'Patients' },
  { value: 100, decimals: 0, suffix: '%', label: 'Painless', sub: 'Treatments' },
];

function TrustStatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative overflow-hidden rounded-[1.75rem] bg-[hsl(var(--background))] px-5 py-6 text-center transition-all duration-300 shadow-md border border-[hsl(var(--border))]/50"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))]/90 to-transparent opacity-80" />
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[hsl(var(--color-accent))]/12 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -left-12 bottom-0 h-20 w-20 rounded-full bg-[hsl(var(--color-primary))]/8 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <p className="mb-2 text-3xl font-bold tracking-tight text-[hsl(var(--color-primary))] md:text-4xl">
        <StatNumber
          value={stat.value}
          decimals={stat.decimals}
          suffix={stat.suffix}
          delay={0.2 + index * 0.08}
        />
      </p>
      <p className="text-sm font-semibold text-[hsl(var(--color-text))]">{stat.label}</p>
      <p className="mt-1 text-xs text-[hsl(var(--color-text-muted))]">{stat.sub}</p>
    </motion.div>
  );
}

function AdvancedPromiseCard({ num, title, desc, icon: Icon, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-[1.5rem] bg-white border-2 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 z-10 ${isLast
          ? 'border-[hsl(var(--color-accent))]/20 hover:border-[hsl(var(--color-accent))]/40'
          : 'border-[hsl(var(--color-primary))]/10 hover:border-[hsl(var(--color-primary))]/30'
        }`}
    >
      {/* Background Decorative Icon (Smaller) */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none transform group-hover:scale-125 group-hover:-translate-x-2">
        <Icon className="w-24 h-24" />
      </div>

      <div className="flex items-center justify-between w-full mb-4">
        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isLast ? 'bg-[hsl(var(--color-accent))]/10 text-[hsl(var(--color-accent))] group-hover:bg-[hsl(var(--color-accent))] group-hover:text-[hsl(var(--color-primary-dark))]' : 'bg-[hsl(var(--color-primary))]/5 text-[hsl(var(--color-primary))] group-hover:bg-[hsl(var(--color-primary))] group-hover:text-white'}`}>
          <Icon className="w-6 h-6" />
          {isLast && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--color-accent))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--color-accent))]"></span>
            </span>
          )}
        </div>
        <span className="text-3xl font-black text-[hsl(var(--color-primary))]/10 group-hover:text-[hsl(var(--color-primary))]/15 transition-colors duration-300">
          {num}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-bold text-[hsl(var(--color-primary))] mb-2 group-hover:text-[hsl(var(--color-text))] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[hsl(var(--color-text-muted))] leading-relaxed group-hover:text-[hsl(var(--color-text))] transition-colors duration-300">
          {desc}
        </p>
      </div>

      {isLast && (
        <div className="mt-4 flex items-center gap-2 px-2.5 py-1 bg-[hsl(var(--color-accent))]/5 rounded-lg border border-[hsl(var(--color-accent))]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[9px] font-bold text-[hsl(var(--color-accent))] uppercase tracking-wider">Control Signal active</span>
        </div>
      )}
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/90 z-10" />
          <img
            src="/clinic/clinic-wide.jpeg"
            alt="Aesthedent Premium Clinic Portfolio"
            className="w-full h-full object-cover opacity-70"
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
            <span className="text-[10px] md:text-sm font-black tracking-[0.4em] uppercase text-white shadow-sm">Specialist-Led Clinical Portfolio</span>
          </motion.div>

          {/* Divider — mirrors Home page eyebrow divider */}
          <div className="hero-divider-exp mx-auto mb-8 h-px w-28 origin-center bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))] to-transparent opacity-0 transform-gpu" />

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
            <HeroWord>RECLAIM</HeroWord> <br />
            <HeroWord className="text-[hsl(var(--color-accent))]">YOUR</HeroWord> <HeroWord>SMILE</HeroWord>
          </h1>

          <div className="hero-copy opacity-0 translate-y-8 max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-white/70 mb-8 font-light leading-relaxed">
              Excellence is not an accident. At Aesthedent, every restoration is an <span className="text-white font-semibold">engineered outcome</span> led by a specialist prosthodontist. Precision, safety, and transparency redefined.
            </p>

            <div className="hero-action opacity-0 translate-y-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-[hsl(var(--color-accent))] text-[hsl(var(--color-primary-dark))] rounded-2xl font-bold text-base shadow-xl hover:scale-105 transition-all duration-300"
              >
                Schedule Consultation
              </a>
              <a
                href={`tel:${phoneNumber}`}
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white rounded-2xl font-semibold text-base hover:bg-white/10 transition-all duration-300"
              >
                Direct Call
              </a>
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

      {/* Trust Badges - Floating */}
      <section className="relative z-30 -mt-16 sm:-mt-20">
        <div className="main-container">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] bg-white p-4 md:p-5 lg:p-6 shadow-2xl border border-[hsl(var(--color-primary))]/5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--color-accent)/0.16),transparent_26%),radial-gradient(circle_at_bottom_left,hsl(var(--color-primary)/0.08),transparent_28%)]" />
            <motion.div
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))]/10 to-transparent blur-2xl"
              animate={{ x: ["0%", "230%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {trustStats.map((stat, i) => (
                <TrustStatCard
                  key={`${stat.label}-${stat.sub}`}
                  stat={stat}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nervous Interactive Section directly under Trust Stats */}
      <section className="relative z-20 bg-gradient-to-b from-white to-[hsl(var(--color-bg-alt))]/30 pt-16 pb-12 sm:pt-24 sm:pb-32 md:pt-32">
        <div className="main-container">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <AnimatedSection>
              <div className="inline-block px-5 py-2 bg-[hsl(var(--color-accent))]/10 rounded-full text-[hsl(var(--color-accent))] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6">The Aesthedent Promise</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[hsl(var(--color-primary))] leading-[0.9] tracking-tighter mb-8">
                If you're feeling nervous...
              </h2>
              <p className="text-base md:text-xl text-[hsl(var(--color-text-muted))] leading-relaxed font-light">
                You're not alone. We've built our entire specialist practice around making you feel safe and in control. Here is our ethical guarantee:
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
                <img
                  src="/clinic/treatment-process.2jpeg.jpeg"
                  alt="Aesthedent Specialist Architecture"
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

      {/* Services Section (Ported from Home Page to anchor Dental identity) */}
      <section id="services-grid-section" className="py-20 md:py-28 bg-[hsl(var(--color-primary))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-full text-xs sm:text-sm font-semibold uppercase tracking-widest">
              Specialized Care
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter mb-4 sm:mb-6">
              Expert Solutions for Your Smile.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
              From precision implants to expert root canals, we explain every clinical detail before we start. Look at our core treatments below.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.slice(0, 6).map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link href={`/services/${service.slug}`}>
                  <div className="card-elevated group relative overflow-hidden rounded-2xl bg-white border border-white/20 hover:-translate-y-2 transition-transform shadow-lg">
                    <div className="aspect-[16/10] overflow-hidden bg-[hsl(var(--bg-alt))]">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-primary))]/95 via-[hsl(var(--color-primary))]/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[hsl(var(--color-accent))] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-white/85 text-sm mb-4 line-clamp-2 font-light">
                        {service.shortDesc}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[hsl(var(--color-accent))] text-sm font-bold">
                        Explore details
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
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
        EXPANDED PRICING: 
        Comprehensive marketplace approach.
      */}
      <section className="py-20 md:py-28 bg-white">
        <div className="main-container">
          <div className="flex flex-col lg:flex-row gap-20 items-center mb-20">
             <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-black text-[hsl(var(--color-primary))] leading-[0.9] tracking-tighter mb-6">Transparent <br />Value Plans.</h2>
                <p className="text-base text-[hsl(var(--color-text-muted))] font-light">Get a fixed-price specialist roadmap on Day 1. No hidden fees. No pressure. Just absolute clarity on what it takes to reclaim your smile.</p>
             </div>
             <div className="flex-1 bg-[hsl(var(--color-accent))]/10 p-8 rounded-3xl border border-[hsl(var(--color-accent))]/20">
                <div className="flex items-center gap-4 mb-4">
                   <Shield className="text-[hsl(var(--color-accent))]" size={32} />
                   <h4 className="text-lg font-bold text-[hsl(var(--color-primary-dark))]">The Honest Care Guarantee</h4>
                </div>
                <p className="text-sm text-[hsl(var(--color-primary-dark))] leading-relaxed font-medium">No hidden costs. Every plan includes initial clinical mapping, specialist planning, and after-care monitoring as standard.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landingPageContent.pricing.map((plan, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="h-full">
                <div className={`relative h-full flex flex-col p-8 md:p-10 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                  plan.popular 
                    ? 'bg-[hsl(var(--color-primary))] text-white border-[hsl(var(--color-accent))] shadow-4xl' 
                    : 'bg-white text-[hsl(var(--color-primary))] border-[hsl(var(--border))] hover:border-[hsl(var(--color-accent))]/40 shadow-2xl'
                }`}>
                  {plan.popular && (
                    <div className="absolute top-10 right-10 bg-[hsl(var(--color-accent))] text-[hsl(var(--color-primary-dark))] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                      Recommended
                    </div>
                  )}

                  <div className="mb-8">
                    <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-3">{plan.tier} Implementation</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-black">{plan.price}</span>
                      <span className="text-xs opacity-60 font-black">/starting</span>
                    </div>
                    <div className="mt-6 text-base font-bold opacity-80 leading-snug">{plan.description}</div>
                  </div>

                  <div className="flex-grow space-y-4 mb-10">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-40 border-b border-white/20 pb-2 mb-4">What's Included:</div>
                     {plan.features.map((feat, idx) => (
                       <div key={idx} className="flex items-start gap-4 text-sm font-light leading-snug">
                          <Check size={18} className={plan.popular ? 'text-[hsl(var(--color-accent))] mt-0.5' : 'text-green-500 mt-0.5'} />
                          <span>{feat}</span>
                       </div>
                     ))}
                  </div>

                  <a
                    id={`pricing-select-${plan.tier.replace(/\s+/g, '-').toLowerCase()}`}
                    href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in the ${plan.tier} Value Plan ($${plan.price}). Can we discuss the clinical steps?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative w-full py-4 rounded-2xl font-bold text-base text-center transition-all overflow-hidden ${
                      plan.popular 
                        ? 'bg-[hsl(var(--color-accent))] text-[hsl(var(--color-primary-dark))]' 
                        : 'bg-[hsl(var(--color-primary))] text-white'
                    }`}
                  >
                    <span className="relative z-10">Select Plan</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0" />
                  </a>
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
                      { icon: Target, title: "Strategic Roadmap", desc: "Presenting your fixed-price, specialist-designed treatment plan." },
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
                    <img src="/clinic/dentist-chair-proper.jpeg" className="w-full h-auto rounded-[4rem] aspect-[4/5] object-cover" />
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
                  <a
                    id="final-cta-whatsapp"
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 bg-[hsl(var(--color-primary))] text-white rounded-2xl font-bold text-base shadow-xl hover:bg-[hsl(var(--color-primary-dark))] transition-all duration-300 hover:scale-105"
                  >
                    Start with WhatsApp
                  </a>
                  <a
                    id="final-cta-call"
                    href={`tel:${phoneNumber}`}
                    className="w-full sm:w-auto px-8 py-4 border-2 border-[hsl(var(--color-primary))] text-[hsl(var(--color-primary))] rounded-2xl font-bold text-base hover:bg-[hsl(var(--color-primary))]/5 transition-all duration-300 text-center"
                  >
                    Direct Call Expert
                  </a>
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
