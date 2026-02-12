import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Shield } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { SEO } from '../../components/ui/SEO';
import { AnimatedSection } from '../../components/ui/AnimatedSection';

const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'We collect information you provide directly, such as name, email, company details, and support messages.',
      'We also collect technical data like browser type, IP address, pages visited, and service interaction data.',
    ],
  },
  {
    title: '2. How We Use Information',
    body: [
      'We use data to deliver services, respond to requests, improve product performance, and maintain security.',
      'With consent, we may use contact information for updates, product announcements, and relevant offers.',
    ],
  },
  {
    title: '3. Cookies and Tracking',
    body: [
      'We use essential cookies for authentication and core functionality.',
      'Optional analytics and marketing cookies are controlled through your cookie preferences.',
    ],
  },
  {
    title: '4. Sharing and Disclosure',
    body: [
      'We do not sell personal data.',
      'We may share information with infrastructure, analytics, and payment providers to operate our services.',
      'We may disclose data when required by law or to protect legitimate rights and security.',
    ],
  },
  {
    title: '5. Data Retention and Security',
    body: [
      'We retain data only as long as necessary for service delivery, legal obligations, and security needs.',
      'We apply technical and organizational controls to protect data, including restricted access and encryption where applicable.',
    ],
  },
  {
    title: '6. Your Rights',
    body: [
      'Depending on your jurisdiction, you may request access, correction, deletion, or export of personal data.',
      'You may also object to certain processing or withdraw consent where processing relies on consent.',
    ],
  },
  {
    title: '7. Policy Updates',
    body: ['We may update this policy as our products and legal requirements evolve. Updated versions are published on this page.'],
  },
];

export const PrivacyPolicy: React.FC = () => {
  const lastUpdated = 'February 12, 2026';

  return (
    <Layout>
      <SEO
        title="Privacy Policy | Viktron"
        description="How Viktron collects, uses, and protects personal information."
        url="/privacy"
      />

      <section className="pt-32 pb-14 px-4">
        <div className="container-custom max-w-4xl">
          <AnimatedSection>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef3fd]">
              <Shield className="h-6 w-6 text-[#3768e8]" />
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-[#12223e]">Privacy Policy</h1>
            <p className="mt-2 text-[#5b6d89]">Last updated: {lastUpdated}</p>
            <p className="mt-4 text-[#53637d] leading-relaxed">
              This policy explains how Viktron handles personal information across our website and services.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom max-w-4xl">
          <AnimatedSection>
            <article className="rounded-3xl border border-[#d8e2ef] bg-white p-6 sm:p-8 space-y-6">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-semibold text-[#12223e]">{section.title}</h2>
                  <div className="mt-3 space-y-2">
                    {section.body.map((text) => (
                      <p key={text} className="text-[#53637d] leading-relaxed">{text}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-5">
                <h2 className="text-xl font-semibold text-[#12223e]">Related policies</h2>
                <p className="mt-2 text-[#5d6f8d]">
                  Review our <Link to="/cookies" className="text-[#2d4f95] font-semibold">Cookie Policy</Link> and{' '}
                  <Link to="/terms" className="text-[#2d4f95] font-semibold">Terms of Service</Link>.
                </p>
              </section>

              <section className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-5">
                <h2 className="text-xl font-semibold text-[#12223e]">Contact</h2>
                <div className="mt-3 space-y-2 text-sm">
                  <a href="mailto:privacy@viktron.ai" className="inline-flex items-center gap-2 text-[#2d4f95] font-semibold">
                    <Mail className="h-4 w-4" />
                    privacy@viktron.ai
                  </a>
                  <p className="inline-flex items-center gap-2 text-[#5d6f8d]">
                    <MapPin className="h-4 w-4 text-[#3768e8]" />
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
