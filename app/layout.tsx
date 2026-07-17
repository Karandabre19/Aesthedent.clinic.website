import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';
import MotionProvider from '@/components/layout/MotionProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// NOTE: the title/description wording below is PROVISIONAL. Phase 1 fixes the
// structure only (unique per route, canonical, correct card type). The keyword
// positioning decision — whether "Prosthodontist" should lead — is deliberately
// held until Phase 2 search-volume data lands, then rewritten in Phase 4A.
export const metadata = {
  metadataBase: new URL('https://www.aesthedentpune.com'),
  title: {
    default: 'Dental Clinic in Kothrud, Pune | Aesthedent',
    // Child routes supply just their own name; the brand is appended here so it
    // stays last, never first.
    template: '%s | Aesthedent',
  },
  description:
    'Aesthedent is a dental clinic in Kothrud, Pune offering implants, root canals and full mouth rehabilitation. We explain everything before we start.',
  // Deliberately NO `alternates.canonical` here. Child routes inherit root
  // metadata, so a canonical set at this level points every page at "/" and
  // asks Google to de-index the site. Each route declares its own.
  openGraph: {
    title: 'Dental Clinic in Kothrud, Pune | Aesthedent',
    description: 'Dental implants, root canals and full mouth rehabilitation in Kothrud, Pune. We explain everything before we start.',
    url: 'https://www.aesthedentpune.com',
    siteName: 'Aesthedent Dental Clinic',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental Clinic in Kothrud, Pune | Aesthedent',
    description: 'Dental implants, root canals and full mouth rehabilitation in Kothrud, Pune.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        
        {/* Google Tag Manager — deferred until after page is idle */}
        <Script
          id="gtm-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              function loadGTM(){
                (function(w,d,s,l,i){w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KJC8DRH9');
              }
              if('requestIdleCallback' in window){
                requestIdleCallback(loadGTM,{timeout:3500});
              } else {
                setTimeout(loadGTM,3500);
              }
            `,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Local SEO / Dentist Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dentist",
              "name": "Aesthedent Dental Clinic",
              "image": "https://www.aesthedentpune.com/aesthadent_logo.png",
              "@id": "https://www.aesthedentpune.com",
              "url": "https://www.aesthedentpune.com",
              "telephone": "+919309816336",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "No.5 First Floor, AJ Tower, above Irani Cafe, Dahanukar Colony, Kothrud",
                "addressLocality": "Pune",
                "addressRegion": "Maharashtra",
                "postalCode": "411038",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 18.497271,
                "longitude": 73.813467
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "10:00",
                "closes": "20:00"
              },
              "sameAs": [
                "https://maps.app.goo.gl/BVb9iy5EQkmbYSVPA"
              ]
            })
          }}
        />
      </head>
      <body className={`${poppins.className} font-sans relative`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KJC8DRH9"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <TooltipProvider>
          <MotionProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </MotionProvider>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
