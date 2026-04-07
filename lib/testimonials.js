// TESTIMONIALS DATA - Update monthly
// This file contains all testimonials for the website
// Simply update the data below and it will reflect across all pages

export const testimonialsData = {
  // Latest testimonials (update these monthly)
  latest: [
    {
      id: 1,
      name: 'Priya Mehta',
      service: 'Root Canal Treatment',
      rating: 5,
      image: 'https://images.pexels.com/photos/3756680/pexels-photo-3756680.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'I was terrified of dentists. Dr. Sahil changed everything. Not a pinch of pain during my root canal!',
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
      id: 1,
      name: 'Priya Mehta',
      service: 'Root Canal Treatment',
      rating: 5,
      image: 'https://images.pexels.com/photos/3756680/pexels-photo-3756680.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: 'I was terrified of dentists. Dr. Sahil changed everything. Not a pinch of pain during my root canal!',
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

// Helper function to get testimonials for a specific section
export const getTestimonials = (type = 'latest', limit = null) => {
  const testimonials = type === 'latest' ? testimonialsData.latest : testimonialsData.all;
  return limit ? testimonials.slice(0, limit) : testimonials;
};
