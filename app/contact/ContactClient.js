'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    
    setIsLoading(false);
  };

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
            <h1 className="text-4xl lg:text-[52px] font-semibold text-[hsl(var(--color-text))] mb-6 leading-tight">
              Get in Touch
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
                    <h3 className="font-semibold text-[hsl(var(--color-text))] mb-3">{info.title}</h3>
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
                  <h3 className="text-2xl font-semibold text-[hsl(var(--color-text))] mb-2">Send Us a Message</h3>
                  <p className="text-[hsl(var(--color-text-muted))] mb-6">We'll get back to you within 24 hours.</p>
                  
                  {isSubmitted ? (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-[hsl(var(--color-text))] mb-2">Message Sent!</h4>
                      <p className="text-[hsl(var(--color-text-muted))] mb-6">Thank you for contacting us. We'll reach out to you soon.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name *</Label>
                          <Input 
                            id="name"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone"
                            type="tel"
                            required
                            placeholder="+91 93098 16336"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="h-12"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message *</Label>
                        <Textarea 
                          id="message"
                          required
                          placeholder="Tell us how we can help you..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] text-[hsl(var(--primary-foreground))] py-6"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
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
