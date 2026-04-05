import React, { useState, useRef } from 'react';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function UploadForm({ onResult, analyzing, setAnalyzing }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [conf, setConf] = useState(0.25);
  const [iou, setIou] = useState(0.45);
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

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
      const token = currentUser ? await currentUser.getIdToken() : '';
      const response = await axios.post('http://localhost:8000/api/analyze', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
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
    <div className="glass-card flex flex-col h-full overflow-hidden">


      {/* Main Scanner Window */}
      <div 
        className="relative flex flex-col items-center justify-center p-8 cursor-pointer bg-[#F9FAFB] aspect-video min-h-[220px] max-h-[340px] overflow-hidden"
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
          <div className="absolute inset-0 group/scan overflow-hidden rounded">
            <img 
              src={preview} 
              alt="Scan Preview" 
              className="w-full h-full object-contain" 
            />
            {/* Scan Line Animation */}
            {analyzing && (
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <div className="w-full h-0.5 bg-gov-accent/50 animate-scan" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gov-navy/25 opacity-0 group-hover/scan:opacity-100 transition-opacity flex items-center justify-center z-30">
               <button 
                 onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                 className="bg-white text-gov-navy px-5 py-2 rounded font-semibold text-xs uppercase tracking-widest shadow-gov-md border border-[#D1D9E0] hover:bg-[#F4F6F8] transition-colors"
               >
                 Replace Source
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="w-20 h-20 border-2 border-dashed border-[#D1D9E0] rounded-full flex items-center justify-center text-text-dim hover:border-gov-accent hover:text-gov-accent transition-colors">
              <Upload size={30} />
            </div>
            <div className="text-center">
              <p className="text-gov-navy font-semibold text-sm uppercase tracking-[0.18em] mb-2">Awaiting Ingestion</p>
              <p className="text-text-dim text-[0.6rem] font-medium uppercase tracking-widest leading-loose">Initialize Tactical Cargo Scan Protocol</p>
            </div>
          </div>
        )}
      </div>

      {/* Viewport Footer */}
      <div className="p-6 bg-white border-t border-[#D1D9E0]">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gov-navy tracking-tight mb-1">X-ray Analysis View</h3>
          <p className="text-[0.6rem] font-medium text-text-dim uppercase tracking-[0.18em]">Active Scan Process: Layer 04_Sector_B</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded text-accent-red text-[0.65rem] font-medium flex items-center gap-3">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {file && (
          <button 
            className={`btn-protocol w-full h-12 ${analyzing ? 'bg-[#F4F6F8] text-text-dim border border-[#D1D9E0] opacity-60 cursor-not-allowed' : 'btn-protocol-primary'}`}
            onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
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
