import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Zap, Users, Target } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { OnboardingForm } from '../components/OnboardingForm';
import { onboardingService, OnboardingRequest, OnboardingResponse } from '../services/onboardingService';
import { useAuth } from '../context/AuthContext';

type OnboardingStep = 'form' | 'provisioning' | 'success' | 'error';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState<OnboardingStep>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [onboardingData, setOnboardingData] = useState<OnboardingResponse | null>(null);

  // Get redirect path from query params
  const params = new URLSearchParams(location.search);
  const redirectPath = params.get('redirect') || '/dashboard';

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signup?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [user, authLoading, navigate, location.pathname]);

  const handleFormSubmit = async (data: OnboardingRequest) => {
    setError('');
    setIsLoading(true);
    setStep('provisioning');

    try {
      const response = await onboardingService.createOnboarding(data);
      setOnboardingData(response);
      setStep('success');

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate(redirectPath);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to provision agents. Please try again.');
      setStep('error');
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <SEO
        title="Onboard Your AI Team | Viktron AI"
        description="Set up your enterprise AI agent team in minutes. Choose your plan, configure your workspace, and start automating."
        url="/onboarding"
        noindex
      />

      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono mb-4">
              Step {step === 'form' ? '1' : step === 'provisioning' ? '2' : '3'} of 3
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              Set Up Your AI Team
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Let's provision your enterprise AI agents. This takes about a minute.
            </p>
          </motion.div>

          {/* Form Step */}
          {step === 'form' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm"
            >
              <OnboardingForm
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>
          )}

          {/* Provisioning Step */}
          {step === 'provisioning' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm"
            >
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Provisioning Your Team</h2>
                  <p className="text-slate-600">
                    We're setting up your AI agents and configuring your workspace. This usually takes 30-60 seconds.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    Creating team workspace
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    Provisioning agents
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    Configuring integrations
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Step */}
          {step === 'success' && onboardingData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="flex justify-center"
                >
                  <div className="rounded-full bg-emerald-100 p-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Agents Provisioned!</h2>
                  <p className="text-lg text-slate-600">
                    Your AI team is ready to go to work.
                  </p>
                </div>

                {/* Agent Summary */}
                <div className="bg-blue-50 rounded-xl p-6 text-left space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-600 uppercase">Team Details</div>
                    <div className="space-y-2 mt-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Plan Tier:</span>
                        <span className="font-semibold text-slate-900 capitalize">{onboardingData.tier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Team ID:</span>
                        <code className="font-mono text-xs text-slate-500 truncate">{onboardingData.team_id}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span className="font-semibold text-emerald-600 capitalize">{onboardingData.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-blue-200 pt-4">
                    <div className="text-sm font-semibold text-slate-600 uppercase mb-3">Provisioned Agents</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {onboardingData.provisioned_agents.map((agent, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg px-3 py-2 text-sm font-medium text-slate-900 border border-slate-200 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="capitalize">{agent}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500">
                  Redirecting to dashboard in 3 seconds...
                </p>

                <button
                  onClick={() => navigate(redirectPath)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm"
            >
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-4">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Provisioning Failed</h2>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
                <button
                  onClick={() => { setStep('form'); setError(''); setIsLoading(false); }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Features */}
          {step === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { icon: Zap, title: 'Instant Provisioning', desc: 'Your agents go live in seconds' },
                { icon: Users, title: 'Full Team', desc: 'Sales, Support, Content & CEO agents' },
                { icon: Target, title: 'Production Ready', desc: 'Enterprise-grade security & uptime' },
              ].map((feature, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                  <feature.icon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};
