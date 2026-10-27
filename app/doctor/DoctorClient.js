'use client';

import EditorialImage from '@/components/insights/EditorialImage';
import { TeamValuesSection } from '@/components/doctor/TeamValuesSection';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import {
  MessageCircle,
  GraduationCap,
  Award
} from 'lucide-react';
import clinicAssistancePic from "../../public/clinic/clinicAssistancePic.png";

const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';

const fallbackDoctors = [
  {
    personKey: 'sahil',
    name: 'Dr. Sahil Wathodkar',
    role: 'Founder & Co-Owner | Prosthodontist',
    bio: 'Dr. Sahil Wathodkar is a dedicated prosthodontist with focused expertise in the restoration and rehabilitation of missing or worn teeth. He focuses on designing long-lasting, functional, and aesthetic solutions for complex oral health issues. With a strong inclination towards digital dentistry, Dr. Wathodkar integrates modern technology into treatment planning to enhance accuracy, predictability, and patient outcomes.',
    qualifications: [],
    specializations: [],
    philosophy: 'My focus is on precision and the preservation of natural tooth structure. High-quality dental care requires advanced technology and a deep commitment to patient-centric results.'
  },
  {
    personKey: 'aishwarya',
    name: 'Dr. Aishwarya Kulkarni Wathodkar',
    role: 'Co-Owner | General & Family Dentist',
    bio: 'Guided by the belief that “A better life starts with a smile,” Dr. Aishwarya is committed to helping patients achieve and maintain healthy, confident teeth. Her approach is rooted in thorough diagnosis, gentle care, and meticulous attention to comfort at every step of the treatment journey.',
    qualifications: [],
    specializations: [],
    philosophy: 'I emphasize clear communication and proactive preventive care. Every patient deserves a safe, thoughtful, and comfortable dental experience tailored to their unique needs.'
  }
];

const staff = [
  {
    name: 'Ms. Manasi',
    role: 'Chairside Dental Assistant & Front Desk Coordinator',
    image: clinicAssistancePic, // Placeholder for the image shared
    bio: 'Ms. Manasi plays a vital role in ensuring that every patient’s experience at Aesthedent is smooth and well-coordinated. With over 4 years of clinical experience, she is highly skilled in assisting during diverse dental procedures and maintaining strict sterilization protocols. She also manages patient coordination, ensuring clear communication from appointment scheduling to treatment completion.',
    specialties: ['Clinical Assisting', 'Sterilization Protocols', 'Patient Coordination', 'Front Desk Management']
  }
];

