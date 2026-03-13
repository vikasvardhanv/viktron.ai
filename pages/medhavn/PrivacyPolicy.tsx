import React from 'react';
import { Shield } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { AnimatedSection } from '../../components/ui/AnimatedSection';

const sections = [
  {
    title: '1. What Medhavn Is',
    body: [
      'Medhavn is a personal medication scheduling and adherence tracking application. It helps users organize prescription instructions, generate dose schedules, and log medication intake.',
      'Medhavn is an educational planning tool only. It does not provide medical advice, diagnoses, or prescriptions. Always confirm medication instructions with a licensed pharmacist or clinician.',
    ],
  },
  {
    title: '2. Data Stored Locally on Your Device',
    body: [
      'By default, all medication plans, dose logs, and schedules are stored exclusively on your device using local storage (SQLite and UserDefaults). No data is transmitted externally when you use the app without an account.',
      'Local data includes: medication names, doses, frequencies, schedules, and dose-taken/skipped logs.',
    ],
  },
  {
    title: '3. Account and Cloud Sync (Optional)',
    body: [
      'If you create an account and enable cloud sync, your medication plans and logs are encrypted and stored on Medhavn\'s self-hosted servers. You must explicitly consent to this during onboarding.',
      'Account data includes: email address, hashed password, and (optionally) your full name. Passwords are stored as bcrypt hashes and are never readable by anyone.',
      'Cloud sync can be disabled or your account deleted at any time from Settings → Account.',
    ],
  },
  {
    title: '4. Medication Instruction Processing',
    body: [
      'When you paste, scan, or type medication instructions, they are processed on-device by our medication logic engine to parse dose, frequency, and schedule. This processing does not send your text to external servers.',
      'If you use the drug name autocomplete feature, a search query (drug name only) is sent to the OpenFDA public API to fetch suggestions. No personal or medical data is included in this request.',
    ],
  },
  {
    title: '5. Camera and Document Access',
    body: [
      'The app requests camera access only when you choose to scan a pill bottle label or prescription document. Images are processed on-device using Apple\'s Vision framework and are never uploaded or stored.',
      'Files you upload (PDF, image, text) are read locally and discarded after text extraction. They are not stored or transmitted.',
    ],
  },
  {
    title: '6. Consent Requirements',
    body: [
      'On first launch, the app presents a consent checklist covering: educational-only use, clinician confirmation, privacy terms, and medication processing consent. You must accept all items to proceed.',
      'Your consent choices are stored locally and, if cloud sync is enabled, synced to your account record.',
    ],
  },
  {
    title: '7. No Advertising or Data Selling',
    body: [
      'Medhavn does not display advertisements.',
      'We do not sell, rent, or share your personal or medical data with any third parties for advertising or commercial purposes.',
    ],
  },
  {
    title: '8. Data Retention and Deletion',
    body: [
      'Local data remains on your device until you clear it via Settings → Clear Local Data or uninstall the app.',
      'If you have an account, you can request full deletion of all cloud-stored data by navigating to Settings → Account → Delete Account, or by emailing privacy@medhavn.app.',
      'We will process deletion requests within 30 days.',
    ],
  },
  {
    title: '9. Children\'s Privacy',
    body: [
      'Medhavn is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, contact us at privacy@medhavn.app.',
    ],
  },
  {
    title: '10. Your Rights',
    body: [
      'Depending on your jurisdiction, you may have rights to access, correct, export, or delete your personal data.',
      'To exercise any of these rights, contact us at privacy@medhavn.app or use the in-app account settings.',
    ],
  },
  {
    title: '11. Changes to This Policy',
    body: [
      'We may update this policy as the app evolves. Significant changes will be communicated via an in-app notice. Continued use of the app after changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: '12. Contact',
    body: [
      'For privacy questions or data requests, contact: privacy@medhavn.app',
      'Medhavn is developed and operated by Viktron AI. For general inquiries: info@viktron.ai',
    ],
  },
];

export const MedhavnPrivacyPolicy: React.FC = () => {
  const lastUpdated = 'March 11, 2026';

  return (
    <>
      <SEO
        title="Privacy Policy | Medhavn"
        description="How Medhavn stores, processes, and protects your medication and personal data."
        url="/privacy"
      />

      <section className="pt-20 pb-6 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              Privacy Policy
            </h1>
            <p className="mt-2 text-slate-500 text-sm">Last updated: {lastUpdated}</p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              This policy explains how Medhavn handles your personal and medication data. Medhavn is designed with privacy first — most data never leaves your device.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6 mt-6">
          {sections.map((section, i) => (
            <AnimatedSection key={i} delay={i * 0.03}>
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6">
                <h2 className="text-base font-semibold text-slate-800 mb-3">{section.title}</h2>
                <div className="space-y-2">
                  {section.body.map((para, j) => (
                    <p key={j} className="text-sm text-slate-600 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}

          <p className="text-center text-xs text-slate-400 pt-4">
            Medhavn — Educational medication planning.{' '}
            <a href="/support" className="underline hover:text-slate-600">Support</a>
            {' · '}
            <a href="/privacy-choices" className="underline hover:text-slate-600">Your Privacy Choices</a>
          </p>
        </div>
      </section>
    </>
  );
};
