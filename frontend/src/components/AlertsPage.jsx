import React from 'react';
import { 
  AlertCircle, 
  ShieldAlert, 
  Terminal, 
  Settings2, 
  ExternalLink,
  CheckCircle,
  FileText,
  BarChart
} from 'lucide-react';

export default function AlertsPage() {
  const alerts = [
    {
      id: 'SH-992-CR',
      type: 'CRITICAL SECURITY BREACH',
      time: '04:12:08 UTC',
      location: 'Docking Bay 04',
      description: 'Unauthorized access detected. External sensor array reporting thermal signatures inconsistent with manifest data.',
      status: 'CRITICAL',
      color: 'accent-red'
    },
    {
      id: 'MD-104-WR',
      type: 'MIS-DECLARATION DETECTED',
      time: '04:06:45 UTC',
      location: 'Cargo Unit #8829-X',
      description: 'Density scan indicates high concentration of organic matter not listed in the standard electronics manifest.',
      status: 'WARNING',
      color: 'accent-amber'
    },
    {
      id: 'CAL-AUTO-01',
      type: 'CALIBRATION REQUIRED',
      time: '03:55:12 UTC',
      location: 'Scanner Lens Alpha-4',
      description: 'Deviation > 0.05mm. Automatic recalibration failed. Manual intervention recommended to maintain 99.9% accuracy.',
      status: 'SYSTEM',
      color: 'accent-cyan'
    }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full animate-fade-in">
      <div className="xl:col-span-8 flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 italic">Real-Time Alerts</h2>
            <p className="text-[0.65rem] font-bold text-text-dim uppercase tracking-[0.2em]">Live tactical monitoring of scanning protocols and security events.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded text-[0.6rem] font-bold text-text-dim hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
               <Settings2 size={12} /> Filter
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded text-[0.6rem] font-bold text-text-dim hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
               <ExternalLink size={12} /> Export
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`glass-card p-6 border-l-4 border-l-${alert.color}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 bg-${alert.color}/10 rounded-lg text-${alert.color}`}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-widest text-${alert.color}`}>{alert.type}</h3>
                    <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest mt-0.5">Alert ID: {alert.id}</p>
                  </div>
                </div>
                <span className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest">{alert.time}</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                {alert.description} {alert.location && <span className={`text-${alert.color} font-bold tracking-tight`}>{alert.location}</span>}
              </p>
              <div className="flex gap-3">
                <button className={`px-6 py-2 bg-${alert.color}/20 text-${alert.color} border border-${alert.color}/30 rounded font-black uppercase tracking-widest text-[0.65rem] hover:bg-${alert.color} hover:text-white transition-all`}>
                  Investigate
                </button>
                <button className="px-6 py-2 bg-white/5 text-text-dim border border-white/10 rounded font-black uppercase tracking-widest text-[0.65rem] hover:text-white transition-all">
                  Acknowledge
                </button>
                <button className="px-6 py-2 text-text-dim font-black uppercase tracking-widest text-[0.65rem] hover:text-white ml-auto transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-4 flex flex-col gap-8">
        {/* Alert Summary Module */}
        <div className="glass-card p-6">
           <div className="flex items-center gap-3 mb-8">
              <BarChart size={18} className="text-accent-cyan" />
              <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em]">Alert Summary</h4>
           </div>
           <div className="flex flex-col gap-8">
              {[
                { label: 'Critical', value: 12, trend: '+4.2%', color: 'accent-red' },
                { label: 'Warning', value: 28, trend: '-1.8%', color: 'accent-amber' },
                { label: 'System', value: '06', trend: 'STABLE', color: 'accent-cyan' }
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className={`w-1 h-10 bg-${stat.color} rounded-full`} />
                      <div>
                        <p className="text-[0.55rem] font-bold text-text-dim uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-black text-white">{stat.value}</p>
                      </div>
                   </div>
                   <span className={`text-[0.55rem] font-black uppercase px-2 py-1 rounded bg-${stat.color}/10 text-${stat.color}`}>{stat.trend}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Standard Protocol Module */}
        <div className="glass-card p-8 bg-accent-cyan/10 border-accent-cyan/30 text-center flex flex-col items-center">
            <CheckCircle size={32} className="text-accent-cyan mb-4" />
            <h4 className="text-base font-black text-white uppercase tracking-tight mb-2">Standard Protocol Active</h4>
            <p className="text-[0.7rem] text-accent-cyan/80 font-medium leading-relaxed mb-6">Level 2 scanning operational across all portals. Current throughput: 840 units/hr.</p>
            <button className="w-full py-3 bg-accent-cyan text-black rounded font-black uppercase tracking-widest text-[0.7rem] hover:bg-white transition-all shadow-xl">
               Manage Protocols
            </button>
        </div>

        {/* Operator Module */}
        <div className="glass-card p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
              <Terminal size={24} />
           </div>
           <div>
              <p className="text-sm font-black text-white tracking-widest uppercase">Senior Analyst 8829</p>
              <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest">Shift: 02:14:10 Remaining</p>
           </div>
        </div>
      </div>
    </div>
  );
}
