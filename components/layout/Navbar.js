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
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';
  const phoneNumber = '+919309816336';

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
            ? 'bg-[hsl(var(--background))] shadow-2xl shadow-black/10' 
            : 'bg-[hsl(var(--background))]'
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
                          ? 'text-[hsl(var(--color-primary))]'
                          : 'text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-bg-alt))]'
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-4 right-4 h-0.5 bg-[hsl(var(--color-primary))] rounded-full"
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
                className="flex items-center gap-2 px-4 py-2 text-[15px] font-medium text-[hsl(var(--color-text))] hover:text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-bg-alt))] rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
              
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] text-[hsl(var(--primary-foreground))] text-[15px] font-medium rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Appointment</span>
              </a>
            </div>

            {/* Tablet & Mobile - CTA + Menu Button */}
            <div className="flex xl:hidden items-center gap-2 sm:gap-3">
              {/* Show Book button on tablet only */}
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] text-[hsl(var(--primary-foreground))] text-sm font-medium rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Now</span>
              </a>
              
              {/* Menu Button - Always Visible */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-[hsl(var(--accent))]/10 transition-all duration-200 active:scale-95"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                role="button"
                tabIndex="0"
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 sm:w-7 sm:h-7 text-[hsl(var(--accent))]" strokeWidth={2.5} />
                  ) : (
                    <Menu className="w-6 h-6 sm:w-7 sm:h-7 text-[hsl(var(--color-text))]" strokeWidth={2.5} />
                  )}
                </motion.div>
              </motion.button>
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
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[320px] bg-[hsl(var(--background))] z-50 xl:hidden shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between h-[64px] px-5 border-b border-[hsl(var(--color-border))]">
                <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <img 
                    src="/aesthadent_logo.png" 
                    alt="Aesthedent Logo"
                    className="h-12 w-auto object-contain"
                  />
                </Link>
                <button 
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[hsl(var(--color-bg-alt))]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
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
                            ? 'bg-[hsl(var(--color-primary-light))] text-[hsl(var(--color-primary))]'
                            : 'text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-bg-alt))]'
                        }`}
                      >
                        {link.label}
                        <ChevronRight className={`w-4 h-4 ${pathname === link.href ? 'text-[hsl(var(--color-primary))]' : 'text-[hsl(var(--color-text-muted))]'}`} />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Mobile CTAs */}
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg-alt))]">
                <div className="space-y-3">
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] text-[hsl(var(--primary-foreground))] text-[15px] font-medium rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Book on WhatsApp
                  </a>
                  <a 
                    href={`tel:${phoneNumber}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[hsl(var(--background))] border border-[hsl(var(--color-border))] text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-bg-alt))] text-[15px] font-medium rounded-xl transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +91 93098 16336
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
