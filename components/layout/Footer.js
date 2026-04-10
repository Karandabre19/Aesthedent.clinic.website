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
    <footer className="bg-[hsl(var(--color-secondary))] text-[hsl(var(--primary-foreground))]">
      {/* Main Footer */}
      <div className="main-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <img 
                src="/aesthadent_logo.png" 
                alt="Aesthedent Logo" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-[hsl(var(--color-text))] text-sm leading-relaxed mb-6 font-medium">
              Premium dental care in Kothrud, Pune. Experience painless treatments, honest advice, and a patient-first approach.
            </p>
            <div className="flex gap-3">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[hsl(var(--color-accent))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-primary))] transition-colors text-[hsl(var(--color-accent))] hover:text-[hsl(var(--primary-foreground))]"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={`tel:${phoneNumber}`}
                className="w-10 h-10 bg-[hsl(var(--color-accent))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-primary))] transition-colors text-[hsl(var(--color-accent))] hover:text-[hsl(var(--primary-foreground))]"
                aria-label="Call"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a 
                href="mailto:info@aesthedent.com"
                className="w-10 h-10 bg-[hsl(var(--color-accent))]/20 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-primary))] transition-colors text-[hsl(var(--color-accent))] hover:text-[hsl(var(--primary-foreground))]"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--color-text))] mb-6 pb-3 border-b border-[hsl(var(--color-accent))]/30">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[hsl(var(--color-text))]/80 hover:text-[hsl(var(--color-primary))] transition-colors text-sm flex items-center gap-2 group font-medium"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[hsl(var(--color-primary))]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--color-text))] mb-6 pb-3 border-b border-[hsl(var(--color-accent))]/30">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[hsl(var(--color-text))]/80 hover:text-[hsl(var(--color-primary))] transition-colors text-sm flex items-center gap-2 group font-medium"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[hsl(var(--color-primary))]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--color-text))] mb-6 pb-3 border-b border-[hsl(var(--color-accent))]/30">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-[hsl(var(--color-accent))] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[hsl(var(--color-text))]/85 text-sm font-medium">Near Karve Statue, Kothrud, Pune, Maharashtra 411038</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Clock className="w-5 h-5 text-[hsl(var(--color-accent))] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[hsl(var(--color-text))]/85 text-sm font-medium">Mon - Sat: 10:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-[hsl(var(--color-accent))] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href={`tel:${phoneNumber}`} className="text-[hsl(var(--color-text))]/85 text-sm hover:text-[hsl(var(--color-primary))] transition-colors font-medium">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-[hsl(var(--color-accent))] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:info@aesthedent.com" className="text-[hsl(var(--color-text))]/85 text-sm hover:text-[hsl(var(--color-primary))] transition-colors font-medium break-all">
                  info@aesthedent.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[hsl(var(--color-accent))]/20">
        <div className="main-container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[hsl(var(--color-text))]/70 text-sm font-medium">
              © 2025 Aesthedent Dental Clinic. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-[hsl(var(--color-text))]/70 hover:text-[hsl(var(--color-primary))] transition-colors font-medium">Privacy Policy</Link>
              <Link href="/terms" className="text-[hsl(var(--color-text))]/70 hover:text-[hsl(var(--color-primary))] transition-colors font-medium">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
