import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import {
  Shield,
  Key,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser } = useApp();

  // Permissions list based on user role (RBAC)
  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'Admin':
        return [
          'Full read & write access to global safety policies',
          'Create new operational construction sites',
          'Edit and define customized department PPE checklists',
          'Wipe/purge compliance logs database',
          'Audit incident reports & supervisor alert structures',
          'Download CSV audit logs',
        ];
      case 'Supervisor':
        return [
          'Add/edit worker information',
          'Trigger live safety scanner checks',
          'Receive real-time push alert notifications on scan failures',
          'Trigger SMS alert dispatches to safety officers',
        ];
      case 'Gate Security':
        return [
          'Trigger live safety scanner checks',
          'Select worker profiles for gate check in',
          'View access pass validation outputs (Granted/Denied)',
        ];
      case 'Safety Officer':
      default:
        return [
          'View all historical safety scan checks',
          'Inspect violation logs and CCTV images',
          'Download Excel/CSV audit logs',
        ];
    }
  };

  const permissions = getRolePermissions(currentUser?.role || 'Guest');

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">User Security Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Role-Based Access Control (RBAC) configuration details for active session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* User Card (5 cols) */}
        <GlassCard className="md:col-span-5 flex flex-col justify-between p-6">
          <div className="space-y-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-full bg-brand-blue/15 border-2 border-brand-blue/40 flex items-center justify-center font-extrabold text-brand-blue text-2xl uppercase mx-auto md:mx-0">
              {currentUser?.name.substring(0, 2) || 'SA'}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">{currentUser?.name || 'Gate Operator'}</h3>
              <span className="inline-flex items-center gap-1 bg-brand-blue/15 border border-brand-blue/30 text-brand-blue text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                <Shield className="w-3 h-3 text-brand-blue" />
                {currentUser?.role || 'Admin Security'} Role
              </span>
            </div>

            <div className="space-y-2 border-t border-slate-850 pt-4 text-xs text-slate-400 text-left">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-550" /> Session Started</span>
                <span className="font-bold text-slate-350">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-slate-550" /> Security Status</span>
                <span className="font-bold text-brand-green">Encrypted</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-850 mt-6 text-[10px] text-slate-600 leading-relaxed text-left">
            Authorized session tokens are stored securely using local storage credentials. Re-authenticates every 8 hours.
          </div>
        </GlassCard>

        {/* Permissions list card (7 cols) */}
        <GlassCard className="md:col-span-7 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-850">
            <Key className="w-4 h-4 text-brand-blue" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Authorized Permission Gates</h3>
          </div>

          <div className="space-y-3.5 text-xs text-slate-400">
            {permissions.map((perm) => (
              <div key={perm} className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <span className="text-slate-300 font-semibold">{perm}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
