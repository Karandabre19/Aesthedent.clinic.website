'use client';

import { Star, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getTestimonials } from '@/lib/testimonials';

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
              <AnimatedSection
                key={testimonial.id}
                delay={index * 0.1}
                className="bg-[hsl(var(--background))] rounded-lg shadow-sm hover:shadow-md transition-all border border-[hsl(var(--border))] overflow-hidden"
              >
                {/* Patient Photo - Compact */}
                <div className="relative h-40 overflow-hidden bg-[hsl(var(--color-bg-alt))]">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Review Content */}
                <div className="p-6">
                  {/* Quotation Mark */}
                  <div className="text-[hsl(var(--color-primary))]/30 mb-3">
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
                  <p className="text-[hsl(var(--color-text))] text-sm leading-relaxed mb-4 line-clamp-3">
                    {testimonial.text}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-[hsl(var(--border))] pt-4 mb-4">
                    {/* Patient Info & Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[hsl(var(--color-text))] text-sm">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs text-[hsl(var(--color-primary))] font-medium">
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
                  <div className="flex items-center text-[hsl(var(--color-primary))] text-xs font-medium hover:text-[hsl(var(--color-primary-dark))] cursor-pointer">
                    <span>Read More</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </AnimatedSection>
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
            <AnimatedSection
              key={testimonial.id}
              delay={index * 0.1}
              className="bg-[hsl(var(--background))] rounded-lg shadow-sm hover:shadow-md transition-all border border-[hsl(var(--border))] overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden bg-[hsl(var(--color-bg-alt))]">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="text-[hsl(var(--color-primary))]/30 mb-3">
                  <svg
                    className="w-6 h-6 opacity-60"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5m14 0c-3 0-7 1-7 8v8c0 1.25 4.716 5 7 5" />
                  </svg>
                </div>

                <p className="text-[hsl(var(--color-text))] text-sm leading-relaxed mb-4 line-clamp-3">
                  {testimonial.text}
                </p>

                <div className="border-t border-[hsl(var(--border))] pt-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[hsl(var(--color-text))] text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-[hsl(var(--color-primary))] font-medium">
                        {testimonial.service}
                      </p>
                    </div>
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

                <div className="flex items-center text-[hsl(var(--color-primary))] text-xs font-medium hover:text-[hsl(var(--color-primary-dark))] cursor-pointer">
                  <span>Read More</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
