'use client';

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
import { buildWhatsappMessage } from '@/lib/clinic';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Phone,
  ChevronDown,
} from 'lucide-react';

// Phase 4D: was a single hardcoded generic message, so an enquiry from the
// implants page and one from the braces page arrived identical. Now built per
// service - see buildWhatsappMessage() in lib/clinic.ts.
const phoneNumber = '+919309816336';

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4G -SEMANTIC STRUCTURE + LAYOUT
//
// This template serves all eight service pages, so the structural work lands on
// all eight. Only the CONTENT of dental-implants and root-canal has been
// replaced with Dr. Sahil's copy so far; the other six keep their Phase 4D text
// inside the new structure.
//
// What changed and why it matters to a crawler:
//
//   <article>          one document per page, wrapping the whole treatment body
//   <section aria-*>    every block labelled, so the outline is machine-readable
//   <ol><li>            the process is genuinely ordered -steps 1..n. Styled
//                       divs conveyed that visually and not at all semantically,
//                       which is what stops Google reading it as a procedure.
//   <ul><li>            benefits are a list and are now marked as one
//   <details>/<summary> native accordion. Replaces a useState + framer-motion
//                       accordion: the answer text is now IN the DOM on first
//                       paint instead of conditionally rendered, so it is
//                       crawlable and it matches the FAQPage JSON-LD exactly —
//                       Google requires the marked-up answer to be visible.
//                       Also removes JS from the page rather than adding it,
//                       which protects the ~1.1s load.
//
// Heading order is h1 (once) → h2 (section) → h3 (sub-point). Nothing skips a
// level and no heading is used for styling.
//
// Design: existing tokens only. Prose measure constrained to ~68ch, step numbers
// use the existing primary token, FAQ uses the existing border/radius language.
// No new palette, no new font, no new component library.
// ─────────────────────────────────────────────────────────────────────────────

