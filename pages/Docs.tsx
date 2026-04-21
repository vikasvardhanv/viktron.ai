import React from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Server, Key, BookOpen, Layers, Shield } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

export const Docs = () => {
  return (
    <Layout>
      <SEO 
        title="Developer Docs | Viktron AI" 
        description="API documentation for the Viktron Intelligent Layer. Integrate AgentIRL orchestration, governance, and audit logging into your applications."
      />
      
      <div className="bg-slate-900 pt-32 pb-20 min-h-screen text-slate-300">
        <div className="container-custom max-w-5xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              API v1.2.0 LIVE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Developer Documentation</h1>
            <p className="text-xl text-slate-400 max-w-3xl">
              Embed production-ready AI agents into your product with the Viktron API. 
              Get full access to the AgentIRL engine, governance hooks, and the immutable trust ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-1 space-y-2">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Getting Started</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-blue-400 hover:text-blue-300">Authentication</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-slate-200">Rate Limits</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-slate-200">SDKs (Python/Node)</a></li>
                </ul>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Endpoints</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-slate-400 hover:text-slate-200">/api/agentirl/missions</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-slate-200">/api/platform/overview</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-slate-200">/api/trust-report/teams</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-slate-200">/api/developers/webhooks</a></li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                  <Terminal className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-semibold text-white">Initialize AgentIRL Mission</h2>
                </div>
                <p className="text-slate-400 mb-4 text-sm">
                  Trigger an autonomous workflow with a specific policy tier attached.
                </p>
                <div className="bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="text-slate-500 mb-2">POST https://api.viktron.ai/api/agentirl/missions</div>
                  <div className="text-blue-300">curl <span className="text-white">-X POST</span> https://api.viktron.ai/api/agentirl/missions \</div>
                  <div className="text-blue-300 pl-4">-H <span className="text-yellow-300">"Authorization: Bearer vk_live_xxxx"</span> \</div>
                  <div className="text-blue-300 pl-4">-H <span className="text-yellow-300">"Content-Type: application/json"</span> \</div>
                  <div className="text-blue-300 pl-4">-d <span className="text-yellow-300">'{'{'}</span></div>
                  <div className="text-green-300 pl-8">"goal": <span className="text-yellow-300">"Process Q3 enterprise invoices"</span>,</div>
                  <div className="text-green-300 pl-8">"governance_policy": <span className="text-yellow-300">"pol-001-strict"</span>,</div>
                  <div className="text-green-300 pl-8">"audit_level": <span className="text-yellow-300">"comprehensive"</span></div>
                  <div className="text-blue-300 pl-4"><span className="text-yellow-300">{"'}'"}</span></div>
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                  <Shield className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-xl font-semibold text-white">Verify Trust Report (Audit)</h2>
                </div>
                <p className="text-slate-400 mb-4 text-sm">
                  Fetch a cryptographically signed audit log of all agent decisions for compliance verification.
                </p>
                <div className="bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="text-slate-500 mb-2">GET https://api.viktron.ai/api/trust-report/teams/{'{team_id}'}</div>
                  <div className="text-white">{'{'}</div>
                  <div className="text-green-300 pl-4">"team_id": <span className="text-yellow-300">"123e4567-e89b-12d3-a456-426614174000"</span>,</div>
                  <div className="text-green-300 pl-4">"period_days": <span className="text-blue-400">30</span>,</div>
                  <div className="text-green-300 pl-4">"summary": {'{'}</div>
                  <div className="text-green-300 pl-8">"human_approved": <span className="text-blue-400">14</span>,</div>
                  <div className="text-green-300 pl-8">"destructive_ops_blocked": <span className="text-blue-400">2</span></div>
                  <div className="text-green-300 pl-4">{'}'},</div>
                  <div className="text-green-300 pl-4">"signature": {'{'}</div>
                  <div className="text-green-300 pl-8">"algorithm": <span className="text-yellow-300">"SHA-256"</span>,</div>
                  <div className="text-green-300 pl-8">"digest": <span className="text-yellow-300">"a3f9e..."</span></div>
                  <div className="text-green-300 pl-4">{'}'}</div>
                  <div className="text-white">{'}'}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
