// Insights data - centralized for reuse across components
// Can be replaced with CMS or database data in the future

export const insights = [
  {
    id: 1,
    slug: 'dental-implants-pune-specialist',
    // COLLISION C2 - this article, /services/dental-implants and /doctor were
    // all chasing "prosthodontist" + "dental implants pune". Split by intent:
    //   /doctor                    → prosthodontist kothrud  (WHO)
    //   /services/dental-implants  → dental implant kothrud  (WHAT / cost)
    //   this article               → prosthodontist vs dentist (WHY)
    // The comparison framing is what keeps it off the other two terms, and the
    // location token is deliberately absent so it cannot compete with /doctor.
    title: 'Prosthodontist or general dentist for your dental implants?',
    // The headline above reads well on the page but is too long for a <title>
    // once the brand is appended. metaTitle is an optional shorter form used for
    // <title> only; omit it and the title is used.
    metaTitle: 'Prosthodontist vs Dentist for Implants',
    excerpt: 'What a prosthodontist does that a general dentist does not, and why it changes the outcome of an implant.',
    category: 'Dental Implants',
    readTime: '5 min read',
    date: 'March 15, 2024',
    image: 'https://images.pexels.com/photos/6627566/pexels-photo-6627566.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    keywords: ['prosthodontist vs dentist', 'who should place dental implants', 'implant planning'],
  },
  {
    id: 2,
    slug: 'root-canal-pain-myths',
    // COLLISION C4 - the service page's own shortDesc advertised "painless RCT",
    // putting it on the same term as this article (and re-opening the absolute
    // pain claim that N6/N7/N8 closed). The pain conversation lives here now;
    // /services/root-canal keeps the clinical scope. Service shortDesc reworded
    // in lib/services.js as part of the same fix.
    title: 'Is a root canal painful?',
    excerpt: 'What a root canal actually feels like now, why the reputation is decades out of date, and what we do for anxious patients.',
    category: 'Root Canal',
    readTime: '4 min read',
    date: 'March 10, 2024',
    image: 'https://images.pexels.com/photos/6502019/pexels-photo-6502019.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    keywords: ['is a root canal painful', 'root canal recovery', 'dental anxiety'],
  },
  {
    id: 3,
    slug: 'best-dentist-kothrud-pune',
    // COLLISION C1 (audit/01-content-spine.md §1.2) - the worst on the site.
    // "How to find a good dentist in Kothrud" aimed an informational article
    // straight at the homepage's #1 money term, and the slug bakes it in. The
    // slug stays (hard rule: never rename a URL). The head term moves from
    // "dentist in kothrud" to "how to choose a dentist", which is the intent the
    // article actually serves, and it now funnels to the money pages instead of
    // competing with them.
    title: 'How to Choose a Dentist in Kothrud',
    excerpt: 'What to look for when choosing a dentist, the questions worth asking, and the answers that should make you walk away.',
    category: 'Dental Care',
    readTime: '3 min read',
    date: 'March 5, 2024',
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    keywords: ['how to choose a dentist', 'questions to ask a dentist', 'dental qualifications'],
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
    // COLLISION C3 - kept off "braces kothrud", which /services/orthodontic-
    // treatment owns. This article is about TIMING and age; no location token in
    // the title or H1, and it funnels to the service page.
    title: 'When is the right time for braces?',
    excerpt: 'Age, timing and what to expect from orthodontic treatment at different life stages - for children, teenagers and adults.',
    category: 'Orthodontics',
    readTime: '5 min read',
    date: 'February 15, 2024',
    image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    keywords: ['when to get braces', 'braces age', 'adult orthodontics'],
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
