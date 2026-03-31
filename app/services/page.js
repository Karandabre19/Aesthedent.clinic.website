'use client';

import Link from 'next/link';
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
  Stethoscope
} from 'lucide-react';

const iconMap = {
  Sparkles, Shield, Leaf, Baby, Stethoscope
};

const whatsappLink = 'https://wa.me/919876543210?text=' + encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');

export default function ServicesPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="main-container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-[52px] font-semibold text-gray-900 mb-6 leading-tight">
              Our Dental Services
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              Comprehensive dental care with a focus on your comfort. Every treatment is performed with precision, care, and a gentle touch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-spacing">
        <div className="main-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const IconComponent = iconMap[service.icon] || Sparkles;
              return (
                <AnimatedSection key={service.slug} delay={i * 0.08}>
                  <Link href={`/services/${service.slug}`} className="block h-full">
                    <Card className="group border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full cursor-pointer hover-lift">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                            <IconComponent className="w-5 h-5 text-teal-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                            {service.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{service.shortDesc}</p>
                        <div className="flex items-center text-teal-600 font-medium text-sm">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Our Services */}
      <section className="section-spacing bg-gray-50">
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
                  <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
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
            <div className="bg-teal-600 rounded-3xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                Not Sure Which Service You Need?
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Book a consultation and let our experts recommend the best treatment for you. No pressure, just honest advice.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6 text-base font-medium"
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
