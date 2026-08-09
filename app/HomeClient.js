'use client';

import { pushToDataLayer } from '@/lib/gtm';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';
import InstagramShowcase from '@/components/sections/InstagramShowcase';
import { MagneticWrapper, HeroParticles } from '@/components/ui/InteractiveHighTech';
import { services } from '@/lib/services';
import {
  REVIEWS,
  REVIEWS_NUMERIC,
  DOCTORS,
  STATS,
  WHATSAPP_NUMBER,
  buildWhatsappMessage,
} from '@/lib/clinic';
import IntakeWizard from '@/components/forms/IntakeWizard';
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
  Eye,
  Calendar
} from 'lucide-react';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import InsightsSection from '@/components/sections/InsightsSection';
import treatmentProcessImage from "../public/clinic/treatment-process.jpeg";
import treatMentChairImage from "../public/clinic/dentist-chair-proper.jpeg";
import sahilTreatmentImage from "../public/clinic/treatment-process.2jpeg.jpeg"
import { toast } from 'sonner';

gsap.registerPlugin(useGSAP);

// Built, not typed. This used to be a hand-written URL with the clinic's number
// baked into it -a second copy of a value that lives in lib/clinic.ts, and one
// that would not have been fixed when the number was corrected there.
const whatsappLink = buildWhatsappMessage();
const phoneNumber = `+${WHATSAPP_NUMBER}`;

// Single source of truth for the <h1> accessible name. Must stay in sync with
// the words composed in the heading below.
//
// Phase 4B: the approved positioning line. Was "Dental Care in Kothrud, Pune.
// Redefined." - which carried both Tier-1 terms.
//
// This one carries NEITHER, and that is a deliberate, accepted trade: no
// competitor in the Kothrud top 8 competes on dental anxiety, so this is the one
// line on the site that cannot be mistaken for theirs. The Tier-1 terms move one
// element down into the sub-line and into the trust bar's H2 - the <title> was
// already keyword-first and is untouched.
// See audit/01-content-spine.md §0.1.
const HERO_HEADING = 'The dentist that takes the fear away.';

