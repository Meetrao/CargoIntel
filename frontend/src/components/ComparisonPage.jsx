import React, { useState } from 'react';
import axios from 'axios';
import { 
  Upload, 
  RefreshCw, 
  History, 
  FileText, 
  AlertTriangle, 
  ShieldCheck,
  ArrowRightLeft,
  Loader2,
  Trash2,
  Maximize2,
  X
} from 'lucide-react';

export default function ComparisonPage() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [previewA, setPreviewA] = useState(null);
  const [previewB, setPreviewB] = useState(null);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) return;
    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file_a', fileA);
    formData.append('file_b', fileB);
    formData.append('conf', 0.25);

    try {
      const response = await axios.post('http://localhost:8000/api/compare', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error('Comparison Error:', err);
      setError('Neural Link Failure: Multi-scan synchronization failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const clearFiles = () => {
    setFileA(null);
    setFileB(null);
    setPreviewA(null);
    setPreviewB(null);
    setResult(null);
  };

  const openModal = (img) => {
    if (!img) return;
    setModalImg(img);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 h-full animate-fade-in pr-2 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 italic">Multi-Scan Comparison</h2>
          <p className="text-[0.65rem] font-bold text-text-dim uppercase tracking-[0.2em]">Cross-referencing manifest logs with target cargo for tampering detection.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={clearFiles}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded font-black uppercase tracking-widest text-[0.7rem] hover:text-white transition-all flex items-center gap-2"
          >
             <Trash2 size={14} /> Clear Buffers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-10">
        {/* Upload & Controls */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source A */}
            <div className={`glass-card p-6 border-b-2 ${fileA ? 'border-accent-cyan' : 'border-white/5'}`}>
               <span className="text-[0.6rem] font-black text-accent-cyan uppercase tracking-[0.3em] mb-4 block">Buffer A: Reference Scan</span>
               <div 
                 className="aspect-video bg-black/40 rounded-lg border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                 onClick={() => document.getElementById('fileA').click()}
               >
                 <input id="fileA" type="file" className="hidden" onChange={(e) => handleFileChange(e, setFileA, setPreviewA)} />
                 {previewA ? (
                   <img src={previewA} className="w-full h-full object-contain" alt="Ref" />
                 ) : (
                   <Upload size={24} className="text-white/20 group-hover:text-accent-cyan transition-colors" />
                 )}
               </div>
            </div>

            {/* Source B */}
            <div className={`glass-card p-6 border-b-2 ${fileB ? 'border-accent-amber' : 'border-white/5'}`}>
               <span className="text-[0.6rem] font-black text-accent-amber uppercase tracking-[0.3em] mb-4 block">Buffer B: Target Scan</span>
               <div 
                 className="aspect-video bg-black/40 rounded-lg border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                 onClick={() => document.getElementById('fileB').click()}
               >
                 <input id="fileB" type="file" className="hidden" onChange={(e) => handleFileChange(e, setFileB, setPreviewB)} />
                 {previewB ? (
                   <img src={previewB} className="w-full h-full object-contain" alt="Target" />
                 ) : (
                   <Upload size={24} className="text-white/20 group-hover:text-accent-amber transition-colors" />
                 )}
               </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-[0.65rem] font-bold flex items-center gap-3">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          {/* Core Action */}
          <button 
            disabled={!fileA || !fileB || analyzing}
            onClick={handleCompare}
            className={`btn-protocol w-full h-20 ${(!fileA || !fileB || analyzing) ? 'opacity-30 bg-white/5' : 'btn-protocol-primary shadow-[0_0_30px_rgba(0,245,255,0.2)]'}`}
          >
            {analyzing ? (
              <Loader2 className="animate-spin text-accent-cyan" size={24} />
            ) : (
              <>
                <ArrowRightLeft size={20} />
                Execute Multi-Scan Synchronization
              </>
            )}
          </button>

          {/* Results Comparison Grid */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
               <div className="glass-card overflow-hidden cursor-pointer group" onClick={() => openModal(`data:image/jpeg;base64,${result.scan_a_image}`)}>
                  <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <span className="text-[0.55rem] font-black text-white/40 uppercase tracking-widest">Annotated Ref</span>
                    <Maximize2 size={12} className="text-white/20 group-hover:text-accent-cyan transition-all" />
                  </div>
                  <img src={`data:image/jpeg;base64,${result.scan_a_image}`} className="w-full aspect-video object-contain" alt="Ann A" />
               </div>
               <div className="glass-card overflow-hidden cursor-pointer group" onClick={() => openModal(`data:image/jpeg;base64,${result.scan_b_image}`)}>
                  <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <span className="text-[0.55rem] font-black text-white/40 uppercase tracking-widest">Annotated Target</span>
                    <Maximize2 size={12} className="text-white/20 group-hover:text-accent-amber transition-all" />
                  </div>
                  <img src={`data:image/jpeg;base64,${result.scan_b_image}`} className="w-full aspect-video object-contain" alt="Ann B" />
               </div>
            </div>
          )}
        </div>

        {/* Intelligence Sidecar */}
        <div className="xl:col-span-4 flex flex-col gap-6">
           <div className={`glass-card p-8 border-b-2 ${result ? 'border-accent-red' : 'border-white/5'} transition-all`}>
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck size={18} className="text-accent-cyan" />
                <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em]">Difference Intelligence</h4>
              </div>
              
              {result ? (
                <div 
                  className="aspect-square bg-black/40 rounded-lg border border-accent-red/30 overflow-hidden relative cursor-pointer group mb-6"
                  onClick={() => openModal(`data:image/jpeg;base64,${result.diff_map_image}`)}
                >
                   <img src={`data:image/jpeg;base64,${result.diff_map_image}`} className="w-full h-full object-contain" alt="Diff" />
                   <div className="absolute inset-0 bg-accent-red/10 group-hover:bg-transparent transition-all pointer-events-none" />
                   <div className="absolute top-4 right-4 p-2 bg-black/60 rounded border border-white/10">
                      <Maximize2 size={12} className="text-accent-red" />
                   </div>
                   <div className="absolute bottom-4 left-4 text-[0.45rem] font-black text-accent-red uppercase tracking-widest">Structural Anomalies Detected</div>
                </div>
              ) : (
                <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center opacity-20 border border-white/5 mb-6">
                   <ShieldCheck size={48} />
                </div>
              )}

              <div className="p-6 bg-white/5 rounded-lg">
                 <h5 className="text-[0.55rem] font-black text-text-dim uppercase tracking-[0.2em] mb-4">Neural Comparison Report</h5>
                 <pre className="text-[0.65rem] font-medium leading-relaxed text-white/80 whitespace-pre-wrap font-sans min-h-[100px]">
                    {analyzing ? "Synchronizing scans..." : result?.report || "Awaiting scan ingestion protocol."}
                 </pre>
              </div>
           </div>

           <div className="glass-card p-6 flex items-center gap-6">
              <div className="w-12 h-12 bg-accent-cyan/10 rounded flex items-center justify-center text-accent-cyan">
                 <History size={20} />
              </div>
              <div>
                 <p className="text-[0.55rem] font-bold text-text-dim uppercase tracking-widest">Protocol Buffer</p>
                 <p className="text-xs font-black text-white uppercase tracking-widest">Dual-Stream Sync Active</p>
              </div>
           </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-20 bg-black/90 backdrop-blur-2xl animate-fade-in">
           <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all">
              <X size={24} />
           </button>
           <img src={modalImg} className="max-w-full max-h-full object-contain rounded-xl" alt="Zoom" />
        </div>
      )}
    </div>
  );
}
