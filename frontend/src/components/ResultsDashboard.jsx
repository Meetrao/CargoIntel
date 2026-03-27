<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Layers,
  Eye,
  Maximize2,
  X,
  Zap
} from 'lucide-react';

export default function ResultsDashboard({ result, analyzing }) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keyboard escape listener
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (analyzing) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-12 h-full text-center group">
        <div className="relative mb-8">
           <div className="w-24 h-24 border-2 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin" />
           <Activity size={32} className="absolute inset-0 m-auto text-accent-cyan animate-pulse" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-white uppercase italic mb-2">Analyzing Payload</h3>
        <p className="text-[0.65rem] font-bold text-text-dim uppercase tracking-[0.2em] max-w-[200px]">
          Executing YOLOv8 Neural Inference & Risk Heuristics...
        </p>
=======
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
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
      </div>
    );
  }

  if (!result) {
    return (
<<<<<<< HEAD
      <div className="glass-card flex flex-col items-center justify-center p-12 h-full text-center opacity-40">
        <ShieldAlert size={48} className="text-text-dim mb-6" />
        <p className="text-[0.65rem] font-bold text-text-dim uppercase tracking-[0.3em]">
          Telemetry Offline - Awaiting Scan
        </p>
=======
      <div className="glass-panel flex flex-col items-center justify-center p-10 h-full opacity-50">
        <Database size={48} color="var(--text-secondary)" className="mb-6" />
        <p className="text-secondary text-lg">No telemetry data. Awaiting scan initialization.</p>
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
      </div>
    );
  }

