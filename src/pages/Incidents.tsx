import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { formatDate } from '../utils/helpers';
import {
  AlertTriangle,
  User,
  MapPin,
  ShieldAlert,
  Send,
  Eye,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Incidents: React.FC = () => {
  const { incidentReports } = useApp();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  
  // SMS notification simulator
  const [notifiedId, setNotifiedId] = useState<string | null>(null);

  const selectedIncident = incidentReports.find((i) => i.id === selectedIncidentId);

  const handleSimulateAlert = (id: string) => {
    setNotifiedId(id);
    setTimeout(() => {
      setNotifiedId(null);
      alert('Supervisor SMS & Email alert payloads successfully dispatched via SafeSite API gateway.');
    }, 1200);
  };

  return (
    <div className="space-y-5 select-none text-xs font-semibold">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            Access Violations Log
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-500 mt-0.5 font-medium">
            System generated logs captured when the terminal identifies gate compliance omissions.
          </p>
        </div>
      </div>

      {/* Grid of incidents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incidentReports.map((inc) => (
          <GlassCard key={inc.id} className="flex flex-col justify-between p-5 min-h-[260px]">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-300/40 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-brand-danger" />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    Violation: {inc.employeeId}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{formatDate(inc.timestamp)}</span>
              </div>

              {/* Grid content details */}
              <div className="flex gap-4 items-start select-text">
                {/* Simulated CCTV snapshot thumbnail */}
                <div className="w-20 h-20 bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800/80 shrink-0 overflow-hidden flex items-center justify-center relative">
                  <span className="absolute top-1 left-1 text-[8px] bg-brand-danger text-white px-1 rounded font-bold uppercase z-10">CCTV</span>
                  <img
                    src={inc.photoUrl}
                    alt="Scan snapshot"
                    className="w-full h-full object-cover opacity-70"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=250&auto=format&fit=crop';
                    }}
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-slate-850 dark:text-slate-200 uppercase">{inc.workerName}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{inc.department} trade</p>
                  
                  <div className="pt-1.5 text-brand-danger text-[10px] font-black leading-normal uppercase">
                    ⚠️ {inc.reason}
                  </div>
                </div>
              </div>

              {/* Extra Meta Info */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 bg-slate-200/50 dark:bg-slate-950/20 p-2.5 rounded-lg border border-slate-300/40 dark:border-slate-850/40">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate uppercase">{inc.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate uppercase">Rep: {inc.supervisor}</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-2 border-t border-slate-300/40 dark:border-slate-800/60 pt-3.5 mt-4">
              <button
                onClick={() => setSelectedIncidentId(inc.id)}
                className="flex-1 py-2 bg-white dark:bg-transparent border border-slate-300 dark:border-slate-800 text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-brand-primary" />
                VIEW FULL AUDIT
              </button>

              <button
                onClick={() => handleSimulateAlert(inc.id)}
                disabled={notifiedId === inc.id}
                className="px-4 py-2 bg-brand-danger/8 hover:bg-brand-danger/15 text-brand-danger rounded-lg text-xs font-bold border border-brand-danger/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {notifiedId === inc.id ? 'SENDING...' : 'ALERT SUPERVISOR'}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Incident details modal overlay */}
      <AnimatePresence>
        {selectedIncidentId && selectedIncident && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
              onClick={() => setSelectedIncidentId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-50 p-6 neumorph-card bg-white dark:bg-[#141B2D] select-text"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-300/40 dark:border-slate-800/60 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-brand-danger" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Violation Audit File
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIncidentId(null)}
                  className="p-1.5 rounded-full hover:bg-slate-500/10 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Details layout */}
                <div className="flex gap-4 items-start border-b border-slate-300/40 dark:border-slate-800/60 pb-4">
                  <div className="w-24 h-24 bg-slate-950 rounded-lg border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedIncident.photoUrl}
                      alt="CCTV Capture Snapshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">
                      {selectedIncident.workerName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      ID: {selectedIncident.employeeId} • Trade: {selectedIncident.department}
                    </p>
                    <p className="font-extrabold text-brand-danger uppercase text-[10px]">
                      Violation: {selectedIncident.reason}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-0.5">Assigned site location</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase">{selectedIncident.location}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-0.5">Site Supervisor Mapped</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase">{selectedIncident.supervisor}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-0.5">Audit Timestamp</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatDate(selectedIncident.timestamp)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-0.5">System Action Dispatched</span>
                    <span className="font-bold text-brand-primary uppercase text-[10px]">SMS ALERT DISPATCHED</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  onClick={() => setSelectedIncidentId(null)}
                  className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-850 dark:text-white rounded-lg text-xs font-bold uppercase"
                >
                  CLOSE AUDIT LOG
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
