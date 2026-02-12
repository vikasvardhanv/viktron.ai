import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  isOpen: boolean;
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', isOpen, onClose, durationMs = 4000 }) => {
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [isOpen, onClose, durationMs]);

  if (!isOpen) return null;

  const colorMap: Record<string, string> = {
    info: 'from-sky-500/20 to-sky-500/10 border-sky-500/30',
    success: 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/30',
    warning: 'from-amber-500/20 to-amber-500/10 border-amber-500/30',
    error: 'from-red-500/20 to-red-500/10 border-red-500/30',
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className={`px-4 py-3 rounded-xl shadow-2xl border bg-gradient-to-r ${colorMap[type]} text-white/90 backdrop-blur-md max-w-[90vw] sm:max-w-md`}> 
        <div className="flex items-center gap-3">
          <span className={`inline-flex h-2 w-2 rounded-full ${type === 'error' ? 'bg-red-400' : type === 'warning' ? 'bg-amber-400' : type === 'success' ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
          <p className="text-sm">{message}</p>
          <button onClick={onClose} className="ml-auto text-white/60 hover:text-white text-xs">Dismiss</button>
        </div>
      </div>
    </div>
  );
};
