import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
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
        title="Hire Your AI Workforce | Digital Employees | Viktron"
        description="Deploy autonomous AI agents that work like employees. Reliable, secure, and integrated deeply into your enterprise stack."
        keywords="AI employees, digital workforce, agent integration, enterprise AI"
        url="/agents"
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
                Digital Workforce
              </div>
              <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900">Hire your AI Employees</h1>
              <p className="mt-3 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600">
                A scalable, deterministic digital workforce integrated directly into your Slack, CRM, and ERP. 
                Click an agent node to see how they can join your team.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="relative px-4 pb-12 pt-6">
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
                        {expanded ? 'Collapse' : 'Deploy'}
                      </span>
                      <span className="text-xl font-bold text-slate-800 tracking-tight">Agent Core</span>
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
                        Tap Core to Deploy
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
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Selected Agent</p>
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
                        Launch Demo
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => navigate('/demo-form')}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </Layout>
  );
};
