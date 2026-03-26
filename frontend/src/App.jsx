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
    </div>
  );
}

export default App;
