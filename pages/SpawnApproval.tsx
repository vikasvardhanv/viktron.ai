import React, { useEffect, useState } from 'react';

export default function SpawnApproval() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/spawn_requests')
      .then(r => r.json())
      .then(setRequests)
      .catch(() => setRequests([]));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Spawn Requests</h1>
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{req.template_code}</div>
              <div className="text-sm text-slate-500">Requested by: {req.requestor_email || 'unknown'}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
              <button className="px-3 py-1 rounded bg-red-50">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
