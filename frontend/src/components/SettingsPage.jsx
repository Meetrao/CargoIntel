import React from 'react';
import { 
  Settings2, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Zap, 
  Terminal, 
  Activity,
  Layers,
  FlaskConical,
  Gauge,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 h-full animate-fade-in pr-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter mb-2 italic">Configuration Console</h2>
          <p className="text-[0.65rem] font-bold text-text-dim uppercase tracking-[0.2em]">System parameter adjustment and hardware diagnostic interface.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         {/* System Configuration Column */}
         <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="glass-card p-10">
               <div className="flex items-center gap-3 mb-10">
                  <Settings2 size={24} className="text-accent-cyan" />
                  <h4 className="text-[0.7rem] font-black text-white uppercase tracking-[0.3em]">System Parameters</h4>
               </div>

               <div className="flex flex-col gap-12">
                  <div className="flex items-center justify-between">
                     <div>
                        <h5 className="text-sm font-bold text-white mb-2 italic tracking-tight">Automatic Flagging</h5>
                        <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest">Automatically isolate cargo matching high-risk heuristics.</p>
                     </div>
                     <div className="w-12 h-6 bg-accent-cyan rounded-full p-1 relative cursor-pointer">
                        <div className="w-4 h-4 bg-black rounded-full absolute right-1" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <div className="flex justify-between items-end">
                        <div>
                           <h5 className="text-sm font-bold text-white mb-2 italic tracking-tight">Server Sync Interval</h5>
                           <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest">Frequency of global telemetry baseline updates.</p>
                        </div>
                        <span className="text-[0.6rem] font-black text-accent-cyan uppercase tracking-widest">15 SEC</span>
                     </div>
                     <div className="w-full bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-[0.7rem] font-black text-white uppercase tracking-widest">15 Seconds</span>
                        <Settings2 size={14} className="text-text-dim" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <div className="flex justify-between items-end">
                        <div>
                           <h5 className="text-sm font-bold text-white mb-2 italic tracking-tight">Log Retention Period</h5>
                           <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest">Archive longevity for sentinel-level audit trails.</p>
                        </div>
                        <span className="text-[0.6rem] font-black text-accent-cyan uppercase tracking-widest">90 DAYS</span>
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        {['30 Days', '90 Days', '1 Year'].map((p) => (
                           <button 
                             key={p} 
                             className={`py-3 rounded text-[0.65rem] font-black uppercase tracking-widest transition-all ${p === '90 Days' ? 'bg-accent-cyan/10 border border-accent-cyan/40 text-accent-cyan' : 'bg-white/5 border border-white/10 text-text-dim hover:text-white'}`}
                           >
                              {p}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="glass-card p-10 bg-accent-amber/[0.02]">
               <div className="flex items-center gap-3 mb-10">
                  <Cpu size={24} className="text-accent-amber" />
                  <h4 className="text-[0.7rem] font-black text-white uppercase tracking-[0.3em]">AI Thresholds</h4>
               </div>

               <div className="flex flex-col gap-12">
                  {[
                    { label: 'Suspicious Item Detection', description: 'Sensitivity for flagging non-standard densities.', value: '74%' },
                    { label: 'Prohibited Material Detection', description: 'Critical threshold for organic/inorganic separation.', value: '92%' }
                  ].map((p, i) => (
                    <div key={i} className="flex flex-col gap-6">
                       <div className="flex justify-between items-center text-[0.65rem] font-bold uppercase tracking-widest">
                          <span className="text-white">{p.label}</span>
                          <span className="text-accent-amber">{p.value}</span>
                       </div>
                       <div className="relative h-1.5 bg-white/10 rounded-full">
                          <div className="h-full bg-accent-amber" style={{ width: p.value }} />
                          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-sm shadow-[0_0_10px_#ff9f0a]" style={{ left: p.value }} />
                       </div>
                       <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest">{p.description}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Hardware Diagnostics Column */}
         <div className="xl:col-span-4 flex flex-col gap-8">
            <div className="glass-card p-8">
               <h4 className="text-[0.65rem] font-black text-white uppercase tracking-[0.3em] mb-10">Hardware Status</h4>
               <div className="flex flex-col gap-8">
                  {[
                    { label: 'X-RAY ARRAY ALPHA', status: 'NOMINAL', value: 98, color: 'accent-cyan' },
                    { label: 'MASS SPECTROMETER', status: 'CALIBRATION REQ.', value: 62, color: 'accent-amber' }
                  ].map((h, i) => (
                    <div key={i} className="flex flex-col gap-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[0.55rem] font-black text-text-dim uppercase tracking-[0.2em]">{h.label}</span>
                          <span className={`text-[0.55rem] font-black uppercase px-2 py-0.5 rounded-sm bg-${h.color}/10 text-${h.color} border border-${h.color}/20`}>{h.status}</span>
                       </div>
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full bg-${h.color}`} style={{ width: `${h.value}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-10 h-[1px] bg-white/5 mb-8" />
               <div className="flex flex-col gap-2 mb-8">
                  <div className="flex justify-between text-[0.55rem] font-bold uppercase tracking-widest opacity-60">
                     <span>Last Calibration:</span>
                     <span className="text-white">2024-05-12 08:00</span>
                  </div>
                  <div className="flex justify-between text-[0.55rem] font-bold uppercase tracking-widest opacity-60">
                     <span>Firmware Ver:</span>
                     <span className="text-white">v4.8.2-SENTINEL</span>
                  </div>
               </div>
               <button className="w-full py-3 bg-white/5 border border-white/10 rounded text-[0.65rem] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all">
                  Run Diagnostics
               </button>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 bg-accent-cyan/[0.02] border-accent-cyan/20">
               <div className="w-12 h-12 rounded bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                  <Lock size={20} />
               </div>
               <div>
                  <p className="text-[0.6rem] font-bold text-text-dim uppercase tracking-widest mb-1">Session Operator</p>
                  <p className="text-xs font-black text-white tracking-widest uppercase italic">Senior Analyst Meet Rao</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
