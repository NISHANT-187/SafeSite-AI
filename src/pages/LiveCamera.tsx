import React from 'react';
import { WebcamScanner } from '../components/WebcamScanner';
import { Info } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const LiveCamera: React.FC = () => {
  return (
    <div className="space-y-5 select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
          Inspection Terminal Console
        </h2>
        <p className="text-xs text-slate-550 dark:text-slate-500 mt-0.5">
          Automated real-time safety scanning, biometric face recognition lookup, and HSL color classifications.
        </p>
      </div>

      {/* Main scanner */}
      <WebcamScanner />

      {/* Operator instructions footer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-3xl">
        <GlassCard className="md:col-span-12 p-4 flex gap-3 text-xs leading-relaxed text-slate-550 dark:text-slate-450 bg-slate-200/40 dark:bg-slate-900/10">
          <Info className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold text-slate-800 dark:text-slate-200 uppercase">Operational Guidelines:</p>
            <p>
              1. Direct the operator to stand 1.5 meters from the webcam. Check that helmet color and reflective vest are in frame.
            </p>
            <p>
              2. Inspect biometric face registration and trade mappings checks.
            </p>
            <p>
              3. For compliance violations, enforce corrective actions immediately. Under emergency state, use manual override terminal resets.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
