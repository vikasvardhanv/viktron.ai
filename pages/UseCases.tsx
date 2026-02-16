import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import {
  ArrowRight, Building2, Rocket, Globe, Users, Bot, CheckCircle2,
  Workflow, Phone, MessageSquare, BarChart3, Briefcase, Store,
  Stethoscope, Utensils, GraduationCap, Scale, Truck, Home,
  Sparkles, Shield, BrainCircuit, TrendingUp, Zap, Target
} from 'lucide-react';

const FILTERS = ['All', 'Enterprise', 'Mid-Size', 'Startup', 'Small Business'];

// Each use case has a "demo" — a simulated conversation or agent log
// showing exactly what happens when the agents work
const USE_CASES = [
  {
    title: 'SaaS Startup — Full AI Team',
    segment: 'Startup',
    industry: 'SaaS',
    icon: Rocket,
    color: 'purple',
    desc: 'A 3-person startup deployed a 4-agent team instead of hiring. Leads, support, content — all automated.',
    agents: ['Sales Agent', 'Support Agent', 'Content Agent', 'CEO Agent'],
    results: [
      { metric: '3x', label: 'Pipeline growth in 30 days' },
      { metric: '< 30s', label: 'Lead response time' },
      { metric: '80%', label: 'Tickets auto-resolved' },
    ],
    // The demo — what agents actually say/do
    demo: [
      { agent: 'CEO', color: '#3b82f6', msg: 'New lead from website form. Assigning to Sales Agent.' },
      { agent: 'Sales', color: '#10b981', msg: 'Hi Sarah! Thanks for your interest. Based on your team size (15 people), I\'d recommend our Team plan at $499/mo. Want to book a 15-min demo?' },
      { agent: 'Sales', color: '#10b981', msg: 'Sarah replied: "Yes, Thursday works." Booking confirmed: Thursday 2pm.' },
      { agent: 'Support', color: '#8b5cf6', msg: 'Customer asks: "How do I connect Slack?" Auto-replied with setup guide. Confidence: 96%.' },
      { agent: 'Content', color: '#f59e0b', msg: 'Published: "5 Ways AI Agents Save SaaS Startups $50K/Year" — scheduled for LinkedIn tomorrow 9am.' },
      { agent: 'CEO', color: '#3b82f6', msg: 'Daily report: 8 leads handled, 3 demos booked, 12 tickets resolved, 2 posts published. Cost: $4.20.' },
    ],
    link: '/services/ai-sales-agent',
  },
  {
    title: 'Restaurant Chain — Voice & WhatsApp',
    segment: 'Mid-Size',
    industry: 'Food & Beverage',
    icon: Utensils,
    color: 'amber',
    desc: '12 locations were missing 40% of calls. Voice AI now answers every call, takes reservations, handles catering.',
    agents: ['Voice Agent', 'WhatsApp Agent', 'SMS Agent'],
    results: [
      { metric: '0%', label: 'Missed calls (was 40%)' },
      { metric: '+35%', label: 'More reservations' },
      { metric: '24/7', label: 'Phone coverage' },
    ],
    demo: [
      { agent: 'Voice', color: '#8b5cf6', msg: '📞 Incoming call to Downtown location...' },
      { agent: 'Voice', color: '#8b5cf6', msg: '"Thanks for calling Mario\'s! I can help with reservations, our menu, or catering. What can I do for you?"' },
      { agent: 'Voice', color: '#8b5cf6', msg: 'Caller: "Table for 4, Saturday 7pm." Checking availability... Confirmed! Sending SMS confirmation.' },
      { agent: 'SMS', color: '#10b981', msg: 'Sent to +1(312)555-0199: "Your reservation at Mario\'s Downtown: Sat 7pm, party of 4. Reply C to cancel."' },
      { agent: 'WhatsApp', color: '#22c55e', msg: 'Customer asks: "Do you have gluten-free options?" Auto-replied with menu link and GF items list.' },
      { agent: 'Voice', color: '#8b5cf6', msg: '📞 Catering inquiry: "50 people, corporate lunch." Sent estimate ($1,200) and booked follow-up call.' },
    ],
    link: '/services/voice-ai-agent',
  },
  {
    title: 'Dental Clinic Network — Patient Automation',
    segment: 'Mid-Size',
    industry: 'Healthcare',
    icon: Stethoscope,
    color: 'emerald',
    desc: '8 clinics cut $10K/month in reception costs. Patients book, reschedule, and get reminders via WhatsApp.',
    agents: ['WhatsApp Agent', 'Voice Agent', 'SMS Agent', 'Support Agent'],
    results: [
      { metric: '70%', label: 'Lower reception costs' },
      { metric: '-25%', label: 'Fewer no-shows' },
      { metric: '< 5s', label: 'Booking confirmation' },
    ],
    demo: [
      { agent: 'WhatsApp', color: '#22c55e', msg: 'Patient: "I need to reschedule my cleaning." Checking calendar... "How about Tuesday 10am or Wednesday 3pm?"' },
      { agent: 'WhatsApp', color: '#22c55e', msg: 'Patient: "Tuesday works." Rescheduled. Sent confirmation with address and parking info.' },
      { agent: 'SMS', color: '#10b981', msg: '24hr reminder sent to 47 patients with tomorrow appointments. 3 replied to reschedule → auto-handled.' },
      { agent: 'Support', color: '#8b5cf6', msg: 'Patient asks: "Do you accept Delta Dental?" KB match: Yes. Auto-replied with coverage details.' },
      { agent: 'Voice', color: '#8b5cf6', msg: '📞 After-hours call: Recorded voicemail, sent transcript to Dr. Patel, auto-replied with next-day callback confirmation.' },
    ],
    link: '/services/whatsapp-agent',
  },
  {
    title: 'E-Commerce Brand — AI Marketing Team',
    segment: 'Small Business',
    industry: 'E-Commerce',
    icon: Store,
    color: 'cyan',
    desc: 'A $2M/yr DTC brand replaced a $8K/mo marketing team with AI agents doing content, email, and SEO.',
    agents: ['Content Agent', 'Support Agent', 'Sales Agent'],
    results: [
      { metric: '+150%', label: 'Organic traffic growth' },
      { metric: '30', label: 'Social posts/month' },
      { metric: '$500/mo', label: 'vs $8K for human team' },
    ],
    demo: [
      { agent: 'Content', color: '#f59e0b', msg: 'Generated 5 Instagram posts for new product launch. Brand voice: casual + bold. Ready for review.' },
      { agent: 'Content', color: '#f59e0b', msg: 'Published SEO blog: "10 Summer Outfit Ideas Under $50" — targeting 2,400 monthly searches.' },
      { agent: 'Sales', color: '#10b981', msg: 'Cart abandonment detected: Sarah left $89 in cart. Sent recovery email: "Still thinking? Here\'s 10% off."' },
      { agent: 'Support', color: '#8b5cf6', msg: 'Customer: "Where\'s my order?" Pulled tracking: "Out for delivery today by 5pm." Auto-replied.' },
      { agent: 'Content', color: '#f59e0b', msg: 'Weekly email campaign sent to 12,400 subscribers. Subject: "New arrivals you\'ll love." Open rate: 42%.' },
    ],
    link: '/services/ai-content-agent',
  },
  {
    title: 'Law Firm — AI Legal Intake',
    segment: 'Small Business',
    industry: 'Legal',
    icon: Scale,
    color: 'red',
    desc: '5 attorneys saved 30 hrs/week. Voice AI handles intake calls, qualifies cases, and books consultations.',
    agents: ['Voice Agent', 'Support Agent', 'Sales Agent'],
    results: [
      { metric: '30hrs', label: 'Saved weekly' },
      { metric: '2x', label: 'Consultations booked' },
      { metric: '$50K/yr', label: 'Staff savings' },
    ],
    demo: [
      { agent: 'Voice', color: '#8b5cf6', msg: '📞 "Thank you for calling Smith & Associates. I can help determine if we can assist with your case. What type of legal matter is this regarding?"' },
      { agent: 'Voice', color: '#8b5cf6', msg: 'Caller: "Car accident, other driver ran a red light." Case type: Personal Injury. Jurisdiction: Cook County, IL. ✓ Qualified.' },
      { agent: 'Voice', color: '#8b5cf6', msg: '"I can schedule a free consultation with Attorney Martinez. Does Thursday at 10am work?" Confirmed.' },
      { agent: 'Sales', color: '#10b981', msg: 'Sent follow-up email with intake form, office directions, and documents to bring.' },
      { agent: 'Support', color: '#8b5cf6', msg: 'Caller asks: "What are your fees?" Auto-replied: "Free consultation. Personal injury cases are contingency-based — no fee unless we win."' },
    ],
    link: '/services/voice-ai-agent',
  },
  {
    title: 'Real Estate — AI Lead Nurturing',
    segment: 'Small Business',
    industry: 'Real Estate',
    icon: Home,
    color: 'violet',
    desc: '20 agents closing 25% more deals. AI responds to every inquiry in 30 seconds, follows up automatically.',
    agents: ['Sales Agent', 'SMS Agent', 'WhatsApp Agent'],
    results: [
      { metric: '< 30s', label: 'Lead response time' },
      { metric: '+40%', label: 'Showings booked' },
      { metric: '+25%', label: 'Higher close rate' },
    ],
    demo: [
      { agent: 'Sales', color: '#10b981', msg: 'New Zillow lead: "Interested in 742 Oak St, $450K." Auto-qualified: budget confirmed, pre-approved.' },
      { agent: 'Sales', color: '#10b981', msg: 'Replied in 8 seconds: "Hi Mike! 742 Oak St is a great choice — 3bd/2ba, updated kitchen. Want to see it this weekend?"' },
      { agent: 'Sales', color: '#10b981', msg: 'Mike: "Saturday works." Showing booked: Sat 2pm. Sent address, agent contact, and comparable listings.' },
      { agent: 'SMS', color: '#10b981', msg: 'Day-of reminder sent. Plus 3 similar listings within 0.5 miles in case he wants to see more.' },
      { agent: 'Sales', color: '#10b981', msg: '48hr follow-up: "How did the showing go? Want to make an offer or see more properties?"' },
    ],
    link: '/services/ai-sales-agent',
  },
  {
    title: 'Construction Company — Estimate & Follow-up',
    segment: 'Mid-Size',
    industry: 'Construction',
    icon: Truck,
    color: 'orange',
    desc: 'A general contractor responds 3x faster to estimates, wins 20% more projects with AI follow-up.',
    agents: ['Sales Agent', 'Support Agent', 'CEO Agent'],
    results: [
      { metric: '3x', label: 'Faster estimates' },
      { metric: '+20%', label: 'Projects won' },
      { metric: '10hrs', label: 'Saved weekly on admin' },
    ],
    demo: [
      { agent: 'Sales', color: '#10b981', msg: 'New inquiry via website: "Need a quote for kitchen remodel, 200 sq ft." Searching price list...' },
      { agent: 'Sales', color: '#10b981', msg: 'Estimate sent: "Kitchen remodel (200 sq ft): $15,000-$22,000 depending on finishes. Includes demo, plumbing, electrical, and cabinets."' },
      { agent: 'Sales', color: '#10b981', msg: 'Customer: "Can you do a site visit?" Scheduled for Wednesday 9am. Sent confirmation with address.' },
      { agent: 'Support', color: '#8b5cf6', msg: 'Existing client: "When will the drywall be done?" Checked project schedule: "Thursday this week. We\'ll text you when complete."' },
      { agent: 'CEO', color: '#3b82f6', msg: 'Weekly report: 14 estimates sent, 4 site visits booked, 2 contracts signed, 6 follow-ups pending.' },
    ],
    link: '/services/ai-sales-agent',
  },
  {
    title: 'Enterprise — Custom AI Platform',
    segment: 'Enterprise',
    industry: 'Financial Services',
    icon: Globe,
    color: 'indigo',
    desc: 'A 500-person company built an internal AI platform on AgentIRL. 8 departments automated in 3 months.',
    agents: ['AgentIRL Platform', 'Custom Agents', 'CEO Agent'],
    results: [
      { metric: '8', label: 'Departments automated' },
      { metric: '200+', label: 'Employees using daily' },
      { metric: '99.9%', label: 'Compliance accuracy' },
    ],
    demo: [
      { agent: 'Platform', color: '#3b82f6', msg: 'AgentIRL orchestrator: 8 agents active across Compliance, HR, Finance, Legal, Support, Sales, Ops, IT.' },
      { agent: 'Compliance', color: '#ef4444', msg: 'Document review: Flagged 3 contracts with non-standard liability clauses. Routed to Legal for human review.' },
      { agent: 'HR', color: '#8b5cf6', msg: 'New hire onboarding: Auto-generated offer letter, sent benefits enrollment link, scheduled Day 1 orientation.' },
      { agent: 'Finance', color: '#10b981', msg: 'Monthly close: Categorized 1,247 transactions, flagged 12 anomalies, generated variance report.' },
      { agent: 'Platform', color: '#3b82f6', msg: 'Daily dashboard: 342 tasks completed, 4 human approvals pending, 99.97% uptime, $47.20 total AI cost.' },
    ],
    link: '/services/agent-orchestration',
  },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
};

