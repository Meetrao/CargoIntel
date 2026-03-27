import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import ResultsDashboard from './components/ResultsDashboard';
import AlertsPage from './components/AlertsPage';
import HistoryPage from './components/HistoryPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import ComparisonPage from './components/ComparisonPage';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/health');
        if (res.data.status === 'ok') setBackendReady(true);
      } catch (e) {
        console.error('Backend unreachable:', e);
        setBackendReady(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full animate-fade-in">
            {/* Main Scanner Section */}
            <div className="xl:col-span-8 flex flex-col gap-8">
              <UploadForm 
                onResult={setAnalysisResult} 
                analyzing={analyzing} 
                setAnalyzing={setAnalyzing} 
              />
            </div>

            {/* Analysis & Risk Section */}
            <div className="xl:col-span-4 h-full">
              <ResultsDashboard result={analysisResult} analyzing={analyzing} />
            </div>
          </div>
        );
      case 'comparison':
        return <ComparisonPage />;
      case 'history':
        return <HistoryPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-obsidian text-text-bright overflow-hidden font-sans">
      {/* Sidebar - Persistent */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 scanner-overlay pointer-events-none opacity-50" />
        
        {/* Header - Persistent */}
        <Header activeTab={activeTab} />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-10 overflow-y-auto custom-scrollbar relative z-10">
          {renderContent()}
        </main>

        {/* System Footer Status */}
        <footer className="h-10 bg-black/40 border-t border-white/5 px-10 flex items-center justify-between shrink-0 text-[0.6rem] font-bold uppercase tracking-widest text-text-dim">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${backendReady ? 'bg-accent-cyan' : 'bg-accent-red animate-pulse'}`} />
              <span>System: {backendReady ? 'Optimal' : 'Degraded'}</span>
            </div>
            <span>LAT: 22.3193° N, LON: 114.1694° E</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-secondary border-r border-white/10 pr-6 uppercase">Secured Connection [AES-256]</span>
            <span className="text-white">© 2025 CargoIntel Systems</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
