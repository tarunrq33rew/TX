import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, CornerDownRight, CheckCircle, RefreshCcw } from 'lucide-react';
import { User } from '../types';

interface AIMatchesSectionProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onConnect: (recId: string) => void;
  onOpenDetails: (member: any) => void;
}

export default function AIMatchesSection({ currentUser, onOpenAuth, onConnect, onOpenDetails }: AIMatchesSectionProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchMatches();
    }
  }, [currentUser]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/matches', {
        headers: {
          'Authorization': `Bearer ${currentUser?.username}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (e) {
      console.error("AI matches extraction failed", e);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel border border-slate-250/20 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 rounded-3xl p-6 shadow-glass relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-40 h-40 text-[#ff3366]" />
        </div>
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[10px] bg-[#ff3366]/10 text-[#ff3366] font-black tracking-widest px-3 py-1 rounded-full uppercase font-mono">
            Gemini AI Matching sandbox
          </span>
          <h2 className="text-md sm:text-lg font-display font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Unleash Hyper-Compatible Matches
          </h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed font-bold">
            Register or sign-in on TG10X to scan thousands of founders, angels, and ecosystem enablers with our native Gemini AI Matching assistant.
          </p>
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAuth}
              className="px-6 py-3 bg-[#ff3366] hover:bg-[#ff3366]/90 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#ff3366]/15 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get AI compatibility report
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="glass-panel border border-slate-250/20 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 rounded-3xl p-6 shadow-glass relative overflow-hidden">
      
      {/* Decorative vectors */}
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Sparkles className="w-52 h-52 text-brand-primary" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 bg-brand-primary text-white rounded-xl">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">✨ Your AI-Powered Matches</h2>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-mono px-1.5 rounded uppercase font-bold tracking-wider">Active</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Custom alignment analysis for Ramesh Kumar
              </p>
            </div>
          </div>

          <button
            onClick={fetchMatches}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            title="Recalculate Matches"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-brand-primary font-mono tracking-widest uppercase">
            Synthesizing compatible vectors with Gemini API pipeline...
          </div>
        ) : matches.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            Connecting profiles to formulate dynamic listings. Click the refresh button.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {matches.map((item, idx) => {
              const u = item.matched_user;
              if (!u) return null;

              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`border rounded-3xl p-5 flex flex-col justify-between shadow-glass transition-all duration-300 ${
                    isEven
                      ? 'bg-gradient-to-br from-indigo-50/40 to-white/80 dark:from-indigo-950/10 dark:to-slate-900/30 border-slate-200/40 dark:border-white/5'
                      : 'bg-gradient-to-br from-[#ff3366]/5 to-white/80 dark:from-[#ff3366]/5 dark:to-slate-900/30 border-slate-200/40 dark:border-white/5'
                  }`}
                >
                  <div>
                    {/* User info card inside AI section */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onOpenDetails(u)}>
                        <div className="relative flex-shrink-0">
                          <img
                            referrerPolicy="no-referrer"
                            src={u.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=TG'}
                            alt={u.full_name}
                            className={`w-12 h-12 rounded-2xl object-cover bg-slate-100 border-2 shadow-xs ${
                              isEven ? 'border-indigo-400/50' : 'border-[#ff3366]/50'
                            }`}
                          />
                          <div className={`absolute -top-1.5 -right-1.5 text-[9px] font-black px-2 py-0.5 rounded-full border shadow-glass font-mono ${
                            isEven 
                              ? 'bg-indigo-600 text-white border-transparent' 
                              : 'bg-[#ff3366] text-white border-transparent'
                          }`}>
                            {item.score}%
                          </div>
                        </div>
                        <div>
                          <span className={`text-xs font-black transition block ${
                            isEven ? 'hover:text-indigo-600' : 'hover:text-[#ff3366]'
                          }`}>
                            {u.full_name}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                            {u.role.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI explanation and details */}
                    <div className={`mt-3.5 p-3 rounded-2xl border ${
                      isEven 
                        ? 'bg-indigo-50/20 dark:bg-indigo-950/20 border-slate-200/40 dark:border-white/5' 
                        : 'bg-[#ff3366]/5 dark:bg-[#ff3366]/5 border-slate-200/40 dark:border-white/5'
                    }`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1 font-mono ${
                        isEven ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#ff3366]'
                      }`}>
                        ✨ Core Compatibility Factors
                      </p>
                      <ul className="text-[11px] text-slate-650 dark:text-gray-300 space-y-1 font-bold">
                        {(item.reasons || []).slice(0, 2).map((reason: string, rIdx: number) => (
                          <li key={rIdx} className="flex items-start gap-1 leading-relaxed">
                            <span className={isEven ? 'text-indigo-500 font-bold' : 'text-[#ff3366] font-bold'}>•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Ice-breaker template copy */}
                    <div className="mt-3.5 flex gap-1.5 items-start">
                      <CornerDownRight className={`w-3.5 h-3.5 mt-1 shrink-0 ${
                        isEven ? 'text-indigo-550' : 'text-[#ff3366]'
                      }`} />
                      <div className="flex-1 bg-white/50 dark:bg-slate-950/30 border border-slate-200/40 dark:border-white/5 rounded-2xl p-2.5 text-[10px] italic text-slate-500 dark:text-slate-400 font-semibold">
                        "{item.recommended_intro_message || "Hey! I saw synergy in our deeptech goals on TG10X. Let's chat."}"
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100/50 dark:border-white/5 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>TG10X MATCH ID: {item.id ? item.id.substr(0,8) : 'ENG-88'}</span>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onConnect(u.id)}
                      className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                        isEven 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                          : 'bg-[#ff3366] hover:bg-[#ff3366]/90 text-white shadow-md shadow-[#ff3366]/15'
                      }`}
                    >
                      Connect Pitch
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
