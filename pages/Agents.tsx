import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageSquare, Users, Phone, Bot } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { INDUSTRY_AGENTS } from '../constants';
import { useAuth } from '../context/AuthContext';

const demoRouteMap: Record<string, string> = {
  // Enterprise Agents map to the main demo request for now
};

const sceneWidth = 1200;
const sceneHeight = 800; // Increased height for more space
const center = { x: 600, y: 150 }; // Moved center x to middle of new width, y higher up

type NodePos = { x: number; y: number };

const getNodePosition = (index: number, total: number): NodePos => {
  // Distribute into two rows for cleaner look
  const row1Count = 4;
  const row2Count = 6;
  
  if (index < row1Count) {
    // Inner row
    const span = 140; // degrees
    const startAngle = (180 - span) / 2 + 10; // centering
    const step = span / (row1Count - 1);
    const angleRad = (startAngle + index * step) * (Math.PI / 180);
    const radius = 280;
    return { 
      x: Math.cos(angleRad) * radius, 
      y: Math.sin(angleRad) * radius 
    };
  } else {
    // Outer row
    const adjIndex = index - row1Count;
    const span = 180;
    const startAngle = (180 - span) / 2;
    const step = span / (row2Count - 1);
    const angleRad = (startAngle + adjIndex * step) * (Math.PI / 180);
    const radius = 450;
    return { 
      x: Math.cos(angleRad) * radius, 
      y: Math.sin(angleRad) * radius 
    };
  }
};

const shortLabel = (name: string) => name
  .replace(' Manager', '')
  .replace(' Engineer', '')
  .replace(' Analyst', '')
  .replace(' Coordinator', '')
  .replace(' Officer', '')
  .replace(' Rep', '')
  .replace(' Assistant', '')
  .replace(' Tech', '')
  .replace(' Ops', '');

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="section-label">{children}</div>
);

