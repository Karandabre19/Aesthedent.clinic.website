'use client';

import { motion } from 'framer-motion';
import { useRef, useSearchParams } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { landingPageContent } from '@/lib/landing-page-content';
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
  Quote,
} from 'lucide-react';

const whatsappNumber = '919876543210';
const phoneNumber = '+919876543210';

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
      <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent z-10" />
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
                className="text-teal-400 text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Prosthetic Excellence
              </motion.p>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {landingPageContent.hero.headline}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {landingPageContent.hero.description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <a
                  href={createBookingLink('whatsapp')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold transition-all"
                >
                  <MessageCircle size={20} />
                  WhatsApp Consultation
                </a>
                <a
                  href={createBookingLink('phone')}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all"
                >
                  <Phone size={20} />
                  Call Now
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="text-white" size={32} />
        </motion.div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="main-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {landingPageContent.trustStats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                    {stat.label}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    {stat.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 md:py-24">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Aesthedent for Prosthetic Solutions?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience world-class prosthetic dentistry with our expert team
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landingPageContent.usp.map((item, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-xl border border-teal-100"
              >
                <div className="text-teal-600 mb-4">
                  <Award size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Prosthetic Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive solutions for all your prosthetic and implant needs
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {landingPageContent.services.map((service, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.05}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-teal-600 mb-4">
                  <Smile size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Transparent Pricing
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the plan that best fits your needs. All prices include consultation and follow-up care.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landingPageContent.pricing.map((plan, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                className={`relative rounded-2xl overflow-hidden transition-all ${
                  plan.popular
                    ? 'md:scale-105 bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-2xl'
                    : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-2 ${!plan.popular && 'text-gray-900'}`}>
                    {plan.tier}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-teal-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>

                  <p className="text-4xl font-bold mb-2">
                    {plan.price}
                  </p>
                  <p className={`text-sm mb-8 ${plan.popular ? 'text-teal-100' : 'text-gray-600'}`}>
                    {plan.details}
                  </p>

                  {/* Timeline */}
                  <div className={`mb-8 pb-8 border-b ${plan.popular ? 'border-teal-500' : 'border-gray-200'}`}>
                    <p className={`text-sm font-semibold mb-4 ${plan.popular ? 'text-teal-100' : 'text-gray-700'}`}>
                      <Clock size={16} className="inline mr-2" />
                      Timeline: {plan.timeline}
                    </p>
                    <div className="space-y-2 text-sm">
                      {plan.timelineBreakdown.map((phase, idx) => (
                        <p key={idx} className={plan.popular ? 'text-teal-100' : 'text-gray-600'}>
                          • {phase.phase}: <strong>{phase.duration}</strong>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check size={20} className={plan.popular ? 'text-yellow-300' : 'text-teal-600'} />
                        <span className={`text-sm ${plan.popular ? 'text-teal-50' : 'text-gray-700'}`}>
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
                        ? 'bg-white text-teal-600 hover:bg-yellow-400'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
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
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Implant Journey
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A step-by-step breakdown of the implant process with timelines
            </p>
          </AnimatedSection>

          <div className="space-y-8">
            {landingPageContent.processSteps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="flex gap-8">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-600 text-white font-bold text-xl">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-grow bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-teal-600 font-semibold">
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
      <section className="py-16 md:py-24">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {landingPageContent.benefits.title}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {landingPageContent.benefits.items.map((benefit, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-xl border border-teal-100 h-full">
                  <div className="text-teal-600 mb-4">
                    <Award size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - #SmileStories */}
      <section className="py-16 md:py-24 bg-white">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-teal-600 mb-4">
              {landingPageContent.testimonials.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {landingPageContent.testimonials.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landingPageContent.testimonials.reviews.map((testimonial, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
              >
                {/* Patient Photo - Compact */}
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Review Content */}
                <div className="p-6">
                  {/* Quotation Mark - Smaller */}
                  <div className="text-teal-300 mb-3">
                    <svg
                      className="w-6 h-6 opacity-60"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5m14 0c-3 0-7 1-7 8v8c0 1.25 4.716 5 7 5" />
                    </svg>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                    {testimonial.text}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    {/* Patient Info & Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs text-teal-600 font-medium">
                          {testimonial.service}
                        </p>
                      </div>
                      {/* Rating Stars */}
                      <div className="flex gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="flex items-center text-teal-600 text-xs font-medium hover:text-teal-700 cursor-pointer">
                    <span>Read More</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24">
        <div className="main-container max-w-3xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
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
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="main-container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Trusted & Certified
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {landingPageContent.badges.map((badge, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-teal-600"
              >
                <p className="font-semibold text-gray-900 text-sm">{badge}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="main-container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {landingPageContent.finalCTA.headline}
            </h2>
            <p className="text-lg text-teal-100 mb-10">
              {landingPageContent.finalCTA.description}
            </p>
            <a
              href={createBookingLink('whatsapp')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              <MessageCircle size={20} />
              {landingPageContent.finalCTA.buttonText}
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
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900 text-left">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className="text-teal-600" size={24} />
        </motion.div>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}

// Add React import for useState
import React from 'react';
