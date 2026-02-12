import React from 'react';

interface WebsitePreviewFallbackProps {
  url?: string | null;
  name?: string | null;
}

const getDomain = (url?: string | null) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
};

export const WebsitePreviewFallback: React.FC<WebsitePreviewFallbackProps> = ({ url, name }) => {
  const domain = getDomain(url);

  return (
    <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center border border-white/10">
          {domain ? (
            // Lightweight favicon fetch via Google service
            <img
              src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`}
              alt="favicon"
              className="w-6 h-6"
            />
          ) : (
            <span className="w-3 h-3 rounded-full bg-sky-400" />
          )}
        </div>
        <div>
          <div className="text-sm text-white/70">Website</div>
          <div className="text-white font-semibold">{name || domain || 'Unknown Site'}</div>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-4">
        <div className="text-xs text-white/50">
          {domain ? (
            <>Preview unavailable. Showing minimal details for {domain}.</>
          ) : (
            <>No website provided. Add a URL to see basic info.</>
          )}
        </div>
        {/* Placeholder preview box */}
        <div className="mt-3 h-24 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-[11px] text-white/40">
          Small site display placeholder
        </div>
      </div>
    </div>
  );
};
