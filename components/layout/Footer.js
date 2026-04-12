'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Smile, MapPin, Clock, Phone, MessageCircle, Mail, ArrowRight } from 'lucide-react';

const footerLinks = {
  services: [
    { href: '/services/dental-implants', label: 'Dental Implants' },
    { href: '/services/root-canal', label: 'Root Canal Treatment' },
    { href: '/services/full-mouth-rehabilitation', label: 'Full Mouth Rehab' },
    { href: '/services/orthodontic-treatment', label: 'Braces & Aligners' },
    { href: '/services/wisdom-tooth-surgery', label: 'Wisdom Tooth Surgery' },
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
  const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';
  const phoneNumber = '+919309816336';

  return (
    <footer className="bg-gradient-to-b from-[hsl(var(--color-primary))] via-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))]">
      {/* Main Footer */}
      <div className="main-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-10 group">
              <Image 
                src="/aesthadent_logo.png" 
                alt="Aesthedent Logo" 
                width={200}
                height={60}
                className="h-14 w-auto group-hover:opacity-85 transition-opacity duration-300"
              />
            </Link>
            <p className="text-white/90 text-sm leading-relaxed font-light mb-10 tracking-wide">
              Honest, clear dental care in Kothrud, Pune. We focus on reliable treatments and ensuring you understand everything before we start.
            </p>
            <div className="flex gap-5">
              <a 
                id="footer-social-whatsapp"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-white/15 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-accent))] transition-all duration-300 text-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-primary-dark))] shadow-lg shadow-black/10"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                id="footer-social-call"
                href={`tel:${phoneNumber}`}
                className="group w-11 h-11 bg-white/15 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-accent))] transition-all duration-300 text-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-primary-dark))] shadow-lg shadow-black/10"
                aria-label="Call"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="mailto:info@aesthedent.com"
                className="group w-11 h-11 bg-white/15 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-accent))] transition-all duration-300 text-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-primary-dark))] shadow-lg shadow-black/10"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--color-accent))] mb-8 pb-4 border-b border-white/20">Services</h2>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/90 hover:text-[hsl(var(--color-accent))] transition-all duration-300 text-sm font-normal hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--color-accent))] mb-8 pb-4 border-b border-white/20">Quick Links</h2>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/90 hover:text-[hsl(var(--color-accent))] transition-all duration-300 text-sm font-normal hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--color-accent))] mb-8 pb-4 border-b border-white/20">Contact</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3.5 group">
                <MapPin className="w-4 h-4 text-[hsl(var(--color-accent))] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <a 
                  id="footer-contact-address"
                  href="https://maps.app.goo.gl/BVb9iy5EQkmbYSVPA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/90 text-sm font-normal leading-relaxed hover:text-[hsl(var(--color-accent))] transition-colors duration-300"
                >
                  Near Karve Statue, Kothrud, Pune, Maharashtra 411038
                </a>
              </li>
              <li className="flex items-start gap-3.5 group">
                <Clock className="w-4 h-4 text-[hsl(var(--color-accent))] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white/90 text-sm font-normal leading-relaxed">Mon - Sat: 10:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-start gap-3.5 group">
                <Phone className="w-4 h-4 text-[hsl(var(--color-accent))] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <a id="footer-contact-call" href={`tel:${phoneNumber}`} className="text-white/90 text-sm hover:text-[hsl(var(--color-accent))] transition-colors duration-300 font-normal">
                  +91 93098 16336
                </a>
              </li>
              <li className="flex items-start gap-3.5 group">
                <Mail className="w-4 h-4 text-[hsl(var(--color-accent))] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                <a id="footer-contact-email" href="mailto:info@aesthedent.com" className="text-white/90 text-sm hover:text-[hsl(var(--color-accent))] transition-colors duration-300 font-normal break-all">
                  info@aesthedent.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/80 text-sm font-normal">
            © 2025 Aesthedent Dental Clinic. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm">
            <Link href="/privacy" className="text-white/80 hover:text-[hsl(var(--color-accent))] transition-colors duration-300 font-normal">Privacy Policy</Link>
            <Link href="/terms" className="text-white/80 hover:text-[hsl(var(--color-accent))] transition-colors duration-300 font-normal">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
