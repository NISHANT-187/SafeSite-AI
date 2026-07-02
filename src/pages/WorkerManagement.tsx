import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import {
  UserPlus,
  Search,
  SlidersHorizontal,
  Shield,
  FileCheck,
  Phone,
  Droplet,
  Trash2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WorkerManagement: React.FC = () => {
  const { workers, departments, sites, addWorker, deleteWorker } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState(departments[0]?.name || 'Civil Labour');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [experience, setExperience] = useState('3 Years');
  const [certified, setCertified] = useState(true);
  const [assignedSite, setAssignedSite] = useState(sites[0]?.name || 'Mumbai Terminal 3 Expansion');
  const status: 'Active' | 'Suspended' | 'Off-duty' = 'Active';
  
  const [formError, setFormError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !employeeId.trim() || !emergencyContact.trim()) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }

    if (workers.some((w) => w.employeeId.toUpperCase() === employeeId.toUpperCase())) {
      setFormError('Employee ID code already exists.');
      return;
    }

    addWorker({
      name,
      employeeId: employeeId.toUpperCase(),
      department,
      bloodGroup,
      emergencyContact,
      experience,
      certified,
      assignedSite,
      status,
    });

    setName('');
    setEmployeeId('');
    setEmergencyContact('');
    setFormError('');
    setIsRegisterOpen(false);
  };

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || w.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-5 select-none text-xs font-semibold">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            Worker Access Registry
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-500 mt-0.5 font-medium">
            Register and manage compliance credentials and access rules for sub-contracted operators.
          </p>
        </div>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/95 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          REGISTER ACCESS PROFILE
        </button>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#141B2D] border border-slate-300/40 dark:border-slate-800/60 p-4 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-800/80 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            placeholder="Search operator registry..."
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-800/80 rounded-lg px-3 py-2.5 text-xs focus:outline-none text-slate-800 dark:text-slate-300 cursor-pointer appearance-none"
            >
              <option value="All">All Trade Groups</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((worker) => (
          <GlassCard key={worker.id} hoverEffect className="flex flex-col justify-between h-64 p-5">
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-300/40 dark:border-slate-800/60 pb-3 mb-3">
                <div className="truncate w-36">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">{worker.name.toUpperCase()}</h3>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
                    {worker.employeeId} • {worker.department}
                  </span>
                </div>
                
                {/* Safety Score Rating */}
                <div className="text-right">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      worker.safetyScore >= 90
                        ? 'text-brand-success bg-brand-success/5 border-brand-success/15'
                        : worker.safetyScore >= 80
                        ? 'text-brand-warning bg-brand-warning/5 border-brand-warning/15'
                        : 'text-brand-danger bg-brand-danger/5 border-brand-danger/15'
                    }`}
                  >
                    RATING: {worker.safetyScore}%
                  </span>
                </div>
              </div>

              {/* Card details */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] leading-relaxed text-slate-550 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{worker.emergencyContact}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-brand-danger" />
                  <span>BLOOD: {worker.bloodGroup}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>EXP: {worker.experience}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck className={`w-3.5 h-3.5 ${worker.certified ? 'text-brand-success' : 'text-brand-warning'}`} />
                  <span>{worker.certified ? 'CERTIFIED SAFE' : 'NO CERTIFICATE'}</span>
                </div>
              </div>

              <div className="mt-3 text-[10px] font-bold text-slate-500">
                ASSIGNED HUB: <span className="text-slate-700 dark:text-slate-350">{worker.assignedSite.toUpperCase()}</span>
              </div>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between border-t border-slate-300/40 dark:border-slate-800/60 pt-3 mt-4">
              <span
                className={`badge-status ${
                  worker.status === 'Active'
                    ? 'badge-online'
                    : worker.status === 'Suspended'
                    ? 'badge-critical'
                    : 'badge-offline'
                }`}
              >
                {worker.status}
              </span>
              
              <button
                onClick={() => deleteWorker(worker.id)}
                className="p-1.5 text-slate-400 hover:text-brand-danger hover:bg-brand-danger/10 border border-slate-300 dark:border-slate-800 rounded-lg cursor-pointer transition-colors"
                title="Revoke Access Credentials"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Register Profile Modal overlay */}
      <AnimatePresence>
        {isRegisterOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
              onClick={() => setIsRegisterOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-50 p-6 neumorph-card bg-white dark:bg-[#141B2D]"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-300/40 dark:border-slate-800/60 mb-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Register Access Profile
                </h3>
                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-500/10 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-brand-danger/8 border border-brand-danger/25 text-brand-danger rounded-lg mb-4 text-[10px] font-bold uppercase">
                  {formError}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Operator Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-primary/50"
                      placeholder="e.g. Vikram Rathore"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Employee ID Code *</label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-primary/50"
                      placeholder="e.g. EMP-9012"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Trade Group</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#FFFFFF] dark:bg-[#141B2D] border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-[#FFFFFF] dark:bg-[#141B2D] border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Emergency Contact Phone *</label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Active Experience</label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-350 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      placeholder="e.g. 5 Years"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Assigned Operational Site Hub</label>
                  <select
                    value={assignedSite}
                    onChange={(e) => setAssignedSite(e.target.value)}
                    className="w-full bg-[#FFFFFF] dark:bg-[#141B2D] border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="certified_chk"
                    checked={certified}
                    onChange={(e) => setCertified(e.target.checked)}
                    className="w-3.5 h-3.5 text-brand-primary focus:ring-0 focus:ring-offset-0 bg-[#FFFFFF] border border-slate-350 rounded"
                  />
                  <label htmlFor="certified_chk" className="text-[10px] text-slate-650 dark:text-slate-400 font-bold uppercase select-none">
                    Trade Safety Training Certificate Valid
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/95 cursor-pointer shadow-md"
                  >
                    REGISTER PROFILE
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
