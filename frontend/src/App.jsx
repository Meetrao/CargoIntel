<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { ShieldCheck, Activity, PackageSearch } from 'lucide-react';
import UploadForm from './components/UploadForm';
import ResultsDashboard from './components/ResultsDashboard';
import './index.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[radial-gradient(circle_at_15%_50%,rgba(30,58,138,0.15)_0%,transparent_50%),radial-gradient(circle_at_85%_30%,rgba(15,23,42,1)_0%,var(--color-bg-dark,rgb(10,15,24))_100%)]">
      {/* Sidebar Navigation */}
      <nav className="glass-panel rounded-none border-t-0 border-b-0 border-l-0 w-full md:w-[280px] p-8 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-accent p-2.5 rounded-xl shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
            <ShieldCheck size={28} color="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">CBP Security</h1>
            <span className="text-xs text-secondary">Border Protection System</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button className="glass-button justify-start bg-blue-500/10 text-primary">
            <Activity size={20} />
            Live Inspection
          </button>
          <button className="glass-button justify-start border-transparent text-secondary hover:text-primary">
            <PackageSearch size={20} />
            Manifest Database
          </button>
          <button className="glass-button justify-start border-transparent text-secondary hover:text-primary">
            <ShieldCheck size={20} />
            Interception Logs
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
        <header className="mb-10">
          <h2 className="text-3xl font-light mb-2">
            <span className="font-semibold">CBP</span> AI Inspection Gateway
          </h2>
          <p className="text-secondary text-lg">
            Upload border crossing X-Ray imagery to detect contraband and manifest mismatches.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Upload Column */}
          <div className="flex flex-col gap-6">
            <UploadForm 
              onResult={setAnalysisResult} 
              analyzing={analyzing} 
              setAnalyzing={setAnalyzing} 
            />
          </div>

          {/* Results Column */}
          <div className="w-full">
            <ResultsDashboard result={analysisResult} analyzing={analyzing} />
          </div>
        </div>
      </main>
>>>>>>> 74b96d6be8d8a044812a8e3678fac28b7e229c94
    </div>
  );
}

export default App;
