import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  ChevronRight,
  Check,
  X,
  Laptop,
  Globe,
  ArrowUpRight,
  Sun,
  Moon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const useCases = [
    'Construction Sites',
    'Infrastructure Projects',
    'Industrial Plants',
    'Warehouses',
    'Manufacturing Facilities',
    'Mining Operations',
  ];

  // Animation variants for standard entry transitions
  const cardHover = {
    hover: {
      y: -5,
      scale: 1.015,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] flex flex-col transition-colors duration-250 select-none">
      
      {/* Clean Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5.5 h-5.5 text-brand-primary" />
            <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">
              SafeSite AI
            </span>
          </div>

          {/* Links for business users */}
          <div className="hidden md:flex items-center gap-8 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-brand-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-primary transition-colors">How It Works</a>
            <a href="#why-safesite" className="hover:text-brand-primary transition-colors">Why SafeSite</a>
            <a href="#use-cases" className="hover:text-brand-primary transition-colors">Use Cases</a>
            <a href="#about" className="hover:text-brand-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-brand-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Light/Dark mode toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-slate-250 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1B2335] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer mr-1"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-brand-warning animate-pulse" />
              ) : (
                <Moon className="w-4 h-4 text-brand-primary" />
              )}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-4.5 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/95 transition-colors shadow-md cursor-pointer"
            >
              Launch Platform
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Copy (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-6 space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200/50 dark:bg-brand-primary/10 border border-slate-300 dark:border-brand-primary/15 rounded-md text-[9px] font-extrabold text-brand-primary uppercase tracking-widest">
            🛡️ Zero-Harm Site Entrance Security
          </div>
          
          <h1 className="text-[44px] sm:text-[56px] font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase">
            Construction Safety,<br />
            Powered by AI.
          </h1>
          
          <p className="text-slate-655 dark:text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
            Verify PPE compliance, identify workers, and automate site entry using nothing more than a laptop camera.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer active:scale-98"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="px-5 py-3.5 border border-slate-350 dark:border-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg text-xs font-bold transition-colors bg-white dark:bg-transparent"
            >
              Watch Demo
            </a>
          </div>
        </motion.div>

        {/* Right Preview Illustration Mockup (6 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-6"
        >
          <div className="neumorph-card p-4.5 bg-white dark:bg-[#141B2D] border border-slate-300/40 dark:border-slate-855 rounded-xl relative overflow-hidden shadow-xl max-w-lg mx-auto">
            
            {/* Terminal Screen Mockup Frame */}
            <div className="bg-[#030508] aspect-video w-full rounded-lg relative border border-slate-350 dark:border-slate-850 overflow-hidden flex flex-col justify-between p-4">
              
              {/* Scan Telemetry overlay mock */}
              <div className="flex justify-between items-start">
                <div className="bg-slate-900/80 px-2 py-1.5 border border-slate-800 rounded text-[8px] font-mono text-slate-400 space-y-0.5">
                  <p>FEED: CONNECTED</p>
                  <p className="text-brand-success font-bold animate-pulse">SCANNING COMPLIANCE...</p>
                </div>
                <span className="text-[8px] bg-brand-danger text-white px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  Gate 1 Camera
                </span>
              </div>

              {/* Bounding Box graphic over placeholder face */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border border-brand-success w-36 h-36 relative bg-brand-success/5 rounded">
                  <span className="absolute top-1 left-1 text-[7px] text-white bg-brand-success px-1 py-0.5 rounded font-mono font-bold uppercase">
                    Helmet: OK
                  </span>
                  <span className="absolute bottom-1 left-1 text-[7px] text-white bg-brand-success px-1 py-0.5 rounded font-mono font-bold uppercase">
                    Safety Vest: OK
                  </span>
                </div>
              </div>

              {/* Bottom granted alert */}
              <div className="w-full bg-[#16A34A] border border-brand-success/30 px-3 py-1.5 rounded-md flex items-center justify-between text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                <span>Verification Granted</span>
                <span>Access Allowed</span>
              </div>

            </div>

            {/* Laptop border line */}
            <div className="w-full bg-slate-200 dark:bg-slate-850 h-3 rounded-b-md mt-2" />
            <div className="w-24 bg-slate-300 dark:bg-slate-800 h-1 rounded-b-md mx-auto" />

          </div>
        </motion.div>

      </section>

      {/* 3. Problem Section */}
      <section className="border-t border-slate-200 dark:border-slate-800/80 py-16 bg-slate-100/60 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto w-full px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Construction Sites Still Rely on Manual Safety Checks
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-500 max-w-xl mx-auto font-medium">
              Manual inspection models are no longer sufficient to enforce secure Zero-Harm parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-6 space-y-3.5 bg-white dark:bg-[#141B2D]/40"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center">
                <X className="w-4.5 h-4.5 text-brand-danger" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Manual Inspection</h3>
              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li>• Extremely time-consuming</li>
                <li>• Vulnerable to human oversight</li>
                <li>• Inconsistent regulation enforcement</li>
              </ul>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-6 space-y-3.5 bg-white dark:bg-[#141B2D]/40"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center">
                <X className="w-4.5 h-4.5 text-brand-danger" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Missing PPE</h3>
              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li>• Unsafe field area entry</li>
                <li>• Increased risk of accidents</li>
                <li>• Difficult to trace or monitor</li>
              </ul>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-6 space-y-3.5 bg-white dark:bg-[#141B2D]/40"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center">
                <X className="w-4.5 h-4.5 text-brand-danger" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Paper Records</h3>
              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li>• Tedious to audit or review</li>
                <li>• No real-time compliance visibility</li>
                <li>• Fragmented reporting cycles</li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. Solution Section */}
      <section className="border-t border-slate-200 dark:border-slate-800/80 py-16 bg-white dark:bg-transparent">
        <div className="max-w-5xl mx-auto w-full px-6 space-y-10 text-center">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              One Platform. Safer Construction Sites.
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="max-w-3xl mx-auto neumorph-card p-8 bg-white dark:bg-[#141B2D] space-y-6"
          >
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-350 leading-relaxed font-bold uppercase tracking-wide">
              Workers stand in front of a laptop camera.
            </p>
            <p className="text-sm md:text-base text-brand-primary leading-relaxed font-black uppercase tracking-wide">
              SafeSite AI checks required safety equipment, verifies the correct helmet color, and grants or denies access in seconds.
            </p>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-350 leading-relaxed font-bold uppercase tracking-wide">
              Every inspection is automatically recorded, making compliance simple and transparent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="border-t border-slate-200 dark:border-slate-800/80 py-16 bg-slate-100/60 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto w-full px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              How It Works
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-500 max-w-xl mx-auto font-medium">
              Seamless gate inspection sequence completed in less than three seconds.
            </p>
          </div>

          {/* Horizontal timeline flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-4 text-center space-y-2 bg-white dark:bg-[#141B2D]/40"
            >
              <span className="text-sm font-black text-brand-primary">1</span>
              <p className="text-xs font-bold uppercase text-slate-805 dark:text-white">Worker Arrives</p>
              <p className="text-[10px] text-slate-500 leading-normal">Operator approaches the safety checkpoint gate.</p>
            </motion.div>

            <div className="hidden md:flex justify-center">
              <ChevronRight className="w-5 h-5 text-slate-450 animate-pulse" />
            </div>

            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-4 text-center space-y-2 bg-white dark:bg-[#141B2D]/40"
            >
              <span className="text-sm font-black text-brand-primary">2</span>
              <p className="text-xs font-bold uppercase text-slate-805 dark:text-white">Laptop Camera</p>
              <p className="text-[10px] text-slate-500 leading-normal">Laptop camera captures video feeds at site access entrance.</p>
            </motion.div>

            <div className="hidden md:flex justify-center">
              <ChevronRight className="w-5 h-5 text-slate-450 animate-pulse" />
            </div>

            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-4 text-center space-y-2 bg-white dark:bg-[#141B2D]/40"
            >
              <span className="text-sm font-black text-brand-primary">3</span>
              <p className="text-xs font-bold uppercase text-slate-805 dark:text-white">AI Safety Check</p>
              <p className="text-[10px] text-slate-500 leading-normal">System verifies compliance and correct helmet color mapping.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. Features Section */}
      <section id="features" className="border-t border-slate-200 dark:border-slate-800/80 py-16 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto w-full px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Essential Safety Features
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-500 max-w-xl mx-auto font-medium">
              Simplifying security management across all projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-5.5 space-y-2.5 bg-white dark:bg-[#141B2D]"
            >
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">PPE Detection</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Automatically verifies required safety equipment such as helmets, shoes, and safety goggles.
              </p>
            </motion.div>

            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-5.5 space-y-2.5 bg-white dark:bg-[#141B2D]"
            >
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Helmet Color Verification</h3>
              <p className="text-xs text-slate-550 leading-normal font-medium">
                Ensures the correct helmet color is worn to match the worker's operational role.
              </p>
            </motion.div>

            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-5.5 space-y-2.5 bg-white dark:bg-[#141B2D]"
            >
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Smart Entry Approval</h3>
              <p className="text-xs text-slate-550 leading-normal font-medium">
                Denies entrance to non-compliant operators, preventing site gate crossings.
              </p>
            </motion.div>

            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-5.5 space-y-2.5 bg-white dark:bg-[#141B2D]"
            >
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Digital Compliance Records</h3>
              <p className="text-xs text-slate-550 leading-normal font-medium">
                Logs every inspection secure file entry dynamically, making audits simple and transparent.
              </p>
            </motion.div>

            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-5.5 space-y-2.5 bg-white dark:bg-[#141B2D]"
            >
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Safety Analytics</h3>
              <p className="text-xs text-slate-550 leading-normal font-medium">
                Track compliance indices, identify repeat violations, and download CSV log tables.
              </p>
            </motion.div>

            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-5.5 space-y-2.5 bg-white dark:bg-[#141B2D]"
            >
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Voice Guidance</h3>
              <p className="text-xs text-slate-550 leading-normal font-medium">
                Provides vocal speech prompts and chimes during safety check procedures.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. Why SafeSite AI Section */}
      <section id="why-safesite" className="border-t border-slate-200 dark:border-slate-800/80 py-16 bg-slate-100/60 dark:bg-slate-950/20">
        <div className="max-w-4xl mx-auto w-full px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Why SafeSite AI
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-500 max-w-xl mx-auto font-medium">
              Comparison between traditional workflows and automated gates checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Traditional */}
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-6 bg-white dark:bg-[#141B2D]/40 space-y-4"
            >
              <h3 className="text-xs font-bold text-brand-danger uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-800">
                Traditional Method
              </h3>
              <ul className="space-y-3 text-xs font-semibold text-slate-500">
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-brand-danger shrink-0" />
                  <span>Manual inspection checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-brand-danger shrink-0" />
                  <span>Paper ledger records</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-brand-danger shrink-0" />
                  <span>Human oversight error risk</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-brand-danger shrink-0" />
                  <span>Slow gate check-in line lines</span>
                </li>
              </ul>
            </motion.div>

            {/* SafeSite AI */}
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="neumorph-card p-6 bg-white dark:bg-[#141B2D] space-y-4"
            >
              <h3 className="text-xs font-bold text-brand-success uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-800">
                SafeSite AI
              </h3>
              <ul className="space-y-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-success shrink-0" />
                  <span>Automated inspection checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-success shrink-0" />
                  <span>Persistent digital databases</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-success shrink-0" />
                  <span>Consistent criteria checking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-success shrink-0" />
                  <span>Faster gate entry pipelines</span>
                </li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 8. Use Cases */}
      <section id="use-cases" className="border-t border-slate-200 dark:border-slate-800/80 py-16 bg-white dark:bg-transparent">
        <div className="max-w-5xl mx-auto w-full px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Operational Use Cases
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-500 max-w-xl mx-auto font-medium">
              Applicable environments enforcing industrial compliance parameters.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {useCases.map((useCase) => (
              <motion.div
                key={useCase}
                whileHover={{ scale: 1.03, y: -2 }}
                className="p-4 neumorph-card text-center flex items-center justify-center min-h-[80px] bg-slate-200/30 dark:bg-slate-950/20"
              >
                <p className="text-[10px] font-black uppercase text-slate-700 dark:text-white leading-relaxed">{useCase}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. About SafeSite AI */}
      <section id="about" className="border-t border-slate-200 dark:border-slate-800/80 py-16 bg-slate-100/60 dark:bg-slate-950/20">
        <div className="max-w-4xl mx-auto w-full px-6 text-center space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              About SafeSite AI
            </h2>
          </div>

          <p className="text-slate-655 dark:text-slate-350 text-sm sm:text-base leading-relaxed font-bold max-w-3xl mx-auto uppercase">
            SafeSite AI helps organizations improve workplace safety by automating PPE verification and site access. Designed for modern construction teams, it simplifies safety compliance while reducing manual inspections.
          </p>
        </div>
      </section>

      {/* 10. Contact Developer */}
      <section id="contact" className="border-t border-slate-200 dark:border-slate-800/80 py-16 bg-white dark:bg-transparent">
        <div className="max-w-4xl mx-auto w-full px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Contact Developer
            </h2>
            <p className="text-xs text-slate-555 dark:text-slate-500 max-w-xl mx-auto font-medium">
              Product engineer behind SafeSite AI.
            </p>
          </div>

          <motion.div
            variants={cardHover}
            whileHover="hover"
            className="max-w-lg mx-auto neumorph-card p-6.5 bg-white dark:bg-[#141B2D] space-y-6 text-xs font-semibold relative overflow-hidden"
          >
            {/* Header profile design */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-200 dark:border-slate-800/60">
              
              <div className="w-16 h-16 bg-brand-primary/10 border border-brand-primary/25 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                <Laptop className="w-7 h-7 text-brand-primary animate-pulse" />
              </div>

              <div className="text-center sm:text-left space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight uppercase">
                  Nishant Kumar
                </h3>
                <p className="text-[10px] text-brand-primary uppercase tracking-widest font-black">
                  Full Stack Developer
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  Specializing in low-latency Web apps & telemetry systems
                </p>
              </div>

            </div>

            {/* Profile Bio & Skill Tags */}
            <div className="space-y-4">
              <p className="text-slate-655 dark:text-slate-400 text-xs leading-relaxed font-medium text-center sm:text-left">
                Passionate engineer building high-performance web systems, client-side computer vision heuristics, type-safe full-stack platforms, and high-density HMI dashboard interfaces.
              </p>
              
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {['React.js', 'TypeScript', 'Tailwind v4', 'Node.js', 'Web Audio API', 'Web Speech API'].map((skill) => (
                  <span
                    key={skill}
                    className="bg-slate-200/60 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-850 text-slate-850 dark:text-slate-350 text-[9px] font-black uppercase px-2.5 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile Links */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-200 dark:border-slate-800/60 pt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 border border-slate-300 dark:border-slate-855 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1B2335] text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[10px] uppercase font-bold text-center"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/nishant-kumar-a166a3305"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 border border-slate-300 dark:border-slate-855 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1B2335] text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[10px] uppercase font-bold text-center"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                LinkedIn
              </a>
              <a
                href="https://my-portfolio-nishant.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 border border-slate-300 dark:border-slate-855 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1B2335] text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[10px] uppercase font-bold text-center"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-brand-primary" />
                Portfolio
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 bg-white dark:bg-[#0F172A] mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-primary" />
              <span className="text-xs font-black uppercase text-slate-900 dark:text-white">SafeSite AI</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Enterprise Construction Safety Platform
            </p>
          </div>

          <div className="md:col-span-6 flex flex-wrap justify-start md:justify-end gap-6 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2">
            <a href="#features" className="hover:text-brand-primary">Features</a>
            <a href="#how-it-works" className="hover:text-brand-primary">How It Works</a>
            <a href="#contact" className="hover:text-brand-primary">Contact</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-primary">GitHub</a>
            <a href="https://www.linkedin.com/in/nishant-kumar-a166a3305" target="_blank" rel="noreferrer" className="hover:text-brand-primary">LinkedIn</a>
            <a href="https://my-portfolio-nishant.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-brand-primary">Portfolio</a>
          </div>

          <div className="col-span-12 text-center text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase border-t border-slate-200 dark:border-slate-850/80 pt-6 mt-4">
            <p>© 2026 SafeSite AI. All rights reserved under global safety guidelines.</p>
          </div>

        </div>
      </footer>

    </div>
  );
};
