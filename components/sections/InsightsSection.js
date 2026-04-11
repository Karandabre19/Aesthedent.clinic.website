'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

// Default insights data - can be replaced with dynamic data
const defaultInsights = [
  {
    id: 1,
    slug: 'dental-implants-cost-pune',
    title: 'How much do dental implants cost in Pune?',
    excerpt: 'A transparent breakdown of implant pricing, what affects the cost, and why investing in quality matters for your long-term oral health.',
    category: 'Dental Implants',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/6627566/pexels-photo-6627566.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: 2,
    slug: 'root-canal-pain-myths',
    title: 'Is root canal treatment painful?',
    excerpt: 'The truth about modern root canal procedures and why they are nothing like the horror stories you have heard.',
    category: 'Root Canal',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/6502019/pexels-photo-6502019.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: 3,
    slug: 'best-dentist-kothrud-pune',
    title: 'How to find a good dentist in Kothrud',
    excerpt: 'What to look for when choosing a dentist, red flags to avoid, and questions you should always ask.',
    category: 'Dental Care',
    readTime: '3 min read',
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: 4,
    slug: 'teeth-whitening-safety',
    title: 'Is teeth whitening safe for your enamel?',
    excerpt: 'Understanding professional whitening versus at-home kits, and what dentists actually recommend.',
    category: 'Cosmetic',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
];

function FeaturedArticle({ article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block">
      <motion.article 
        className="relative overflow-hidden rounded-2xl bg-[hsl(var(--background))] h-[62vh]"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] lg:aspect-[16/12] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/90 via-[hsl(var(--primary))]/40 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
            {/* Category Badge */}
            <span className="inline-flex self-start mb-4 px-3 py-1.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-xs font-semibold rounded-full uppercase tracking-wider">
              {article.category}
            </span>
            
            {/* Title */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-[hsl(var(--accent))] transition-colors duration-300 text-balance">
              {article.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4 line-clamp-2 max-w-2xl">
              {article.excerpt}
            </p>
            
            {/* Meta & CTA */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="inline-flex items-center gap-2 text-[hsl(var(--accent))] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                Read more
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function ArticleCard({ article, index }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block">
      <motion.article 
        className="relative flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl bg-[hsl(var(--background))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]/40 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -2, boxShadow: '0 12px 32px hsl(var(--primary) / 0.08)' }}
      >
        {/* Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Category */}
          <span className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-wider mb-1.5">
            {article.category}
          </span>
          
          {/* Title */}
          <h4 className="text-sm sm:text-base font-semibold text-[hsl(var(--color-text))] leading-snug mb-2 line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors duration-300">
            {article.title}
          </h4>
          
          {/* Read Time */}
          <span className="flex items-center gap-1.5 text-[hsl(var(--color-text-muted))] text-xs">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
        
        {/* Hover Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowRight className="w-5 h-5 text-[hsl(var(--accent))]" />
        </div>
      </motion.article>
    </Link>
  );
}

export default function InsightsSection({ 
  title = "Insights",
  subtitle = "Trusted knowledge from real experts",
  insights = defaultInsights,
  limit = 4,
  variant = 'default', // 'default' for homepage, 'compact' for landing pages
  contextHeading, // e.g., "Before you decide, read this"
  showViewAll = true,
}) {
  const displayedInsights = insights.slice(0, limit);
  const featuredArticle = displayedInsights.find(a => a.featured) || displayedInsights[0];
  const otherArticles = displayedInsights.filter(a => a.id !== featuredArticle.id);

  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-[hsl(var(--bg-alt))] to-white">
      <div className="main-container">
        {/* Section Header */}
        <AnimatedSection className="mb-10 sm:mb-12 lg:mb-16">
          <div className="max-w-2xl">
            {/* Eyebrow / Context Heading */}
            {contextHeading ? (
              <p className="text-[hsl(var(--accent))] text-sm font-semibold uppercase tracking-widest mb-3">
                {contextHeading}
              </p>
            ) : (
              <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-xs sm:text-sm font-semibold">
                Knowledge Hub
              </div>
            )}
            
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--color-text))] leading-tight mb-3 sm:mb-4">
              {title}
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[hsl(var(--color-text-muted))] leading-relaxed">
              {subtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Articles Grid */}
        {variant === 'compact' ? (
          // Compact variant for landing pages - just 2-3 smaller cards
          <div className="grid gap-4 sm:gap-5">
            {displayedInsights.slice(0, 3).map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          // Default variant - Featured + side articles
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Featured Article - Takes 3 columns */}
            <AnimatedSection className="lg:col-span-3">
              <FeaturedArticle article={featuredArticle} />
            </AnimatedSection>

            {/* Side Articles - Takes 2 columns */}
            <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
              {otherArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* View All Link */}
        {showViewAll && (
          <AnimatedSection className="mt-10 sm:mt-12 text-center lg:text-left">
            <Link
              href="/insights"
              className="group inline-flex items-center gap-3 text-[hsl(var(--primary))] font-semibold hover:text-[hsl(var(--primary-dark))] transition-colors text-base sm:text-lg"
            >
              Explore all insights
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
