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
    <div className="flex flex-col gap-6 h-full animate-fade-in pr-2 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gov-navy tracking-tight mb-1">Multi-Scan Comparison</h2>
          <p className="text-[0.65rem] font-medium text-text-dim uppercase tracking-[0.18em]">Cross-referencing manifest logs with target cargo for tampering detection.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={clearFiles}
            className="px-5 py-2.5 bg-[#F4F6F8] border border-[#D1D9E0] rounded font-semibold uppercase tracking-widest text-[0.65rem] text-gov-navy hover:bg-[#EEF1F5] transition-all flex items-center gap-2"
          >
             <Trash2 size={14} /> Clear Buffers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start mb-10">
        {/* Upload & Controls */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source A */}
            <div className={`glass-card p-5 border-t-2 ${fileA ? 'border-t-gov-accent' : 'border-t-[#D1D9E0]'}`}>
               <span className="text-[0.6rem] font-semibold text-gov-accent uppercase tracking-[0.25em] mb-4 block">Buffer A: Reference Scan</span>
               <div 
                 className="aspect-video bg-[#F4F6F8] rounded border border-dashed border-[#D1D9E0] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-gov-accent/50 transition-colors"
                 onClick={() => document.getElementById('fileA').click()}
               >
                 <input id="fileA" type="file" className="hidden" onChange={(e) => handleFileChange(e, setFileA, setPreviewA)} />
                 {previewA ? (
                   <img src={previewA} className="w-full h-full object-contain" alt="Ref" />
                 ) : (
                   <div className="flex flex-col items-center gap-2 text-text-dim group-hover:text-gov-accent transition-colors">
                     <Upload size={24} />
                     <span className="text-[0.6rem] font-medium uppercase tracking-widest">Upload Reference</span>
                   </div>
                 )}
               </div>
            </div>

            {/* Source B */}
            <div className={`glass-card p-5 border-t-2 ${fileB ? 'border-t-accent-amber' : 'border-t-[#D1D9E0]'}`}>
               <span className="text-[0.6rem] font-semibold text-accent-amber uppercase tracking-[0.25em] mb-4 block">Buffer B: Target Scan</span>
               <div 
                 className="aspect-video bg-[#F4F6F8] rounded border border-dashed border-[#D1D9E0] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-accent-amber/50 transition-colors"
                 onClick={() => document.getElementById('fileB').click()}
               >
                 <input id="fileB" type="file" className="hidden" onChange={(e) => handleFileChange(e, setFileB, setPreviewB)} />
                 {previewB ? (
                   <img src={previewB} className="w-full h-full object-contain" alt="Target" />
                 ) : (
                   <div className="flex flex-col items-center gap-2 text-text-dim group-hover:text-accent-amber transition-colors">
                     <Upload size={24} />
                     <span className="text-[0.6rem] font-medium uppercase tracking-widest">Upload Target</span>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-accent-red text-[0.65rem] font-medium flex items-center gap-3">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          {/* Core Action */}
          <button 
            disabled={!fileA || !fileB || analyzing}
            onClick={handleCompare}
            className={`btn-protocol w-full h-16 ${(!fileA || !fileB || analyzing) ? 'opacity-40 bg-[#EEF1F5] border border-[#D1D9E0] text-text-dim cursor-not-allowed' : 'btn-protocol-primary'}`}
          >
            {analyzing ? (
              <Loader2 className="animate-spin text-gov-accent" size={20} />
            ) : (
              <>
                <ArrowRightLeft size={18} />
                Execute Multi-Scan Synchronization
              </>
            )}
          </button>

          {/* Results Comparison Grid */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
               <div className="glass-card overflow-hidden cursor-pointer group" onClick={() => openModal(`data:image/jpeg;base64,${result.scan_a_image}`)}>
                  <div className="p-3 bg-[#F4F6F8] border-b border-[#D1D9E0] flex justify-between items-center">
                    <span className="text-[0.55rem] font-semibold text-text-dim uppercase tracking-widest">Annotated Ref</span>
                    <Maximize2 size={12} className="text-text-dim group-hover:text-gov-accent transition-all" />
                  </div>
                  <img src={`data:image/jpeg;base64,${result.scan_a_image}`} className="w-full aspect-video object-contain" alt="Ann A" />
               </div>
               <div className="glass-card overflow-hidden cursor-pointer group" onClick={() => openModal(`data:image/jpeg;base64,${result.scan_b_image}`)}>
                  <div className="p-3 bg-[#F4F6F8] border-b border-[#D1D9E0] flex justify-between items-center">
                    <span className="text-[0.55rem] font-semibold text-text-dim uppercase tracking-widest">Annotated Target</span>
                    <Maximize2 size={12} className="text-text-dim group-hover:text-accent-amber transition-all" />
                  </div>
                  <img src={`data:image/jpeg;base64,${result.scan_b_image}`} className="w-full aspect-video object-contain" alt="Ann B" />
               </div>
            </div>
          )}
        </div>

        {/* Intelligence Sidecar */}
        <div className="xl:col-span-4 flex flex-col gap-6">
           <div className={`glass-card border-t-2 ${result ? 'border-t-accent-red' : 'border-t-[#D1D9E0]'} transition-all`}>
              <div className="p-5 border-b border-[#D1D9E0] flex items-center gap-3">
                <ShieldCheck size={16} className="text-gov-accent" />
                <h4 className="text-[0.65rem] font-semibold text-gov-navy uppercase tracking-[0.25em]">Difference Intelligence</h4>
              </div>
              
              <div className="p-5">
                <div className="p-4 bg-[#F4F6F8] rounded border border-[#D1D9E0]">
                   <h5 className="text-[0.55rem] font-semibold text-text-dim uppercase tracking-[0.2em] mb-3">Neural Comparison Report</h5>
                   <pre className="text-[0.65rem] font-medium leading-relaxed text-[#3D4F5F] whitespace-pre-wrap font-sans min-h-[100px]">
                      {analyzing ? "Synchronizing scans..." : result?.report || "Awaiting scan ingestion protocol."}
                   </pre>
                </div>
              </div>
           </div>

           <div className="glass-card p-5 flex items-center gap-5">
              <div className="w-10 h-10 bg-gov-navy/8 rounded border border-[#D1D9E0] flex items-center justify-center text-gov-accent">
                 <History size={18} />
              </div>
              <div>
                 <p className="text-[0.55rem] font-semibold text-text-dim uppercase tracking-widest mb-0.5">Protocol Buffer</p>
                 <p className="text-xs font-semibold text-gov-navy uppercase tracking-widest">Dual-Stream Sync Active</p>
              </div>
           </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-20 bg-black/50 backdrop-blur-sm animate-fade-in">
           <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gov-navy border border-[#D1D9E0] hover:bg-[#F4F6F8] transition-all shadow-gov-md">
              <X size={20} />
           </button>
           <img src={modalImg} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Zoom" />
        </div>
      )}
    </div>
  );
}
