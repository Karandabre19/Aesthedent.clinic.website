'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import IntakeWizard from '@/components/forms/IntakeWizard';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { MagneticWrapper } from '@/components/ui/InteractiveHighTech';
import { 
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Instagram
} from 'lucide-react';

const instagramLink = 'https://www.instagram.com/drwathodkar_aesthedent_clinic?igsh=azFlYTc2b25xaDFn';
const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';
const phoneNumber = '+919309816336';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['No.5 First Floor, AJ Tower, above Irani Cafe', 'Dahanukar Colony, Kothrud, Pune 411038'],
    action: {
      label: 'Get Directions',
      href: 'https://www.google.com/maps/place/Aesthedent+Dental+Clinic,+Kothrud/@18.4972761,73.8108921,17z/data=!3m2!4b1!5s0x3bc2bfc407d2eb7d:0xeb43317068a295aa!4m6!3m5!1s0x3bc2bfa49403bd57:0xb59ec17e89bd289f!8m2!3d18.497271!4d73.813467!16s%2Fg%2F11j2v_ph1x?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D'
    }
  },
  {
    icon: Instagram,
    title: 'Follow Us',
    details: ['@drwathodkar_aesthedent_clinic', 'See transformations & clinical cases'],
    action: {
      label: 'View Instagram',
      href: instagramLink
    }
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+91 93098 16336'],
    action: {
      label: 'Call Now',
      href: `tel:${phoneNumber}`
    }
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: ['Mon - Sun: 10:00 AM - 8:00 PM', '(Wednesday Holiday)'],
    action: null
  }
];

export default function ContactPage() {
  // The form state and the /api/contact POST that lived here were removed with
  // the old form -IntakeWizard owns its own state and sends via WhatsApp
  // click-to-chat instead. The /api/contact route is left in place and is simply
  // no longer called from this page; delete it separately if nothing else uses it.

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[hsl(var(--color-primary-light))] to-[hsl(var(--background))]">
        <div className="main-container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-[hsl(var(--color-primary-light))] text-[hsl(var(--color-primary))]">Contact Us</Badge>
            {/* Phase 4H: was "Get in Touch" -zero keywords, zero location, on
                one of the four Tier-1 pages (audit/01-content-spine.md §1.1). */}
            <h1 className="text-4xl lg:text-[52px] font-semibold text-[hsl(var(--color-text))] mb-6 leading-tight">
              Contact Aesthedent &mdash; Book a Dentist in Kothrud, Pune
            </h1>
            <p className="text-lg lg:text-xl text-[hsl(var(--color-text-muted))] leading-relaxed">
              Have questions? Want to book an appointment? We're here to help. Reach out to us through any of the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Buttons */}
      <section className="section-spacing-sm">
        <div className="main-container-narrow">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <MagneticWrapper>
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base font-bold shadow-lg shadow-green-600/20"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book on WhatsApp
                </a>
              </Button>
            </MagneticWrapper>

            <MagneticWrapper>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-[hsl(var(--color-primary))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-light))] px-8 py-6 text-base font-bold"
                asChild
              >
                <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5 mr-2" />
                  Follow on Instagram
                </a>
              </Button>
            </MagneticWrapper>

            <MagneticWrapper offset={0.15}>
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-2 text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-primary))] transition-all font-bold"
              >
                <Phone className="w-4 h-4" />
                +91 93098 16336
              </a>
            </MagneticWrapper>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-spacing">
        <div className="main-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Card className="border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-[hsl(var(--color-primary-light))] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-7 h-7 text-[hsl(var(--color-primary))]" />
                    </div>
                    {/* Phase 4H: h1 -> h3 skipped a level. These cards are the
                        page's top-level content blocks, so they are h2. Classes
                        unchanged, so nothing moves visually. */}
                    <h2 className="font-semibold text-[hsl(var(--color-text))] mb-3">{info.title}</h2>
                    <div className="space-y-1 mb-4">
                      {info.details.map((detail, j) => (
                        <p key={j} className="text-[hsl(var(--color-text-muted))] text-sm">{detail}</p>
                      ))}
                    </div>
                    {info.action && (
                      <a 
                        href={info.action.href}
                        target={info.action.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-[hsl(var(--color-primary))] font-medium text-sm hover:text-[hsl(var(--color-primary-dark))] transition-colors"
                      >
                        {info.action.label} →
                      </a>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Form */}
      <section className="section-spacing bg-[hsl(var(--color-bg-alt))]">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <AnimatedSection direction="left">
              <div className="rounded-3xl overflow-hidden shadow-lg h-full min-h-[400px] relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5683262145564!2d73.81084207595561!3d18.49727607062489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfa49403bd57%3A0xb59ec17e89bd289f!2sAesthedent%20Dental%20Clinic%2C%20Kothrud!5e0!3m2!1sen!2sin!4v1713000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aesthedent Location"
                ></iframe>
                <a 
                  href="https://maps.app.goo.gl/BVb9iy5EQkmbYSVPA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-light))] transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection direction="right">
              <Card className="border-[hsl(var(--color-border))] shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-[hsl(var(--color-text))] mb-2">Book an appointment</h2>
                  <p className="text-[hsl(var(--color-text-muted))] mb-6">Five quick questions, then it opens in WhatsApp for you to send.</p>
                  
                  {/* Phase 4I: the old contact form POSTed to /api and the
                      patient then waited, with no confirmation they could see.
                      Replaced by the WhatsApp intake wizard - the enquiry lands
                      in a thread from the patient's own number, which the front
                      desk can simply reply to.
                      See components/forms/IntakeWizard.tsx. */}
                  <IntakeWizard />

                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="main-container-narrow">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] rounded-3xl p-8 lg:p-12 text-center text-[hsl(var(--primary-foreground))]">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                Prefer Instant Booking?
              </h2>
              <p className="text-[hsl(var(--primary-foreground)/0.8)] mb-8 max-w-xl mx-auto">
                Skip the form and book directly on WhatsApp. Our team will confirm your appointment within minutes.
              </p>
              <MagneticWrapper>
                <Button 
                  size="lg" 
                  className="bg-[hsl(var(--background))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-bg-alt))] px-10 py-7 text-lg font-bold shadow-xl"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Book on WhatsApp
                  </a>
                </Button>
              </MagneticWrapper>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
