'use client';

import { Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getTestimonials } from '@/lib/testimonials';

function GoogleReviewBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--color-bg-alt))] px-3 py-1.5">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-primary))]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-accent))]" />
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--color-text-muted))]">
        Google Review
      </span>
    </div>
  );
}

function ReviewerAvatar({ testimonial }) {
  return (
    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--color-bg-alt))]">
      <Image
        src={testimonial.image}
        alt={testimonial.name}
        width={56}
        height={56}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function ReviewStars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(rating)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className="fill-[hsl(var(--color-accent))] text-[hsl(var(--color-accent))]"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, delay = 0 }) {
  return (
    <AnimatedSection
      key={testimonial.id}
      delay={delay}
      className="overflow-hidden rounded-[1.6rem] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-[0_22px_50px_-32px_hsl(var(--color-primary)/0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--color-primary))]/20 hover:shadow-[0_28px_60px_-34px_hsl(var(--color-primary)/0.2)]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <ReviewerAvatar testimonial={testimonial} />
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-[hsl(var(--color-text))]">
              {testimonial.name}
            </h3>
            <p className="mt-1 text-sm text-[hsl(var(--color-text-muted))]">
              Verified patient
            </p>
          </div>
        </div>
        <GoogleReviewBadge />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <ReviewStars rating={testimonial.rating} />
        <span className="rounded-full bg-[hsl(var(--color-bg-alt))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--color-primary))]">
          {testimonial.service}
        </span>
      </div>

      <p className="mb-6 text-[15px] leading-7 text-[hsl(var(--color-text))] line-clamp-4">
        {testimonial.text}
      </p>

      <div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-4">
        <div>
          <p className="text-sm font-medium text-[hsl(var(--color-primary))]">
            Shared on Google
          </p>
          <p className="text-xs text-[hsl(var(--color-text-muted))]">
            Honest patient feedback
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--color-primary))]">
          <span>Read More</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function TestimonialsSection({ 
  title = '#SmileStories',
  subtitle = 'Stories that drive us. Stories that give purpose. Stories that bring smiles.',
  limit = 3,
  variant = 'compact' // 'compact' or 'full'
}) {
  const testimonials = getTestimonials('latest', limit);

  if (variant === 'compact') {
    return (
      <section className="py-16 md:py-24 bg-[hsl(var(--background))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--accent))] mb-4">
              {title}
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Full variant for testimonials page
  return (
    <section className="py-16 md:py-24 bg-[hsl(var(--color-bg-alt))]">
      <div className="main-container">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--color-text))] mb-4">
            {title}
          </h2>
          <p className="text-[hsl(var(--color-text-muted))] text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
