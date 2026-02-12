import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle2, HelpCircle, Star, TrendingUp, X, XCircle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: 'Healthcare' | 'Automotive' | 'Retail' | 'Hospitality' | 'Real Estate';
  description: string;
  metrics: { label: string; value: string }[];
  before: string[];
  after: string[];
  image: string;
  tags: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'dental-clinic-automation',
    title: 'Automating patient triage and scheduling',
    client: 'BrightSmile Dental Group',
    industry: 'Healthcare',
    description: 'Implemented a 24/7 AI voice and chat stack for bookings, triage, and insurance verification.',
    metrics: [
      { label: 'Missed calls reduced', value: '98%' },
      { label: 'Booking increase', value: '+45%' },
      { label: 'Admin hours saved', value: '120/mo' },
    ],
    before: ['Reception overloaded by calls', 'Frequent no-shows', 'Manual verification latency', 'No after-hours booking'],
    after: ['AI handles first-line intake', 'Automated reminder loops', 'Instant eligibility checks', '24/7 booking coverage'],
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    tags: ['Voice Agent', 'Scheduling', 'Healthcare'],
  },
  {
    id: 'auto-dealership-leads',
    title: 'Instant lead qualification and test-drive scheduling',
    client: 'Metro City Ford',
    industry: 'Automotive',
    description: 'Built multi-channel lead qualification and scheduling automation across web and WhatsApp.',
    metrics: [
      { label: 'Lead response time', value: '<5s' },
      { label: 'Test drives booked', value: '+300%' },
      { label: 'Cost per lead', value: '-40%' },
    ],
    before: ['Slow callback cycles', 'Poor lead qualification', 'Inconsistent follow-up', 'Weekend lead leakage'],
    after: ['Instant 24/7 qualification', 'Automated calendar booking', 'Nurture sequences', 'Higher sales velocity'],
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
    tags: ['Lead Gen', 'Sales', 'WhatsApp'],
  },
  {
    id: 'salon-booking-system',
    title: 'Stylist matching and retention automation',
    client: 'Luxe Hair Studio',
    industry: 'Retail',
    description: 'Launched personalized booking and product recommendation automation for salon operations.',
    metrics: [
      { label: 'Rebooking rate', value: '85%' },
      { label: 'Retail sales', value: '+25%' },
      { label: 'Phone volume', value: '-70%' },
    ],
    before: ['Wrong service bookings', 'Interrupt-driven operations', 'Low product attach', 'Manual waitlist'],
    after: ['Smart service routing', 'Reduced phone interruptions', 'Product recommendation flows', 'Auto waitlist fill'],
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop',
    tags: ['Booking', 'Retail', 'Personalization'],
  },
  {
    id: 'hotel-concierge',
    title: 'Multilingual AI concierge for hospitality operations',
    client: 'Grand Horizon Hotels',
    industry: 'Hospitality',
    description: 'Automated in-stay requests, upsell triggers, and service routing with multilingual support.',
    metrics: [
      { label: 'Guest rating', value: '4.9/5' },
      { label: 'Response time', value: '<2m' },
      { label: 'Room-service rev.', value: '+18%' },
    ],
    before: ['Front desk overload', 'Long service wait times', 'Missed upsells', 'Language friction'],
    after: ['AI concierge in 50+ languages', 'Instant dispatch routing', 'Upsell prompts', 'Zero-hold guest support'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    tags: ['Hospitality', 'Concierge', 'Multilingual'],
  },
  {
    id: 'real-estate-virtual-tours',
    title: '24/7 property qualification and viewing flow',
    client: 'Summit Realty Group',
    industry: 'Real Estate',
    description: 'Qualified inbound buyers and automated viewing orchestration from virtual tour to handoff.',
    metrics: [
      { label: 'Qualified leads', value: '+45%' },
      { label: 'Viewing show rate', value: '92%' },
      { label: 'Agent time saved', value: '20h/wk' },
    ],
    before: ['Low qualification quality', 'Viewing no-shows', 'Manual follow-up', 'Limited hours'],
    after: ['Structured lead qualification', 'Automated reminders', 'Always-on listing Q&A', 'Higher agent efficiency'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop',
    tags: ['Real Estate', 'Lead Qualification', 'Scheduling'],
  },
];

const INDUSTRIES = ['All', 'Healthcare', 'Automotive', 'Retail', 'Hospitality', 'Real Estate'];

const FAQS = [
  {
    question: 'How quickly can a production agent be launched?',
    answer: 'Most focused deployments are 1-3 weeks. Complex, multi-system builds generally run 4-8 weeks.',
  },
  {
    question: 'Can you integrate with our current CRM and support stack?',
    answer: 'Yes. We connect to common CRMs, calendars, communication channels, and custom APIs.',
  },
  {
    question: 'What happens when AI confidence is low?',
    answer: 'Requests are handed off to humans with context so no conversation state is lost.',
  },
  {
    question: 'Is there ongoing optimization after launch?',
    answer: 'Yes. We monitor outcomes and iterate prompts, routing, and automation logic weekly.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'Viktron gave us a real operating system, not just a chatbot. The conversion lift was immediate.',
    author: 'Sarah Chen',
    role: 'CEO, TechFlow',
  },
  {
    quote: 'We recovered hours every day and improved lead quality at the same time.',
    author: 'Michael Rodriguez',
    role: 'Marketing Director, GrowthLabs',
  },
  {
    quote: 'Execution was clean, fast, and measurable from week one.',
    author: 'Emily Watson',
    role: 'Founder, HealthPlus',
  },
];

export const CaseStudies: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [showAfter, setShowAfter] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const study = CASE_STUDIES.find((entry) => entry.id === id);
    if (!study) return;
    setSelectedStudy(study);
    setShowAfter(true);
  }, [location.hash]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedStudy(null);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  const visibleStudies =
    activeFilter === 'All' ? CASE_STUDIES : CASE_STUDIES.filter((study) => study.industry === activeFilter);

  return (
    <Layout>
      <SEO
        title="Case Studies & Success Stories | Viktron"
        description="See real AI operations results from Viktron client deployments."
        keywords="AI case studies, automation ROI, chatbot success stories"
        url="/case-studies"
      />

      <section className="pt-32 pb-10 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#12223e]">
              Measurable outcomes.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#54657f]">
              A few examples of how we improve response speed, lead quality, and team efficiency in live operations.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="mt-7 flex flex-wrap gap-3">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setActiveFilter(industry)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === industry
                      ? 'bg-[#1e2f50] text-white'
                      : 'border border-[#d5dfed] bg-white text-[#42526c] hover:bg-[#f3f7fd]'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-14 px-4">
        <div className="container-custom">
          <StaggerContainer className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleStudies.map((study) => (
              <StaggerItem key={study.id}>
                <motion.button
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    setSelectedStudy(study);
                    setShowAfter(false);
                  }}
                  className="card h-full overflow-hidden text-left w-full"
                >
                  <div className="h-44 overflow-hidden">
                    <img src={study.image} alt={study.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex rounded-full bg-[#e8effd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2f5395]">
                      {study.industry}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold text-[#12223e]">{study.title}</h3>
                    <p className="mt-1 text-sm text-[#596986]">{study.client}</p>
                    <div className="mt-4 rounded-xl border border-[#d8e2ef] bg-[#f8fbff] p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#2e4f92]">
                        <TrendingUp className="h-4 w-4" />
                        {study.metrics[0].value}
                      </div>
                      <p className="mt-1 text-xs text-[#627695]">{study.metrics[0].label}</p>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2b4d92]">
                      View full case
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-14 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl border border-[#d8e2ef] bg-white p-6">
              <h2 className="text-3xl font-semibold text-[#12223e]">What clients say</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {TESTIMONIALS.map((testimonial) => (
                  <div key={testimonial.author} className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={`${testimonial.author}-${index}`} className="h-4 w-4 fill-[#f3bf45] text-[#f3bf45]" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-[#4f607b]">"{testimonial.quote}"</p>
                    <p className="mt-4 text-sm font-semibold text-[#1a2d4b]">{testimonial.author}</p>
                    <p className="text-xs text-[#6f83a1]">{testimonial.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <AnimatedSection>
              <div className="rounded-3xl border border-[#d8e2ef] bg-white p-6 h-full">
                <h2 className="text-3xl font-semibold text-[#12223e]">FAQ</h2>
                <div className="mt-5 space-y-3">
                  {FAQS.map((faq) => (
                    <div key={faq.question} className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                      <p className="flex items-start gap-2 text-sm font-semibold text-[#223653]">
                        <HelpCircle className="h-4 w-4 mt-0.5 text-[#3768e8]" />
                        {faq.question}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#54657f]">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <div className="rounded-3xl border border-[#d8e2ef] bg-[#f8fbff] p-6 h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7083a1]">Next step</p>
                <h3 className="mt-2 text-3xl font-semibold text-[#12223e]">Plan your own deployment.</h3>
                <p className="mt-3 text-[#54657f] leading-relaxed">
                  Get a scoped recommendation for your channels, handoff model, and initial deployment sequence.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/demo-form">
                    <Button icon={<Calendar className="h-4 w-4" />}>Book Free Consultation</Button>
                  </Link>
                  <Link to="/services">
                    <Button variant="secondary">View Services</Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4"
            onClick={() => setSelectedStudy(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#cfdbeb] bg-white"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-56 overflow-hidden">
                <img src={selectedStudy.image} alt={selectedStudy.title} className="h-full w-full object-cover" />
                <button
                  onClick={() => setSelectedStudy(null)}
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/80 text-[#1d2f4f]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                <span className="inline-flex rounded-full bg-[#e8effd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2f5395]">
                  {selectedStudy.industry}
                </span>
                <h2 className="mt-3 text-3xl font-semibold text-[#12223e]">{selectedStudy.title}</h2>
                <p className="mt-1 text-sm text-[#5f7190]">{selectedStudy.client}</p>
                <p className="mt-3 text-[#4f607b]">{selectedStudy.description}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {selectedStudy.metrics.map((metric) => (
                    <div key={`${selectedStudy.id}-${metric.label}`} className="rounded-xl border border-[#d8e2ef] bg-[#f8fbff] p-3">
                      <p className="text-xl font-semibold text-[#1a2d4b]">{metric.value}</p>
                      <p className="mt-1 text-xs text-[#637794]">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 inline-flex rounded-full border border-[#d8e2ef] bg-[#f8fbff] p-1">
                  <button
                    onClick={() => setShowAfter(false)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      !showAfter ? 'bg-[#ffe9ea] text-[#d23a46]' : 'text-[#60718c]'
                    }`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => setShowAfter(true)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      showAfter ? 'bg-[#e8fbf3] text-[#248b63]' : 'text-[#60718c]'
                    }`}
                  >
                    After
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {!showAfter ? (
                    <motion.div
                      key="before"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="mt-5 space-y-2"
                    >
                      {selectedStudy.before.map((item) => (
                        <div key={`${selectedStudy.id}-before-${item}`} className="flex items-start gap-2 text-sm text-[#5b6c87]">
                          <XCircle className="h-4 w-4 mt-0.5 text-[#cf4c56]" />
                          {item}
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="after"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      className="mt-5 space-y-2"
                    >
                      {selectedStudy.after.map((item) => (
                        <div key={`${selectedStudy.id}-after-${item}`} className="flex items-start gap-2 text-sm text-[#334a6e]">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#2fa781]" />
                          {item}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedStudy.tags.map((tag) => (
                    <span key={`${selectedStudy.id}-${tag}`} className="rounded-full border border-[#d7e1ef] bg-[#f8fbff] px-2.5 py-1 text-xs text-[#5f7190]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
