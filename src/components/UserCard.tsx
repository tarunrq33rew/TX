import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  MapPin,
  Users,
  TrendingUp,
  Award,
  DollarSign,
  Bookmark,
  MessageCircle,
  Briefcase,
  ExternalLink,
  Milestone
} from 'lucide-react';
import { User, Connection, SavedItem } from '../types';

interface UserCardProps {
  key?: any;
  member: User & {
    startup?: any;
    investor?: any;
    mentor?: any;
    enabler?: any;
    partner?: any;
  };
  currentUser: User | null;
  connections: Connection[];
  savedItems: SavedItem[];
  onConnect: (recId: string) => any;
  onSave: (itemId: string, itemType: 'profile' | 'listing') => any;
  onUnsave: (itemId: string) => any;
  onOpenDetails: (member: any) => void;
}

export default function UserCard({
  member,
  currentUser,
  connections,
  savedItems,
  onConnect,
  onSave,
  onUnsave,
  onOpenDetails
}: UserCardProps) {
  // Check bookmark/save status
  const isSaved = savedItems.some(s => s.item_id === member.id && s.item_type === 'profile');

  // Check connection status
  const connection = connections.find(
    c => (c.requester_id === currentUser?.id && c.receiver_id === member.id) ||
         (c.requester_id === member.id && c.receiver_id === currentUser?.id)
  );

  const getConnectBtnText = () => {
    if (!connection) return 'Connect';
    if (connection.status === 'pending') {
      return connection.requester_id === currentUser?.id ? 'Pending' : 'Accept Request';
    }
    if (connection.status === 'accepted') return 'Connected';
    return 'Connect';
  };

  const getConnectBtnStyle = () => {
    if (!connection) return 'bg-[#ff3366] hover:bg-[#ff3366]/90 text-white shadow-sm shadow-[#ff3366]/15';
    if (connection.status === 'pending') {
      if (connection.requester_id === currentUser?.id) {
        return 'bg-slate-100 dark:bg-slate-900/60 text-slate-450 dark:text-gray-500 cursor-not-allowed border border-slate-200 dark:border-white/5';
      }
      return 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse';
    }
    if (connection.status === 'accepted') {
      return 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-250 dark:border-teal-900 font-extrabold';
    }
    return 'bg-[#ff3366] text-white';
  };

  // Stage badge colors
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea': return 'bg-blue-100/70 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/10';
      case 'seed': return 'bg-amber-100/70 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/10';
      case 'series-a': return 'bg-purple-100/70 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/10';
      default: return 'bg-emerald-100/70 text-emerald-750 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-250/50 dark:border-emerald-900/10';
    }
  };

  const formattedTicket = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-3xl p-5 shadow-sm relative flex flex-col justify-between group h-full border border-slate-200/40 dark:border-white/5 bg-white/70 dark:bg-brand-navy/20"
    >
      
      {/* Top section: Avatar & Quick badges */}
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3.5" onClick={() => onOpenDetails(member)}>
            <img
              referrerPolicy="no-referrer"
              src={member.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.full_name)}`}
              alt={member.full_name}
              className="w-12 h-12 rounded-xl object-cover bg-slate-50 cursor-pointer shadow-sm border border-slate-100 dark:border-slate-700"
            />
            <div className="cursor-pointer">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                  {member.full_name}
                </h3>
                {member.is_verified && (
                  <ShieldCheck className="w-4 h-4 text-brand-primary fill-brand-primary/5 dark:fill-transparent" />
                )}
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                {member.role.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Save/Unsave Button */}
          <button
            onClick={() => {
              if (isSaved) {
                onUnsave(member.id);
              } else {
                onSave(member.id, 'profile');
              }
            }}
            className={`p-1.5 rounded-lg border transition ${
              isSaved
                ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary dark:bg-brand-primary/20'
                : 'border-slate-100 hover:border-slate-200 dark:border-slate-700 text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Bio summary */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3.5 line-clamp-2 h-8 leading-relaxed">
          {member.bio || "No professional bio provided yet. Explore to connect and request an expanded profile introduction."}
        </p>

        {/* --- Role specific info block --- */}

        {/* 1. STARTUP FOUNDER */}
        {member.role === 'startup_founder' && member.startup && (
          <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 text-[11px] leading-tight">
                🏢 {member.startup.company_name}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${getStageColor(member.startup.stage)}`}>
                {member.startup.stage}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 italic font-mono truncate">
              "{member.startup.tagline}"
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {(member.startup.industry || []).slice(0, 3).map((ind: string) => (
                <span key={ind} className="bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-[9px] px-1.5 py-0.5 rounded">
                  {ind}
                </span>
              ))}
              {member.startup.is_hiring && (
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold animate-pulse">
                  Hiring
                </span>
              )}
            </div>
          </div>
        )}

        {/* 2. INVESTOR */}
        {member.role === 'investor' && member.investor && (
          <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-700/50 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                💰 {member.investor.firm_name}
              </span>
              <span className="bg-amber-100/60 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">
                {member.investor.investor_type}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center">
              <DollarSign className="w-3 h-3 text-slate-300 mr-1" />
              Ticket size: <strong className="text-slate-800 dark:text-slate-300 ml-1 font-mono text-[11px]">{formattedTicket(member.investor.ticket_size_min)} - {formattedTicket(member.investor.ticket_size_max)}</strong>
            </p>
            <div className="flex flex-wrap gap-1 pt-1.5">
              {(member.investor.sectors_of_interest || []).slice(0, 3).map((sec: string) => (
                <span key={sec} className="bg-slate-100 dark:bg-slate-800/40 text-[9px] px-1.5 py-0.5 rounded text-slate-500">
                  {sec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. MENTOR */}
        {member.role === 'mentor' && member.mentor && (
          <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-700/50 space-y-1.5">
            <p className="text-[11px] text-slate-400 font-medium">
              💼 Coach with <strong className="text-slate-800 dark:text-slate-300 font-mono">{member.mentor.years_of_experience}+ yrs</strong> experience
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(member.mentor.expertise_areas || []).slice(0, 3).map((exp: string) => (
                <span key={exp} className="bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-teal-100/50 dark:border-teal-900/30">
                  {exp}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center text-[9px] pt-1 text-slate-400 uppercase font-bold tracking-widest font-mono">
              <span>{member.mentor.availability} Availability</span>
              <span className="text-slate-300">|</span>
              <span>{member.mentor.session_type} Mentorship</span>
            </div>
          </div>
        )}

        {/* 4. ECOSYSTEM ENABLER */}
        {member.role === 'ecosystem_enabler' && member.enabler && (
          <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-700/50 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">🏛️ {member.enabler.org_name}</span>
              <span className="bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 px-2 py-0.5 rounded text-[9px] font-black uppercase">{member.enabler.org_type}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
              {member.enabler.description || "Conducting startup incubation & government grant distribution."}
            </p>
          </div>
        )}

        {/* 5. SERVICE PARTNERS */}
        {member.role === 'service_partner' && member.partner && (
          <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-700/50 space-y-1.5">
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">💼 {member.partner.firm_name}</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(member.partner.service_categories || []).slice(0, 3).map((cat: string) => (
                <span key={cat} className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 6. JOB SEEKER */}
        {member.role === 'job_seeker' && (
          <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-700/50 space-y-1.5">
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open for Opportunities
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {["Frontend", "Postgres", "React 19", "Typescript"].map(sk => (
                <span key={sk} className="bg-slate-100 dark:bg-slate-700/40 text-[9px] px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Location & Connect button */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
        <div className="flex items-center text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-tight">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          <span>{member.city || 'Hyderabad'}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onOpenDetails(member)}
            className="p-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:border-slate-300 dark:hover:text-white rounded-xl text-xs transition"
            title="View Details"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          
          <button
            id={`connect-btn-${member.username}`}
            onClick={() => onConnect(member.id)}
            disabled={connection?.status === 'pending' && connection.requester_id === currentUser?.id}
            className={`px-3 py-1.5 text-xs font-black rounded-xl cursor-pointer transition-all duration-300 transform active:scale-95 flex items-center gap-1 ${getConnectBtnStyle()}`}
          >
            {getConnectBtnText()}
          </button>
        </div>
      </div>

    </motion.div>
  );
}
