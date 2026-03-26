import React, { useState } from 'react';
import { ShieldCheck, Activity, PackageSearch } from 'lucide-react';
import UploadForm from './components/UploadForm';
import ResultsDashboard from './components/ResultsDashboard';
import './index.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar glass-panel" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderRight: '1px solid var(--border-color)', borderRadius: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ background: 'var(--accent)', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
            <ShieldCheck size={28} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.5px' }}>CBP Security</h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Border Protection System</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="glass-button" style={{ justifyContent: 'flex-start', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--text-primary)' }}>
            <Activity size={20} />
            Live Inspection
          </button>
          <button className="glass-button" style={{ justifyContent: 'flex-start', border: 'transparent', color: 'var(--text-secondary)' }}>
            <PackageSearch size={20} />
            Manifest Database
          </button>
          <button className="glass-button" style={{ justifyContent: 'flex-start', border: 'transparent', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={20} />
            Interception Logs
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <header style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '8px' }}>
            <span style={{ fontWeight: '600' }}>CBP</span> AI Inspection Gateway
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Upload border crossing X-Ray imagery to detect contraband and manifest mismatches.
          </p>
        </header>

        <div className="dashboard-grid">
          {/* Upload Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <UploadForm 
              onResult={setAnalysisResult} 
              analyzing={analyzing} 
              setAnalyzing={setAnalyzing} 
            />
          </div>

          {/* Results Column */}
          <div>
            <ResultsDashboard result={analysisResult} analyzing={analyzing} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
