/**
 * Landing Page Content - Prostodontics & Implants
 * Edit this file to update landing page content, pricing, testimonials, and FAQs
 * All content is organized by section for easy management
 */

export const landingPageContent = {
  // Hero Section
  hero: {
    headline: 'Premium Dental Implants & Prosthetic Solutions',
    subheadline: 'Restore Your Smile with Advanced Prostodontic Expertise',
    description: 'At Aesthedent, we specialize in sophisticated prosthetic solutions and implant dentistry. Experience painless treatment with natural-looking results that last a lifetime.',
    ctaText: 'Book Your Free Consultation',
    backgroundImage: 'https://images.pexels.com/photos/3762441/pexels-photo-3762441.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },

  // Trust Stats Section
  trustStats: [
    { label: '500+', description: 'Successful Implants Placed' },
    { label: '15+', description: 'Years of Experience' },
    { label: '98%', description: 'Patient Satisfaction Rate' },
    { label: '24/7', description: 'Emergency Support' },
  ],

  // Unique Value Propositions
  usp: [
    {
      title: 'Advanced Prosthetic Design',
      description: 'Custom-designed prosthetic solutions tailored to your facial anatomy and aesthetic goals.',
    },
    {
      title: 'Painless Treatment',
      description: 'State-of-the-art anesthesia and gentle techniques ensure a completely comfortable experience.',
    },
    {
      title: 'Lifetime Care',
      description: 'Comprehensive follow-up care and maintenance support for your implants and prosthetics.',
    },
  ],

  // Services Section
  services: [
    {
      title: 'Single Tooth Implants',
      description: 'Replace a single missing tooth with a permanent, natural-looking implant solution.',
      icon: 'Smile',
    },
    {
      title: 'Multiple Tooth Implants',
      description: 'Restore several missing teeth with strategically placed implants.',
      icon: 'Crown',
    },
    {
      title: 'Full Mouth Reconstruction',
      description: 'Complete smile restoration with full-arch prosthetics and implants.',
      icon: 'Sparkles',
    },
    {
      title: 'Implant-Supported Dentures',
      description: 'Stable, secure dentures anchored by dental implants for maximum comfort.',
      icon: 'Shield',
    },
    {
      title: 'Dental Bridges',
      description: 'Fixed prosthetic bridges to span gaps and restore your smile.',
      icon: 'Zap',
    },
    {
      title: 'Cosmetic Prosthetics',
      description: 'Aesthetic prosthetic solutions for optimal appearance and function.',
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

  // Benefits
  benefits: {
    title: 'Why Choose Dental Implants at Aesthedent?',
    items: [
      {
        title: 'Permanent Solution',
        description: 'Implants can last a lifetime with proper care and maintenance.',
      },
      {
        title: 'Natural Appearance',
        description: 'Custom-designed crowns match your natural teeth perfectly.',
      },
      {
        title: 'Improved Oral Function',
        description: 'Eat, speak, and smile with confidence like you never had teeth missing.',
      },
      {
        title: 'Jawbone Preservation',
        description: 'Implants stimulate bone growth and prevent facial collapse.',
      },
      {
        title: 'Easy Maintenance',
        description: 'Brush and floss like natural teeth. No special care required.',
      },
      {
        title: 'Long-term Value',
        description: 'Cost-effective solution compared to bridges or dentures over time.',
      },
    ],
  },

  // Testimonials are now dynamically loaded from lib/testimonials.js
  // This allows monthly updates without changing this file

  // FAQs
  faqs: [
    {
      question: 'How long do dental implants last?',
      answer: 'With proper care and regular check-ups, dental implants can last a lifetime. The prosthetic crown may need replacement after 10-15 years.',
    },
    {
      question: 'Is the implant procedure painful?',
      answer: 'We use advanced anesthesia and sedation options to ensure you feel no pain during the procedure. Most patients report minimal discomfort afterward.',
    },
    {
      question: 'What is the total timeline for getting an implant?',
      answer: 'The complete process typically takes 4-7 months depending on your healing capacity and the complexity of your case. This includes consultation, implant placement, healing, and crown placement.',
    },
    {
      question: 'Am I a good candidate for implants?',
      answer: 'Most adults with good oral health are candidates. We assess bone density, overall health, and dental history. Bone grafting options are available if needed.',
    },
    {
      question: 'How much do dental implants cost?',
      answer: 'Costs range from ₹35,000 to ₹75,000+ depending on the complexity, materials used, and additional procedures needed. We offer transparent pricing and flexible payment options.',
    },
    {
      question: 'How do I care for my implant?',
      answer: 'Care is simple - brush and floss like natural teeth. Avoid smoking and hard foods initially. Regular dental check-ups (every 6 months) are recommended.',
    },
    {
      question: 'Can I get multiple implants?',
      answer: 'Yes! We can place multiple implants to replace several missing teeth or even provide full-mouth restoration with implant-supported prosthetics.',
    },
    {
      question: 'What if I have limited bone?',
      answer: 'We offer bone grafting procedures to increase bone height and width, allowing implant placement even in challenging cases.',
    },
  ],

  // Trust Badges
  badges: [
    'ICOI Certified',
    'ISO 9001 Certified',
    'LGBTQ+ Friendly Clinic',
    'Advanced Anesthesia Facilities',
  ],

  // CTA Section
  finalCTA: {
    headline: 'Ready to Restore Your Smile?',
    description: 'Don\'t let missing teeth limit your confidence. Schedule your free consultation with our prosthetic specialists today.',
    buttonText: 'Book Free Consultation',
  },
};
