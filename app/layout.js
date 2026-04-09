import './globals.css';
import { Poppins } from 'next/font/google';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
});

export const metadata = {
  title: 'Aesthedent Dental Clinic | Premium Dental Care in Kothrud, Pune',
  description: 'Experience painless, honest, and premium dental care at Aesthedent Dental Clinic, Kothrud, Pune. LGBTQ+ friendly, patient-first approach. Book your appointment today.',
  keywords: 'dental clinic pune, dentist kothrud, painless dentistry, dental implants pune, teeth cleaning pune',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <style>{`
          html, body { 
            margin: 0; 
            padding: 0; 
            min-height: 100%; 
            background: #ffffff;
          }
          body { 
            font-family: system-ui, -apple-system, sans-serif;
            color: #222;
          }
        `}</style>
      </head>
      <body className={`${poppins.className} font-sans bg-[hsl(var(--background))] text-[hsl(var(--foreground))]`}>
        <div id="__next" style={{ minHeight: '100vh' }}>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </div>
      </body>
    </html>
  );
}
