import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import {
  Sliders,
  Database,
  Building,
  AlertTriangle,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    sites,
    addSite,
    clearAllLogs,
    departments,
  } = useApp();

  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteLoc, setNewSiteLoc] = useState('');
  const [newSiteSuper, setNewSiteSuper] = useState('');
  const [showAddSite, setShowAddSite] = useState(false);

  // Clear logs modal safety confirmation
  const [confirmClear, setConfirmClear] = useState(false);

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteLoc.trim()) return;

    addSite(newSiteName, newSiteLoc, newSiteSuper || 'Site Manager');
    setNewSiteName('');
    setNewSiteLoc('');
    setNewSiteSuper('');
    setShowAddSite(false);
  };

  const handleConfirmClearLogs = () => {
    clearAllLogs();
    setConfirmClear(false);
    alert('Compliance logs and incident database wiped successfully.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Admin Configuration Panel</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage physical sites, assign supervisors, and configure database purging cycles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sites configuration list (7 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-blue" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Registered Sites</h3>
              </div>
              
              <button
                onClick={() => setShowAddSite(!showAddSite)}
                className="px-3 py-1.5 bg-brand-blue/15 text-brand-blue rounded-xl text-[10px] font-bold uppercase tracking-wider border border-brand-blue/20"
              >
                + Add Site
              </button>
            </div>

            {showAddSite && (
              <form onSubmit={handleAddSite} className="bg-[#111827]/40 border border-slate-850 p-4 rounded-xl mb-4 text-xs space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Site Title</label>
                    <input
                      type="text"
                      required
                      value={newSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                      className="w-full bg-[#0b0f19]/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                      placeholder="e.g. Pune Terminal"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Geographic Location</label>
                    <input
                      type="text"
                      required
                      value={newSiteLoc}
                      onChange={(e) => setNewSiteLoc(e.target.value)}
                      className="w-full bg-[#0b0f19]/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                      placeholder="e.g. Hadapsar, Pune"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Assigned Supervisor</label>
                    <input
                      type="text"
                      value={newSiteSuper}
                      onChange={(e) => setNewSiteSuper(e.target.value)}
                      className="w-full bg-[#0b0f19]/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                      placeholder="e.g. S.K. Banerjee"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-1.5 bg-brand-blue text-white rounded-lg font-bold">
                    Add
                  </button>
                  <button type="button" onClick={() => setShowAddSite(false)} className="px-4 py-1.5 border border-slate-800 text-slate-400 rounded-lg font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3.5">
              {sites.map((s) => (
                <div key={s.id} className="flex flex-col sm:flex-row justify-between p-3.5 bg-[#111827]/40 border border-slate-850/50 rounded-xl text-xs gap-3">
                  <div className="space-y-1">
                    <p className="font-extrabold text-white text-sm">{s.name}</p>
                    <p className="text-[10px] text-slate-550">{s.location}</p>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] text-slate-450 self-start sm:self-center">
                    <div>
                      <span className="text-[9px] text-slate-500 font-semibold block uppercase">Marshal</span>
                      <span className="font-bold text-slate-300">{s.supervisor}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-semibold block uppercase">Occupants</span>
                      <span className="font-bold text-slate-300">{s.activeWorkers} Inside</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Global rule controls & maintenance database (5 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Global Helmet rules list */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-850 mb-4">
              <Sliders className="w-4 h-4 text-brand-orange" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Helmet Mappings Index</h3>
            </div>

            <div className="space-y-2.5 text-[11px]">
              {departments.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2.5 bg-[#111827]/40 rounded-xl border border-slate-850/40">
                  <span className="font-bold text-slate-200">{d.name}</span>
                  
                  <span className="flex items-center gap-1.5 font-bold text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: d.helmetColor.toLowerCase() }} />
                    {d.helmetColor} Color
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Database maintenance settings */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-850 mb-4">
              <Database className="w-4 h-4 text-brand-red animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Database Maintenance</h3>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-[11px] text-slate-400 leading-normal">
                Wipe operational scan check logs and auto-generated incident reports for new compliance audit periods.
              </p>

              {confirmClear ? (
                <div className="space-y-3.5 p-3.5 bg-brand-red/10 border border-brand-red/20 rounded-xl">
                  <div className="flex items-start gap-2 text-brand-red font-bold text-[11px] leading-relaxed">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Warning: Wiping is permanent and cannot be undone. Confirm purge?</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmClearLogs}
                      className="px-3.5 py-1.5 bg-brand-red text-white rounded-lg font-bold hover:bg-brand-red/90 transition-colors"
                    >
                      Wipe Database
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-3.5 py-1.5 border border-slate-800 text-slate-400 rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="w-full py-3 border border-brand-red/20 text-brand-red hover:bg-brand-red/5 rounded-xl font-bold transition-colors"
                >
                  Purge Logs Database
                </button>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
