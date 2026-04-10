'use client';

import { motion } from 'framer-motion';
import { useRef, useSearchParams } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { landingPageContent } from '@/lib/landing-page-content';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
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
} from 'lucide-react';

const whatsappNumber = '919309816336';
const phoneNumber = '+919309816336';

// Utility function to get UTM parameters from URL
function getUTMParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
  };
}

// Create booking links with UTM parameters preserved
function createBookingLink(type = 'whatsapp') {
  const utmParams = getUTMParams();
  const utmString = Object.entries(utmParams)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const message = encodeURIComponent(
    'Hi, I am interested in your prosthetic and implant services. Can you please provide more information and book a consultation?'
  );

  if (type === 'whatsapp') {
    const link = `https://wa.me/${whatsappNumber}?text=${message}`;
    return utmString ? `${link}&${utmString}` : link;
  } else if (type === 'phone') {
    return `tel:${phoneNumber}`;
  }

  return '#';
}

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] md:min-h-[800px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))]/90 via-[hsl(var(--primary))]/40 to-transparent z-10" />
          <img
            src={landingPageContent.hero.backgroundImage}
            alt="Premium Dental Care"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          className="relative z-20 h-full flex items-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="main-container">
            <div className="max-w-3xl">
              <motion.p
                className="text-[hsl(var(--accent))] text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Prosthetic Excellence
              </motion.p>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[hsl(var(--primary-foreground))] leading-[1.1] mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {landingPageContent.hero.headline}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-[hsl(var(--primary-foreground)/0.7)] max-w-xl mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {landingPageContent.hero.description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 md:gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <a
                  href={createBookingLink('whatsapp')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--accent-foreground))] px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp Consultation</span>
                </a>
                <a
                  href={createBookingLink('phone')}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[hsl(var(--primary-foreground))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-foreground))/10] px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1"
                >
                  <Phone size={20} />
                  <span>Call Now</span>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <ChevronDown className="text-white" size={32} />
        </motion.div>
      </section>

      {/* Problem Awareness Section - Emotional Connection */}
      <section className="py-20 md:py-32 bg-white border-b-4 border-[hsl(var(--accent))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
              Your Pain Points
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[hsl(var(--color-text))] mb-6 leading-tight">
              {landingPageContent.problemStatement.title}
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {landingPageContent.problemStatement.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-14">
            {landingPageContent.problemStatement.problems.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card-elevated bg-gradient-to-br from-red-50 via-orange-50 to-red-50 p-8 md:p-10 border-l-4 border-red-500 hover:-translate-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-red-600 mb-4">{item.challenge}</h3>
                  <p className="text-[hsl(var(--color-text-muted))] leading-relaxed text-base">{item.impact}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-8 md:p-12 rounded-2xl border-2 border-green-200">
            <p className="text-lg md:text-2xl font-semibold text-green-700 flex items-center justify-center gap-3">
              <Check className="text-green-600" size={28} />
              <span>{landingPageContent.problemStatement.solution}</span>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Consequences Section - What if untreated */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[hsl(var(--bg-alt))] to-white border-b-4 border-orange-300">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
              Consequences of Delay
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[hsl(var(--color-text))] mb-6 leading-tight">
              {landingPageContent.consequences.title}
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {landingPageContent.consequences.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {landingPageContent.consequences.items.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card-elevated bg-white p-8 md:p-10 border-l-4 border-orange-500 hover:-translate-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-orange-600 mb-4">{item.title}</h3>
                  <p className="text-[hsl(var(--color-text-muted))] leading-relaxed text-base">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[hsl(var(--primary))]/8 via-white to-[hsl(var(--accent))]/8 border-b-4 border-[hsl(var(--primary))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-semibold">
              Proven Track Record
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--color-text))]">
              Why Trust Aesthedent?
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {landingPageContent.trustStats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card-elevated text-center p-10 md:p-12 bg-white hover:-translate-y-2">
                  <div className="text-5xl md:text-6xl font-bold text-[hsl(var(--primary))] mb-4">
                    {stat.label}
                  </div>
                  <p className="text-[hsl(var(--color-text-muted))] text-base md:text-lg font-semibold">
                    {stat.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-20 md:py-32 bg-white border-b-4 border-[hsl(var(--accent))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-semibold">
              Our Excellence
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[hsl(var(--color-text))] mb-6 leading-tight">
              Why Aesthedent for Prosthetic Solutions?
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Experience world-class prosthetic dentistry with our expert team
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {landingPageContent.usp.map((item, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                className="card-elevated bg-gradient-to-br from-[hsl(var(--primary))]/8 to-[hsl(var(--accent))]/5 p-8 md:p-10 border-t-4 border-[hsl(var(--accent))] hover:-translate-y-2"
              >
                <div className="text-[hsl(var(--primary))] mb-4 bg-white p-3 rounded-lg w-fit">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--color-text))] mb-3">
                  {item.title}
                </h3>
                <p className="text-[hsl(var(--color-text-muted))] leading-relaxed text-base">{item.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[hsl(var(--bg-alt))] to-white border-b-4 border-[hsl(var(--primary))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-semibold">
              Comprehensive Solutions
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[hsl(var(--color-text))] mb-6 leading-tight">
              Our Prosthetic Services
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Comprehensive solutions for all your prosthetic and implant needs
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
            {landingPageContent.services.map((service, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.05}
                className="card-elevated bg-white p-8 md:p-10 hover:-translate-y-2"
              >
                <div className="text-[hsl(var(--primary))] mb-5 bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 w-fit p-4 rounded-lg">
                  <Smile size={32} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--color-text))] mb-3">
                  {service.title}
                </h3>
                <p className="text-[hsl(var(--color-text-muted))] leading-relaxed text-base">{service.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-white border-b-4 border-[hsl(var(--accent))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] rounded-full text-sm font-semibold">
              Affordable Excellence
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[hsl(var(--color-text))] mb-6 leading-tight">
              Transparent Pricing
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Choose the plan that best fits your needs. All prices include consultation and follow-up care.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {landingPageContent.pricing.map((plan, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                className={`relative rounded-2xl overflow-hidden transition-all hover:-translate-y-2 ${
                  plan.popular
                    ? 'md:scale-105 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] text-[hsl(var(--primary-foreground))] shadow-2xl border-2 border-[hsl(var(--accent))]'
                    : 'bg-white border-2 border-[hsl(var(--border))] shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-5 right-5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-2 ${!plan.popular && 'text-[hsl(var(--color-text))]'}`}>
                    {plan.tier}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-[hsl(var(--primary-foreground)/0.8)]' : 'text-[hsl(var(--color-text-muted))]'}`}>
                    {plan.description}
                  </p>

                  <p className="text-4xl font-bold mb-2">
                    {plan.price}
                  </p>
                  <p className={`text-sm mb-8 ${plan.popular ? 'text-[hsl(var(--primary-foreground)/0.8)]' : 'text-[hsl(var(--color-text-muted))]'}`}>
                    {plan.details}
                  </p>

                  {/* Timeline */}
                  <div className={`mb-8 pb-8 border-b ${plan.popular ? 'border-[hsl(var(--primary-foreground))]/30' : 'border-[hsl(var(--border))]'}`}>
                    <p className={`text-sm font-semibold mb-4 ${plan.popular ? 'text-[hsl(var(--primary-foreground)/0.8)]' : 'text-[hsl(var(--color-text))]'}`}>
                      <Clock size={16} className="inline mr-2" />
                      Timeline: {plan.timeline}
                    </p>
                    <div className="space-y-2 text-sm">
                      {plan.timelineBreakdown.map((phase, idx) => (
                        <p key={idx} className={plan.popular ? 'text-[hsl(var(--primary-foreground)/0.7)]' : 'text-[hsl(var(--color-text-muted))]'}>
                          • {phase.phase}: <strong>{phase.duration}</strong>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check size={20} className={plan.popular ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--color-primary))]'} />
                        <span className={`text-sm ${plan.popular ? 'text-[hsl(var(--primary-foreground)/0.9)]' : 'text-[hsl(var(--color-text))]'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={createBookingLink('whatsapp')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-[hsl(var(--background))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
                        : 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:opacity-90'
                    }`}
                  >
                    <MessageCircle size={18} />
                    {plan.cta}
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 md:py-24 bg-[hsl(var(--color-bg-alt))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--color-text))] mb-6">
              Your Implant Journey
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg max-w-2xl mx-auto">
              A step-by-step breakdown of the implant process with timelines
            </p>
          </AnimatedSection>

          <div className="space-y-8">
            {landingPageContent.processSteps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="flex gap-8">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold text-xl">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-grow bg-[hsl(var(--background))] p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-[hsl(var(--color-text))] mb-2">
                          {step.title}
                        </h3>
                        <p className="text-[hsl(var(--color-text-muted))] mb-2">{step.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[hsl(var(--color-primary))] font-semibold">
                          <Clock size={16} className="inline mr-1" />
                          {step.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[hsl(var(--primary))]/5 via-white to-[hsl(var(--accent))]/5 border-b-4 border-[hsl(var(--primary))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] rounded-full text-sm font-semibold">
              Life-Changing Results
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[hsl(var(--color-text))] mb-6 leading-tight">
              {landingPageContent.benefits.title}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
            {landingPageContent.benefits.items.map((benefit, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="card-elevated bg-white p-8 md:p-10 h-full border-t-4 border-[hsl(var(--accent))] hover:-translate-y-2">
                  <div className="text-[hsl(var(--primary))] mb-5 bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 p-4 rounded-lg w-fit">
                    <Award size={32} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--color-text))] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-[hsl(var(--color-text-muted))] leading-relaxed text-base">{benefit.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 md:py-32 bg-white border-b-4 border-green-500">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
              Patient Transformations
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[hsl(var(--color-text))] mb-6 leading-tight">
              {landingPageContent.results.title}
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {landingPageContent.results.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
            {landingPageContent.results.outcomes.map((outcome, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="card-elevated bg-gradient-to-br from-white to-green-50 p-8 md:p-10 border-t-4 border-green-500 hover:-translate-y-2">
                  <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-xs font-bold mb-4">
                    {outcome.category}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--color-text))] mb-3">
                    {outcome.title}
                  </h3>
                  <p className="text-[hsl(var(--color-text-muted))] leading-relaxed text-base">
                    {outcome.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 md:py-28 bg-gradient-to-br from-white via-[hsl(var(--bg-alt))]/50 to-white">
        <div className="main-container">
          <AnimatedSection className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[hsl(var(--color-text))] mb-4 leading-tight">
              {landingPageContent.results.title}
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-2xl mx-auto">
              {landingPageContent.results.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {landingPageContent.results.outcomes.map((outcome, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="card-elevated bg-white p-7 md:p-8 border-t-4 border-[hsl(var(--primary))]">
                  <div className="inline-block bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    {outcome.category}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--color-text))] mb-3">
                    {outcome.title}
                  </h3>
                  <p className="text-[hsl(var(--color-text-muted))] leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - #SmileStories - Dynamic */}
      <TestimonialsSection 
        title="#SmileStories"
        subtitle="Stories that drive us. Stories that give purpose. Stories that bring smiles."
        limit={3}
        variant="compact"
      />

      {/* FAQs */}
      <section className="py-16 md:py-24">
        <div className="main-container max-w-3xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--color-text))] mb-6">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {landingPageContent.faqs.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 md:py-24 bg-[hsl(var(--color-bg-alt))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--color-text))] mb-8">
              Trusted & Certified
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {landingPageContent.badges.map((badge, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                className="bg-[hsl(var(--background))] p-6 rounded-lg shadow-md text-center border-l-4 border-[hsl(var(--color-primary))]"
              >
                <p className="font-semibold text-[hsl(var(--color-text))] text-sm">{badge}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white via-[hsl(var(--bg-alt))] to-white border-b-4 border-[hsl(var(--primary))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-4 px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-semibold">
              Visit Us Today
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[hsl(var(--color-text))] mb-6 leading-tight">
              {landingPageContent.contactSection.title}
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {landingPageContent.contactSection.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
            {/* Contact Info */}
            <AnimatedSection className="space-y-7 md:space-y-9">
              <div className="card-elevated bg-white p-10 md:p-12 border-t-4 border-[hsl(var(--primary))] hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-[hsl(var(--color-text))] mb-8">Our Location</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-[hsl(var(--primary))] mb-2 uppercase tracking-wider">Full Address</p>
                    <p className="text-lg md:text-xl font-semibold text-[hsl(var(--color-text))] leading-relaxed">
                      {landingPageContent.contactSection.fullAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[hsl(var(--primary))] mb-2 uppercase tracking-wider">Service Areas</p>
                    <p className="text-base md:text-lg text-[hsl(var(--color-text-muted))] leading-relaxed">
                      {landingPageContent.contactSection.serviceArea}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-elevated bg-gradient-to-br from-[hsl(var(--accent))]/10 to-orange-50 p-10 md:p-12 border-t-4 border-[hsl(var(--accent))] hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-[hsl(var(--color-text))] mb-8">Services We Provide in Pune</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {landingPageContent.contactSection.services.map((service, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check size={24} className="text-green-600 flex-shrink-0 mt-0.5 font-bold" />
                      <span className="text-base md:text-lg text-[hsl(var(--color-text-muted))] font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex-1 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-dark))] text-white px-6 md:px-8 py-4 md:py-5 rounded-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-base md:text-lg"
                >
                  <Phone size={24} />
                  Call Us
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi, I am interested in your prosthetic and implant services. Can you please provide more information?')}`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-4 md:py-5 rounded-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-base md:text-lg"
                >
                  <MessageCircle size={24} />
                  WhatsApp
                </a>
              </div>
            </AnimatedSection>

            {/* Map Placeholder */}
            <AnimatedSection delay={0.1}>
              <div className="card-elevated bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 rounded-xl overflow-hidden shadow-xl h-96 md:h-full min-h-96 flex items-center justify-center">
                <a
                  href={landingPageContent.contactSection.directionsURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-6 text-center p-8 hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-[hsl(var(--primary))] text-white p-5 rounded-full shadow-lg">
                    <ArrowRight size={36} />
                  </div>
                  <div>
                    <p className="font-bold text-[hsl(var(--color-text))] text-lg md:text-xl mb-2">Get Directions</p>
                    <p className="text-[hsl(var(--color-text-muted))] text-sm md:text-base">Click to open in Google Maps</p>
                  </div>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-40 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary-dark))] to-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] relative overflow-hidden border-t-8 border-[hsl(var(--accent))]">
        {/* Background decoration with enhanced visual effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[hsl(var(--accent))] blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[hsl(var(--accent))] blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-white blur-3xl" style={{ animationDelay: '2s' }} />
        </div>

        <div className="main-container relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              {landingPageContent.finalCTA.headline}
            </h2>
            <p className="text-lg md:text-2xl text-[hsl(var(--primary-foreground)/0.90)] mb-14 md:mb-16 leading-relaxed font-medium">
              {landingPageContent.finalCTA.description}
            </p>
            <a
              href={createBookingLink('whatsapp')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-10 md:px-14 py-5 md:py-6 rounded-xl font-bold text-lg md:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
            >
              <MessageCircle size={28} />
              <span>{landingPageContent.finalCTA.buttonText}</span>
            </a>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="card-elevated border border-[hsl(var(--border))] rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-7 bg-white hover:bg-[hsl(var(--bg-alt))] transition-colors duration-200"
      >
        <h3 className="text-base md:text-lg font-bold text-[hsl(var(--color-text))] text-left">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className="text-[hsl(var(--primary))]" size={24} />
        </motion.div>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 md:px-7 py-6 bg-gradient-to-br from-[hsl(var(--primary))]/5 to-transparent border-t border-[hsl(var(--border))]">
          <p className="text-[hsl(var(--color-text-muted))] leading-relaxed text-base">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}

// Add React import for useState
import React from 'react';
