# Monthly Testimonials Update Guide

## Overview
All testimonials across the website are now centrally managed in a single file for easy monthly updates. Testimonials automatically appear on:
- **Home Page** (`/`) - #SmileStories section
- **Landing Page** (`/landing_page`) - #SmileStories section

## Where to Edit Testimonials

### File Location
`/lib/testimonials.js`

## How to Update Testimonials

### Monthly Update Process

1. **Open the testimonials file:**
   ```
   lib/testimonials.js
   ```

2. **Update the `latest` array** with your 3 most recent testimonials:
   ```javascript
   latest: [
     {
       id: 1,
       name: 'Patient Name',
       service: 'Service Type (e.g., Dental Implant, Root Canal Treatment)',
       rating: 5,  // Use 1-5 stars
       image: 'https://image-url.jpg',
       text: 'Patient testimonial text - keep it 1-2 sentences for compact display',
     },
     // ... add 2 more testimonials
   ],
   ```

3. **Add to the `all` array** to keep a permanent archive:
   - Keep all old testimonials in the `all` array
   - Add new testimonials to the top of the list

### Example Monthly Update

**January Update:**
```javascript
export const testimonialsData = {
  latest: [
    {
      id: 7,
      name: 'Deepak Singh',
      service: 'Prosthetic Implant',
      rating: 5,
      image: 'https://images.pexels.com/...',
      text: 'Outstanding service! My implant looks and feels completely natural.',
    },
    // ... 2 more new testimonials
  ],
  
  all: [
    // ... add the 3 new testimonials here too
    // ... followed by all existing testimonials (from old months)
  ],
};
```

## Testimonial Guidelines

### Best Practices
- **Length:** Keep reviews 1-2 short sentences (fits better on cards)
- **Authenticity:** Use real patient quotes (anonymized if needed)
- **Service Type:** Always specify the exact service (e.g., "Dental Implant", "Root Canal Treatment", "Kids Dentistry")
- **Rating:** Always use 5 stars for positive testimonials
- **Images:** Use professional patient photos or professional stock photos

### Service Types (for consistency)
- Dental Implant
- Prosthetic Implant
- Root Canal Treatment
- Kids Dentistry
- Teeth Whitening
- Orthodontics
- Gum Treatment
- Cosmetic Dentistry
- Full Mouth Restoration

## How It Works

### Automatic Display
- The `TestimonialsSection` component in `/components/sections/TestimonialsSection.js` automatically pulls from `lib/testimonials.js`
- Changing the testimonials file updates all pages instantly
- No need to modify page files or components

### Reusable Component
The `TestimonialsSection` component can be:
- **Compact variant** (current, 3 cards): Used on home page and landing page
- **Full variant** (if created): Can display all testimonials (6+)

## Component Usage

If you want to add testimonials to other pages:

```jsx
import TestimonialsSection from '@/components/sections/TestimonialsSection';

// In your page component:
<TestimonialsSection 
  title="#SmileStories"
  subtitle="Stories that drive us."
  limit={3}           // How many to show (3, 6, etc.)
  variant="compact"   // 'compact' or 'full'
/>
```

## Current Testimonials Count
- **Latest (displayed on pages):** 3 testimonials
- **Archive (all):** 6 testimonials (grows monthly)

## FAQ

**Q: Do I need to restart the server after updating testimonials?**
A: No, changes appear automatically. The file is read on every page load.

**Q: Can I display more than 3 testimonials on the home page?**
A: Yes, change the `limit` prop:
   - `limit={3}` → shows 3 cards
   - `limit={6}` → shows 6 cards

**Q: Should I delete old testimonials?**
A: No, keep them in the `all` array for archival purposes. Only update the `latest` array for monthly changes.

**Q: Can I change the service types?**
A: Yes, but be consistent. The service type appears below the patient name.

**Q: What image sizes work best?**
A: Square images (1:1 aspect ratio) work best. The cards display a 160px height on homepage.

## Support
If you have questions about formatting or need help updating testimonials, refer to the component file at:
`/components/sections/TestimonialsSection.js`
