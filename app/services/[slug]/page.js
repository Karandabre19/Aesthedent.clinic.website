'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getServiceBySlug, services } from '@/lib/services';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  MessageCircle,
  Phone,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const whatsappLink = 'https://wa.me/919876543210?text=' + encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');
const phoneNumber = '+919876543210';

export default function ServiceDetailPage({ params }) {
  const resolvedParams = use(params);
  const service = getServiceBySlug(resolvedParams.slug);
  const [openFaq, setOpenFaq] = useState(null);

  if (!service) {
    notFound();
  }

  const otherServices = services.filter(s => s.slug !== service.slug).slice(0, 3);

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/services" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Link>
              <Badge className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100">Service</Badge>
              <h1 className="text-4xl lg:text-[52px] font-semibold text-gray-900 mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {service.shortDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base font-medium"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book This Treatment
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base font-medium"
                  asChild
                >
                  <a href={`tel:${phoneNumber}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Call to Inquire
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src={service.image} 
                alt={service.title}
                className="rounded-3xl shadow-xl object-cover w-full h-[400px] lg:h-[450px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About This Service */}
      <section className="section-spacing bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">
              About This Treatment
            </h2>
            <div className="prose prose-lg text-gray-600">
              {service.fullDescription.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <Badge className="mb-4 bg-teal-50 text-teal-700">Benefits</Badge>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
              Why Choose This Treatment
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((benefit, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-spacing bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <Badge className="mb-4 bg-teal-100 text-teal-700">The Process</Badge>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
              What to Expect
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            {service.process.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="bg-white rounded-2xl p-6 flex-1 border border-gray-100 shadow-sm">
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-spacing">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <Badge className="mb-4 bg-teal-50 text-teal-700">FAQs</Badge>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
              Common Questions
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div 
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-teal-200 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-600">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing-sm bg-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-teal-100 mb-8 max-w-xl mx-auto">
              Book your consultation today and take the first step towards a healthier smile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book on WhatsApp
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 px-8 py-6"
                asChild
              >
                <a href={`tel:${phoneNumber}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Other Services */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
              Explore Other Services
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {otherServices.map((s, i) => (
              <AnimatedSection key={s.slug} delay={i * 0.1}>
                <Link href={`/services/${s.slug}`}>
                  <Card className="group border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={s.image} 
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors mb-2">
                        {s.title}
                      </h3>
                      <div className="flex items-center text-teal-600 text-sm font-medium">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
