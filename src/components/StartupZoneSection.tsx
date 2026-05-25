import React, { useState, useEffect } from 'react';
import { Calendar, Briefcase, Plus, Coins, MapPin, Sparkles, Send, Trash2, Milestone, Bell, Info, Compass } from 'lucide-react';
import { Listing, User } from '../types';

interface StartupZoneSectionProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export default function StartupZoneSection({ currentUser, onOpenAuth }: StartupZoneSectionProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeZone, setActiveZone] = useState<'all' | 'job' | 'funding' | 'event'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [appliedListings, setAppliedListings] = useState<Record<string, boolean>>({});

  // Form State
  const [newListing, setNewListing] = useState({
    type: 'job',
    title: '',
    description: '',
    company_name: '',
    location: 'Hyderabad, Telangana',
    is_remote: false,
    salary_range_min: '',
    salary_range_max: '',
    deadline: '',
    tags: 'Aerospace, Python, Engineering'
  });

  useEffect(() => {
    fetchListings();
  }, [activeZone, search]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const typeParam = activeZone === 'all' ? 'All' : activeZone;
      const res = await fetch(`/api/listings?type=${typeParam}&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setListings(data.listings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newListing.title || !newListing.description) return;

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.username}`
        },
        body: JSON.stringify({
          ...newListing,
          salary_range_min: Number(newListing.salary_range_min) || undefined,
          salary_range_max: Number(newListing.salary_range_max) || undefined,
          tags: newListing.tags.split(',').map(s => s.trim())
        })
      });
      const data = await res.json();
      if (data.success) {
        setListings(prev => [data.listing, ...prev]);
        setShowCreate(false);
        setNewListing({
          type: 'job',
          title: '',
          description: '',
          company_name: '',
          location: 'Hyderabad, Telangana',
          is_remote: false,
          salary_range_min: '',
          salary_range_max: '',
          deadline: '',
          tags: 'Aerospace, Python, Engineering'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (id: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (appliedListings[id]) return;

    try {
      const res = await fetch(`/api/listings/${id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.username}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAppliedListings(prev => ({ ...prev, [id]: true }));
        setListings(prev =>
          prev.map(l => (l.id === id ? { ...l, applications_count: data.applications_count } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (num?: number) => {
    if (!num) return '';
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Navigation zone banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <Milestone className="w-5 h-5 text-rose-500" />
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              StartupZone Board
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Jobs, Venture Capital Rounds, Grants, and Co-founder matching meetups
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!currentUser) onOpenAuth();
            else setShowCreate(!showCreate);
          }}
          className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 border text-white rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Publish listing
        </button>
      </div>

      {/* Tabs list switches & Search box */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 font-mono text-xs w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Board' },
            { id: 'job', label: '💼 Jobs & Interships' },
            { id: 'funding', label: '💰 Capital Funding' },
            { id: 'event', label: '📅 Innovation Events' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveZone(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeZone === item.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter listings by title, skills or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-rose-500 bg-white dark:bg-slate-800 dark:text-white"
        />
      </div>

      {/* CREATE NEW LISTING DRAWER/MODAL PANEL */}
      {showCreate && (
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-inner max-w-xl mx-auto space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-700 pb-2.5 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-rose-500 tracking-wider">Publish New Offer / Announcement</h3>
            <button onClick={() => setShowCreate(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
          </div>

          <form onSubmit={handleCreateListing} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Listing Type</label>
                <select
                  name="type"
                  value={newListing.type}
                  onChange={e => setNewListing(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-xs dark:bg-slate-700 dark:text-white"
                >
                  <option value="job">💼 Job Seeker Hiring</option>
                  <option value="funding">💰 Deal/Grant Funding</option>
                  <option value="event">📅 Innovation Event</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Company / Organization Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dhruva Aerospace"
                  value={newListing.company_name}
                  onChange={e => setNewListing(prev => ({ ...prev, company_name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-lg border text-xs dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Vacancy / Opportunity Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Architect"
                value={newListing.title}
                onChange={e => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded-lg border text-xs dark:bg-slate-700 dark:text-white"
              />
            </div>

            {newListing.type === 'job' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Salary Min (INR per Year)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1200000"
                    value={newListing.salary_range_min}
                    onChange={e => setNewListing(prev => ({ ...prev, salary_range_min: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border text-xs dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Salary Max (INR per Year)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2500000"
                    value={newListing.salary_range_max}
                    onChange={e => setNewListing(prev => ({ ...prev, salary_range_max: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border text-xs dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Location State/City</label>
                <input
                  type="text"
                  value={newListing.location}
                  onChange={e => setNewListing(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-xs dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newListing.tags}
                  onChange={e => setNewListing(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-xs dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Requirements Description</label>
              <textarea
                rows={3}
                placeholder="List detailed qualifications, criteria, dates or application details..."
                value={newListing.description}
                onChange={e => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded-lg border text-xs dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-black uppercase tracking-wider"
              >
                Submit Listing Board
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTINGS RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400">Loading digital zone board...</div>
        ) : listings.length === 0 ? (
          <div className="col-span-2 py-16 bg-white border border-slate-200/60 rounded-3xl text-center p-8 max-w-md mx-auto space-y-4 shadow-sm">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl inline-flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Empty Board Node</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                No real-world announcements or synergy requests have been logged yet. Click "Create Synergy Listing" above to launch yours!
              </p>
            </div>
          </div>
        ) : (
          listings.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[8px] tracking-widest uppercase font-black ${
                      item.type === 'job' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30' :
                      item.type === 'funding' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30' :
                      'bg-purple-50 text-purple-700 dark:bg-purple-950/30'
                    }`}>
                      {item.type} Announcement
                    </span>
                    <h3 className="text-xs font-black text-slate-850 dark:text-white mt-1 leading-tight">{item.title}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">🏢 {item.company_name}</p>
                  </div>

                  <img
                    referrerPolicy="no-referrer"
                    src={item.company_logo_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150"}
                    alt="Logo"
                    className="w-9 h-9 rounded-xl object-cover border border-slate-100 dark:border-slate-700"
                  />
                </div>

                <p className="text-[11px] text-slate-500 mt-3 line-clamp-3 leading-normal font-medium">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-3">
                  {(item.tags || []).slice(0, 3).map(tg => (
                    <span key={tg} className="bg-slate-50 dark:bg-slate-700/30 text-[9px] px-1.5 py-0.5 rounded text-slate-400">
                      {tg}
                    </span>
                  ))}
                </div>

                {item.type === 'job' && item.salary_range_min && (
                  <p className="text-[11px] text-emerald-600 font-bold font-mono mt-2 flex items-center">
                     Compensation: {formatCurrency(item.salary_range_min)} - {formatCurrency(item.salary_range_max)} / yr
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-[10px]">
                <span className="text-slate-400 flex items-center font-bold">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.location || 'Hyderabad'}
                </span>

                <button
                  onClick={() => handleApply(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition ${
                    appliedListings[item.id]
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                >
                  {appliedListings[item.id] ? 'Applied / RSVP' : item.type === 'event' ? 'RSVP Event' : 'Apply Offer'}
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
