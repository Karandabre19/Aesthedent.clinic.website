import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata = {
  title: 'Aesthedent Dental Clinic | Premium Dental Care in Kothrud, Pune',
  description:
    'Experience painless, honest, and premium dental care at Aesthedent Dental Clinic, Kothrud, Pune. LGBTQ+ friendly, patient-first approach. Book your appointment today.',
  keywords:
    'dental clinic pune, dentist kothrud, painless dentistry, dental implants pune, teeth cleaning pune',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {gtmId ? (
          <>
            {/* Google Tag Manager */}
            <Script
              id="gtm-init"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${gtmId}');
                `,
              }}
            />
            {/* End Google Tag Manager */}
          </>
        ) : null}
      </head>
      <body className={`${poppins.className} font-sans relative`}>
        {gtmId ? (
          <>
            {/* Google Tag Manager (noscript) */}
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
            {/* End Google Tag Manager (noscript) */}
          </>
        ) : null}
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
