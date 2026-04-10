'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';

// Insights data - can be moved to a separate file or fetched from CMS
const insights = [
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
  {
    id: 5,
    slug: 'dental-anxiety-tips',
    title: 'Afraid of the dentist? Here is how we help',
    excerpt: 'Practical strategies we use at Aesthedent to help anxious patients feel comfortable and in control.',
    category: 'Patient Care',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: 6,
    slug: 'when-to-get-braces',
    title: 'When is the right time to get braces?',
    excerpt: 'Age considerations, treatment options, and what to expect from orthodontic treatment at different life stages.',
    category: 'Orthodontics',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
];

function FeaturedArticle({ article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block">
      <motion.article 
        className="relative overflow-hidden rounded-2xl bg-[hsl(var(--background))]"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="grid lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px] overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[hsl(var(--background))] lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/80 to-transparent lg:hidden" />
          </div>
          
          {/* Content */}
          <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <span className="inline-flex self-start mb-4 px-3 py-1.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-xs font-semibold rounded-full uppercase tracking-wider">
              Featured
            </span>
            
            <span className="text-[hsl(var(--primary))] text-sm font-semibold uppercase tracking-wider mb-2">
              {article.category}
            </span>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[hsl(var(--color-text))] leading-tight mb-4 group-hover:text-[hsl(var(--primary))] transition-colors duration-300">
              {article.title}
            </h2>
            
            <p className="text-[hsl(var(--color-text-muted))] text-base sm:text-lg leading-relaxed mb-6">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[hsl(var(--color-text-muted))] text-sm">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="inline-flex items-center gap-2 text-[hsl(var(--primary))] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                Read article
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
    <Link href={`/insights/${article.slug}`} className="group block h-full">
      <motion.article 
        className="relative overflow-hidden rounded-xl bg-[hsl(var(--background))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]/40 transition-all duration-300 h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -4, boxShadow: '0 16px 40px hsl(var(--primary) / 0.1)' }}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col">
          <span className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-wider mb-2">
            {article.category}
          </span>
          
          <h3 className="text-lg sm:text-xl font-bold text-[hsl(var(--color-text))] leading-snug mb-3 group-hover:text-[hsl(var(--primary))] transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-[hsl(var(--color-text-muted))] text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[hsl(var(--border))]">
            <span className="flex items-center gap-1.5 text-[hsl(var(--color-text-muted))] text-xs">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[hsl(var(--primary))] font-semibold text-xs group-hover:gap-2 transition-all duration-300">
              Read more
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default function InsightsPage() {
  const featuredArticle = insights.find(a => a.featured) || insights[0];
  const otherArticles = insights.filter(a => a.id !== featuredArticle.id);

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="pt-32 pb-12 sm:pt-36 sm:pb-16 bg-gradient-to-b from-[hsl(var(--bg-alt))] to-white">
        <div className="main-container">
          <AnimatedSection>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--primary))] transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            
            <div className="max-w-3xl">
              <div className="inline-block mb-4 px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-semibold">
                Knowledge Hub
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--color-text))] leading-tight mb-6">
                Insights
              </h1>
              
              <p className="text-lg sm:text-xl text-[hsl(var(--color-text-muted))] leading-relaxed">
                Real answers to real patient questions. Trusted knowledge from our experienced dental team—not generic content.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="main-container">
          <AnimatedSection>
            <FeaturedArticle article={featuredArticle} />
          </AnimatedSection>
        </div>
      </section>

      {/* All Articles Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-[hsl(var(--bg-alt))]">
        <div className="main-container">
          <AnimatedSection className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--color-text))]">
              More articles
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {otherArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-[hsl(var(--primary))]">
        <div className="main-container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Have a question we have not answered?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Reach out to us directly. We are happy to help you understand your dental health better.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--accent-foreground))] font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Contact us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
