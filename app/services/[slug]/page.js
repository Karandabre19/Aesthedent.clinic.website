'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
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

const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';
const phoneNumber = '+919309816336';

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
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/services"
                className="inline-flex items-center text-sm text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-primary))] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Link>
              <Badge className="mb-4 bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary))]/20">
                Service
              </Badge>
              <h1 className="text-4xl lg:text-[52px] font-semibold text-[hsl(var(--color-text))] mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-8">
                {service.shortDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--accent))] hover:opacity-90 text-[hsl(var(--accent-foreground))] px-8 py-6 text-base font-medium"
                  asChild
                >
                  <a
                    id="service-detail-whatsapp"
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book This Treatment
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[hsl(var(--border))] text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-bg-alt))] px-8 py-6 text-base font-medium"
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
              <Image
                src={service.image}
                alt={service.title}
                width={800}
                height={450}
                className="rounded-3xl shadow-xl object-cover w-full h-[400px] lg:h-[450px]"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About This Service */}
      <section className="section-spacing bg-[hsl(var(--color-bg-alt))]">
        <div className="main-container-narrow">
          <AnimatedSection>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))] mb-6">
              About This Treatment
            </h2>
            <div className="prose prose-lg text-[hsl(var(--color-text-muted))]">
              {service.fullDescription?.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-spacing">
        <div className="main-container">
          <AnimatedSection className="text-center mb-12">
            <Badge className="mb-4 bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))]">
              Benefits
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]">
              Why Choose This Treatment
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits?.map((benefit, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-6 bg-[hsl(var(--background))] rounded-2xl border border-[hsl(var(--border))] hover:border-[hsl(var(--color-primary))] hover:shadow-md transition-all">
                  <div className="w-8 h-8 bg-[hsl(var(--color-primary))]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                  </div>
                  <p className="text-[hsl(var(--color-text))]">{benefit}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-spacing bg-gradient-to-b from-[hsl(var(--color-primary))]/10 to-[hsl(var(--background))]">
        <div className="main-container-narrow">
          <AnimatedSection className="text-center mb-12">
            <Badge className="mb-4 bg-[hsl(var(--color-primary))]/20 text-[hsl(var(--color-primary))]">
              The Process
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]">
              What to Expect
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            {service.process?.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="bg-[hsl(var(--background))] rounded-2xl p-6 flex-1 border border-[hsl(var(--border))] shadow-sm">
                    <h4 className="font-semibold text-[hsl(var(--color-text))] text-lg mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[hsl(var(--color-text-muted))]">
                      {step.desc}
                    </p>
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
            <Badge className="mb-4 bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))]">
              FAQs
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]">
              Common Questions
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {service.faqs?.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-[hsl(var(--background))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden hover:border-[hsl(var(--color-primary))] transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-[hsl(var(--color-text))] pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[hsl(var(--color-text-muted))] transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-[hsl(var(--color-text-muted))]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing-sm bg-[hsl(var(--primary))]">
        <div className="main-container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--primary-foreground))] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[hsl(var(--primary-foreground)/0.8)] mb-8 max-w-xl mx-auto">
              Book your consultation today and take the first step towards a
              healthier smile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[hsl(var(--background))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-bg-alt))] px-8 py-6"
                asChild
              >
                <a
                  id="service-detail-whatsapp"
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book on WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[hsl(var(--primary-foreground))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--primary-foreground))]/10 px-8 py-6"
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
        <div className="main-container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]">
              Explore Other Services
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {otherServices.map((s, i) => (
              <AnimatedSection key={s.slug} delay={i * 0.1}>
                <Link href={`/services/${s.slug}`}>
                  <Card className="group border-[hsl(var(--border))] hover:border-[hsl(var(--color-primary))] hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="aspect-[16/10] overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-[hsl(var(--color-text))] group-hover:text-[hsl(var(--color-primary))] transition-colors mb-2">
                        {s.title}
                      </h3>
                      <div className="flex items-center text-[hsl(var(--color-primary))] text-sm font-medium">
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
