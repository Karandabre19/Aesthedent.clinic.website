'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedSection from '@/components/ui/AnimatedSection';
import InsightsSection from '@/components/sections/InsightsSection';

// Insights data - can be moved to a separate file or fetched from CMS
const insightsData = {
  'dental-implants-cost-pune': {
    title: 'How much do dental implants cost in Pune?',
    category: 'Dental Implants',
    readTime: '5 min read',
    date: 'March 15, 2024',
    image: 'https://images.pexels.com/photos/6627566/pexels-photo-6627566.jpeg?auto=compress&cs=tinysrgb&w=1200',
    content: `
      <p class="lead">Dental implants are one of the most effective solutions for missing teeth, but understanding the cost can be confusing. Here is a transparent breakdown of what you can expect in Pune.</p>
      
      <h2>What affects dental implant pricing?</h2>
      <p>The cost of dental implants varies based on several factors:</p>
      <ul>
        <li><strong>Type of implant:</strong> Standard titanium implants vs. premium brands</li>
        <li><strong>Number of implants needed:</strong> Single tooth vs. multiple teeth</li>
        <li><strong>Bone grafting requirements:</strong> Additional procedures if bone density is low</li>
        <li><strong>Crown material:</strong> Porcelain, zirconia, or metal-ceramic options</li>
        <li><strong>Clinic expertise:</strong> Experience of the dental surgeon</li>
      </ul>

      <h2>Average cost range in Pune</h2>
      <p>In Pune, dental implant costs typically range from Rs. 25,000 to Rs. 60,000 per implant, depending on the factors mentioned above. At Aesthedent, we provide transparent pricing with no hidden costs.</p>

      <h2>Why quality matters</h2>
      <p>While it might be tempting to choose the cheapest option, dental implants are a long-term investment in your oral health. Quality implants from reputable manufacturers, placed by experienced surgeons, can last a lifetime with proper care.</p>

      <h2>What is included in the cost?</h2>
      <p>At Aesthedent, our implant package includes:</p>
      <ul>
        <li>Initial consultation and 3D imaging</li>
        <li>The implant fixture itself</li>
        <li>Abutment and crown</li>
        <li>Follow-up appointments</li>
        <li>Post-procedure care guidance</li>
      </ul>

      <h2>Financing options</h2>
      <p>We understand that dental implants are a significant investment. That is why we offer flexible payment plans and can help you explore financing options to make quality dental care accessible.</p>
    `,
  },
  'root-canal-pain-myths': {
    title: 'Is root canal treatment painful?',
    category: 'Root Canal',
    readTime: '4 min read',
    date: 'March 10, 2024',
    image: 'https://images.pexels.com/photos/6502019/pexels-photo-6502019.jpeg?auto=compress&cs=tinysrgb&w=1200',
    content: `
      <p class="lead">The phrase "root canal" often triggers fear, but modern root canal treatment is nothing like the horror stories. Here is the truth about what to expect.</p>
      
      <h2>The myth vs. reality</h2>
      <p>The biggest misconception about root canals is that they are extremely painful. In reality, root canal treatment relieves pain—it does not cause it. The pain you feel before treatment is from the infected tooth, not the procedure itself.</p>

      <h2>What modern technology has changed</h2>
      <p>Today's root canal procedures benefit from:</p>
      <ul>
        <li><strong>Advanced anesthesia:</strong> More effective numbing techniques</li>
        <li><strong>Precise imaging:</strong> 3D scans for accurate treatment</li>
        <li><strong>Modern instruments:</strong> Faster, more efficient cleaning</li>
        <li><strong>Better materials:</strong> Superior sealing and filling options</li>
      </ul>

      <h2>What to actually expect</h2>
      <p>Most patients describe the experience as similar to getting a filling. You will feel pressure but not pain. The procedure typically takes 1-2 hours, and you can return to normal activities the same day.</p>

      <h2>After the procedure</h2>
      <p>Some mild discomfort for a few days is normal and can be managed with over-the-counter pain medication. This is far less than the pain of an untreated infected tooth.</p>
    `,
  },
  'best-dentist-kothrud-pune': {
    title: 'How to find a good dentist in Kothrud',
    category: 'Dental Care',
    readTime: '3 min read',
    date: 'March 5, 2024',
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1200',
    content: `
      <p class="lead">Finding the right dentist is about more than just location. Here is what to look for when choosing a dentist in Kothrud, Pune.</p>
      
      <h2>Qualifications and experience</h2>
      <p>Check for proper dental qualifications (BDS, MDS) and look for dentists with specialized training in areas relevant to your needs. Experience matters, especially for complex procedures.</p>

      <h2>Red flags to watch for</h2>
      <ul>
        <li>Pushing unnecessary treatments</li>
        <li>Unclear pricing or hidden costs</li>
        <li>Rushing through appointments</li>
        <li>Not explaining procedures clearly</li>
        <li>Outdated equipment or facilities</li>
      </ul>

      <h2>Questions to ask</h2>
      <p>During your first visit, ask about:</p>
      <ul>
        <li>Treatment options and alternatives</li>
        <li>Complete cost breakdown</li>
        <li>Emergency availability</li>
        <li>Sterilization practices</li>
        <li>Payment plans or insurance acceptance</li>
      </ul>

      <h2>The importance of comfort</h2>
      <p>A good dentist makes you feel comfortable and heard. They should take time to explain things, answer your questions, and never make you feel rushed or judged.</p>
    `,
  },
  'teeth-whitening-safety': {
    title: 'Is teeth whitening safe for your enamel?',
    category: 'Cosmetic',
    readTime: '4 min read',
    date: 'February 28, 2024',
    image: 'https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=1200',
    content: `
      <p class="lead">Everyone wants a brighter smile, but is teeth whitening safe? Here is what you need to know about professional whitening versus at-home options.</p>
      
      <h2>Professional vs. at-home whitening</h2>
      <p>Professional whitening uses higher-concentration peroxide gels under controlled conditions, making it both safer and more effective than most at-home options.</p>

      <h2>Is it safe for enamel?</h2>
      <p>When done correctly, professional teeth whitening does not damage enamel. The key is proper application and not overdoing treatments. However, overuse of whitening products can lead to sensitivity and enamel wear.</p>

      <h2>What dentists recommend</h2>
      <ul>
        <li>Get a dental checkup before whitening</li>
        <li>Use professional-grade products</li>
        <li>Follow recommended treatment schedules</li>
        <li>Avoid excessive whitening</li>
        <li>Maintain results with good oral hygiene</li>
      </ul>

      <h2>Managing sensitivity</h2>
      <p>Some sensitivity after whitening is normal and temporary. Using a desensitizing toothpaste before and after treatment can help minimize discomfort.</p>
    `,
  },
  'dental-anxiety-tips': {
    title: 'Afraid of the dentist? Here is how we help',
    category: 'Patient Care',
    readTime: '4 min read',
    date: 'February 20, 2024',
    image: 'https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=1200',
    content: `
      <p class="lead">Dental anxiety is more common than you think. At Aesthedent, we have developed specific approaches to help anxious patients feel comfortable and in control.</p>
      
      <h2>Understanding dental anxiety</h2>
      <p>Fear of the dentist often stems from past negative experiences, fear of pain, or feeling out of control. Recognizing these triggers is the first step to addressing them.</p>

      <h2>How we help at Aesthedent</h2>
      <ul>
        <li><strong>Clear communication:</strong> We explain everything before we do it</li>
        <li><strong>Control signals:</strong> Raise your hand anytime to pause</li>
        <li><strong>Comfortable environment:</strong> Calming music and a relaxed atmosphere</li>
        <li><strong>Gentle techniques:</strong> Modern, minimally invasive approaches</li>
        <li><strong>Sedation options:</strong> For those who need extra help relaxing</li>
      </ul>

      <h2>Tips for managing anxiety</h2>
      <p>Before your appointment:</p>
      <ul>
        <li>Share your fears with your dentist</li>
        <li>Schedule morning appointments when you are less tired</li>
        <li>Bring headphones and calming music</li>
        <li>Practice deep breathing exercises</li>
        <li>Consider bringing a supportive friend or family member</li>
      </ul>
    `,
  },
  'when-to-get-braces': {
    title: 'When is the right time to get braces?',
    category: 'Orthodontics',
    readTime: '5 min read',
    date: 'February 15, 2024',
    image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=1200',
    content: `
      <p class="lead">Orthodontic treatment can benefit people of all ages, but timing can affect the approach and duration. Here is what to consider at different life stages.</p>
      
      <h2>For children and teens</h2>
      <p>The ideal time for an orthodontic evaluation is around age 7. However, treatment typically begins between ages 10-14, when most permanent teeth have erupted but the jaw is still growing.</p>

      <h2>Adult orthodontics</h2>
      <p>It is never too late for braces. Adult orthodontic treatment is increasingly common and effective. Options like clear aligners make treatment more discreet for working professionals.</p>

      <h2>Treatment options today</h2>
      <ul>
        <li><strong>Traditional braces:</strong> Most effective for complex cases</li>
        <li><strong>Ceramic braces:</strong> Less visible than metal</li>
        <li><strong>Lingual braces:</strong> Hidden behind teeth</li>
        <li><strong>Clear aligners:</strong> Removable and nearly invisible</li>
      </ul>

      <h2>What to expect</h2>
      <p>Treatment duration varies from 6 months to 3 years depending on complexity. Regular adjustments are needed, typically every 4-8 weeks.</p>

      <h2>Making the decision</h2>
      <p>The best time to get braces is when you are ready to commit to the process. Good oral hygiene and regular appointments are essential for success.</p>
    `,
  },
};

