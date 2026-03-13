import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, AlertCircle, Loader2, RefreshCw, MessageSquare, Hash, Phone } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  fetchUserTeams, fetchChannelConfig, verifySlackToken, verifyTeamsCredentials,
  type ChannelInfo,
} from '../../services/dashboardApi';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#09090f', card: '#111118', border: '#1e1e2e',
  accent: '#0ea5e9', purple: '#a855f7', pink: '#ec4899',
  green: '#22c55e', red: '#ef4444', yellow: '#f59e0b', muted: '#6b7280',
};

// ── Step dot indicator ────────────────────────────────────────────────────────
const StepDots: React.FC<{ steps: number; current: number }> = ({ steps, current }) => (
  <div className="flex items-center gap-2 justify-center">
    {Array.from({ length: steps }).map((_, i) => (
      <div key={i} className="rounded-full transition-all duration-300"
        style={{
          width: i === current ? 20 : 6, height: 6,
          background: i <= current ? C.accent : C.border,
        }} />
    ))}
  </div>
);

// ── Input component ───────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; disabled?: boolean;
}> = ({ label, value, onChange, type = 'text', placeholder, disabled }) => (
  <div>
    <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>{label}</label>
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled}
      className="w-full rounded-lg px-3 py-2.5 text-sm text-white border outline-none transition-colors focus:border-sky-500 disabled:opacity-50"
      style={{ background: C.bg, borderColor: C.border }}
    />
  </div>
);

// ── Copy button ───────────────────────────────────────────────────────────────
const CopyField: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border" style={{ background: C.bg, borderColor: C.border }}>
      <code className="text-xs flex-1 text-white truncate">{value}</code>
      <button onClick={copy} className="flex-shrink-0 transition-colors"
        style={{ color: copied ? C.green : C.muted }}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
};

// ── Slack Wizard ──────────────────────────────────────────────────────────────
const SLACK_WEBHOOK = 'https://api.viktron.ai/api/channels/slack/events';

