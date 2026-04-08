'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
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

const whatsappNumber = '919876543210';
const whatsappMessage = encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
const phoneNumber = '+919876543210';

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <PageWrapper>
      {/* Hero Section - Full Screen Cinematic */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-secondary))]/80 via-[hsl(var(--color-secondary))]/50 to-transparent z-10" />
          <img 
            src="https://images.pexels.com/photos/3762441/pexels-photo-3762441.jpeg?auto=compress&cs=tinysrgb&w=1920" 
            alt="Beautiful Smile" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-20 h-full flex items-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="main-container">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-[hsl(var(--color-accent))] text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6">
                  Aesthedent Dental Clinic
                </p>
              </motion.div>
              
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Look{' '}
                <span className="font-semibold italic">beautiful.</span>
                <br />
                <span className="text-[hsl(var(--color-accent))]">Inside out.</span>
              </motion.h1>
              
              <motion.p
                className="text-lg md:text-xl text-[hsl(var(--color-text-light))] max-w-xl mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Where painless dentistry meets honest care. Experience dental treatments designed around your comfort.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-light))] text-[hsl(var(--primary-foreground))] font-medium rounded-full transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  Book Appointment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--primary-foreground))]/10 hover:bg-[hsl(var(--primary-foreground))]/20 text-[hsl(var(--primary-foreground))] font-medium rounded-full backdrop-blur-sm border border-[hsl(var(--primary-foreground))]/20 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  +91 98765 43210
                </a>
              </motion.div>
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
            className="bg-[hsl(var(--background))] rounded-2xl shadow-2xl shadow-black/10 p-6 md:p-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { number: '5.0', label: 'Google Rating', sub: '263 Reviews' },
                { number: '10+', label: 'Years', sub: 'Experience' },
                { number: '5000+', label: 'Happy', sub: 'Patients' },
                { number: '100%', label: 'Painless', sub: 'Treatments' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[hsl(var(--color-primary))] mb-1">{stat.number}</p>
                  <p className="text-sm font-medium text-[hsl(var(--color-text))]">{stat.label}</p>
                  <p className="text-xs text-[hsl(var(--color-text-muted))]">{stat.sub}</p>
                </div>
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
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[hsl(var(--color-primary-light))] rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-[hsl(var(--color-primary))] ml-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Watch Our Story</p>
                      <p className="text-sm text-gray-500">2 min video</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="right">
              <p className="text-[hsl(var(--color-primary))] font-medium tracking-wide uppercase text-sm mb-4">Our Philosophy</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--color-text))] leading-tight mb-6">
                Dentistry is an{' '}
                <span className="font-semibold italic">art</span> and{' '}
                <span className="font-semibold italic">science</span>{' '}
                of precision.
              </h2>
              <p className="text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-8">
                At Aesthedent, we believe every smile tells a story. Our approach combines cutting-edge technology with a deeply personal touch, ensuring that your journey to a healthier smile is as comfortable as it is transformative.
              </p>
              <p className="text-[hsl(var(--color-text-muted))] leading-relaxed mb-10">
                Founded by Dr. Sahil with a simple vision: to create a dental clinic where patients actually want to visit. Where fear is replaced with comfort, and every treatment is explained with honesty and care.
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
              <p className="text-[hsl(var(--color-primary))] font-medium tracking-wide uppercase text-sm mb-4">The Experience</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--color-text))] leading-tight mb-6">
                Say hello to{' '}
                <span className="font-semibold italic text-[hsl(var(--color-primary))]">painless</span>{' '}
                dentistry!
              </h2>
              <p className="text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-8">
                Sounds too good to be true? It's absolutely true. We do a bunch of things at our clinic that ensures your experience is top notch. No more getting frightened at Aesthedent.
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  'Advanced numbing techniques - you won\'t feel a thing',
                  'Calm, spa-like environment designed for relaxation',
                  'Step-by-step explanation before any procedure',
                  'Gentle approach with modern, quiet equipment'
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
                  src="https://images.pexels.com/photos/5622232/pexels-photo-5622232.jpeg?auto=compress&cs=tinysrgb&w=500" 
                  alt="Gentle dental care" 
                  className="rounded-2xl shadow-lg w-full aspect-[3/4] object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/5619462/pexels-photo-5619462.jpeg?auto=compress&cs=tinysrgb&w=500" 
                  alt="Modern equipment" 
                  className="rounded-2xl shadow-lg w-full aspect-[3/4] object-cover mt-8"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-[hsl(var(--color-secondary))] text-[hsl(var(--primary-foreground))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[hsl(var(--color-accent))] font-medium tracking-wide uppercase text-sm mb-4">Our Services</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
              Expert care for{' '}
              <span className="font-semibold italic">every</span> smile
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link href={`/services/${service.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-[hsl(var(--color-secondary-light))] hover:bg-[hsl(var(--color-secondary-light))]/80 transition-all duration-300">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-secondary))] via-[hsl(var(--color-secondary))]/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-[hsl(var(--color-accent))] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[hsl(var(--color-text-light))] text-sm mb-4">{service.shortDesc}</p>
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
            <p className="text-[hsl(var(--color-primary))] font-medium tracking-wide uppercase text-sm mb-4">Meet the Team</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--color-text))] leading-tight">
              We're the{' '}
              <span className="font-semibold italic">dentists</span> of dentists
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Dr. Sahil Sharma',
                role: 'Lead Dentist & Founder',
                image: '/assets/doctor-male.jpeg',
                desc: 'Specializes in implants and restorative dentistry. Known for his calm demeanor and thorough explanations.'
              },
              {
                name: 'Dr. Aishwarya Kulkarni',
                role: 'Dental Surgeon',
                image: '/assets/doctor-female.jpeg',
                desc: 'Expert in painless extractions and pediatric dentistry. Patients love her gentle, reassuring approach.'
              }
            ].map((doctor, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="group relative overflow-hidden rounded-3xl">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-secondary))] via-[hsl(var(--color-secondary))]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-[hsl(var(--color-accent))] font-medium text-sm mb-2">{doctor.role}</p>
                    <h3 className="text-2xl font-semibold text-[hsl(var(--primary-foreground))] mb-3">{doctor.name}</h3>
                    <p className="text-[hsl(var(--color-text-light))] text-sm leading-relaxed">{doctor.desc}</p>
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
              <p className="text-[hsl(var(--primary-foreground))]/80 font-medium tracking-wide uppercase text-sm mb-4">Visit Us</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--primary-foreground))] leading-tight mb-8">
                Ready for your{' '}
                <span className="font-semibold italic">best</span> smile?
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Location</p>
                    <p className="text-teal-100">Near Karve Statue, Kothrud, Pune 411038</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Opening Hours</p>
                    <p className="text-teal-100">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-teal-200 text-sm">Sunday: Closed (By appointment only)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">For Appointments</p>
                    <a href={`tel:${phoneNumber}`} className="text-teal-100 hover:text-white transition-colors">
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
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-teal-600 font-medium rounded-full hover:bg-gray-100 transition-colors"
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
