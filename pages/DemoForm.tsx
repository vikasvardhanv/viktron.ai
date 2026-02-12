import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  LinkIcon,
  Loader2,
  Mail,
  MessageSquare,
  Mic,
  Phone,
  Settings,
  TrendingUp,
  Video,
  Zap,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { Toast } from '../components/ui/Toast';
import { WebsitePreviewFallback } from '../components/ui/WebsitePreviewFallback';
import { sendSMS } from '../services/twilioService';

const API_ENDPOINT = `${import.meta.env.VITE_API_URL || '/api'}/demos/create-demo`;

const useCases = [
  { value: 'customer_support', label: 'Customer Support Chatbot' },
  { value: 'appointment_scheduling', label: 'Appointment Scheduling' },
  { value: 'lead_generation', label: 'Lead Generation & Qualification' },
  { value: 'product_info', label: 'Product Information & FAQ' },
  { value: 'sales_assistant', label: 'Sales Assistant' },
  { value: 'custom', label: 'Custom / Other' },
];

const deliveryOptions = [
  { id: 'sms', value: 'sms', icon: <Phone className="h-4 w-4" />, label: 'SMS' },
  { id: 'email', value: 'email', icon: <Mail className="h-4 w-4" />, label: 'Email' },
  { id: 'link', value: 'link', icon: <LinkIcon className="h-4 w-4" />, label: 'Link' },
];

const features = [
  { icon: <MessageSquare className="h-4 w-4" />, title: 'AI Chat Agents', desc: 'Lead capture and support automation.' },
  { icon: <Mic className="h-4 w-4" />, title: 'Voice Agents', desc: 'Natural phone and voice workflows.' },
  { icon: <Video className="h-4 w-4" />, title: 'Video Agents', desc: 'Interactive guided demos at scale.' },
  { icon: <TrendingUp className="h-4 w-4" />, title: 'Marketing Automation', desc: 'Campaign generation and optimization.' },
  { icon: <Settings className="h-4 w-4" />, title: 'Operations Automation', desc: 'Backend workflows and integrations.' },
];

export const DemoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    website_url: '',
    use_case: '',
  });
  const [delivery, setDelivery] = useState<string[]>(['email', 'link']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [demoLink, setDemoLink] = useState('');
  const [error, setError] = useState('');
  const [showDummyToast, setShowDummyToast] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (value: string) => {
    setDelivery((prev) => (prev.includes(value) ? prev.filter((entry) => entry !== value) : [...prev, value]));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      phone: formData.phone || null,
      company_name: formData.company_name || null,
      website_url: formData.website_url || null,
      delivery: delivery.length > 0 ? delivery : ['link'],
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let result: any = null;
      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        if (formData.website_url) setShowDummyToast(true);
        throw new Error(result?.error || result?.message || `Request failed (${response.status})`);
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Something went wrong');
      }

      setIsSuccess(true);
      setDemoLink(result.demo_link);

      if (delivery.includes('sms') && formData.phone) {
        try {
          await sendSMS({
            to: formData.phone,
            message: `Hi ${formData.name}! Your AI demo is ready: ${result.demo_link} - Viktron.ai`,
          });
        } catch {
          // Non-blocking
        }
      }

      if (formData.website_url && (result?.using_dummy_backend || result?.preview_blank === true)) {
        setShowDummyToast(true);
      }
    } catch (submitError: any) {
      setError(submitError?.message || 'Failed to create demo. Please try again.');
      if (formData.website_url) setShowDummyToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Get Your Free AI Demo | Viktron.ai"
        description="Experience a personalized AI assistant for your business in under 30 seconds."
        url="/demo-form"
      />

      <section className="pt-32 pb-20 px-4">
        <div className="container-custom">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f607b] hover:text-[#213654]">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-7">
              {!isSuccess ? (
                <>
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#12223e]">
                    Generate your live demo in under a minute.
                  </h1>
                  <p className="mt-3 text-[#52637e]">
                    Share your details and we’ll create a custom preview link for your use case.
                  </p>

                  {error ? (
                    <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#f0c4c9] bg-[#fff4f5] p-3 text-[#bb3a48]">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <span className="text-sm">{error}</span>
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Work email"
                      required
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone (optional)"
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    />
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="Company name"
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    />
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      placeholder="Website URL (optional)"
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    />
                    <select
                      name="use_case"
                      value={formData.use_case}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] focus:border-[#7d9fee] focus:outline-none"
                    >
                      <option value="">Select a primary use case</option>
                      {useCases.map((useCase) => (
                        <option key={useCase.value} value={useCase.value}>
                          {useCase.label}
                        </option>
                      ))}
                    </select>

                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6f83a1] mb-2 font-semibold">Delivery</p>
                      <div className="flex flex-wrap gap-2">
                        {deliveryOptions.map((option) => {
                          const active = delivery.includes(option.value);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleDeliveryChange(option.value)}
                              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] ${
                                active
                                  ? 'border-[#8ca9eb] bg-[#e8effd] text-[#2d4f95]'
                                  : 'border-[#d7e1ef] bg-[#f7f9fd] text-[#596b88]'
                              }`}
                            >
                              {option.icon}
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Building demo
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Generate my demo
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-[#b9e9d9] bg-[#e8fbf3]">
                    <CheckCircle className="h-7 w-7 text-[#2f9f78]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#12223e]">Your demo is ready</h2>
                  <p className="mt-2 text-[#54657f]">Open or copy the generated link below.</p>
                  <div className="mt-5 rounded-xl border border-[#d8e2ef] bg-[#f8fbff] px-4 py-3 text-sm text-[#2a477f] break-all">
                    {demoLink}
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <a href={demoLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs">
                      Open demo
                    </a>
                    <button onClick={() => navigator.clipboard.writeText(demoLink)} className="btn-secondary text-xs">
                      Copy link
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <div className="card h-full p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f83a1]">What you get</p>
                <div className="mt-4 space-y-3">
                  {features.map((feature) => (
                    <div key={feature.title} className="rounded-xl border border-[#d8e2ef] bg-[#f8fbff] p-3">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#2d4f95]">
                        {feature.icon}
                        {feature.title}
                      </div>
                      <p className="mt-2 text-sm text-[#566885]">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <WebsitePreviewFallback
                    url={formData.website_url}
                    name={formData.company_name || formData.name || 'Your Company'}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {showDummyToast ? (
        <Toast
          type="info"
          message="Live site preview is unavailable right now. We generated your core demo flow with fallback content."
          isOpen={showDummyToast}
          onClose={() => setShowDummyToast(false)}
        />
      ) : null}
    </Layout>
  );
};
