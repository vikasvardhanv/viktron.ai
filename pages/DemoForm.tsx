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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (value: string) => {
    setDelivery((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (result?.success) {
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
      } else {
        throw new Error(result?.error || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create demo. Please try again.');
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
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-3xl border border-[#2f3b54] bg-[#111a28] p-6 sm:p-8">
                {!isSuccess ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-semibold text-white">
                      Generate a Live Demo in Under a Minute
                    </h1>
                    <p className="mt-3 text-slate-300">
                      Share your business details and we generate a personalized AI preview instantly.
                    </p>

                    {error ? (
                      <div className="mt-5 flex items-start gap-2 rounded-xl border border-rose-300/30 bg-rose-400/10 p-3 text-rose-200">
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
                        className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-lime-200/45"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Work email"
                        required
                        className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-lime-200/45"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone (optional)"
                        className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-lime-200/45"
                      />
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="Company name"
                        className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-lime-200/45"
                      />
                      <input
                        type="url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="Website URL (optional)"
                        className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-lime-200/45"
                      />
                      <select
                        name="use_case"
                        value={formData.use_case}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white focus:outline-none focus:border-lime-200/45"
                      >
                        <option value="">Select a primary use case</option>
                        {useCases.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>

                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-400 mb-2">Delivery</p>
                        <div className="flex flex-wrap gap-2">
                          {deliveryOptions.map((option) => {
                            const active = delivery.includes(option.value);
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleDeliveryChange(option.value)}
                                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.08em] ${
                                  active
                                    ? 'border-lime-200/35 bg-lime-300/12 text-lime-100'
                                    : 'border-[#2f3b54] bg-[#172133] text-slate-300'
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
                            Building Demo
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4" />
                            Generate My Demo
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-lime-200/30 bg-lime-300/15 grid place-items-center">
                      <CheckCircle className="h-7 w-7 text-lime-200" />
                    </div>
                    <h2 className="text-2xl font-medium text-white">Your demo is ready</h2>
                    <p className="mt-2 text-slate-300">Share or open your generated experience below.</p>
                    <div className="mt-6 rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-sm text-lime-200 break-all">
                      {demoLink}
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <a href={demoLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs">
                        Open Demo
                      </a>
                      <button onClick={() => navigator.clipboard.writeText(demoLink)} className="btn-secondary text-xs">
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <div className="rounded-3xl border border-[#2f3b54] bg-[#111a28] p-6 sm:p-8 h-full">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Included in your preview</p>
                <div className="mt-4 space-y-3">
                  {features.map((feature) => (
                    <div key={feature.title} className="rounded-xl border border-[#2f3b54] bg-[#182235] p-3">
                      <div className="inline-flex items-center gap-2 text-lime-200 text-sm font-medium">
                        {feature.icon}
                        {feature.title}
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{feature.desc}</p>
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
