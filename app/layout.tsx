import { DraftNotice } from '@/components/layout/DraftNotice';
import { getRootSeoMetadata } from '@/sanity/lib/seo';
import { getNavigation } from '@/sanity/lib/navigation';
import { NavigationProvider } from '@/components/layout/NavigationProvider';
import { ClinicAvailabilityProvider } from '@/components/layout/ClinicAvailabilityProvider';
import { getClinicAvailability } from '@/sanity/lib/availability';
import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';
import MotionProvider from '@/components/layout/MotionProvider';
import JsonLd from '@/components/seo/JsonLd';
import { buildClinicSchema, buildOrganizationSchema, buildWebSiteSchema } from '@/lib/schema';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Phase 4A. The old title led with "Specialist Prosthodontist" and ran to 89
// chars. Phase 2 settled the positioning question the brief flagged: of the
// eight independents ranking #2-#8 for "dentist in kothrud", NOT ONE leads with
// "prosthodontist", and every competitor uses [Service] in [Location] with the
// location in 74-100% of titles (audit/02-competitor-content.md). Prosthodontics
// is now the reason to choose us, carried in the description - not the label.
//
// Note what we did NOT copy: Silver Pearls' "Best Dentist in Kothrud | Best
// Dental Clinic in Kothrud, Pune" repeats the term and ranks #8 - the LOWEST
// independent in the top 8. The location token is what works; the stuffing isn't.
export async function generateMetadata() { return getRootSeoMetadata(); }

export default async function RootLayout({ children }: { children: ReactNode }) {
  const availability = await getClinicAvailability();
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        
        {/* Google Tag Manager - deferred until after page is idle */}
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

        {/* Local SEO - Dentist + LocalBusiness, Organization, WebSite.
            Sitewide entities live here; page-specific blocks (FAQPage,
            MedicalProcedure, BreadcrumbList) are emitted per route.
            See lib/schema.js for what is included and what is deliberately not. */}
        <JsonLd
          schema={[buildClinicSchema({ availability }), buildOrganizationSchema(), buildWebSiteSchema()]}
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
            <ClinicAvailabilityProvider value={availability}><NavigationProvider value={await getNavigation()}><SmoothScrollProvider>{children}</SmoothScrollProvider></NavigationProvider></ClinicAvailabilityProvider>
          </MotionProvider>
        </TooltipProvider>
        <DraftNotice />
        <Toaster />
      </body>
    </html>
  );
}
