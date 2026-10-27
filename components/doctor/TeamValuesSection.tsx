import { Heart, Users, Award, type LucideIcon } from 'lucide-react';
import type { ComponentType, HTMLAttributes } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { teamValuesDefaults, type TeamValues } from '@/sanity/lib/team-values';

const icons: Record<TeamValues['cards'][number]['icon'], LucideIcon> = { heart: Heart, users: Users, award: Award };
// The existing JavaScript components forward native div props, including children.
const ValueCard = Card as ComponentType<HTMLAttributes<HTMLDivElement>>;
const ValueCardContent = CardContent as ComponentType<HTMLAttributes<HTMLDivElement>>;
type LegacyHeadings = { eyebrow?: string; heading?: string; intro?: string };
export function TeamValuesSection({ values, legacy }: { values?: TeamValues | null; legacy?: LegacyHeadings }) {
  const section = values ?? { ...teamValuesDefaults, eyebrow: legacy?.eyebrow ?? teamValuesDefaults.eyebrow, heading: legacy?.heading ?? teamValuesDefaults.heading, subheading: legacy?.intro ?? teamValuesDefaults.subheading };
  if (!section.cards.length) return null;
  return <section className="section-spacing bg-[hsl(var(--color-bg-alt))]" aria-label={section.heading}>
    <div className="main-container">
      <SectionHeading badge={section.eyebrow} title={section.heading} subtitle={section.subheading} />
      <div className="grid md:grid-cols-3 gap-8">{section.cards.map((card, index) => {
        const Icon = icons[card.icon];
        return <AnimatedSection key={card._key} delay={index * 0.1}>
          <ValueCard className="border-[hsl(var(--color-border))] h-full text-center hover:shadow-lg transition-shadow"><ValueCardContent className="p-8">
            <div className="w-14 h-14 bg-[hsl(var(--color-primary-light))] rounded-2xl flex items-center justify-center mx-auto mb-6"><Icon aria-hidden="true" className="w-7 h-7 text-[hsl(var(--color-primary))]" /></div>
            <h3 className="text-xl font-semibold text-[hsl(var(--color-text))] mb-3">{card.title}</h3>
            <p className="text-[hsl(var(--color-text-muted))]">{card.description}</p>
          </ValueCardContent></ValueCard>
        </AnimatedSection>;
      })}</div>
    </div>
  </section>;
}
