'use client';

import Link from 'next/link';
import { Clock, MapPin, Phone, Star } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/button';
import { services } from '@/lib/services';
import { NAP } from '@/lib/schema';
import { REVIEWS, OPENING, DOCTORS, buildWhatsappMessage } from '@/lib/clinic';

// Existing components and tokens only - no new styling, no new design language.
//
// Content rule for this page: everything below is either checkable (address,
// hours, the Google rating, an MDS certificate) or it is a description of how the
// clinic runs. No patient counts, no prices, no parking claims - see
// audit/NEEDS-INPUT.md.
//
// KEYWORD DISCIPLINE: after Part D pushed the homepage to 1.57% by appending
// "in Kothrud" to eight cards, this page carries the location in the H1, the
// intro, and the areas paragraph - and then stops. The service links below use
// bare treatment names on purpose.

const whatsappLink = buildWhatsappMessage('your clinic in Kothrud');

export default function AreaClient() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="main-container">
          <AnimatedSection className="max-w-3xl">
            <h1 className="text-4xl lg:text-[52px] font-semibold text-[hsl(var(--color-primary))] mb-6 leading-tight">
              A dental clinic in Kothrud, Pune &mdash; and how to find it
            </h1>
            <p className="text-lg lg:text-xl text-[hsl(var(--color-text-muted))] leading-relaxed">
              We are on the first floor of AJ Tower in Dahanukar Colony, just off
              Paud Road. This page is the practical one: where we are, who we
              tend to see, when we are open, and what to expect if you have been
              putting a visit off.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Where we are */}
      <section className="section-spacing">
        <div className="main-container">
          <div className="grid gap-10 lg:grid-cols-2">
            <AnimatedSection>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))] mb-5">
                Finding us
              </h2>
              <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))] mb-4">
                The clinic is at {NAP.streetAddress}, {NAP.addressLocality}{' '}
                {NAP.postalCode}. The landmark most people navigate by is the
                Irani Cafe on the ground floor &mdash; we are directly above it,
                on the first floor. If you have reached Dahanukar Colony off Paud
                Road, you are less than a minute away.
              </p>
              <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))]">
                If you are coming for the first time and cannot see the entrance,
                phone us from downstairs rather than circling. Somebody will come
                and get you.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[hsl(var(--color-primary))]" />
                  <p className="text-sm text-[hsl(var(--color-text-muted))]">
                    {NAP.streetAddress}, {NAP.addressLocality} {NAP.postalCode}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-[hsl(var(--color-primary))]" />
                  <p className="text-sm text-[hsl(var(--color-text-muted))]">
                    {OPENING.hours}, {OPENING.daysOpenPerWeek} days a week
                    including Saturday and Sunday. Closed {OPENING.closedDay}.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-[hsl(var(--color-primary))]" />
                  <p className="text-sm text-[hsl(var(--color-text-muted))]">
                    {NAP.telephone}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))] mb-5">
                Open when you actually are
              </h2>
              <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))] mb-4">
                We are open six days a week, weekends included, and closed on{' '}
                {OPENING.closedDay} instead. That is worth knowing if you have
                been putting off an appointment because you cannot take a weekday
                morning off &mdash; a Saturday or Sunday slot is a normal booking
                here, not a favour.
              </p>
              <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))]">
                If something is painful today, phone rather than email. We will
                tell you honestly whether it needs seeing now or whether it can
                reasonably wait until a slot that suits you better.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Who we see */}
      <section className="section-spacing bg-[hsl(var(--color-bg-alt))]/40">
        <div className="main-container">
          <AnimatedSection className="max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))] mb-5">
              Where our patients come from
            </h2>
            <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))] mb-4">
              Most people who come to us live within a few minutes of the clinic
              &mdash; Kothrud itself, and the Karve Nagar side. For anything
              urgent that is simply how it should be; nobody sensibly crosses
              Pune with an abscess, and a filling is not worth a forty-minute
              drive.
            </p>
            <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))] mb-4">
              Orthodontic patients tend to be local for a different reason. Braces
              mean a short appointment roughly every month for a year and a half,
              so the cumulative travel matters far more than people expect when
              they start. If you are weighing up clinics for a treatment that
              long, distance deserves more weight than it usually gets.
            </p>
            <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))]">
              The longer trips are the planned ones. People come from Bavdhan and
              Warje for implant work, and from Erandwane and Deccan for dentures
              and full mouth rehabilitation &mdash; treatments where you are
              choosing a clinician rather than a postcode, and where it is
              reasonable to travel a bit further to get the planning right.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Why local patients choose us */}
      <section className="section-spacing">
        <div className="main-container">
          <AnimatedSection className="max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))] mb-5">
              Why people here choose us
            </h2>
            <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))] mb-6">
              Two things, and we would rather state them plainly than describe
              ourselves with adjectives.
            </p>

            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 fill-[hsl(var(--color-accent))] text-[hsl(var(--color-accent))]" />
                  <p className="text-sm font-semibold text-[hsl(var(--color-text))]">
                    {REVIEWS.rating} on Google, from {REVIEWS.count} reviews
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[hsl(var(--color-text-muted))]">
                  You can check that yourself in about ten seconds, which is the
                  point of quoting it. We would rather point at a number a
                  stranger wrote than one we made up about ourselves.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
                <p className="mb-3 text-sm font-semibold text-[hsl(var(--color-text))]">
                  Complex work is planned by a specialist prosthodontist
                </p>
                <p className="text-sm leading-relaxed text-[hsl(var(--color-text-muted))]">
                  {DOCTORS.sahil.name} holds an {DOCTORS.sahil.credential}. A
                  prosthodontist is a dentist who has completed three further
                  years of training specifically in rebuilding and replacing
                  teeth, which is what implants, dentures and full mouth work
                  actually turn on. Everyday care is handled by{' '}
                  {DOCTORS.aishwarya.name}, a general and family dentist, who
                  also has training in endodontics.
                </p>
              </div>
            </div>

            <p className="mt-8 text-base leading-relaxed text-[hsl(var(--color-text-muted))]">
              Underneath both is the thing we care most about: you get shown the
              scan, told what we have found in plain words, and given the plan and
              the cost before anything begins. If you raise a hand mid-treatment,
              we stop. A lot of people who walk in here have avoided a dentist for
              years, and nobody is going to comment on it &mdash; if that is you,{' '}
              <Link href="/about" className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:text-[hsl(var(--color-accent))] transition-colors">
                this is how we work with nervous patients
              </Link>
              .
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* What we treat - the internal-link hub */}
      <section className="section-spacing bg-[hsl(var(--color-bg-alt))]/40">
        <div className="main-container">
          <AnimatedSection className="max-w-3xl mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))] mb-5">
              What we treat
            </h2>
            <p className="text-base leading-relaxed text-[hsl(var(--color-text-muted))]">
              Eight treatments, each with its own page explaining what is
              involved, how long it takes and what to expect afterwards.
            </p>
          </AnimatedSection>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.05}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block h-full rounded-[1.25rem] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--color-primary))]/30"
                >
                  <p className="mb-2 font-semibold text-[hsl(var(--color-primary))] group-hover:text-[hsl(var(--color-accent))] transition-colors">
                    {service.title}
                  </p>
                  <p className="text-sm leading-relaxed text-[hsl(var(--color-text-muted))]">
                    {service.shortDesc}
                  </p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="main-container">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(var(--color-text))] mb-4">
              Come and see us
            </h2>
            <p className="mb-8 text-base leading-relaxed text-[hsl(var(--color-text-muted))]">
              Book a consultation, or just ask a question first &mdash; plenty of
              people message before they are ready to book, and that is fine.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="bg-[hsl(var(--accent))] hover:opacity-90 text-[hsl(var(--accent-foreground))] px-8 py-6 text-base font-medium"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Ask us on WhatsApp
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[hsl(var(--color-primary))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-light))] px-8 py-6 text-base font-medium"
                asChild
              >
                <Link href="/contact">Directions and booking</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
