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
      description: 'The Gold Standard for tooth replacement. Permanent, natural-looking titanium roots that restore your smile and function.',
      icon: 'Smile',
    },
    {
      title: 'Full Mouth Rehabilitation',
      description: 'Comprehensive transformation for multiple missing or severely worn teeth, designed by prosthodontic experts.',
      icon: 'Crown',
    },
    {
      title: 'Painless Root Canal (RCT)',
      description: 'Preserve your natural tooth structure and eliminate infection with modern, comfortable root canal therapy.',
      icon: 'Shield',
    },
    {
      title: 'Braces & Clear Aligners',
      description: 'Achieve a healthy, perfectly aligned smile at any age with our discreet orthodontic solutions.',
      icon: 'Sparkles',
    },
    {
      title: 'Wisdom Tooth Surgery',
      description: 'Safe, manageable removal of impacted or painful wisdom teeth using advanced surgical techniques.',
      icon: 'Zap',
    },
    {
      title: 'Tooth Colored Fillings',
      description: 'Seamless, invisible restorations for cavities that bond directly to your tooth while preserving structure.',
      icon: 'Heart',
    },
  ],

  // Pricing section removed as per user request

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
      question: 'Why should I choose dental implants over dentures?',
      answer: 'Dental implants are fixed titanium roots that wont slip or fall out. They preserve your jawbone, maintain facial structure, and act exactly like natural teeth, unlike removable dentures.',
    },
    {
      question: 'Are dental implants or wisdom tooth surgery painful?',
      answer: 'With modern local anesthesia, you feel minimal discomfort during the procedure. Most patients report only mild pressure. Post-operative soreness is easily managed with prescribed medication.',
    },
    {
      question: 'How many sittings are required for a Root Canal (RCT)?',
      answer: 'Depending on the severity of infection, RCT may be completed in one or multiple sittings. Early intervention usually means a simpler, faster procedure.',
    },
    {
      question: 'Am I too old for Braces or Aligners?',
      answer: 'Not at all! Orthodontic treatment is suitable for teenagers, young professionals, and even patients in their 40s or beyond. Discreet options like clear aligners make it lifestyle-friendly.',
    },
    {
      question: 'Will my smile look natural after Full Mouth Rehabilitation?',
      answer: 'Absolutely. We place special emphasis on smile design, tooth proportions, and bite harmony so that your new smile is perfectly proportionate to your face.',
    },
    {
      question: 'How long do dental implants last?',
      answer: 'With proper care and regular follow-ups, dental implants can last 10–15 years or even a lifetime. They are a long-term investment in your health.',
    },
    {
      question: 'Why are tooth colored fillings better than silver ones?',
      answer: 'They match your natural tooth shade perfectly, bond more strongly to the structure, and are far more conservative of your original enamel.',
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
    mapsURL: 'https://www.google.com/maps/place/Aesthedent+Dental+Clinic,+Kothrud/@18.4972761,73.8108921,17z/data=!3m2!4b1!5s0x3bc2bfc407d2eb7d:0xeb43317068a295aa!4m6!3m5!1s0x3bc2bfa49403bd57:0xb59ec17e89bd289f!8m2!3d18.497271!4d73.813467!16s%2Fg%2F11j2v_ph1x?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D',
    directionsURL: 'https://www.google.com/maps/place/Aesthedent+Dental+Clinic,+Kothrud/@18.4972761,73.8108921,17z/data=!3m2!4b1!5s0x3bc2bfc407d2eb7d:0xeb43317068a295aa!4m6!3m5!1s0x3bc2bfa49403bd57:0xb59ec17e89bd289f!8m2!3d18.497271!4d73.813467!16s%2Fg%2F11j2v_ph1x?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D',
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
