import React from 'react';
import { SlidersHorizontal, ToggleLeft, ToggleRight, CheckSquare, Square, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  selectedRegion: string;
  setRegion: (reg: string) => void;
  selectedIndustry: string;
  setIndustry: (ind: string) => void;
  selectedStage: string;
  setStage: (stage: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (val: boolean) => void;
  featuredOnly: boolean;
  setFeaturedOnly: (val: boolean) => void;
  onReset: () => void;
}

export const REGIONS = [
  { id: 'All', label: 'All India' },
  { id: 'Telangana', label: 'Telangana State' },
  { id: 'Hyderabad', label: 'Hyderabad Metro' },
  { id: 'Warangal', label: 'Warangal HUB' },
  { id: 'Nizamabad', label: 'Nizamabad Sector' }
];

export const INDUSTRIES = [
  { id: 'All', label: 'All Industries' },
  { id: 'DeepTech', label: 'DeepTech / Aerospace' },
  { id: 'AgTech', label: 'AgTech / Farming' },
  { id: 'EV', label: 'Electric Vehicles / Logistics' },
  { id: 'SaaS', label: 'SaaS / Enterprise' },
  { id: 'HealthTech', label: 'HealthTech' },
  { id: 'EdTech', label: 'EdTech / Academy' }
];

export const STAGES = [
  { id: 'All', label: 'All Stages' },
  { id: 'idea', label: 'Idea / Pre-seed' },
  { id: 'seed', label: 'Seed Venture' },
  { id: 'series-a', label: 'Series-A Scaleup' },
  { id: 'series-b', label: 'Series-B Capital Growth' },
  { id: 'profitable', label: 'Revenue / Profitable' }
];

export default function FilterPanel({
  selectedRegion,
  setRegion,
  selectedIndustry,
  setIndustry,
  selectedStage,
  setStage,
  verifiedOnly,
  setVerifiedOnly,
  featuredOnly,
  setFeaturedOnly,
  onReset
}: FilterPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
          <span className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Refine Catalog
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-brand-primary transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      <div className="space-y-5">
        {/* Region Filter */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Region / City
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {REGIONS.map(reg => (
              <button
                key={reg.id}
                onClick={() => setRegion(reg.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  selectedRegion === reg.id
                    ? 'bg-brand-primary/10 text-brand-primary font-extrabold dark:bg-brand-primary/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>{reg.label}</span>
                {selectedRegion === reg.id && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Sectors / Industries */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Industrial Sectors
          </label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {INDUSTRIES.map(ind => (
              <button
                key={ind.id}
                onClick={() => setIndustry(ind.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  selectedIndustry === ind.id
                    ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>{ind.label}</span>
                {selectedIndustry === ind.id && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Development Stages */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Funding/Growth Stage
          </label>
          <div className="space-y-1.5">
            {STAGES.map(st => (
              <button
                key={st.id}
                onClick={() => setStage(st.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  selectedStage === st.id
                    ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>{st.label}</span>
                {selectedStage === st.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-3.5 space-y-3">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className="flex items-center space-x-2.5 w-full text-left font-bold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {verifiedOnly ? (
              <CheckSquare className="w-4 h-4 text-brand-primary" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Show Verified Members Only</span>
          </button>

          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className="flex items-center space-x-2.5 w-full text-left font-bold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {featuredOnly ? (
              <CheckSquare className="w-4 h-4 text-brand-primary" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Show Featured Ventures Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}
