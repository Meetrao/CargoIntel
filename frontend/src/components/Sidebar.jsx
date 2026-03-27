import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  Shield, 
  LifeBuoy, 
  XOctagon,
  GitCompare
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'comparison', label: 'Comparison', icon: GitCompare },
    { id: 'history', label: 'History', icon: History },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-[280px] bg-sidebar border-r border-white/5 flex flex-col shrink-0 h-screen">
      {/* Brand Header */}
      <div className="p-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-cyan rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">CargoIntel</h1>
        </div>
        <div className="flex items-center gap-2 mt-4 px-1">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-[0.65rem] font-bold text-accent-cyan uppercase tracking-widest">Sentinel Lens</span>
        </div>
        <span className="text-[0.6rem] text-text-dim font-bold uppercase tracking-[0.2em] px-1">Active Protocol</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-8 flex flex-col gap-4 mt-auto">
        <button className="btn-protocol btn-protocol-danger w-full">
          <XOctagon size={16} />
          Emergency Stop
        </button>
        <button className="flex items-center gap-3 text-text-dim hover:text-white transition-colors uppercase tracking-[0.15em] text-[0.65rem] font-bold px-1">
          <LifeBuoy size={16} />
          Support
        </button>
      </div>
    </div>
  );
}
