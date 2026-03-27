import React from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Package, 
  Zap, 
  FileText,
  Boxes,
  Database,
  Layers,
  FlaskConical,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function HistoryPage() {
  const historyData = [
    { id: 'SCAN-992-01', timestamp: 'Oct 24, 2023 14:32:01', node: 'XRAY_NODE_A7', type: 'Precision Optics', value: '$142,500.00', risk: 88, status: 'FLAGGED', color: 'accent-red', icon: Zap },
    { id: 'SCAN-881-22', timestamp: 'Oct 24, 2023 14:15:44', node: 'XRAY_NODE_B2', type: 'Textile Goods', value: '$12,400.00', risk: 12, status: 'CLEARED', color: 'accent-cyan', icon: FileText },
    { id: 'SCAN-742-09', timestamp: 'Oct 24, 2023 13:58:12', node: 'XRAY_NODE_A7', type: 'Bio-Chemicals', value: '$382,900.00', risk: 45, status: 'MANUAL COMPLETE', color: 'accent-amber', icon: FlaskConical },
    { id: 'SCAN-550-11', timestamp: 'Oct 24, 2023 13:40:05', node: 'XRAY_NODE_C1', type: 'Frozen Seafood', value: '$8,120.00', risk: 5, status: 'CLEARED', color: 'accent-cyan', icon: Boxes },
    { id: 'SCAN-419-02', timestamp: 'Oct 24, 2023 13:22:59', node: 'XRAY_NODE_A7', type: 'Lithium Units', value: '$55,000.00', risk: 94, status: 'FLAGGED', color: 'accent-red', icon: Zap }
  ];

  return (
    <div className="flex flex-col gap-8 h-full animate-fade-in pr-2">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 italic">Scan History</h2>
          <p className="text-[0.65rem] font-bold text-text-dim uppercase tracking-[0.2em]">Archive of all sentinel-level cargo inspections.</p>
        </div>
        <button className="px-6 py-3 bg-accent-cyan text-black rounded font-black uppercase tracking-widest text-[0.7rem] hover:bg-white transition-all shadow-xl flex items-center gap-2">
           <Zap size={14} /> Quick View
        </button>
      </div>

      {/* Filter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Cleared', value: '1.2k', trend: '+14% from last period', icon: CheckCircle },
           { label: 'High Risk Flags', value: '42', trend: 'Requires priority review', icon: AlertTriangle, status: 'danger' },
           { label: 'Total Valuations', value: '$2.4M', trend: 'Aggregate manifest value tracked', icon: Database }
         ].map((stat, i) => {
           const Icon = stat.icon || Layers;
           return (
             <div key={i} className="glass-card p-6 flex items-center justify-between group">
                <div>
                   <span className="text-[0.55rem] font-black text-accent-cyan uppercase tracking-[0.3em] mb-4 block">{stat.label}</span>
                   <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                   <p className={`text-[0.55rem] font-bold ${stat.status === 'danger' ? 'text-accent-red' : 'text-text-dim'} uppercase tracking-widest`}>{stat.trend}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl text-white/20 group-hover:text-accent-cyan transition-colors">
                   <Icon size={32} />
                </div>
             </div>
           );
         })}
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 flex gap-4">
         <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
            <input 
              type="text" 
              placeholder="Search by Scan ID, Node, or Cargo Type..." 
              className="w-full bg-white/5 border border-white/5 rounded-lg pl-12 pr-4 py-3 text-[0.75rem] font-medium text-white placeholder:text-text-dim focus:bg-white/10 focus:border-white/20 transition-all"
            />
         </div>
         <button className="px-6 py-2 bg-white/5 border border-white/10 rounded font-black uppercase tracking-widest text-[0.65rem] text-text-dim hover:text-white transition-colors">
            Apply Filters
         </button>
      </div>

      {/* History Table */}
      <div className="glass-card flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="overflow-x-auto h-full custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-sidebar border-b border-white/5 z-20">
              <tr>
                <th className="p-6 text-[0.55rem] font-black text-text-dim uppercase tracking-[0.3em]">Scan ID</th>
                <th className="p-6 text-[0.55rem] font-black text-text-dim uppercase tracking-[0.3em]">Timestamp</th>
                <th className="p-6 text-[0.55rem] font-black text-text-dim uppercase tracking-[0.3em]">Cargo Type</th>
                <th className="p-6 text-[0.55rem] font-black text-text-dim uppercase tracking-[0.3em]">Declared Value</th>
                <th className="p-6 text-[0.55rem] font-black text-text-dim uppercase tracking-[0.3em]">Risk Score</th>
                <th className="p-6 text-[0.55rem] font-black text-text-dim uppercase tracking-[0.3em]">Status</th>
                <th className="p-6 text-[0.55rem] font-black text-text-dim uppercase tracking-[0.3em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyData.map((row) => {
                const Icon = row.icon;
                return (
                  <tr key={row.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white uppercase tracking-widest">{row.id}</span>
                        <span className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest mt-1 opacity-60 italic">{row.node}</span>
                      </div>
                    </td>
                    <td className="p-6 text-[0.65rem] font-bold text-text-dim uppercase tracking-widest leading-loose">
                      {row.timestamp}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 bg-${row.color}/10 rounded-lg text-${row.color}`}>
                            <Icon size={14} />
                         </div>
                         <span className="text-[0.7rem] font-bold text-white uppercase tracking-widest">{row.type}</span>
                      </div>
                    </td>
                    <td className="p-6 text-[0.7rem] font-black text-white/80 tabular-nums">
                      {row.value}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-${row.color} shadow-[0_0_8px_${row.color === 'accent-cyan' ? '#00f5ff' : row.color === 'accent-amber' ? '#ff9f0a' : '#ff3b3b'}]`} 
                            style={{ width: `${row.risk}%` }}
                          />
                        </div>
                        <span className={`text-[0.7rem] font-black text-${row.color}`}>{row.risk}%</span>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className={`text-[0.55rem] font-black uppercase px-2 py-1 rounded-sm border border-${row.color}/20 bg-${row.color}/10 text-${row.color} tracking-widest`}>
                          {row.status}
                       </span>
                    </td>
                    <td className="p-6">
                       <button className="p-2 text-text-dim hover:text-white hover:bg-white/10 rounded transition-all">
                          <Eye size={16} />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between bg-sidebar/50">
           <span className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest">Showing 1-10 of 1,482 results</span>
           <div className="flex items-center gap-1">
              <button className="p-2 bg-white/5 rounded hover:bg-white/10 text-white transition-all"><ChevronLeft size={16} /></button>
              {[1, 2, 3, '...', 149].map((p, i) => (
                <button key={i} className={`h-8 w-8 text-[0.65rem] font-bold rounded flex items-center justify-center transition-all ${p === 1 ? 'bg-accent-cyan text-black shadow-lg shadow-accent-cyan/20' : 'text-text-dim hover:text-white hover:bg-white/5'}`}>
                   {p}
                </button>
              ))}
              <button className="p-2 bg-white/5 rounded hover:bg-white/10 text-white transition-all"><ChevronRight size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
