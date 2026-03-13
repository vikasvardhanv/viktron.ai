import React from 'react';
import { SlidersHorizontal, Trash2, CloudOff, BellOff, Mail } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { AnimatedSection } from '../../components/ui/AnimatedSection';

const choices = [
  {
    icon: <CloudOff className="h-5 w-5 text-blue-500" />,
    title: 'Disable Cloud Sync',
    description:
      'By default, data stays on your device. If you have enabled cloud sync, you can turn it off at any time.',
    action: 'In the app: Settings → Account → Disable Cloud Sync',
  },
  {
    icon: <Trash2 className="h-5 w-5 text-red-500" />,
    title: 'Delete Your Account and Cloud Data',
    description:
      'Permanently deletes your account and all medication data stored on our servers. Local device data is not affected.',
    action: 'In the app: Settings → Account → Delete Account',
  },
  {
    icon: <Trash2 className="h-5 w-5 text-orange-500" />,
    title: 'Clear Local Data',
    description:
      'Removes all medication plans, dose logs, and settings stored on this device. This cannot be undone.',
    action: 'In the app: Settings → Clear Local Data',
  },
  {
    icon: <BellOff className="h-5 w-5 text-purple-500" />,
    title: 'Manage Notifications',
    description:
      'Control whether Medhavn can send dose reminders and refill alerts to your device.',
    action: 'iOS Settings → Notifications → Medhavn',
  },
  {
    icon: <SlidersHorizontal className="h-5 w-5 text-emerald-500" />,
    title: 'Review or Update Consent',
    description:
      'You can review the consent items you accepted during onboarding (educational disclaimer, privacy terms, processing consent).',
    action: 'In the app: Settings → Privacy & Consent',
  },
  {
    icon: <Mail className="h-5 w-5 text-slate-500" />,
    title: 'Request Data Export or Deletion by Email',
    description:
      'If you prefer to handle a data request outside the app, email us and we will process your request within 30 days.',
    action: 'Email: privacy@medhavn.app',
  },
];

export const MedhavnPrivacyChoices: React.FC = () => {
  return (
    <>
      <SEO
        title="Your Privacy Choices | Medhavn"
        description="Manage your Medhavn data — disable cloud sync, delete your account, clear local data, or request export."
        url="/privacy-choices"
      />

      <section className="pt-20 pb-6 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
              <SlidersHorizontal className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              Your Privacy Choices
            </h1>
            <p className="mt-4 text-slate-600 leading-relaxed">
              You are in control of your data. Here is how to manage, limit, or delete what Medhavn stores.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto mt-6 space-y-4">
          {choices.map((choice, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 flex gap-4">
                <div className="mt-0.5 flex-shrink-0">{choice.icon}</div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800 mb-1">{choice.title}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-2">{choice.description}</p>
                  <div className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5">
                    <span className="text-xs text-slate-600 font-mono">{choice.action}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}

          <AnimatedSection delay={0.35}>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-700 leading-relaxed">
              <strong>California, EU, and other jurisdiction residents:</strong> You may have additional rights including access, portability, correction, and objection to processing. Contact{' '}
              <a href="mailto:privacy@medhavn.app" className="underline font-medium">privacy@medhavn.app</a>{' '}
              to exercise any of these rights. We will respond within 30 days.
            </div>
          </AnimatedSection>

          <p className="text-center text-xs text-slate-400 pt-4">
            <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>
            {' · '}
            <a href="/support" className="underline hover:text-slate-600">Support</a>
          </p>
        </div>
      </section>
    </>
  );
};
