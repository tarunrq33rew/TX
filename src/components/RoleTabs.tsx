import React from 'react';
import { Users, Rocket, Coins, Award, UsersRound, Briefcase, HelpCircle, School, Landmark } from 'lucide-react';
import { UserRole } from '../types';

interface RoleTabsProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

export type TabItem = {
  id: string;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

export const ROLE_TABS: TabItem[] = [
  { id: 'All', label: 'All Stakeholders', icon: Users, color: 'text-slate-500' },
  { id: 'startup_founder', label: 'Startup Founders', icon: Rocket, color: 'text-rose-500' },
  { id: 'investor', label: 'Investors', icon: Coins, color: 'text-amber-500' },
  { id: 'mentor', label: 'Mentors & Advisors', icon: Award, color: 'text-teal-500' },
  { id: 'ecosystem_enabler', label: 'Ecosystem Enablers', icon: Landmark, color: 'text-purple-500' },
  { id: 'job_seeker', label: 'Job Seekers', icon: Briefcase, color: 'text-emerald-500' },
  { id: 'service_partner', label: 'Service Partners', icon: UsersRound, color: 'text-indigo-500' },
  { id: 'aspiring_entrepreneur', label: 'Aspiring Entrepreneurs', icon: School, color: 'text-blue-500' },
  { id: 'corporate_innovation', label: 'Corporates', icon: Landmark, color: 'text-sky-500' }
];

export default function RoleTabs({ selectedRole, setSelectedRole }: RoleTabsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 mt-1">
        <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
          stakeholder directories
        </span>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-none scroll-smooth">
        {ROLE_TABS.map(tab => {
          const Icon = tab.icon;
          const isSelected = selectedRole === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all duration-300 transform active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-brand-dark border-brand-dark text-white dark:bg-white dark:border-white dark:text-brand-dark shadow-md shadow-brand-dark/20 font-extrabold scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white dark:text-slate-950' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
