// Insights data - centralized for reuse across components
// Can be replaced with CMS or database data in the future

export const insights = [
  {
    id: 1,
    slug: 'dental-implants-cost-pune',
    title: 'How much do dental implants cost in Pune?',
    excerpt: 'A transparent breakdown of implant pricing, what affects the cost, and why investing in quality matters for your long-term oral health.',
    category: 'Dental Implants',
    readTime: '5 min read',
    date: 'March 15, 2024',
    image: 'https://images.pexels.com/photos/6627566/pexels-photo-6627566.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    keywords: ['dental implants pune', 'implant cost', 'tooth replacement'],
  },
  {
    id: 2,
    slug: 'root-canal-pain-myths',
    title: 'Is root canal treatment painful?',
    excerpt: 'The truth about modern root canal procedures and why they are nothing like the horror stories you have heard.',
    category: 'Root Canal',
    readTime: '4 min read',
    date: 'March 10, 2024',
    image: 'https://images.pexels.com/photos/6502019/pexels-photo-6502019.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    keywords: ['root canal pain', 'rct treatment', 'painless dentistry'],
  },
  {
    id: 3,
    slug: 'best-dentist-kothrud-pune',
    title: 'How to find a good dentist in Kothrud',
    excerpt: 'What to look for when choosing a dentist, red flags to avoid, and questions you should always ask.',
    category: 'Dental Care',
    readTime: '3 min read',
    date: 'March 5, 2024',
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    keywords: ['dentist kothrud', 'best dentist pune', 'dental clinic'],
  },
  {
    id: 4,
    slug: 'teeth-whitening-safety',
    title: 'Is teeth whitening safe for your enamel?',
    excerpt: 'Understanding professional whitening versus at-home kits, and what dentists actually recommend.',
    category: 'Cosmetic',
    readTime: '4 min read',
    date: 'February 28, 2024',
    image: 'https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    keywords: ['teeth whitening', 'cosmetic dentistry', 'enamel safety'],
  },
  {
    id: 5,
    slug: 'dental-anxiety-tips',
    title: 'Afraid of the dentist? Here is how we help',
    excerpt: 'Practical strategies we use at Aesthedent to help anxious patients feel comfortable and in control.',
    category: 'Patient Care',
    readTime: '4 min read',
    date: 'February 20, 2024',
    image: 'https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    keywords: ['dental anxiety', 'fear of dentist', 'comfortable dentistry'],
  },
  {
    id: 6,
    slug: 'when-to-get-braces',
    title: 'When is the right time to get braces?',
    excerpt: 'Age considerations, treatment options, and what to expect from orthodontic treatment at different life stages.',
    category: 'Orthodontics',
    readTime: '5 min read',
    date: 'February 15, 2024',
    image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    keywords: ['braces', 'orthodontics', 'teeth alignment'],
  },
];

// Helper function to get featured insight
export function getFeaturedInsight() {
  return insights.find(insight => insight.featured) || insights[0];
}

// Helper function to get insights by category
export function getInsightsByCategory(category) {
  return insights.filter(insight => insight.category === category);
}

// Helper function to get related insights (excluding current)
export function getRelatedInsights(currentSlug, limit = 3) {
  return insights
    .filter(insight => insight.slug !== currentSlug)
    .slice(0, limit);
}

// Get all unique categories
export function getCategories() {
  return [...new Set(insights.map(insight => insight.category))];
}