export const Agents: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(INDUSTRY_AGENTS[0]?.id || null);
  const [sceneScale, setSceneScale] = useState(1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateScale = () => {
      const available = Math.max(window.innerWidth - 36, 320);
      setSceneScale(Math.min(1, available / sceneWidth));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const selectedAgent = useMemo(
    () => INDUSTRY_AGENTS.find((agent) => agent.id === selectedAgentId) || INDUSTRY_AGENTS[0],
    [selectedAgentId]
  );

  const launchAgent = (agentId: string) => {
    const route = demoRouteMap[agentId] || '/demo-form';
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(route)}`);
      return;
    }
    navigate(route);
  };

  const sceneNodes = INDUSTRY_AGENTS.slice(0, 10);

  return (
    <Layout showBackground={false}>
      <SEO
        title="Viktron AI Agents | Enterprise Digital Workforce"
        description="Deploy AI agents that work like employees across sales, support, content, and operations. Enterprise-grade, secure, integrated with your business tools."
        keywords="Viktron AI agents, AI employees, digital workforce, autonomous agents, enterprise AI, AI workforce, intelligent automation"
        url="/agents"
        canonicalUrl="https://viktron.ai/agents"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What are Viktron AI agents?", "acceptedAnswer": { "@type": "Answer", "text": "Viktron AI agents are autonomous digital employees that handle sales outreach, customer support, content creation, and business operations. They work 24/7, coordinate through the AgentIRL platform, and integrate with Slack, CRM, and ERP systems." } },
            { "@type": "Question", "name": "How do Viktron AI agents work?", "acceptedAnswer": { "@type": "Answer", "text": "Each agent is specialized for a role (Sales, Support, Analytics, Operations). A CEO Agent coordinates them, delegates tasks, and monitors performance. They communicate with each other and your team via Slack and email, making autonomous decisions within defined policies." } },
            { "@type": "Question", "name": "Which industries can use Viktron AI agents?", "acceptedAnswer": { "@type": "Answer", "text": "Viktron AI agents serve restaurants, healthcare clinics, salons, automotive dealerships, construction, real estate, legal firms, e-commerce, education, and recruitment — with industry-specific training and compliance built in." } }
          ]
        }}
      />      <div className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to bottom, black, transparent 90%)',
            }}
          />
        </div>

        <section className="relative pt-24 sm:pt-28 px-4">
          <div className="container-custom">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary text-glow">
                <Sparkles className="h-4 w-4" />
                Workforce Rental // Layer_02
              </div>
              <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight text-white uppercase leading-[0.9]">
                Agent Framework &<br />
                <span className="text-zinc-700">Orchestration.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-base sm:text-lg leading-relaxed text-zinc-400 font-light">
                Viktron is an active combination of **LangChain, CrewAI, AutoGen, and MCP**. 
                Our infrastructure dynamically coordinates specialized agents across 3,000+ tools.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="mt-16 rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative group bg-[#080808]"
              >
                  <div className="scan-line opacity-20" />
                  <img 
                    src="/assets/images/agents/coordination.png" 
                    alt="Agents Coordinating" 
                    width={1920}
                    height={822}
                    loading="lazy"
                    className="w-full aspect-[21/9] object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent flex items-end p-12">
                     <div className="text-white max-w-xl">
                        <div className="flex items-center gap-3 font-mono text-[10px] text-primary mb-4 tracking-[0.3em] uppercase font-bold text-glow">
                           <div className="w-8 h-px bg-primary" />
                           NEURAL_SYNC_ACTIVE
                        </div>
                        <h3 className="text-3xl font-bold mb-2 uppercase tracking-tighter">Real-time collaborative intelligence.</h3>
                        <p className="text-zinc-400 text-sm font-light">Distributed agentic nodes synchronized across the global Trust Fabric.</p>
                     </div>
                  </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        <section className="relative px-4 pb-12 pt-6 mt-20">
          <div className="container-custom text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-6 font-mono">Infrastructure_Connectivity</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Slack', icon: MessageSquare, link: '/contact?channel=slack' },
                { name: 'Teams', icon: Users, link: '/contact?channel=teams' },
                { name: 'WhatsApp', icon: Phone, link: 'https://wa.me/447441443734' },
                { name: 'Telegram', icon: Sparkles, link: '/contact?channel=telegram' },
              ].map((ch) => (
                <a 
                  key={ch.name}
                  href={ch.link}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-[#080808] text-zinc-400 hover:border-primary/40 hover:text-primary transition-all group shadow-2xl"
                >
                  <ch.icon size={18} className="text-zinc-600 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-black uppercase tracking-widest font-mono">Connect_{ch.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="container-custom py-20">
            <div className="mx-auto" style={{ height: `${sceneHeight * sceneScale}px` }}>
              <div
                className="relative left-1/2"
                style={{
                  width: `${sceneWidth}px`,
                  height: `${sceneHeight}px`,
                  transform: `translateX(-50%) scale(${sceneScale})`,
                  transformOrigin: 'top center',
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-[36px] border border-white/5 bg-[#080808] shadow-2xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42 }}
                />

                <svg className="absolute inset-0 z-10" viewBox={`0 0 ${sceneWidth} ${sceneHeight}`} fill="none">
                  <AnimatePresence>
                    {expanded &&
                      sceneNodes.map((agent, index) => {
                        const pos = getNodePosition(index, sceneNodes.length);
                        const endX = center.x + pos.x;
                        const endY = center.y + pos.y;
                        const startX = center.x;
                        const startY = center.y + 70;

                        const cp1X = startX;
                        const cp1Y = startY + 120;
                        const cp2X = endX;
                        const cp2Y = endY - 100;

                        const d = `M${startX} ${startY} C${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

                        return (
                          <motion.path
                            key={`line-${agent.id}`}
                            d={d}
                            stroke="url(#agent-line-gradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.4 }}
                            exit={{ pathLength: 0, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut", delay: index * 0.05 }}
                          />
                        );
                      })}
                  </AnimatePresence>
                  <defs>
                    <linearGradient id="agent-line-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute z-20" style={{ left: center.x, top: center.y, transform: 'translate(-50%, -50%)' }}>
                  <motion.button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="relative h-[200px] w-[200px] rounded-full group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-[-20px] rounded-full bg-primary/5 blur-2xl animate-pulse" />
                    
                    <motion.div
                      className="absolute inset-0 rounded-full border border-white/5"
                      style={{
                        background: 'linear-gradient(135deg, #080808 0%, #050505 100%)',
                        boxShadow: 'inset 0 4px 20px rgba(255,255,255,0.02), 0 10px 40px -10px rgba(204,255,0,0.1)'
                      }}
                    />
                    
                    <motion.div
                       className="absolute inset-[10px] rounded-full border-[1px] border-primary/20"
                       animate={{ rotate: 360 }}
                       transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                       <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full blur-[2px] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#CCFF00]" />
                    </motion.div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                       <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-primary mb-1 border border-primary/20">
                          {expanded ? <Sparkles size={24} className="text-glow" /> : <ArrowRight size={24} />}
                       </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary font-mono text-glow">
                        {expanded ? 'SYSTEM_RUNNING' : 'INITIALIZE'}
                      </span>
                      <span className="text-xl font-bold text-white tracking-tight text-center uppercase leading-tight">Orchestration<br />Engine</span>
                    </div>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {expanded &&
                    sceneNodes.map((agent, index) => {
                      const pos = getNodePosition(index, sceneNodes.length);
                      const isSelected = selectedAgent?.id === agent.id;
                      return (
                        <motion.button
                          key={agent.id}
                          initial={{ opacity: 0, scale: 0.4, x: center.x, y: center.y }}
                          animate={{ opacity: 1, scale: 1, x: center.x + pos.x, y: center.y + pos.y }}
                          exit={{ opacity: 0, scale: 0.45, x: center.x, y: center.y }}
                          transition={{ type: 'spring', stiffness: 250, damping: 18, delay: index * 0.028 }}
                          onClick={() => setSelectedAgentId(agent.id)}
                          className="absolute z-30 group"
                          style={{ transform: 'translate(-50%, -50%)' }}
                          whileHover={{ scale: 1.1, zIndex: 40 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border transition-all duration-300 ${
                              isSelected
                                ? 'border-primary/50 bg-[#080808] shadow-2xl shadow-primary/20 scale-110'
                                : 'border-white/5 bg-[#050505] hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10'
                            }`}
                          >
                            <span className={`transition-colors duration-300 ${isSelected ? 'text-primary text-glow' : 'text-zinc-600 group-hover:text-primary'}`}>
                               {React.isValidElement(agent.icon) ? React.cloneElement(agent.icon as any, { className: "w-8 h-8" }) : agent.icon}
                            </span>
                          </div>
                          
                          <div className={`absolute top-[84px] left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg border transition-all duration-300 font-mono ${
                              isSelected 
                                ? 'bg-primary text-black border-primary' 
                                : 'bg-[#080808] text-zinc-500 border-white/10 group-hover:border-primary/40 group-hover:text-primary'
                          }`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {shortLabel(agent.name)}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                </AnimatePresence>

                {!expanded ? (
                  <div className="absolute top-[380px] left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-4">
                     <span className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent"></span>
                     <div className="rounded-full border border-primary/20 bg-primary/10 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary shadow-2xl animate-bounce font-mono text-glow">
                        // TAP_ENGINE_TO_PREVIEW_NODES
                     </div>
                  </div>
                ) : null}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {expanded && selectedAgent ? (
                <motion.div
                  key={selectedAgent.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  className="mx-auto mt-12 w-full max-w-4xl obsidian-panel p-12 bg-[#080808]/80 backdrop-blur-xl border-white/5 shadow-2xl relative overflow-hidden"
                >
                  <div className="scan-line opacity-10" />
                  <div className="flex flex-wrap items-start justify-between gap-8 relative z-10">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 font-mono text-[9px] text-primary mb-4 tracking-[0.3em] uppercase font-bold">
                         <div className="w-6 h-px bg-primary" />
                         FRAMEWORK_ARCHETYPE
                      </div>
                      <h2 className="text-4xl font-bold text-white uppercase tracking-tight">{selectedAgent.name}</h2>
                      <p className="mt-6 max-w-2xl text-base text-zinc-400 font-light leading-relaxed">{selectedAgent.description}</p>
                      <div className="mt-8 flex flex-wrap gap-3">
                        {selectedAgent.features.slice(0, 4).map((feature) => (
                          <span
                            key={`${selectedAgent.id}-${feature}`}
                            className="rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-widest"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                      <button
                        onClick={() => launchAgent(selectedAgent.id)}
                        className="btn-acid !py-4 w-full"
                      >
                        Launch Deployment
                      </button>
                      <button
                        onClick={() => navigate('/demo-form')}
                        className="btn-obsidian !py-4 w-full"
                      >
                        Architecture Brief
                      </button>
                    </div>
                  </div>

                  <div className="mt-12 pt-12 border-t border-white/5 relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-8 font-mono">Provisioning_Channels</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { name: 'Slack', icon: MessageSquare, link: '/contact?channel=slack' },
                        { name: 'Teams', icon: Users, link: '/contact?channel=teams' },
                        { name: 'WhatsApp', icon: Phone, link: 'https://wa.me/447441443734' },
                        { name: 'Telegram', icon: Sparkles, link: '/contact?channel=telegram' },
                      ].map((ch) => {
                        const ChIcon = ch.icon;
                        return (
                          <a
                            key={ch.name}
                            href={ch.link}
                            target={ch.link.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-primary/40 hover:bg-primary/[0.05] transition-all group"
                          >
                            <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-500 group-hover:text-primary transition-all group-hover:scale-110">
                              <ChIcon size={18} />
                            </div>
                            <span className="text-xs font-bold text-zinc-300 font-mono tracking-wider">{ch.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        {/* Orchestration Flow Section */}
        <section className="py-40 bg-[#050505] border-t border-white/5">
           <div className="container-custom">
              <div className="max-w-3xl mb-24">
                 <Label>02 // ORCHESTRATION_FLOW</Label>
                 <h2 className="text-5xl font-bold tracking-tight text-white mt-10 uppercase leading-[0.9]">
                    Infrastructure that<br />
                    <span className="text-zinc-700">reacts in real-time.</span>
                 </h2>
                 <p className="text-xl text-zinc-400 mt-8 font-light leading-relaxed">
                    Viktron doesn't just run static scripts. We provide a dynamic infrastructure that reacts to business triggers with autonomous judgment.
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                 {[
                   { 
                     title: '01 // Input Trigger', 
                     desc: 'A message arrives via Slack, an email is received, or a webhook is fired from your CRM.',
                     icon: MessageSquare,
                     img: '/assets/images/agents/trigger.png'
                   },
                   { 
                     title: '02 // Orchestration', 
                     desc: 'The Orchestration Engine selects the best framework based on task complexity.',
                     icon: Sparkles,
                     img: '/assets/images/agents/engine.png'
                   },
                   { 
                     title: '03 // Provisioning', 
                     desc: 'Specialized agent nodes are spun up instantly, execute the mission, and return results.',
                     icon: Bot,
                     img: '/assets/images/agents/provisioning.png'
                   },
                 ].map((step, i) => {
                   const StepIcon = step.icon;
                   return (
                     <FU key={i} d={i * 0.1} className="group obsidian-panel p-0 overflow-hidden border-white/5 hover:border-primary/20 transition-all duration-700">
                        <div className="aspect-video overflow-hidden border-b border-white/5 relative">
                           <img 
                            src={step.img} 
                            alt={step.title} 
                            width={800}
                            height={450}
                            loading="lazy"
                            className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
                        </div>
                        <div className="p-10">
                          <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-zinc-600 mb-8 group-hover:text-primary transition-colors duration-500">
                             <StepIcon size={24} />
                          </div>
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-4 font-mono text-glow">{step.title}</h4>
                          <p className="text-zinc-400 text-sm leading-relaxed font-light">{step.desc}</p>
                        </div>
                     </FU>
                   );
                 })}
              </div>
            </div>
         </section>

        {/* Integrations Section */}
        <section className="py-40 bg-[#080808] border-t border-white/5 overflow-hidden">
           <div className="container-custom">
              <div className="grid lg:grid-cols-2 gap-24 items-center">
                 <div>
                    <Label>03 // CONNECTIVITY_FABRIC</Label>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mt-10 uppercase leading-[0.85]">
                       3,000+ Integrations.<br />
                       <span className="text-zinc-700">Infinite Potential.</span>
                    </h2>
                    <p className="text-xl text-zinc-400 mt-10 leading-relaxed font-light">
                       Our agents don't work in isolation. They integrate directly with your existing stack — from enterprise ERPs and CRMs to specialized engineering tools.
                    </p>
                    <div className="grid grid-cols-2 gap-10 mt-16">
                       {[
                         { label: 'Enterprise', desc: 'SAP, Oracle, Salesforce' },
                         { label: 'Engineering', desc: 'GitHub, Jira, AWS' },
                         { label: 'Marketing', desc: 'HubSpot, Meta, Google' },
                         { label: 'Productivity', desc: 'Notion, Slack, Teams' },
                       ].map((item, i) => (
                         <div key={i} className="border-l border-primary/20 pl-8">
                            <h4 className="text-xs font-mono font-bold text-primary mb-2 uppercase tracking-widest">{item.label}</h4>
                            <p className="text-sm text-zinc-500 font-light leading-relaxed">{item.desc}</p>
                         </div>
                       ))}
                    </div>
                    <button className="mt-16 btn-acid !px-12 !py-5">View Integration Directory</button>
                 </div>
                 
                 <div className="relative">
                    <div className="grid grid-cols-3 gap-4 opacity-[0.2] grayscale group-hover:grayscale-0 transition-all duration-1000">
                       {[...Array(9)].map((_, i) => (
                         <div key={i} className="aspect-square rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center p-6">
                            <div className="w-full h-full bg-white/[0.05] rounded-lg animate-pulse" />
                         </div>
                       ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[100px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="obsidian-panel p-16 text-center bg-[#050505]/80 backdrop-blur-2xl border-primary/20 shadow-[0_0_50px_rgba(204,255,0,0.1)]">
                          <div className="text-7xl font-black text-white mb-2 tracking-tighter">3,000+</div>
                          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-primary text-glow">Active_Connectors</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
};
