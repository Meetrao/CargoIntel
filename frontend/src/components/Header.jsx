import React from 'react';
import { Bell, Shield, User, Settings2 } from 'lucide-react';

export default function Header() {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  return (
    <header className="h-[80px] bg-obsidian border-b border-white/5 flex items-center justify-between px-10 shrink-0">
      <div className="flex items-center gap-10">
        <div className="flex flex-col gap-1">
          <span className="text-[0.65rem] font-bold text-text-dim uppercase tracking-[0.2em]">Scanner Online</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-widest uppercase">ID: 8829-X</span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          </div>
        </div>
        
        <div className="h-8 w-[1px] bg-white/5 mx-2" />
        
        <div className="flex flex-col gap-1">
          <span className="text-[0.6rem] font-bold text-text-dim uppercase tracking-[0.2em]">Live Stream: {currentTime} UTC</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-accent-cyan" />
              <span className="text-[0.65rem] font-bold text-accent-cyan uppercase tracking-widest">Protocol Secured</span>
            </div>
            <span className="text-[0.6rem] text-text-dim font-bold uppercase tracking-[0.15em]">AI Agent V4.2.0-Stable</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button className="text-text-dim hover:text-white transition-colors relative p-2">
          <Bell size={18} />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent-red" />
        </button>
        <button className="text-text-dim hover:text-white transition-colors p-2">
          <Settings2 size={18} />
        </button>
        <div className="flex items-center gap-4 pl-4 border-l border-white/5">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-white uppercase tracking-tight">Meet Rao</span>
            <span className="text-[0.65rem] font-bold text-text-dim uppercase tracking-widest">Senior Analyst 8829</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-dim">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
