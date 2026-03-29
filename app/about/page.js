'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { 
  MessageCircle,
  Heart,
  Shield,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Baby,
  Accessibility,
  CreditCard,
  Award
} from 'lucide-react';

const whatsappLink = 'https://wa.me/919876543210?text=' + encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');

export default function AboutPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-teal-100 text-teal-700">About Us</Badge>
              <h1 className="text-4xl lg:text-[52px] font-semibold text-gray-900 mb-6 leading-tight">
                Redefining Dental Care in Pune
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                At Aesthedent, we believe dental care should be gentle, honest, and accessible to everyone. Founded with a mission to remove the fear from dentistry.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book a Visit
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6"
                  asChild
                >
                  <Link href="/doctor">
                    Meet Our Doctors
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-teal-50 rounded-3xl transform -rotate-3"></div>
              <img 
                src="https://images.pexels.com/photos/4269950/pexels-photo-4269950.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Aesthedent Clinic" 
                className="relative rounded-3xl shadow-xl object-cover w-full h-[400px] lg:h-[450px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <Badge className="mb-4 bg-teal-50 text-teal-700">Our Story</Badge>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900">
              Born from a Simple Belief
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                Aesthedent was founded in 2015 by Dr. Sahil Sharma with a simple vision: to create a dental clinic where patients actually want to come. A place where fear is replaced with comfort, where every treatment is explained clearly, and where honesty guides every recommendation.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                After years of seeing patients avoid dental care due to fear or past negative experiences, Dr. Sahil knew there had to be a better way. He invested in the latest painless dentistry techniques, created a calm, spa-like environment, and built a team that shares his patient-first philosophy.
              </p>
              <p className="text-lg leading-relaxed">
                Today, Aesthedent has served over 5,000 patients in Kothrud and beyond. Our 5-star rating isn't just a number—it's a reflection of the trust our patients place in us every day.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="section-spacing-sm bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '10+', label: 'Years of Experience' },
              { number: '5,000+', label: 'Happy Patients' },
              { number: '5.0', label: 'Google Rating' },
              { number: '263', label: 'Reviews' }
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center text-white">
                  <p className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</p>
                  <p className="text-teal-100">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            badge="Our Values"
            title="What We Stand For"
            subtitle="The principles that guide everything we do at Aesthedent"
          />

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: 'Painless Treatment',
                desc: 'We use advanced anesthesia and gentle techniques to ensure every procedure is as comfortable as possible. Fear of pain should never stop you from getting care.'
              },
              {
                icon: Heart,
                title: 'Honest Advice',
                desc: 'We never recommend unnecessary treatments. Our recommendations are based solely on what you actually need for optimal oral health.'
              },
              {
                icon: Users,
                title: 'Patient-First Approach',
                desc: 'Your comfort and understanding come first. We take time to explain every procedure, answer every question, and ensure you feel at ease.'
              },
              {
                icon: Sparkles,
                title: 'Modern Excellence',
                desc: 'We invest in the latest technology and continuously update our skills to provide you with the best possible care.'
              }
            ].map((value, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Card className="border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                      <value.icon className="w-7 h-7 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusivity */}
      <section className="section-spacing bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            badge="Everyone Welcome"
            title="A Space for Everyone"
            subtitle="Inclusive, accessible, and designed for your comfort"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'LGBTQ+ Friendly', desc: 'Safe, respectful, gender-neutral care' },
              { icon: Accessibility, title: 'Wheelchair Accessible', desc: 'Full accessibility support' },
              { icon: Baby, title: 'Kid-Friendly', desc: 'Fun environment for children' },
              { icon: CreditCard, title: 'Easy Payments', desc: 'UPI, cards, NFC accepted' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Experience */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/5619462/pexels-photo-5619462.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Aesthedent Clinic Interior" 
              className="w-full h-[350px] lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex items-center">
              <div className="p-8 lg:p-16 max-w-lg">
                <h3 className="text-2xl lg:text-4xl font-semibold text-white mb-4">Modern, Clean, Comfortable</h3>
                <p className="text-gray-200 mb-6 text-lg">
                  Our clinic is designed to feel more like a spa than a dental office. State-of-the-art equipment in a calm, welcoming environment.
                </p>
                <Button className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                  <Link href="/contact">
                    Visit Us Today <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-6">
              Experience the Aesthedent Difference
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Join thousands of happy patients who have discovered dental care that truly puts them first.
            </p>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 text-base font-medium animate-pulse-soft"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Book Your First Visit
              </a>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