const SlackWizard: React.FC<{ teamId: string; initialInfo: ChannelInfo }> = ({ teamId, initialInfo }) => {
  const [info, setInfo] = useState(initialInfo);
  const [step, setStep] = useState(0);
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const isConfigured = info.status === 'active';

  const verifyToken = async () => {
    if (!token.trim()) return;
    setVerifying(true); setError('');
    try {
      const res = await verifySlackToken({ team_id: teamId, bot_token: token.trim() });
      const data = res.data as { valid: boolean; workspace_name?: string; error?: string };
      if (data.valid) { setInfo(prev => ({ ...prev, workspace_name: data.workspace_name })); setStep(1); }
      else setError(data.error ?? 'Invalid token');
    } catch { setError('Verification failed. Check your token.'); } finally { setVerifying(false); }
  };

  const saveSecret = async () => {
    setVerifying(true); setError('');
    try {
      await verifySlackToken({ team_id: teamId, bot_token: token.trim(), signing_secret: secret.trim() });
      setStep(2);
    } catch { setError('Failed to save. Try again.'); } finally { setVerifying(false); }
  };

  if (isConfigured && step !== 3) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${C.green}12`, border: `1px solid ${C.green}30` }}>
          <Check size={14} style={{ color: C.green }} />
          <span className="text-sm text-white font-medium">Connected to {info.workspace_name || 'Slack'}</span>
        </div>
        <div>
          <p className="text-xs mb-1.5" style={{ color: C.muted }}>Webhook URL</p>
          <CopyField value={SLACK_WEBHOOK} />
        </div>
        <button onClick={() => { setInfo({ status: 'not_configured' }); setStep(0); }}
          className="text-xs transition-colors hover:text-white" style={{ color: C.muted }}>
          Reconfigure →
        </button>
      </div>
    );
  }

  const steps = [
    // Step 0: Bot token
    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }} className="space-y-4">
      <Field label="Bot Token" value={token} onChange={setToken}
        type="password" placeholder="xoxb-..." />
      {error && <p className="text-xs" style={{ color: C.red }}>{error}</p>}
      <button onClick={verifyToken} disabled={verifying || !token.trim()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white w-full justify-center disabled:opacity-50 transition-all"
        style={{ background: C.accent }}>
        {verifying ? <Loader2 size={14} className="animate-spin" /> : null}
        Verify Token
      </button>
    </motion.div>,

    // Step 1: Signing secret
    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }} className="space-y-4">
      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: `${C.green}10`, color: C.green }}>
        <Check size={12} /> Workspace verified: <strong>{info.workspace_name}</strong>
      </div>
      <Field label="Signing Secret" value={secret} onChange={setSecret} type="password" />
      {error && <p className="text-xs" style={{ color: C.red }}>{error}</p>}
      <button onClick={saveSecret} disabled={verifying || !secret.trim()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white w-full justify-center disabled:opacity-50"
        style={{ background: C.accent }}>
        {verifying ? <Loader2 size={14} className="animate-spin" /> : null}
        Save & Continue
      </button>
    </motion.div>,

    // Step 2: Webhook URL
    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }} className="space-y-4">
      <div>
        <p className="text-xs mb-2" style={{ color: C.muted }}>Add this URL in your Slack app settings → Event Subscriptions</p>
        <CopyField value={SLACK_WEBHOOK} />
      </div>
      <button onClick={() => setStep(3)}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white w-full" style={{ background: C.green }}>
        Done — Setup Complete
      </button>
    </motion.div>,
  ];

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">{steps[Math.min(step, 2)]}</AnimatePresence>
      <StepDots steps={3} current={step} />
    </div>
  );
};

// ── Teams Wizard ──────────────────────────────────────────────────────────────
const TEAMS_WEBHOOK = 'https://api.viktron.ai/api/channels/teams/webhook';

const TeamsWizard: React.FC<{ teamId: string; initialInfo: ChannelInfo }> = ({ teamId, initialInfo }) => {
  const [info, setInfo] = useState(initialInfo);
  const [step, setStep] = useState(0);
  const [appId, setAppId] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const isConfigured = info.status === 'active';

  const verify = async () => {
    if (!appId.trim() || !appPassword.trim()) return;
    setVerifying(true); setError('');
    try {
      const res = await verifyTeamsCredentials({ team_id: teamId, app_id: appId.trim(), app_password: appPassword.trim() });
      const data = res.data as { valid: boolean; bot_name?: string; error?: string };
      if (data.valid) { setInfo(prev => ({ ...prev, bot_name: data.bot_name })); setStep(1); }
      else setError(data.error ?? 'Invalid credentials');
    } catch { setError('Verification failed.'); } finally { setVerifying(false); }
  };

  if (isConfigured && step !== 2) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${C.green}12`, border: `1px solid ${C.green}30` }}>
          <Check size={14} style={{ color: C.green }} />
          <span className="text-sm text-white font-medium">Connected — {info.bot_name || 'Viktron Bot'}</span>
        </div>
        <CopyField value={TEAMS_WEBHOOK} />
        <button onClick={() => { setInfo({ status: 'not_configured' }); setStep(0); }}
          className="text-xs transition-colors hover:text-white" style={{ color: C.muted }}>Reconfigure →</button>
      </div>
    );
  }

  const steps = [
    <motion.div key="t0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }} className="space-y-4">
      <Field label="App ID (Client ID)" value={appId} onChange={setAppId} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
      <Field label="App Password" value={appPassword} onChange={setAppPassword} type="password" />
      {error && <p className="text-xs" style={{ color: C.red }}>{error}</p>}
      <button onClick={verify} disabled={verifying || !appId.trim() || !appPassword.trim()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white w-full justify-center disabled:opacity-50"
        style={{ background: C.accent }}>
        {verifying ? <Loader2 size={14} className="animate-spin" /> : null}
        Verify Credentials
      </button>
    </motion.div>,

    <motion.div key="t1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }} className="space-y-4">
      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: `${C.green}10`, color: C.green }}>
        <Check size={12} /> Bot verified — credentials saved securely
      </div>
      <div>
        <p className="text-xs mb-2" style={{ color: C.muted }}>Set this as your Messaging Endpoint in the Azure Bot registration</p>
        <CopyField value={TEAMS_WEBHOOK} />
      </div>
      <button onClick={() => setStep(2)}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white w-full" style={{ background: C.green }}>
        Done
      </button>
    </motion.div>,
  ];

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">{steps[Math.min(step, 1)]}</AnimatePresence>
      <StepDots steps={2} current={step} />
    </div>
  );
};

