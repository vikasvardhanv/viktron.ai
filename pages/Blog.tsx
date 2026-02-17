import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

const ARTICLES = [
  {
    tag: 'Guide',
    tagColor: 'bg-blue-50 text-blue-600',
    title: 'What Is a Multi-Agent System? (And Why Your Business Needs One)',
    excerpt: 'Single AI chatbots handle one task. Multi-agent systems coordinate specialists — Sales, Support, Content — like a digital workforce that runs 24/7.',
    date: 'Jan 2026',
    readTime: '5 min read',
  },
  {
    tag: 'Product',
    tagColor: 'bg-indigo-50 text-indigo-600',
    title: 'AgentIRL: The Reliability Layer Missing From Every AI Stack',
    excerpt: 'AI frameworks are powerful. But they need an operations layer to be production-ready — retry logic, failover, monitoring. That\'s AgentIRL.',
    date: 'Feb 2026',
    readTime: '7 min read',
  },
  {
    tag: 'Case Study',
    tagColor: 'bg-emerald-50 text-emerald-600',
    title: 'How a Real Estate Agency Automated 80% of Lead Qualification',
    excerpt: 'One AI Sales Agent, integrated with their CRM. 200+ leads/month qualified automatically. Average response time: under 8 seconds.',
    date: 'Feb 2026',
    readTime: '4 min read',
  },
  {
    tag: 'Explainer',
    tagColor: 'bg-purple-50 text-purple-600',
    title: 'Voice AI Agents vs. Traditional IVR: What\'s Actually Different',
    excerpt: 'IVR presses buttons. Voice AI understands context, handles objections, and books appointments — all in natural conversation.',
    date: 'Feb 2026',
    readTime: '6 min read',
  },
  {
    tag: 'Strategy',
    tagColor: 'bg-amber-50 text-amber-600',
    title: 'The ROI of AI Agent Teams: A Framework for Business Leaders',
    excerpt: 'How to calculate the real return on AI agents — from reduced payroll to faster lead response and higher conversion rates.',
    date: 'Mar 2026',
    readTime: '8 min read',
  },
  {
    tag: 'Technical',
    tagColor: 'bg-cyan-50 text-cyan-600',
    title: 'Building Reliable AI Workflows With Agent Orchestration',
    excerpt: 'How we coordinate multiple AI agents to handle complex business processes — delegation, conflict resolution, and parallel execution.',
    date: 'Mar 2026',
    readTime: '10 min read',
  },
];

export const Blog: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="Blog & Resources | Viktron"
        description="Guides, case studies, and insights on AI agent teams, multi-agent orchestration, and the AgentIRL platform."
        keywords="AI agents blog, multi-agent systems, AgentIRL, AI automation guides, AI case studies"
        url="/blog"
      />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono text-blue-600 mb-6">
              <BookOpen className="w-3 h-3" /> Blog & Resources
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Insights on<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">AI Agents.</span>
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600 leading-relaxed">
              Guides, case studies, and deep dives on building, deploying, and scaling AI agent teams for real businesses.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20 px-4 bg-white">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article, idx) => (
              <StaggerItem key={idx}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 h-full flex flex-col hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${article.tagColor}`}>
                      {article.tag}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-tight">{article.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{article.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{article.date}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-200">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Want to see AI agents in action?</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Book a demo and we'll show you exactly how AI agent teams can transform your business operations.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn btn-primary">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/use-cases" className="btn btn-secondary">
              View Use Cases
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
