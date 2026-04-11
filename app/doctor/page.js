'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { 
  MessageCircle,
  GraduationCap,
  Award,
  Heart,
  Users
} from 'lucide-react';

const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';

const doctors = [
  {
    name: 'Dr. Sahil Sharma',
    role: 'Lead Dentist & Founder',
    image: '/assets/doctor-male.jpeg',
    bio: 'Dr. Sahil is the principal dentist at Aesthedent Dental Clinic in Kothrud, Pune. With 12+ years of clinical practice, he focuses extensively on precision dental implants, full-mouth reconstructions, and cosmetic dentistry. Ranked among the top implantologists in Pune, he combines advanced digital diagnostics with proven surgical techniques to deliver durable, aesthetically perfect, and functional tooth restorations.',
    qualifications: ['BDS - Government Dental College, Mumbai', 'MDS - Prosthodontics, Pune University', 'Fellowship in Implantology, Germany'],
    specializations: ['Dental Implants', 'Full Mouth Rehabilitation', 'Cosmetic Dentistry', 'Smile Design'],
    philosophy: 'High-quality dental care requires precision, advanced technology, and complete transparency. My focus is always on delivering durable results that genuinely improve oral health.'
  },
  {
    name: 'Dr. Aishwarya Kulkarni',
    role: 'Dental Surgeon',
    image: '/assets/doctor-female.jpeg',
    bio: 'An expert dental surgeon in Pune, Dr. Aishwarya specializes in pediatric dentistry, preventive oral care, and painless tooth extractions. Utilizing modern, minimally invasive techniques, she effectively treats complex dental issues while prioritizing efficient recovery, making her a highly recommended dentist for specialized and routine clinical treatments.',
    qualifications: ['BDS - Bharati Vidyapeeth, Pune', 'Certificate in Pediatric Dentistry', 'Advanced Training in Painless Dentistry'],
    specializations: ['Pediatric Dentistry', 'Painless Extractions', 'Root Canal Treatment', 'Preventive Care'],
    philosophy: 'Effective dental treatments should be precise, comfortable, and clinically sound. I emphasize clear communication and proactive preventive care to secure my patients’ long-term oral health.'
  }
];

export default function DoctorPage() {
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
            <Badge className="mb-4 bg-[hsl(var(--color-primary-light))] text-[hsl(var(--color-primary))]">Our Team</Badge>
            <h1 className="text-4xl lg:text-[52px] font-semibold text-[hsl(var(--color-text))] mb-6 leading-tight">
              Top Dentists in Kothrud, Pune – Our Team
            </h1>
            <p className="text-lg lg:text-xl text-[hsl(var(--color-text-muted))] leading-relaxed">
              Skilled, compassionate, and dedicated to your comfort. Our doctors bring years of experience with a patient-first approach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Doctors */}
      <section className="section-spacing">
        <div className="main-container">
          <div className="space-y-24">
            {doctors.map((doctor, i) => (
              <AnimatedSection key={i} delay={i * 0.2}>
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-primary))]/10 to-[hsl(var(--color-primary))]/5 rounded-3xl transform rotate-3"></div>
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="relative rounded-3xl shadow-xl object-cover w-full h-[450px] lg:h-[550px]"
                      />
                    </div>
                  </div>
                  
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <h2 className="text-3xl font-semibold text-[hsl(var(--color-text))] mb-2">{doctor.name}</h2>
                    <p className="text-[hsl(var(--color-primary))] font-medium mb-6">{doctor.role}</p>
                    
                    <p className="text-[hsl(var(--color-text-muted))] leading-relaxed mb-8">{doctor.bio}</p>
                    
                    {/* Qualifications */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                        <h4 className="font-semibold text-[hsl(var(--color-text))]">Qualifications</h4>
                      </div>
                      <ul className="space-y-2">
                        {doctor.qualifications.map((q, j) => (
                          <li key={j} className="text-[hsl(var(--color-text-muted))] text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-[hsl(var(--color-primary))] rounded-full mt-2 flex-shrink-0"></span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Specializations */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                        <h4 className="font-semibold text-[hsl(var(--color-text))]">Specializations</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specializations.map((s, j) => (
                          <Badge key={j} variant="secondary" className="bg-[hsl(var(--color-primary-light))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-light))]/70">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Philosophy */}
                    <div className="bg-[hsl(var(--color-bg-alt))] rounded-2xl p-6 border-l-4 border-[hsl(var(--color-primary))]">
                      <p className="text-[hsl(var(--color-text))] italic">"{doctor.philosophy}"</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="section-spacing bg-[hsl(var(--color-bg-alt))]">
        <div className="main-container">
          <SectionHeading 
            badge="Our Values"
            title="What Drives Our Team"
            subtitle="The principles that guide everything we do"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Clinical Excellence',
                desc: 'We utilize state-of-the-art dental technology to ensure precision in diagnosis, treatment, and long-term oral health management.'
              },
              {
                icon: Users,
                title: 'Transparent Pricing',
                desc: 'Our patients receive highly transparent treatment roadmaps, detailed clinical explanations, and honest pricing with no hidden costs.'
              },
              {
                icon: Award,
                title: 'Advanced Expertise',
                desc: 'From routine scaling to complex dental implants in Pune, our specialized team is rigorously trained in modern, evidence-based dentistry.'
              }
            ].map((value, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Card className="border-[hsl(var(--color-border))] h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-[hsl(var(--color-primary-light))] rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-7 h-7 text-[hsl(var(--color-primary))]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[hsl(var(--color-text))] mb-3">{value.title}</h3>
                    <p className="text-[hsl(var(--color-text-muted))]">{value.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="main-container-narrow">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] rounded-3xl p-8 lg:p-12 text-center text-[hsl(var(--primary-foreground))]">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                Ready to Meet Our Team?
              </h2>
              <p className="text-[hsl(var(--primary-foreground)/0.8)] mb-8 max-w-xl mx-auto">
                Book your appointment today and experience the difference of compassionate, expert dental care.
              </p>
              <Button 
                size="lg" 
                className="bg-[hsl(var(--background))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-bg-alt))] px-8 py-6 text-base font-medium"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book Your Appointment
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
