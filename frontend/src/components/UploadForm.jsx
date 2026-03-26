import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function UploadForm({ onResult, analyzing, setAnalyzing }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
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
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

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
    } finally {
      setAnalyzing(false);
    }
  };

  return (
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
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
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
            </div>
          </div>
        )}
      </div>

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
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing via Neural Network...
              </>
            ) : (
              'Initialize Analysis'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
