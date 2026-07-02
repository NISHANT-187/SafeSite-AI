import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { speakMessage } from '../utils/speech';
import {
  AlertOctagon,
  Phone,
  Droplet,
  Activity,
  BellRing,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CCTV: React.FC = () => {
  const { addEntryLog, activeSite } = useApp();
  
  const [alarmActive, setAlarmActive] = useState(false);
  const [activeAlertDetails, setActiveAlertDetails] = useState<{
    zone: string;
    worker: string;
    blood: string;
    contact: string;
    incident: string;
  } | null>(null);

  // Audio Context for the continuous buzzer alarm
  const [oscillatorPair, setOscillatorPair] = useState<[OscillatorNode, GainNode] | null>(null);

  const startBuzzerSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      
      const interval = setInterval(() => {
        if (osc) {
          osc.frequency.setValueAtTime(
            osc.frequency.value === 220 ? 330 : 220,
            ctx.currentTime
          );
        }
      }, 500);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setOscillatorPair([osc, gain] as any);
      (osc as any).intervalId = interval;
    } catch (e) {
      console.warn('Emergency audio failed', e);
    }
  };

  const stopBuzzerSound = () => {
    if (oscillatorPair) {
      const [osc, gain] = oscillatorPair;
      try {
        clearInterval((osc as any).intervalId);
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
      setOscillatorPair(null);
    }
  };

  const triggerFallEmergency = () => {
    if (alarmActive) return;

    setAlarmActive(true);
    const details = {
      zone: 'High-Rise Scaffolding Zone C',
      worker: 'Amit Mishra (EMP-3092)',
      blood: 'B+ Positive',
      contact: '+91 91234 56789',
      incident: 'Worker Fall / Structural Collapse Detected',
    };
    setActiveAlertDetails(details);
    
    speakMessage("Warning! Critical safety incident detected. Fall event in scaffolding zone C. Alerting safety teams.");
    startBuzzerSound();

    addEntryLog({
      workerName: 'Amit Mishra',
      employeeId: 'EMP-3092',
      department: 'Plumber',
      status: 'Access Denied',
      helmetColorDetected: 'None',
      helmetColorStatus: 'Failed',
      detectedPPE: ['Gloves'],
      missingPPE: ['Helmet', 'Harness'],
      confidenceScore: 99,
      safetyScore: 20,
    });
  };

  const triggerIntrusionAlert = () => {
    speakMessage("Intrusion warning. Operator identified in Excavation Pit zone without safety harness.");
    alert("Perimeter Intrusion logged. Dispatching security team to Excavation Pit B.");
    
    addEntryLog({
      workerName: 'Gurpreet Singh',
      employeeId: 'EMP-5011',
      department: 'Welder',
      status: 'Access Denied',
      helmetColorDetected: 'Green',
      helmetColorStatus: 'Passed',
      detectedPPE: ['Helmet', 'Reflective Vest', 'Gloves'],
      missingPPE: ['Safety Shoes', 'Face Shield'],
      confidenceScore: 95,
      safetyScore: 60,
    });
  };

  const handleResolveEmergency = () => {
    setAlarmActive(false);
    setActiveAlertDetails(null);
    stopBuzzerSound();
    speakMessage("Emergency resolved. System returns to normal monitoring.");
  };

  useEffect(() => {
    return () => {
      stopBuzzerSound();
    };
  }, [oscillatorPair]);

  const cams = [
    { name: 'CAM 01 - SCAFFOLDING A', desc: 'High-Rise Structural Framing', risk: 'HIGH' },
    { name: 'CAM 02 - EXCAVATION PIT', desc: 'Lower Foundation Excavation', risk: 'MEDIUM' },
    { name: 'CAM 03 - CRANE PERIMETER', desc: 'Heavy Cargo Lifting Zone', risk: 'HIGH' },
    { name: 'CAM 04 - GRID STATION', desc: 'Electrical Power Intake', risk: 'MEDIUM' },
  ];

  return (
    <div className="space-y-5 select-none text-xs font-semibold">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            CCTV Site Monitors
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-500 mt-0.5 font-medium">
            Real-time feed telemetry identifying helmet removal, zone intrusions, and fall alerts inside {activeSite?.name}.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={triggerFallEmergency}
            className="px-3.5 py-2 bg-brand-danger text-white rounded-lg text-xs font-bold hover:bg-brand-danger/95 flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            SIMULATE FALL EVENT
          </button>
          <button
            onClick={triggerIntrusionAlert}
            className="px-3.5 py-2 border border-slate-350 dark:border-slate-800 text-slate-655 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white rounded-lg text-xs font-bold bg-white dark:bg-transparent flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4" />
            SIMULATE INTRUSION
          </button>
        </div>
      </div>

      {/* CCTV Cameras Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cams.map((cam, idx) => (
          <GlassCard key={idx} className="p-4 flex flex-col justify-between min-h-[260px] overflow-hidden relative">
            
            {/* Camera feed header */}
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-300/40 dark:border-slate-800/60">
              <span className="text-[10px] text-brand-success font-black tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success pulse-green" />
                {cam.name}
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-black border ${
                cam.risk === 'HIGH' 
                  ? 'text-brand-danger bg-brand-danger/5 border-brand-danger/15' 
                  : 'text-brand-warning bg-brand-warning/5 border-brand-warning/15'
              }`}>
                {cam.risk} RISK
              </span>
            </div>

            {/* Video mock screen */}
            <div className="flex-1 my-3 bg-[#030508] border border-slate-300 dark:border-slate-850 rounded-lg flex items-center justify-center relative overflow-hidden min-h-[160px] select-text">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.02),_transparent)]" />
              <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest font-black">
                FPS: 29.8 • FEED CONNECTED
              </div>
              
              {/* CCTV grid markers */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-900/60 dark:bg-slate-900/60" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-900/60 dark:bg-slate-900/60" />

              {/* Bounding boxes */}
              {idx === 0 && !alarmActive && (
                <div className="absolute border border-brand-success bg-brand-success/5 p-2 rounded text-[8px] font-bold font-mono text-white left-1/3 top-1/4">
                  <span className="block">OPERATOR 01: HELMET DETECTED</span>
                  <span>VEST: CONNECTED (98%)</span>
                </div>
              )}
              {idx === 2 && (
                <div className="absolute border border-brand-success bg-brand-success/5 p-2 rounded text-[8px] font-bold font-mono text-white right-1/4 bottom-1/3">
                  <span className="block">OPERATOR 02: HELMET DETECTED</span>
                  <span>VEST: CONNECTED (96%)</span>
                </div>
              )}

              {idx === 0 && alarmActive && (
                <div className="absolute border border-brand-danger bg-brand-danger/10 p-3 rounded-lg text-[9px] font-black font-mono text-brand-danger animate-pulse text-center">
                  ⚠️ ACCIDENT WARNING
                  <span className="block text-[8px] text-white mt-1 uppercase font-bold">FALL IN HIGH-RISE ZONE</span>
                </div>
              )}

              <Activity className="w-8 h-8 text-slate-300 dark:text-slate-850" />
            </div>

            <div className="text-[10px] text-slate-500 font-bold uppercase">{cam.desc}</div>
          </GlassCard>
        ))}
      </div>

      {/* Emergency Siren Alert Overlay Screen */}
      <AnimatePresence>
        {alarmActive && activeAlertDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-brand-danger/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white"
          >
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-2xl mb-6 pulse-red">
              <BellRing className="w-10 h-10 text-brand-danger animate-bounce" />
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black-title text-center tracking-wide uppercase animate-pulse">
              EMERGENCY ALERT: WORKER ACCIDENT REPORTED
            </h1>
            
            <div className="mt-8 max-w-2xl w-full bg-[#05070a] border border-brand-danger/30 p-6 rounded-xl shadow-2xl text-left select-text">
              <h3 className="font-extrabold text-brand-danger text-xs uppercase tracking-widest border-b border-slate-800 pb-2 mb-4">
                Telemetry Dispatch Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Accident Event</span>
                  <span className="font-black text-white text-sm uppercase">{activeAlertDetails.incident}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Perimeter Location</span>
                  <span className="font-extrabold text-slate-200 uppercase">{activeAlertDetails.zone}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-550 font-bold block uppercase">Worker Profile</span>
                  <span className="font-extrabold text-slate-200 uppercase">{activeAlertDetails.worker}</span>
                </div>
                
                <div className="flex gap-6 pt-1 col-span-2 border-t border-slate-800/60 mt-2">
                  <div className="flex items-center gap-1.5 text-brand-danger">
                    <Droplet className="w-4 h-4 fill-brand-danger animate-pulse" />
                    <div>
                      <span className="text-[9px] text-slate-550 block font-bold uppercase">Medical Blood Group</span>
                      <span className="font-black text-white">{activeAlertDetails.blood}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[9px] text-slate-550 block font-bold uppercase">Supervisor Emergency Contact</span>
                      <span className="font-black text-white">{activeAlertDetails.contact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleResolveEmergency}
                className="px-8 py-3 bg-white text-[#DC2626] hover:bg-slate-100 rounded-lg text-xs font-black shadow-lg transition-colors active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                Acknowledge & Resolve Alarm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
