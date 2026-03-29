import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
});

export const metadata = {
  title: 'Aesthedent Dental Clinic | Premium Dental Care in Kothrud, Pune',
  description: 'Experience painless, honest, and premium dental care at Aesthedent Dental Clinic, Kothrud, Pune. LGBTQ+ friendly, patient-first approach. Book your appointment today.',
  keywords: 'dental clinic pune, dentist kothrud, painless dentistry, dental implants pune, teeth cleaning pune',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} font-sans`}>
        {children}
      </body>
    </html>
  );
}