// ── Channel card wrapper ──────────────────────────────────────────────────────
interface ChannelCardProps {
  title: string; subtitle: string; icon: React.ReactNode; color: string;
  status: string; children: React.ReactNode; delay?: number;
}
const ChannelCard: React.FC<ChannelCardProps> = ({ title, subtitle, icon, color, status, children, delay = 0 }) => {
  const isActive = status === 'active';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl border p-6 flex flex-col gap-5"
      style={{ background: C.card, borderColor: isActive ? `${color}40` : C.border }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${color}18`, color }}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs" style={{ color: C.muted }}>{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium"
          style={{
            background: isActive ? `${C.green}12` : `${C.yellow}10`,
            borderColor: isActive ? `${C.green}30` : `${C.yellow}30`,
            color: isActive ? C.green : C.yellow,
          }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
          {isActive ? 'Connected' : 'Not configured'}
        </div>
      </div>
      <div>{children}</div>
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export const ChannelSetup: React.FC = () => {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [channels, setChannels] = useState<Record<string, ChannelInfo>>({
    slack: { status: 'not_configured' },
    teams: { status: 'not_configured' },
    whatsapp: { status: 'not_configured' },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUserTeams().then(res => {
      const teams = res.data as Array<{ id: string; name: string }>;
      if (teams[0]) { setTeamId(teams[0].id); setTeamName(teams[0].name ?? ''); }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const loadConfig = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetchChannelConfig(teamId);
      const data = res.data as { channels: Record<string, ChannelInfo> };
      setChannels(data.channels);
    } catch { /* use defaults */ }
  }, [teamId]);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  const whatsapp = channels.whatsapp ?? { status: 'not_configured' };
  const isWaActive = whatsapp.status === 'active';

  return (
    <DashboardLayout teamName={teamName}>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Channel Setup</h1>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>
              Configure your messaging channels to receive and send agent responses
            </p>
          </div>
          <button onClick={loadConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all hover:text-white"
            style={{ borderColor: C.border, color: C.muted, background: C.card }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} style={{ color: C.muted }} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Slack */}
            <ChannelCard
              title="Slack" subtitle="Team messaging" color="#4A154B"
              icon={<Hash size={20} />} status={channels.slack?.status ?? 'not_configured'}
              delay={0}
            >
              {teamId && (
                <SlackWizard teamId={teamId} initialInfo={channels.slack ?? { status: 'not_configured' }} />
              )}
            </ChannelCard>

            {/* Teams */}
            <ChannelCard
              title="Microsoft Teams" subtitle="Enterprise messaging" color={C.accent}
              icon={<MessageSquare size={20} />} status={channels.teams?.status ?? 'not_configured'}
              delay={0.1}
            >
              {teamId && (
                <TeamsWizard teamId={teamId} initialInfo={channels.teams ?? { status: 'not_configured' }} />
              )}
            </ChannelCard>

            {/* WhatsApp */}
            <ChannelCard
              title="WhatsApp" subtitle="Customer messaging via Twilio" color="#25D366"
              icon={<Phone size={20} />} status={whatsapp.status}
              delay={0.2}
            >
              {isWaActive ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(37,211,102,0.08)', color: '#25D366' }}>
                    <Check size={12} /> Active — receiving messages
                  </div>
                  {whatsapp.phone_number && (
                    <div>
                      <p className="text-xs mb-1" style={{ color: C.muted }}>Twilio Number</p>
                      <CopyField value={whatsapp.phone_number} />
                    </div>
                  )}
                  <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer"
                    className="text-xs transition-colors hover:text-white" style={{ color: C.muted }}>
                    Manage in Twilio Console →
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs" style={{ color: C.muted }}>
                    WhatsApp is configured via Twilio. Set <code className="px-1 py-0.5 rounded text-xs" style={{ background: C.border }}>TWILIO_*</code> environment variables on your backend to enable.
                  </p>
                  <a href="https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs transition-colors hover:text-white" style={{ color: '#25D366' }}>
                    <AlertCircle size={12} /> Get started with Twilio →
                  </a>
                </div>
              )}
            </ChannelCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
