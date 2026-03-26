import React, { useState } from 'react';
import { AlertTriangle, Fingerprint, ActivitySquare, Database, ListChecks } from 'lucide-react';
import axios from 'axios';

export default function ResultsDashboard({ result, analyzing }) {
  const [feedbackStored, setFeedbackStored] = useState(false);

  if (analyzing) {
    return (
      <div className="glass-panel animate-fade-in flex flex-col items-center justify-center p-10 h-full">
        <ActivitySquare size={48} color="var(--accent)" className="animate-pulse mb-6" />
        <h3 className="text-[1.4rem] font-normal mb-2">Live Analytics Computing</h3>
        <p className="text-secondary">Fusing anomaly detections, bounding boxes, and manifest heuristics...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center p-10 h-full opacity-50">
        <Database size={48} color="var(--text-secondary)" className="mb-6" />
        <p className="text-secondary text-lg">No telemetry data. Awaiting scan initialization.</p>
      </div>
    );
  }

  // Handle manual officer feedback mapping to DB endpoint
  const sendFeedback = async (vote) => {
    try {
      await axios.post('http://localhost:5000/api/feedback', { id: result._id, feedback: vote });
      setFeedbackStored(true);
    } catch(e) {
      console.error(e);
      alert('Network issue recording feedback');
    }
  };

  return (
    <div className="glass-panel animate-fade-in p-8 h-full">
      {result.riskLevel === 'HIGH' ? (
        <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-lg mb-6 text-center">
          <h2 className="text-red-300 m-0 tracking-widest text-xl font-semibold">⚠️ CARGO DETAINED ⚠️</h2>
        </div>
      ) : result.riskLevel === 'MEDIUM' ? (
        <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-lg mb-6 text-center">
          <h2 className="text-amber-300 m-0 tracking-widest text-xl font-semibold">✋ MANUAL INSPECTION REQUIRED ✋</h2>
        </div>
      ) : (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-lg mb-6 text-center">
          <h2 className="text-emerald-300 m-0 tracking-widest text-xl font-semibold">✅ CLEARED FOR ENTRY ✅</h2>
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-[1.3rem] font-semibold mb-1 flex items-center gap-2">
            <Fingerprint size={20} color="var(--accent)" />
            CBP Automated Clearance Report
          </h3>
          <p className="text-secondary text-sm">Scan Record ID: {result._id}</p>
        </div>
        
        <div className="text-right">
          <div className={`text-[2.5rem] font-bold leading-none ${result.riskLevel === 'HIGH' ? 'text-danger' : result.riskLevel === 'MEDIUM' ? 'text-warning' : 'text-success'}`}>
            {result.riskScore}<span className="text-xl opacity-70">/100</span>
          </div>
          <span className={`badge ${result.riskLevel} mt-2`}>
            {result.riskLevel} RISK
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900/40 p-4 rounded-xl border border-border">
          <p className="text-secondary text-sm mb-1">Autoencoder Anomaly</p>
          <div className="text-2xl font-semibold">{(result.anomalyScore * 100).toFixed(1)}%</div>
          <div className="w-full h-1 bg-white/10 mt-2 rounded">
            <div className="h-full bg-accent rounded" style={{ width: `${result.anomalyScore * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-slate-900/40 p-4 rounded-xl border border-border">
          <p className="text-secondary text-sm mb-1">Manifest Mismatch</p>
          <div className="text-2xl font-semibold">{(result.mismatchScore * 100).toFixed(1)}%</div>
          <div className="w-full h-1 bg-white/10 mt-2 rounded">
            <div className="h-full bg-warning rounded" style={{ width: `${result.mismatchScore * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-base font-medium mb-4 flex items-center gap-2">
          <ListChecks size={18} />
          Inference Reasoning
        </h4>
        <div className="flex flex-col gap-3">
          {result.explanation.map((exp, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border-l-4 border-accent">
              <AlertTriangle size={16} color="var(--accent)" className="mt-0.5 shrink-0" />
              <p className="text-[0.95rem] leading-relaxed m-0">{exp}</p>
            </div>
          ))}
          {result.explanation.length === 0 && (
             <p className="text-secondary">No targeted reasoning generated.</p>
          )}
        </div>
      </div>

      {/* Human In The Loop */}
      <div className="border-t border-border pt-6">
        <p className="text-sm text-secondary mb-4">Officer Verification Protocol</p>
        
        {feedbackStored ? (
          <div className="p-3 bg-emerald-500/10 text-emerald-300 rounded-lg text-center border border-emerald-500/30">
            Feedback recorded successfully. Model will be fine-tuned.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <button className="glass-button text-sm text-success" onClick={() => sendFeedback('ACCURATE')}>Confirm Flag</button>
            <button className="glass-button text-sm text-warning" onClick={() => sendFeedback('FALSE_POSITIVE')}>False Positive</button>
            <button className="glass-button text-sm text-danger" onClick={() => sendFeedback('FALSE_NEGATIVE')}>Missed Threat</button>
          </div>
        )}
      </div>
    </div>
  );
}
