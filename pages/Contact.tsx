import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle, Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';
import { SchedulingModal } from '../components/SchedulingModal';
import { SendEmailModal, SendEmailModalStatus } from '../components/SendEmailModal';

const contactMethods = [
  {
    icon: <Mail className="h-5 w-5 text-[#3768e8]" />,
    title: 'Email us',
    value: 'info@viktron.ai',
    href: 'mailto:info@viktron.ai',
  },
  {
    icon: <Phone className="h-5 w-5 text-[#2fa781]" />,
    title: 'Call us',
    value: '+1 (844) 660-8065',
    href: 'tel:+18446608065',
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-[#6b7de8]" />,
    title: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://Wa.me/+16307033569',
  },
];

const serviceOptions = [
  'AI Agents',
  'Workflow Automation',
  'Marketing Automation',
  'Voice Agents',
  'Custom Build',
];

const faqs = [
  {
    question: 'How fast can we launch?',
    answer: 'Most focused deployments launch in 1-3 weeks. Complex multi-system projects run 4-8 weeks.',
  },
  {
    question: 'Do you support after launch?',
    answer: 'Yes. We provide ongoing optimization, monitoring, and iteration support.',
  },
  {
    question: 'Can we start with a pilot?',
    answer: 'Yes. We can define a scoped pilot with clear success metrics before broader rollout.',
  },
];

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
        title="Contact Viktron | Book a Consultation"
        description="Talk to Viktron about AI agents, workflow automation, and growth systems."
        url="/contact"
      />

      <section className="pt-32 pb-12 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-[#12223e]">
              Let’s build your AI stack.
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-[#52637e] leading-relaxed">
              Share your goals and constraints. We’ll map practical next steps and a deployment path.
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

      <section className="pb-12 px-4">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {contactMethods.map((method) => (
              <StaggerItem key={method.title}>
                <a href={method.href} target={method.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  <div className="card p-5 h-full">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3fd]">{method.icon}</div>
                    <h2 className="mt-4 text-xl font-semibold text-[#12223e]">{method.title}</h2>
                    <p className="mt-1 text-sm text-[#53637d]">{method.value}</p>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <AnimatedSection>
              <div className="card p-6 sm:p-7">
                <h2 className="text-2xl font-semibold text-[#12223e]">Send a message</h2>
                <p className="mt-2 text-[#566885]">We usually respond within one business day.</p>

                {error ? (
                  <div className="mt-4 rounded-xl border border-[#f0c4c9] bg-[#fff4f5] p-3 text-sm text-[#bb3a48]">{error}</div>
                ) : null}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Work email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    />
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] focus:border-[#7d9fee] focus:outline-none"
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
                    className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none resize-none"
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
                <div className="card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f83a1]">Availability</p>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[#334a6e]">
                      <Clock className="h-4 w-4 text-[#2fa781]" />
                      Mon-Fri, 9:00 AM - 6:00 PM CST
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#334a6e]">
                      <MapPin className="h-4 w-4 text-[#3768e8]" />
                      Chicago, IL (remote-first team)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#334a6e]">
                      <CheckCircle className="h-4 w-4 text-[#2fa781]" />
                      Typical response: same business day
                    </div>
                  </div>
                </div>

                <div className="card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f83a1]">FAQ</p>
                  <div className="mt-4 space-y-3">
                    {faqs.map((faq) => (
                      <div key={faq.question} className="rounded-xl border border-[#d8e2ef] bg-[#f8fbff] p-3">
                        <p className="text-sm font-semibold text-[#1e3255]">{faq.question}</p>
                        <p className="mt-1 text-sm text-[#596b88]">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};
