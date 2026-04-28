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
      />

      <div className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/50 blur-[120px] rounded-full pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to bottom, black, transparent 90%)',
            }}
          />
        </div>

        <section className="relative pt-24 sm:pt-28 px-4">
          <div className="container-custom">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Workforce Rental // Layer_02
              </div>
              <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900">Agent Framework & Orchestration</h1>
              <p className="mt-3 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600">
                Viktron is an active combination of **LangChain, CrewAI, AutoGen, and MCP**. 
                Our infrastructure dynamically coordinates specialized agents across 3,000+ tools.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="mt-12 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative group"
              >
                 <img src="/assets/images/agents/coordination.png" alt="Agents Coordinating" className="w-full aspect-[21/9] object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-12">
                    <div className="text-white max-w-xl">
                       <h3 className="text-2xl font-bold mb-2">Neural Sync™</h3>
                       <p className="text-white/80 text-sm">Real-time collaborative intelligence across multiple agentic nodes.</p>
                    </div>
                 </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        <section className="relative px-4 pb-12 pt-6">
          <div className="container-custom text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-6">Connect to our infrastructure via</p>
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
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all group"
                >
                  <ch.icon size={18} className="text-slate-400 group-hover:text-blue-600" />
                  <span className="text-xs font-black uppercase tracking-widest">Connect on {ch.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="container-custom">
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
                  className="absolute inset-0 rounded-[36px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm"
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
                        const startY = center.y + 70; // Start below the main orb

                        // Create a "curly" organic path using Cubic Bezier
                        // The control points create a flow that goes down first, then curves to the target
                        const cp1X = startX;
                        const cp1Y = startY + 120; // Go down vertically first
                        const cp2X = endX;
                        const cp2Y = endY - 100; // Then curve into the node from top

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
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
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
                     {/* Outer pulsing glow */}
                    <div className="absolute inset-[-20px] rounded-full bg-blue-100/30 blur-2xl animate-pulse" />
                    
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                        boxShadow: 'inset 0 4px 20px rgba(255,255,255,0.8), 0 10px 40px -10px rgba(59,130,246,0.3)'
                      }}
                    />
                    
                    {/* Animated Ring */}
                    <motion.div
                       className="absolute inset-[10px] rounded-full border-[1px] border-blue-200/50"
                       animate={{ rotate: 360 }}
                       transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                       <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full blur-[2px] -translate-x-1/2 -translate-y-1/2" />
                    </motion.div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                       <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-1 ring-1 ring-blue-100">
                          {expanded ? <Sparkles size={24} /> : <ArrowRight size={24} />}
                       </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                        {expanded ? 'Collapse' : 'Initialize'}
                      </span>
                      <span className="text-xl font-bold text-slate-800 tracking-tight text-center">Orchestration Engine</span>
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
                                ? 'border-blue-500/50 bg-white shadow-xl shadow-blue-500/20 scale-110'
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10'
                            }`}
                          >
                            <span className={`transition-colors duration-300 ${isSelected ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`}>
                               {/* Clone icon with larger size */}
                               {React.isValidElement(agent.icon) ? React.cloneElement(agent.icon as any, { className: "w-8 h-8" }) : agent.icon}
                            </span>
                          </div>
                          
                          <div className={`absolute top-[84px] left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                              isSelected 
                                ? 'bg-slate-900 text-white border-slate-900' 
                                : 'bg-white text-slate-500 border-slate-200 group-hover:border-blue-200 group-hover:text-blue-600'
                          }`}>
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                              {shortLabel(agent.name)}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                </AnimatePresence>

                {!expanded ? (
                  <div className="absolute top-[380px] left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2">
                     <span className="w-px h-16 bg-gradient-to-b from-blue-200 to-transparent"></span>
                     <div className="rounded-full border border-blue-100 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-600 shadow-sm animate-bounce">
                        Tap Engine to Preview Nodes
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
                  className="mx-auto mt-3 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Framework Archetype</p>
                      <h2 className="mt-1 text-2xl font-semibold text-slate-900">{selectedAgent.name}</h2>
                      <p className="mt-2 max-w-2xl text-sm text-slate-600">{selectedAgent.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedAgent.features.slice(0, 4).map((feature) => (
                          <span
                            key={`${selectedAgent.id}-${feature}`}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => launchAgent(selectedAgent.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Automate Deployment
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => navigate('/demo-form')}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50"
                      >
                        Architecture Brief
                      </button>
                    </div>
                  </div>

                  {/* Channel Selection */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Provisioning Channels</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: 'Slack', icon: MessageSquare, color: 'hover:border-[#4A154B] hover:text-[#4A154B]', link: '/contact?channel=slack' },
                        { name: 'Teams', icon: Users, color: 'hover:border-[#4B53BC] hover:text-[#4B53BC]', link: '/contact?channel=teams' },
                        { name: 'WhatsApp', icon: Phone, color: 'hover:border-[#25D366] hover:text-[#25D366]', link: 'https://wa.me/447441443734' },
                        { name: 'Telegram', icon: Sparkles, color: 'hover:border-[#0088cc] hover:text-[#0088cc]', link: '/contact?channel=telegram' },
                      ].map((ch) => {
                        const ChIcon = ch.icon;
                        return (
                          <a
                            key={ch.name}
                            href={ch.link}
                            target={ch.link.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 transition-all ${ch.color} group`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                              <ChIcon size={16} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{ch.name}</span>
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
        <section className="py-24 bg-slate-50 border-t border-slate-100">
           <div className="container-custom">
              <div className="max-w-3xl">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">How Orchestration Works</h2>
                 <p className="text-lg text-slate-600 mb-12 leading-relaxed text-zinc-500">
                    Viktron doesn't just run static scripts. We provide a dynamic infrastructure that reacts to business triggers in real-time.
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {[
                   { 
                     title: '01 // Input Trigger', 
                     desc: 'A message arrives via Slack, an email is received, or a webhook is fired from your CRM.',
                     icon: MessageSquare,
                     img: '/assets/images/agents/trigger.png'
                   },
                   { 
                     title: '02 // Orchestration', 
                     desc: 'The Orchestration Engine selects the best framework (CrewAI for team workflows, AutoGen for multi-agent conversations) based on task complexity.',
                     icon: Sparkles,
                     img: '/assets/images/agents/engine.png'
                   },
                   { 
                     title: '03 // Provisioning', 
                     desc: 'Specialized agent nodes are spun up instantly, execute the mission across your tools, and return structured results.',
                     icon: Bot,
                     img: '/assets/images/agents/provisioning.png'
                   },
                 ].map((step, i) => {
                   const StepIcon = step.icon;
                   return (
                     <div key={i} className="group overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="aspect-video overflow-hidden border-b border-slate-100 relative">
                           <img src={step.img} alt={step.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
                        </div>
                        <div className="p-8">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                             <StepIcon size={24} />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-4">{step.title}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>
         </section>

        {/* Integrations Section */}
        <section className="py-32 bg-white border-t border-slate-100 overflow-hidden">
           <div className="container-custom">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 <div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-8">3,000+ Integrations. Infinite Possibilities.</h2>
                    <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                       Our agents don't work in isolation. They integrate directly with your existing stack — from enterprise ERPs and CRMs to specialized engineering tools and marketing platforms.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                       {[
                         { label: 'Enterprise', desc: 'SAP, Oracle, Salesforce' },
                         { label: 'Engineering', desc: 'GitHub, Jira, AWS' },
                         { label: 'Marketing', desc: 'HubSpot, Meta, Google' },
                         { label: 'Productivity', desc: 'Notion, Slack, Teams' },
                       ].map((item, i) => (
                         <div key={i} className="border-l-2 border-blue-100 pl-6">
                            <h4 className="text-sm font-bold text-slate-900 mb-1">{item.label}</h4>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">{item.desc}</p>
                         </div>
                       ))}
                    </div>
                    <button className="mt-12 btn-acid !px-10 py-4">View All Integrations</button>
                 </div>
                 
                 <div className="relative">
                    <div className="grid grid-cols-3 gap-4 opacity-[0.4] grayscale group-hover:grayscale-0 transition-all duration-700">
                       {[...Array(9)].map((_, i) => (
                         <div key={i} className="aspect-square rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-6">
                            <div className="w-full h-full bg-slate-200 rounded-lg animate-pulse" />
                         </div>
                       ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-[100px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="obsidian-panel p-12 text-center bg-white/80 backdrop-blur-md">
                          <div className="text-6xl font-black text-slate-900 mb-2">3,000+</div>
                          <div className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-blue-600">Active Connectors</div>
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
