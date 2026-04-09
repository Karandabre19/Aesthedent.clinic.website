'use client';

import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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
  Quote
} from 'lucide-react';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import treatmentProcessImage from "@/public/clinic/treatment-process.jpeg";
import treatMentChairImage from "@/public/clinic/dentist-chair-proper.jpeg";

gsap.registerPlugin(useGSAP);

const whatsappNumber = '919876543210';
const whatsappMessage = encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
const phoneNumber = '+919876543210';

const trustStats = [
  { value: 5, decimals: 1, suffix: '', label: 'Google Rating', sub: '263 Reviews' },
  { value: 10, decimals: 0, suffix: '+', label: 'Years', sub: 'Experience' },
  { value: 5000, decimals: 0, suffix: '+', label: 'Happy', sub: 'Patients' },
  { value: 100, decimals: 0, suffix: '%', label: 'Painless', sub: 'Treatments' },
];

function AnimatedStatNumber({ value, decimals = 0, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.8 });
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
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

function HeroWord({ children, className = '' }) {
  const text = String(children);

  return (
    <span className={`hero-word-shell inline-flex overflow-hidden align-top ${className}`} aria-label={text}>
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
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
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
          <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-secondary))]/80 via-[hsl(var(--color-secondary))]/50 to-transparent z-10" />
          <img
            src="https://images.pexels.com/photos/3762441/pexels-photo-3762441.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Beautiful Smile"
            className="hero-bg-image h-full w-full object-cover will-change-transform transform-gpu"
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
                  Aesthedent Dental Clinic
                </p>
                <div className="hero-divider mb-8 h-px w-24 origin-left scale-x-0 bg-gradient-to-r from-[hsl(var(--color-accent))] to-transparent opacity-0 transform-gpu" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-8">
                <span className="hero-line hero-line-1 block overflow-hidden pb-2">
                  <HeroWord>Look</HeroWord>{' '}
                  <HeroWord className="font-semibold italic">beautiful.</HeroWord>
                </span>
                <span className="hero-line hero-line-2 block overflow-hidden pb-2">
                  <HeroWord className="hero-accent-word text-[hsl(var(--color-accent))]">Inside</HeroWord>{' '}
                  <HeroWord className="hero-accent-word text-[hsl(var(--color-accent))]">out.</HeroWord>
                </span>
              </h1>

              <p className="hero-copy mb-10 max-w-xl translate-y-6 text-lg leading-relaxed text-[hsl(var(--color-primary))] opacity-0 transform-gpu md:text-xl">
                Where painless dentistry meets honest care. Experience dental
                treatments designed around your comfort.
              </p>

              <div className="hero-actions flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-action-btn group inline-flex translate-y-6 scale-95 items-center gap-3 rounded-full bg-[hsl(var(--color-primary))] px-8 py-4 font-medium text-[hsl(var(--primary-foreground))] opacity-0 transition-all duration-300 transform-gpu hover:bg-[hsl(var(--color-primary-light))]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Book Appointment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={`tel:${phoneNumber}`}
                  className="hero-action-btn inline-flex translate-y-6 scale-95 items-center gap-3 rounded-full border border-white/75 bg-[hsl(var(--background))]/88 px-8 py-4 font-medium text-[hsl(var(--color-primary))] opacity-0 shadow-[0_22px_46px_-26px_hsl(var(--color-primary)/0.4)] backdrop-blur-md transition-all duration-300 transform-gpu hover:border-[hsl(var(--color-accent))]/40 hover:bg-[hsl(var(--background))]/96 hover:shadow-[0_28px_56px_-28px_hsl(var(--color-primary)/0.48)]"
                >
                  <Phone className="w-5 h-5" />
                  +91 98765 43210
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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

      {/* About Section - Story Style */}
      <section className="py-24 lg:py-32">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="absolute -inset-4 bg-[hsl(var(--color-primary-light))] rounded-3xl transform -rotate-3" />
                <img
                  src="https://images.pexels.com/photos/6502635/pexels-photo-6502635.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Dr. Sahil at Aesthedent"
                  className="relative rounded-2xl shadow-xl w-full aspect-[4/5] object-cover"
                />
                <div className="premium-surface absolute -bottom-6 -right-6 hidden rounded-2xl p-6 md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[hsl(var(--color-primary-light))] rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-[hsl(var(--color-primary))] ml-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Watch Our Story
                      </p>
                      <p className="text-sm text-gray-500">2 min video</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <p className="text-[hsl(var(--color-primary))] font-medium tracking-wide uppercase text-sm mb-4">
                Our Philosophy
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--color-text))] leading-tight mb-6">
                Dentistry is an{" "}
                <span className="font-semibold italic">art</span> and{" "}
                <span className="font-semibold italic">science</span> of
                precision.
              </h2>
              <p className="text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-8">
                At Aesthedent, we believe every smile tells a story. Our
                approach combines cutting-edge technology with a deeply personal
                touch, ensuring that your journey to a healthier smile is as
                comfortable as it is transformative.
              </p>
              <p className="text-[hsl(var(--color-text-muted))] leading-relaxed mb-10">
                Founded by Dr. Sahil with a simple vision: to create a dental
                clinic where patients actually want to visit. Where fear is
                replaced with comfort, and every treatment is explained with
                honesty and care.
              </p>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-[hsl(var(--color-primary))] font-semibold hover:text-[hsl(var(--color-primary-dark))] transition-colors"
              >
                Learn our story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Smile Stories Section - Dynamic */}
      <TestimonialsSection
        title="#SmileStories"
        subtitle="Stories that drive us. Stories that give purpose. Stories that bring smiles."
        limit={3}
        variant="compact"
      />

      <section className="py-6 bg-[hsl(var(--background))]">
        <div className="main-container">
          <AnimatedSection className="text-center">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 text-[hsl(var(--color-primary))] font-semibold hover:text-[hsl(var(--color-primary-dark))] transition-colors"
            >
              See more stories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Painless Dentistry Section */}
      <section className="py-24 lg:py-32">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection>
              <p className="text-[hsl(var(--color-primary))] font-medium tracking-wide uppercase text-sm mb-4">
                The Experience
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--color-text))] leading-tight mb-6">
                Say hello to{" "}
                <span className="font-semibold italic text-[hsl(var(--color-primary))]">
                  painless
                </span>{" "}
                dentistry!
              </h2>
              <p className="text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-8">
                Sounds too good to be true? It's absolutely true. We do a bunch
                of things at our clinic that ensures your experience is top
                notch. No more getting frightened at Aesthedent.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Advanced numbing techniques - you won't feel a thing",
                  "Calm, spa-like environment designed for relaxation",
                  "Step-by-step explanation before any procedure",
                  "Gentle approach with modern, quiet equipment",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[hsl(var(--color-primary-light))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-[hsl(var(--color-primary))]" />
                    </div>
                    <p className="text-[hsl(var(--color-text))]">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--color-secondary))] hover:bg-[hsl(var(--color-secondary-dark))] text-[hsl(var(--primary-foreground))] font-medium rounded-full transition-colors"
              >
                Know more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right" className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={treatmentProcessImage.src}
                  alt="Gentle dental care"
                  className="rounded-2xl shadow-lg w-full aspect-[3/4] object-cover"
                />
                <img
                  src={treatMentChairImage.src}
                  alt="Modern equipment"
                  className="rounded-2xl shadow-lg w-full aspect-[3/4] object-cover mt-8"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-[hsl(var(--color-primary))] text-[hsl(var(--primary-foreground))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[hsl(var(--color-accent))] font-medium tracking-wide uppercase text-sm mb-4">
              Our Services
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
              Expert care for{" "}
              <span className="font-semibold italic">every</span> smile
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link href={`/services/${service.slug}`}>
                  <div className="premium-surface-dark group relative overflow-hidden rounded-2xl">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-primary))]/95 via-[hsl(var(--color-primary))]/55 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-[hsl(var(--color-accent))] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[hsl(var(--color-text-light))] text-sm mb-4">
                        {service.shortDesc}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[hsl(var(--color-accent))] text-sm font-medium">
                        Learn more
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--color-accent))] hover:bg-[hsl(var(--color-accent))]/90 text-[hsl(var(--color-secondary))] font-medium rounded-full transition-colors"
            >
              View all services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-24 lg:py-32">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[hsl(var(--color-primary))] font-medium tracking-wide uppercase text-sm mb-4">
              Meet the Team
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--color-text))] leading-tight">
              We're the <span className="font-semibold italic">dentists</span>{" "}
              of dentists
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Dr. Sahil Sharma",
                role: "Lead Dentist & Founder",
                image: "/assets/doctor-male.jpeg",
                desc: "Specializes in implants and restorative dentistry. Known for his calm demeanor and thorough explanations.",
              },
              {
                name: "Dr. Aishwarya Kulkarni",
                role: "Dental Surgeon",
                image: "/assets/doctor-female.jpeg",
                desc: "Expert in painless extractions and pediatric dentistry. Patients love her gentle, reassuring approach.",
              },
            ].map((doctor, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="premium-surface group relative overflow-hidden rounded-[2rem] bg-[hsl(var(--background))]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-[hsl(var(--color-primary))]/10" />

                  <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
                    <div className="max-w-[76%] rounded-[1.5rem] border border-white/70 bg-[hsl(var(--background))]/82 px-5 py-4 shadow-[0_22px_48px_-28px_hsl(var(--color-primary)/0.34)] backdrop-blur-xl">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[hsl(var(--color-primary)/0.6)]">
                        Aesthedent Doctor
                      </p>
                      <h3 className="text-2xl font-semibold leading-tight text-[hsl(var(--color-primary))]">
                        {doctor.name}
                      </h3>
                    </div>

                    <div className="rounded-[1.35rem] border border-[hsl(var(--color-accent))]/35 bg-[hsl(var(--color-primary))]/90 px-3 py-2 text-right shadow-[0_18px_38px_-24px_hsl(var(--color-primary-dark)/0.7)] backdrop-blur-md">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                        Team
                      </p>
                      <p className="text-lg font-semibold text-[hsl(var(--color-accent))]">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-[1.6rem] border border-white/65 bg-[hsl(var(--background))]/84 p-5 shadow-[0_24px_54px_-30px_hsl(var(--color-primary)/0.38)] backdrop-blur-xl">
                    <p className="mb-3 inline-flex rounded-full bg-[hsl(var(--color-primary))] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[hsl(var(--color-accent))]">
                      {doctor.role}
                    </p>
                    <p className="text-sm leading-relaxed text-[hsl(var(--color-text-muted))]">
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
      <section className="py-24 lg:py-32 bg-[hsl(var(--color-primary))]">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-[hsl(var(--primary-foreground)/0.8)] font-medium tracking-wide uppercase text-sm mb-4">
                Visit Us
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--primary-foreground))] leading-tight mb-8">
                Ready for your{" "}
                <span className="font-semibold italic">best</span> smile?
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Location</p>
                    <p className="text-[hsl(var(--primary-foreground))]/80">Near Karve Statue, Kothrud, Pune 411038</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Opening Hours</p>
                    <p className="text-[hsl(var(--primary-foreground))]/80">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-[hsl(var(--primary-foreground))]/70 text-sm">Sunday: Closed (By appointment only)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">For Appointments</p>
                    <a href={`tel:${phoneNumber}`} className="text-[hsl(var(--primary-foreground))]/80 hover:text-white transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[hsl(var(--primary))] font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Book on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 border border-white/20 transition-colors"
                >
                  Get Directions
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/4269950/pexels-photo-4269950.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Aesthedent Clinic"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
