import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Apple, 
  User, 
  Check, 
  AlertCircle, 
  ChevronRight, 
  Share2, 
  Smartphone, 
  Sliders, 
  Download, 
  Sparkles, 
  RotateCcw, 
  CheckCircle,
  HelpCircle,
  Send,
  Zap,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Battery from './components/Battery';

type Step = 'landing' | 'verifying' | 'action_required' | 'offers_tasks' | 'premium_customizer';

interface GradientPreset {
  name: string;
  start: string;
  end: string;
  glow: string;
}

const PRESETS: GradientPreset[] = [
  { name: 'Solar Lime ☀️', start: '#22c55e', end: '#eab308', glow: 'rgba(34, 197, 94, 0.4)' },
  { name: 'Cyberpunk 👾', start: '#a855f7', end: '#ec4899', glow: 'rgba(168, 85, 247, 0.4)' },
  { name: 'Cosmic Blue 🌌', start: '#06b6d4', end: '#2563eb', glow: 'rgba(6, 182, 212, 0.4)' },
  { name: 'Northern Lights 💚', start: '#10b981', end: '#06b6d4', glow: 'rgba(16, 185, 129, 0.4)' },
  { name: 'Neon Flame 🔥', start: '#f97316', end: '#ef4444', glow: 'rgba(249, 115, 22, 0.4)' },
  { name: 'Orchid Violet 🌸', start: '#d946ef', end: '#701a75', glow: 'rgba(217, 70, 239, 0.4)' },
];

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  
  // Verification steps status
  const [verificationProgress, setVerificationProgress] = useState(0);
  
  // Tasks interactive states
  const [surveyAnswers, setSurveyAnswers] = useState<string[]>(['', '', '']);
  const [surveyStep, setSurveyStep] = useState(0);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  
  const [sharesCount, setSharesCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [shareProgress, setShareProgress] = useState(0);

  // Unlocked customizer state
  const [selectedPreset, setSelectedPreset] = useState<GradientPreset>(PRESETS[0]);
  const [customPercentage, setCustomPercentage] = useState(85);
  const [isCharging, setIsCharging] = useState(true);
  const [customGlow, setCustomGlow] = useState(1);
  const [canvasGenerating, setCanvasGenerating] = useState(false);
  const [wallpaperGenerated, setWallpaperGenerated] = useState(false);
  const [wallpaperUrl, setWallpaperUrl] = useState('');
  const [customizerTab, setCustomizerTab] = useState<'visuals' | 'wallpaper' | 'guide'>('visuals');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-run verification animations
  useEffect(() => {
    if (step === 'verifying') {
      setVerificationProgress(0);
      const timers = [
        setTimeout(() => setVerificationProgress(1), 1800), // Step 1 completes
        setTimeout(() => setVerificationProgress(2), 3400), // Step 2 completes
        setTimeout(() => {
          setVerificationProgress(3);
          // Auto move to action required
          setTimeout(() => {
            setStep('action_required');
          }, 1500);
        }, 5500)
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [step]);

  // Survey Answer Handler
  const handleSurveyAnswer = (answer: string) => {
    const updatedAnswers = [...surveyAnswers];
    updatedAnswers[surveyStep] = answer;
    setSurveyAnswers(updatedAnswers);
    
    if (surveyStep < 2) {
      setSurveyStep(surveyStep + 1);
    } else {
      setSurveyCompleted(true);
      // Trigger small confetti
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#10b981']
      });
    }
  };

  // Mock Share Handler
  const handleShare = () => {
    if (sharesCount >= 3) return;
    setIsSharing(true);
    
    // Simulate share popup/loading
    setTimeout(() => {
      setSharesCount(prev => {
        const next = prev + 1;
        if (next === 3) {
          // Double confetti for finishing tasks
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#22c55e', '#eab308']
          });
        }
        return next;
      });
      setIsSharing(false);
    }, 1200);
  };

  // Trigger main unlocked confetti and transition
  const handleUnlockPremium = () => {
    setStep('premium_customizer');
    setTimeout(() => {
      // Big celebration confetti cascade
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: [selectedPreset.start, selectedPreset.end]
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: [selectedPreset.start, selectedPreset.end]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }, 200);
  };

  // Canvas wallpaper drawing logic
  const generateWallpaper = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCanvasGenerating(true);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-res portrait proportions (typical iPhone 15 style screen format: 1170x2532)
    const width = 1170;
    const height = 2532;
    canvas.width = width;
    canvas.height = height;

    // 1. Dark background
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, width, height);

    // 2. Add organic noise or starry mesh (optional subtle design vibes)
    // Add radial cosmic nebula at bottom
    const bottomGlow = ctx.createRadialGradient(
      width / 2, height, 10,
      width / 2, height, height * 0.4
    );
    bottomGlow.addColorStop(0, `${selectedPreset.start}22`);
    bottomGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = bottomGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Precise top-right battery status glow (iPhone specific location)
    // iPhone battery icon is at top right: around X: 1040, Y: 110
    const batteryX = width - 130;
    const batteryY = 120;
    const glowRadius = 220;

    const batteryGlow = ctx.createRadialGradient(
      batteryX, batteryY, 10,
      batteryX, batteryY, glowRadius
    );
    batteryGlow.addColorStop(0, `${selectedPreset.start}dd`);
    batteryGlow.addColorStop(0.2, `${selectedPreset.end}aa`);
    batteryGlow.addColorStop(0.5, `${selectedPreset.start}33`);
    batteryGlow.addColorStop(1, 'transparent');

    // Enable composite screen blending for vibrant neon lights
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = batteryGlow;
    ctx.beginPath();
    ctx.arc(batteryX, batteryY, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // 4. Draw micro subtle decorative elements
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle aesthetic line on top and bottom
    ctx.strokeStyle = `rgba(255, 255, 255, 0.08)`;
    ctx.beginPath();
    ctx.moveTo(width * 0.1, 70);
    ctx.lineTo(width * 0.9, 70);
    ctx.stroke();

    // 5. Draw high-res iPhone Battery preview details in top right corner (so they can see custom glow alignment!)
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    // Battery pill frame
    const bpWidth = 80;
    const bpHeight = 36;
    const bpX = width - 150;
    const bpY = 102;
    ctx.beginPath();
    ctx.roundRect(bpX, bpY, bpWidth, bpHeight, 10);
    ctx.fill();

    // Battery active level matching user percentage
    const fillWidth = (bpWidth - 8) * (customPercentage / 100);
    const fillGlow = ctx.createLinearGradient(bpX + 4, bpY + 4, bpX + 4 + fillWidth, bpY + 4);
    fillGlow.addColorStop(0, selectedPreset.start);
    fillGlow.addColorStop(1, selectedPreset.end);
    
    ctx.fillStyle = fillGlow;
    ctx.beginPath();
    ctx.roundRect(bpX + 4, bpY + 4, fillWidth, bpHeight - 8, 7);
    ctx.fill();

    // Battery terminal tip
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(bpX + bpWidth, bpY + bpHeight/2 - 6, 4, 12, 2);
    ctx.fill();

    // Done generating
    setTimeout(() => {
      setWallpaperUrl(canvas.toDataURL('image/png'));
      setWallpaperGenerated(true);
      setCanvasGenerating(false);
    }, 1000);
  };

  // Regenerate wallpaper whenever custom settings or preset changes
  useEffect(() => {
    if (step === 'premium_customizer' && customizerTab === 'wallpaper') {
      generateWallpaper();
    }
  }, [selectedPreset, customPercentage, customGlow, customizerTab, step]);

  // Reset helper
  const handleReset = () => {
    setStep('landing');
    setVerificationProgress(0);
    setSurveyAnswers(['', '', '']);
    setSurveyStep(0);
    setSurveyCompleted(false);
    setSharesCount(0);
    setShareProgress(0);
    setWallpaperGenerated(false);
  };

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 md:p-8" id="app-root-container">
      {/* Background Ambience Layout */}
      <div className="absolute inset-0 radial-glow-top-left pointer-events-none" />
      <div className="absolute inset-0 radial-glow-center pointer-events-none" />

      {/* Decorative top grid */}
      <div className="absolute top-0 inset-x-0 h-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header Logo */}
      <header className="relative flex justify-center items-center py-2 z-10" id="app-header">
        <motion.div 
          className="flex items-center gap-2 bg-neutral-900/40 border border-neutral-800/60 px-4 py-1.5 rounded-full backdrop-blur-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Apple className="w-4 h-4 text-neutral-300" />
          <span className="font-display font-semibold text-xs tracking-wider text-neutral-300 uppercase">iOS Setup</span>
          {step === 'premium_customizer' && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </motion.div>
      </header>

      {/* Primary Interaction Body */}
      <main className="flex-grow flex items-center justify-center py-8 z-10 relative" id="app-main-content">
        <div className="w-full max-w-lg mx-auto" id="app-card-wrapper">
          
          <AnimatePresence mode="wait">
            
            {/* 1. LANDING STEP */}
            {step === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-center flex flex-col items-center"
                id="step-landing"
              >
                <Battery variant="landing" percentage={80} />

                <motion.h1 
                  className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-6 mb-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  Battery Color
                </motion.h1>

                <motion.span 
                  className="font-display text-sm sm:text-base font-semibold tracking-wider text-neutral-400 uppercase bg-neutral-900/50 px-3 py-1 rounded-full border border-neutral-800/50 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Personalization Pack
                </motion.span>

                <motion.p 
                  className="text-sm sm:text-base text-neutral-400 max-w-md mx-auto leading-relaxed mb-8 px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Customize your device's Battery Color with unique animations, gradients, and glowing effects.
                </motion.p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm sm:max-w-md px-4">
                  <motion.button
                    onClick={() => setStep('verifying')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black font-semibold font-display px-6 py-4 rounded-full shadow-lg hover:bg-neutral-100 transition-all active:scale-95 cursor-pointer text-sm sm:text-base"
                    whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.15)' }}
                    id="btn-activate-ios"
                  >
                    <Apple className="w-5 h-5 fill-black" />
                    Download for iOS
                  </motion.button>

                  <motion.button
                    onClick={() => setStep('verifying')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1c1c1e] text-white border border-neutral-800 font-semibold font-display px-6 py-4 rounded-full shadow-lg hover:bg-[#2c2c2e] transition-all active:scale-95 cursor-pointer text-sm sm:text-base"
                    whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                    id="btn-activate-android"
                  >
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    Download for Android
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* 2. VERIFYING / CONNECTING STEP */}
            {step === 'verifying' && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center flex flex-col items-center justify-center w-full px-4 py-6"
                id="step-verifying"
              >
                {/* Icon with glowing green rounded frame matching reference image */}
                <motion.div 
                  className="relative mb-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-[3px] bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
                    <div className="w-full h-full bg-[#121214] rounded-[21px] flex items-center justify-center overflow-hidden relative border border-neutral-800">
                      <Battery variant="verifying" percentage={85} />
                    </div>
                  </div>
                </motion.div>

                {/* CONNECTING Title */}
                <motion.h1 
                  className="font-display text-3xl sm:text-4xl font-black tracking-[0.25em] text-white uppercase mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  CONNECTING
                </motion.h1>

                {/* Progress Bar Container */}
                <div className="w-full max-w-xs sm:max-w-sm mb-8">
                  <div className="w-full bg-[#1e2321] rounded-full h-3 p-0.5 overflow-hidden border border-emerald-900/40 shadow-inner">
                    <motion.div 
                      className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full shadow-lg shadow-emerald-500/50"
                      initial={{ width: '10%' }}
                      animate={{ 
                        width: verificationProgress === 0 ? '30%' : verificationProgress === 1 ? '70%' : '100%' 
                      }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  </div>
                </div>

                {/* Subtext Status Line matching reference image */}
                <motion.p 
                  key={verificationProgress}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-xs sm:text-sm text-neutral-400 flex items-center justify-center gap-1.5"
                >
                  <span className="text-emerald-400 font-bold">&gt;</span>{' '}
                  {verificationProgress === 0 && 'Locating compatible package on server...'}
                  {verificationProgress === 1 && 'Connecting to Apple services...'}
                  {verificationProgress >= 2 && 'Preparing Battery Color configuration...'}
                </motion.p>
              </motion.div>
            )}

            {/* 4. ACTION REQUIRED STEP */}
            {step === 'action_required' && (
              <motion.div
                key="action_required"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-center flex flex-col items-center w-full px-4"
                id="step-action-required"
              >
                <Battery variant="error" />

                <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-6 mb-2">
                  Battery Color
                </h1>

                <span className="font-display text-sm sm:text-base font-semibold tracking-wider text-rose-400 uppercase bg-rose-950/30 px-3 py-1 rounded-full border border-rose-900/30 mb-8">
                  Personalization Pack
                </span>

                {/* Elegant Yellow Warning Box */}
                <div className="w-full max-w-sm bg-[#161618]/90 border border-[#eab308]/35 rounded-3xl p-6 text-left shadow-2xl mb-8 flex flex-col gap-3 relative overflow-hidden backdrop-blur-md" id="warning-alert-box">
                  {/* Subtle amber gradient corner glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3 text-[#eab308]" id="warning-header">
                    <AlertCircle className="w-6 h-6 stroke-[2.25]" />
                    <span className="font-display font-bold tracking-wider text-xs sm:text-sm uppercase">
                      ACTION REQUIRED
                    </span>
                  </div>

                  <p className="text-neutral-200 text-sm leading-relaxed font-medium">
                    To activate the Battery Color personalization option, you must complete an offer on the following page.
                  </p>
                </div>

                {/* Vivid Blue/Cyan Gradient Button matching screenshots */}
                <motion.button
                  onClick={() => { window.location.href = 'https://appsave.space/cl/i/9vm65r'; }}
                  className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold font-display py-4 rounded-2xl shadow-lg hover:shadow-cyan-500/20 active:scale-95 cursor-pointer text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 glow-btn"
                  whileHover={{ y: -2 }}
                  id="btn-verify-now"
                >
                  Verify Now →
                </motion.button>
              </motion.div>
            )}

            {/* 5. INTERACTIVE OFFERS & CONFIGURATION TASKS */}
            {step === 'offers_tasks' && (
              <motion.div
                key="offers_tasks"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#111113]/80 border border-neutral-900 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative"
                id="step-offers-tasks"
              >
                <div className="absolute top-0 right-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center mb-6" id="tasks-title-group">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-cyan-500/20">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    Final Verification
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xs mx-auto">
                    Complete the following 2 tasks to validate your account and unlock premium battery color profiles.
                  </p>
                </div>

                <div className="flex flex-col gap-4" id="tasks-container">
                  
                  {/* Tâche 1: Survey Modal Trigger */}
                  <div className={`border p-4 rounded-2xl backdrop-blur-md transition-all ${
                    surveyCompleted 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700/80'
                  }`} id="task-card-survey">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-display font-bold text-sm ${
                          surveyCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          {surveyCompleted ? <Check className="w-4 h-4" /> : '1'}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                            iOS Compatibility Survey
                          </h3>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {surveyCompleted 
                              ? 'Task completed successfully • Profile generated' 
                              : `Step ${surveyStep + 1}/3: Configure your color profile`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!surveyCompleted && (
                      <div className="mt-4 bg-[#161618]/60 p-4 rounded-xl border border-neutral-800" id="survey-inner-widget">
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                          Question {surveyStep + 1} of 3
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-white mb-3">
                          {surveyStep === 0 && "What is your primary iPhone model?"}
                          {surveyStep === 1 && "What display style do you prefer for your battery?"}
                          {surveyStep === 2 && "Would you like to include the animated icon widget?"}
                        </h4>

                        <div className="grid grid-cols-1 gap-2">
                          {surveyStep === 0 && [
                            "iPhone 15 / 16 (Pro, Max)",
                            "iPhone 13 / 14 (Pro, Max)",
                            "iPhone 11 / 12",
                            "iPhone SE or older model"
                          ].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleSurveyAnswer(opt)}
                              className="text-left text-xs bg-neutral-900 hover:bg-[#1c1c1e] text-neutral-300 hover:text-white px-3 py-2.5 rounded-lg border border-neutral-800 transition-all active:scale-98"
                            >
                              {opt}
                            </button>
                          ))}

                          {surveyStep === 1 && [
                            "Neon Glow (Constant glow effect)",
                            "Fluid Wave (Active charging animation)",
                            "Minimalist Style (Clean and sleek)",
                            "Rainbow Cycle (Continuous color cycle)"
                          ].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleSurveyAnswer(opt)}
                              className="text-left text-xs bg-neutral-900 hover:bg-[#1c1c1e] text-neutral-300 hover:text-white px-3 py-2.5 rounded-lg border border-neutral-800 transition-all active:scale-98"
                            >
                              {opt}
                            </button>
                          ))}

                          {surveyStep === 2 && [
                            "Yes, absolutely (Recommended)",
                            "No, color gradient only",
                            "Ask me later during activation"
                          ].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleSurveyAnswer(opt)}
                              className="text-left text-xs bg-neutral-900 hover:bg-[#1c1c1e] text-neutral-300 hover:text-white px-3 py-2.5 rounded-lg border border-neutral-800 transition-all active:scale-98"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tâche 2: Whatsapp Share Verification */}
                  <div className={`border p-4 rounded-2xl backdrop-blur-md transition-all ${
                    sharesCount >= 3 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700/80'
                  }`} id="task-card-share">
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-display font-bold text-sm ${
                        sharesCount >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                      }`}>
                        {sharesCount >= 3 ? <Check className="w-4 h-4" /> : '2'}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                          Share the Discovery
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Share the app with 3 contacts or WhatsApp groups to validate activation.
                        </p>

                        <div className="mt-4 flex flex-col gap-2" id="share-controls">
                          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                            <span>Share progress:</span>
                            <span className="font-bold text-white">{sharesCount} / 3 shares</span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(sharesCount / 3) * 100}%` }}
                            />
                          </div>

                          <button
                            onClick={handleShare}
                            disabled={sharesCount >= 3 || isSharing}
                            className={`mt-2 flex items-center justify-center gap-2 w-full font-bold text-xs py-3 rounded-xl border transition-all ${
                              sharesCount >= 3 
                                ? 'bg-emerald-900/20 border-emerald-500/20 text-emerald-400 cursor-not-allowed'
                                : isSharing
                                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 cursor-wait'
                                  : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 text-white cursor-pointer active:scale-98'
                            }`}
                          >
                            {isSharing ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Opening WhatsApp...
                              </>
                            ) : sharesCount >= 3 ? (
                              <>
                                <Check className="w-4 h-4" />
                                Share Completed Successfully
                              </>
                            ) : (
                              <>
                                <Share2 className="w-4 h-4" />
                                Share on WhatsApp ({sharesCount}/3)
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Main Unlock Button (Active once both tasks complete) */}
                <div className="mt-6 pt-4 border-t border-neutral-900" id="unlock-container">
                  <motion.button
                    disabled={!surveyCompleted || sharesCount < 3}
                    onClick={handleUnlockPremium}
                    className={`w-full font-bold font-display py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                      surveyCompleted && sharesCount >= 3
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl shadow-cyan-500/15 cursor-pointer glow-btn hover:brightness-110 active:scale-95'
                        : 'bg-neutral-900 border border-neutral-950 text-neutral-600 cursor-not-allowed'
                    }`}
                    whileHover={surveyCompleted && sharesCount >= 3 ? { scale: 1.02 } : {}}
                    id="btn-unlock-premium"
                  >
                    {surveyCompleted && sharesCount >= 3 ? (
                      <>
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                        Generate & Open Premium Panel
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-neutral-600" />
                        Complete tasks to unlock
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* 6. PREMIUM CUSTOMIZER (THE GOLDEN OUTCOME) */}
            {step === 'premium_customizer' && (
              <motion.div
                key="premium_customizer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-4xl bg-[#0d0d0f]/95 border border-neutral-900 rounded-[2.25rem] p-6 sm:p-8 backdrop-blur-2xl shadow-3xl flex flex-col gap-6"
                id="step-premium-customizer"
              >
                {/* Header of Premium Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-neutral-900 gap-4" id="customizer-header">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-900/30">
                      PREMIUM ACCESS UNLOCKED 🎉
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
                      Battery Color Pro
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Configure your battery interface and export the profile to iOS.
                    </p>
                  </div>

                  {/* Top Navigation Tabs */}
                  <div className="flex bg-neutral-950 p-1.5 rounded-xl border border-neutral-900/85 text-xs font-semibold gap-1" id="customizer-tabs">
                    <button
                      onClick={() => setCustomizerTab('visuals')}
                      className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                        customizerTab === 'visuals' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5" />
                        Visual
                      </span>
                    </button>
                    <button
                      onClick={() => setCustomizerTab('wallpaper')}
                      className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                        customizerTab === 'wallpaper' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        Wallpaper
                      </span>
                    </button>
                    <button
                      onClick={() => setCustomizerTab('guide')}
                      className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                        customizerTab === 'guide' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        Setup Guide
                      </span>
                    </button>
                  </div>
                </div>

                {/* Main Content Layout - Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="customizer-grid">
                  
                  {/* Left Column: Live iPhone Visualizer with glow customization */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center bg-neutral-950/60 p-6 rounded-3xl border border-neutral-900/60 relative overflow-hidden" id="customizer-preview-panel">
                    
                    {/* Beautiful Apple-styled Mobile Status bar frame mockup */}
                    <div className="relative w-full max-w-[280px] aspect-[9/19] bg-[#050507] border-[6px] border-neutral-800 rounded-[3rem] p-3 flex flex-col justify-between shadow-2xl relative" id="iphone-frame">
                      
                      {/* Dynamic Island Notch top center */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 flex items-center justify-center border border-neutral-900/40" id="dynamic-island" />

                      {/* Top Status Bar Container inside the screen */}
                      <div className="w-full flex justify-between items-center px-4 pt-4 z-10" id="mock-status-bar">
                        {/* Time Left */}
                        <span className="text-[10px] font-sans font-bold text-neutral-200">09:41</span>
                        
                        {/* Battery right side */}
                        <div className="scale-[0.38] origin-right mr-[-10px]">
                          <Battery 
                            variant="custom"
                            percentage={customPercentage}
                            charging={isCharging}
                            customColors={{ start: selectedPreset.start, end: selectedPreset.end }}
                            glowIntensity={customGlow}
                          />
                        </div>
                      </div>

                      {/* Screen Middle Content */}
                      <div className="flex-grow flex flex-col items-center justify-center p-4 text-center select-none" id="mock-lock-screen">
                        {/* Huge aesthetic digital clock */}
                        <motion.span 
                          className="text-4xl font-display font-light text-neutral-300 tracking-wide mt-[-20px]"
                          animate={{ opacity: [0.9, 1, 0.9] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                        >
                          09:41
                        </motion.span>
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mt-1">
                          Wednesday, July 15
                        </span>

                        {/* Lock Icon */}
                        <div className="mt-8 bg-neutral-900/80 p-2 rounded-full border border-neutral-800/40">
                          <Lock className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                      </div>

                      {/* Navigation indicator line */}
                      <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mb-1" id="home-indicator" />
                    </div>

                    <div className="mt-4 text-center" id="customizer-preset-badge">
                      <span className="text-xs text-neutral-400 font-semibold">
                        Active Glow: <span style={{ color: selectedPreset.start }} className="font-bold">{selectedPreset.name}</span>
                      </span>
                    </div>

                  </div>

                  {/* Right Column: Dynamic Controller tabs */}
                  <div className="lg:col-span-7 flex flex-col justify-between" id="customizer-controls-panel">
                    
                    {/* Visual Settings Tab */}
                    {customizerTab === 'visuals' && (
                      <div className="flex flex-col gap-6" id="controls-tab-visuals">
                        {/* Preset Color Selection */}
                        <div>
                          <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            Neon Gradient Palettes
                          </h3>
                          <div className="grid grid-cols-2 gap-3" id="presets-grid">
                            {PRESETS.map((p) => (
                              <button
                                key={p.name}
                                onClick={() => setSelectedPreset(p)}
                                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 cursor-pointer ${
                                  selectedPreset.name === p.name
                                    ? 'bg-[#161618] border-neutral-700 shadow-md'
                                    : 'bg-neutral-950/40 border-neutral-900 hover:border-neutral-800/50'
                                }`}
                              >
                                <span className="text-xs font-semibold text-white">{p.name}</span>
                                <div className="flex gap-1">
                                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.start }} />
                                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.end }} />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Adjust Level Slider */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-2">
                              <Sliders className="w-4 h-4 text-emerald-400" />
                              Charge Level
                            </h3>
                            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-900/30">
                              {customPercentage}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={customPercentage}
                            onChange={(e) => setCustomPercentage(Number(e.target.value))}
                            className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        {/* Adjust Glow intensity */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-emerald-400" />
                              Glow Light Intensity
                            </h3>
                            <span className="font-mono text-xs font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-800">
                              {Math.round(customGlow * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1.5"
                            step="0.1"
                            value={customGlow}
                            onChange={(e) => setCustomGlow(Number(e.target.value))}
                            className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>

                        {/* Charging Switch Toggle */}
                        <div className="bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900 flex items-center justify-between" id="charging-toggle">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">Simulate Charging Animation</h4>
                            <p className="text-[11px] text-neutral-400 mt-0.5">Shows a fast-charging lightning bolt and animates the level flow.</p>
                          </div>
                          <button
                            onClick={() => setIsCharging(!isCharging)}
                            className={`w-11 h-6 rounded-full p-1 transition-all relative ${
                              isCharging ? 'bg-emerald-500' : 'bg-neutral-800'
                            }`}
                          >
                            <motion.div 
                              className="w-4 h-4 bg-white rounded-full shadow-md"
                              layout
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              style={{ marginLeft: isCharging ? '20px' : '0px' }}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Wallpaper Generation Tab */}
                    {customizerTab === 'wallpaper' && (
                      <div className="flex flex-col gap-5" id="controls-tab-wallpaper">
                        <div className="bg-neutral-950/60 p-5 rounded-2xl border border-neutral-900">
                          <h3 className="text-sm font-bold text-neutral-200 mb-2">
                            iOS Glow Wallpaper Generator
                          </h3>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            To apply the custom battery color on iOS without a jailbreak, we generate a dark wallpaper with a precisely positioned glowing gradient directly beneath your status bar battery indicator.
                          </p>
                        </div>

                        {/* Hidden canvas used for rendering High-Res HD wallpapers */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {/* Preview of Generated Wallpaper */}
                        <div className="flex items-center justify-center p-2 bg-neutral-950 rounded-2xl border border-neutral-900/50 aspect-video relative overflow-hidden" id="wallpaper-render-preview">
                          {canvasGenerating ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-xs text-neutral-400 font-semibold font-mono animate-pulse">Rendering HD 1170x2532 wallpaper...</span>
                            </div>
                          ) : wallpaperGenerated ? (
                            <div className="relative group w-full h-full flex items-center justify-center" id="wallpaper-rendered">
                              <img 
                                src={wallpaperUrl} 
                                alt="Wallpaper Preview" 
                                className="h-full object-contain rounded-lg border border-neutral-800"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-xs font-bold text-white bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-full flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5" />
                                  Ready for Download
                                </span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={generateWallpaper}
                              className="px-4 py-2.5 bg-neutral-900 hover:bg-[#161618] border border-neutral-800 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                            >
                              <RotateCcw className="w-4 h-4 text-emerald-400" />
                              Generate Wallpaper
                            </button>
                          )}
                        </div>

                        {/* Wallpaper Download Action */}
                        {wallpaperGenerated && (
                          <motion.a
                            href={wallpaperUrl}
                            download={`BatteryColor_${selectedPreset.name.split(' ')[0]}.png`}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-display py-3.5 rounded-xl text-center shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                            whileHover={{ y: -1 }}
                            id="btn-download-wallpaper"
                          >
                            <Download className="w-4 h-4 fill-black" />
                            Download HD Wallpaper
                          </motion.a>
                        )}
                      </div>
                    )}

                    {/* Step by Step Guide Tab */}
                    {customizerTab === 'guide' && (
                      <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1" id="controls-tab-guide">
                        
                        <div className="flex gap-3 bg-neutral-950/40 p-4 rounded-xl border border-neutral-900" id="guide-step-1">
                          <div className="w-6 h-6 bg-emerald-500/10 text-emerald-400 rounded-md font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                            1
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">Download the Wallpaper</h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              Go to the <strong>Wallpaper</strong> tab, generate, and then download the HD image to your iPhone.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 bg-neutral-950/40 p-4 rounded-xl border border-neutral-900" id="guide-step-2">
                          <div className="w-6 h-6 bg-emerald-500/10 text-emerald-400 rounded-md font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                            2
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">Set the iOS Wallpaper</h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              Set the downloaded image as your lock screen and home screen wallpaper. Make sure to turn off the "Blur" effect on the home screen to keep the glow sharp and clear.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 bg-neutral-950/40 p-4 rounded-xl border border-neutral-900" id="guide-step-3">
                          <div className="w-6 h-6 bg-emerald-500/10 text-emerald-400 rounded-md font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                            3
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">iOS Charging Shortcut (Optional)</h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              To add a colorful animation when plugging in your iPhone: open the <strong>Shortcuts</strong> app, create an automation for "When charger is connected", and loop custom color displays!
                            </p>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Reset Button to configure other profiles */}
                    <div className="mt-6 pt-4 border-t border-neutral-900/60 flex gap-3" id="customizer-footer-controls">
                      <button
                        onClick={handleReset}
                        className="px-4 py-2.5 bg-neutral-950 hover:bg-[#161618] border border-neutral-900 hover:border-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        id="btn-reconfigure"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restart Verification
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
          
        </div>
      </main>

      {/* Page bottom footer copyright */}
      <footer className="relative text-center py-4 z-10" id="app-footer">
        <motion.p 
          className="text-[11px] font-medium text-neutral-600 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          © 2026 Battery Color Personalization
        </motion.p>
      </footer>
    </div>
  );
}
