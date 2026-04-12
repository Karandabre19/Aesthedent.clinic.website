'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { services } from '@/lib/services';
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle,
  Sparkles,
  Shield,
  Leaf,
  Baby,
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

const iconMap = {
  Sparkles, Shield, Leaf, Baby, Stethoscope
};

const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';

export default function ServicesPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[hsl(var(--color-primary-light))] to-[hsl(var(--background))]">
        <div className="main-container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-[52px] font-semibold text-[hsl(var(--color-text))] mb-6 leading-tight">
              Our Dental Services
            </h1>
            <p className="text-lg lg:text-xl text-[hsl(var(--color-text-muted))] leading-relaxed">
              Comprehensive dental care with a focus on your comfort. Every treatment is performed with precision, care, and a gentle touch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Accordion */}
      <section className="section-spacing">
        <div className="main-container">
          <div className="max-w-4xl mx-auto space-y-4">
            {services.map((service, i) => {
              const IconComponent = iconMap[service.icon] || Sparkles;
              const [isExpanded, setIsExpanded] = useState(false);

              return (
                <AnimatedSection key={service.slug} delay={i * 0.05}>
                  <div 
                    className={`group border rounded-3xl transition-all duration-300 overflow-hidden ${
                      isExpanded 
                        ? 'border-[hsl(var(--color-primary))] bg-white shadow-xl' 
                        : 'border-[hsl(var(--color-border))] bg-white/50 hover:bg-white hover:border-[hsl(var(--color-primary))]/30'
                    }`}
                  >
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="w-full flex items-center justify-between p-6 lg:p-8 text-left"
                    >
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center transition-colors ${
                          isExpanded ? 'bg-[hsl(var(--color-primary))] text-white' : 'bg-[hsl(var(--color-primary-light))] text-[hsl(var(--color-primary))]'
                        }`}>
                          <IconComponent className="w-6 h-6 lg:w-7 lg:h-7" />
                        </div>
                        <div>
                          <h3 className={`text-xl lg:text-2xl font-semibold transition-colors ${
                            isExpanded ? 'text-[hsl(var(--color-primary))]' : 'text-[hsl(var(--color-text))]'
                          }`}>
                            {service.title}
                          </h3>
                          {!isExpanded && (
                            <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1 line-clamp-1">
                              {service.shortDesc}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isExpanded ? 'bg-[hsl(var(--color-primary))] text-white rotate-180' : 'bg-[hsl(var(--color-bg-alt))] text-[hsl(var(--color-text-muted))]'
                      }`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-6 lg:px-8 pb-8 pt-2">
                            <div className="h-px bg-[hsl(var(--color-border))] mb-8" />
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                              <div>
                                <h4 className="text-[hsl(var(--color-primary))] font-semibold uppercase tracking-wider text-xs mb-3">
                                  Why this treatment?
                                </h4>
                                <p className="text-[hsl(var(--color-text))] text-lg mb-6 leading-relaxed">
                                  {service.problem}
                                </p>
                                <p className="text-[hsl(var(--color-text-muted))] mb-8">
                                  {service.solution}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                  <Button className="bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] px-6" asChild>
                                    <Link href={`/services/${service.slug}`}>
                                      Learn More Details <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                  </Button>
                                  <Button variant="outline" className="border-[hsl(var(--color-primary))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-light))]" asChild>
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                      Book Consultation
                                    </a>
                                  </Button>
                                </div>
                              </div>
                              <div className="hidden md:block">
                                <Image 
                                  src={service.image} 
                                  alt={service.title}
                                  width={600}
                                  height={340}
                                  className="rounded-2xl shadow-lg aspect-video object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Our Services */}
      <section className="section-spacing bg-[hsl(var(--color-bg-alt))]">
        <div className="main-container">
          <SectionHeading 
            badge="Our Approach"
            title="What Makes Our Services Different"
            subtitle="We combine advanced technology with a compassionate approach"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Painless Procedures', desc: 'Advanced anesthesia and gentle techniques for zero discomfort' },
              { title: 'Transparent Pricing', desc: 'No hidden costs. Know what you pay before treatment' },
              { title: 'Modern Equipment', desc: 'State-of-the-art technology for precise, efficient care' },
              { title: 'Personalized Care', desc: 'Treatment plans tailored to your specific needs' }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-[hsl(var(--color-primary-light))] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-[hsl(var(--color-primary))]" />
                  </div>
                  <h4 className="font-semibold text-[hsl(var(--color-text))] mb-2">{item.title}</h4>
                  <p className="text-sm text-[hsl(var(--color-text-muted))]">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="main-container-narrow">
          <AnimatedSection>
            <div className="bg-[hsl(var(--color-primary))] rounded-3xl p-8 lg:p-12 text-center text-[hsl(var(--primary-foreground))]">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                Not Sure Which Service You Need?
              </h2>
              <p className="text-[hsl(var(--primary-foreground)/0.8)] mb-8 max-w-xl mx-auto">
                Book a consultation and let our experts recommend the best treatment for you. No pressure, just honest advice.
              </p>
              <Button 
                size="lg" 
                className="bg-[hsl(var(--background))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-bg-alt))] px-8 py-6 text-base font-medium"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book a Consultation
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
