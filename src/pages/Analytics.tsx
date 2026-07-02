import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  Percent,
  CheckCircle,
  Skull,
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { workers, activeSite } = useApp();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // 1. Safety Score rankings (repeat offenders - score < 90)
  const rankingWorkers = [...workers].sort((a, b) => a.safetyScore - b.safetyScore);
  const topOffenders = rankingWorkers.filter((w) => w.safetyScore < 90);
  const bestWorkers = [...workers].sort((a, b) => b.safetyScore - a.safetyScore).slice(0, 3);

  // 2. Accident Risk predictions mapping (calculated from danger zone counts)
  // Let's create realistic mock telemetry:
  const dangerZonesTelemetry = activeSite?.dangerZones.map((z) => {
    // Risk formula: workersInside * 10 + (100 - average department score)
    let baseScore = z.workersInside * 12;
    if (z.level === 'High') baseScore += 25;
    else if (z.level === 'Medium') baseScore += 10;
    
    // cap at 98%
    const riskPercent = Math.min(Math.max(baseScore, 5), 98);
    
    return {
      ...z,
      riskPercent,
      temp: '32°C',
      avgVibration: '1.2mm/s',
      ppeCompliance: '92%',
    };
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Accident Risk & Site Map</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            AI telemetry forecasting accident probabilities and interactive danger zone occupancy trackers.
          </p>
        </div>
      </div>

      {/* Interactive Blueprint Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        
        {/* Site Map Blueprint Graphic (7 cols) */}
        <GlassCard className="lg:col-span-8 flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Interactive Site Map (Zone Blueprints)</h3>
            <p className="text-[11px] text-slate-500">
              Click on a zone circle to trace risk assessments and operator levels.
            </p>
          </div>

          {/* Interactive HTML/SVG Blueprint Grid */}
          <div className="flex-1 my-6 rounded-xl bg-slate-950/60 border border-slate-900 overflow-hidden relative min-h-[280px] p-4 flex flex-col justify-between">
            {/* Mock layout structure representing site blueprints */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-15 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-slate-800 border-dashed" />
              ))}
            </div>

            {/* Danger Zones Map Circles */}
            <div className="relative w-full h-full min-h-[220px] flex items-center justify-center">
              
              {/* Crane Zone circle */}
              <button
                onClick={() => setSelectedZone('Crane Zone A')}
                className="absolute top-1/4 left-1/4 p-4 rounded-full bg-brand-red/10 border border-brand-red/50 hover:bg-brand-red/25 hover:border-brand-red text-center transition-all z-10"
              >
                <AlertTriangle className="w-5 h-5 text-brand-red mx-auto animate-pulse" />
                <span className="text-[9px] font-extrabold text-white block mt-1">Crane Area</span>
              </button>

              {/* Excavation Pit */}
              <button
                onClick={() => setSelectedZone('Excavation Pit B')}
                className="absolute bottom-1/4 left-1/3 p-4 rounded-full bg-brand-orange/10 border border-brand-orange/50 hover:bg-brand-orange/25 hover:border-brand-orange text-center transition-all z-10"
              >
                <Skull className="w-5 h-5 text-brand-orange mx-auto animate-bounce" />
                <span className="text-[9px] font-extrabold text-white block mt-1">Excavation</span>
              </button>

              {/* High-Rise Scaffolding */}
              <button
                onClick={() => setSelectedZone('High-Rise Scaffolding')}
                className="absolute top-1/3 right-1/4 p-4 rounded-full bg-brand-red/10 border border-brand-red/50 hover:bg-brand-red/25 hover:border-brand-red text-center transition-all z-10"
              >
                <TrendingUp className="w-5 h-5 text-brand-red mx-auto" />
                <span className="text-[9px] font-extrabold text-white block mt-1">High-Rise</span>
              </button>

              {/* Electrical room */}
              <button
                onClick={() => setSelectedZone('Electrical Substation')}
                className="absolute bottom-1/3 right-1/3 p-4 rounded-full bg-brand-blue/10 border border-brand-blue/50 hover:bg-brand-blue/25 hover:border-brand-blue text-center transition-all z-10"
              >
                <Percent className="w-5 h-5 text-brand-blue mx-auto" />
                <span className="text-[9px] font-extrabold text-white block mt-1">Electrical</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-500 font-medium bg-[#111827]/40 px-3 py-1.5 rounded-lg border border-slate-900 w-fit self-end">
              Radar Grid Active • Mumbai Terminal 3 Gate 2 Scanner
            </div>
          </div>
        </GlassCard>

        {/* Selected Zone Risk Assessment (4 cols) */}
        <GlassCard className="lg:col-span-4 flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">AI Risk Telemetry</h3>
            <p className="text-[11px] text-slate-500">Real-time danger zone assessment values.</p>
          </div>

          {selectedZone ? (() => {
            const telemetry = dangerZonesTelemetry.find((t) => t.name.includes(selectedZone.split(' ')[0])) || {
              name: selectedZone,
              level: 'High',
              workersInside: 4,
              riskPercent: 78,
              temp: '31°C',
              avgVibration: '1.2mm/s',
              ppeCompliance: '92%',
            };

            return (
              <div className="flex-1 flex flex-col justify-between mt-4 space-y-4 text-xs">
                {/* Score panel */}
                <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-white text-sm">{telemetry.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      telemetry.level === 'High' ? 'text-brand-red bg-brand-red/10 animate-pulse' : 'text-brand-blue bg-brand-blue/10'
                    }`}>
                      {telemetry.level} RISK
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl font-black text-white">{telemetry.riskPercent}%</span>
                    <span className="text-[10px] text-slate-555 font-bold uppercase">Accident Probability</span>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        telemetry.riskPercent >= 70
                          ? 'bg-brand-red'
                          : telemetry.riskPercent >= 40
                          ? 'bg-brand-orange'
                          : 'bg-brand-blue'
                      }`}
                      style={{ width: `${telemetry.riskPercent}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry data list */}
                <div className="space-y-2 text-slate-400 bg-slate-950/20 p-3 rounded-xl border border-slate-850/40">
                  <div className="flex justify-between">
                    <span>Occupancy inside zone:</span>
                    <span className="font-bold text-white">{telemetry.workersInside} Workers</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ambient Temperature:</span>
                    <span className="font-bold text-white">{telemetry.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vibration Frequency:</span>
                    <span className="font-bold text-white">{telemetry.avgVibration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPE compliance score:</span>
                    <span className="font-bold text-brand-green">{telemetry.ppeCompliance}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-normal italic">
                  *AI accident forecasting values are updated dynamically based on real-time worker count, average PPE rating history, and sensor telemetry.
                </p>
              </div>
            );
          })() : (
            <div className="flex-1 flex flex-col justify-center items-center text-slate-500 text-center p-6 space-y-2">
              <Skull className="w-12 h-12 text-slate-700" />
              <p className="text-xs">No zone selected. Click on a zone from the site blueprints to inspect live data metrics.</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Leaderboard Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Safety Leaders (Best Scores) */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-850 mb-4">
            <Award className="w-4 h-4 text-brand-green" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Safety Compliant Workers</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {bestWorkers.map((w, idx) => (
              <div key={w.id} className="flex items-center justify-between p-2.5 bg-[#111827]/40 rounded-xl border border-slate-800/40">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-extrabold text-white">{w.name}</p>
                    <p className="text-[9px] text-slate-500 uppercase">{w.department} • {w.employeeId}</p>
                  </div>
                </div>
                
                <span className="font-black text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">
                  {w.safetyScore}% score
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Lowest Scores (Require Attention / Off-site) */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-850 mb-4">
            <AlertTriangle className="w-4 h-4 text-brand-red animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Attention Required (Low Safety Ratings)</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {topOffenders.slice(0, 3).map((w) => (
              <div key={w.id} className="flex items-center justify-between p-2.5 bg-[#111827]/40 rounded-xl border border-slate-800/40">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center font-bold text-[10px]">
                    !
                  </span>
                  <div>
                    <p className="font-extrabold text-white">{w.name}</p>
                    <p className="text-[9px] text-slate-500 uppercase">{w.department} • {w.employeeId}</p>
                  </div>
                </div>
                
                <span className="font-black text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">
                  {w.safetyScore}% score
                </span>
              </div>
            ))}
            {topOffenders.length === 0 && (
              <div className="flex items-center justify-center h-28 text-slate-500">
                <CheckCircle className="w-6 h-6 mr-1.5 text-brand-green" /> All workers are above threshold.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
