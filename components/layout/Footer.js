'use client';

import Link from 'next/link';
import { Smile, MapPin, Clock, Phone, MessageCircle, Mail, ArrowRight } from 'lucide-react';

const footerLinks = {
  services: [
    { href: '/services/dental-implants', label: 'Dental Implants' },
    { href: '/services/tooth-extraction', label: 'Tooth Extraction' },
    { href: '/services/cleaning-polishing', label: 'Cleaning & Polishing' },
    { href: '/services/kids-dentistry', label: 'Kids Dentistry' },
    { href: '/services/root-canal', label: 'Root Canal Treatment' },
  ],
  quickLinks: [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'All Services' },
    { href: '/doctor', label: 'Our Doctors' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ],
};

export default function Footer() {
  const whatsappNumber = '919876543210';
  const whatsappMessage = encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const phoneNumber = '+919876543210';

  return (
    <footer className="bg-gradient-to-b from-[hsl(var(--color-secondary))] via-[hsl(var(--color-secondary))]/98 to-[hsl(var(--color-secondary))]/92">
      {/* Main Footer */}
      <div className="main-container py-24 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 lg:gap-28">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-10 group">
              <img 
                src="/aesthadent_logo.png" 
                alt="Aesthedent Logo" 
                className="h-14 w-auto group-hover:opacity-85 transition-opacity duration-300"
              />
            </Link>
            <p className="text-white/90 text-sm leading-relaxed font-light mb-10 tracking-wide">
              Premium dental care in Kothrud, Pune. Experience painless treatments, honest advice, and a patient-first approach.
            </p>
            <div className="flex gap-5">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-[hsl(var(--color-accent))]/25 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-accent))] transition-all duration-300 text-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-secondary))] shadow-lg shadow-[hsl(var(--color-accent))]/20"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href={`tel:${phoneNumber}`}
                className="group w-11 h-11 bg-[hsl(var(--color-accent))]/25 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-accent))] transition-all duration-300 text-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-secondary))] shadow-lg shadow-[hsl(var(--color-accent))]/20"
                aria-label="Call"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="mailto:info@aesthedent.com"
                className="group w-11 h-11 bg-[hsl(var(--color-accent))]/25 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-accent))] transition-all duration-300 text-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-secondary))] shadow-lg shadow-[hsl(var(--color-accent))]/20"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-10 pb-4 border-b border-[hsl(var(--color-accent))]/40">Services</h4>
            <ul className="space-y-5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/80 hover:text-[hsl(var(--color-accent))] transition-colors duration-300 text-sm font-light hover:translate-x-1 transform transition-transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-10 pb-4 border-b border-[hsl(var(--color-accent))]/40">Quick Links</h4>
            <ul className="space-y-5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/80 hover:text-[hsl(var(--color-accent))] transition-colors duration-300 text-sm font-light hover:translate-x-1 transform transition-transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-10 pb-4 border-b border-[hsl(var(--color-accent))]/40">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-3.5 group">
                <MapPin className="w-4 h-4 text-[hsl(var(--color-accent))] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white/85 text-sm font-light leading-relaxed">Near Karve Statue, Kothrud, Pune, Maharashtra 411038</span>
              </li>
              <li className="flex items-start gap-3.5 group">
                <Clock className="w-4 h-4 text-[hsl(var(--color-accent))] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white/85 text-sm font-light leading-relaxed">Mon - Sat: 10:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-start gap-3.5 group">
                <Phone className="w-4 h-4 text-[hsl(var(--color-accent))] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <a href={`tel:${phoneNumber}`} className="text-white/85 text-sm hover:text-[hsl(var(--color-accent))] transition-colors duration-300 font-light">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3.5 group">
                <Mail className="w-4 h-4 text-[hsl(var(--color-accent))] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <a href="mailto:info@aesthedent.com" className="text-white/85 text-sm hover:text-[hsl(var(--color-accent))] transition-colors duration-300 font-light break-all">
                  info@aesthedent.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[hsl(var(--color-accent))]/30 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/75 text-xs font-light tracking-widest">
            © 2025 Aesthedent Dental Clinic. All rights reserved.
          </p>
          <div className="flex gap-10 text-xs">
            <Link href="/privacy" className="text-white/75 hover:text-[hsl(var(--color-accent))] transition-colors duration-300 font-light">Privacy Policy</Link>
            <Link href="/terms" className="text-white/75 hover:text-[hsl(var(--color-accent))] transition-colors duration-300 font-light">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
