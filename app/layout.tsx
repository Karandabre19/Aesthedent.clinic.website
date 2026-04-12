import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata = {
  title: 'Aesthedent Dental Clinic | Honest, Clear Dental Care in Kothrud, Pune',
  description:
    'Experience calm, clear, and honest dental care at Aesthedent Clinic in Kothrud, Pune. We take the fear out of dentistry with transparent pricing and gentle treatments.',
  keywords:
    'dental clinic pune, dentist kothrud, painless dentistry, dental implants pune, teeth cleaning pune',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KJC8DRH9');
            `,
          }}
        />
        {/* End Google Tag Manager */}
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
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