<<<<<<< HEAD
  // Parse Risk Score from backend text
  const riskSummary = result.risk_summary || '';
  const scoreMatch = riskSummary.match(/Risk Score : (\d+)/);
  const riskScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  
  const isHighRisk = riskScore >= 60;
  const isCritical = riskScore >= 80;
  const riskLevel = isCritical ? 'CRITICAL' : isHighRisk ? 'HIGH' : riskScore >= 35 ? 'ELEVATED' : 'NOMINAL';
  const accentColor = isCritical ? 'text-accent-red' : isHighRisk ? 'text-accent-amber' : 'text-accent-cyan';
  const strokeColor = isCritical ? '#ff3b3b' : isHighRisk ? '#ff9f0a' : '#00f5ff';

  // Format base64 images
  const detectionImg = `data:image/jpeg;base64,${result.detected_image}`;
  const heatmapImg = `data:image/jpeg;base64,${result.heatmap_image}`;

  const currentImg = showHeatmap ? heatmapImg : detectionImg;

  return (
    <div className="flex flex-col gap-6 h-full animate-fade-in custom-scrollbar overflow-y-auto pr-2">
      
      {/* Visual Workspace Toggle */}
      <div className="glass-card p-4 flex items-center justify-between">
        <span className="text-[0.6rem] font-black text-white uppercase tracking-widest">Inference Workspace</span>
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setShowHeatmap(false)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-[0.55rem] font-bold uppercase transition-all ${!showHeatmap ? 'bg-accent-cyan text-black' : 'text-text-dim'}`}
          >
            <Eye size={12} /> Detection
          </button>
          <button 
            onClick={() => setShowHeatmap(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-[0.55rem] font-bold uppercase transition-all ${showHeatmap ? 'bg-accent-cyan text-black' : 'text-text-dim'}`}
          >
            <Layers size={12} /> Heatmap
          </button>
        </div>
      </div>

      {/* Analysis Output Viewport */}
      <div 
        className="glass-card aspect-video relative overflow-hidden group/view cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={currentImg} 
          alt="Analysis Result" 
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover/view:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
           <div className={`px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[0.5rem] font-black uppercase tracking-widest ${accentColor}`}>
              {showHeatmap ? 'L02_HEATMAP_LAYER' : 'L01_DETECTION_LAYER'}
           </div>
           <div className="flex justify-end">
              <div className="p-2 bg-black/60 rounded border border-white/10 text-white/40 group-hover/view:text-accent-cyan transition-colors">
                 <Maximize2 size={12} />
              </div>
           </div>
        </div>
        {/* Decorative HUD Elements */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[0.45rem] font-black text-white/20 uppercase tracking-[0.3em]">
           <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
           Live HD Feed Synced
        </div>
      </div>

      {/* HD Enlarge Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 lg:p-20 bg-black/90 backdrop-blur-2xl animate-fade-in">
           <div className="absolute inset-0 scanner-overlay opacity-30 pointer-events-none" />
           
           {/* Modal Close & Actions */}
           <div className="absolute top-10 right-10 flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[0.6rem] font-black text-accent-cyan uppercase tracking-widest leading-none mb-1">HD Neural Uplink</span>
                 <span className="text-[0.5rem] font-bold text-text-dim uppercase tracking-[0.3em]">Ref: 8829-X-SEC</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90"
              >
                <X size={24} />
              </button>
           </div>

           {/* Central Image View */}
           <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={currentImg} 
                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                alt="Enlarged Analysis"
              />
              
              {/* Tactical Corners */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent-cyan/40 rounded-tl-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent-cyan/40 rounded-tr-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent-cyan/40 rounded-bl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent-cyan/40 rounded-br-3xl pointer-events-none" />
              
              {/* Modal HUD Info */}
              <div className="absolute bottom-10 left-10 flex flex-col gap-4">
                 <div className="p-4 bg-black/60 border border-white/5 rounded-lg flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-cyan/10 rounded flex items-center justify-center text-accent-cyan shadow-[0_0_15px_#00f5ff]">
                       <Zap size={20} />
                    </div>
                    <div>
                       <p className="text-[0.55rem] font-bold text-text-dim uppercase tracking-widest">Protocol Type</p>
                       <p className="text-xs font-black text-white uppercase tracking-widest">{showHeatmap ? 'Anomaly Heatmap' : 'Neural Detection'}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
      
      {/* Risk Assessment Module */}
      <div className="glass-card p-6 border-b-2" style={{ borderColor: strokeColor }}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em]">Risk Assessment</h4>
          <span className="text-[0.6rem] text-text-dim font-bold uppercase tracking-widest italic">{result.risk_summary.split('\n')[0]}</span>
        </div>
        <div className="flex items-center justify-center p-2 relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke={strokeColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * riskScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${accentColor}`}>{riskScore}%</span>
              <span className="text-[0.5rem] font-black text-text-dim uppercase tracking-widest mt-1">Severity Index</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end mt-4">
           <div className="flex flex-col">
              <span className="text-[0.55rem] font-bold text-text-dim uppercase tracking-widest mb-1 italic">Threat Level</span>
              <span className={`text-xs font-black uppercase tracking-widest ${accentColor}`}>{riskLevel}</span>
           </div>
           <div className="h-6 w-[1px] bg-white/10" />
           <div className="flex flex-col items-end">
              <span className="text-[0.55rem] font-bold text-text-dim uppercase tracking-widest mb-1 italic">Processing Logic</span>
              <span className="text-xs font-black text-white uppercase tracking-widest">YOLOv8s Neural</span>
           </div>
        </div>
      </div>

      {/* Logic & Reasoning Module */}
      <div className="glass-card p-6 bg-accent-cyan/[0.02]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-accent-cyan" />
            <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em]">Neural Reasoning</h4>
          </div>
        </div>
        <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
          <pre className="text-[0.65rem] font-medium leading-relaxed text-white/70 whitespace-pre-wrap font-sans">
            {result.reasoning || "No analytical data available for this sector."}
          </pre>
        </div>
      </div>

      {/* Protocol Recommendation */}
      <div className="glass-card p-6 border-accent-red/20 overflow-hidden relative">
        <div className="flex items-center gap-2 mb-4">
           <ShieldAlert size={14} className={riskScore > 35 ? 'text-accent-amber' : 'text-accent-cyan'} />
           <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em]">Protocol Advisory</h4>
        </div>
        <div className="p-3 bg-white/5 rounded border border-white/5 mb-4">
           <p className="text-[0.7rem] font-bold text-white/80 italic leading-relaxed">
              {result.risk_summary.includes('Decision') ? result.risk_summary.split('Decision   :')[1].trim() : 'Proceed with standard clearance.'}
           </p>
        </div>
        {riskScore > 35 && (
          <button className="btn-protocol btn-protocol-danger w-full py-4 text-xs font-black uppercase tracking-widest">
            Initiate Level 2 Inspection
          </button>
=======
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
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
        )}
      </div>
    </div>
  );
}
