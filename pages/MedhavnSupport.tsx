import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  ChevronDown,
  Pill,
  ScanLine,
  Bell,
  ShieldCheck,
  UserCircle,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection } from '../components/ui/AnimatedSection';

const faqs = [
  {
    category: 'Getting Started',
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      {
        q: 'How do I add a medication?',
        a: 'Tap the DoseMap tab, then the + button. You can paste a SIG (prescription text), scan a pill bottle label with your camera, or enter details manually. After reviewing the parsed plan, tap "Add Parsed Medication to Vault" to save it.',
      },
      {
        q: 'Can I add multiple medications at once?',
        a: 'Yes. After adding a medication to Vault, the form automatically resets so you can add another right away. Tap "Done" in the top-right corner when you\'ve finished adding all your medications.',
      },
      {
        q: 'What does "Build Medication Plan" do?',
        a: 'It runs your entered instructions through our medication logic engine to parse the drug name, dose, route, frequency, and duration — then generates a day-by-day schedule and patient-ready directions for review.',
      },
      {
        q: 'Do I need an account to use Medhavn?',
        a: 'No. The app works fully offline and locally without an account. Creating an account lets you back up your medication plans and logs securely.',
      },
    ],
  },
  {
    category: 'Scanning & Input',
    icon: <ScanLine className="h-4 w-4" />,
    items: [
      {
        q: 'How does the bottle label scanner work?',
        a: 'Select "Scan Label/Instructions", point your camera at the prescription label, and tap to capture. The app uses on-device OCR (Vision framework) to extract the text automatically. You can review and edit the text before building your plan.',
      },
      {
        q: 'What if the scan doesn\'t capture text correctly?',
        a: 'Ensure good lighting and hold the camera steady. After scanning, the extracted text appears in the editable text box — you can manually correct any errors before tapping "Build Medication Plan".',
      },
      {
        q: 'Can I upload a PDF or image of a prescription?',
        a: 'Yes. Tap "Upload Text or PDF" to import a file from your device. The app extracts text from PDFs and images automatically, including scanned (image-based) documents.',
      },
      {
        q: 'What is a SIG?',
        a: 'A SIG is the medication instruction shorthand written by prescribers — for example, "Take 1 tablet by mouth twice daily for 7 days." You can paste this directly from a pharmacy receipt or insurance document.',
      },
    ],
  },
  {
    category: 'Schedules & Reminders',
    icon: <Bell className="h-4 w-4" />,
    items: [
      {
        q: 'How are dose times assigned?',
        a: 'Times are set during manual entry or inferred from your instruction text. For example, "twice daily" defaults to 8:00 AM and 8:00 PM. You can adjust these at any time from the medication edit screen.',
      },
      {
        q: 'What does PRN mean?',
        a: '"PRN" (pro re nata) means "as needed." These medications don\'t have fixed times — you log them when taken, subject to a maximum daily dose and minimum time between doses.',
      },
      {
        q: 'How do I mark a dose as taken or skipped?',
        a: 'On the DoseMap tab, find the medication under its time block (Morning, Afternoon, Evening, Night). Tap "Taken" to log it or "Skip" to record it as missed.',
      },
    ],
  },
  {
    category: 'Account & Privacy',
    icon: <ShieldCheck className="h-4 w-4" />,
    items: [
      {
        q: 'Where is my data stored?',
        a: 'All medication data is stored locally on your device by default. If you create an account and enable cloud sync, plans and logs are encrypted and stored on our secure self-hosted servers.',
      },
      {
        q: 'How do I reset my password?',
        a: 'On the login screen, tap "Forgot password?" and enter your email address. If an account exists for that email, you\'ll receive a reset link.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Settings → Account → Delete Account. This permanently removes all cloud-stored data. Local data on your device must be cleared separately via Settings → Clear Local Data.',
      },
      {
        q: 'Is my medication data shared with third parties?',
        a: 'No. Medhavn does not sell or share your medication data. Processing happens on-device. Cloud sync (if enabled) is encrypted and stored on infrastructure you\'ve consented to.',
      },
    ],
  },
  {
    category: 'Safety & Medical',
    icon: <AlertTriangle className="h-4 w-4" />,
    items: [
      {
        q: 'Is Medhavn a substitute for medical advice?',
        a: 'No. Medhavn is an educational planning tool only. Always confirm medication instructions with your pharmacist or clinician. The app does not provide diagnoses or prescriptions.',
      },
      {
        q: 'What are Safety Flags?',
        a: 'Safety flags appear when the app detects potential issues — such as known drug interactions, unusually high doses, or ambiguous instructions that need clinician confirmation.',
      },
      {
        q: 'What should I do if I see a critical safety flag?',
        a: 'Do not proceed without consulting your pharmacist or prescriber. Critical flags indicate potential harmful interactions or dosing concerns that require professional review.',
      },
    ],
  },
];

const contactMethods = [
  {
    icon: <Mail className="h-5 w-5 text-blue-500" />,
    label: 'Email Support',
    value: 'support@medhavn.app',
    href: 'mailto:support@medhavn.app',
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-emerald-500" />,
    label: 'General Feedback',
    value: 'feedback@medhavn.app',
    href: 'mailto:feedback@medhavn.app',
  },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-slate-800">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MedhavnSupport: React.FC = () => {
  return (
    <>
      <SEO
        title="Support | Medhavn"
        description="Get help with Medhavn — medication scheduling, scanning, accounts, and safety guidance."
        url="/support"
      />

      {/* Header */}
      <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 border border-blue-200 mb-5">
              <Pill className="h-7 w-7 text-blue-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              Medhavn Support
            </h1>
            <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
              Answers to common questions about medication scheduling, scanning, accounts, and safety.
            </p>
          </AnimatedSection>

          {/* Safety notice */}
          <AnimatedSection delay={0.1}>
            <div className="mt-6 inline-flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left max-w-xl">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Medical disclaimer:</strong> Medhavn is for educational planning only and is not a substitute for professional medical advice. Always confirm medication instructions with your pharmacist or clinician.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((section, si) => (
            <AnimatedSection key={si} delay={si * 0.05}>
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <span className="text-slate-500">{section.icon}</span>
                  <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    {section.category}
                  </h2>
                </div>
                <div className="px-5">
                  {section.items.map((item, ii) => (
                    <FaqItem key={ii} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h2 className="text-base font-semibold text-slate-800">Still need help?</h2>
              </div>
              <p className="text-sm text-slate-500 mb-5">
                If you can't find an answer above, reach out and we'll get back to you within one business day.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {contactMethods.map((method, i) => (
                  <a
                    key={i}
                    href={method.href}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    {method.icon}
                    <div>
                      <p className="text-xs text-slate-500">{method.label}</p>
                      <p className="text-sm font-medium text-slate-800">{method.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Quick tips */}
          <AnimatedSection delay={0.1}>
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-emerald-800">Quick tips for best results</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Include drug name, dose, route, and frequency for accurate parsing.',
                  'Use good lighting when scanning pill bottle labels.',
                  'Review all Safety Flags before adding a medication to Vault.',
                  'Mark doses as Taken or Skipped daily to track adherence.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-emerald-700">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <p className="mt-6 text-center text-xs text-slate-400">
            Medhavn — Educational medication planning for patients and caregivers.{' '}
            <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>
          </p>
        </div>
      </section>
    </>
  );
};
