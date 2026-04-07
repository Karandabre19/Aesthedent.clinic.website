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

const whatsappLink = 'https://wa.me/919876543210?text=' + encodeURIComponent('Hi, I would like to book an appointment at Aesthedent Dental Clinic.');

const doctors = [
  {
    name: 'Dr. Sahil Sharma',
    role: 'Lead Dentist & Founder',
    image: '/assets/doctor-male.jpeg',
    bio: 'Dr. Sahil is the founder of Aesthedent Dental Clinic. With over 12 years of experience, he specializes in dental implants, cosmetic dentistry, and full-mouth rehabilitation. Known for his calm demeanor and thorough explanations, he ensures every patient feels comfortable and well-informed.',
    qualifications: ['BDS - Government Dental College, Mumbai', 'MDS - Prosthodontics, Pune University', 'Fellowship in Implantology, Germany'],
    specializations: ['Dental Implants', 'Full Mouth Rehabilitation', 'Cosmetic Dentistry', 'Smile Design'],
    philosophy: 'I believe in treating patients like family. Every treatment plan is crafted with honesty, transparency, and a focus on long-term oral health.'
  },
  {
    name: 'Dr. Aishwarya Kulkarni',
    role: 'Dental Surgeon',
    image: '/assets/doctor-female.jpeg',
    bio: 'Dr. Aishwarya is known for her gentle, reassuring approach, especially with anxious patients and children. She specializes in painless extractions, pediatric dentistry, and preventive care. Her patients often comment on how comfortable they feel during treatments.',
    qualifications: ['BDS - Bharati Vidyapeeth, Pune', 'Certificate in Pediatric Dentistry', 'Advanced Training in Painless Dentistry'],
    specializations: ['Pediatric Dentistry', 'Painless Extractions', 'Root Canal Treatment', 'Preventive Care'],
    philosophy: 'A visit to the dentist should never be scary. I work to create a warm, welcoming environment where patients of all ages feel safe and cared for.'
  }
];

export default function DoctorPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="main-container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-teal-100 text-teal-700">Our Team</Badge>
            <h1 className="text-4xl lg:text-[52px] font-semibold text-gray-900 mb-6 leading-tight">
              Meet Your Dentists
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
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
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-teal-50 rounded-3xl transform rotate-3"></div>
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="relative rounded-3xl shadow-xl object-cover w-full h-[450px] lg:h-[550px]"
                      />
                    </div>
                  </div>
                  
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">{doctor.name}</h2>
                    <p className="text-teal-600 font-medium mb-6">{doctor.role}</p>
                    
                    <p className="text-gray-600 leading-relaxed mb-8">{doctor.bio}</p>
                    
                    {/* Qualifications */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-teal-600" />
                        <h4 className="font-semibold text-gray-900">Qualifications</h4>
                      </div>
                      <ul className="space-y-2">
                        {doctor.qualifications.map((q, j) => (
                          <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 flex-shrink-0"></span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Specializations */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-teal-600" />
                        <h4 className="font-semibold text-gray-900">Specializations</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specializations.map((s, j) => (
                          <Badge key={j} variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Philosophy */}
                    <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-teal-600">
                      <p className="text-gray-700 italic">"{doctor.philosophy}"</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="section-spacing bg-gray-50">
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
                title: 'Patient Comfort First',
                desc: 'We prioritize your comfort and peace of mind above all else. Every treatment is designed to be as gentle as possible.'
              },
              {
                icon: Users,
                title: 'Honest Communication',
                desc: 'We believe in complete transparency. You will always know exactly what treatment you need and why.'
              },
              {
                icon: Award,
                title: 'Continuous Learning',
                desc: 'Our team regularly updates their skills with the latest techniques and technologies in dental care.'
              }
            ].map((value, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Card className="border-gray-100 h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-7 h-7 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.desc}</p>
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
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                Ready to Meet Our Team?
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Book your appointment today and experience the difference of compassionate, expert dental care.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6 text-base font-medium"
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
