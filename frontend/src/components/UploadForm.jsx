import React, { useState, useRef } from 'react';
import { Upload, Crosshair, Loader2, Search, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function UploadForm({ onResult, analyzing, setAnalyzing }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [conf, setConf] = useState(0.25);
  const [iou, setIou] = useState(0.45);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      onResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conf', conf);
    formData.append('iou', iou);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult(response.data);
    } catch (err) {
      console.error('Scan Error:', err);
      setError('Neural Link Failure: Ensure YOLO Cluster is operational.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden relative group">
      {/* Viewport Header */}
      <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
             <span className="text-[0.55rem] font-black text-text-dim uppercase tracking-widest">Confidence Threshold</span>
             <input 
               type="range" min="0.01" max="1" step="0.01" value={conf} 
               onChange={(e) => setConf(parseFloat(e.target.value))}
               className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
             />
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[0.55rem] font-black text-text-dim uppercase tracking-widest">IOU Threshold</span>
             <input 
               type="range" min="0.01" max="1" step="0.01" value={iou} 
               onChange={(e) => setIou(parseFloat(e.target.value))}
               className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
             />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[0.6rem] font-black text-accent-cyan uppercase tracking-widest tabular-nums">
            C:{conf.toFixed(2)} I:{iou.toFixed(2)}
          </span>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button className="text-text-dim hover:text-white transition-colors">
            <Search size={16} />
          </button>
          <button className="text-text-dim hover:text-white transition-colors">
            <Crosshair size={16} />
          </button>
        </div>
      </div>

      {/* Main Scanner Window */}
      <div 
        className="flex-1 relative flex flex-col items-center justify-center p-8 cursor-pointer"
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {preview ? (
          <div className="w-full h-full relative group/scan overflow-hidden rounded-lg">
            <img 
              src={preview} 
              alt="Scan Preview" 
              className="w-full h-full object-contain opacity-80" 
            />
            {/* Scan Line Animation */}
            {analyzing && (
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <div className="w-full h-0.5 bg-accent-cyan shadow-[0_0_15px_#00f5ff] animate-scan" />
              </div>
            )}
            {/* Grid Overlay */}
            <div className="absolute inset-0 scanner-overlay z-10 pointer-events-none opacity-40" />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/scan:opacity-100 transition-opacity flex items-center justify-center z-30">
               <button 
                 onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                 className="bg-accent-cyan text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl"
               >
                 Replace Source
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="w-20 h-20 border-2 border-dashed border-accent-cyan/30 rounded-full flex items-center justify-center text-accent-cyan">
              <Upload size={32} />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-2">Awaiting Ingestion</p>
              <p className="text-text-dim text-[0.6rem] font-bold uppercase tracking-widest leading-loose">Initialize Tactical Cargo Scan Protocol</p>
            </div>
          </div>
        )}
      </div>

      {/* Viewport Footer */}
      <div className="p-8 bg-black/20 border-t border-white/5 z-10">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight mb-1 italic">X-ray Analysis View</h3>
          <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-[0.2em]">Active Scan Process: Layer 04_Sector_B</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-[0.65rem] font-bold flex items-center gap-3">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {file && (
          <button 
            className={`btn-protocol w-full h-14 ${analyzing ? 'bg-white/5 text-text-dim opacity-50' : 'btn-protocol-primary'}`}
            onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing Neural Link...
              </>
            ) : (
              'Initiate Tactical Scan'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
