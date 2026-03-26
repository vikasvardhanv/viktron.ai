import React, { useState } from 'react';
import { Globe, Zap, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';

interface FormFillerConsoleProps {
  sessionId: string;
  agentBaseUrl: string;
}

export const FormFillerConsole: React.FC<FormFillerConsoleProps> = ({ sessionId, agentBaseUrl }) => {
  const [url, setUrl] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [status, setStatus] = useState<'idle' | 'filling' | 'asking' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');
  const [missingField, setMissingField] = useState('');
  const [answer, setAnswer] = useState('');

  const apiBase = (import.meta as any).env?.VITE_API_URL || '';

  const fillForm = async (extraContext = '') => {
    if (!url.trim()) { alert('Please enter a form URL.'); return; }
    setStatus('filling');
    setProgress(20);
    setResult('');

    const task = taskDesc.trim() || `Fill the form at ${url} with my details`;

    const resp = await fetch(`${agentBaseUrl}/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: task,
        context: { url, session_id: sessionId, extra_context: extraContext },
        stream: false,
      }),
    });

    if (!resp.ok) {
      setStatus('error');
      setResult('Failed to start task. Is the agent running?');
      return;
    }

    const { task_id } = await resp.json();
    pollTask(task_id);
  };

  const pollTask = (taskId: string) => {
    const interval = setInterval(async () => {
      setProgress(p => Math.min(85, p + 3));

      const r = await fetch(`${agentBaseUrl}/task/${taskId}`);
      const data = await r.json();

      if (data.status === 'completed') {
        clearInterval(interval);
        setProgress(100);
        setStatus('done');
        setResult(data.result || 'Form filled successfully.');
      } else if (data.status === 'failed') {
        clearInterval(interval);
        setStatus('error');
        setResult(data.error || 'Unknown error.');
      } else if (data.result?.includes('MISSING_FIELD:')) {
        clearInterval(interval);
        const match = data.result.match(/MISSING_FIELD: (.+)/);
        if (match) {
          setMissingField(match[1].trim());
          setStatus('asking');
        }
      }
    }, 2500);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    await fetch(`${apiBase}/api/profile/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: missingField, value: answer }),
    });
    setAnswer('');
    setMissingField('');
    fillForm(`${missingField}: ${answer}`);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Form URL</label>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com/contact"
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Task (optional)</label>
        <input
          type="text"
          value={taskDesc}
          onChange={e => setTaskDesc(e.target.value)}
          placeholder="Fill the contact form with my details"
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
        />
      </div>

      <button
        onClick={() => fillForm()}
        disabled={status === 'filling' || status === 'asking'}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'filling' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {status === 'filling' ? 'Filling form…' : 'Fill Form Autonomously'}
      </button>

      {status === 'filling' && (
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-violet-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {status === 'asking' && (
        <div className="rounded-lg border border-purple-500/30 bg-purple-950/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Agent needs more info</span>
          </div>
          <p className="text-sm text-slate-300 mb-3">
            What is your <strong>{missingField.replace(/_/g, ' ')}</strong>?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitAnswer()}
              placeholder="Your answer…"
              className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              autoFocus
            />
            <button
              onClick={submitAnswer}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {status === 'done' && (
        <div className="rounded-lg border border-green-500/20 bg-green-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-300">Form filled successfully</span>
          </div>
          <pre className="text-xs text-slate-400 whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4 text-sm text-red-400">
          {result}
        </div>
      )}
    </div>
  );
};
