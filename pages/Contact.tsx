import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone, Bot, Shield } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';
import { SchedulingModal } from '../components/SchedulingModal';
import { SendEmailModal, SendEmailModalStatus } from '../components/SendEmailModal';

const contactMethods = [
  {
    icon: <Mail className="h-5 w-5 text-blue-600" />,
    title: 'Email us',
    value: 'info@viktron.ai',
    href: 'mailto:info@viktron.ai',
  },
  {
    icon: <Phone className="h-5 w-5 text-emerald-500" />,
    title: 'Call us',
    value: '+1 (844) 660-8065',
    href: 'tel:+18446608065',
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-indigo-500" />,
    title: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://Wa.me/+16307033569',
  },
];

const serviceOptions = [
  'AI Agent Team (Full)',
  'Voice & Chat Agents',
  'Workflow Automation',
  'Digital Marketing AI',
  'AgentIRL Platform (Enterprise)',
  'AI Audit & Consulting',
];

const faqs = [
  {
    question: 'How fast can we launch?',
    answer: 'Most focused deployments launch in 1-3 weeks. Complex multi-system projects run 4-8 weeks.',
  },
  {
    question: 'Do you support after launch?',
    answer: 'Yes. We provide ongoing optimization, monitoring, and iteration support with dedicated account managers.',
  },
  {
    question: 'Can we start with a pilot?',
    answer: 'Yes. We can define a scoped pilot with clear success metrics before broader rollout.',
  },
  {
    question: 'What industries do you work with?',
    answer: 'We serve restaurants, medical clinics, real estate, legal, e-commerce, SaaS, finance, recruitment, and more.',
  },
  {
    question: 'How does pricing work?',
    answer: 'Plans start at $199/mo for a single agent and scale to $999/mo for full AI teams. Enterprise custom pricing available.',
  },
  {
    question: 'Do agents integrate with our existing tools?',
    answer: 'Yes. We integrate with CRMs, ERPs, Slack, email, calendars, payment systems, and custom APIs out of the box.',
  },
  {
    question: 'Is our data secure?',
    answer: 'Absolutely. All data is encrypted end-to-end, we are SOC 2 ready, and your data never trains our models.',
  },
  {
    question: 'Can we train agents on our own data?',
    answer: 'Yes. Every agent is trained on your brand voice, knowledge base, and business processes before deployment.',
  },
];

const INPUT_CLASS = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 focus:outline-none transition-colors";

export const Contact: React.FC = () => {
  const location = useLocation();
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendModalStatus, setSendModalStatus] = useState<SendEmailModalStatus>('sending');
  const [sendModalMessage, setSendModalMessage] = useState('');
  const [sendModalMailto, setSendModalMailto] = useState<string | undefined>(undefined);
  const supportEmail = 'info@viktron.ai';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subject = params.get('subject');
    if (!subject) return;
    setFormData((prev) => (prev.message.trim() ? prev : { ...prev, message: subject }));
  }, [location.search]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setIsSendModalOpen(true);
    setSendModalStatus('sending');
    setSendModalMessage('Submitting your message to our team…');
    setSendModalMailto(undefined);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ name: '', email: '', company: '', service: '', message: '' });
        if (data.data?.emailSent === false) {
          setSendModalStatus('error');
          setSendModalMessage(data.message || `Thanks for your message. If urgent, email us at ${supportEmail}.`);
          setSendModalMailto(`mailto:${supportEmail}`);
        } else {
          setSendModalStatus('success');
          setSendModalMessage(data.message || "Message sent. We'll get back to you within 24 hours.");
        }
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
        setSendModalStatus('error');
        setSendModalMessage(data.message || `Failed to send message. Please email us at ${supportEmail}.`);
        setSendModalMailto(`mailto:${supportEmail}`);
      }
    } catch {
      setError('Network error. Please try again or email us directly at info@viktron.ai');
      setSendModalStatus('error');
      setSendModalMessage(`Network error. Please email us directly at ${supportEmail}.`);
      setSendModalMailto(`mailto:${supportEmail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SchedulingModal isOpen={isSchedulingOpen} onClose={() => setIsSchedulingOpen(false)} source="contact-page" />
      <SendEmailModal
        isOpen={isSendModalOpen}
        status={sendModalStatus}
        message={sendModalMessage}
        mailto={sendModalMailto}
        onClose={() => setIsSendModalOpen(false)}
      />

      <SEO
        title="Contact Viktron | Deploy Your AI Team"
        description="Talk to Viktron about deploying AI agent teams, voice AI, workflow automation, and the AgentIRL platform for your business."
        url="/contact"
      />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono text-blue-600 mb-6">
              <Bot className="w-3 h-3" /> Let's Talk
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Let's Build Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">AI Team.</span>
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600 leading-relaxed">
              Share your goals and constraints. We'll map practical next steps and a deployment path — typically live in 1-3 weeks.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button icon={<Calendar className="h-4 w-4" />} onClick={() => setIsSchedulingOpen(true)}>
                Book Consultation
              </Button>
              <Link to="/services">
                <Button variant="secondary">Explore Services</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-12 px-4 bg-white">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {contactMethods.map((method) => (
              <StaggerItem key={method.title}>
                <a href={method.href} target={method.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all h-full">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">{method.icon}</div>
                    <h2 className="mt-4 text-xl font-semibold text-slate-900">{method.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{method.value}</p>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="pb-16 px-4 bg-white">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <AnimatedSection>
              <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white">
                <h2 className="text-2xl font-bold text-slate-900">Send a message</h2>
                <p className="mt-2 text-slate-600">We usually respond within one business day.</p>

                {error ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
                ) : null}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={INPUT_CLASS}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Work email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    >
                      <option value="">Select service</option>
                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    name="message"
                    placeholder="What are you trying to automate?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`${INPUT_CLASS} resize-none`}
                  />

                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <div className="space-y-4">
                {/* Availability */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500">Availability</p>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      Mon-Fri, 9:00 AM - 6:00 PM CST
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Chicago, IL (remote-first team)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Typical response: same business day
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500">FAQ</p>
                  <div className="mt-4 space-y-3">
                    {faqs.map((faq) => (
                      <div key={faq.question} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                        <p className="mt-1 text-sm text-slate-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Enterprise-grade security</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">End-to-end encrypted. SOC 2 ready. Your data never trains our models.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};
