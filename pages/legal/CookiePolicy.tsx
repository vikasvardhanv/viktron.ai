import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Mail, Settings, Shield } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { SEO } from '../../components/ui/SEO';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { Button } from '../../components/ui/Button';
import { useCookieConsent } from '../../context/CookieConsentContext';

const categories = [
  {
    title: 'Necessary',
    badge: 'Always active',
    description: 'Required for login, security, and essential site behavior.',
  },
  {
    title: 'Analytics',
    badge: 'Optional',
    description: 'Helps us understand usage patterns and improve product experience.',
  },
  {
    title: 'Marketing',
    badge: 'Optional',
    description: 'Supports campaign attribution and relevance across channels.',
  },
  {
    title: 'Preferences',
    badge: 'Optional',
    description: 'Stores language and UI preferences for a smoother experience.',
  },
];

const cookieRows = [
  { name: 'viktron_auth_token', purpose: 'Authentication', duration: '7 days', provider: 'Viktron' },
  { name: 'viktron_user', purpose: 'Session profile', duration: '7 days', provider: 'Viktron' },
  { name: 'viktron_cookie_consent', purpose: 'Consent settings', duration: '1 year', provider: 'Viktron' },
  { name: '_ga', purpose: 'Analytics visitor ID', duration: '2 years', provider: 'Google Analytics' },
  { name: '_gid', purpose: 'Analytics session', duration: '24 hours', provider: 'Google Analytics' },
];

export const CookiePolicy: React.FC = () => {
  const { openPreferences } = useCookieConsent();
  const lastUpdated = 'February 12, 2026';

  return (
    <Layout>
      <SEO title="Cookie Policy | Viktron" description="Cookie usage and preference controls for Viktron services." url="/cookies" />

      <section className="pt-32 pb-14 px-4">
        <div className="container-custom max-w-4xl">
          <AnimatedSection>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef3fd]">
              <Cookie className="h-6 w-6 text-[#3768e8]" />
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-[#12223e]">Cookie Policy</h1>
            <p className="mt-2 text-[#5b6d89]">Last updated: {lastUpdated}</p>
            <div className="mt-5">
              <Button variant="secondary" icon={<Settings className="h-4 w-4" />} onClick={openPreferences}>
                Manage Cookie Preferences
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom max-w-4xl">
          <AnimatedSection>
            <article className="rounded-3xl border border-[#d8e2ef] bg-white p-6 sm:p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-[#12223e]">How we use cookies</h2>
                <p className="mt-3 text-[#53637d] leading-relaxed">
                  Cookies are small browser files used to keep the site secure, remember preferences, and improve performance.
                </p>
              </section>

              <section className="grid gap-3 sm:grid-cols-2">
                {categories.map((category) => (
                  <div key={category.title} className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-[#1e3255]">{category.title}</h3>
                      <span className="rounded-full bg-[#e8effd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2f5395]">
                        {category.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#5d6f8d]">{category.description}</p>
                  </div>
                ))}
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#12223e]">Common cookies</h2>
                <div className="mt-3 overflow-x-auto rounded-2xl border border-[#d8e2ef]">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#f8fbff]">
                      <tr>
                        <th className="px-4 py-3 text-left text-[#5c6d89]">Name</th>
                        <th className="px-4 py-3 text-left text-[#5c6d89]">Purpose</th>
                        <th className="px-4 py-3 text-left text-[#5c6d89]">Duration</th>
                        <th className="px-4 py-3 text-left text-[#5c6d89]">Provider</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieRows.map((row) => (
                        <tr key={row.name} className="border-t border-[#e2eaf5]">
                          <td className="px-4 py-3 font-mono text-xs text-[#2d4f95]">{row.name}</td>
                          <td className="px-4 py-3 text-[#53637d]">{row.purpose}</td>
                          <td className="px-4 py-3 text-[#53637d]">{row.duration}</td>
                          <td className="px-4 py-3 text-[#53637d]">{row.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-5">
                <h2 className="text-xl font-semibold text-[#12223e]">Related policies</h2>
                <p className="mt-2 text-[#5d6f8d]">
                  See our <Link to="/privacy" className="text-[#2d4f95] font-semibold">Privacy Policy</Link> and{' '}
                  <Link to="/terms" className="text-[#2d4f95] font-semibold">Terms of Service</Link>.
                </p>
              </section>

              <section className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-5">
                <h2 className="text-xl font-semibold text-[#12223e]">Contact</h2>
                <a href="mailto:privacy@viktron.ai" className="mt-2 inline-flex items-center gap-2 text-[#2d4f95] font-semibold">
                  <Mail className="h-4 w-4" />
                  privacy@viktron.ai
                </a>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#5d6f8d]">
                  <Shield className="h-4 w-4 text-[#3768e8]" />
                  We honor cookie consent preferences in real time.
                </p>
              </section>
            </article>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
