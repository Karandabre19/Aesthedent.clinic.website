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
// The current `latest` list is transcribed from the clinic's Google Business
// Profile on 2026-08-09. Keep only reviews that the clinic has verified there.
//
// Reviewer avatars are drawn from initials. Add a real patient photo only when
// the patient has provided permission for the clinic to use it.
// ─────────────────────────────────────────────────────────────────────────────

export const testimonialsData = {
  // Latest testimonials (update these monthly)
  latest: [
    {
      id: 15,
      verifiedGoogleReview: true,
      name: 'Siddhi Kulkarni',
      service: 'Wisdom Tooth Extraction',
      rating: 5,
      text: 'Received excellent treatment at the Aesthedent Dental Clinic. We had to get wisdom tooth extracted, which was quite a complicated procedure due to the tooth placement and shape. Both Dr Aishwarya and Dr Sahil were very helpful and swift.',
    },
    {
      id: 14,
      verifiedGoogleReview: true,
      name: 'Synergies Unlimited Forum',
      service: 'Patient Experience',
      rating: 5,
      text: 'Wonderful experience.',
    },
    {
      id: 13,
      verifiedGoogleReview: true,
      name: 'Deeksha Rajput',
      service: 'Toothache Consultation',
      rating: 5,
      text: 'I visited his clinic for a toothache, and I had a great experience. He guided me very well throughout the entire process and made me feel comfortable at every step.',
    },
    {
      id: 12,
      verifiedGoogleReview: true,
      name: 'Dilip Kolte',
      service: 'Dental Treatment',
      rating: 5,
      text: 'Overall it was good experience. Job was done very meticulously & aesthetically.',
    },
    {
      id: 11,
      verifiedGoogleReview: true,
      name: 'Avadhoot Gandhe',
      service: 'Patient Experience',
      rating: 5,
      text: 'Very nice.',
    },
    {
      id: 10,
      verifiedGoogleReview: true,
      name: 'Prasanna Chellappan',
      service: 'Root Canal Treatment',
      rating: 5,
      text: 'I have done my root canal treat and the way both the doctors performed their duty was perfect and appreiatable. I recommend all with tooth issues please visit this place. You can have a pain free treatment here.',
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
      text: 'Consulted Dr Sahil for an implant. Dr is very knowledgeable and listens very calmly to patient concerns. He suggested multiple options for the implant but we finally went with the option that I was more comfortable with. Highly recommended.',
    },
    {
      id: 8,
      verifiedGoogleReview: true,
      name: 'Yojana K',
      service: 'Tooth Extraction & Implant',
      rating: 5,
      text: "Huge shoutout to Aesthedent Dental Clinic and the amazing duo Dr. Sahil and Dr. Aishwarya! Big love to the amazing duo. Got my tooth extraction and implant done completely pain-free, and the way they handled everything with patience, accuracy, and care honestly made the whole experience stress-free. The clinic is super clean and calming, and both doctors take the time to explain, comfort, and ensure you're never anxious. Never thought a dental visit could feel this smooth and safe.",
    },
    {
      id: 7,
      verifiedGoogleReview: true,
      name: 'Pratik Pandit',
      service: 'Dental Treatment',
      rating: 5,
      text: "One of the best dentists in town! I've been visiting this clinic for my mom's dental treatment, and I must say we've had a wonderful experience so far. The doctor is extremely honest, skilled, and has a very gentle hand when it comes to treatment. My mom felt comfortable and at ease throughout the process, which means a lot. It's rare to find someone so professional yet so caring. Highly recommend to anyone looking for a trustworthy and talented dentist in the Kothrud area.",
    },
    {
      id: 1,
      verifiedGoogleReview: true,
      name: 'Priya Mehta',
      service: 'Root Canal Treatment',
      rating: 5,
      text: 'I was terrified of dentists. Dr. Sahil Wathodkar changed everything. Not a pinch of pain during my root canal!',
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      service: 'Dental Implant',
      rating: 5,
      text: 'The doctor explained every step. No surprises, no hidden costs. Just honest, quality care.',
    },
    {
      id: 3,
      name: 'Sneha Patil',
      service: 'Kids Dentistry',
      rating: 5,
      text: 'My daughter actually wants to go back! The team made her first dental visit magical.',
    },
    {
      id: 4,
      name: 'Rajesh Kumar',
      service: 'Prosthetic Implant',
      rating: 5,
      text: 'Lost confidence after losing my front teeth. This implant gave me back my smile and my confidence!',
    },
    {
      id: 5,
      name: 'Anjali Verma',
      service: 'Teeth Whitening',
      rating: 5,
      text: 'Amazing results! My teeth are 8 shades whiter and the process was completely painless.',
    },
    {
      id: 6,
      name: 'Vikram Singh',
      service: 'Orthodontics',
      rating: 5,
      text: 'The team explained my treatment plan perfectly. Regular check-ups, good progress, and amazing support!',
    },
  ],
};

// Helper function to get testimonials for a specific section.
//
// ONLY reviews we can point at on the live Google profile ever render. The
// filter lives here rather than at each call site so the homepage and
// /aesthedent-experience cannot disagree about which reviews are real -before
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
