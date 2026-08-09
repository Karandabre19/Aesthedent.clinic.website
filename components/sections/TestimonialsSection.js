'use client';

import { Star, ArrowRight, User } from 'lucide-react';
import Image from 'next/image';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getTestimonials } from '@/lib/testimonials';
import { REVIEWS } from '@/lib/clinic';

// shrink-0 + whitespace-nowrap are load-bearing on phones. This badge shares a
// justify-between row with the reviewer's name, and at 390px it was both
// wrapping to two lines itself ("GOOGLE / REVIEW") and squeezing the name into
// ~80px so that wrapped too. Held on one line at a smaller size it costs ~124px
// and the name keeps a single line. Desktop sizing is restored at sm:.
function GoogleReviewBadge() {
  return (
    <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--color-bg-alt))] px-2 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-primary))]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-accent))]" />
      </div>
      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--color-text-muted))] sm:text-sm sm:tracking-[0.14em]">
        Google Review
      </span>
    </div>
  );
}

/**
 * Initials, not a face.
 *
 * This was a generic grey silhouette. The brief asked for real Google reviewer
 * photos instead - we do not have them, and the only face images in
 * lib/testimonials.js are Pexels stock photos of unrelated people, which would
 * be worse than the silhouette rather than better: a stranger's face captioned
 * with a patient's name is a fabricated record.
 *
 * Initials are the same pattern Google itself falls back to, carry the
 * reviewer's actual name, and claim nothing untrue. Swap to real photos once we
 * have them WITH each reviewer's permission - reviewer profile images are their
 * likeness, not the clinic's asset.
 */
function ReviewerAvatar({ testimonial }) {
  const initials = (testimonial?.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    // shrink-0 so the circle never deforms into an ellipse when the name beside
    // it is long. 40px on phones, the original 56px from sm: up.
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--color-bg-alt))] sm:h-14 sm:w-14">
      {initials ? (
        <span className="text-sm font-semibold tracking-wide text-[hsl(var(--color-primary))] sm:text-base">
          {initials}
        </span>
      ) : (
        <User className="h-5 w-5 text-[hsl(var(--color-primary))]/40 sm:h-7 sm:w-7" />
      )}
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
  // Provenance claims render only where we can back them. See the header comment
  // in lib/testimonials.js - the card used to assert "Verified patient" and
  // "Shared on Google" for every entry, including ones we cannot confirm.
  const isVerified = testimonial.verifiedGoogleReview === true;

  return (
    <AnimatedSection
      key={testimonial.id}
      delay={delay}
      className="overflow-hidden rounded-[1.25rem] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-[0_22px_50px_-32px_hsl(var(--color-primary)/0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--color-primary))]/20 hover:shadow-[0_28px_60px_-34px_hsl(var(--color-primary)/0.2)] sm:rounded-[1.6rem] sm:p-6"
    >
      <div className="mb-3.5 flex items-start justify-between gap-2 sm:mb-5 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <ReviewerAvatar testimonial={testimonial} />
          <div className="min-w-0">
            {/* Not truncated. At 360px `truncate` was cutting real patients'
                names mid-word ("Shekhar Bhosle" into 80px of an available
                125px), and a review signed by a clipped name reads as less
                real, not more compact. Names wrap instead. */}
            <h3 className="text-sm font-semibold leading-snug text-[hsl(var(--color-text))] sm:text-base">
              {testimonial.name}
            </h3>
            <p className="mt-0.5 text-xs text-[hsl(var(--color-text-muted))] sm:mt-1 sm:text-sm">
              {isVerified ? 'Verified patient' : 'Patient feedback'}
            </p>
          </div>
        </div>
        {isVerified && <GoogleReviewBadge />}
      </div>

      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
        <ReviewStars rating={testimonial.rating} />
        {/* No nowrap here on purpose: services run as long as "Tooth Extraction
            & Implant", which cannot hold one line at 390px. It shrinks and
            wraps rather than pushing the stars off the row. */}
        <span className="rounded-full bg-[hsl(var(--color-bg-alt))] px-2 py-0.5 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--color-primary))] sm:px-3 sm:py-1 sm:text-sm sm:tracking-[0.14em]">
          {testimonial.service}
        </span>
      </div>

      <p className="mb-4 text-sm leading-6 text-[hsl(var(--color-text))] line-clamp-4 sm:mb-6 sm:text-[15px] sm:leading-7">
        {testimonial.text}
      </p>

      {/* Stacked on phones. Side by side, these two blocks had ~150px each at
          390px, so the provenance line and the link BOTH wrapped and the row
          ran four lines deep. Stacking spends one line on each instead, and is
          shorter than what the squeezed row produced. Row layout returns at sm:. */}
      <div className="flex flex-col items-start gap-2 border-t border-[hsl(var(--border))] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-4">
        <div>
          <p className="text-xs font-medium text-[hsl(var(--color-primary))] sm:text-sm">
            {isVerified ? 'Shared on Google' : 'Patient feedback'}
          </p>
          <p className="text-xs text-[hsl(var(--color-text-muted))] sm:text-sm">
            {isVerified
              ? `One of ${REVIEWS.count} five-star reviews`
              : 'Awaiting profile confirmation'}
          </p>
        </div>
        <a 
          href="https://www.google.com/maps/place/Aesthedent+Dental+Clinic,+Kothrud/@18.4972761,73.8108921,17z/data=!3m1!5s0x3bc2bfc407d2eb7d:0xeb43317068a295aa!4m8!3m7!1s0x3bc2bfa49403bd57:0xb59ec17e89bd289f!8m2!3d18.497271!4d73.813467!9m1!1b1!16s%2Fg%2F11j2v_ph1x?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 py-2 text-sm font-medium text-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-accent))] transition-colors"
        >
          <span>Read our Google reviews</span>
          <ArrowRight size={14} />
        </a>
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
      <section className="section-y bg-[hsl(var(--background))]">
        <div className="main-container">
          <AnimatedSection className="text-center mb-10 sm:mb-12">
            {/* accent-ink, not accent: this section's ground is
                --background (pure white), where the brand gold measures
                1.96:1 and fails AA at every size. Same fix as the treatments
                heading. --accent stays correct on the dark blue sections. */}
            <h2 className="heading-section font-bold text-[hsl(var(--color-accent-ink))] mb-4">
              {title}
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          </AnimatedSection>

          {/* One column on phones, as the mobile pass requires. Two from md
              rather than three: the homepage now renders FOUR verified reviews,
              and a 3-column grid left the fourth stranded alone on a second
              row. Four divides evenly by two. */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
    <section className="section-y bg-[hsl(var(--color-bg-alt))]">
      <div className="main-container">
        <AnimatedSection className="text-center mb-10 sm:mb-12">
          <h2 className="heading-section font-bold text-[hsl(var(--color-text))] mb-4">
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
