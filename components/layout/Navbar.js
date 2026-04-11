'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { 
    label: 'Treatments', 
    subLinks: [
      { href: '/services', label: 'View All Treatments' },
      { href: '/services/dental-implants', label: 'Dental Implants' },
      { href: '/services/tooth-extraction', label: 'Tooth Extraction' },
      { href: '/services/cleaning-polishing', label: 'Cleaning & Polishing' },
      { href: '/services/kids-dentistry', label: 'Kids Dentistry' },
      { href: '/services/root-canal', label: 'Root Canal Treatment' },
      { href: '/services/teeth-whitening', label: 'Teeth Whitening' },
    ]
  },
  { href: '/doctor', label: 'Our Teams' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// Magnetic button effect component
function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * 0.15;
    const distY = (e.clientY - centerY) * 0.15;
    x.set(distX);
    y.set(distY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Navigation link with stable active state (no layoutId to prevent scroll animation issues)
function NavLink({ href, label, isActive }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-3 py-2 group"
    >
      {/* Active pill background - static, no layoutId */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ease-out ${
          isActive 
            ? 'bg-[hsl(var(--color-primary))]/10 border border-[hsl(var(--color-primary))]/20 opacity-100 scale-100' 
            : 'bg-transparent border border-transparent opacity-0 scale-95'
        }`}
      />
      
      {/* Hover background - only shows when not active */}
      <div
        className={`absolute inset-0 rounded-full bg-[hsl(var(--color-bg-alt))] transition-all duration-200 ease-out ${
          !isActive && isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
      
      {/* Text label */}
      <span 
        className={`relative z-10 text-sm font-medium transition-colors duration-200 ${
          isActive 
            ? 'text-[hsl(var(--color-primary))]' 
            : 'text-[hsl(var(--color-text-muted))] group-hover:text-[hsl(var(--color-text))]'
        }`}
      >
        {label}
      </span>
      
      {/* Active underline indicator - static position */}
      <div
        className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--accent))] rounded-full transition-all duration-300 ease-out ${
          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      />
      
      {/* Hover underline - only shows when not active */}
      <div
        className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] bg-[hsl(var(--color-text-muted))]/40 rounded-full transition-all duration-200 ease-out ${
          !isActive && isHovered ? 'w-5 opacity-100' : 'w-0 opacity-0'
        }`}
      />
    </Link>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';
  const phoneNumber = '+919309816336';

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
        animate={{ 
          y: scrollDirection === 'down' && isScrolled && !mobileMenuOpen ? -100 : 0 
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[hsl(var(--background))]/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-[hsl(var(--border))]/50' 
            : 'bg-[hsl(var(--background))]'
        }`}
      >
        {/* Premium top accent line */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--color-primary))] to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ 
            scaleX: isScrolled ? 1 : 0, 
            opacity: isScrolled ? 0.6 : 0 
          }}
          transition={{ duration: 0.5 }}
        />
        
        <div className="main-container">
          <div className="flex items-center justify-between h-[64px] lg:h-[72px]">
            {/* Logo with hover effect */}
            <Link href="/" className="flex items-center group relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <img 
                  src="/aesthadent_logo.png" 
                  alt="Aesthedent Logo" 
                  className="h-12 lg:h-14 w-auto transition-all duration-300 group-hover:brightness-110"
                />
              </motion.div>
              {/* Subtle glow on hover */}
              <motion.div 
                className="absolute inset-0 bg-[hsl(var(--color-primary))]/10 rounded-lg blur-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            
            {/* Desktop Navigation - Premium Glass Container */}
            <nav className="hidden xl:flex items-center">
              <motion.div 
                className={`flex items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-500 ${
                  isScrolled 
                    ? 'bg-[hsl(var(--color-bg-alt))]/80 backdrop-blur-sm border border-[hsl(var(--border))]/30' 
                    : ''
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                {navLinks.map((link) => {
                  if (link.subLinks) {
                    const isActive = link.subLinks.some(sub => pathname === sub.href);
                    return (
                      <div key={link.label} className="relative group/dropdown">
                        <div className="relative px-3 py-2 cursor-pointer flex items-center gap-1 group">
                          {/* Active pill background */}
                          <div className={`absolute inset-0 rounded-full transition-all duration-300 ease-out ${
                            isActive 
                              ? 'bg-[hsl(var(--color-primary))]/10 border border-[hsl(var(--color-primary))]/20 opacity-100 scale-100' 
                              : 'bg-transparent border border-transparent opacity-0 scale-95'
                          }`} />
                          
                          {/* Hover background */}
                          <div className={`absolute inset-0 rounded-full bg-[hsl(var(--color-bg-alt))] transition-all duration-200 ease-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100`} />
                          
                          {/* Text label */}
                          <span className={`relative z-10 text-sm font-medium transition-colors duration-200 ${
                            isActive 
                              ? 'text-[hsl(var(--color-primary))]' 
                              : 'text-[hsl(var(--color-text-muted))] group-hover:text-[hsl(var(--color-text))]'
                          }`}>
                            {link.label}
                          </span>
                          <svg className="relative z-10 w-4 h-4 text-[hsl(var(--color-text-muted))] transition-transform duration-300 group-hover/dropdown:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          
                          {/* Active underline indicator */}
                          <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--accent))] rounded-full transition-all duration-300 ease-out ${
                            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                          }`} />
                        </div>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover/dropdown:opacity-100 group-hover/dropdown:pointer-events-auto group-hover/dropdown:translate-y-0 w-64 z-50">
                          <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-2xl shadow-xl overflow-hidden py-2 backdrop-blur-md">
                            {link.subLinks.map((subLink) => {
                              const isSubActive = pathname === subLink.href;
                              return (
                                <Link
                                  key={subLink.href}
                                  href={subLink.href}
                                  className={`block px-5 py-3 text-sm transition-colors ${
                                    isSubActive 
                                      ? 'bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))] font-semibold' 
                                      : 'text-[hsl(var(--color-text-muted))] hover:bg-[hsl(var(--color-bg-alt))] hover:text-[hsl(var(--color-text))]'
                                  }`}
                                >
                                  {subLink.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <NavLink 
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && (!link.href.startsWith('/services') || link.href === '/services'))}
                    />
                  );
                })}
              </motion.div>
            </nav>

            {/* Desktop CTA Buttons */}
            <motion.div 
              className="hidden xl:flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {/* Call Now - Subtle style */}
              <MagneticButton>
                <a 
                  href={`tel:${phoneNumber}`}
                  className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text))] rounded-full transition-all duration-300 hover:bg-[hsl(var(--color-bg-alt))] relative overflow-hidden"
                >
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Phone className="w-4 h-4" />
                  </motion.div>
                  <span>Call Now</span>
                  
                  {/* Subtle pulse indicator */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </a>
              </MagneticButton>
              
              {/* Book Appointment - Premium CTA */}
              <MagneticButton>
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] hover:from-[hsl(var(--color-primary-dark))] hover:to-[hsl(var(--color-primary))] text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[hsl(var(--color-primary))]/25 hover:shadow-xl hover:shadow-[hsl(var(--color-primary))]/35 overflow-hidden"
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <MessageCircle className="w-4 h-4 relative z-10 transition-transform group-hover:scale-110" />
                  <span className="relative z-10">Book Appointment</span>
                  
                  {/* Sparkle icon on hover */}
                  <motion.div
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="w-3 h-3 text-[hsl(var(--accent))]" />
                  </motion.div>
                </a>
              </MagneticButton>
            </motion.div>

            {/* Tablet & Mobile - CTA + Menu Button */}
            <div className="flex xl:hidden items-center gap-2 sm:gap-3">
              {/* Show Book button on tablet only */}
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] text-white text-sm font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Now</span>
              </a>
              
              {/* Premium Menu Button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  mobileMenuOpen 
                    ? 'bg-[hsl(var(--color-primary))] text-white' 
                    : 'hover:bg-[hsl(var(--color-bg-alt))] text-[hsl(var(--color-text))]'
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
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
                      <X className="w-6 h-6" strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Scroll progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[hsl(var(--color-primary))] via-[hsl(var(--accent))] to-[hsl(var(--color-primary))]"
          style={{
            scaleX,
            transformOrigin: 'left'
          }}
        />
      </motion.header>

      {/* Mobile & Tablet Menu - Premium Slide-over */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[360px] bg-[hsl(var(--background))] z-50 xl:hidden shadow-2xl"
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
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[hsl(var(--color-bg-alt))] hover:bg-[hsl(var(--color-primary-light))] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
                </motion.button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="p-5 overflow-y-auto max-h-[calc(100vh-64px-180px)]">
                <ul className="space-y-2">
                  {navLinks.map((link, i) => {
                    if (link.subLinks) {
                      const isActive = link.subLinks.some(sub => pathname === sub.href);
                      return (
                        <motion.li
                          key={link.label}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 + 0.1 }}
                          className="py-2"
                        >
                          <div className={`px-4 py-3 rounded-2xl text-base font-semibold ${
                            isActive ? 'text-[hsl(var(--color-primary))]' : 'text-[hsl(var(--color-text))]'
                          }`}>
                            {link.label}
                          </div>
                          <div className="pl-4 mt-1 border-l-2 border-[hsl(var(--color-border))] ml-6 space-y-1">
                            {link.subLinks.map(subLink => {
                              const isSubActive = pathname === subLink.href;
                              return (
                                <Link
                                  key={subLink.href}
                                  href={subLink.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block px-4 py-2.5 rounded-xl text-sm transition-all ${
                                    isSubActive
                                      ? 'bg-[hsl(var(--color-primary-light))]/50 text-[hsl(var(--color-primary))] font-semibold'
                                      : 'text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-bg-alt))]'
                                  }`}
                                >
                                  {subLink.label}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.li>
                      );
                    }

                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && (!link.href.startsWith('/services') || link.href === '/services'));
                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`group flex items-center justify-between px-4 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-[hsl(var(--color-primary-light))] to-[hsl(var(--color-primary-light))]/50 text-[hsl(var(--color-primary))] border border-[hsl(var(--color-primary))]/20'
                              : 'text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-bg-alt))] hover:pl-6'
                          }`}
                        >
                          <span>{link.label}</span>
                          <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                            className={`${isActive ? 'text-[hsl(var(--color-primary))]' : 'text-[hsl(var(--color-text-muted))] group-hover:text-[hsl(var(--color-primary))]'}`}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Mobile CTAs - Fixed at bottom */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-5 border-t border-[hsl(var(--color-border))] bg-gradient-to-t from-[hsl(var(--color-bg-alt))] to-[hsl(var(--background))]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-3">
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] text-white text-base font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-[hsl(var(--color-primary))]/25 hover:shadow-xl overflow-hidden"
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <MessageCircle className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Book on WhatsApp</span>
                  </a>
                  
                  <a 
                    href={`tel:${phoneNumber}`}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-[hsl(var(--background))] border-2 border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] text-[hsl(var(--color-text))] hover:text-[hsl(var(--color-primary))] text-base font-medium rounded-2xl transition-all duration-300"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+91 93098 16336</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
