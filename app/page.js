'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { services } from '@/lib/services';
import { 
  Phone, 
  MessageCircle, 
  Star, 
  Shield, 
  Heart, 
  Users, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Smile,
  Baby,
  Leaf,
  Stethoscope
} from 'lucide-react';

const iconMap = {
  Sparkles, Shield, Leaf, Baby, Stethoscope
};

const whatsappNumber = '919876543210';
const whatsappMessage = encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
const phoneNumber = '+919876543210';

export default function HomePage() {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="pt-[80px] lg:pt-[88px]">
        <div className="main-container py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">5.0 • 263 Reviews</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold text-gray-900 leading-[1.15] tracking-tight">
                Dental Care That
                <span className="block text-teal-600">Feels Like Care</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
                Experience painless treatments, honest advice, and a calm environment where your comfort comes first.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base font-medium animate-pulse-soft"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book on WhatsApp
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base font-medium"
                  asChild
                >
                  <a href={`tel:${phoneNumber}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  Kothrud, Pune
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Mon-Sat: 10AM - 8PM
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-teal-50 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.pexels.com/photos/5622232/pexels-photo-5622232.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Caring dentist with patient" 
                className="relative rounded-3xl shadow-2xl object-cover w-full h-[400px] lg:h-[500px]"
              />
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 hidden lg:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">100% Painless</p>
                    <p className="text-sm text-gray-500">Gentle procedures</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <AnimatedSection className="bg-gray-50 border-y border-gray-100">
        <div className="main-container py-6 lg:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Star, label: '5.0 Rated', sublabel: 'Google Reviews' },
              { icon: Shield, label: 'Painless Treatment', sublabel: 'Modern Techniques' },
              { icon: Heart, label: 'Honest Advice', sublabel: 'No Unnecessary Procedures' },
              { icon: Users, label: 'Patient-First Care', sublabel: 'Your Comfort Matters' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm lg:text-base">{item.label}</p>
                  <p className="text-xs lg:text-sm text-gray-500">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Services Preview */}
      <section className="section-spacing">
        <div className="main-container">
          <SectionHeading 
            badge="Our Services"
            title="Expert Dental Care, Tailored for You"
            subtitle="From routine check-ups to advanced procedures, we ensure comfort at every step."
          />

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.slice(0, 4).map((service, i) => {
              const IconComponent = iconMap[service.icon] || Sparkles;
              return (
                <AnimatedSection key={service.slug} delay={i * 0.1}>
                  <Link href={`/services/${service.slug}`}>
                    <Card className="group border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-full cursor-pointer">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                            <IconComponent className="w-7 h-7 text-teal-600" />
                          </div>
                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{service.title}</h3>
                            <div className="space-y-2">
                              <p className="text-gray-500 text-sm">{service.problem}</p>
                              <p className="text-gray-700"><span className="text-teal-600 font-medium">→</span> {service.solution}</p>
                              <p className="text-teal-700 font-medium flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {service.benefit}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-teal-200 text-teal-700 hover:bg-teal-50" asChild>
              <Link href="/services">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-spacing bg-gradient-to-b from-gray-50 to-white">
        <div className="main-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <Badge className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100">Why Aesthedent</Badge>
              <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-8">Dentistry That Puts You at Ease</h2>
              
              <div className="space-y-6">
                {[
                  { title: 'Pain-Free Experience', desc: 'Modern anesthesia and gentle techniques' },
                  { title: 'No Unnecessary Treatments', desc: 'Honest diagnosis, only what you need' },
                  { title: 'Step-by-Step Explanation', desc: 'We explain every procedure before starting' },
                  { title: 'Friendly, Approachable Doctors', desc: 'Ask questions, get real answers' },
                  { title: 'Online Consultation Support', desc: 'Get advice from the comfort of home' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white" asChild>
                  <Link href="/about">
                    Learn More About Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="right" className="relative">
              <img 
                src="https://images.pexels.com/photos/5619462/pexels-photo-5619462.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Modern dental equipment" 
                className="rounded-3xl shadow-xl object-cover w-full h-[450px]"
              />
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 hidden lg:block">
                <div className="text-center">
                  <p className="text-4xl font-bold text-teal-600">10+</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Doctor Preview */}
      <section className="section-spacing">
        <div className="main-container">
          <SectionHeading 
            badge="Our Team"
            title="Meet Your Dentists"
            subtitle="Skilled, friendly, and dedicated to your comfort."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Dr. Sahil',
                role: 'Lead Dentist',
                desc: 'Specializes in implants and restorative dentistry. Known for his calm demeanor and thorough explanations.',
                image: 'https://images.pexels.com/photos/14235194/pexels-photo-14235194.jpeg?auto=compress&cs=tinysrgb&w=500'
              },
              {
                name: 'Dr. Aishwarya',
                role: 'Dental Surgeon',
                desc: 'Expert in painless extractions and pediatric dentistry. Patients love her gentle, reassuring approach.',
                image: 'https://images.pexels.com/photos/31043312/pexels-photo-31043312.jpeg?auto=compress&cs=tinysrgb&w=500'
              }
            ].map((doctor, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <Card className="border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-teal-600 font-medium text-sm mb-3">{doctor.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{doctor.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-teal-200 text-teal-700 hover:bg-teal-50" asChild>
              <Link href="/doctor">
                Meet the Full Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-spacing bg-gray-50">
        <div className="main-container">
          <SectionHeading 
            badge="Patient Stories"
            title="What Our Patients Say"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Not even a pinch of pain during my root canal. I was genuinely surprised!",
                name: "Priya M.",
                treatment: "Root Canal Treatment"
              },
              {
                quote: "The doctor explained everything step by step. No surprises, no hidden costs.",
                name: "Rahul K.",
                treatment: "Dental Implant"
              },
              {
                quote: "My daughter was so comfortable. She actually wants to come back! Best pediatric care.",
                name: "Sneha P.",
                treatment: "Kids Dentistry"
              }
            ].map((testimonial, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Card className="bg-white border-gray-100 h-full">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.treatment}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing bg-gradient-to-b from-teal-50 to-white">
        <div className="main-container-narrow text-center">
          <AnimatedSection>
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Smile className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-6">
              Ready for a Pain-Free Dental Experience?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Take the first step towards a healthier smile. We promise gentle care, honest advice, and your comfort above all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 text-base font-medium animate-pulse-soft"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book Your Appointment
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-6 text-base font-medium"
                asChild
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
