'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/doctor', label: 'Doctors' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const whatsappNumber = '919876543210';
  const whatsappMessage = encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const phoneNumber = '+919876543210';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg shadow-black/5' 
            : 'bg-white'
        }`}
      >
        <div className="main-container">
          <div className="flex items-center justify-between h-[64px] lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/aesthadent_logo.png" 
                alt="Aesthedent Logo" 
                className="h-12 lg:h-14 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation - Only show on xl screens and up */}
            <nav className="hidden xl:flex items-center">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 text-[15px] font-medium rounded-lg transition-colors whitespace-nowrap ${
                        pathname === link.href
                          ? 'text-teal-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-4 right-4 h-0.5 bg-teal-600 rounded-full"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop CTA Buttons - Only show on xl screens */}
            <div className="hidden xl:flex items-center gap-3">
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-2 px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
              
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-[15px] font-medium rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Appointment</span>
              </a>
            </div>

            {/* Tablet & Mobile - CTA + Menu Button */}
            <div className="flex xl:hidden items-center gap-2">
              {/* Show Book button on tablet only */}
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Now</span>
              </a>
              
              {/* Menu Button */}
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile & Tablet Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[320px] bg-white z-50 xl:hidden shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between h-[64px] px-5 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <circle cx="9" cy="9" r="1" fill="currentColor" />
                      <circle cx="15" cy="9" r="1" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Aesthedent</span>
                </Link>
                <button 
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="p-5">
                <ul className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors ${
                          pathname === link.href
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                        <ChevronRight className={`w-4 h-4 ${pathname === link.href ? 'text-teal-500' : 'text-gray-400'}`} />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Mobile CTAs */}
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-gray-50">
                <div className="space-y-3">
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-[15px] font-medium rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Book on WhatsApp
                  </a>
                  <a 
                    href={`tel:${phoneNumber}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[15px] font-medium rounded-xl transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
