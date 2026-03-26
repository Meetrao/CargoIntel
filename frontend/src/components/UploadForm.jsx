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
    <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>Automated X-Ray Ingestion</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Scan and verify incoming cargo shipments against declared manifest records.
        </p>
      </div>

      <div 
        className="upload-zone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        
        {!preview ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: 'var(--accent)' }}>
              <UploadCloud size={40} />
            </div>
            <div>
              <p style={{ fontWeight: '500', fontSize: '1.1rem', marginBottom: '4px' }}>Click to upload or drag and drop</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>SVG, PNG, JPG or GIF (max. 10MB)</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} 
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <FileImage size={16} />
              {file.name}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {file && (
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="glass-button primary" 
            onClick={handleAnalyze} 
            disabled={analyzing}
            style={{ width: '100%' }}
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
