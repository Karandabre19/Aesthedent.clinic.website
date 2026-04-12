'use client';

import { pushToDataLayer } from '@/lib/gtm';
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { services } from '@/lib/services';
import {
  Phone,
  MessageCircle,
  Star,
  Play,
  ArrowRight,
  MapPin,
  Clock,
  ChevronRight,
  Quote,
  Monitor,
  Info,
  Hand,
  Eye
} from 'lucide-react';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import InsightsSection from '@/components/sections/InsightsSection';
import treatmentProcessImage from "../public/clinic/treatment-process.jpeg";
import treatMentChairImage from "../public/clinic/dentist-chair-proper.jpeg";
import sahilTreatmentImage from "../public/clinic/treatment-process.2jpeg.jpeg"
import { toast } from 'sonner';

gsap.registerPlugin(useGSAP);

const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';
const phoneNumber = '+919309816336';

const trustStats = [
  { value: 5, decimals: 1, suffix: '', label: 'Google Rating', sub: '263 Reviews' },
  { value: 10, decimals: 0, suffix: '+', label: 'Years', sub: 'Experience' },
  { value: 5000, decimals: 0, suffix: '+', label: 'Happy', sub: 'Patients' },
  { value: 100, decimals: 0, suffix: '%', label: 'Painless', sub: 'Treatments' },
];

function AnimatedStatNumber({ value, decimals = 0, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 1.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [delay, isInView, value]);

  const formattedValue =
    decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toString();

  return <span ref={ref}>{formattedValue}{suffix}</span>;
}

function TrustStatCard({ stat, index }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative overflow-hidden rounded-[1.75rem] bg-[hsl(var(--background))] px-5 py-6 text-center transition-all duration-300"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))]/90 to-transparent opacity-80" />
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[hsl(var(--color-accent))]/12 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -left-12 bottom-0 h-20 w-20 rounded-full bg-[hsl(var(--color-primary))]/8 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <p className="mb-2 text-3xl font-bold tracking-tight text-[hsl(var(--color-primary))] md:text-4xl">
        <AnimatedStatNumber
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
          ? 'border-orange-500/20 hover:border-orange-500/40'
          : 'border-[hsl(var(--color-primary))]/10 hover:border-[hsl(var(--color-primary))]/30'
        }`}
    >
      {/* Background Decorative Icon (Smaller) */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none transform group-hover:scale-125 group-hover:-translate-x-2">
        <Icon className="w-24 h-24" />
      </div>

      <div className="flex items-center justify-between w-full mb-4">
        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isLast ? 'bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white' : 'bg-[hsl(var(--color-accent))]/10 text-[hsl(var(--color-accent))] group-hover:bg-[hsl(var(--color-accent))] group-hover:text-white'}`}>
          <Icon className="w-6 h-6" />
          {isLast && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
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
        <div className="mt-4 flex items-center gap-2 px-2.5 py-1 bg-orange-50 rounded-lg border border-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider">Control Signal active</span>
        </div>
      )}
    </motion.div>
  );
}