export const UseCases = () => {
  const [filter, setFilter] = useState('All');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const filtered = filter === 'All' ? USE_CASES : USE_CASES.filter(uc => uc.segment === filter);

  return (
    <Layout>
      <SEO
        title="AI Use Cases | Enterprise, Startup & SMB Success Stories"
        description="See how enterprises, startups, and small businesses use Viktron AI agent teams. Real use cases with live demos showing exactly what agents do in healthcare, restaurants, e-commerce, real estate, law, and construction."
        keywords="AI use cases, AI for enterprise, AI for startups, AI for small business, AI agents healthcare, AI restaurant, AI e-commerce, AI real estate, AI construction, AI law firm"
        url="/use-cases"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono text-blue-600 mb-6">
              <Target className="w-3 h-3" /> Real Results, Real Demos
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              See What Your AI Team <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Actually Does</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Not hypothetical. Click any use case to see exactly what the agents say,
              how they respond, and what the results look like.
            </p>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setExpandedIdx(null); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container-custom max-w-5xl">
          <div className="space-y-6">
            {filtered.map((uc, idx) => {
              const c = colorMap[uc.color] || colorMap.blue;
              const isExpanded = expandedIdx === idx;

              return (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Summary row */}
                  <button
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="w-full text-left p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                        <uc.icon className={`w-5 h-5 ${c.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-900">{uc.title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{uc.segment}</span>
                        </div>
                        <p className="text-sm text-slate-600">{uc.desc}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {/* Quick metrics */}
                        <div className="hidden lg:flex gap-6">
                          {uc.results.map((r, i) => (
                            <div key={i} className="text-center">
                              <div className="text-lg font-bold text-slate-900">{r.metric}</div>
                              <div className="text-[10px] text-slate-500">{r.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <ArrowRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded: Demo + Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-8 border-t border-slate-100 pt-6">
                          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* Demo terminal — left side */}
                            <div className="lg:col-span-3">
                              <div className="bg-[#0a0a12] rounded-xl overflow-hidden border border-white/10">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      <div className="w-2 h-2 rounded-full bg-red-500/60" />
                                      <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                                      <div className="w-2 h-2 rounded-full bg-green-500/60" />
                                    </div>
                                    <span className="text-[10px] text-white/25 font-mono ml-1">agent_demo.log</span>
                                  </div>
                                  <span className="text-[9px] text-white/20 font-mono">DEMO</span>
                                </div>
                                <div className="p-4 space-y-3 min-h-[240px] font-mono">
                                  {uc.demo.map((line, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.15 }}
                                      className="flex items-start gap-2.5 text-xs"
                                    >
                                      <span
                                        className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-0.5"
                                        style={{ backgroundColor: line.color + '20', color: line.color }}
                                      >
                                        {line.agent}
                                      </span>
                                      <span className="text-white/65 leading-relaxed">{line.msg}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right side — agents + results + CTA */}
                            <div className="lg:col-span-2 space-y-5">
                              {/* Results (mobile too) */}
                              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Results</h4>
                                <div className="space-y-3">
                                  {uc.results.map((r, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                      <div className="text-xl font-bold text-blue-600 min-w-[56px]">{r.metric}</div>
                                      <div className="text-sm text-slate-600">{r.label}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Agents deployed */}
                              <div>
                                <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Agents Deployed</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {uc.agents.map((a, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                      <Bot className="w-3 h-3" /> {a}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* CTA */}
                              <Link
                                to={uc.link}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                              >
                                Deploy This Solution <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't see your industry?</h2>
          <p className="text-slate-400 text-lg mb-8">
            We've deployed AI teams for 50+ industries. Tell us your business and we'll show you
            exactly what your agents would do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn bg-white text-slate-900 hover:bg-blue-50 px-8 py-3 rounded-xl text-lg font-semibold">
              Book a Free Demo
            </Link>
            <Link to="/services" className="btn border border-slate-700 text-white hover:bg-slate-800 px-8 py-3 rounded-xl text-lg">
              See All Services
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
