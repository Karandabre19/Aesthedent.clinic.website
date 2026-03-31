'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Menu, X, Smile, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/doctor', label: 'Our Doctors' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const pathname = usePathname();

  const whatsappNumber = '919876543210';
  const whatsappMessage = encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const phoneNumber = '+919876543210';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
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
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-3' 
            : 'bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center">
            {/* Logo - Enhanced */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-xl group-hover:shadow-teal-500/40 transition-all duration-300">
                  <Smile className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl lg:text-[28px] font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
                  Aesthedent
                </span>
                <span className="text-[10px] lg:text-xs font-medium text-teal-600 tracking-[0.2em] uppercase -mt-0.5 hidden sm:block">
                  Dental Clinic
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation - Enhanced */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-5 py-3 group"
                >
                  <span className={`relative z-10 text-base font-semibold transition-colors duration-300 ${
                    pathname === link.href
                      ? 'text-teal-600'
                      : 'text-gray-700 group-hover:text-teal-600'
                  }`}>
                    {link.label}
                  </span>
                  
                  {/* Hover Background */}
                  <AnimatePresence>
                    {hoveredLink === link.href && pathname !== link.href && (
                      <motion.div
                        layoutId="nav-hover"
                        className="absolute inset-0 bg-teal-50 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Active Indicator */}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-gradient-to-r from-teal-50 to-teal-100/50 rounded-xl border border-teal-200/50"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Active Dot */}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Buttons - Enhanced */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-12 px-6 border-2 border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 font-semibold text-base rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  asChild
                >
                  <a href={`tel:${phoneNumber}`} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>Call Now</span>
                  </a>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg"
                  className="h-12 px-7 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-600 hover:from-teal-600 hover:via-teal-700 hover:to-teal-700 text-white font-semibold text-base rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-600/40 transition-all duration-300"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span>Book Appointment</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button - Enhanced */}
            <motion.button 
              className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-teal-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Premium Design */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[380px] bg-white z-50 lg:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                    <Smile className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900">Aesthedent</span>
                    <span className="text-xs font-medium text-teal-600 tracking-widest uppercase">Dental Clinic</span>
                  </div>
                </Link>
                <motion.button 
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Navigation</p>
                <div className="space-y-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 ${
                          pathname === link.href
                            ? 'bg-gradient-to-r from-teal-50 to-teal-100/50 text-teal-700 border border-teal-200/50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className={`w-5 h-5 transition-transform ${pathname === link.href ? 'text-teal-500' : 'text-gray-400'}`} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 to-transparent">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg rounded-2xl shadow-lg shadow-green-500/30 transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Book on WhatsApp
                  </a>
                  <a 
                    href={`tel:${phoneNumber}`}
                    className="flex items-center justify-center gap-3 w-full h-14 bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 font-semibold text-lg rounded-2xl transition-all duration-300"
                  >
                    <Phone className="w-5 h-5" />
                    Call: +91 98765 43210
                  </a>
                </motion.div>
                
                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500"
                >
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span>5.0 Rating • 263 Reviews</span>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
