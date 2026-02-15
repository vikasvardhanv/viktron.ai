import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, Clock, Database, DollarSign, Server } from 'lucide-react';

const MetricCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-lg flex flex-col justify-between h-full">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
        <Icon size={18} />
      </div>
      {trend && (
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  </div>
);

export const LiveMetricsDashboard = () => {
    const [metrics, setMetrics] = useState({
        activeAgents: 124,
        successRate: 99.8,
        latency: 450,
        cost: 24.50
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                activeAgents: prev.activeAgents + Math.floor(Math.random() * 3) - 1,
                successRate: +(99.0 + Math.random()).toFixed(1),
                latency: 400 + Math.floor(Math.random() * 100),
                cost: +(prev.cost + 0.05).toFixed(2)
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto p-1 bg-gradient-to-b from-slate-200 to-slate-100 rounded-xl shadow-2xl overflow-hidden border border-slate-300">
            {/* Header */}
            <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-300">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/50" />
                    </div>
                    <span className="ml-3 text-xs text-slate-600 font-mono">viktron_dashboard_v2.tsx</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-mono border border-blue-200">
                        <Activity size={10} />
                        LIVE
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard 
                    label="Active Agents" 
                    value={metrics.activeAgents} 
                    trend={12} 
                    icon={Server} 
                    color="blue" 
                />
                <MetricCard 
                    label="Success Rate" 
                    value={`${metrics.successRate}%`} 
                    trend={0.4} 
                    icon={CheckCircle} 
                    color="emerald" 
                />
                <MetricCard 
                    label="Avg Latency" 
                    value={`${metrics.latency}ms`} 
                    trend={-5} 
                    icon={Clock} 
                    color="amber" 
                />
                <MetricCard 
                    label="Daily Cost" 
                    value={`$${metrics.cost}`} 
                    trend={2.1} 
                    icon={DollarSign} 
                    color="purple" 
                />

                {/* Main Chart Area (Mockup) */}
                <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-lg p-4 h-64 relative overflow-hidden group">
                     {/* Grid Lines */}
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                     
                     <div className="relative z-10 h-full flex items-end gap-2 pb-4 px-2">
                        {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 50, 95, 80, 60, 85, 75, 90, 100].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-blue-300 to-blue-600 rounded-t-sm hover:from-blue-400 hover:to-blue-500 min-w-[8px]"
                            />
                        ))}
                     </div>
                     <div className="absolute top-4 left-4 text-xs text-slate-500 font-mono">Requests / Second</div>
                </div>

                {/* Side List */}
                <div className="md:col-span-1 bg-slate-50 border border-slate-200 rounded-lg p-4 h-64 overflow-hidden">
                    <div className="text-xs text-slate-500 font-mono mb-3 uppercase tracking-wider">Live Logs</div>
                    <div className="space-y-2">
                        {[
                            { time: '10:42:01', msg: 'Agent-007 connected', type: 'info' },
                            { time: '10:42:05', msg: 'Sales_Bot completed task', type: 'success' },
                            { time: '10:42:12', msg: 'Support_AI retrying...', type: 'warn' },
                            { time: '10:42:15', msg: 'Data sync verified', type: 'success' },
                            { time: '10:42:18', msg: 'New session started', type: 'info' },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-2 text-[10px] font-mono">
                                <span className="text-slate-500">{log.time}</span>
                                <span className={{
                                    'info': 'text-blue-600',
                                    'success': 'text-emerald-600',
                                    'warn': 'text-amber-600'
                                }[log.type]}>{log.msg}</span>
                            </div>
                        ))}
                         <motion.div 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-4 bg-slate-600 mt-1"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
