import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, MapPin } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { SEO } from '../../components/ui/SEO';
import { AnimatedSection } from '../../components/ui/AnimatedSection';

const sections = [
  {
    title: '1. Acceptance',
    points: [
      'By accessing Viktron services, you agree to these Terms and associated policies.',
      'If you do not agree, do not use the services.',
    ],
  },
  {
    title: '2. Service Scope',
    points: [
      'Viktron provides AI agents, automation systems, and related implementation services.',
      'Specific deliverables, timelines, and pricing are defined in project agreements.',
    ],
  },
  {
    title: '3. Account Responsibility',
    points: [
      'You are responsible for account credentials and activity under your account.',
      'Provide accurate information and notify us of unauthorized access.',
    ],
  },
  {
    title: '4. Acceptable Use',
    points: [
      'Do not use services for unlawful, harmful, fraudulent, or abusive activity.',
      'Do not attempt unauthorized access, data extraction, or service disruption.',
    ],
  },
  {
    title: '5. Payments and Billing',
    points: [
      'Payment terms are defined in proposals, contracts, or checkout flows.',
      'Late or failed payments may pause service delivery.',
    ],
  },
  {
    title: '6. IP and Content',
    points: [
      'Viktron retains rights to proprietary platform components and implementation methods.',
      'You retain rights to your submitted data and business content.',
    ],
  },
  {
    title: '7. Liability and Warranty',
    points: [
      'Services are provided on an as-available basis unless otherwise specified in writing.',
      'To the extent permitted by law, liability is limited as described in contractual terms.',
    ],
  },
  {
    title: '8. Termination',
    points: [
      'Either party may terminate according to contract terms or for material breach.',
      'On termination, access and data handling follow agreed retention and export procedures.',
    ],
  },
  {
    title: '9. Governing Law',
    points: ['These terms are governed by the applicable laws specified in your agreement with Viktron.'],
  },
];

export const TermsOfService: React.FC = () => {
  const lastUpdated = 'February 12, 2026';

  return (
    <Layout>
      <SEO title="Terms of Service | Viktron" description="Terms governing use of Viktron services and website." url="/terms" />

      <section className="pt-32 pb-14 px-4">
        <div className="container-custom max-w-4xl">
          <AnimatedSection>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">Terms of Service</h1>
            <p className="mt-2 text-slate-600">Last updated: {lastUpdated}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom max-w-4xl">
          <AnimatedSection>
            <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-semibold text-slate-900">{section.title}</h2>
                  <ul className="mt-3 space-y-2">
                    {section.points.map((point) => (
                      <li key={point} className="text-slate-600 leading-relaxed list-disc ml-5">
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-slate-600">
                  Also review our <Link to="/privacy" className="text-slate-700 font-semibold">Privacy Policy</Link> and{' '}
                  <Link to="/cookies" className="text-slate-700 font-semibold">Cookie Policy</Link>.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
                <div className="mt-3 space-y-2 text-sm">
                  <a href="mailto:legal@viktron.ai" className="inline-flex items-center gap-2 text-slate-700 font-semibold">
                    <Mail className="h-4 w-4" />
                    legal@viktron.ai
                  </a>
                  <p className="inline-flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Viktron, United States
                  </p>
                </div>
              </section>
            </article>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
