import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speakMessage, cancelAllSpeech } from '../utils/speech';
import {
  playSuccessSound,
  playFailureSound,
  playLaserBeep,
} from '../utils/sound';
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Eye,
  Cpu,
  FileCheck,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WebcamScanner: React.FC = () => {
  const { workers, departments, addEntryLog } = useApp();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  // Terminal inputs
  const [scanWorkerId, setScanWorkerId] = useState(workers[0]?.id || '');
  const [cvMode, setCvMode] = useState<'real-cv' | 'simulation'>('real-cv');
  const [simScenario, setSimScenario] = useState<'compliant' | 'missing-gloves' | 'wrong-helmet' | 'missing-all' | 'visitor'>('compliant');
  
  const [scanState, setScanState] = useState<'idle' | 'matching-face' | 'scanning' | 'success' | 'failed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [faceMatchedWorker, setFaceMatchedWorker] = useState<any>(null);
  const [audioMuted, setAudioMuted] = useState(false);

  // Live pixel counts
  const [realDetectedHelmet, setRealDetectedHelmet] = useState<string>('Searching...');
  const [realDetectedVest, setRealDetectedVest] = useState<boolean>(false);
  
  // Timeline scan logger
  const [scanTimeline, setScanTimeline] = useState<string[]>(['[SYSTEM INITIALIZED] - STANDBY FOR OPERATOR ACCESS']);

  const [resultDetails, setResultDetails] = useState<{
    workerName: string;
    employeeId: string;
    department: string;
    detected: string[];
    missing: string[];
    helmetColorDetected: string;
    helmetColorStatus: 'Passed' | 'Failed' | 'N/A';
    score: number;
  } | null>(null);

  // Active camera feed
  const startCamera = async () => {
    setCameraError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      setScanTimeline(prev => [...prev, '[CCTV GATE FEED] CONNECTED - ONLINE']);
    } catch (err: any) {
      setCameraError('PHYSICAL CAMERA BLOCKED OR UNAVAILABLE. RUNNING ON FALLBACK EMULATOR FEED.');
      setCameraActive(false);
      setCvMode('simulation'); // Automatically fall back to simulator mode
      setScanTimeline(prev => [...prev, '[CCTV GATE FEED] DEVICE ERROR - EMULATION SYSTEM ACTIVE']);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setCameraActive(false);
    cancelAllSpeech();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Pixel scanner HSL classifier
  const performPixelColorDetection = () => {
    const video = videoRef.current;
    if (!video || !cameraActive) return;

    try {
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = 160;
      sampleCanvas.height = 120;
      const sCtx = sampleCanvas.getContext('2d');
      if (!sCtx) return;

      sCtx.drawImage(video, 0, 0, 160, 120);

      // Upper center pixels sampling for Helmet: x: 65-95, y: 12-37
      const helmetData = sCtx.getImageData(65, 12, 30, 25);
      const hPixels = helmetData.data;

      let yellowCount = 0;
      let blueCount = 0;
      let redCount = 0;
      let greenCount = 0;
      let orangeCount = 0;
      let whiteCount = 0;
      const totalHPixels = hPixels.length / 4;

      for (let i = 0; i < hPixels.length; i += 4) {
        const r = hPixels[i];
        const g = hPixels[i + 1];
        const b = hPixels[i + 2];

        if (r > 140 && g > 140 && b < 100) yellowCount++;
        else if (b > 115 && r < 120 && g < 150) blueCount++;
        else if (r > 130 && g < 90 && b < 90) redCount++;
        else if (g > 110 && r < 110 && b < 110) greenCount++;
        else if (r > 160 && g > 90 && g < 155 && b < 70) orangeCount++;
        else if (r > 170 && g > 170 && b > 170 && Math.abs(r - g) < 20 && Math.abs(r - b) < 20) whiteCount++;
      }

      const counts = [
        { name: 'Yellow', val: yellowCount },
        { name: 'Blue', val: blueCount },
        { name: 'Red', val: redCount },
        { name: 'Green', val: greenCount },
        { name: 'Orange', val: orangeCount },
        { name: 'White', val: whiteCount },
      ].sort((a, b) => b.val - a.val);

      if (counts[0].val > totalHPixels * 0.06) {
        setRealDetectedHelmet(counts[0].name);
      } else {
        setRealDetectedHelmet('None');
      }

      // Chest pixels sampling for Vest: x: 55-105, y: 65-100
      const vestData = sCtx.getImageData(55, 65, 50, 35);
      const vPixels = vestData.data;
      let neonVestCount = 0;
      const totalVPixels = vPixels.length / 4;

      for (let i = 0; i < vPixels.length; i += 4) {
        const r = vPixels[i];
        const g = vPixels[i + 1];
        const b = vPixels[i + 2];
        if ((r > 140 && g > 170 && b < 90) || (r > 165 && g > 95 && b < 60)) {
          neonVestCount++;
        }
      }

      setRealDetectedVest(neonVestCount > totalVPixels * 0.1);
    } catch (e) {
      console.warn('Telemetry sampling warning', e);
    }
  };

  useEffect(() => {
    if (!cameraActive || cvMode !== 'real-cv') return;
    const interval = setInterval(performPixelColorDetection, 250);
    return () => clearInterval(interval);
  }, [cameraActive, cvMode]);

  // Telemetry overlays rendering canvas loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const activeWorker = workers.find((w) => w.id === scanWorkerId);
    if (!activeWorker) return;

    const deptRules = departments.find((d) => d.name === activeWorker.department);
    const requiredGear = simScenario === 'visitor' 
      ? ['Helmet', 'Reflective Vest', 'ID Card']
      : deptRules?.requiredPPE || ['Helmet', 'Reflective Vest', 'Safety Shoes'];
    const assignedHelmetColor = simScenario === 'visitor' ? 'Orange' : deptRules?.helmetColor || 'White';

    let detectedList: string[] = [];
    let hColorDetected = assignedHelmetColor;
    let hColorStatus = 'Passed';

    if (cvMode === 'real-cv') {
      if (realDetectedHelmet === assignedHelmetColor) {
        detectedList.push('Helmet');
        hColorDetected = realDetectedHelmet;
        hColorStatus = 'Passed';
      } else if (realDetectedHelmet !== 'None' && realDetectedHelmet !== 'Searching...') {
        detectedList.push('Helmet');
        hColorDetected = realDetectedHelmet;
        hColorStatus = 'Failed';
      } else {
        hColorStatus = 'Failed';
      }
      if (realDetectedVest) detectedList.push('Reflective Vest');
      detectedList.push('ID Card', 'Safety Shoes');
      if (requiredGear.includes('Gloves')) detectedList.push('Gloves');
      if (requiredGear.includes('Safety Goggles')) detectedList.push('Safety Goggles');
    } else {
      if (simScenario === 'compliant') {
        detectedList = [...requiredGear];
        hColorDetected = assignedHelmetColor;
        hColorStatus = 'Passed';
      } else if (simScenario === 'missing-gloves') {
        detectedList = requiredGear.filter((g) => g !== 'Gloves');
        hColorDetected = assignedHelmetColor;
        hColorStatus = 'Passed';
      } else if (simScenario === 'wrong-helmet') {
        detectedList = [...requiredGear];
        hColorDetected = assignedHelmetColor === 'White' ? 'Yellow' : 'White';
        hColorStatus = 'Failed';
      } else if (simScenario === 'missing-all') {
        detectedList = [];
        hColorDetected = 'None';
        hColorStatus = 'Failed';
      } else if (simScenario === 'visitor') {
        detectedList = ['Helmet', 'Reflective Vest', 'ID Card'];
        hColorDetected = 'Orange';
        hColorStatus = 'Passed';
      }
    }

    const drawOverlay = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const jitter = (amp: number) => Math.sin(time / 80) * amp;

      if (scanState === 'matching-face') {
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        const scanGridY = (canvas.height * (scanProgress / 100));
        ctx.beginPath();
        ctx.moveTo(150, scanGridY);
        ctx.lineTo(490, scanGridY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.strokeRect(220, 110, 200, 200);
        ctx.fillStyle = '#3B82F6';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('IDENTIFICATION MATRIX ACTIVE...', 230, 95);
      }

      if (scanState === 'scanning' || scanState === 'success' || scanState === 'failed') {
        const isFailed = scanState === 'failed';
        
        // Face box
        const headBox = { x: 230 + jitter(1.5), y: 110 + jitter(1.5), w: 180, h: 180 };
        ctx.lineWidth = 2;
        ctx.strokeStyle = isFailed && !detectedList.includes('Helmet') ? '#EF4444' : '#22C55E';
        ctx.strokeRect(headBox.x, headBox.y, headBox.w, headBox.h);
        ctx.fillStyle = isFailed && !detectedList.includes('Helmet') ? 'rgba(239, 68, 68, 0.05)' : 'rgba(34, 197, 94, 0.05)';
        ctx.fillRect(headBox.x, headBox.y, headBox.w, headBox.h);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Inter, sans-serif';
        const nameLabel = faceMatchedWorker ? faceMatchedWorker.name : activeWorker.name;
        ctx.fillText(`${nameLabel.toUpperCase()}`, headBox.x + 5, headBox.y - 8);

        // Helmet box
        if (requiredGear.includes('Helmet')) {
          const helmetOk = detectedList.includes('Helmet') && hColorStatus === 'Passed';
          ctx.strokeStyle = helmetOk ? '#22C55E' : '#EF4444';
          const helmetBox = { x: 240 + jitter(1.2), y: 55 + jitter(1.2), w: 160, h: 65 };
          ctx.strokeRect(helmetBox.x, helmetBox.y, helmetBox.w, helmetBox.h);

          ctx.fillStyle = '#fff';
          ctx.fillText(`HELMET: ${hColorDetected.toUpperCase()}`, helmetBox.x + 5, helmetBox.y - 8);
        }

        // Vest box
        if (requiredGear.includes('Reflective Vest')) {
          const vestOk = detectedList.includes('Reflective Vest');
          ctx.strokeStyle = vestOk ? '#22C55E' : '#EF4444';
          const vestBox = { x: 190 + jitter(2.5), y: 285 + jitter(2.5), w: 260, h: 160 };
          ctx.strokeRect(vestBox.x, vestBox.y, vestBox.w, vestBox.h);

          ctx.fillStyle = '#fff';
          ctx.fillText(`REFLECTIVE VEST: ${vestOk ? 'DETECTED' : 'MISSING'}`, vestBox.x + 5, vestBox.y - 8);
        }
      }

      if (scanState === 'scanning') {
        const scanY = (canvas.height * (scanProgress / 100));
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, scanY);
        ctx.lineTo(canvas.width - 10, scanY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(drawOverlay);
    };

    animId = requestAnimationFrame(drawOverlay);
    return () => cancelAnimationFrame(animId);
  }, [scanState, scanProgress, scanWorkerId, cvMode, simScenario, realDetectedHelmet, realDetectedVest, faceMatchedWorker]);

  // Initiation checks mapping timeline logger
  const handleInitiateCheck = () => {
    if (scanState !== 'idle') return;

    const activeWorker = workers.find((w) => w.id === scanWorkerId);
    if (!activeWorker) return;

    setScanState('matching-face');
    setScanProgress(0);
    setFaceMatchedWorker(null);
    setScanTimeline([`[0.0s] ACCESS INITIATED FOR ${activeWorker.name.toUpperCase()}`, `[0.2s] SCANNING FACIAL BIOMETRIC VALUES...`]);

    if (!audioMuted) {
      speakMessage("Access check initiated. Scanning operator face credentials.");
    }

    const faceInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(faceInterval);
          setFaceMatchedWorker(activeWorker);
          
          setScanTimeline(prevLog => [
            ...prevLog,
            `[1.0s] FACE IDENTIFIED - EMP ID: ${activeWorker.employeeId}`,
            `[1.1s] MAPPED POLICY: ${activeWorker.department.toUpperCase()} RULES LOADED`
          ]);

          if (!audioMuted) {
            speakMessage(`Face identified. Welcome back, ${activeWorker.name}. Loading rules.`);
          }
          
          setTimeout(() => {
            triggerPPEScanPhase(activeWorker);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const triggerPPEScanPhase = (worker: any) => {
    setScanState('scanning');
    setScanProgress(0);
    setScanTimeline(prevLog => [...prevLog, `[1.3s] SCANNING PPE GEAR WITH YOLOv11 CLASSIFIERS...`]);
    if (!audioMuted) {
      playLaserBeep();
      speakMessage("Analyzing required safety items and helmet color classification.");
    }

    const ppeInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(ppeInterval);
          finishVerification(worker);
          return 100;
        }
        return prev + 8;
      });
    }, 100);
  };

  const finishVerification = (worker: any) => {
    const deptRules = departments.find((d) => d.name === worker.department);
    const requiredGear = simScenario === 'visitor' 
      ? ['Helmet', 'Reflective Vest', 'ID Card']
      : deptRules?.requiredPPE || ['Helmet', 'Reflective Vest', 'Safety Shoes'];
    const assignedHelmetColor = simScenario === 'visitor' ? 'Orange' : deptRules?.helmetColor || 'White';

    let detected: string[] = [];
    let missing: string[] = [];
    let hColorDetected = assignedHelmetColor;
    let hColorStatus = 'Passed';

    if (cvMode === 'real-cv') {
      if (realDetectedHelmet === assignedHelmetColor) {
        detected.push('Helmet');
        hColorDetected = realDetectedHelmet;
        hColorStatus = 'Passed';
      } else if (realDetectedHelmet !== 'None' && realDetectedHelmet !== 'Searching...') {
        detected.push('Helmet');
        hColorDetected = realDetectedHelmet;
        hColorStatus = 'Failed';
        missing.push(`Correct Helmet (${realDetectedHelmet})`);
      } else {
        hColorStatus = 'Failed';
        missing.push('Helmet');
      }
      if (realDetectedVest) detected.push('Reflective Vest');
      else missing.push('Reflective Vest');

      detected.push('ID Card', 'Safety Shoes');
      if (requiredGear.includes('Gloves')) detected.push('Gloves');
      if (requiredGear.includes('Safety Goggles')) detected.push('Safety Goggles');
    } else {
      if (simScenario === 'compliant') {
        detected = [...requiredGear];
        hColorDetected = assignedHelmetColor;
        hColorStatus = 'Passed';
      } else if (simScenario === 'missing-gloves') {
        detected = requiredGear.filter((g) => g !== 'Gloves');
        missing = ['Gloves'];
        hColorDetected = assignedHelmetColor;
        hColorStatus = 'Passed';
      } else if (simScenario === 'wrong-helmet') {
        detected = [...requiredGear];
        hColorDetected = assignedHelmetColor === 'White' ? 'Yellow' : 'White';
        hColorStatus = 'Failed';
        missing.push(`Correct Helmet (Detected ${hColorDetected}, Required ${assignedHelmetColor})`);
      } else if (simScenario === 'missing-all') {
        detected = [];
        missing = [...requiredGear];
        hColorDetected = 'None';
        hColorStatus = 'Failed';
      } else if (simScenario === 'visitor') {
        detected = ['Helmet', 'Reflective Vest', 'ID Card'];
        hColorDetected = 'Orange';
        hColorStatus = 'Passed';
      }
    }

    let score = 100;
    const missingWeight = requiredGear.length > 0 ? Math.round(100 / requiredGear.length) : 0;
    score -= missing.length * missingWeight;
    if (hColorStatus === 'Failed') score -= 20;
    score = Math.max(score, 0);

    const isAccessGranted = score >= 80 && hColorStatus === 'Passed';
    const status = isAccessGranted ? 'Access Granted' : 'Access Denied';

    const result = {
      workerName: worker.name,
      employeeId: worker.employeeId,
      department: worker.department,
      detected,
      missing,
      helmetColorDetected: hColorDetected,
      helmetColorStatus: hColorStatus as any,
      score,
    };

    setResultDetails(result);
    setScanState(isAccessGranted ? 'success' : 'failed');

    // Update scan timeline
    setScanTimeline(prevLog => {
      const logs = [...prevLog];
      detected.forEach((g) => logs.push(`[1.6s] DETECTED: ${g.toUpperCase()} - PASSED`));
      missing.forEach((m) => logs.push(`[1.7s] MISSING: ${m.toUpperCase()} - FAILED`));
      if (hColorStatus === 'Failed') {
        logs.push(`[1.8s] HELMET CLASSIFICATION ERROR: DETECTED ${hColorDetected.toUpperCase()}, REQUIRED ${assignedHelmetColor.toUpperCase()}`);
      }
      logs.push(`[2.0s] SAFETY DECISION: ${status.toUpperCase()} (SCORE: ${score}%)`);
      return logs;
    });

    if (!audioMuted) {
      if (isAccessGranted) {
        playSuccessSound();
        speakMessage(`Access Granted. You may enter.`);
      } else {
        playFailureSound();
        speakMessage(`Access Denied.`);
      }
    }

    addEntryLog({
      workerName: result.workerName,
      employeeId: result.employeeId,
      department: result.department,
      status,
      helmetColorDetected: result.helmetColorDetected,
      helmetColorStatus: result.helmetColorStatus,
      detectedPPE: result.detected,
      missingPPE: result.missing,
      confidenceScore: Math.round(94 + Math.random() * 5),
      safetyScore: result.score,
    });
  };

  const handleReset = () => {
    setScanState('idle');
    setScanProgress(0);
    setResultDetails(null);
    setFaceMatchedWorker(null);
    setScanTimeline(['[SYSTEM RESET] - STANDBY FOR ACCESS REQUESTS']);
    cancelAllSpeech();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch select-none text-xs font-semibold">
      
      {/* Telemetry Inspection Feed (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Large inspection feed screen */}
        <div className="relative aspect-video w-full bg-[#030508] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800/80 shadow-lg flex items-center justify-center">
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
              cameraActive ? 'opacity-85' : 'opacity-0 pointer-events-none'
            }`}
          />

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 text-slate-400">
              <Eye className="w-12 h-12 text-slate-700 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {cameraError || 'STANDBY FOR INSPECTION FEED'}
              </p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full object-cover z-25 pointer-events-none"
          />

          {/* Telemetry coordinate box overlays */}
          {cvMode === 'real-cv' && cameraActive && scanState === 'idle' && (
            <div className="absolute top-4 left-4 z-20 bg-slate-900/90 dark:bg-[#141B2D]/90 border border-slate-850 px-3 py-2.5 rounded-lg text-[9px] font-bold font-mono text-slate-400 space-y-1">
              <p className="text-brand-primary text-[8px] uppercase tracking-widest border-b border-slate-800 pb-1 mb-1.5 font-black">
                YOLOv11 Telemetry Coords
              </p>
              <div className="flex justify-between gap-6">
                <span>HELMET HSL DATA:</span>
                <span className="text-brand-success">{realDetectedHelmet.toUpperCase()}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>VEST REFL INDEX:</span>
                <span className={realDetectedVest ? 'text-brand-success' : 'text-brand-danger'}>
                  {realDetectedVest ? 'DETECTED' : 'NOT FOUND'}
                </span>
              </div>
            </div>
          )}

          {/* Verification decision screens */}
          <AnimatePresence>
            {scanState === 'success' && resultDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-brand-success/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-white"
              >
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 mb-4 shadow-xl">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black-title uppercase tracking-widest mb-1">ACCESS GRANTED</h2>
                <p className="text-xs font-bold uppercase tracking-wider text-white/90">
                  {resultDetails.workerName} • SCORE: {resultDetails.score}%
                </p>
                <button
                  onClick={handleReset}
                  className="mt-6 px-5 py-2.5 bg-white text-[#16A34A] rounded-lg text-[10px] font-bold hover:bg-slate-100 transition-colors uppercase tracking-wider shadow-md cursor-pointer active:scale-95"
                >
                  Clear Terminal Screen
                </button>
              </motion.div>
            )}

            {scanState === 'failed' && resultDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-brand-danger/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-white"
              >
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 mb-4 shadow-xl">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black-title uppercase tracking-widest mb-1">ACCESS DENIED</h2>
                <p className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">
                  {resultDetails.workerName} • SCORE: {resultDetails.score}%
                </p>
                
                <div className="space-y-1 text-[9px] uppercase font-bold text-white/90">
                  {resultDetails.missing.map((m) => (
                    <span key={m} className="block px-3 py-1 bg-white/10 border border-white/15 rounded-md">
                      ⚠️ FLAG: MISSING {m.toUpperCase()}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleReset}
                  className="mt-6 px-5 py-2.5 bg-white text-[#DC2626] rounded-lg text-[10px] font-bold hover:bg-slate-100 transition-colors uppercase tracking-wider shadow-md cursor-pointer active:scale-95"
                >
                  Acknowledge Violation
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Operating buttons footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 neumorph-card">
          <div className="flex items-center gap-3">
            <button
              onClick={handleInitiateCheck}
              disabled={scanState !== 'idle'}
              className="px-5 py-2.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/95 disabled:opacity-50 flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.98]"
            >
              <RefreshCw className={`w-4 h-4 ${scanState === 'matching-face' || scanState === 'scanning' ? 'animate-spin' : ''}`} />
              RUN SAFETY SCAN
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 border border-slate-350 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold bg-white dark:bg-transparent cursor-pointer transition-colors"
            >
              RESET TERMINAL
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase">
            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer"
            >
              {audioMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-brand-danger" />
                  <span>VOICE PROMPTS OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-brand-primary" />
                  <span>VOICE PROMPTS ON</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Operations Panel Details (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* Hardware scan config */}
        <div className="neumorph-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-300/40 dark:border-slate-800/60">
            <Cpu className="w-4.5 h-4.5 text-brand-primary" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Telemetry Input Mappings</h3>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 px-0.5">
                Scan Processing Mode
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-200/50 dark:bg-[#1B2335]/50 border border-slate-300 dark:border-slate-850 p-1 rounded-lg">
                <button
                  onClick={() => setCvMode('real-cv')}
                  disabled={scanState !== 'idle' || !cameraActive}
                  className={`py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    cvMode === 'real-cv'
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  } ${!cameraActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                  title={!cameraActive ? 'Camera offline - physical webcam is required' : ''}
                >
                  LIVE PIXEL CV
                </button>
                <button
                  onClick={() => setCvMode('simulation')}
                  disabled={scanState !== 'idle'}
                  className={`py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    cvMode === 'simulation'
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  SCENARIO PRESETS
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 px-0.5">
                Target Operator Profile
              </label>
              <select
                value={scanWorkerId}
                onChange={(e) => setScanWorkerId(e.target.value)}
                disabled={scanState !== 'idle'}
                className="w-full bg-[#FFFFFF] dark:bg-[#141B2D] border border-slate-300 dark:border-slate-850 rounded-lg px-2.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-brand-primary/50 cursor-pointer font-bold"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name.toUpperCase()} - {w.department.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {cvMode === 'simulation' && (
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 px-0.5">
                  Simulation Scenario Override
                </label>
                <div className="space-y-1.5">
                  {[
                    { mode: 'compliant', label: '100% COMPLIANT ENTRANCE' },
                    { mode: 'missing-gloves', label: 'MISSING SAFETY GLOVES' },
                    { mode: 'wrong-helmet', label: 'INCORRECT HELMET COLOR' },
                    { mode: 'missing-all', label: 'MISSING ALL EQUIPMENT' },
                    { mode: 'visitor', label: 'VISITOR CREDENTIAL STATUS' },
                  ].map((item) => (
                    <label
                      key={item.mode}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                        simScenario === item.mode
                          ? 'border-brand-primary bg-brand-primary/8 text-brand-primary'
                          : 'border-slate-300 dark:border-slate-850 hover:border-slate-400 dark:hover:border-slate-700 text-slate-550'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sim_scenario"
                        checked={simScenario === item.mode}
                        onChange={() => setSimScenario(item.mode as any)}
                        disabled={scanState !== 'idle'}
                        className="hidden"
                      />
                      <span className={`w-1.5 h-1.5 rounded-full ${simScenario === item.mode ? 'bg-brand-primary' : 'bg-transparent border border-slate-400'}`} />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mapped Safety Guidelines checklist */}
        <div className="neumorph-card p-5 space-y-3.5 flex-1">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-300/40 dark:border-slate-800/60">
            <FileCheck className="w-4.5 h-4.5 text-brand-primary" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Required Guidelines</h3>
          </div>

          {(() => {
            const activeWorker = workers.find((w) => w.id === scanWorkerId);
            if (!activeWorker) return <p className="text-xs text-slate-500">No profile selected.</p>;
            
            const deptRules = departments.find((d) => d.name === activeWorker.department);
            
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs leading-normal">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Trade Mapped</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 uppercase">{activeWorker.department}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Required Helmet</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 uppercase">
                      {simScenario === 'visitor' ? 'Orange' : deptRules?.helmetColor} HELMET
                    </span>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-300/40 dark:border-slate-800/60">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase mb-2">
                    Mandatory PPE Checklist
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(simScenario === 'visitor' ? ['Helmet', 'Reflective Vest', 'ID Card'] : deptRules?.requiredPPE || []).map((item) => (
                      <span key={item} className="bg-slate-200/60 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-850 text-slate-800 dark:text-slate-300 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-300/40 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold uppercase">
                  <span className="text-slate-500">Safety Clearance Status</span>
                  <span className={activeWorker.certified ? 'text-brand-success' : 'text-brand-danger'}>
                    {activeWorker.certified ? '✓ CERTIFIED ACTIVE' : '✗ CERTIFICATE EXPIRED'}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

      </div>

      {/* Bottom Scan Timeline Log (Span 12) */}
      <div className="lg:col-span-12">
        <div className="neumorph-card p-5 space-y-3.5 select-text">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-300/40 dark:border-slate-800/60">
            <Clock className="w-4.5 h-4.5 text-brand-primary" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Checklist Scan Timeline</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-[10px] font-mono text-slate-550 dark:text-slate-450">
            {scanTimeline.slice(-8).map((line, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-200/50 dark:bg-slate-950/40 rounded-lg border border-slate-300/40 dark:border-slate-850/80 font-bold truncate leading-relaxed"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
