/**
 * Viktron AI — Institutional Analytics Platform
 * "The Command Center for Autonomous Intelligence."
 */
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, ArrowRight, ArrowUpRight, BadgeDollarSign, BarChart3, Brain, CheckCircle2,
  Database, Globe, LineChart, Loader2, MessagesSquare, PlugZap, Radar, RefreshCw,
  Search, Shield, ShieldCheck, Sparkles, Terminal, TrendingUp, Unplug, Users, Zap,
  LayoutDashboard, Settings, ChevronRight, Download, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const ObsidianCard = ({ children, className = '', title = '' }: { children: React.ReactNode; className?: string; title?: string }) => (
  <div className={`obsidian-panel p-6 relative overflow-hidden group border-white/5 hover:border-primary/20 transition-all ${className}`}>
    <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
       <div className="w-16 h-16 border-r border-t border-white" />
    </div>
    {title && (
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">{title}</span>
      </div>
    )}
    {children}
  </div>
);

export const AnalyticsApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const kpis = [
    { label: 'Active Agents', value: '1,284', trend: '+12.4%', color: 'text-primary' },
    { label: 'Decision Reliability', value: '99.98%', trend: '+0.02%', color: 'text-primary' },
    { label: 'Token Efficiency', value: '+42.5%', trend: '+4.1%', color: 'text-primary' },
    { label: 'Governed Spends', value: '$284,102', trend: '+18.2%', color: 'text-primary' },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Command Center', icon: Radar },
    { id: 'telemetry', label: 'Live Telemetry', icon: Activity },
    { id: 'reasoning', label: 'Reasoning Logs', icon: Brain },
    { id: 'infrastructure', label: 'Node Status', icon: Database },
    { id: 'governance', label: 'Policy Engine', icon: ShieldCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      {/* ─── SIDEBAR ─── */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} border-r border-white/5 flex flex-col transition-all duration-500 bg-[#080808]/50 backdrop-blur-2xl z-50`}>
        <div className="p-8 mb-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 obsidian-inset flex items-center justify-center border border-primary/20">
                 <img src="/visuals/viktronlogo.png" alt="Logo" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" />
              </div>
              {isSidebarOpen && <span className="font-mono font-black uppercase tracking-[0.3em] text-sm">Viktron</span>}
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
           {sidebarItems.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-4 px-4 py-4 transition-all group ${
                 activeTab === item.id 
                   ? 'bg-primary text-black font-black' 
                   : 'text-zinc-500 hover:text-white hover:bg-white/5'
               }`}
             >
               <item.icon size={18} className={activeTab === item.id ? 'text-black' : 'group-hover:text-primary transition-colors'} />
               {isSidebarOpen && <span className="text-[10px] font-mono uppercase tracking-widest">{item.label}</span>}
               {activeTab === item.id && isSidebarOpen && <ChevronRight size={14} className="ml-auto" />}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full obsidian-inset border border-white/10" />
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-bold truncate uppercase">{user?.fullName || 'Institutional User'}</p>
                   <p className="text-[9px] text-zinc-600 truncate uppercase font-mono">Verified_Node</p>
                </div>
              )}
           </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#050505]/50 backdrop-blur-xl">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
                 <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em]">SYSTEMS_OPERATIONAL // VERIFIED</span>
              </div>
              <div className="w-px h-6 bg-white/5" />
              <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                 <Calendar size={12} /> MAR 28, 2026
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="obsidian-inset p-2.5 text-zinc-500 hover:text-primary transition-colors">
                 <RefreshCw size={16} />
              </button>
              <button className="btn-acid !px-6 !py-2.5 !text-[9px]">Generate Intelligence Report</button>
           </div>
        </header>

        {/* Dashboard Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
           {/* KPI Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, i) => (
                <FU key={i} d={i * 0.05}>
                   <ObsidianCard title={kpi.label}>
                      <div className="flex items-end justify-between">
                         <span className="text-4xl font-black tracking-tighter text-white">{kpi.value}</span>
                         <span className="text-[10px] font-mono text-primary font-bold">{kpi.trend}</span>
                      </div>
                   </ObsidianCard>
                </FU>
              ))}
           </div>

           {/* Main Visualization Grid */}
           <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
              <FU d={0.2}>
                 <ObsidianCard title="AGENTIC_TRAFFIC_TELEMETRY" className="h-full">
                    <div className="mt-10 h-64 flex items-end gap-2 px-4 relative">
                       {/* Mock Chart Grid Lines */}
                       <div className="absolute inset-0 border-b border-white/5 flex flex-col justify-between">
                          <div className="w-full h-px bg-white/5" />
                          <div className="w-full h-px bg-white/5" />
                          <div className="w-full h-px bg-white/5" />
                          <div className="w-full h-px bg-white/5" />
                       </div>
                       {[60, 45, 80, 55, 90, 70, 85, 40, 95, 65, 75, 88].map((h, i) => (
                         <motion.div 
                           key={i}
                           initial={{ scaleY: 0 }}
                           animate={{ scaleY: 1 }}
                           transition={{ duration: 1, delay: i * 0.05 }}
                           className="flex-1 bg-primary/20 border-t border-primary/40 relative group cursor-pointer"
                           style={{ height: `${h}%` }}
                         >
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[9px] font-mono text-primary bg-black border border-primary/20 px-2 py-1 z-10">
                               {h * 124}_events
                            </div>
                         </motion.div>
                       ))}
                    </div>
                    <div className="mt-6 flex justify-between font-mono text-[9px] text-zinc-600 uppercase tracking-widest px-4">
                       <span>T-12H</span>
                       <span>T-6H</span>
                       <span>T-0H</span>
                    </div>
                 </ObsidianCard>
              </FU>

              <FU d={0.3}>
                 <ObsidianCard title="POLICY_GATEWAY_INTERCEPTS" className="h-full">
                    <div className="space-y-6 mt-6">
                       {[
                         { l: 'IDENTITY_VIOLATION', v: 4, t: 'LOW' },
                         { l: 'BUDGET_THRESHOLD', v: 12, t: 'MID' },
                         { l: 'SENSITIVE_DATA_SCAN', v: 84, t: 'HIGH' },
                         { l: 'OUT_OF_SCOPE_ACTION', v: 2, t: 'LOW' },
                       ].map((item, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
                               <span className="text-zinc-400">{item.l}</span>
                               <span className="text-primary">{item.v}</span>
                            </div>
                            <div className="h-1.5 obsidian-inset relative overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(item.v / 100) * 100}%` }}
                                 className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(204,255,0,0.4)]" 
                               />
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="mt-12 p-6 glass-bone border-primary/10 border italic text-[10px] text-zinc-500 leading-relaxed font-mono">
                       "Policy gateway successfully neutralized 12 potentially non-compliant agent actions in the last 60 minutes."
                    </div>
                 </ObsidianCard>
              </FU>
           </div>

           {/* Live Feed Table */}
           <FU d={0.4}>
              <ObsidianCard title="LIVE_REASONING_CHAIN_PROVENANCE">
                 <div className="mt-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-white/5">
                             <th className="pb-4 text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">AGENT_ID</th>
                             <th className="pb-4 text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">ACTION_VECTOR</th>
                             <th className="pb-4 text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">TRUST_SCORE</th>
                             <th className="pb-4 text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">PROVENANCE_HASH</th>
                             <th className="pb-4 text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">STATUS</th>
                          </tr>
                       </thead>
                       <tbody className="text-[11px] font-mono">
                          {[
                            { id: 'AG-284', action: 'DB_QUERY_REASONING', score: '0.998', hash: '8x2b...4f9a', status: 'VERIFIED' },
                            { id: 'AG-102', action: 'EXT_API_CALL_INTERCEPT', score: '0.942', hash: '1m9d...k2l0', status: 'SCANNED' },
                            { id: 'AG-331', action: 'KNOWLEDGE_RETRIEVAL', score: '0.999', hash: '5s8w...9p3e', status: 'VERIFIED' },
                            { id: 'AG-042', action: 'SYNTHESIS_GATEWAY', score: '0.884', hash: '2z7q...8n1c', status: 'CAUTION' },
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                               <td className="py-5 text-white font-bold">{row.id}</td>
                               <td className="py-5 text-zinc-400">{row.action}</td>
                               <td className="py-5 text-primary">{row.score}</td>
                               <td className="py-5 text-zinc-600 group-hover:text-zinc-400 transition-colors">{row.hash}</td>
                               <td className="py-5">
                                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black ${
                                    row.status === 'VERIFIED' ? 'bg-primary/20 text-primary' : 
                                    row.status === 'CAUTION' ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-zinc-400'
                                  }`}>
                                     {row.status}
                                  </span>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </ObsidianCard>
           </FU>
        </div>
      </main>
    </div>
  );
};
