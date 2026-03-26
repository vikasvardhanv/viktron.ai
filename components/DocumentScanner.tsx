import React, { useState, useEffect } from 'react';
import { Shield, FolderOpen, CheckCircle, Loader2 } from 'lucide-react';

interface DocumentScannerProps {
  onProfileReady: (sessionId: string, fieldCount: number) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({ onProfileReady }) => {
  const [stage, setStage] = useState<'idle' | 'scanning' | 'uploading' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [existingSession, setExistingSession] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vk_profile_session');
    if (stored) setExistingSession(stored);
  }, []);

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = () => resolve(); s.onerror = reject;
      document.head.appendChild(s);
    });

  const extractPdf = async (file: File): Promise<string> => {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    const w = window as any;
    w.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const buf = await file.arrayBuffer();
    const pdf = await w.pdfjsLib.getDocument({ data: buf }).promise;
    const texts: string[] = [];
    for (let p = 1; p <= Math.min(pdf.numPages, 20); p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      texts.push((content.items as any[]).map((i: any) => i.str).join(' '));
    }
    return texts.join('\n');
  };

  const extractDocx = async (file: File): Promise<string> => {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    const buf = await file.arrayBuffer();
    const result = await (window as any).mammoth.extractRawText({ arrayBuffer: buf });
    return result.value;
  };

  const handleScan = async () => {
    let dirHandle: FileSystemDirectoryHandle;
    try {
      dirHandle = await (window as any).showDirectoryPicker({ mode: 'read' });
    } catch {
      return;
    }

    setStage('scanning');
    setProgress(5);

    const files: { handle: FileSystemFileHandle; name: string }[] = [];
    for await (const entry of (dirHandle as any).values()) {
      if (entry.kind === 'file') {
        const n = entry.name.toLowerCase();
        if (n.endsWith('.pdf') || n.endsWith('.docx') || n.endsWith('.doc')) {
          files.push({ handle: entry, name: entry.name });
        }
      }
    }

    if (files.length === 0) {
      setStatusMsg('No PDF or Word files found. Try your Downloads or Desktop folder.');
      setStage('error');
      return;
    }

    const allText: string[] = [];
    const fileNames: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setStatusMsg(`Reading ${files[i].name} (${i + 1}/${files.length})…`);
      setProgress(Math.round(10 + (i / files.length) * 60));
      try {
        const file = await files[i].handle.getFile();
        const text = file.name.toLowerCase().endsWith('.pdf')
          ? await extractPdf(file)
          : await extractDocx(file);
        if (text.trim()) { allText.push(text); fileNames.push(files[i].name); }
      } catch (e) {
        console.warn('Skip', files[i].name, e);
      }
    }

    setStage('uploading');
    setProgress(80);
    setStatusMsg('Building your profile…');

    const apiBase = (import.meta as any).env?.VITE_API_URL || '';
    const resp = await fetch(`${apiBase}/api/profile/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw_text: allText.join('\n\n'), file_names: fileNames }),
    });

    if (!resp.ok) {
      setStatusMsg('Error building profile. Please try again.');
      setStage('error');
      return;
    }

    const data = await resp.json();
    localStorage.setItem('vk_profile_session', data.session_id);
    setProgress(100);
    setStage('done');
    setStatusMsg(`Profile ready — ${data.fields_found} fields extracted from ${fileNames.length} files.`);
    onProfileReady(data.session_id, data.fields_found);
  };

  const useExisting = () => {
    if (existingSession) onProfileReady(existingSession, 0);
  };

  return (
    <div className="rounded-xl border border-purple-500/20 bg-slate-900 p-6">
      <div className="mb-4 rounded-lg border border-indigo-500/30 bg-indigo-950/30 p-4 text-sm text-slate-400 leading-relaxed">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-purple-300">Privacy First</span>
        </div>
        To auto-fill your forms, we'll scan PDFs and Word docs from a folder you choose.
        Your files are read <strong className="text-slate-300">locally in your browser</strong> — raw files never leave your device.
        Only extracted text is processed to build your profile, which is{' '}
        <strong className="text-slate-300">automatically deleted within 24 hours</strong>.
        We never sell or share your data.
      </div>

      {existingSession && stage === 'idle' && (
        <div className="mb-3 flex gap-3">
          <button
            onClick={useExisting}
            className="flex-1 rounded-lg border border-purple-500/30 bg-purple-900/20 px-4 py-2 text-sm text-purple-300 hover:bg-purple-900/40 transition-colors"
          >
            Use Previous Scan
          </button>
          <button
            onClick={handleScan}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Re-scan Documents
          </button>
        </div>
      )}

      {!existingSession && stage === 'idle' && (
        <button
          onClick={handleScan}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          <FolderOpen className="w-4 h-4" />
          Allow &amp; Scan My Documents
        </button>
      )}

      {(stage === 'scanning' || stage === 'uploading') && (
        <div>
          <div className="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-violet-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            {statusMsg}
          </p>
        </div>
      )}

      {stage === 'done' && (
        <p className="mt-3 flex items-center gap-2 text-sm text-green-400">
          <CheckCircle className="w-4 h-4" />
          {statusMsg}
        </p>
      )}

      {stage === 'error' && (
        <p className="mt-3 text-sm text-red-400">{statusMsg}</p>
      )}
    </div>
  );
};
