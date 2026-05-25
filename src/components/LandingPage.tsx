import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Rocket, 
  Cpu, 
  Network, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  Users, 
  Zap, 
  Compass, 
  Activity, 
  Award, 
  Layers, 
  Database,
  Terminal,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  onEnterPortal: (tab?: string) => void;
  onOpenAuth: () => void;
  currentUser: any;
}

export default function LandingPage({ onEnterPortal, onOpenAuth, currentUser }: LandingPageProps) {
  // Live NVIDIA Cluster Sim States
  const [activeTabNvidia, setActiveTabNvidia] = useState<'h100' | 'a100' | 'l4'>('h100');
  const [computeLoad, setComputeLoad] = useState(74);
  const [activeJobs, setActiveJobs] = useState(14);
  const [memoryUsed, setMemoryUsed] = useState(480); // 480 GB out of 640 GB
  const [activeStartups, setActiveStartups] = useState([
    { name: 'Dhruva Aerospace AI', task: 'Aerodynamic Tensor Estimation', load: 88, status: 'Active' },
    { name: 'KhetiPoint Agritech', task: 'Crop Foliar Defect Model Training', load: 92, status: 'Active' },
    { name: 'MedSpark Gen-OMICS', task: 'Protein Sequence Alignment v2', load: 45, status: 'Active' },
  ]);

  // Live ticking stats counters
  const [currCapital, setCurrCapital] = useState(0);
  const [currFounders, setCurrFounders] = useState(0);
  const [currMentors, setCurrMentors] = useState(0);
  const [currGflops, setCurrGflops] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const timerInterval = setInterval(() => {
      step++;
      setCurrCapital(Math.min(470, Math.floor((470 / steps) * step)));
      setCurrFounders(Math.min(340, Math.floor((340 / steps) * step)));
      setCurrMentors(Math.min(78, Math.floor((78 / steps) * step)));
      setCurrGflops(Math.min(22, Math.floor((22 / steps) * step)));

      if (step >= steps) {
        clearInterval(timerInterval);
      }
    }, stepTime);

    return () => clearInterval(timerInterval);
  }, []);

  // Real-time telemetry simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate GPU compute usage changes
      setComputeLoad((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const target = prev + delta;
        return Math.min(Math.max(65, target), 96);
      });

      // Simulate active tasks fluctuation
      setActiveJobs((prev) => {
        const rand = Math.random();
        if (rand > 0.7 && prev < 20) return prev + 1;
        if (rand < 0.3 && prev > 8) return prev - 1;
        return prev;
      });

      // Update startups load slightly
      setActiveStartups((prev) =>
        prev.map((startup) => {
          const delta = Math.floor(Math.random() * 11) - 5;
          const newLoad = Math.min(Math.max(40, startup.load + delta), 100);
          return { ...startup, load: newLoad };
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#fcfdfe] dark:bg-[#07090e] text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:py-32 px-4 sm:px-6 lg:px-8">
        
        {/* Abstract glowing background blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ff3366]/12 to-[#ab20fd]/10 rounded-full blur-[120px] pointer-events-none opacity-80" />
        <div className="absolute left-10 top-1/3 w-80 h-80 bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel border border-slate-250/20 dark:border-white/5 shadow-glass cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3366] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff3366] font-mono">
              Telangana Sovereign Match Sandbox
            </span>
            <span className="text-slate-300 dark:text-slate-800">|</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
              COMPUTE LIVE <Cpu className="w-3.5 h-3.5 text-[#ff3366] animate-spin" style={{ animationDuration: '4s' }} />
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto uppercase leading-[1.04]"
          >
            Unleashing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3366] via-[#ab20fd] to-[#00f3ff] drop-shadow-sm">Deep-Tech</span> Pioneers Across Telangana
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25 }}
            className="text-sm sm:text-base text-slate-550 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-semibold"
          >
            India’s hyper-connected non-profit registry platform. Scaling high-conviction deep-tech startups, capital pools, cloud GPU, and elite governmental guidance into a clean, zero-friction sandbox directory.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto"
          >
            <button
              onClick={() => onEnterPortal('explore')}
              className="w-full sm:w-auto px-8 py-4 bg-[#ff3366] hover:bg-[#ff3366]/90 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#ff3366]/25 transition-all transform hover:-translate-y-1 hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              Enter Sandbox Registry
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={currentUser ? () => onEnterPortal('feed') : onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 glass-panel hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-white border border-slate-200/50 dark:border-white/5 font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-glass transition-all transform hover:-translate-y-1 hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {currentUser ? "Launch Portal Feed" : "Apply / Login Workspace"}
            </button>
          </motion.div>

          {/* Animated Counters Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pt-12 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {[
              { val: `₹${currCapital}Cr+`, label: 'Vetted Capital Catalog' },
              { val: `${currFounders}+`, label: 'Registered Founders' },
              { val: `${currMentors}+`, label: 'Govt-Approved Advisors' },
              { val: `${currGflops}M Pflops`, label: 'Active GPU Sandbox' }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.03, y: -2 }}
                className="glass-card border border-slate-250/20 dark:border-white/5 p-5.5 rounded-3xl shadow-glass text-center bg-white/40 dark:bg-slate-900/30 backdrop-blur-xl"
              >
                <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">{stat.val}</p>
                <p className="text-[9px] uppercase tracking-widest text-[#ff3366] font-extrabold mt-1 font-mono">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* NVIDIA Cloud Compute & Inception Telemetry Showcase */}
      <section className="py-20 bg-white/20 dark:bg-[#090d19]/40 border-t border-b border-slate-150/40 dark:border-white/5 relative">
        <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Context Left */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#00f3ff]/10 text-[#00f3ff] text-[10px] font-black uppercase tracking-widest font-mono">
                🚀 Sovereign Compute Cluster
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white uppercase leading-tight">
                NVIDIA Inception Compute Sandbox
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                TG10X hosts a certified, zero-cost high-performance supercomputing cluster for deep-tech start-ups accepted in Warangal and Hyderabad. 
                Our seed founders secure high-speed access to sovereign accelerators to train generative models, estimate drone aerodynamics, and calculate bio-informatics.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">Startups Compute Pools</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Accepted deeptech start-ups get up to ₹7,50,000 in free GPU credits.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="p-1 rounded bg-[#ff3366]/10 text-[#ff3366] mt-0.5">
                    <Activity className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">Active Telemetry Syncing</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Continuous job monitoring ensures equal allocation cycles for pre-seed founders.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnterPortal('explore')}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold uppercase tracking-widest shadow transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  Explore Vetted DeepTechs
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            {/* Live Interactive Telemetry Simulator Container */}
            <div className="lg:col-span-7 bg-white/40 dark:bg-[#0b0f19]/30 glass-card rounded-3xl border border-slate-200/50 dark:border-white/5 p-6 shadow-glass relative overflow-hidden">
              
              {/* Telemetry Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider font-mono text-slate-900 dark:text-white flex items-center gap-1.5">
                      TG10X-NVIDIA-H100-NODE-01 <span className="bg-emerald-500/10 text-emerald-550 dark:text-emerald-400 text-[8px] px-1 py-0.5 rounded">ONLINE</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Computing live jobs across regional enterprise hubs</p>
                  </div>
                </div>
                <div className="flex items-center bg-slate-200/50 dark:bg-slate-900/60 rounded-lg p-1 text-[10px] font-mono border border-slate-300/40 dark:border-slate-800">
                  {['h150 SXM5', 'A100 v3', 'L4 AI Edge'].map((val, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveTabNvidia(i === 0 ? 'h100' : i === 1 ? 'a100' : 'l4');
                      }}
                      className={`px-3 py-1 rounded font-bold uppercase text-[9px] transition ${
                        (activeTabNvidia === 'h100' && i === 0) || 
                        (activeTabNvidia === 'a100' && i === 1) || 
                        (activeTabNvidia === 'l4' && i === 2)
                          ? 'bg-brand-primary text-white shadow-xs'
                          : 'text-slate-450 dark:text-slate-555 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cluster Core Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 font-mono">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-black block">Compute Load</span>
                  <span className="text-lg font-black text-emerald-500 mt-1 block">{computeLoad}%</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-black block">Active Threads</span>
                  <span className="text-lg font-black text-slate-850 dark:text-white mt-1 block">{activeJobs} Nodes</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-black block">allocated vRAM</span>
                  <span className="text-lg font-black text-brand-primary mt-1 block">
                    {activeTabNvidia === 'h100' ? '512' : activeTabNvidia === 'a100' ? '320' : '96'} GB
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-black block">Grant Utilization</span>
                  <span className="text-lg font-black text-indigo-500 dark:text-indigo-400 mt-1 block">78.4%</span>
                </div>
              </div>

              {/* Progress Simulated Dynamic Bar */}
              <div className="space-y-1.5 pb-4">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span className="font-bold uppercase tracking-wider">Dynamic H100 GPU Allocation Cycle</span>
                  <span>{computeLoad}% STABLE</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-300/30 dark:border-slate-800">
                  <motion.div 
                    animate={{ width: `${computeLoad}%` }}
                    className="h-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-brand-primary" 
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  />
                </div>
              </div>

              {/* Active Jobs Sub-Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 p-4">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="uppercase font-bold">Active Startup Process</span>
                  <span className="uppercase font-bold">GPU Load</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-350">
                  {activeStartups.map((start, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 font-mono">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-950 dark:text-white block">{start.name}</span>
                        <span className="text-[9px] text-slate-400 block">{start.task}</span>
                      </div>
                      <div className="flex items-center gap-2.5 select-none">
                        <span className="text-slate-450 dark:text-slate-400 text-[10px]">{start.load}%</span>
                        <div className="w-20 bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${start.load}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry Footer */}
              <div className="mt-4 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" /> SYSTEM HEARTBEAT AT RATE 5.2s
                </span>
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px]">
                  ✓ 100% GREEN ALLOCATION CYCLE
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Structured Category Core Features */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-widest bg-[#ff3366]/10 text-[#ff3366] px-3.5 py-1.5 rounded-full font-black font-mono">
            Ecosystem Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Comprehensive Registries
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
            Unifying high-conviction deeptech builders, sovereign enabler agencies, and premier angel aggregates into zero-noise matchmaking boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Founders Catalog */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="glass-card p-8 rounded-3xl shadow-glass flex flex-col justify-between group border border-slate-200/40 dark:border-white/5 bg-white/50 dark:bg-slate-900/40"
          >
            <div className="space-y-5">
              <span className="w-12 h-12 bg-[#ff3366]/10 text-[#ff3366] rounded-2xl flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-6 h-6 animate-pulse" />
              </span>
              <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Founder Registry
              </h3>
              <p className="text-xs text-slate-550 dark:text-gray-400 leading-relaxed font-bold">
                Explore Telangana's elite deep-tech ventures. Discover drone aerospace systems, Agrotech predictive algorithms, biotechnology structures and legal tech innovations. Filter directly by growth stages (pre-seed to seed) and locations.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100/50 dark:border-white/5 mt-6">
              <button
                onClick={() => onEnterPortal('explore')}
                className="text-xs font-black uppercase text-[#ff3366] hover:underline flex items-center gap-1.5 cursor-pointer font-mono tracking-wider"
              >
                Scan Active Founders
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Strategic Investment */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
            className="glass-card p-8 rounded-3xl shadow-glass flex flex-col justify-between group border border-slate-200/40 dark:border-white/5 bg-white/50 dark:bg-slate-900/40"
          >
            <div className="space-y-5">
              <span className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6" />
              </span>
              <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                VCs & Family Offices
              </h3>
              <p className="text-xs text-slate-550 dark:text-gray-400 leading-relaxed font-bold">
                Access sovereign VC firms, regional family offices, and verified micro-angels. Match your startup criteria (verticals, investment tickets, compliance models) with strategic capital providers ready to scale the Indian technology footprint.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100/50 dark:border-white/5 mt-6">
              <button
                onClick={() => onEnterPortal('explore')}
                className="text-xs font-black uppercase text-emerald-500 hover:underline flex items-center gap-1.5 cursor-pointer font-mono tracking-wider"
              >
                Match Capital Providers
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: Elite Mentorship */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            className="glass-card p-8 rounded-3xl shadow-glass flex flex-col justify-between group border border-slate-200/40 dark:border-white/5 bg-white/50 dark:bg-slate-900/40"
          >
            <div className="space-y-5">
              <span className="w-12 h-12 bg-[#ab20fd]/10 text-[#ab20fd] rounded-2xl flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </span>
              <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Elite Advisory Boards
              </h3>
              <p className="text-xs text-slate-550 dark:text-gray-400 leading-relaxed font-bold">
                Gain direct masterclass access to industry veterans, senior engineers, and structural guides from standard corporations and incubators (WE Hub, Anthill, T-Hub). Schedule compliance, product fit, or international scale.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100/50 dark:border-white/5 mt-6">
              <button
                onClick={() => onEnterPortal('explore')}
                className="text-xs font-black uppercase text-[#ab20fd] hover:underline flex items-center gap-1.5 cursor-pointer font-mono tracking-wider"
              >
                Access Mentor Sandbox
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 bg-gradient-to-tr from-[#ff3366] via-[#ab20fd] to-[#040608]/90 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <Sparkles className="w-96 h-96 animate-pulse" />
        </div>
        <div className="absolute -bottom-20 -left-10 w-96 h-96 bg-[#00f3ff]/10 rounded-full blur-[80px]" />
        
        <div className="max-w-4xl mx-auto space-y-7 relative z-10 px-4">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight leading-tight">
            Ready to Accelerate Your Enterprise?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 font-bold max-w-2xl mx-auto leading-relaxed">
            Apply today to secure sovereign GPU compute allocation models, pitch live to verified family office angels, and establish structural compliance.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEnterPortal('explore')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#ff3366] hover:bg-slate-50 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition cursor-pointer"
            >
              Explore Sandbox Directory
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white border border-white/30 hover:bg-white/5 font-black text-xs uppercase tracking-widest rounded-2xl transition cursor-pointer"
            >
              Apply as Member
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}
