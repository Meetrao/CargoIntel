import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Download,
  Activity,
  Package,
  AlertTriangle,
  History,
  Target,
  Terminal,
  RefreshCw
} from 'lucide-react';

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/stats');
      setStats(res.data.stats);
    } catch (e) {
      console.error('Stats Fetch Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const parseStat = (label) => {
    if (!stats) return null;
    const regex = new RegExp(`${label}\\s*:\\s*([^\\n]+)`);
    const match = stats.match(regex);
    return match ? match[1].trim() : null;
  };

  const totalScans = parseStat('Total Scans Logged') || '0';
  const avgRisk = parseStat('Average Risk Score') || '0.0 / 100';
  const flagged = parseStat('Flagged \\(HIGH\\+CRIT\\)') || '0';

  const topCategories = [
    { name: 'Electronics', incidents: 312, concern: 'UNDECLARED BATTERY CELLS', trend: '+18%', color: 'accent-red' },
    { name: 'Textiles', incidents: 245, concern: 'COUNTERFEIT BRANDING', trend: '-4%', color: 'accent-amber' },
    { name: 'Pharmaceuticals', incidents: 189, concern: 'MISSING FDA STAMP', trend: '+32%', color: 'accent-red' },
    { name: 'Industrial Parts', incidents: 142, concern: 'STRUCTURAL INTEGRITY', trend: '0%', color: 'text-dim' }
  ];

  return (
    <div className="flex flex-col gap-8 h-full animate-fade-in pr-2 overflow-y-auto custom-scrollbar">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 italic">Reports & Analytics</h2>
          <p className="text-[0.65rem] font-bold text-text-dim uppercase tracking-[0.2em]">Operational intelligence and risk assessment overview for the current cycle.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchStats}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded font-black uppercase tracking-widest text-[0.7rem] hover:text-white transition-all flex items-center gap-2"
          >
             <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="px-6 py-3 bg-accent-cyan text-black rounded font-black uppercase tracking-widest text-[0.7rem] hover:bg-white transition-all shadow-xl flex items-center gap-2">
             <Download size={14} /> Export Data
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Session Scans', value: totalScans, trend: '+0.0%', icon: Activity, color: 'accent-cyan' },
           { label: 'Avg Risk Index', value: avgRisk.split('/')[0].trim(), trend: 'REFRESHED', icon: Target, color: 'accent-amber' },
           { label: 'Neural Flagged', value: flagged.split('(')[0].trim(), trend: '-4.3%', icon: AlertTriangle, color: 'accent-red' },
           { label: 'Neural Accuracy', value: '98.4%', trend: 'OPTIMAL', icon: TrendingUp, color: 'accent-cyan' }
         ].map((stat, i) => {
           const Icon = stat.icon;
           return (
             <div key={i} className="glass-card p-6 border-b-2" style={{ borderColor: `var(--${stat.color})` }}>
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[0.6rem] font-black text-text-dim uppercase tracking-[0.3em]">{stat.label}</span>
                   <Icon size={14} className={`text-${stat.color}`} />
                </div>
                <div className="flex items-end justify-between">
                   <p className="text-2xl font-black text-white">{stat.value}</p>
                   <span className={`text-[0.55rem] font-black uppercase tracking-widest text-${stat.color}`}>{stat.trend}</span>
                </div>
             </div>
           );
         })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-10">
         {/* Live Intelligence Log */}
         <div className="xl:col-span-8 flex flex-col gap-6">
            <div className="glass-card p-0 min-h-[500px] flex flex-col bg-black/40 border-accent-cyan/20">
               <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-3">
                  <Terminal size={14} className="text-accent-cyan" />
                  <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em]">Operational Intelligence Log</h4>
               </div>
               <div className="flex-1 p-8 font-mono text-[0.7rem] leading-relaxed text-accent-cyan/80 whitespace-pre overflow-y-auto custom-scrollbar bg-black/40">
                  {loading ? (
                    <div className="h-full flex items-center justify-center animate-pulse italic">Connecting to YOLO Cluster...</div>
                  ) : (
                    stats || "No telemetry data received from AI engine."
                  )}
               </div>
            </div>

            <div className="glass-card p-8">
               <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em] mb-10">Top Flagged Cargo Categories</h4>
               <div className="flex flex-col gap-2">
                  <div className="flex items-center px-4 py-3 bg-white/5 rounded-t-lg border-b border-white/5 uppercase text-[0.55rem] font-black tracking-widest text-text-dim">
                     <span className="w-1/4">Category</span>
                     <span className="w-1/4">Incidents</span>
                     <span className="w-1/3">Primary Concern</span>
                     <span className="w-1/6 text-right">Trend</span>
                  </div>
                  {topCategories.map((cat, i) => (
                    <div key={i} className="flex items-center px-4 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/5">
                       <span className="w-1/4 text-[0.7rem] font-bold text-white uppercase tracking-widest flex items-center gap-3">
                          <div className={`w-8 h-8 rounded bg-${cat.color}/10 flex items-center justify-center text-${cat.color}`}>
                             <Package size={14} />
                          </div>
                          {cat.name}
                       </span>
                       <span className="w-1/4 text-xs font-black text-white/80">{cat.incidents}</span>
                       <span className={`w-1/3 text-[0.6rem] font-black tracking-widest px-3 py-1 bg-${cat.color}/10 border border-${cat.color}/20 rounded text-${cat.color}`}>{cat.concern}</span>
                       <span className={`w-1/6 text-right text-[0.6rem] font-black text-${cat.color}`}>{cat.trend}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Distribution & Performance Section */}
         <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="glass-card p-8">
               <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em] mb-10">Neural Analysis Distribution</h4>
               <div className="flex flex-col gap-6">
                  {[
                    { label: 'Prohibited', value: parseStat('CRITICAL') || '0', color: 'accent-red' },
                    { label: 'High Risk', value: parseStat('HIGH') || '0', color: 'accent-amber' },
                    { label: 'Elevated', value: parseStat('MEDIUM') || '0', color: 'accent-cyan' },
                    { label: 'Cleared', value: parseStat('LOW') || '0', color: 'text-dim' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-3">
                       <div className="flex justify-between items-center text-[0.6rem] font-bold uppercase tracking-widest">
                          <span className="text-text-dim">{item.label}</span>
                          <span className="text-white">{item.value.split(' ')[0]} SCANS</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-${item.color}`} style={{ width: `${(parseInt(item.value) / (parseInt(totalScans) || 1) * 100)}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
               <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em] mb-10 w-full text-left">System Health</h4>
               <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                    <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={364} strokeDashoffset={0} strokeLinecap="round" className="text-accent-cyan shadow-[0_0_15px_#00f5ff]" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">100%</span>
                    <span className="text-[0.45rem] font-bold text-text-dim uppercase tracking-widest">Aptitude</span>
                  </div>
               </div>
               <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest leading-relaxed italic">Neural Cluster responsive. Latency: <span className="text-accent-cyan">0.042ms</span>.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
