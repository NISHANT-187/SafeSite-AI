import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { formatDate } from '../utils/helpers';
import { exportToCSV } from '../utils/helpers';
import {
  Search,
  FileDown,
  ChevronRight,
  Shield,
  Clock,
  X,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const EntryLogs: React.FC = () => {
  const { entryLogs, activeSite } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Granted' | 'Denied'>('All');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const filteredLogs = entryLogs.filter((log) => {
    const matchesSearch =
      log.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Granted' && log.status === 'Access Granted') ||
      (statusFilter === 'Denied' && log.status === 'Access Denied');
    
    return matchesSearch && matchesStatus;
  });

  const selectedLog = entryLogs.find((l) => l.id === selectedLogId);

  const handleExportCSV = () => {
    const csvData = entryLogs.map((l) => ({
      Timestamp: formatDate(l.timestamp),
      'Worker Name': l.workerName,
      'Employee ID': l.employeeId,
      Department: l.department,
      Status: l.status,
      'Helmet Color Detected': l.helmetColorDetected,
      'Helmet Check': l.helmetColorStatus,
      'Detected PPE': l.detectedPPE.join('; '),
      'Missing PPE': l.missingPPE.join('; '),
      'Safety Score': `${l.safetyScore}%`,
      'AI Confidence': `${l.confidenceScore}%`,
    }));

    exportToCSV(csvData, 'SafeSiteAI_GateEntryLogs');
  };

  return (
    <div className="space-y-5 select-none text-xs font-semibold">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            Compliance Audit Trails
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-500 mt-0.5 font-medium">
            Full compliance ledger logging access gates verification runs across {activeSite?.name || 'construction sites'}.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 border border-slate-350 dark:border-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white rounded-lg text-xs font-bold bg-white dark:bg-transparent flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-brand-primary" />
          EXPORT COMPLIANCE DATA
        </button>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#141B2D] border border-slate-300/40 dark:border-slate-800/60 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-800/80 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            placeholder="Filter database audits by worker code..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-850 p-1 rounded-lg">
            {(['All', 'Granted', 'Denied'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-4 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  statusFilter === opt
                    ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/15'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Log */}
      <GlassCard className="p-0 select-text">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-850 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="py-2.5 px-4">Audit Timestamp</th>
                <th className="py-2.5 px-4">Worker Identity</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Helmet Status</th>
                <th className="py-2.5 px-4 text-center">Safety Rating</th>
                <th className="py-2.5 px-4">Gate Result</th>
                <th className="py-2.5 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-slate-300/40 dark:border-slate-850 hover:bg-slate-200/20 dark:hover:bg-[#1B2335]/25 text-slate-650 dark:text-slate-350 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[10px]">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {log.workerName.toUpperCase()}
                    <span className="block text-[9px] text-slate-500 font-semibold">{log.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[10px] uppercase text-slate-700 dark:text-slate-450">{log.department}</td>
                  <td className="py-3 px-4 font-medium">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-bold border ${
                        log.helmetColorStatus === 'Passed'
                          ? 'bg-brand-success/5 border-brand-success/15 text-brand-success'
                          : log.helmetColorStatus === 'Failed'
                          ? 'bg-brand-danger/5 border-brand-danger/15 text-brand-danger'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {log.helmetColorDetected} {log.helmetColorStatus === 'Passed' ? 'PASSED' : 'VIOLATION'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-black text-[11px] px-2 py-0.5 rounded ${
                        log.safetyScore >= 90
                          ? 'text-brand-success bg-brand-success/5'
                          : log.safetyScore >= 80
                          ? 'text-brand-warning bg-brand-warning/5'
                          : 'text-brand-danger bg-brand-danger/5'
                      }`}
                    >
                      {log.safetyScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase font-black border ${
                        log.status === 'Access Granted'
                          ? 'bg-brand-success/5 border-brand-success/15 text-brand-success'
                          : 'bg-brand-danger/5 border-brand-danger/15 text-brand-danger'
                      }`}
                    >
                      {log.status === 'Access Granted' ? 'GRANTED' : 'DENIED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLogId(log.id)}
                      className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      title="Inspect Check Logs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Log Inspector detail drawer */}
      <AnimatePresence>
        {selectedLogId && selectedLog && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
              onClick={() => setSelectedLogId(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'tween', duration: 0.15 }}
              className="fixed top-0 right-0 bottom-0 w-80 md:w-96 z-50 p-6 neumorph-card bg-white dark:bg-[#141B2D] flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-300/40 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4.5 h-4.5 text-brand-primary" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                      Audit File Inspector
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedLogId(null)}
                    className="p-1 rounded-full hover:bg-slate-500/10 text-slate-400"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Audit Timestamp</span>
                    <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <Clock className="w-4.5 h-4.5 text-slate-450" />
                      <span className="font-mono">{formatDate(selectedLog.timestamp)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Operator Profile</span>
                    <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <UserCheck className="w-4.5 h-4.5 text-slate-450" />
                      <span className="font-extrabold uppercase">
                        {selectedLog.workerName} ({selectedLog.employeeId})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Trade Group</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-350 uppercase">{selectedLog.department}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Clearance Score</span>
                      <span className="font-black text-slate-800 dark:text-slate-200">{selectedLog.safetyScore}%</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-300/40 dark:border-slate-800/60">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-2">Classified Helmet Color</span>
                    <span className={`badge-status ${selectedLog.helmetColorStatus === 'Passed' ? 'badge-online' : 'badge-critical'}`}>
                      {selectedLog.helmetColorDetected} ({selectedLog.helmetColorStatus})
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-300/40 dark:border-slate-800/60">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase mb-2">Required vs Verified Check</span>
                    <div className="space-y-1.5 text-[10px]">
                      {selectedLog.detectedPPE.map((gear) => (
                        <div key={gear} className="flex items-center gap-1.5 text-brand-success font-bold">
                          <span>✓ Verified Compliant:</span>
                          <span className="uppercase">{gear}</span>
                        </div>
                      ))}
                      {selectedLog.missingPPE.map((gear) => (
                        <div key={gear} className="flex items-center gap-1.5 text-brand-danger font-bold">
                          <span>❌ Missing Item:</span>
                          <span className="uppercase">{gear}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLogId(null)}
                className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
              >
                Acknowledge File
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