// "100% Painless Treatments" was an absolute claim about a clinical OUTCOME on
// health content - pain varies by patient and procedure, so it cannot be
// promised. It was removed and is not coming back in any form.
//
// Every number in this bar renders from lib/clinic.ts - never typed here.
//
// HISTORY, because this bar has flip-flopped: "10+ Years Experience" (N3) and
// "5000+ Happy Patients" (N4) were stripped in Phase 4B as unsourced. They are
// back on 2026-08-08 because Dr. Sahil supplied real figures, which was the
// documented condition for their return - and the patient count came down 5x,
// from 5000+ to a confirmed 1000+. See the STATS block in lib/clinic.ts and
// audit/NEEDS-INPUT.md N3/N4/N5 before changing any of them.
//
// The MDS and six-days-a-week entries moved out to make room; both facts still
// appear elsewhere on the page (doctors section and the contact section's hours).
const trustStats = [
  {
    value: REVIEWS_NUMERIC.rating,
    decimals: 1,
    suffix: '',
    label: 'Google Rating',
    sub: `${REVIEWS.count} Reviews`,
  },
  // The four STATS entries are strings carrying a "+" ("10+", "1000+"), so they
  // use `display` -a literal, like 'MDS' did -rather than `value`, which
  // drives the count-up and needs a number. A count-up to "1000+" would have to
  // invent a number to animate toward and would drop the "+".
  { display: STATS.years, label: 'Years', sub: 'Experience' },
  { display: STATS.patients, label: 'Happy', sub: 'Patients' },
  { display: STATS.implants, label: 'Implants', sub: 'Placed' },
  // COUNT of procedures, never "Painless Root Canals" -see the STATS comment
  // in lib/clinic.ts. Pain is an outcome we cannot promise; a count is a fact.
  { display: STATS.rootCanals, label: 'Root Canals', sub: 'Completed' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Seeded with the real value so it ships in server-rendered HTML. This used to
// be useState(0), so the first crawl saw a 0.0-rated clinic with 0 patients.
//
// The drop to 0 happens only at the moment the count-up actually starts, not on
// mount. Resetting on mount looks equivalent but isn't: a stat below the fold
// would sit at 0 indefinitely, because the animation waits on useInView and the
// reset doesn't. Off-screen stats now keep their real value until they scroll
// into view, and hold it if JS never runs.
function AnimatedStatNumber({ value, decimals = 0, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // Reduced motion: never touch the value - it's already correct.
    if (!isInView || prefersReducedMotion()) return;

    setDisplayValue(0);

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

function TrustStatCard({ stat, index, className = '' }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-[1.75rem] bg-[hsl(var(--background))] px-4 py-5 text-center transition-all duration-300 sm:px-5 sm:py-6 ${className}`}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))]/90 to-transparent opacity-80" />
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[hsl(var(--color-accent))]/12 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -left-12 bottom-0 h-20 w-20 rounded-full bg-[hsl(var(--color-primary))]/8 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* `display` renders a literal string instead of a count-up. Every STATS
          entry uses it, because they all carry a "+" ("10+", "1000+") and a
          count-up would have to invent a target number and would drop the sign.
          Only the Google rating still animates. Same element, same classes. */}
      <p className="mb-2 text-3xl font-bold tracking-tight text-[hsl(var(--color-primary))] md:text-4xl">
        {stat.display ? (
          stat.display
        ) : (
          <AnimatedStatNumber
            value={stat.value}
            decimals={stat.decimals}
            suffix={stat.suffix}
            delay={0.2 + index * 0.08}
          />
        )}
      </p>
      {/* Both lines are 14px minimum. The sub-label was text-xs (12px), which
          is below the readable floor for the smallest text on the page and was
          carrying real information ("280 Reviews", "Completed"), not decoration. */}
      <p className="text-sm font-semibold leading-snug text-[hsl(var(--color-text))]">{stat.label}</p>
      <p className="mt-1 text-sm leading-snug text-[hsl(var(--color-text-muted))]">{stat.sub}</p>
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
      className={`group relative overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] bg-white border-2 p-5 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 z-10 ${isLast
          ? 'border-orange-500/20 hover:border-orange-500/40'
          : 'border-[hsl(var(--color-primary))]/10 hover:border-[hsl(var(--color-primary))]/30'
        }`}
    >
      {/* Background Decorative Icon (Smaller) */}
      <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none transform group-hover:scale-125 group-hover:-translate-x-2">
        <Icon className="w-16 h-16 sm:w-24 sm:h-24" />
      </div>

      <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
        <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isLast ? 'bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white' : 'bg-[hsl(var(--color-accent))]/10 text-[hsl(var(--color-accent))] group-hover:bg-[hsl(var(--color-accent))] group-hover:text-white'}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          {isLast && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
          )}
        </div>
        <span className="text-2xl sm:text-3xl font-black text-[hsl(var(--color-primary))]/10 group-hover:text-[hsl(var(--color-primary))]/15 transition-colors duration-300">
          {num}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-base sm:text-xl font-bold text-[hsl(var(--color-primary))] mb-1.5 sm:mb-2 group-hover:text-[hsl(var(--color-text))] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[13px] leading-6 sm:text-sm sm:leading-relaxed text-[hsl(var(--color-text-muted))] group-hover:text-[hsl(var(--color-text))] transition-colors duration-300">
          {desc}
        </p>
      </div>

      {/* hidden below sm: this badge is revealed by group-hover, and a touch
          device has no hover, so on phones it was never going to appear - it
          just reserved ~46px of blank card under the paragraph. Removing it
          from the flow there is what closes that gap. */}
      {isLast && (
        <div className="mt-4 hidden sm:flex items-center gap-2 px-2.5 py-1 bg-orange-50 rounded-lg border border-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-bold text-orange-600 uppercase tracking-wide">Control Signal active</span>
        </div>
      )}
    </motion.div>
  );
}

// The per-character spans are the ONLY copy of the text. There is deliberately
// no second readable layer: text extractors strip tags without honouring
// aria-hidden, so any clone gets indexed as duplicated words. The heading's
// accessible name comes from aria-label on the <h1>, which has a heading role
// and so exposes it reliably.
function HeroWord({ children, className = '' }) {
  const text = String(children);

  return (
    <span className={`hero-word-shell inline-flex overflow-hidden align-top pb-[0.4em] -mb-[0.4em] pl-[0.05em] pr-[0.4em] ${className}`}>
      <span className="hero-word inline-flex will-change-transform">
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
  // GSAP's hero timeline already guards this (see useGSAP below), but the two
  // Framer loops here run forever and were not covered: an endlessly pulsing
  // scroll cue and a shimmer sweeping the trust bar every 7s. Perpetual motion
  // is exactly what this setting exists to stop.
  const reduceMotion = useReducedMotion();
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
      {/* Height is capped rather than h-screen on purpose. object-cover scales
          by whichever axis needs more, so a hero TALLER than the art's aspect
          ratio makes height the binding axis and magnifies the subject: at
          390x844 the 9:16 mobile art was painted at scale 0.505 and lost 18%
          off its sides. Keeping the hero at or under width x (artH/artW) - 1.78
          for both banners - hands the constraint back to width, so the art sits
          at its natural cover size and only trims a few percent off the bottom.
          78vh/88vh keep a margin below that ceiling across common viewports. */}
      <section
        ref={heroRef}
        className="relative h-[100vh] min-h-[700px] overflow-hidden md:h-[100vh] md:min-h-[620px]"
      >
        {/* Background Image with Parallax */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-secondary))]/60 via-[hsl(var(--color-secondary))]/30 to-transparent z-10" />
          {/* hero-bg-image is the hook the GSAP hero timeline animates (the
              intro scale-down and the ambient drift). It was missing here, so
              five gsap calls were targeting a selector that matched nothing and
              logging "target not found" on every page load.

              Two art-directed crops, not one: the desktop banner is landscape
              (1672x941) and the mobile banner is portrait (941x1672), so a
              single file cannot serve both - object-cover would throw away the
              subject on whichever viewport it wasn't cut for. Both carry
              hero-bg-image so the timeline animates whichever one is visible.

              Each `sizes` collapses to 1px on the viewport where its element is
              display:none. Browsers still fetch hidden <img> elements, so
              without this every visitor would download BOTH banners at full
              width. The 1px branch drops the hidden one to the smallest width
              Next generates for a fill image (640w) - cheap, not free. Resizing
              across the breakpoint re-evaluates sizes and pulls the full image,
              which is normal srcset behaviour. */}
          <Image
            src="/homepage-banner-mobile.png"
            alt="Premium Dental Care - Crystalline Tooth"
            className="hero-bg-image h-full w-full object-cover object-bottom will-change-transform transform-gpu md:hidden"
            fill
            priority
            sizes="(min-width: 768px) 1px, 100vw"
          />
          <Image
            src="/homepage-banner.png"
            alt="Premium Dental Care - Crystalline Tooth"
            className="hero-bg-image hidden h-full w-full object-cover will-change-transform transform-gpu md:block"
            fill
            priority
            sizes="(max-width: 767px) 1px, 100vw"
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
                  Aesthedent - Reclaim Your Smile
                </p>
                <div className="hero-divider mb-8 h-px w-24 origin-left scale-x-0 bg-gradient-to-r from-[hsl(var(--color-accent))] to-transparent opacity-0 transform-gpu" />
              </div>

              <h1
                aria-label={HERO_HEADING}
                className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[hsl(var(--color-primary))] leading-[0.95] tracking-tighter mb-6 sm:mb-8"
              >
                <span className="hero-line hero-line-1 relative block overflow-hidden pb-2 leading-tight">
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary))] via-[hsl(var(--color-accent))] to-[hsl(var(--color-primary))] bg-[length:200%_auto] animate-shimmer">
                    The dentist
                  </span>{" "}
                  <HeroWord>that takes</HeroWord>
                </span>
                {/* Explicit space: these are block-level lines, so whitespace
                    between them is dropped from layout but keeps the heading's
                    text content readable as "…that takes the fear away." rather
                    than "…that takesthe fear away.". No visual effect. */}
                {' '}
                <span className="hero-line hero-line-2 relative block overflow-hidden pb-2 leading-tight">
                  <HeroWord className="hero-accent-word font-black text-[hsl(var(--color-accent))]">
                    the fear away.
                  </HeroWord>
                </span>
              </h1>

              {/* Sub-line carries the Tier-1 terms the H1 gave up, plus the
                  specialism as proof rather than headline. */}
              <p className="hero-copy measure mb-8 sm:mb-10 translate-y-6 text-base sm:text-lg leading-relaxed text-[hsl(var(--color-primary))]/85 opacity-0 transform-gpu md:text-lg">
                Kothrud&rsquo;s specialist prosthodontist-led clinic. We explain every step before we start &mdash; so nothing catches you by surprise.
              </p>

              <div className="hero-actions flex flex-col gap-3 sm:flex-row sm:gap-6">
                <MagneticWrapper>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-action-btn group relative inline-flex translate-y-6 scale-95 items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-[hsl(var(--color-primary))] px-8 sm:px-10 py-4 sm:py-5 font-black text-white opacity-0 transition-all duration-300 transform-gpu hover:shadow-2xl hover:shadow-[hsl(var(--color-primary))]/40 hover:-translate-y-1 text-base sm:text-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--color-accent))]" />
                    <span className="relative z-10">Chat on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  </a>
                </MagneticWrapper>

                <MagneticWrapper>
                  <a
                    href="https://www.google.com/maps/place/Aesthedent+Dental+Clinic,+Kothrud/@18.4972761,73.8108921,17z/data=!3m2!4b1!5s0x3bc2bfc407d2eb7d:0xeb43317068a295aa!4m6!3m5!1s0x3bc2bfa49403bd57:0xb59ec17e89bd289f!8m2!3d18.497271!4d73.813467!16s%2Fg%2F11j2v_ph1x?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    // The label swaps by breakpoint, so both strings sit in the
                    // DOM and the link's text reads "Visit ClinicLocation" -
                    // which is what Lighthouse's link-text audit failed on.
                    // aria-label gives it one clean, descriptive name.
                    aria-label="Visit Aesthedent Dental Clinic in Kothrud - open in Google Maps"
                    className="hero-action-btn group relative inline-flex translate-y-6 scale-95 items-center justify-center gap-2 sm:gap-4 rounded-2xl border-2 border-[hsl(var(--color-primary))]/20 bg-white/10 backdrop-blur-xl px-8 sm:px-10 py-4 sm:py-5 font-black text-[hsl(var(--color-primary))] opacity-0 transition-all duration-300 transform-gpu hover:border-[hsl(var(--color-primary))]/40 hover:bg-white/20 text-base sm:text-lg"
                  >
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--color-accent))]" />
                    <span className="hidden sm:inline">Visit Clinic</span>
                    <span className="sm:hidden">Location</span>
                  </a>
                </MagneticWrapper>
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
            <span className="text-sm tracking-widest uppercase">Scroll</span>
            <motion.div
              className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
              animate={reduceMotion ? { scaleY: 1 } : { scaleY: [1, 0.5, 1] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity }}
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
            {!reduceMotion && (
              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-2xl"
                animate={{ x: ["0%", "230%"] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Five stats into a 2-column phone grid leaves one over. Rather
                than let it sit half-width against an empty cell, the Google
                rating - the only externally checkable number here, and the one
                worth leading with - spans both columns as a wide first card.
                The remaining four then tile 2x2 evenly. From md all five sit
                across in one row. Never 4 columns: that orphans a card. */}
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5 md:gap-5">
              {trustStats.map((stat, i) => (
                <TrustStatCard
                  key={`${stat.label}-${stat.sub}`}
                  stat={stat}
                  index={i}
                  className={i === 0 ? 'col-span-2 md:col-span-1' : undefined}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand statement. Deliberately a single line with nothing under it -
          the paragraph that used to sit here now opens the Doctors section,
          where its three internal links (/insights/dental-anxiety-tips,
          /about, /dental-clinic-in-kothrud) still carry the content spine's
          §6.1 weight. The four promise cards moved there too.

          The generous vertical padding IS the design here. This line is the
          clinic's promise in the language many of its patients think in;
          crowding it with body copy is what made it read as a subheading. */}
      <section className="relative z-20 bg-gradient-to-b from-[hsl(var(--background))] to-white section-y-airy">
        <div className="main-container">
          <AnimatedSection>
            <h2 className="mx-auto max-w-4xl text-center font-bold leading-[1.35] text-[hsl(var(--color-primary))] text-[clamp(1.75rem,1.2rem+2.6vw,3.75rem)]">
              दातों के साथ भी, दातों के बाद भी
            </h2>
          </AnimatedSection>
        </div>
      </section>


      {/* Services Section -WHITE ground, gold heading.
          This section used to be solid blue. Everything that sat directly on
          that blue had to move onto text tokens; the CARD copy did not, because
          it sits on the dark image overlay, not on the section background. */}
      <section className="section-y bg-white">
        <div className="main-container">
          <AnimatedSection className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-[hsl(var(--color-accent))]/15 text-[hsl(var(--color-accent-ink))] rounded-full text-sm font-semibold">
              Specialized Care
            </div>
            {/* H2 carries "dental treatments in Kothrud" - one of the Tier-1
                terms the hero H1 gave up.

                --color-accent-ink, NOT --color-accent: the brand gold is
                1.96:1 on white and fails AA at any size. See globals.css. */}
            <h2 className="heading-section font-bold text-[hsl(var(--color-accent-ink))] leading-tight mb-3 sm:mb-6">
              Dental treatments in Kothrud, Pune.
            </h2>
            <p className="measure mx-auto text-base text-[hsl(var(--color-text-muted))] md:text-lg">
              Everything below is planned by a specialist prosthodontist and explained to you in plain words first. Nothing starts until you have said yes.
            </p>
          </AnimatedSection>

          {/* Phase 4B: was services.slice(0, 6) - which silently dropped the
              7th and 8th entries, dentures and digital-smile-design. Dentures is
              one of only THREE pages Google has indexed on this site
              (audit/02-serp-positions.md), and the homepage was not linking to
              it at all. All 8 now render. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7 lg:gap-9">
            {services.map((service, i) => (
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
                      <p className="text-white/85 text-sm mb-4 line-clamp-2">
                        {service.shortDesc}
                      </p>
                      {/* Descriptive anchor, not "Explore details" - the anchor
                          text is the only signal telling Google what the target
                          page is about, and it was being spent on two words that
                          describe nothing.
                          The service name alone is deliberate: appending "in
                          Kothrud" to all eight cards pushed the homepage to 24
                          mentions (1.57%) and read like a machine wrote it. The
                          section H2 above carries the location once. */}
                      <span className="inline-flex items-center gap-1 sm:gap-2 text-[hsl(var(--color-accent))] text-sm font-medium">
                        {service.title}
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {/* In-body contextual links. The cards above are chrome - Google
              weights prose anchors far more heavily, and this is the highest-
              signal internal linking we control from an already-indexed page
              into pages that have never been crawled
              (audit/01-content-spine.md §6.1). Area names are in real sentences,
              two per sentence, never a list. */}
          <AnimatedSection className="measure mx-auto mt-10 text-center sm:mt-12">
            <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))]">
              Patients travel to us from Bavdhan,Kothrud, Warje and all over the Pune for{' '}
              <Link href="/services/dental-implants" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                dental implants in Kothrud
              </Link>{' '}
              and for{' '}
              <Link href="/services/full-mouth-rehabilitation" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                full mouth rehabilitation
              </Link>
              , because both are planned by a specialist prosthodontist rather
              than referred out. Closer to home, most of our{' '}
              <Link href="/services/root-canal" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                root canal treatment in Kothrud
              </Link>{' '}
              and{' '}
              <Link href="/services/orthodontic-treatment" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                braces and aligners
              </Link>{' '}
              patients come from Karve Nagar and the Paud Road side &mdash; with
              braces meaning a check-up roughly every month for a year and a
              half, ten minutes matters more than people expect. We also fit{' '}
              <Link href="/services/dentures" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                dentures in Kothrud
              </Link>{' '}
              and plan{' '}
              <Link href="/services/digital-smile-design" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                Digital Smile Design in Pune
              </Link>
              .
            </p>
          </AnimatedSection>

          <AnimatedSection className="text-center mt-10 sm:mt-12 md:mt-14 lg:mt-16">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-white/90 text-[hsl(var(--primary))] font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base md:text-lg"
            >
              Explore all dental treatments in Kothrud
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Intake form. Sits directly after the treatments a visitor was just
          reading, which is the moment intent is highest -sending them to
          /contact from here would have spent that moment on a page load.
          The component is shared with /contact; it owns all its own state and
          copy (lib/intake-form-config.ts). */}
      <section className="bg-[hsl(var(--color-bg-alt))]/40 section-y">
        <div className="main-container">
          <AnimatedSection className="measure mx-auto mb-10 text-center sm:mb-14">
            <h2 className="mb-4 heading-section font-bold text-[hsl(var(--color-text))]">
              Let&apos;s get you seen, comfortably.
            </h2>
            <p className="text-base text-[hsl(var(--color-text-muted))] md:text-lg">
              Tell us a little about what&apos;s going on. No forms with fifty
              fields -just a short conversation, and we&apos;ll take it from there.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mx-auto max-w-2xl rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 shadow-sm sm:p-8">
            <IntakeWizard />
          </AnimatedSection>
        </div>
      </section>

      {/* Treatment Experience Section */}
      <section className="section-y bg-gradient-to-br from-[hsl(var(--primary))]/5 via-white to-[hsl(var(--accent))]/5">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left">
              <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Your Visit
              </div>
              <h2 className="heading-section font-bold text-[hsl(var(--color-text))] leading-tight mb-4 sm:mb-6">
                What happens when you visit.
              </h2>
              {/* The lead quote states the positioning in the founder's voice:
                  specialist planning AND the patience to explain it. */}
              <blockquote className="mb-8 border-l-4 border-[hsl(var(--color-accent))] pl-5 text-base italic leading-relaxed text-[hsl(var(--color-text-muted))] sm:pl-6 sm:text-lg">
                “We don&apos;t just treat teeth -we plan every case with the
                precision of a specialist and the patience of someone who
                remembers you&apos;re a person, not a procedure.”
              </blockquote>

              {/* A real <ol>. These are six sequential stages of one visit, and
                  the order is the meaning -a div stack said nothing about
                  sequence to a screen reader. Numbers are rendered by the list
                  itself rather than drawn as chevrons. */}
              <ol className="mb-8 space-y-4 sm:mb-10 sm:space-y-5">
                {[
                  ["Checkup", "Intraoral imaging -you see exactly what we see, live on screen."],
                  ["Diagnosis", "We explain the problem in plain language, not jargon."],
                  ["Planning", "What's urgent, what can wait, and every option -laid out clearly."],
                  ["Your call", "Full cost and plan agreed before we start. Nothing is a surprise."],
                  ["Treatment", "Fully numb, fully narrated -and it stops the moment you raise your hand."],
                  ["Follow-up", "We check on your healing after you leave the chair."],
                ].map(([stage, detail], i) => (
                  <li key={stage} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-primary))] text-sm font-bold text-white"
                    >
                      {i + 1}
                    </span>
                    <p className="text-base leading-relaxed text-[hsl(var(--color-text))] md:text-lg">
                      <strong className="font-semibold">{stage}:</strong> {detail}
                    </p>
                  </li>
                ))}
              </ol>

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

      {/* Painless Dentistry Section */}
      {/* Doctors Section */}
      <section className="section-y bg-gradient-to-b from-white to-[hsl(var(--bg-alt))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-semibold">
              Our Team
            </div>
            {/* "Top Dentists in Kothrud" was an opinion we awarded ourselves.
                Never reinstate it. */}
            <h2 className="heading-section font-bold text-[hsl(var(--color-text))] leading-tight mb-3 sm:mb-6">
              Meet your dentists in Kothrud
            </h2>
            {/* "specialist-level" was removed from this sentence deliberately.
                It described the practice, not Dr. Aishwarya, but it put the word
                within a few characters of her name - and she is BDS, not a
                specialist. Precision and patience say the same thing about the
                pair without borrowing a qualification only one of them holds. */}
            <p className="measure mx-auto text-base text-[hsl(var(--color-text-muted))] md:text-lg">
              Dr. Sahil and Dr. Aishwarya bring precision and genuine patience to
              every case &mdash; walking you through it step by step, so nothing
              catches you by surprise.
            </p>

            {/* MOVED here from under the Marathi line, links intact. These are
                the two the content spine ranks highest (§6.1): the dental-anxiety
                article, which is the least-linked page on the site and holds our
                entire wedge, and /about. Losing them would be a real regression,
                which is why this paragraph travelled rather than being retyped. */}
            <p className="measure mx-auto mt-5 text-base leading-relaxed text-[hsl(var(--color-text-muted))]">
              Plenty of people arrive here having avoided a dentist for years,
              and nobody is going to make you feel foolish about that. If that
              is you, read{' '}
              <Link href="/insights/dental-anxiety-tips" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                what we do for patients who are frightened of the dentist
              </Link>{' '}
              before you book, or how we work with{' '}
              <Link href="/about" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                nervous patients
              </Link>
              . You set the pace; raise a hand and everything stops. If you are
              just trying to work out where we are and when we are open, our{' '}
              <Link href="/dental-clinic-in-kothrud" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent-ink))] transition-colors">
                dental clinic in Kothrud
              </Link>{' '}
              page has the practical detail.
            </p>
          </AnimatedSection>

          {/* Phase 4B: credentials replace adjectives. "Specializes in implants"
              and "Expert in painless extractions" were unsourced descriptions;
              an MDS from a named university is a fact a patient can check.
              Names, roles and credentials all come from lib/clinic.ts.
              NOTE: Dr. Aishwarya is BDS / general and family dentist - NOT a
              specialist. Nothing here may imply otherwise. */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                name: DOCTORS.sahil.name,
                tag: "Lead Dentist & Founder",
                role: "Specialist Prosthodontist, Founder & Co-Owner",
                credential: DOCTORS.sahil.credential,
                image: "/assets/doctor-male.jpeg",
                desc: "Specializes in implants and restorative dentistry with a focus on patient education and comfort.",
              },
              {
                name: DOCTORS.aishwarya.name,
                tag: "Dental Surgeon",
                // "General & Family Dentist" -the word "specialist" must never
                // appear on this card. She holds a BDS; Dr. Sahil's MDS is what
                // makes the clinic prosthodontist-led, and overclaiming her
                // qualification is a regulatory problem, not just a trust one.
                role: "General & Family Dentist, Co-Owner",
                credential: DOCTORS.aishwarya.credential,
                image: "/assets/doctor-female.jpeg",
                desc: "Advanced training in endodontics and pregnancy dentistry. Known for her calm, thorough approach.",
              },
            ].map((doctor, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                {/* Cards now link to /doctor - an unindexed page that had no
                    in-body inbound link from the homepage at all. */}
                <Link href="/doctor" aria-label={`${doctor.name} - ${doctor.credential}`}>
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

                    {/* Name - one copy. Flows below the image on mobile,
                        overlays the top of it from sm up. Previously this was
                        duplicated as hidden sm:block / sm:hidden, which put both
                        doctors' names in the DOM twice. */}
                    <div className="p-4 border-t border-[hsl(var(--color-border))] sm:border-0 sm:p-0 sm:absolute sm:left-6 sm:right-6 sm:top-6 sm:max-w-[85%]">
                      <div className="sm:rounded-xl sm:border sm:border-white/80 sm:bg-white/90 sm:px-6 sm:py-4 sm:shadow-lg sm:backdrop-blur-md">
                        {/* Per-doctor role tag. Was a hardcoded "Dentist" on
                            both cards, which flattened the one distinction that
                            matters here. */}
                        <p className="mb-1 sm:mb-2 text-[11px] sm:text-sm font-bold uppercase tracking-wider text-[hsl(var(--primary))]/70">
                          {doctor.tag}
                        </p>
                        <h3 className="text-base sm:text-xl font-bold leading-tight text-[hsl(var(--primary))]">
                          {doctor.name}
                        </h3>
                      </div>
                    </div>

                    {/* Role + description - one copy. Flows on mobile, glass
                        panel over the image from sm up. */}
                    <div className="px-4 pb-4 sm:p-5 sm:absolute sm:bottom-5 sm:left-5 sm:right-5 sm:rounded-[1.6rem] sm:border sm:border-white/65 sm:bg-[hsl(var(--background))]/84 sm:shadow-[0_24px_54px_-30px_hsl(var(--color-primary)/0.38)] sm:backdrop-blur-xl">
                      {/* tracking-[0.22em] is the reason this pill looked huge on
                          a phone: at 14px uppercase it adds ~3px between every
                          letter, and "General & Family Dentist, Co-Owner" is 34
                          of them - roughly 100px of pure letter-spacing, enough
                          to force a two-line pill on its own. Mobile drops to
                          11px with tracking dialled back; the wide, airy version
                          returns at sm: where the panel has the width for it. */}
                      <p className="mb-2 sm:mb-3 inline-flex rounded-full bg-[hsl(var(--color-primary))] px-2.5 py-1 text-[11px] font-semibold uppercase leading-snug tracking-[0.1em] text-[hsl(var(--color-accent))] sm:px-3.5 sm:py-1.5 sm:text-sm sm:tracking-[0.22em]">
                        {doctor.role}
                      </p>
                      {/* The qualification, verbatim. This is the proof the
                          word "specialist" rests on. */}
                      <p className="mb-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] sm:mb-2 sm:text-sm">
                        {doctor.credential}
                      </p>
                      <p className="text-[13px] leading-6 text-[hsl(var(--color-text-muted))] sm:text-sm sm:leading-relaxed">
                        {doctor.desc}
                      </p>
                    </div>
                  </div>
                </div>
                </Link>
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

          {/* MOVED here from the Marathi section. These four are what the
              doctors above actually promise a patient, so they belong under
              the people making the promise rather than under a brand line. */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <AdvancedPromiseCard
              num="01"
              icon={Calendar}
              title="We Are Open On Weekends Also"
              desc="We understand your busy schedule. That's why we offer weekend appointments, ensuring you can prioritize your dental health without compromising your weekday commitments."
            />
            <AdvancedPromiseCard
              num="02"
              icon={Eye}
              title="Purposeful Communication"
              desc="Clear vision leads to clear confidence. We prioritize face-to-face consultations, using advanced intraoral imaging not just to diagnose, but to educate. Our goal is for you to leave with a complete understanding of your oral health, not just a prescription."
            />
            <AdvancedPromiseCard
              num="03"
              icon={Info}
              title="Sensory Transparency"
              desc="The fear of dentistry is often a fear of the unexpected. We bridge that gap by narrating each step of your treatment in real-time-preparing you for every vibration, sound, or sensation. When you know exactly what’s coming, the anxiety fades."
            />
            <AdvancedPromiseCard
              num="04"
              icon={Hand}
              isLast={true}
              title="Your Safety, Your Signal"
              desc="Ethical care means you are always the primary decision-maker. We implement a specific 'rest signal' before any treatment begins. If you raise your hand, our tools are down instantly. You have our word that we pause as often and for as long as you need."
            />
          </div>
        </div>
      </section>

      {/* Smile Stories Section - Dynamic.
          NO section-y here. TestimonialsSection renders its own padded
          <section>, so a padded wrapper stacked two full paddings on top of
          each other and opened a 443px hole above the reviews on desktop.

          Moved below the Doctors section so the page runs team -> reviews.
          Stays bg-white: the Doctors and Insights gradients around it name
          --bg-alt, which is not a defined token (globals.css only declares
          --color-bg-alt), so those gradients are invalid and both sections
          paint transparent over the white page ground. White here matches what
          they actually render, and keeps matching if that token is ever fixed
          to its 216 50% 98% value, which is white to within a hair. */}
      <section className="bg-white">
        <TestimonialsSection
          title="Real Stories From Real Patients"
          subtitle="These transformations inspire us every day-and we love sharing them."
          limit={6}
          variant="compact"
        />

        <div className="main-container mt-12">
          <AnimatedSection className="text-center">
            <a
              href="https://www.google.com/maps/place/Aesthedent+Dental+Clinic,+Kothrud/@18.4972761,73.8108921,17z/data=!3m1!5s0x3bc2bfc407d2eb7d:0xeb43317068a295aa!4m8!3m7!1s0x3bc2bfa49403bd57:0xb59ec17e89bd289f!8m2!3d18.497271!4d73.813467!9m1!1b1!16s%2Fg%2F11j2v_ph1x?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read all Aesthedent patient reviews on Google"
              className="inline-flex min-h-[44px] items-center gap-3 py-2 text-lg font-semibold text-[hsl(var(--primary))] transition-colors hover:text-[hsl(var(--primary-dark))]"
            >
              View all patient stories
              <ArrowRight className="w-5 h-5" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Insights Section - Premium Editorial */}
      <InsightsSection
        title="Insights"
        subtitle="Trusted knowledge from real experts-not generic content. Real answers to real patient questions."
      />

      {/* Contact Section */}
      <section className="section-y bg-[hsl(var(--primary))]">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <AnimatedSection>
              <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold">
                Get in Touch
              </div>
              <h2 className="heading-section font-bold text-white leading-tight mb-4 sm:mb-6 md:mb-8">
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
                  aria-label="Get directions to Aesthedent Dental Clinic, Dahanukar Colony, Kothrud - open in Google Maps"
                  className="flex items-start gap-3 sm:gap-5 hover:opacity-80 transition-opacity cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1 sm:mb-2 text-base sm:text-lg group-hover:text-[hsl(var(--accent))] transition-colors">
                      Our Clinic
                    </p>
                    <p className="text-white/80 leading-relaxed text-sm md:text-base group-hover:text-white transition-colors">
                      No.5 First Floor, AJ Tower, above Irani Cafe,
                      <br />
                      Dahanukar Colony, Kothrud, Pune 411038
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
                    <p className="text-white/80 leading-relaxed text-sm md:text-base">
                      Mon - Sun: 10 AM - 8 PM
                      <br />
                      <span className="text-sm font-bold text-[hsl(var(--accent))]">
                        (Wednesday Holiday)
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

              {/* Two ways to act, and the difference matters: the inline pair
                  below lets someone finish the job from this page, while the
                  link hands off to /contact for anyone who wants the longer
                  form. Making the handoff the ONLY option was asking a patient
                  in pain to load another page before they could reach anyone. */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    id="home-final-whatsapp"
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-6 py-3 text-base font-semibold text-[hsl(var(--accent-foreground))] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[hsl(var(--accent))]/90 hover:shadow-xl sm:px-8 sm:py-4"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Message on WhatsApp
                  </a>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg border-2 border-white/50 bg-white/10 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:border-white/70 hover:bg-white/20 sm:px-8 sm:py-4"
                  >
                    <Phone className="h-5 w-5" />
                    +91 93098 16336
                  </a>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium text-white/90 underline underline-offset-4 transition-colors hover:text-white"
                >
                  <span>Go to contact page</span>
                  <ArrowRight className="h-4 w-4" />
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
