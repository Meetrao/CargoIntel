import React, { useState, useRef } from 'react';
<<<<<<< HEAD
import { Upload, Crosshair, Loader2, Search, AlertTriangle } from 'lucide-react';
=======
import { UploadCloud, FileImage, Loader2 } from 'lucide-react';
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
import axios from 'axios';

export default function UploadForm({ onResult, analyzing, setAnalyzing }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [conf, setConf] = useState(0.25);
  const [iou, setIou] = useState(0.45);
=======
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
<<<<<<< HEAD
      onResult(null);
=======
      onResult(null); // Reset previous results
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setPreview(URL.createObjectURL(droppedFile));
        setError(null);
        onResult(null);
      } else {
        setError('Please drop a valid image file.');
      }
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
<<<<<<< HEAD
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
=======

    setAnalyzing(true);
    setError(null);
    
    // Create FormData correctly for Axios sending multipart/form-data
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Connect to the Node Express API Gateway locally on 5000
      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onResult(response.data.data);
    } catch (err) {
      console.error('Upload Error:', err);
      setError('An error occurred during analysis. Make sure the backend services are running.');
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
    } finally {
      setAnalyzing(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="glass-panel animate-fade-in p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Automated X-Ray Ingestion</h3>
        <p className="text-secondary text-[0.95rem]">
          Scan and verify incoming cargo shipments against declared manifest records.
        </p>
      </div>

      <div 
        className="border-2 border-dashed border-slate-400/20 rounded-2xl py-14 px-8 text-center cursor-pointer transition-all duration-300 bg-slate-900/40 hover:border-accent hover:bg-blue-500/5 group"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
<<<<<<< HEAD
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
=======
        {!preview ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-full text-accent group-hover:bg-blue-500/20 transition-colors">
              <UploadCloud size={40} />
            </div>
            <div>
              <p className="font-medium text-lg mb-1">Click to upload or drag and drop</p>
              <p className="text-secondary text-sm">SVG, PNG, JPG or GIF (max. 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-[200px] rounded-lg object-contain shadow-md" 
            />
            <div className="flex items-center gap-2 text-secondary text-sm">
              <FileImage size={16} />
              {file.name}
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
            </div>
          </div>
        )}
      </div>

<<<<<<< HEAD
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
=======
      {error && (
        <div className="mt-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm shadow-sm">
          {error}
        </div>
      )}

      {file && (
        <div className="mt-6 flex justify-end">
          <button 
            className="glass-button primary w-full" 
            onClick={handleAnalyze} 
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
            disabled={analyzing}
          >
            {analyzing ? (
              <>
<<<<<<< HEAD
                <Loader2 size={16} className="animate-spin" />
                Processing Neural Link...
              </>
            ) : (
              'Initiate Tactical Scan'
            )}
          </button>
        )}
      </div>
=======
                <Loader2 size={20} className="animate-spin" />
                Processing via Neural Network...
              </>
            ) : (
              'Initialize Analysis'
            )}
          </button>
        </div>
      )}
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
    </div>
  );
}