const whatsappLink = 'https://api.whatsapp.com/send?phone=919309816336&text=Hello%2C%20Aesthedent%20Dental%20Clinic.%0AI%20would%20like%20to%20book%20an%20appointment.';

export default function InsightArticlePage() {
  const params = useParams();
  const slug = params.slug;
  const article = insightsData[slug];

  // Fallback for unknown slugs
  if (!article) {
    return (
      <PageWrapper>
        <section className="pt-32 pb-20 min-h-screen">
          <div className="main-container text-center">
            <h1 className="text-3xl font-bold text-[hsl(var(--color-text))] mb-4">
              Article not found
            </h1>
            <p className="text-[hsl(var(--color-text-muted))] mb-8">
              The article you are looking for does not exist.
            </p>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-[hsl(var(--primary))] font-semibold hover:text-[hsl(var(--primary-dark))] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all insights
            </Link>
          </div>
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="pt-32 pb-8 sm:pt-36 sm:pb-12 bg-gradient-to-b from-[hsl(var(--bg-alt))] to-white">
        <div className="main-container">
          <AnimatedSection>
            <Link 
              href="/insights"
              className="inline-flex items-center gap-2 text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--primary))] transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to insights
            </Link>
            
            <div className="max-w-3xl">
              <span className="inline-block mb-4 px-3 py-1.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-xs font-semibold rounded-full uppercase tracking-wider">
                {article.category}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[hsl(var(--color-text))] leading-tight mb-6">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[hsl(var(--color-text-muted))] text-sm">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-8 sm:pb-12 bg-white">
        <div className="main-container">
          <AnimatedSection>
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="main-container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <AnimatedSection className="lg:col-span-3">
              <article 
                className="prose prose-lg max-w-none
                  prose-headings:text-[hsl(var(--color-text))] prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-p:text-[hsl(var(--color-text-muted))] prose-p:leading-relaxed
                  prose-a:text-[hsl(var(--primary))] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[hsl(var(--color-text))]
                  prose-ul:my-4 prose-li:text-[hsl(var(--color-text-muted))] prose-li:my-1
                  [&_.lead]:text-xl [&_.lead]:text-[hsl(var(--color-text))] [&_.lead]:leading-relaxed [&_.lead]:mb-8
                "
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </AnimatedSection>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32">
                <AnimatedSection>
                  <div className="p-6 rounded-2xl bg-[hsl(var(--bg-alt))] border border-[hsl(var(--border))]">
                    <h3 className="text-lg font-bold text-[hsl(var(--color-text))] mb-3">
                      Have questions?
                    </h3>
                    <p className="text-sm text-[hsl(var(--color-text-muted))] mb-5">
                      Our team is here to help you understand your dental health better.
                    </p>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--accent-foreground))] font-semibold rounded-lg transition-all duration-300 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat with us
                    </a>
                  </div>
                </AnimatedSection>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <InsightsSection 
        title="More insights"
        subtitle="Continue exploring our knowledge hub"
        limit={3}
        variant="compact"
        showViewAll={true}
      />
    </PageWrapper>
  );
}
