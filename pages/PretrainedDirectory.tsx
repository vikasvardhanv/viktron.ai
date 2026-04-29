import React, { useEffect, useState } from 'react';
import { SEO } from '../components/ui/SEO';

export default function PretrainedDirectory() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/pretrained')
      .then(r => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <SEO
        title="Pretrained AI Workers Directory | Viktron"
        description="Browse and deploy pretrained AI agent workers. Pre-built AI models ready for customer support, sales, and operational tasks. One-click agent deployment."
        url="/pretrained"
        keywords="pretrained AI workers, AI agent templates, pre-built AI agents, ready AI models, instant AI deployment"
      />
      <h1 className="text-2xl font-bold mb-4">Pretrained Workers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.code} className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded flex items-center justify-center">{t.ui?.icon || '🤖'}</div>
              <div>
                <div className="text-lg font-semibold">{t.display_name}</div>
                <div className="text-sm text-slate-500">{t.tagline}</div>
              </div>
            </div>
            <p className="text-sm mt-3 text-slate-700">{t.description}</p>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 rounded bg-blue-600 text-white">Spawn</button>
              <button className="px-3 py-1 rounded border">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
