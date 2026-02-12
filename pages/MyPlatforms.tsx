import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Plus, Settings } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';

interface Platform {
  id: string;
  name: string;
  subdomain: string;
  tagline: string;
  description: string;
  color: string;
  pricing: number;
  logo: string;
  createdAt: Date;
  sector: string;
  targetAudience: string;
  status: 'pending' | 'active' | 'setup-requested';
}

const statusPill: Record<Platform['status'], string> = {
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  pending: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  'setup-requested': 'bg-lime-300/12 text-lime-200 border-lime-200/35',
};

export const MyPlatforms: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: '1',
      name: 'AutomateHub',
      subdomain: 'automatehub23.viktron.ai',
      tagline: 'Marketing on Autopilot',
      description: 'AI automation platform helping small businesses streamline operations.',
      color: '#47bb87',
      pricing: 29.99,
      logo: 'A',
      createdAt: new Date(),
      sector: 'Marketing & Advertising',
      targetAudience: 'small business',
      status: 'pending',
    },
  ]);

  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  const handleRequestSetup = (platform: Platform) => {
    setSelectedPlatform(platform);
    setShowContactModal(true);
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowContactModal(false);
    if (selectedPlatform) {
      setPlatforms((prev) =>
        prev.map((p) => (p.id === selectedPlatform.id ? { ...p, status: 'setup-requested' } : p))
      );
    }
  };

  return (
    <Layout>
      <SEO
        title="My Platforms | Viktron"
        description="Manage your white-label and AI automation platforms."
        url="/my-platforms"
      />

      <section className="pt-32 pb-14 px-4">
        <div className="container-custom">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Workspace</p>
              <h1 className="mt-2 text-4xl sm:text-5xl font-semibold text-white">My Platforms</h1>
              <p className="mt-4 text-slate-300 max-w-2xl">
                Track your generated platform instances, request deployment setup, and monitor state.
              </p>
            </div>
            <Link to="/white-label">
              <Button icon={<Plus className="h-4 w-4" />}>Create New Platform</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container-custom">
          {platforms.length === 0 ? (
            <GlassCard className="p-10 text-center">
              <p className="text-white text-xl font-medium">No platforms yet.</p>
              <p className="text-slate-300 mt-2">Create your first deployment template.</p>
              <Link to="/white-label" className="inline-block mt-6">
                <Button icon={<Plus className="h-4 w-4" />}>Create Platform</Button>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {platforms.map((platform) => (
                <motion.div key={platform.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                  <GlassCard className="p-6 h-full">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="h-12 w-12 rounded-xl flex items-center justify-center text-sm font-semibold text-black"
                          style={{ backgroundColor: platform.color }}
                        >
                          {platform.logo}
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-white">{platform.name}</h3>
                          <p className="text-sm text-slate-300">{platform.tagline}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-[11px] uppercase tracking-[0.14em] rounded-full border ${statusPill[platform.status]}`}>
                        {platform.status.replace('-', ' ')}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-slate-300 leading-relaxed">{platform.description}</p>

                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 uppercase tracking-[0.12em] text-[11px]">Subdomain</p>
                        <a
                          href={`https://${platform.subdomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-lime-200 hover:text-lime-100"
                        >
                          {platform.subdomain}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-[0.12em] text-[11px]">Pricing</p>
                        <p className="mt-1 text-white">${platform.pricing}/seat</p>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-[0.12em] text-[11px]">Sector</p>
                        <p className="mt-1 text-white">{platform.sector}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-[0.12em] text-[11px]">Audience</p>
                        <p className="mt-1 text-white capitalize">{platform.targetAudience}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {platform.status === 'pending' ? (
                        <button
                          onClick={() => handleRequestSetup(platform)}
                          className="btn-primary text-xs"
                        >
                          <Mail className="h-4 w-4" />
                          Request Setup
                        </button>
                      ) : null}
                      {platform.status === 'active' ? (
                        <>
                          <button className="btn-secondary text-xs">
                            <Settings className="h-4 w-4" />
                            Settings
                          </button>
                          <a
                            href={`https://${platform.subdomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-xs inline-flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit
                          </a>
                        </>
                      ) : null}
                      {platform.status === 'setup-requested' ? (
                        <span className="px-4 py-2 rounded-xl border border-lime-300/30 bg-lime-300/10 text-lime-200 text-xs uppercase tracking-[0.12em]">
                          Team notified. We will contact you.
                        </span>
                      ) : null}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showContactModal && selectedPlatform ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg rounded-2xl border border-[#2f3b54] bg-[#111927] p-8"
          >
            <h3 className="text-2xl font-medium text-white">Request Platform Setup</h3>
            <p className="mt-2 text-slate-300">
              We will configure <span className="text-lime-200">{selectedPlatform.name}</span> and send next steps.
            </p>
            <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-lime-300/50"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-lime-300/50"
              />
              <textarea
                rows={3}
                placeholder="Notes"
                className="w-full rounded-xl border border-[#2f3b54] bg-[#182235] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-lime-300/50 resize-none"
              />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowContactModal(false)} className="btn-secondary flex-1 justify-center">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </Layout>
  );
};
