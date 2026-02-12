import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ExternalLink, Settings, Mail, ArrowLeft } from 'lucide-react';

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

export const MyPlatforms: React.FC = () => {
  // This will eventually come from a database/API
  const [platforms, setPlatforms] = useState<Platform[]>([
    // Example platform - replace with actual data
    {
      id: '1',
      name: 'AutomateHub',
      subdomain: 'automatehub23.viktron.ai',
      tagline: 'Marketing on Autopilot',
      description: 'AI automation platform helping small business streamline operations',
      color: '#7C3AED',
      pricing: 29.99,
      logo: '🤖',
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
    // Handle contact form submission
    alert('Setup request submitted! We\'ll contact you soon.');
    setShowContactModal(false);
    
    // Update platform status
    if (selectedPlatform) {
      setPlatforms(platforms.map(p => 
        p.id === selectedPlatform.id 
          ? { ...p, status: 'setup-requested' as const }
          : p
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Platforms</h1>
            <p className="text-white/60">Manage and view your AI automation platforms</p>
          </div>
          <Link
            to="/white-label"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Platform
          </Link>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="container mx-auto px-6 pb-20">
        {platforms.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 rounded-full bg-white/5 mb-6">
              <Plus className="w-12 h-12 text-white/40" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No platforms yet</h3>
            <p className="text-white/60 mb-8">Create your first AI automation platform!</p>
            <Link
              to="/white-label"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Platform
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group"
              >
                {/* Platform Header */}
                <div
                  className="p-6 relative"
                  style={{
                    background: `linear-gradient(135deg, ${platform.color}20 0%, transparent 100%)`,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: platform.color + '20' }}>
                      {platform.logo}
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.status === 'active' && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      )}
                      {platform.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
                          Pending Setup
                        </span>
                      )}
                      {platform.status === 'setup-requested' && (
                        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-semibold border border-sky-500/30">
                          Setup Requested
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{platform.name}</h3>
                  <p className="text-white/60 text-sm mb-3">{platform.tagline}</p>
                  <p className="text-white/40 text-xs line-clamp-2">{platform.description}</p>
                </div>

                {/* Platform Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-white/40 text-xs mb-1">Subdomain</p>
                    <a
                      href={`https://${platform.subdomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-mono text-sm flex items-center gap-2 hover:text-emerald-400 transition-colors"
                    >
                      {platform.subdomain}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/40 text-xs mb-1">Sector</p>
                      <p className="text-white text-sm font-semibold">{platform.sector}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">Pricing</p>
                      <p className="text-white text-sm font-semibold">${platform.pricing}/seat</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Target Audience</p>
                    <p className="text-white text-sm capitalize">{platform.targetAudience}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Created</p>
                    <p className="text-white text-sm">
                      {platform.createdAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                  {platform.status === 'pending' && (
                    <button
                      onClick={() => handleRequestSetup(platform)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Request Setup
                    </button>
                  )}
                  {platform.status === 'active' && (
                    <>
                      <button className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <a
                        href={`https://${platform.subdomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit
                      </a>
                    </>
                  )}
                  {platform.status === 'setup-requested' && (
                    <div className="flex-1 px-4 py-3 rounded-xl bg-sky-500/10 text-sky-400 text-center border border-sky-500/30">
                      We'll contact you soon!
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl border border-white/10 max-w-md w-full p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Request Platform Setup</h3>
            <p className="text-white/60 mb-6">
              We'll set up <strong className="text-white">{selectedPlatform.name}</strong> for you!
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder-white/40"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder-white/40"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder-white/40"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Additional Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder-white/40 resize-none"
                  placeholder="Any specific requirements or questions..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
