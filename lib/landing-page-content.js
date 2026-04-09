/**
 * Landing Page Content - Prostodontics & Implants
 * Edit this file to update landing page content, pricing, testimonials, and FAQs
 * All content is organized by section for easy management
 */

export const landingPageContent = {
  // Problem Awareness Section - Speak to patient pain
  problemStatement: {
    title: 'Missing Teeth Stealing Your Confidence?',
    subtitle: 'You\'re not alone. Millions face this challenge daily.',
    problems: [
      {
        challenge: 'Missing teeth affect your smile',
        impact: 'Avoid smiling in photos, social situations, and professional meetings.',
      },
      {
        challenge: 'Chewing problems limit your diet',
        impact: 'Difficulty eating favorite foods. Restricted nutrition. Digestive issues.',
      },
      {
        challenge: 'Failed treatments leave you frustrated',
        impact: 'Dentures that slip. Bridges that fail. Teeth that keep breaking.',
      },
      {
        challenge: 'Bone loss ages your face',
        impact: 'Facial collapse, sagging appearance, looking older than you are.',
      },
    ],
    solution: 'Permanent dental implants and prosthetic solutions offer a lasting remedy.',
  },

  // Hero Section - SEO Optimized for local keywords
  hero: {
    headline: 'Dental Implants in Pune | Premium Prosthetic Solutions in Kothrud',
    subheadline: 'Prosthodontist-Led Implant & Full Mouth Rehabilitation',
    description: 'Missing teeth affecting your confidence? Aesthedent specializes in dental implants, full mouth rehabilitation, and advanced prosthetic solutions in Pune. Painless treatment. Natural results. Lifetime guarantee.',
    ctaText: 'Book Your Free Consultation',
    backgroundImage: 'https://images.pexels.com/photos/3762441/pexels-photo-3762441.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },

  // Trust Stats Section - Real numbers that build credibility
  trustStats: [
    { label: '500+', description: 'Implants Successfully Placed' },
    { label: '15+', description: 'Years Prosthodontic Excellence' },
    { label: '98%', description: 'Long-Term Success Rate' },
    { label: '24/7', description: 'Emergency Care Available' },
  ],

  // Unique Value Propositions - Why Aesthedent is different
  usp: [
    {
      title: 'Prosthodontist Expertise',
      description: 'Specialized prosthetic training with focus on complex cases, full mouth rehabilitation, and long-term treatment planning.',
    },
    {
      title: 'Painless, Advanced Technology',
      description: 'Latest anesthesia methods, 3D imaging, and computer-guided implant placement ensure comfort and precision.',
    },
    {
      title: 'Lifetime Warranty & Care',
      description: 'Comprehensive follow-up, free maintenance, and lifetime support for your implants and prosthetics.',
    },
  ],

  // Services Section - Problem + Solution Focus
  services: [
    {
      title: 'Dental Implants in Pune',
      description: 'Replace single or multiple missing teeth with permanent, natural-looking implants. Restore chewing ability and confidence.',
      icon: 'Smile',
    },
    {
      title: 'Full Mouth Rehabilitation',
      description: 'Complete smile restoration with implant-supported prosthetics. Ideal for patients with multiple missing teeth or failing dentitions.',
      icon: 'Crown',
    },
    {
      title: 'Implant-Supported Dentures',
      description: 'Secure, stable dentures anchored by implants. No sliding or discomfort. Better chewing and speaking.',
      icon: 'Shield',
    },
    {
      title: 'Crowns & Bridges',
      description: 'Fixed prosthetic solutions for damaged teeth. Natural appearance without the cost of implants.',
      icon: 'Sparkles',
    },
    {
      title: 'Tooth Replacement Solutions',
      description: 'From single tooth loss to complex cases. Custom treatment plans for your unique needs.',
      icon: 'Zap',
    },
    {
      title: 'Smile Transformation',
      description: 'Comprehensive aesthetic and functional improvements. Smile with confidence again.',
      icon: 'Heart',
    },
  ],

  // Pricing Section
  pricing: [
    {
      tier: 'Basic',
      price: '₹35,000',
      description: 'Single Tooth Implant',
      details: 'Includes crown and 1-year warranty',
      features: [
        'Titanium implant placement',
        'Custom prosthetic crown',
        '1-year warranty',
        'Standard abutment',
        'Basic checkups (6 months)',
      ],
      timeline: '4-6 months',
      timelineBreakdown: [
        { phase: 'Consultation & Planning', duration: '1 week' },
        { phase: 'Implant Placement', duration: '1 day' },
        { phase: 'Osseointegration (healing)', duration: '3-4 months' },
        { phase: 'Crown Placement', duration: '2-3 weeks' },
      ],
      cta: 'Choose Basic',
    },
    {
      tier: 'Premium',
      price: '₹55,000',
      description: 'Single Implant with Advanced Crown',
      details: 'Includes ceramic crown and 3-year warranty',
      features: [
        'Premium titanium implant',
        'All-ceramic prosthetic crown',
        '3-year comprehensive warranty',
        'Custom abutment design',
        'Quarterly professional cleanings (1 year)',
      ],
      timeline: '4-6 months',
      timelineBreakdown: [
        { phase: 'Advanced Consultation with 3D scan', duration: '2 weeks' },
        { phase: 'Implant Placement', duration: '1 day' },
        { phase: 'Guided Osseointegration', duration: '3-4 months' },
        { phase: 'Custom Crown Fabrication & Placement', duration: '3-4 weeks' },
      ],
      cta: 'Choose Premium',
      popular: true,
    },
    {
      tier: 'Elite',
      price: '₹75,000',
      description: 'Full Prosthetic Solution',
      details: 'Complete custom solution with lifetime care',
      features: [
        'Premium implant system',
        'Custom-designed prosthetic',
        'Lifetime warranty',
        'Gold-reinforced abutment',
        'Lifetime professional care & maintenance',
      ],
      timeline: '5-7 months',
      timelineBreakdown: [
        { phase: 'Comprehensive Consultation & Design', duration: '3 weeks' },
        { phase: 'Implant Placement', duration: '1 day' },
        { phase: 'Extended Osseointegration', duration: '4-5 months' },
        { phase: 'Premium Crown Creation & Fitting', duration: '4 weeks' },
      ],
      cta: 'Choose Elite',
    },
  ],

  // Implant Process Timeline
  processSteps: [
    {
      step: 1,
      title: 'Consultation & Assessment',
      description: 'Comprehensive examination, 3D imaging, and treatment planning.',
      duration: '1 week',
    },
    {
      step: 2,
      title: 'Implant Placement',
      description: 'Surgical placement of the titanium implant with local anesthesia.',
      duration: '1 day',
    },
    {
      step: 3,
      title: 'Osseointegration',
      description: 'The implant fuses with your jawbone. Monthly check-ups during this phase.',
      duration: '3-4 months',
    },
    {
      step: 4,
      title: 'Abutment Placement',
      description: 'Placement of the connector piece between implant and crown.',
      duration: '1-2 days',
    },
    {
      step: 5,
      title: 'Crown Fabrication',
      description: 'Custom prosthetic crown is designed and manufactured in our lab.',
      duration: '2-3 weeks',
    },
    {
      step: 6,
      title: 'Crown Placement',
      description: 'Final fitting and adjustment of your custom crown for perfect bite.',
      duration: '1-2 days',
    },
  ],

  // Benefits - Functional + Emotional
  benefits: {
    title: 'Transform Your Life with Dental Implants at Aesthedent',
    items: [
      {
        title: 'Smile with Confidence Again',
        description: 'Show your teeth freely in photos, presentations, and social gatherings. Reclaim your confidence.',
      },
      {
        title: 'Eat Your Favorite Foods',
        description: 'No dietary restrictions. Chew nuts, apples, steak, and chewy foods without worry. Enjoy full nutrition.',
      },
      {
        title: 'Permanent, Natural-Looking Solution',
        description: 'Implants look and feel like real teeth. No one will know they\'re prosthetic. Perfectly matched to your smile.',
      },
      {
        title: 'Preserve Your Jawbone',
        description: 'Implants stimulate bone growth, preventing facial collapse and premature aging. Maintain your facial structure.',
      },
      {
        title: 'Speak Without Slipping',
        description: 'Unlike dentures, implants never slip or affect speech clarity. Communicate naturally and confidently.',
      },
      {
        title: 'Investment in Long-Term Health',
        description: 'Implants last 25+ years with proper care. More cost-effective than repeated bridges or dentures over time.',
      },
      {
        title: 'Easy, Familiar Maintenance',
        description: 'Brush and floss like natural teeth. No special creams, adhesives, or complicated routines required.',
      },
      {
        title: 'Improved Overall Well-Being',
        description: 'Better nutrition, clearer speech, increased social engagement, and boosted mental health from restored confidence.',
      },
    ],
  },

  // Testimonials are now dynamically loaded from lib/testimonials.js
  // This allows monthly updates without changing this file

  // FAQs - SEO Optimized for Common Search Queries
  faqs: [
    {
      question: 'How much do dental implants cost in Pune?',
      answer: 'Dental implant costs in Pune range from ₹35,000 for a single tooth to ₹75,000+ for premium solutions. Our transparent pricing includes consultation, implant placement, and crown fabrication. Payment plans available. The cost varies based on bone quality, implant position, and crown material.',
    },
    {
      question: 'Are dental implants painful?',
      answer: 'No. We use advanced local anesthesia and sedation options. During the procedure, you feel no pain—only gentle pressure. Post-operative discomfort is minimal and managed with prescribed medication. Most patients return to normal activities within 3-5 days.',
    },
    {
      question: 'How long does a dental implant procedure take?',
      answer: 'The complete process takes 4-7 months: Consultation (1 week) → Implant placement (1 day) → Bone healing/osseointegration (3-4 months) → Crown placement (2-3 weeks). You\'ll have a functional tooth by month 5-6.',
    },
    {
      question: 'Who is eligible for dental implants?',
      answer: 'Most adults with good overall health are candidates. We assess bone density, gum health, and medical history. Diabetics, smokers, and those with limited bone can still get implants with proper planning or bone grafting. Age is not a barrier.',
    },
    {
      question: 'How long do dental implants last?',
      answer: 'With proper care, dental implants can last 25+ years or even a lifetime. The titanium implant rarely fails. The crown may need replacement after 10-15 years. Regular brushing, flossing, and annual check-ups ensure longevity.',
    },
    {
      question: 'What is full mouth rehabilitation?',
      answer: 'Full mouth rehabilitation restores your entire smile using implants, crowns, and prosthetics. Ideal for patients with multiple missing or failing teeth. We restore chewing ability, speech clarity, and facial appearance using advanced prosthodontic techniques.',
    },
    {
      question: 'Can I get dental implants if I have bone loss?',
      answer: 'Yes! We offer bone grafting procedures to rebuild jaw bone. This allows implant placement even in challenging cases with severe bone loss. The grafting adds 2-4 months to the overall timeline.',
    },
    {
      question: 'How do I care for dental implants?',
      answer: 'Care is simple—brush and floss like natural teeth. Avoid smoking and hard foods initially. Schedule check-ups every 6 months. No special maintenance required. Implants are easier to maintain than bridges or dentures.',
    },
  ],

  // Trust Badges
  badges: [
    'ICOI Certified',
    'ISO 9001 Certified',
    'LGBTQ+ Friendly Clinic',
    'Advanced Anesthesia Facilities',
  ],

  // Consequences Section - What happens if untreated
  consequences: {
    title: 'What Happens If Dental Problems Go Untreated?',
    subtitle: 'The hidden costs of delaying treatment',
    items: [
      {
        title: 'Accelerated Bone Loss',
        description: 'Missing teeth cause bone to resorb at 25% in the first year. Facial structure collapses, making you look older. Dentures become loose and unusable within months.',
        icon: 'AlertCircle',
      },
      {
        title: 'Rising Treatment Costs',
        description: 'Delaying implants means more bone loss, requiring expensive grafting procedures. Failed treatments lead to tooth loss, multiplying your expense over time.',
        icon: 'TrendingUp',
      },
      {
        title: 'Aesthetic Decline',
        description: 'Sagging face, collapsed jawline, wrinkles around lips. Missing teeth make you appear unhealthy and older than your actual age.',
        icon: 'Frown',
      },
      {
        title: 'Health Complications',
        description: 'Limited chewing affects digestion. Restricted diet leads to nutritional deficiencies. Speech clarity diminishes. Increased risk of gum disease.',
        icon: 'AlertTriangle',
      },
    ],
  },

  // Process/Timeline Section
  process: {
    title: 'Your Journey to a Perfect Smile',
    subtitle: 'Our Proven 4-Step Process',
    steps: [
      {
        number: 1,
        title: 'Free Consultation & Diagnosis',
        description: 'Meet with our prosthodontist. 3D imaging and bone assessment. Personalized treatment plan. No obligation.',
        timeline: '1 Week',
        icon: 'Calendar',
      },
      {
        number: 2,
        title: 'Implant Placement Surgery',
        description: 'Painless surgical placement using advanced anesthesia. Computer-guided precision. 1-2 hours procedure. Minimal downtime.',
        timeline: '1 Day',
        icon: 'Zap',
      },
      {
        number: 3,
        title: 'Healing & Osseointegration',
        description: 'Bone fuses with implant (3-4 months). We monitor healing with regular check-ups. Temporary restoration provided if needed.',
        timeline: '3-4 Months',
        icon: 'Heart',
      },
      {
        number: 4,
        title: 'Crown Placement & Recovery',
        description: 'Custom crown fabricated and fitted. Final adjustments for perfect bite. Complete functional tooth. Full recovery and results.',
        timeline: '2-3 Weeks',
        icon: 'Crown',
      },
    ],
  },

  // Results Section - Emotional and functional outcomes
  results: {
    title: 'The Aesthedent Difference: Real Results',
    subtitle: 'What patients experience after treatment',
    outcomes: [
      {
        title: 'Restored Confidence & Smile Freedom',
        description: 'Smile without hesitation in photos, meetings, and social events. Express yourself fully without self-consciousness.',
        category: 'Emotional',
      },
      {
        title: 'Full Chewing Ability Restored',
        description: 'Eat steaks, nuts, apples, and all your favorite foods again. No dietary restrictions. Enjoy meals without fear.',
        category: 'Functional',
      },
      {
        title: 'Natural Appearance That\'s Indistinguishable',
        description: 'Implants look, feel, and function like real teeth. Perfectly color-matched and shaped. No one will know they\'re prosthetic.',
        category: 'Aesthetic',
      },
      {
        title: 'Preserved Facial Structure & Youth',
        description: 'Bone stimulation prevents aging. Face maintains natural contours. You look like yourself, not older.',
        category: 'Health',
      },
      {
        title: 'Crystal Clear Speech Without Slipping',
        description: 'No denture slippage. Perfect pronunciation. Communicate confidently in professional and personal settings.',
        category: 'Functional',
      },
      {
        title: '25+ Years of Reliability',
        description: 'Permanent solution that lasts a lifetime. Less maintenance than dentures. Better long-term value compared to bridges.',
        category: 'Durability',
      },
    ],
  },

  // Contact Section with location info
  contactSection: {
    title: 'Visit Aesthedent Kothrud - Pune\'s Premier Dental Clinic',
    subtitle: 'Located in the heart of Kothrud, serving Pune and surrounding areas',
    fullAddress: 'No.5 First Floor, AJ Tower, above Irani Cafe, Dahanukar Colony, Kothrud, Pune, Maharashtra 411038, India',
    addressLine1: 'AJ Tower, Dahanukar Colony',
    addressLine2: 'Kothrud, Pune - 411038',
    mapsURL: 'https://maps.google.com/maps?q=aesthedent+kothrud+pune',
    directionsURL: 'https://www.google.com/maps/search/AJ+Tower+Dahanukar+Colony+Kothrud+Pune',
    services: [
      'Dental Implants in Kothrud',
      'Full Mouth Rehabilitation Pune',
      'Prosthetic Dentistry',
      'Emergency Dental Care',
    ],
    serviceArea: 'Serving Kothrud, Pune, and neighboring areas including Hinjewadi, Kalyani Nagar, Viman Nagar, and Western Pune regions.',
  },

  // CTA Section
  finalCTA: {
    headline: 'Ready to Restore Your Smile?',
    description: 'Don\'t let missing teeth limit your confidence. Schedule your free consultation with our prosthetic specialists today.',
    buttonText: 'Book Free Consultation',
  },
};
