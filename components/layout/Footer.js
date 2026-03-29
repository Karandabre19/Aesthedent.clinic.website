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
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Smile className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Aesthedent</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium dental care in Kothrud, Pune. Experience painless treatments, honest advice, and a patient-first approach.
            </p>
            <div className="flex gap-3">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={`tel:${phoneNumber}`}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                aria-label="Call"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a 
                href="mailto:info@aesthedent.com"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">Near Karve Statue, Kothrud, Pune, Maharashtra 411038</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Mon - Sat: 10:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <a href={`tel:${phoneNumber}`} className="text-gray-300 text-sm hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <a href="mailto:info@aesthedent.com" className="text-gray-300 text-sm hover:text-white transition-colors">
                  info@aesthedent.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Aesthedent Dental Clinic. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
