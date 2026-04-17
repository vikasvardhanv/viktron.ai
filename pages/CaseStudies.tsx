import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { ArrowRight, BarChart2, ShieldCheck, Users, Zap, TrendingUp, Award, Lightbulb } from 'lucide-react';

export const CaseStudies = () => {
  return (
    <Layout>
      <SEO
        title="Enterprise AI Agent Case Studies | Viktron"
        description="See how Fortune 500 companies and tech leaders use Viktron's AI agents to achieve 99.9% reliability, reduce costs by 92%, and scale operations. Real customer results inside."
        keywords="AI agent case studies, enterprise automation, customer success stories, AI reliability, business automation ROI"
        url="/case-studies"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono mb-6">
            Customer Success Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How Enterprises Scale with Viktron's AI Agents
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-4">
            From Fortune 500 financial institutions to rapid-growth tech companies, discover how leading organizations achieve 99.9% reliability, reduce operational costs by up to 92%, and scale their teams without adding headcount using Viktron's enterprise AI agent platform.
          </p>
          <div className="flex justify-center gap-6 text-sm text-slate-700 max-w-2xl mx-auto">
            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> 3,000+ workflows deployed</div>
            <div className="flex items-center gap-2"><Award className="w-4 h-4 text-blue-600" /> 99.9% uptime SLA</div>
            <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-blue-600" /> 12+ industries</div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">92%</h3>
              <p className="text-slate-600">Average reduction in processing time across deployments</p>
              <p className="text-sm text-slate-500 mt-2">From manual workflows to AI-powered automation</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">3.2x</h3>
              <p className="text-slate-600">Average productivity increase in first 90 days</p>
              <p className="text-sm text-slate-500 mt-2">Measured across finance, support, and sales teams</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">$850K</h3>
              <p className="text-slate-600">Average annual savings per deployment</p>
              <p className="text-sm text-slate-500 mt-2">Based on 2024 customer ROI analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Real Results from Enterprise Customers</h2>
            <p className="text-lg text-slate-600 max-w-3xl">Our customers span finance, healthcare, e-commerce, and B2B SaaS. Here's how they're transforming their operations with Viktron's AI agents.</p>
          </div>
          <div className="grid grid-cols-1 gap-12">
            {[
              {
                client: "Global FinTech Corp",
                title: "Compliance Audit Automation: 100% Coverage with 92% Time Reduction",
                desc: "A leading $2.3B financial services provider manages regulatory compliance across 40+ jurisdictions. Their legacy audit process required 15 FTEs and took 6-8 weeks per cycle. Using Viktron, they deployed AI agents that autonomously cross-reference regulatory databases, flag anomalies, and generate audit reports in real-time. The system now monitors 10,000+ transactions daily with <0.1% false positive rate, enabling their compliance team to focus on strategic risk management instead of manual reviews.",
                details: [
                  "Integrated with 40+ regulatory databases (SEC, FINRA, OCC, state regulators)",
                  "Real-time transaction monitoring across $40B in daily volume",
                  "Automated audit report generation with regulatory footnotes",
                  "Reduced compliance review cycle from 6 weeks to 2 days"
                ],
                metrics: [
                  { label: "Audit Coverage", value: "100%", desc: "All transactions now reviewed" },
                  { label: "Processing Time", value: "-92%", desc: "From 6 weeks to 2 days" },
                  { label: "False Positives", value: "<0.1%", desc: "ML-trained on 5 years of data" }
                ],
                tags: ["Finance", "Compliance", "Security", "RegTech"],
                image: "/visuals/compliance-audit.jpg",
                icon: ShieldCheck
              },
              {
                client: "TechFlow Enterprise",
                title: "Customer Support AI Integration: 85% Ticket Deflection Rate",
                desc: "TechFlow, a $500M SaaS company, experienced a 300% surge in support volume after launching new products. Their support team (35 agents) was overwhelmed, causing 4-day response times and CSAT scores dropping to 3.2/5. Viktron deployed a multi-agent support system: a Tier-1 bot handles FAQs and resets, a Lead Quality agent triages complex issues with context, and a Insights agent flags product improvements. The system now handles 85% of tickets end-to-end, escalating only truly complex issues with full conversation history to human agents.",
                details: [
                  "Tier-1 AI bot trained on 5,000+ internal KB articles",
                  "Context-aware escalation with full conversation history",
                  "Proactive outreach for known issues before customer reports",
                  "Integration with Zendesk, Salesforce, and Slack for seamless handoff"
                ],
                metrics: [
                  { label: "Ticket Deflection", value: "85%", desc: "Resolved without human contact" },
                  { label: "CSAT Score", value: "4.8/5", desc: "Up from 3.2/5 pre-deployment" },
                  { label: "Resolution Time", value: "2m avg", desc: "Down from 4-day wait" }
                ],
                tags: ["SaaS", "Support", "Automation", "CX"],
                image: "/visuals/tech-support.jpg",
                icon: Users
              },
              {
                client: "GrowthScale Inc",
                title: "Sales Pipeline Optimization: 3x Qualified Leads with 40% Faster Responses",
                desc: "GrowthScale, a B2B marketing software company, struggled with lead velocity. Their 12-person sales team manually researched prospects, created personalized messaging, and tracked engagement—taking 48 hours from lead capture to first contact. Using Viktron, they deployed a Sales Agent Team: Research agents compile company intel and decision-maker info, Outreach agents craft personalized email sequences, and Analytics agents track open/click rates and suggest follow-up timing. Leads now receive contact within 15 minutes, response rates are 40% higher, and qualified lead volume tripled while the sales team focused on closing.",
                details: [
                  "Automated prospect research from 15+ data sources",
                  "Dynamic email generation based on company news, tech stack, and industry",
                  "Real-time engagement tracking and optimal follow-up timing",
                  "Direct sync to Salesforce with lead scoring and activity logs"
                ],
                metrics: [
                  { label: "Qualified Leads", value: "3x", desc: "Tripled volume in 60 days" },
                  { label: "Response Rate", value: "+40%", desc: "vs. traditional outreach" },
                  { label: "Manual Work", value: "-15h/wk", desc: "Per sales rep, redirected to closing" }
                ],
                tags: ["Sales", "Outreach", "CRM", "B2B Growth"],
                image: "/visuals/sales-pipeline.jpg",
                icon: Zap
              }
            ].map((study, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 md:flex"
              >
                {/* Image Side */}
                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/10 z-10 transition-colors group-hover:bg-slate-900/0" />
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm border border-slate-100">
                    {study.client}
                  </div>
                </div>

                {/* Content Side */}
                <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {study.title}
                  </h2>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {study.desc}
                  </p>

                  {study.details && (
                    <div className="mb-8 bg-slate-50 rounded-lg p-6 border border-slate-100">
                      <h4 className="font-semibold text-slate-900 text-sm mb-4 uppercase tracking-wide">Implementation Details</h4>
                      <ul className="space-y-3">
                        {study.details.map((detail, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            </div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-6 border-t border-slate-100 pt-8">
                    {study.metrics.map((metric, i) => (
                      <div key={i}>
                        <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">{metric.label}</div>
                        {metric.desc && <div className="text-xs text-slate-600 mt-2">{metric.desc}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why Viktron Powers Enterprise AI Deployments</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "99.9% Uptime SLA", desc: "Proven reliability with enterprise-grade infrastructure and automatic failover" },
              { title: "Agent Orchestration", desc: "Multi-agent teams with CEO agent for complex task decomposition and coordination" },
              { title: "Production-Ready", desc: "Built-in audit trails, compliance logging, and governance controls for regulated industries" },
              { title: "Cost Attribution", desc: "Granular token tracking and ROI calculation per agent, workflow, and department" }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <Award className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions About Viktron Enterprise Deployments</h2>
          <div className="space-y-6">
            {[
              {
                q: "How long does it take to deploy Viktron agents in our environment?",
                a: "Most enterprises go from pilot to production in 8-12 weeks. Your timeline depends on integration complexity (Salesforce, HR systems, compliance tools) and approval cycles. We've deployed in as little as 4 weeks for cloud-native teams."
              },
              {
                q: "What kind of ROI can we expect in year one?",
                a: "Based on our case studies, customers see 2.5-3.5x returns in the first 12 months, with average payback within 6-9 months. ROI comes from labor cost savings (30-60%), faster processing (40-80%), and revenue uplift from improved response times."
              },
              {
                q: "How does Viktron handle compliance and audit requirements?",
                a: "Viktron includes built-in audit trails for every decision, tool usage, and data access. All agent actions are logged with timestamps and reasoning. We support SOC 2, HIPAA, FINRA, and GDPR compliance with encrypted data at rest and in transit."
              },
              {
                q: "Can Viktron agents work with our existing systems?",
                a: "Yes. Viktron integrates with 100+ enterprise systems including Salesforce, ServiceNow, Workday, SAP, and custom APIs. Our integration team builds the connectors and handles data mapping as part of onboarding."
              },
              {
                q: "What happens if an agent makes an error?",
                a: "Each agent operates within a trust level (supervised, limited, or autonomous). Supervised agents require human approval before executing risky actions. All errors are logged and escalated based on severity. Your team can roll back actions within 24 hours."
              }
            ].map((item, i) => (
              <details key={i} className="group cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-slate-900 py-4 px-6 bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <span>{item.q}</span>
                  <ArrowRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 py-4 text-slate-600 leading-relaxed bg-white border-x border-b border-slate-200 rounded-b-lg">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-slate-200 bg-white">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to write your success story?</h2>
            <p className="text-lg text-slate-600 mb-8">See how Viktron's AI agents can transform your operations, reduce costs by 40-70%, and scale your team without hiring.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="/contact" className="btn btn-primary">Schedule Your Pilot</a>
              <a href="/demos" className="btn btn-secondary">Explore Capabilities</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