function HeroWord({ children, className = '' }) {
  const text = String(children);

  return (
    <span className={`hero-word-shell inline-flex overflow-hidden align-top pb-[0.2em] -mb-[0.2em] ${className}`} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span className="hero-word inline-flex will-change-transform" aria-hidden="true">
        {text.split('').map((char, index) => (
          <span
            key={`${text}-${index}`}
            className={`hero-char inline-block translate-y-[1.15em] opacity-0 will-change-transform transform-gpu ${char !== ' ' ? 'hero-char-gap' : ''}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const hasTrackedHomeView = useRef(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  useEffect(() => {
    if (hasTrackedHomeView.current) {
      return;
    }

    pushToDataLayer({
      event: 'home_view',
    });
    hasTrackedHomeView.current = true;
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(
        [
          '.hero-bg-image',
          '.hero-overlay',
          '.hero-orb',
          '.hero-eyebrow',
          '.hero-divider',
          '.hero-char',
          '.hero-copy',
          '.hero-actions > *',
        ],
        {
          autoAlpha: 1,
          y: 0,
          yPercent: 0,
          scale: 1,
          x: 0,
        }
      );
      return;
    }

    const mm = gsap.matchMedia();

    const createHeroTimeline = ({
      charStagger,
      ambientShift,
      enableAmbient,
    }) => {
      gsap.set(
        [
          '.hero-bg-image',
          '.hero-overlay',
          '.hero-orb',
          '.hero-eyebrow',
          '.hero-divider',
          '.hero-char',
          '.hero-copy',
          '.hero-action-btn',
        ],
        {
          force3D: true,
          willChange: 'transform, opacity',
        }
      );

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo(
        '.hero-bg-image',
        {
          scale: 1.08,
          yPercent: 2,
          transformOrigin: 'center center',
        },
        {
          scale: 1,
          yPercent: 0,
          duration: 1.35,
          ease: 'power2.out',
        },
        0
      )
        .fromTo(
          '.hero-overlay',
          {
            autoAlpha: 0.2,
          },
          {
            autoAlpha: 1,
            duration: 0.95,
          },
          0.05
        )
        .to(
          '.hero-orb',
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power2.out',
          },
          0.1
        )
        .to(
          '.hero-eyebrow',
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.58,
          },
          0.14
        )
        .to(
          '.hero-divider',
          {
            scaleX: 1,
            autoAlpha: 1,
            duration: 0.72,
          },
          0.2
        )
        .to(
          '.hero-line-1 .hero-char',
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: charStagger,
          },
          0.22
        )
        .to(
          '.hero-line-2 .hero-char',
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.78,
            stagger: charStagger,
          },
          0.34
        )
        .to(
          '.hero-copy',
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.62,
          },
          0.58
        )
        .to(
          '.hero-action-btn',
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.58,
            stagger: 0.08,
          },
          0.66
        );

      let ambient;

      if (enableAmbient) {
        ambient = gsap.timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: 'sine.inOut' },
          delay: 1.1,
        });

        ambient
          .to(
            '.hero-orb-1',
            {
              x: ambientShift,
              y: -12,
              duration: 5.4,
            },
            0
          )
          .to(
            '.hero-orb-2',
            {
              x: -ambientShift,
              y: 10,
              duration: 6,
            },
            0.2
          )
          .to(
            '.hero-bg-image',
            {
              yPercent: -1.4,
              scale: 1.02,
              duration: 6.2,
            },
            0
          );
      }

      return () => {
        tl.kill();
        ambient?.kill();
        gsap.set(
          [
            '.hero-bg-image',
            '.hero-overlay',
            '.hero-orb',
            '.hero-eyebrow',
            '.hero-divider',
            '.hero-char',
            '.hero-copy',
            '.hero-action-btn',
          ],
          {
            clearProps: 'willChange',
          }
        );
      };
    };

    mm.add('(min-width: 768px)', () =>
      createHeroTimeline({
        charStagger: 0.022,
        ambientShift: 16,
        enableAmbient: true,
      })
    );

    mm.add('(max-width: 767px)', () =>
      createHeroTimeline({
        charStagger: 0.014,
        ambientShift: 8,
        enableAmbient: false,
      })
    );

    return () => mm.revert();
  }, { scope: heroRef });

  return (
    <PageWrapper>
      {/* Hero Section - Full Screen Cinematic */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-secondary))]/60 via-[hsl(var(--color-secondary))]/30 to-transparent z-10" />
          <Image
            src="/homepage-banner.png"
            alt="Premium Dental Care - Crystalline Tooth"
            className="hero-bg-image h-full w-full object-cover will-change-transform transform-gpu"
            fill
            priority
            sizes="100vw"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-20 h-full flex items-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="main-container">
            <div className="relative max-w-3xl">
              <div className="hero-orb hero-orb-1 pointer-events-none absolute -left-8 top-10 h-28 w-28 translate-y-6 rounded-full bg-[hsl(var(--color-accent))]/15 opacity-0 blur-3xl transform-gpu" />
              <div className="hero-orb hero-orb-2 pointer-events-none absolute right-6 top-28 h-36 w-36 translate-y-6 rounded-full bg-white/10 opacity-0 blur-3xl transform-gpu" />

              <div>
                <p className="hero-eyebrow mb-6 translate-y-4 text-sm font-medium uppercase tracking-[0.3em] text-[hsl(var(--color-accent))] opacity-0 transform-gpu md:text-base">
                  Aesthedent — Kothrud, Pune
                </p>
                <div className="hero-divider mb-8 h-px w-24 origin-left scale-x-0 bg-gradient-to-r from-[hsl(var(--color-accent))] to-transparent opacity-0 transform-gpu" />
              </div>

              <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-[hsl(var(--color-primary))] leading-[1.1] mb-6 sm:mb-8">
                <span className="hero-line hero-line-1 relative block overflow-hidden pb-1 sm:pb-2">
                  <HeroWord>We explain</HeroWord>{" "}
                  <HeroWord className="font-semibold italic">
                    everything
                  </HeroWord>
                </span>
                <span className="hero-line hero-line-2 relative block overflow-hidden pb-1 sm:pb-2">
                  <HeroWord className="hero-accent-word font-semibold text-[hsl(var(--color-accent))]">
                    before we
                  </HeroWord>{" "}
                  <HeroWord className="hero-accent-word font-semibold text-[hsl(var(--color-accent))]">
                    start.
                  </HeroWord>
                </span>
              </h1>

              <p className="hero-copy mb-8 sm:mb-10 max-w-xl translate-y-6 text-base sm:text-lg leading-relaxed text-[hsl(var(--color-primary))]/85 opacity-0 transform-gpu md:text-lg">
                We provide clear dental care in Kothrud, Pune. No hiding costs, no skipping details, and no rushing you into treatment.
              </p>

              <div className="hero-actions flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-action-btn group inline-flex translate-y-6 scale-95 items-center justify-center gap-2 sm:gap-3 rounded-full bg-[hsl(var(--color-accent))] px-6 sm:px-8 py-3 sm:py-4 font-semibold text-[hsl(var(--accent-foreground))] opacity-0 transition-all duration-300 transform-gpu hover:shadow-lg hover:-translate-y-1 text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Chat on WhatsApp
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://maps.app.goo.gl/BVb9iy5EQkmbYSVPA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-action-btn group inline-flex translate-y-6 scale-95 items-center justify-center gap-2 sm:gap-3 rounded-full border-2 border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/10 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-[hsl(var(--color-primary))] opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 transform-gpu hover:border-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary))]/20 text-sm sm:text-base"
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Visit Us</span>
                  <span className="sm:hidden">Location</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Trust Badges - Floating */}
      <section className="relative z-30 -mt-20">
        <div className="main-container">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] bg-[hsl(var(--background))] p-4 md:p-5 lg:p-6"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--color-accent)/0.16),transparent_26%),radial-gradient(circle_at_bottom_left,hsl(var(--color-primary)/0.08),transparent_28%)]" />
            <motion.div
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-2xl"
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
      <section className="relative z-20 bg-gradient-to-b from-[hsl(var(--background))] to-white pt-16 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24">
        <div className="main-container">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--color-primary))] leading-tight mb-4">
                If you're feeling nervous...
              </h2>
              <p className="text-base sm:text-lg text-[hsl(var(--color-text-muted))]">
                You're not alone. We've built our entire Kothrud practice around making you feel in control. Here is our promise:
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <AdvancedPromiseCard
              num="01"
              icon={Clock}
              title="Unhurried Clinical Excellence"
              desc="I’ve designed my Kothrud practice specifically to avoid the 'conveyor-belt' dentistry common today. I schedule fewer patients to ensure I can dedicate my full focus to your care. Your procedure won't start until I’m certain you feel settled and in control."
            />
            <AdvancedPromiseCard
              num="02"
              icon={Eye}
              title="Purposeful Communication"
              desc="Clear vision leads to clear confidence. I prioritize eye-to-eye consultations, using advanced intraoral imaging not just to diagnose, but to educate. My goal is for you to leave with a complete understanding of your oral health, not just a prescription."
            />
            <AdvancedPromiseCard
              num="03"
              icon={Info}
              title="Sensory Transparency"
              desc="The fear of dentistry is often a fear of the unexpected. I bridge that gap by narrating each step of your treatment in real-time—preparing you for every vibration, sound, or sensation. When you know exactly what’s coming, the anxiety fades."
            />
            <AdvancedPromiseCard
              num="04"
              icon={Hand}
              isLast={true}
              title="Your Safety, Your Signal"
              desc="Ethical care means you are always the primary decision-maker. We implement a specific 'rest signal' before any treatment begins. If you raise your hand, my tools are down instantly. You have my word that we pause as often and for as long as you need."
            />
          </div>
        </div>
      </section>

      {/* About Section - Story Style */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-[hsl(var(--bg-alt))]">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="absolute -inset-4 bg-[hsl(var(--primary))]/10 rounded-3xl transform -rotate-3" />
                <Image
                  src={sahilTreatmentImage}
                  alt="Dr. Sahil Wathodkar at Aesthedent Multispeciality Dental Clinic"
                  className="relative rounded-2xl shadow-xl w-full aspect-[4/5] object-cover"
                />
                <div
                  onClick={() => toast.info("Video is not currently available", {
                    description: "Our intro video is being updated. Please check back later.",
                    duration: 4000,
                  })}
                  className="premium-surface absolute -bottom-6 -right-6 hidden rounded-2xl p-4 sm:p-6 md:block cursor-pointer active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[hsl(var(--accent))]/20 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--primary))]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[hsl(var(--color-text))] text-sm sm:text-base mb-1">
                        Meet Dr. Sahil Wathodkar
                      </p>
                      <p className="text-xs sm:text-sm text-[hsl(var(--color-text-muted))]">
                        2 min intro
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-xs sm:text-sm font-semibold">
                Our Approach
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--color-text))] leading-tight mb-4 sm:mb-6">
                It's normal to feel nervous.
              </h2>
              <p className="text-base sm:text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-4 sm:mb-6">
                Most people feel a little nervous or unsure about visiting the dentist. You might not know what to expect, or you might worry about unexpected costs.
              </p>
              <p className="text-sm sm:text-base text-[hsl(var(--color-text-muted))] leading-relaxed mb-6 sm:mb-8">
                We handle things differently. We use digital tools to show you exactly what's happening inside your mouth. We explain what needs fixing and what can wait, in plain words. There's never any pressure to decide right away.
              </p>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-[hsl(var(--primary))] font-semibold hover:text-[hsl(var(--primary-dark))] transition-colors text-base sm:text-lg"
              >
                Read our full story
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Smile Stories Section - Dynamic */}
      <section className="py-20 md:py-32 bg-white">
        <TestimonialsSection
          title="Real Stories From Real Patients"
          subtitle="These transformations inspire us every day—and we love sharing them."
          limit={3}
          variant="compact"
        />

        <div className="main-container mt-12">
          <AnimatedSection className="text-center">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-3 text-[hsl(var(--primary))] font-semibold hover:text-[hsl(var(--primary-dark))] transition-colors text-lg"
            >
              View all patient stories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Painless Dentistry Section */}
      {/* Treatment Experience Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-br from-[hsl(var(--primary))]/5 via-white to-[hsl(var(--accent))]/5">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left">
              <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                Your Visit
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--color-text))] leading-tight mb-4 sm:mb-6">
                What happens when you visit.
              </h2>
              <p className="text-base sm:text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-6 sm:mb-8">
                We follow a clear process so you always know what's coming next:
              </p>

              <div className="space-y-3 sm:space-y-5 mb-8 sm:mb-10">
                {[
                  "Checkup: We take a look and show you your teeth on a screen.",
                  "Explanation: We explain the problem in simple words.",
                  "Planning: We discuss what needs fixing now and what can wait.",
                  "Cost: We tell you the exact price before we do anything.",
                  "Treatment: We make sure you are fully numb and comfortable.",
                  "Follow-up: We check in to see how you are healing."
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--primary))]" />
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-[hsl(var(--color-text))] font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/aesthedent-experience"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-dark))] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 text-sm sm:text-base"
              >
                Learn about our process
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right" className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                <Image
                  src={treatmentProcessImage}
                  alt="Gentle dental care at Aesthedent"
                  className="rounded-2xl shadow-lg w-full aspect-[3/4] object-cover"
                />
                <Image
                  src={treatMentChairImage}
                  alt="Modern dental equipment"
                  className="rounded-2xl shadow-lg w-full aspect-[3/4] object-cover mt-4 sm:mt-6 md:mt-8"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-[hsl(var(--primary))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-12 sm:mb-16 md:mb-24">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-full text-xs sm:text-sm font-semibold">
              Specialized Care
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 sm:mb-6">
              Expert Solutions for Your Smile.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              From precision implants to expert root canals, we explain every clinical detail before we start.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7 lg:gap-9">
            {services.slice(0, 6).map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link href={`/services/${service.slug}`}>
                  <div className="card-elevated group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-white/20 hover:-translate-y-2 transition-transform">
                    <div className="aspect-[16/10] overflow-hidden bg-[hsl(var(--bg-alt))]">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-primary))]/95 via-[hsl(var(--color-primary))]/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pb-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-white group-hover:text-[hsl(var(--color-accent))] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-white/85 text-xs sm:text-sm mb-4 line-clamp-2">
                        {service.shortDesc}
                      </p>
                      <span className="inline-flex items-center gap-1 sm:gap-2 text-[hsl(var(--color-accent))] text-xs sm:text-sm font-medium">
                        Explore details
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-10 sm:mt-12 md:mt-14 lg:mt-16">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-white/90 text-[hsl(var(--primary))] font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base md:text-lg"
            >
              Explore all services
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Insights Section - Premium Editorial */}
      <InsightsSection
        title="Insights"
        subtitle="Trusted knowledge from real experts—not generic content. Real answers to real patient questions."
      />

      {/* Doctors Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-[hsl(var(--bg-alt))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-12 sm:mb-16 md:mb-24">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-xs sm:text-sm font-semibold">
              Our Team
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--color-text))] leading-tight mb-3 sm:mb-6">
              Top Dentists in Kothrud, Pune
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[hsl(var(--color-text-muted))] max-w-2xl mx-auto">
              Our dedicated team of skilled dental professionals at Aesthedent is committed to providing exceptional care, ensuring every treatment is as comfortable and precise as possible.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Dr. Sahil Wathodkar",
                role: "Lead Dentist & Founder",
                image: "/assets/doctor-male.jpeg",
                desc: "Specializes in implants and restorative dentistry with a focus on patient education and comfort.",
              },
              {
                name: "Dr. Aishwarya Kulkarni",
                role: "Dental Surgeon",
                image: "/assets/doctor-female.jpeg",
                desc: "Expert in painless extractions and complex cases. Known for her calm, thorough approach.",
              },
            ].map((doctor, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="card-elevated group rounded-xl sm:rounded-2xl bg-white overflow-hidden">
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/5] overflow-hidden">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={600}
                        height={750}
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-[hsl(var(--primary))]/15" />

                    {/* Name Card - Hidden on mobile, shown on sm+ */}
                    <div className="hidden sm:block absolute left-6 right-6 top-6 max-w-[85%]">
                      <div className="rounded-lg sm:rounded-xl border border-white/80 bg-white/90 px-4 sm:px-6 py-3 sm:py-4 shadow-lg backdrop-blur-md">
                        <p className="mb-1 sm:mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]/70">
                          Dentist
                        </p>
                        <h3 className="text-lg sm:text-xl font-bold leading-tight text-[hsl(var(--primary))]">
                          {doctor.name}
                        </h3>
                      </div>
                    </div>

                    {/* Description - Positioned at bottom, hidden on mobile */}
                    <div className="hidden sm:block absolute bottom-5 left-5 right-5 rounded-[1.6rem] border border-white/65 bg-[hsl(var(--background))]/84 p-5 shadow-[0_24px_54px_-30px_hsl(var(--color-primary)/0.38)] backdrop-blur-xl">
                      <p className="mb-3 inline-flex rounded-full bg-[hsl(var(--color-primary))] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[hsl(var(--color-accent))]">
                        {doctor.role}
                      </p>
                      <p className="text-sm leading-relaxed text-[hsl(var(--color-text-muted))]">
                        {doctor.desc}
                      </p>
                    </div>
                  </div>

                  {/* Name Display - Visible on mobile only */}
                  <div className="sm:hidden p-4 border-t border-[hsl(var(--color-border))]">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--primary))]/70">
                      Dentist
                    </p>
                    <h3 className="text-lg font-bold text-[hsl(var(--primary))] mb-2">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-[hsl(var(--color-primary))] font-semibold mb-3 uppercase tracking-wider">
                      {doctor.role}
                    </p>
                    <p className="text-xs leading-relaxed text-[hsl(var(--color-text-muted))]">
                      {doctor.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/doctor"
              className="inline-flex items-center gap-2 text-[hsl(var(--color-primary))] font-semibold hover:text-[hsl(var(--color-primary-dark))] transition-colors"
            >
              Meet the full team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-[hsl(var(--primary))]">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <AnimatedSection>
              <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-full text-xs sm:text-sm font-semibold">
                Get in Touch
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6 md:mb-8">
                Ready to talk?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed mb-6 sm:mb-8 md:mb-10">
                We're in Kothrud. You can visit or call. We'll explain everything before we start.
              </p>

              <div className="space-y-4 sm:space-y-5 md:space-y-7 mb-8 sm:mb-10 md:mb-12">
                <a
                  href="https://maps.app.goo.gl/BVb9iy5EQkmbYSVPA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 sm:gap-5 hover:opacity-80 transition-opacity cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1 sm:mb-2 text-base sm:text-lg group-hover:text-[hsl(var(--accent))] transition-colors">
                      Our Clinic
                    </p>
                    <p className="text-white/80 leading-relaxed text-xs sm:text-sm md:text-base group-hover:text-white transition-colors">
                      Dahanukar Colony, Kothrud, Pune 411038
                      <br />
                      Near Karve Statue
                    </p>
                  </div>
                </a>
                <div className="flex items-start gap-3 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1 sm:mb-2 text-base sm:text-lg">
                      Hours
                    </p>
                    <p className="text-white/80 leading-relaxed text-xs sm:text-sm md:text-base">
                      Monday–Saturday: 10 AM–8 PM
                      <br />
                      <span className="text-xs">
                        Sunday: By appointment only
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1 sm:mb-2 text-base sm:text-lg">
                      Reach Us
                    </p>
                    <a
                      href={`tel:${phoneNumber}`}
                      className="text-white hover:text-white/90 transition-colors font-semibold text-base sm:text-lg"
                    >
                      +91 93098 16336
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <a
                  id="home-final-whatsapp"
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--accent-foreground))] font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Message on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/15 text-white font-semibold rounded-lg border-2 border-white/40 hover:border-white/60 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                >
                  <span>Contact Form</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
                <Image
                  src={sahilTreatmentImage}
                  alt="Aesthedent Dental Clinic in Kothrud"
                  width={800}
                  height={600}
                  className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