// The slug arrives resolved from the server shell, which already 404s on an
// unknown one - see ./page.js.
export default function ServiceDetailClient({ slug }) {
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const whatsappLink = buildWhatsappMessage(service.title);

  // Pages carrying Dr. Sahil's copy have these; the rest fall back cleanly.
  const heroHeadline = service.hero?.headline;
  const heroPromise = service.hero?.promise ?? service.shortDesc;
  const aboutHeading = service.aboutHeading ?? 'About This Treatment';
  const imageAlt = service.imageAlt ?? `${service.title} at Aesthedent Dental Clinic, Kothrud`;

  return (
    <PageWrapper>
      <article>
        {/* Hero */}
        <section className="pt-32 pb-16" aria-labelledby="service-title">
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
                  All dental treatments in Kothrud
                </Link>

                {/* THE ONLY h1 ON THE PAGE. It is the primary keyword heading;
                    Dr. Sahil's headline sits below it as a lead line, not as a
                    second h1. */}
                <h1
                  id="service-title"
                  className="text-4xl lg:text-[52px] font-semibold text-[hsl(var(--color-text))] mb-4 leading-tight"
                >
                  {service.title} in {service.locality}
                </h1>

                {heroHeadline && (
                  <p className="text-xl lg:text-2xl font-medium text-[hsl(var(--color-primary))] mb-4 leading-snug">
                    {heroHeadline}
                  </p>
                )}

                <p className="text-lg text-[hsl(var(--color-text-muted))] leading-relaxed mb-8 max-w-[65ch]">
                  {heroPromise}
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
                  alt={imageAlt}
                  width={800}
                  height={450}
                  className="rounded-3xl shadow-xl object-cover w-full h-[400px] lg:h-[450px]"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* About */}
        <section
          className="section-spacing bg-[hsl(var(--color-bg-alt))]"
          aria-labelledby="about-heading"
        >
          <div className="main-container-narrow">
            <AnimatedSection>
              <h2
                id="about-heading"
                className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))] mb-6"
              >
                {aboutHeading}
              </h2>
              <div className="max-w-[68ch]">
                {service.fullDescription?.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="mb-5 text-[17px] leading-[1.75] text-[hsl(var(--color-text-muted))]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Typed lists (denture types, orthodontic appliance types).
                  Dr. Sahil wrote these as numbered lists; they are kinds, not
                  steps, so they are a <ul> and not the process <ol>. */}
              {service.aboutList?.items?.length > 0 && (
                <div className="mt-10 max-w-[68ch]">
                  <h3 className="mb-5 text-xl font-semibold text-[hsl(var(--color-text))]">
                    {service.aboutList.heading}
                  </h3>
                  <ul className="space-y-4 list-none p-0">
                    {service.aboutList.items.map((item, i) => (
                      <li
                        key={i}
                        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5"
                      >
                        <p className="mb-1 font-semibold text-[hsl(var(--color-primary))]">
                          {item.title}
                        </p>
                        <p className="text-[hsl(var(--color-text-muted))] leading-[1.75]">
                          {item.desc}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AnimatedSection>
          </div>
        </section>

        {/* Benefits -a real <ul> */}
        {service.benefits?.length > 0 && (
          <section className="section-spacing" aria-labelledby="benefits-heading">
            <div className="main-container">
              <AnimatedSection className="text-center mb-12">
                <Badge className="mb-4 bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))]">
                  Benefits
                </Badge>
                <h2
                  id="benefits-heading"
                  className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]"
                >
                  What {service.title.toLowerCase()} does for you
                </h2>
              </AnimatedSection>

              <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
                {service.benefits.map((benefit, i) => (
                  <li key={i}>
                    <AnimatedSection delay={i * 0.08}>
                      <div className="flex items-start gap-4 p-6 h-full bg-[hsl(var(--background))] rounded-2xl border border-[hsl(var(--border))] hover:border-[hsl(var(--color-primary))] hover:shadow-md transition-all">
                        <span className="w-8 h-8 bg-[hsl(var(--color-primary))]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle2
                            className="w-5 h-5 text-[hsl(var(--color-primary))]"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-[hsl(var(--color-text))] leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    </AnimatedSection>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Why Aesthedent -only on pages that have it */}
        {service.whyAesthedent?.length > 0 && (
          <section
            className="section-spacing bg-[hsl(var(--color-bg-alt))]"
            aria-labelledby="why-heading"
          >
            <div className="main-container-narrow">
              <AnimatedSection className="mb-10">
                <Badge className="mb-4 bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))]">
                  Why Aesthedent
                </Badge>
                <h2
                  id="why-heading"
                  className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]"
                >
                  Why patients choose us for this treatment
                </h2>
              </AnimatedSection>

              <div className="grid gap-6 md:grid-cols-2">
                {service.whyAesthedent.map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.08}>
                    <div className="h-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
                      <h3 className="mb-2 font-semibold text-[hsl(var(--color-primary))]">
                        {item.title}
                      </h3>
                      <p className="text-[hsl(var(--color-text-muted))] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Process -a real <ol>. This is the change that lets Google read the
            page as a stepwise procedure rather than as decorated prose. */}
        {service.process?.length > 0 && (
          <section
            className="section-spacing bg-gradient-to-b from-[hsl(var(--color-primary))]/10 to-[hsl(var(--background))]"
            aria-labelledby="process-heading"
          >
            <div className="main-container-narrow">
              <AnimatedSection className="text-center mb-12">
                <Badge className="mb-4 bg-[hsl(var(--color-primary))]/20 text-[hsl(var(--color-primary))]">
                  The Process
                </Badge>
                <h2
                  id="process-heading"
                  className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]"
                >
                  What to expect, step by step
                </h2>
              </AnimatedSection>

              <ol className="space-y-6 list-none p-0 m-0">
                {service.process.map((step, i) => (
                  <li key={i}>
                    <AnimatedSection delay={i * 0.1}>
                      <div className="flex gap-5 sm:gap-6 items-start">
                        <span
                          className="w-11 h-11 sm:w-12 sm:h-12 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0"
                          aria-hidden="true"
                        >
                          {step.step ?? i + 1}
                        </span>
                        <div className="bg-[hsl(var(--background))] rounded-2xl p-5 sm:p-6 flex-1 border border-[hsl(var(--border))] shadow-sm">
                          <h3 className="font-semibold text-[hsl(var(--color-text))] text-lg mb-2">
                            {step.title}
                          </h3>
                          <p className="text-[hsl(var(--color-text-muted))] leading-relaxed max-w-[62ch]">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </AnimatedSection>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* FAQ -native <details>/<summary>. Answers are in the DOM on first
            paint, so the visible text matches the FAQPage JSON-LD exactly. */}
        {service.faqs?.length > 0 && (
          <section className="section-spacing" aria-labelledby="faq-heading">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatedSection className="text-center mb-12">
                <Badge className="mb-4 bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))]">
                  FAQs
                </Badge>
                <h2
                  id="faq-heading"
                  className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]"
                >
                  Common questions
                </h2>
              </AnimatedSection>

              <div className="space-y-4">
                {service.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-[hsl(var(--background))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden hover:border-[hsl(var(--color-primary))] transition-colors"
                  >
                    <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <h3 className="font-semibold text-[hsl(var(--color-text))] text-base">
                        {faq.q}
                      </h3>
                      <ChevronDown
                        className="w-5 h-5 flex-shrink-0 text-[hsl(var(--color-text-muted))] transition-transform duration-200 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-6 pb-6 -mt-1">
                      <p className="text-[hsl(var(--color-text-muted))] leading-[1.75] max-w-[65ch]">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* CTA */}
      <section className="section-spacing-sm bg-[hsl(var(--primary))]" aria-labelledby="cta-heading">
        <div className="main-container-narrow text-center">
          <AnimatedSection>
            <h2
              id="cta-heading"
              className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--primary-foreground))] mb-4"
            >
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
                  id="service-detail-whatsapp-cta"
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
      <section className="section-spacing" aria-labelledby="other-heading">
        <div className="main-container">
          <AnimatedSection className="text-center mb-12">
            <h2
              id="other-heading"
              className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))]"
            >
              Other dental treatments in Kothrud
            </h2>
          </AnimatedSection>

          <ul className="grid md:grid-cols-3 gap-8 list-none p-0">
            {otherServices.map((s, i) => (
              <li key={s.slug}>
                <AnimatedSection delay={i * 0.1}>
                  <Link href={`/services/${s.slug}`}>
                    <Card className="group h-full border-[hsl(var(--border))] hover:border-[hsl(var(--color-primary))] hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                      <div className="aspect-[16/10] overflow-hidden">
                        <Image
                          src={s.image}
                          alt={s.imageAlt ?? `${s.title} at Aesthedent Dental Clinic, Kothrud`}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-[hsl(var(--color-text))] group-hover:text-[hsl(var(--color-primary))] transition-colors mb-2">
                          {s.title}
                        </h3>
                        <span className="flex items-center text-[hsl(var(--color-primary))] text-sm font-medium">
                          {s.shortDesc?.slice(0, 60)}
                          <ArrowRight className="w-4 h-4 ml-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
}
