'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Accessibility,
  CreditCard,
  Stethoscope,
  Leaf,
  Menu,
  X
} from 'lucide-react';

// Intersection Observer Hook for fade-in animations
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
}

// Section wrapper with fade-in
function Section({ children, className = '', id = '' }) {
  const [ref, isInView] = useInView();
  
  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </section>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappNumber = '919876543210';
  const whatsappMessage = encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const phoneNumber = '+919876543210';

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Aesthedent</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium">Services</a>
              <a href="#about" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium">About Us</a>
              <a href="#doctors" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium">Our Doctors</a>
              <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium">Reviews</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50" asChild>
                <a href={`tel:${phoneNumber}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="flex flex-col gap-4">
              <a href="#services" className="text-gray-600 hover:text-teal-600 py-2" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#about" className="text-gray-600 hover:text-teal-600 py-2" onClick={() => setMobileMenuOpen(false)}>About Us</a>
              <a href="#doctors" className="text-gray-600 hover:text-teal-600 py-2" onClick={() => setMobileMenuOpen(false)}>Our Doctors</a>
              <a href="#testimonials" className="text-gray-600 hover:text-teal-600 py-2" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1 border-teal-200 text-teal-700" asChild>
                  <a href={`tel:${phoneNumber}`}><Phone className="w-4 h-4 mr-2" />Call</a>
                </Button>
                <Button size="sm" className="flex-1 bg-teal-600 text-white" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <Section className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">5.0 • 263 Reviews</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight tracking-tight">
                Dental Care That
                <span className="block text-teal-600">Feels Like Care</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
                Experience painless treatments, honest advice, and a calm environment where your comfort comes first.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base font-medium pulse-soft"
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
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-teal-50 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.pexels.com/photos/5622232/pexels-photo-5622232.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Caring dentist with patient" 
                className="relative rounded-3xl shadow-2xl object-cover w-full h-[400px] lg:h-[500px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">100% Painless</p>
                    <p className="text-sm text-gray-500">Gentle procedures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Trust Strip */}
      <Section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </Section>

      {/* Services Section */}
      <Section id="services" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-50">Our Services</Badge>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Expert Dental Care, Tailored for You</h2>
            <p className="text-gray-600 text-lg">From routine check-ups to advanced procedures, we ensure comfort at every step.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                title: 'Dental Implants',
                problem: 'Missing teeth affecting your confidence?',
                solution: 'Permanent, natural-looking implants',
                benefit: 'Smile, eat, and live without worry',
                icon: Sparkles
              },
              {
                title: 'Tooth Extraction',
                problem: 'Painful or damaged tooth?',
                solution: 'Gentle, painless removal with care',
                benefit: 'Quick recovery, zero discomfort',
                icon: Shield
              },
              {
                title: 'Cleaning & Polishing',
                problem: 'Plaque buildup or dull teeth?',
                solution: 'Professional deep cleaning',
                benefit: 'Fresh breath, brighter smile',
                icon: Leaf
              },
              {
                title: 'Kids Dentistry',
                problem: "Child anxious about dentist?",
                solution: 'Fun, friendly approach for kids',
                benefit: 'Happy visits, healthy teeth habits',
                icon: Baby
              }
            ].map((service, i) => (
              <Card 
                key={i} 
                className="group border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                      <service.icon className="w-7 h-7 text-teal-600" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
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
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section id="about" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-50">Why Aesthedent</Badge>
              <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-8">Dentistry That Puts You at Ease</h2>
              
              <div className="space-y-6">
                {[
                  { title: 'Pain-Free Experience', desc: 'Modern anesthesia and gentle techniques' },
                  { title: 'No Unnecessary Treatments', desc: 'Honest diagnosis, only what you need' },
                  { title: 'Step-by-Step Explanation', desc: 'We explain every procedure before starting' },
                  { title: 'Friendly, Approachable Doctors', desc: 'Ask questions, get real answers' },
                  { title: 'Online Consultation Support', desc: 'Get advice from the comfort of home' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
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
            </div>
          </div>
        </div>
      </Section>

      {/* Doctors Section */}
      <Section id="doctors" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-50">Our Team</Badge>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Meet Your Dentists</h2>
            <p className="text-gray-600 text-lg">Skilled, friendly, and dedicated to your comfort.</p>
          </div>

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
              <Card key={i} className="border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-50">Patient Stories</Badge>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">What Our Patients Say</h2>
          </div>

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
              <Card key={i} className="bg-white border-gray-100">
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
            ))}
          </div>
        </div>
      </Section>

      {/* Comfort & Experience */}
      <Section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-50">Everyone Welcome</Badge>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">A Space for Everyone</h2>
            <p className="text-gray-600 text-lg">Inclusive, accessible, and designed for your comfort.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'LGBTQ+ Friendly', desc: 'Safe, respectful, gender-neutral care' },
              { icon: Accessibility, title: 'Wheelchair Accessible', desc: 'Full accessibility support' },
              { icon: Baby, title: 'Kid-Friendly', desc: 'Fun environment for children' },
              { icon: CreditCard, title: 'Easy Payments', desc: 'UPI, cards, NFC accepted' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Clinic Visual */}
      <Section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/4269950/pexels-photo-4269950.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Aesthedent Clinic Interior" 
              className="w-full h-[300px] lg:h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent flex items-center">
              <div className="p-8 lg:p-16 max-w-lg">
                <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4">Modern, Clean, Comfortable</h3>
                <p className="text-gray-200 mb-6">State-of-the-art equipment in a calm, welcoming environment.</p>
                <Button className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    Visit Us Today <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-20 lg:py-28 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 text-base font-medium pulse-soft"
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
              <a href={`tel:${phoneNumber}`}>
                <Phone className="w-5 h-5 mr-2" />
                +91 98765 43210
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">Aesthedent</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                Premium dental care in Kothrud, Pune. Painless treatments, honest advice, and patient-first approach.
              </p>
              <div className="flex gap-4">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href={`tel:${phoneNumber}`} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#doctors" className="hover:text-white transition-colors">Our Doctors</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Kothrud, Pune, Maharashtra</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span>Mon-Sat: 10AM - 8PM</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 Aesthedent Dental Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky WhatsApp Button */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors pulse-soft"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
