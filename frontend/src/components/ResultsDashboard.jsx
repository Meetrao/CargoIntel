import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  Activity, 
  ShieldAlert, 
  Layers,
  Eye,
  Maximize2,
  X,
  Zap,
  AlertTriangle
} from 'lucide-react';

export default function ResultsDashboard({ result, analyzing }) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [geminiError, setGeminiError] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const generateAiReport = async () => {
    try {
      setIsGeneratingSummary(true);
      setGeminiError('');
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not found in environment.");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are a Senior Customs and Border Security Analyst. Review this automated X-Ray inference payload and provide a severe, professional 3-sentence executive summary report for command. Do not use markdown. Payload: Risk: ${result.risk_summary}. Reasons: ${result.reasoning}.`;
      const modelResponse = await model.generateContent(prompt);
      setAiSummary(modelResponse.response.text());
    } catch (e) {
      console.error(e);
      setGeminiError('AI Network Uplink Failed. Manual review required.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  useEffect(() => {
    if (result && !aiSummary && !isGeneratingSummary && !geminiError) {
      generateAiReport();
    }
  }, [result]);

  useEffect(() => {
    if (result) {
      const riskSummary = result.risk_summary || '';
      const scoreMatch = riskSummary.match(/Risk Score : (\d+)/);
      const riskScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      
      if (riskScore > 0 && riskScore < 60) {
        setIsAlertOpen(true);
      } else {
        setIsAlertOpen(false);
      }
    }
  }, [result]);

  if (analyzing) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-12 h-full text-center">
        <div className="relative mb-6">
           <div className="w-20 h-20 border-2 border-[#D1D9E0] border-t-gov-accent rounded-full animate-spin" />
           <Activity size={28} className="absolute inset-0 m-auto text-gov-accent animate-pulse" />
        </div>
        <h3 className="text-base font-semibold tracking-tight text-gov-navy uppercase mb-2">Analyzing Payload</h3>
        <p className="text-[0.6rem] font-medium text-text-dim uppercase tracking-[0.18em] max-w-[200px]">
          Executing YOLOv8 Neural Inference & Risk Heuristics...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-12 h-full text-center opacity-40">
        <ShieldAlert size={44} className="text-text-dim mb-5" />
        <p className="text-[0.6rem] font-semibold text-text-dim uppercase tracking-[0.25em]">
          Telemetry Offline - Awaiting Scan
        </p>
      </div>
    );
  }

  const riskSummary = result.risk_summary || '';
  const scoreMatch = riskSummary.match(/Risk Score : (\d+)/);
  const riskScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  
  const isHighRisk = riskScore >= 60;
  const isCritical = riskScore >= 80;
  const riskLevel = isCritical ? 'CRITICAL' : isHighRisk ? 'HIGH' : riskScore >= 35 ? 'ELEVATED' : 'NOMINAL';
  const accentColorClass = isCritical ? 'text-accent-red' : isHighRisk ? 'text-accent-amber' : 'text-gov-accent';
  const strokeColor = isCritical ? '#C62828' : isHighRisk ? '#F9A825' : '#3A6EA5';

  const detectionImg = result.detected_image ? `data:image/jpeg;base64,${result.detected_image}` : null;
  const heatmapImg = result.heatmap_image ? `data:image/jpeg;base64,${result.heatmap_image}` : null;
  const currentImg = showHeatmap ? heatmapImg : detectionImg;

  return (
    <div className="flex flex-col gap-5 h-full animate-fade-in custom-scrollbar overflow-y-auto pr-2">
      
      {/* Visual Workspace Toggle */}
      <div className="glass-card p-3.5 flex items-center justify-between">
        <span className="text-[0.6rem] font-semibold text-gov-navy uppercase tracking-widest">Inference Workspace</span>
        <div className="flex bg-[#EEF1F5] p-0.5 rounded border border-[#D1D9E0]">
          <button 
            onClick={() => setShowHeatmap(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[0.55rem] font-semibold uppercase transition-all ${!showHeatmap ? 'bg-gov-navy text-white shadow-sm' : 'text-text-dim hover:text-gov-navy'}`}
          >
            <Eye size={11} /> Detection
          </button>
          <button 
            onClick={() => setShowHeatmap(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[0.55rem] font-semibold uppercase transition-all ${showHeatmap ? 'bg-gov-navy text-white shadow-sm' : 'text-text-dim hover:text-gov-navy'}`}
          >
            <Layers size={11} /> Heatmap
          </button>
        </div>
      </div>

      {/* Analysis Output Viewport */}
      <div 
        className="glass-card aspect-video relative overflow-hidden group/view cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {currentImg ? (
          <img src={currentImg} alt="Analysis Result" className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4F6F8] text-text-dim text-[0.6rem] font-medium uppercase tracking-[0.25em] gap-3">
             <Activity size={22} className="opacity-40" />
             <p className="text-center">Visual Telemetry Unrecoverable<br/><span className="text-[0.5rem] opacity-60">Legacy Archive Only</span></p>
          </div>
        )}
        <div className="absolute inset-0 bg-gov-navy/5 opacity-0 group-hover/view:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
           <div className={`px-2.5 py-1 rounded bg-[#EEF1F5] border border-[#D1D9E0] text-[0.48rem] font-semibold uppercase tracking-widest shadow-sm ${accentColorClass}`}>
              {showHeatmap ? 'L02_HEATMAP_LAYER' : 'L01_DETECTION_LAYER'}
           </div>
           <div className="flex justify-end">
              <div className="p-1.5 bg-[#EEF1F5] rounded border border-[#D1D9E0] text-text-dim group-hover/view:text-gov-accent transition-colors shadow-sm">
                 <Maximize2 size={11} />
              </div>
           </div>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[0.42rem] font-semibold text-text-dim uppercase tracking-[0.25em] bg-[#EEF1F5] px-2 py-1 rounded border border-[#D1D9E0]">
           <div className="w-1.5 h-1.5 rounded-full bg-gov-green animate-pulse" />
           Live HD Feed Synced
        </div>
      </div>

      {/* HD Enlarge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 lg:p-16 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="absolute top-8 right-8 flex items-center gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-[0.55rem] font-semibold text-gov-navy/80 uppercase tracking-widest leading-none mb-1">HD Neural Uplink</span>
                 <span className="text-[0.48rem] font-medium text-gov-navy/50 uppercase tracking-[0.25em]">Ref: 8829-X-SEC</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                className="w-12 h-12 bg-white hover:bg-[#F4F6F8] border border-[#D1D9E0] rounded-full flex items-center justify-center text-gov-navy transition-all shadow-gov-md"
              >
                <X size={20} />
              </button>
           </div>
           <div className="relative w-full h-full flex items-center justify-center">
              {currentImg ? (
                <img src={currentImg} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Enlarged Analysis" />
              ) : (
                <div className="flex flex-col gap-4 items-center justify-center text-gov-navy/50 text-sm font-medium uppercase tracking-[0.25em] text-center">
                   <ShieldAlert size={44} className="opacity-30" />
                   <div>[ ARCHIVE DATA OFFLINE ]<br/>IMAGE PAYLOAD MISSING</div>
                </div>
              )}
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gov-accent/50 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gov-accent/50 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gov-accent/50 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gov-accent/50 rounded-br-2xl pointer-events-none" />
              <div className="absolute bottom-8 left-8">
                 <div className="p-3.5 bg-white border border-[#D1D9E0] rounded shadow-gov-md flex items-center gap-3">
                    <div className="w-9 h-9 bg-gov-accent/10 rounded flex items-center justify-center text-gov-accent">
                       <Zap size={16} />
                    </div>
                    <div>
                       <p className="text-[0.5rem] font-semibold text-text-dim uppercase tracking-widest">Protocol Type</p>
                       <p className="text-[0.65rem] font-semibold text-gov-navy uppercase tracking-widest">{showHeatmap ? 'Anomaly Heatmap' : 'Neural Detection'}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Low Confidence High-Priority Alert */}
      {isAlertOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
           <div className="glass-card max-w-md w-full bg-white/95 border-2 border-accent-red/20 shadow-2xl overflow-hidden animate-slide-up">
              <div className="bg-accent-red p-4 flex items-center gap-3">
                 <ShieldAlert size={20} className="text-white animate-pulse" />
                 <h3 className="text-white font-bold tracking-wider uppercase text-[0.7rem]">Recommended Action</h3>
                 <button 
                   onClick={() => setIsAlertOpen(false)}
                   className="ml-auto text-white/80 hover:text-white transition-colors"
                 >
                   <X size={18} />
                 </button>
              </div>
              <div className="p-8 flex flex-col gap-6">
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-5 bg-accent-red/5 rounded-xl border border-accent-red/10 group hover:bg-accent-red/10 transition-all cursor-default">
                       <span className="text-2xl drop-shadow-sm">⛔</span>
                       <span className="text-gov-navy font-bold tracking-tight text-base uppercase">Detain Immediately</span>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-gov-navy/5 rounded-xl border border-gov-navy/10 group hover:bg-gov-navy/10 transition-all cursor-default">
                       <span className="text-2xl drop-shadow-sm">🔍</span>
                       <span className="text-gov-navy font-bold tracking-tight text-base uppercase">Send for Manual Inspection</span>
                    </div>
                 </div>
                 
                 <div className="pt-4 border-t border-[#EEF1F5] flex items-center justify-center gap-2 text-accent-amber animate-pulse">
                    <AlertTriangle size={16} />
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em]">Immediate attention required</p>
                 </div>

                 <button 
                   onClick={() => setIsAlertOpen(false)}
                   className="w-full py-4 mt-2 bg-gov-navy text-white text-[0.65rem] font-bold uppercase tracking-[0.2em] rounded-lg shadow-gov-md hover:bg-[#1a2b4b] transition-all active:scale-[0.98]"
                 >
                   Acknowledge & Close
                 </button>
              </div>
           </div>
        </div>
      )}
      
      {/* Risk Assessment Module */}
      <div className="glass-card p-5 border-l-4" style={{ borderLeftColor: strokeColor }}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[0.6rem] font-semibold text-gov-navy uppercase tracking-[0.25em]">Risk Assessment</h4>
          <span className="text-[0.55rem] text-text-dim font-medium uppercase tracking-widest">{result.risk_summary.split('\n')[0]}</span>
        </div>
        <div className="flex items-center justify-center py-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#EEF1F5" strokeWidth="9" fill="transparent" />
              <circle
                cx="64" cy="64" r="56"
                stroke={strokeColor} strokeWidth="9" fill="transparent"
                strokeDasharray={352} strokeDashoffset={352 - (352 * riskScore) / 100}
                strokeLinecap="round" className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${accentColorClass}`}>{riskScore}%</span>
              <span className="text-[0.45rem] font-semibold text-text-dim uppercase tracking-widest mt-1">Severity Index</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end mt-3 pt-3 border-t border-[#EEF1F5]">
           <div className="flex flex-col">
              <span className="text-[0.5rem] font-semibold text-text-dim uppercase tracking-widest mb-1">Threat Level</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${accentColorClass}`}>{riskLevel}</span>
           </div>
           <div className="h-5 w-px bg-[#D1D9E0]" />
           <div className="flex flex-col items-end">
              <span className="text-[0.5rem] font-semibold text-text-dim uppercase tracking-widest mb-1">Processing Logic</span>
              <span className="text-xs font-semibold text-gov-navy uppercase tracking-widest">YOLOv8s Neural</span>
           </div>
        </div>
      </div>

      {/* Logic & Reasoning Module */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={13} className="text-gov-accent" />
          <h4 className="text-[0.6rem] font-semibold text-gov-navy uppercase tracking-[0.25em]">Neural Reasoning</h4>
        </div>
        <div className="max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
          <pre className="text-[0.6rem] font-medium leading-relaxed text-[#4A5568] whitespace-pre-wrap font-sans">
            {result.reasoning || "No analytical data available for this sector."}
          </pre>
        </div>
      </div>

      {/* AI Executive Summary Module */}
      <div className="glass-card p-5 border-l-4 border-l-gov-accent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isGeneratingSummary ? 'bg-gov-accent animate-ping' : aiSummary ? 'bg-gov-green' : 'bg-accent-red'}`} />
            <h4 className="text-[0.6rem] font-semibold text-gov-navy uppercase tracking-[0.25em]">AI Executive Summary</h4>
          </div>
          <span className="text-[0.5rem] font-semibold text-text-dim uppercase tracking-widest bg-[#F4F6F8] border border-[#D1D9E0] px-2 py-0.5 rounded">
            Gemini-2.5-Flash
          </span>
        </div>
        {isGeneratingSummary ? (
          <div className="flex flex-col gap-2 opacity-50">
             <div className="h-1.5 w-full bg-[#D1D9E0] rounded animate-pulse" />
             <div className="h-1.5 w-[80%] bg-[#D1D9E0] rounded animate-pulse" />
             <div className="h-1.5 w-[90%] bg-[#D1D9E0] rounded animate-pulse" />
          </div>
        ) : aiSummary ? (
          <p className="text-[0.65rem] font-medium leading-relaxed text-[#4A5568] italic pl-3 border-l-2 border-gov-accent/35">
            "{aiSummary}"
          </p>
        ) : (
          <p className="text-[0.55rem] font-semibold text-accent-red uppercase tracking-widest">{geminiError || "Awaiting Generative AI Processing..."}</p>
        )}
      </div>

      {/* Protocol Recommendation */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
           <ShieldAlert size={13} className={riskScore > 35 ? 'text-accent-amber' : 'text-gov-accent'} />
           <h4 className="text-[0.6rem] font-semibold text-gov-navy uppercase tracking-[0.25em]">Protocol Advisory</h4>
        </div>
        <div className="p-3 bg-[#F4F6F8] rounded border border-[#D1D9E0] mb-4">
           <p className="text-[0.65rem] font-medium text-[#4A5568] leading-relaxed">
              {result.risk_summary.includes('Decision') ? result.risk_summary.split('Decision   :')[1].trim() : 'Proceed with standard clearance.'}
           </p>
        </div>
        {riskScore > 35 && (
          <button className="btn-protocol btn-protocol-danger w-full py-3 text-[0.7rem] font-semibold uppercase tracking-widest">
            Initiate Level 2 Inspection
          </button>
        )}
      </div>
    </div>
  );
}
