import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Lock, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('Admin Operator');
  const [role, setRole] = useState('Admin');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { label: 'Admin', desc: 'Full policies, departments, analytics & configuration access.' },
    { label: 'Supervisor', desc: 'Manage site workers, receive notifications & alerts.' },
    { label: 'Gate Security', desc: 'Full access to gate camera live scans & entry check console.' },
    { label: 'Safety Officer', desc: 'Audit compliance, download logs, inspect incidents.' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const success = loginUser(username, role);
      setLoading(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Authentication failed. Check credentials.');
      }
    }, 800);
  };

  const handleQuickProfileSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setUsername(`${selectedRole} Operator`);
    setPassword('••••••••••••');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] flex flex-col justify-center items-center p-6 transition-colors duration-250 select-none">
      
      {/* Navigation Header */}
      <div className="w-full max-w-5xl mb-4 flex justify-start">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2.5 border border-slate-355 dark:border-slate-800 rounded-lg text-xs font-bold bg-white dark:bg-[#141B2D] hover:bg-slate-50 dark:hover:bg-[#1B2335] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-brand-primary" />
          BACK TO HOME SCREEN
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Left Side Info Panel (40%) */}
        <div className="lg:col-span-5 neumorph-card p-6 flex flex-col justify-between bg-white dark:bg-[#141B2D]">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-primary" />
              <span className="text-sm font-black tracking-tight uppercase text-slate-900 dark:text-white">
                SafeSite AI
              </span>
            </div>
            
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Gatekeeper Credentials Portal
              </h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Enforcing strict Zero-Harm compliance checkpoints across physical gate tourniquets, crane loaders, and high-voltage access areas.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-300/40 dark:border-slate-800/60">
              <h4 className="text-[10px] font-black text-slate-550 dark:text-slate-500 uppercase tracking-widest">
                Compliance Portal Features
              </h4>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                  <span>Real-Time Safety Equipment Scans</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                  <span>Authorized Department Audits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                  <span>Automated Digital Log Registry</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-300/40 dark:border-slate-800/60 pt-6 mt-6">
            <p className="text-[10px] text-slate-450 dark:text-slate-550 leading-relaxed font-bold uppercase">
              Secure Enterprise Clearance Portal • Active Session
            </p>
          </div>
        </div>

        {/* Right Side Login form + Role Selector (60%) */}
        <div className="lg:col-span-7 neumorph-card p-6 flex flex-col justify-between bg-white dark:bg-[#141B2D]">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Security Authentication
              </h2>
              <p className="text-xs text-slate-500 mt-1">Configure clearance roles below to log in.</p>
            </div>

            {error && (
              <div className="p-3 bg-brand-danger/8 border border-brand-danger/20 text-brand-danger rounded-lg text-xs font-bold uppercase">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest block mb-1.5 px-0.5">
                  Operator Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-300 dark:border-slate-800/80 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-primary/50"
                    placeholder="Operator name"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest block mb-1.5 px-0.5">
                  Passcode Token
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-300 dark:border-slate-800/80 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-primary/50"
                    placeholder="Passcode key"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
                >
                  {loading ? 'VERIFYING SECURITY TOKENS...' : 'AUTHENTICATE CREDENTIALS'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-300/40 dark:border-slate-800/60">
              <label className="text-[10px] font-black text-slate-550 dark:text-slate-500 uppercase tracking-widest block mb-2 px-0.5">
                Clearance Profiles (Click to Load)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handleQuickProfileSelect(r.label)}
                    type="button"
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      role === r.label
                        ? 'border-brand-primary bg-brand-primary/8 text-brand-primary'
                        : 'border-slate-300 dark:border-slate-850 hover:border-slate-400 dark:hover:border-slate-700 text-slate-500'
                    }`}
                  >
                    <p className="text-[11px] font-black uppercase">{r.label}</p>
                    <p className="text-[9px] text-slate-450 leading-normal mt-1 font-semibold">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
