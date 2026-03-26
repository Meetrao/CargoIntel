import React, { useState } from 'react';
import { AlertTriangle, Fingerprint, ActivitySquare, Database, ListChecks } from 'lucide-react';
import axios from 'axios';

export default function ResultsDashboard({ result, analyzing }) {
  const [feedbackStored, setFeedbackStored] = useState(false);

  if (analyzing) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ActivitySquare size={48} color="var(--accent)" className="animate-pulse" style={{ marginBottom: '24px' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: '400', marginBottom: '8px' }}>Live Analytics Computing</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Fusing anomaly detections, bounding boxes, and manifest heuristics...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-panel" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
        <Database size={48} color="var(--text-secondary)" style={{ marginBottom: '24px' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No telemetry data. Awaiting scan initialization.</p>
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
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', height: '100%' }}>
      {result.riskLevel === 'HIGH' ? (
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#fca5a5', margin: 0, letterSpacing: '2px', fontSize: '1.2rem', fontWeight: '600' }}>⚠️ CARGO DETAINED ⚠️</h2>
        </div>
      ) : result.riskLevel === 'MEDIUM' ? (
        <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#fcd34d', margin: 0, letterSpacing: '2px', fontSize: '1.2rem', fontWeight: '600' }}>✋ MANUAL INSPECTION REQUIRED ✋</h2>
        </div>
      ) : (
        <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#6ee7b7', margin: 0, letterSpacing: '2px', fontSize: '1.2rem', fontWeight: '600' }}>✅ CLEARED FOR ENTRY ✅</h2>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Fingerprint size={20} color="var(--accent)" />
            CBP Automated Clearance Report
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Scan Record ID: {result._id}</p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1, color: result.riskLevel === 'HIGH' ? 'var(--danger)' : result.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>
            {result.riskScore}<span style={{ fontSize: '1.2rem', opacity: 0.7 }}>/100</span>
          </div>
          <span className={`badge ${result.riskLevel}`} style={{ marginTop: '8px', display: 'inline-block' }}>
            {result.riskLevel} RISK
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Autoencoder Anomaly</p>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{(result.anomalyScore * 100).toFixed(1)}%</div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '8px', borderRadius: '2px' }}>
            <div style={{ width: `${result.anomalyScore * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: '2px' }}></div>
          </div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Manifest Mismatch</p>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{(result.mismatchScore * 100).toFixed(1)}%</div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '8px', borderRadius: '2px' }}>
            <div style={{ width: `${result.mismatchScore * 100}%`, height: '100%', background: 'var(--warning)', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ListChecks size={18} />
          Inference Reasoning
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {result.explanation.map((exp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
              <AlertTriangle size={16} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{exp}</p>
            </div>
          ))}
          {result.explanation.length === 0 && (
             <p style={{ color: 'var(--text-secondary)' }}>No targeted reasoning generated.</p>
          )}
        </div>
      </div>

      {/* Human In The Loop */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Officer Verification Protocol</p>
        
        {feedbackStored ? (
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            Feedback recorded successfully. Model will be fine-tuned.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <button className="glass-button" style={{ fontSize: '0.85rem', color: 'var(--success)' }} onClick={() => sendFeedback('ACCURATE')}>Confirm Flag</button>
            <button className="glass-button" style={{ fontSize: '0.85rem', color: 'var(--warning)' }} onClick={() => sendFeedback('FALSE_POSITIVE')}>False Positive</button>
            <button className="glass-button" style={{ fontSize: '0.85rem', color: 'var(--danger)' }} onClick={() => sendFeedback('FALSE_NEGATIVE')}>Missed Threat</button>
          </div>
        )}
      </div>
    </div>
  );
}