export default function DoctorPage({ backlinkSection, presentation = {}, doctorNarratives = [], teamValues = null }) {
  const doctors = fallbackDoctors.map((doctor, index) => {
    const copy = doctorNarratives.find((item) => item.slug === doctor.personKey);
    return copy ? { ...doctor, bio: copy.bio, philosophy: copy.philosophy, specializations: copy.specializations ?? [], qualifications: (copy.qualifications ?? []).map(qualification => qualification.label), portrait: copy.portrait } : doctor;
  });
  return (
    <PageWrapper backlinkSection={backlinkSection}>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[hsl(var(--color-primary-light))] to-[hsl(var(--background))]">
        <div className="main-container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-[hsl(var(--color-primary-light))] text-[hsl(var(--color-primary))]">{presentation?.hero?.eyebrow ?? <>Our Team</>}</Badge>
            {/* Phase 4H: was "Top Dentists in Kothrud, Pune - Our Team". "Top"
                is an opinion we awarded ourselves -the same self-claim removed
                from the homepage doctors section in Part B. The qualification is
                checkable; the superlative is not. */}
            <h1 className="text-4xl lg:text-[52px] font-semibold text-[hsl(var(--color-text))] mb-6 leading-tight">
              Prosthodontist and dentists in Kothrud, Pune
            </h1>
            <p className="text-lg lg:text-xl text-[hsl(var(--color-text-muted))] leading-relaxed">
              {presentation?.hero?.intro ?? <>Professional, compassionate, and devoted to your comfort. Our doctors bring years of experience with a patient-first approach.
            </>}</p>
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
                      <EditorialImage
                        src=""
                        alt={doctor.name}
                        width={600}
                        height={750}
                        className="relative rounded-3xl shadow-xl object-cover w-full h-[450px] lg:h-[550px]"
                        priority={i === 0} imageOverride={doctor.portrait} cropWidth={600} cropHeight={750} cmsOnly
                      />
                    </div>
                  </div>

                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <h2 className="text-3xl font-semibold text-[hsl(var(--color-text))] mb-2">{doctor.name}</h2>
                    <p className="text-[hsl(var(--color-primary))] font-medium mb-6">{doctor.role}</p>

                    <p className="text-[hsl(var(--color-text-muted))] leading-relaxed mb-8">{doctor.bio}</p>

                    {/* Qualifications */}
                    {doctor.qualifications.length > 0 && <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                        <h3 className="font-semibold text-[hsl(var(--color-text))]">Qualifications</h3>
                      </div>
                      <ul className="space-y-2">
                        {doctor.qualifications.map((q, j) => (
                          <li key={j} className="text-[hsl(var(--color-text-muted))] text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-[hsl(var(--color-primary))] rounded-full mt-2 flex-shrink-0"></span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>}

                    {/* Specializations */}
                    {doctor.specializations.length > 0 && <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                        <h3 className="font-semibold text-[hsl(var(--color-text))]">Specializations</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specializations.map((specialization) => (
                          <Badge key={specialization._key} variant="secondary" className="bg-[hsl(var(--color-primary-light))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-light))]/70">
                            {specialization.title}
                          </Badge>
                        ))}
                      </div>
                    </div>}

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

      {/* Care & Support Team */}
      <section className="section-spacing pt-0">
        <div className="main-container">
          <SectionHeading
            badge={presentation?.support?.eyebrow ?? "Clinical Excellence"}
            title={presentation?.support?.heading ?? "Our Dedicated Support Team"}
            subtitle={presentation?.support?.intro ?? "The professionals who make your clinical experience seamless"}
          />

          <div className="grid lg:grid-cols-1 max-w-4xl mx-auto">
            {staff.map((member, i) => (
              <AnimatedSection key={i} delay={0.1}>
                <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[hsl(var(--color-border))] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 relative flex-shrink-0">
                      <div className="absolute inset-0 bg-[hsl(var(--color-primary))]/10 rounded-2xl transform rotate-6"></div>
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={160}
                        height={160}
                        className="relative w-full h-full object-cover rounded-2xl shadow-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-[hsl(var(--color-text))] mb-1">{member.name}</h3>
                      <p className="text-[hsl(var(--color-primary))] font-medium mb-4">{member.role}</p>
                      <p className="text-[hsl(var(--color-text-muted))] leading-relaxed mb-6 italic">{member.bio}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {member.specialties.map((s, j) => (
                          <Badge key={j} variant="outline" className="border-[hsl(var(--color-primary))]/20 text-[hsl(var(--color-primary))]">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      <TeamValuesSection values={teamValues} legacy={presentation?.values} />

      {/* CTA */}
      <section className="section-spacing">
        <div className="main-container-narrow">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] rounded-3xl p-8 lg:p-12 text-center text-[hsl(var(--primary-foreground))]">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                {presentation?.closing?.heading ?? <>Ready to Meet Our Team?
              </>}</h2>
              <p className="text-[hsl(var(--primary-foreground)/0.8)] mb-8 max-w-xl mx-auto">
                {presentation?.closing?.intro ?? <>Book your appointment today and experience the difference of compassionate, expert dental care.
              </>}</p>
              <Button
                size="lg"
                className="bg-[hsl(var(--background))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-bg-alt))] px-8 py-6 text-base font-medium"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {presentation?.closing?.whatsappLabel ?? <>Book Your Appointment
                </>}</a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
