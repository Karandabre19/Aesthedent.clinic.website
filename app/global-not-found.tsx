import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import NotFound from './not-found';
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  title: '404 – Page Not Found | Aesthedent',
  robots: { index: false, follow: true },
};

// Unknown URLs bypass the CMS-backed root layout entirely.
export default function GlobalNotFound() {
  return <html lang="en" className={poppins.variable}><body className={poppins.className}><NotFound /></body></html>;
}
