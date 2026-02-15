import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { ArrowRight, BarChart2, ShieldCheck, Users, Zap } from 'lucide-react';

export const CaseStudies = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono mb-6">
            Customer Success
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How Enterprises Scale with Viktron
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From Fortune 500 financial institutions to rapid-growth tech companies, see how our customers achieve 99.9% reliability in their agent workflows.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-12">
            {[
              {
                client: "Global FinTech Corp",
                title: "Compliance Audit Automation",
                desc: "A leading financial services provider needed to automate their compliance checks. Using Viktron, they deployed agents that cross-reference 40+ regulatory databases in real-time.",
                metrics: [
                  { label: "Audit Coverage", value: "100%" },
                  { label: "Processing Time", value: "-92%" },
                  { label: "False Positives", value: "<0.1%" }
                ],
                tags: ["Finance", "Compliance", "Security"],
                image: "/visuals/compliance-audit.jpg",
                icon: ShieldCheck
              },
              {
                client: "TechFlow Enterprise",
                title: "Customer Support AI Integration",
                desc: "Facing a 300% surge in support tickets, TechFlow implemented Viktron's reliable agent orchestration. The system automatically handles Tier-1 queries and escalates complex issues with context.",
                metrics: [
                  { label: "Ticket Deflection", value: "85%" },
                  { label: "CSAT Score", value: "4.8/5" },
                  { label: "Resolution Time", value: "2m" }
                ],
                tags: ["SaaS", "Support", "Automation"],
                image: "/visuals/tech-support.jpg",
                icon: Users
              },
              {
                client: "GrowthScale Inc",
                title: "Sales Pipeline Optimization",
                desc: "Automated lead scoring and outreach for a high-velocity sales team. Agents research prospects, draft personalized emails, and sync engagement data directly to Salesforce.",
                metrics: [
                  { label: "Qualified Leads", value: "3x" },
                  { label: "Response Rate", value: "+40%" },
                  { label: "Manual Work", value: "-15h/wk" }
                ],
                tags: ["Sales", "Outreach", "CRM"],
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
                  
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {study.desc}
                  </p>

                  <div className="grid grid-cols-3 gap-6 border-t border-slate-100 pt-8">
                    {study.metrics.map((metric, i) => (
                      <div key={i}>
                        <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to write your success story?</h2>
          <div className="flex justify-center gap-4">
            <a href="/contact" className="btn btn-primary">Start Pilot</a>
            <a href="/demos" className="btn btn-secondary">View Demos</a>
          </div>
        </div>
      </section>
    </Layout>
  );
};
