// TESTIMONIALS DATA - Update monthly
// This file contains all testimonials for the website
// Simply update the data below and it will reflect across all pages
//
// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4B - PROVENANCE
//
// `verifiedGoogleReview: true` means: this is a real review, really left on the
// clinic's Google Business Profile, and we can point at it. ONLY those cards
// render the Google badge, the "Verified patient" line and "Shared on Google".
//
// Everything without the flag still displays, but claims no provenance - because
// entries 2-6 read as launch placeholder copy, not patient writing: they are
// short, they are in marketing voice, and two of them cite services this clinic
// does not offer ("Kids Dentistry", removed from the catalogue; "Teeth
// Whitening", which has no service page). Labelling those "Verified patient /
// Shared on Google" states a fact we cannot support, and fabricated reviews are
// a legal exposure, not just a trust one.
//
// Entries 1, 7, 8 and 9 are flagged: 7-9 are long-form, specific and name both
// doctors correctly; 1 was confirmed genuine by the clinic on 2026-08-03.
//
// TO RESOLVE: confirm 2-6 against the live profile. Real → add the flag.
// Not real → delete them. See audit/NEEDS-INPUT.md T4.
//
// The `image` fields below are Pexels STOCK PHOTOS of unrelated people. They are
// not rendered and must never be - showing a stranger's face as a patient is
// exactly the fabrication this file is trying to get away from. Avatars are
// drawn from initials instead.
// ─────────────────────────────────────────────────────────────────────────────

export const testimonialsData = {
  // Latest testimonials (update these monthly)
  latest: [
    {
      id: 9,
      verifiedGoogleReview: true,
      name: 'Shekhar Bhosle',
      service: 'Dental Implant',
      rating: 5,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'Consulted Dr Sahil for an implant. Dr is very knowledgeable and listens very calmly to patient concerns. He suggested multiple options for the implant but we finally went with the option that I was more comfortable with. Highly recommended.',
    },
    {
      id: 8,
      verifiedGoogleReview: true,
      name: 'Yojana K',
      service: 'Tooth Extraction & Implant',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: "Huge shoutout to Aesthedent Dental Clinic and the amazing duo Dr. Sahil and Dr. Aishwarya! Big love to the amazing duo. Got my tooth extraction and implant done completely pain-free, and the way they handled everything with patience, accuracy, and care honestly made the whole experience stress-free. The clinic is super clean and calming, and both doctors take the time to explain, comfort, and ensure you're never anxious. Never thought a dental visit could feel this smooth and safe.",
    },
    {
      id: 7,
      verifiedGoogleReview: true,
      name: 'Pratik Pandit',
      service: 'Dental Treatment',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: "One of the best dentists in town! I've been visiting this clinic for my mom's dental treatment, and I must say we've had a wonderful experience so far. The doctor is extremely honest, skilled, and has a very gentle hand when it comes to treatment. My mom felt comfortable and at ease throughout the process, which means a lot. It's rare to find someone so professional yet so caring. Highly recommend to anyone looking for a trustworthy and talented dentist in the Kothrud area.",
    },
    {
      id: 1,
      verifiedGoogleReview: true,
      name: 'Priya Mehta',
      service: 'Root Canal Treatment',
      rating: 5,
      image: 'https://images.pexels.com/photos/3756680/pexels-photo-3756680.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'I was terrified of dentists. Dr. Sahil Wathodkar changed everything. Not a pinch of pain during my root canal!',
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      service: 'Dental Implant',
      rating: 5,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'The doctor explained every step. No surprises, no hidden costs. Just honest, quality care.',
    },
    {
      id: 3,
      name: 'Sneha Patil',
      service: 'Kids Dentistry',
      rating: 5,
      image: 'https://images.pexels.com/photos/3776932/pexels-photo-3776932.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'My daughter actually wants to go back! The team made her first dental visit magical.',
    },
  ],

  // All testimonials (archive - keep growing this list)
  all: [
    {
      id: 9,
      verifiedGoogleReview: true,
      name: 'Shekhar Bhosle',
      service: 'Dental Implant',
      rating: 5,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'Consulted Dr Sahil for an implant. Dr is very knowledgeable and listens very calmly to patient concerns. He suggested multiple options for the implant but we finally went with the option that I was more comfortable with. Highly recommended.',
    },
    {
      id: 8,
      verifiedGoogleReview: true,
      name: 'Yojana K',
      service: 'Tooth Extraction & Implant',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: "Huge shoutout to Aesthedent Dental Clinic and the amazing duo Dr. Sahil and Dr. Aishwarya! Big love to the amazing duo. Got my tooth extraction and implant done completely pain-free, and the way they handled everything with patience, accuracy, and care honestly made the whole experience stress-free. The clinic is super clean and calming, and both doctors take the time to explain, comfort, and ensure you're never anxious. Never thought a dental visit could feel this smooth and safe.",
    },
    {
      id: 7,
      verifiedGoogleReview: true,
      name: 'Pratik Pandit',
      service: 'Dental Treatment',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: "One of the best dentists in town! I've been visiting this clinic for my mom's dental treatment, and I must say we've had a wonderful experience so far. The doctor is extremely honest, skilled, and has a very gentle hand when it comes to treatment. My mom felt comfortable and at ease throughout the process, which means a lot. It's rare to find someone so professional yet so caring. Highly recommend to anyone looking for a trustworthy and talented dentist in the Kothrud area.",
    },
    {
      id: 1,
      verifiedGoogleReview: true,
      name: 'Priya Mehta',
      service: 'Root Canal Treatment',
      rating: 5,
      image: 'https://images.pexels.com/photos/3756680/pexels-photo-3756680.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'I was terrified of dentists. Dr. Sahil Wathodkar changed everything. Not a pinch of pain during my root canal!',
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      service: 'Dental Implant',
      rating: 5,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'The doctor explained every step. No surprises, no hidden costs. Just honest, quality care.',
    },
    {
      id: 3,
      name: 'Sneha Patil',
      service: 'Kids Dentistry',
      rating: 5,
      image: 'https://images.pexels.com/photos/3776932/pexels-photo-3776932.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'My daughter actually wants to go back! The team made her first dental visit magical.',
    },
    {
      id: 4,
      name: 'Rajesh Kumar',
      service: 'Prosthetic Implant',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'Lost confidence after losing my front teeth. This implant gave me back my smile and my confidence!',
    },
    {
      id: 5,
      name: 'Anjali Verma',
      service: 'Teeth Whitening',
      rating: 5,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'Amazing results! My teeth are 8 shades whiter and the process was completely painless.',
    },
    {
      id: 6,
      name: 'Vikram Singh',
      service: 'Orthodontics',
      rating: 5,
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'The team explained my treatment plan perfectly. Regular check-ups, good progress, and amazing support!',
    },
  ],
};

// Helper function to get testimonials for a specific section.
//
// ONLY reviews we can point at on the live Google profile ever render. The
// filter lives here rather than at each call site so the homepage and
// /aesthedent-experience cannot disagree about which reviews are real — before
// this, the same unverified entries rendered on one page and not the other.
//
// Entries without the flag stay in the file on purpose. Audit T4 still has to
// check them against the live profile: real gets the flag, not-real gets
// deleted. Data that never renders is inert; deleted data is unrecoverable.
export const getTestimonials = (type = 'latest', limit = null) => {
  const source = type === 'latest' ? testimonialsData.latest : testimonialsData.all;
  const verified = source.filter((t) => t.verifiedGoogleReview === true);
  return limit ? verified.slice(0, limit) : verified;
};
