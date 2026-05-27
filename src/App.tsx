import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Rocket,
  Search,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Bell,
  CheckCircle,
  HelpCircle,
  Award,
  Coins,
  ShieldCheck,
  RotateCcw,
  Zap,
  Globe,
  Share2,
  AlertTriangle,
  X
} from 'lucide-react';

// Custom modular component imports
import Navbar from './components/Navbar';
import RoleTabs from './components/RoleTabs';
import FilterPanel from './components/FilterPanel';
import UserCard from './components/UserCard';
import RegisterModal from './components/RegisterModal';
import FeedSection from './components/FeedSection';
import StartupZoneSection from './components/StartupZoneSection';
import AIMatchesSection from './components/AIMatchesSection';
import MemberProfileModal from './components/MemberProfileModal';
import LandingPage from './components/LandingPage';
import { User, Connection, SavedItem, Notification } from './types';

export default function App() {
  // Global States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTabRaw] = useState(() => {
    try {
      const saved = localStorage.getItem('activeTab');
      if (saved && ['landing', 'explore', 'startupzone', 'feed'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'landing';
  });

  // Wrapper that persists activeTab to localStorage
  const setActiveTab = (tab: string) => {
    setActiveTabRaw(tab);
    try {
      localStorage.setItem('activeTab', tab);
    } catch {}
  };
  const [activeNetwork, setActiveNetwork] = useState<'TG10X' | 'BH10X'>('TG10X');
  const [activeMode, setActiveMode] = useState<'ecosystem' | 'campus'>('ecosystem');
  const [darkMode, setDarkMode] = useState(false);

  // Filter States
  const [selectedRole, setSelectedRole] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortOption, setSortOption] = useState('Latest');

  // Directory Data
  const [members, setMembers] = useState<any[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // AI intelligence parsed indicator
  const [aiInterpret, setAiInterpret] = useState<any>(null);

  // Modals Visibility
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeMember, setActiveMember] = useState<any>(null);
  const [toasts, setToasts] = useState<{ id: string; text: string; type: 'success' | 'info' }[]>([]);

  // Supabase Schema Warnings state
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [hideSupabaseWarning, setHideSupabaseWarning] = useState<boolean>(false);

  // Load active session and credentials on startup
  useEffect(() => {
    loadActiveUser();
  }, []);

  // Fetch Supabase status diagnostics on mount
  useEffect(() => {
    fetch('/api/supabase/status')
      .then(res => res.json())
      .catch(() => null)
      .then(data => {
        if (data && data.active && data.has_issues) {
          setSupabaseStatus(data);
        } else {
          setSupabaseStatus(null);
        }
      });
  }, [currentUser]);

  // Fetch directory list whenever tabs, switchers, or secondary filters edit
  useEffect(() => {
    fetchDirectory();
  }, [activeNetwork, activeMode, selectedRole, selectedRegion, selectedIndustry, selectedStage, verifiedOnly, featuredOnly, sortOption]);

  const loadActiveUser = async () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        const r = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        const data = await r.json();
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('auth_user', JSON.stringify(data.user));
          fetchUserData(data.user.username);
          // Auto-navigate logged-in users away from landing
          const savedTab = localStorage.getItem('activeTab');
          if (!savedTab || savedTab === 'landing') {
            setActiveTab('explore');
          }
          return;
        }
      }

      // Fetch me fallback
      const r = await fetch('/api/auth/me');
      const data = await r.json();
      if (data.user) {
        setCurrentUser(data.user);
        // Hydrate saved lists and notification logs
        fetchUserData(data.user.username);
        // Auto-navigate logged-in users away from landing
        const savedTab = localStorage.getItem('activeTab');
        if (!savedTab || savedTab === 'landing') {
          setActiveTab('explore');
        }
      }
    } catch (e) {
      console.error("Session fetch failed", e);
    }
  };

  const fetchUserData = async (username: string) => {
    if (!username) return;
    const authHeader = { 'Authorization': `Bearer ${username}` };
    
    // Connections mapping sync
    try {
      const cRes = await fetch('/api/connections', { headers: authHeader });
      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData && cData.success) {
          setConnections(cData.connections || []);
        }
      }
    } catch (err) {
      console.warn("Connection telemetry sync trace ignored: ", err);
    }

    // Bookmarking mapping sync
    try {
      const sRes = await fetch('/api/saved', { headers: authHeader });
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData && sData.success) {
          setSavedItems(sData.saved || []);
        }
      }
    } catch (err) {
      console.warn("Bookmarks telemetry sync trace ignored: ", err);
    }

    // Live Notification mapping sync
    try {
      const nRes = await fetch('/api/notifications', { headers: authHeader });
      if (nRes.ok) {
        const nData = await nRes.json();
        if (nData && nData.success) {
          setNotifications(nData.notifications || []);
        }
      }
    } catch (err) {
      console.warn("Notification logs telemetry sync trace ignored: ", err);
    }
  };

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      let url = `/api/users?network=${activeNetwork}&mode=${activeMode}&role=${selectedRole}&location=${selectedRegion}&sort=${sortOption}`;
      
      const r = await fetch(url);
      const data = await r.json();
      if (data.success) {
        let list = data.users;

        // Apply secondary client filters
        if (selectedIndustry !== 'All') {
          list = list.filter((u: any) =>
            u.startup?.industry?.includes(selectedIndustry) ||
            u.investor?.sectors_of_interest?.includes(selectedIndustry) ||
            u.mentor?.expertise_areas?.includes(selectedIndustry)
          );
        }
        if (selectedStage !== 'All') {
          list = list.filter((u: any) =>
            u.startup?.stage === selectedStage ||
            u.investor?.investment_stages?.includes(selectedStage)
          );
        }
        if (verifiedOnly) {
          list = list.filter((u: any) => u.is_verified);
        }
        if (featuredOnly) {
          list = list.filter((u: any) => u.startup?.is_featured || u.is_verified);
        }

        setMembers(list);
      }
    } catch (e) {
      console.error("Fetch directory failed", e);
    } finally {
      setLoading(false);
    }
  };

  // Perform AI or Regular Search
  const handleSearchCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setAiInterpret(null);
      fetchDirectory();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setMembers(data.users);
        setAiInterpret(data.ai_interpreted);
        addToast(`AI interpreted search successfully! Found ${data.users.length} compatible matches.`, 'info');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // Connect Handler
  const handleConnect = async (recId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.username}`
        },
        body: JSON.stringify({
          receiver_id: recId,
          message: `Hi let's connect workspace compatibility vectors on TG10X!`
        })
      });
      const data = await res.json();
      if (data.success) {
        setConnections(prev => [...prev, data.connection]);
        addToast("Synergy connection proposal request dispatched!", "success");
        // Refetch user data to obtain matching updates
        fetchUserData(currentUser.username);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Bookmarks
  const handleSave = async (itemId: string, itemType: 'profile' | 'listing') => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.username}`
        },
        body: JSON.stringify({ item_id: itemId, item_type: itemType })
      });
      const data = await res.json();
      if (data.success) {
        setSavedItems(prev => [...prev, data.saved]);
        addToast("Saved to customized bookmarks!", "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsave = async (itemId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/saved/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.username}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSavedItems(prev => prev.filter(s => s.item_id !== itemId));
        addToast("Removed from bookmarks.", "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSuccess = (user: any, message: string = "Authenticated successfully!") => {
    setCurrentUser(user);
    if (user && user.username) {
      localStorage.setItem('auth_token', user.username);
      localStorage.setItem('auth_user', JSON.stringify(user));
      fetchUserData(user.username);
    }
    addToast(message, 'success');
    fetchDirectory();
    setShowAuthModal(false);
    // Auto-navigate away from landing page after successful login
    if (activeTab === 'landing') {
      setActiveTab('explore');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('activeTab');
    setCurrentUser(null);
    setConnections([]);
    setSavedItems([]);
    setNotifications([]);
    setActiveTab('landing');
    addToast("Logged out successfully.", "info");
  };

  const handleMarkRead = async (id: string) => {
    if (!currentUser) return;
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.username}` }
      });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const addToast = (text: string, type: 'success' | 'info') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleResetFilters = () => {
    setSelectedRegion('All');
    setSelectedIndustry('All');
    setSelectedStage('All');
    setVerifiedOnly(false);
    setFeaturedOnly(false);
    setQuery('');
    setAiInterpret(null);
    fetchDirectory();
    addToast("Reset all catalog parameters", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Toast notifications engine */}
      <div className="fixed bottom-5 right-5 z-[100] space-y-2 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-xs font-bold border ${
              toast.type === 'success'
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'bg-slate-900 border-slate-950 text-white dark:bg-white dark:text-slate-900 border-transparent'
            }`}
          >
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Navbar Container */}
      <Navbar
        currentUser={currentUser}
        activeNetwork={activeNetwork}
        activeMode={activeMode}
        setNetwork={(net) => {
          setActiveNetwork(net);
          addToast(`Switched network scope to ${net}`, 'info');
        }}
        setMode={(mode) => {
          setActiveMode(mode);
          addToast(`Switched workspace mode to ${mode === 'ecosystem' ? 'Ecosystem Directory' : 'Campus Board'}`, 'info');
        }}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenMyProfile={() => {
          if (currentUser) {
            setActiveMember({
              ...currentUser,
              startup: members.find(m => m.id === currentUser.id)?.startup,
              investor: members.find(m => m.id === currentUser.id)?.investor,
              mentor: members.find(m => m.id === currentUser.id)?.mentor
            });
          }
        }}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />



      {/* Main layout contents */}
      {activeTab === 'landing' ? (
        <LandingPage
          onEnterPortal={(tab) => {
            setActiveTab(tab || 'explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAuth={() => setShowAuthModal(true)}
          currentUser={currentUser}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Real-world registry mode active - profile simulator panel removed */}

        {/* Dynamic tabs renderers */}
        {activeTab === 'explore' && (
          <div className="space-y-8">
            
            {/* Header Platform Hero banner */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 md:p-10 shadow-sm relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Compass className="w-56 h-56 text-rose-500" />
              </div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Telangana Startup Ecosystem Portal
                </span>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
                  Discover Telangana's Leading High-Growth Ventures
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  A non-profit multi-sided networking catalog connecting technological founders, venture capital institutions, public service enablers, and veteran mentors across Noida, Hyderabad, and Warangal.
                </p>

                {/* Intelligent query input search bar */}
                <form onSubmit={handleSearchCommit} className="pt-2">
                  <div className="flex gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-750">
                    <Search className="w-4 h-4 text-slate-400 ml-2.5 self-center shrink-0" />
                    <input
                      type="text"
                      placeholder="Ask the AI search assistant (e.g. 'SaaS startups in Warangal' or 'deeptech serial angels')..."
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      className="flex-1 bg-transparent text-xs placeholder-slate-450 focus:outline-none py-2 px-1 text-slate-850 dark:text-white font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* AI Interpret Metadata Flag */}
                {aiInterpret && (
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 p-3 rounded-xl flex items-center gap-2.5 text-xs animate-pulse">
                    <span className="p-1 rounded bg-indigo-500 text-white font-mono text-[9px] font-black uppercase">AI Match</span>
                    <p className="text-indigo-800 dark:text-indigo-300 font-bold leading-tight">
                      We identified intent: <strong>Role matching {aiInterpret.role || 'Any'} in city of '{aiInterpret.city || 'Any'}'</strong>. Found {members.length} matching listings.
                    </p>
                    <button
                      onClick={() => {
                        setAiInterpret(null);
                        setQuery('');
                        fetchDirectory();
                      }}
                      className="ml-auto text-[10px] text-indigo-400 font-extrabold hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Statistics indicator blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 font-mono">
                {[
                  { label: 'Startup Founders', val: '342+' },
                  { label: 'Investment Partners', val: '18+' },
                  { label: 'Mentors & Advisors', val: '78+' },
                  { label: 'Connected Synergies', val: '2.4K' }
                ].map((st, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{st.val}</span>
                    <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase font-bold mt-0.5 tracking-wider">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI compatibility matches slide widget banner */}
            <AIMatchesSection
              currentUser={currentUser}
              onOpenAuth={() => setShowAuthModal(true)}
              onConnect={handleConnect}
              onOpenDetails={setActiveMember}
            />

            {/* Stakeholder tabs pill */}
            <RoleTabs
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />

            {/* Dual Column directory grid workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Collapsible Left filters pane */}
              <div className="lg:col-span-1">
                <FilterPanel
                  selectedRegion={selectedRegion}
                  setRegion={(reg) => {
                    setSelectedRegion(reg);
                    addToast(`Filtering district: ${reg}`, 'info');
                  }}
                  selectedIndustry={selectedIndustry}
                  setIndustry={(ind) => {
                    setSelectedIndustry(ind);
                    addToast(`Industrial sector focus: ${ind}`, 'info');
                  }}
                  selectedStage={selectedStage}
                  setStage={(stage) => {
                    setSelectedStage(stage);
                    addToast(`Enterprise status level: ${stage}`, 'info');
                  }}
                  verifiedOnly={verifiedOnly}
                  setVerifiedOnly={setVerifiedOnly}
                  featuredOnly={featuredOnly}
                  setFeaturedOnly={setFeaturedOnly}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Right stakeholder search directories list */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* Header counts summary & Sort filters */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-4 py-3 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500">
                  <span>Found {members.length} registered members</span>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 uppercase text-[9px] tracking-wider font-extrabold">Sort by</span>
                    <select
                      value={sortOption}
                      onChange={e => setSortOption(e.target.value)}
                      className="border-none focus:outline-none bg-transparent font-extrabold text-slate-800 dark:text-slate-200"
                    >
                      <option value="Latest">Latest Additions</option>
                      <option value="Featured First">Featured First</option>
                      <option value="Alphabetical">Alphabetical</option>
                    </select>
                  </div>
                </div>

                {/* Directory catalog tiles */}
                {loading ? (
                  <div className="py-24 text-center text-xs text-slate-400 font-mono tracking-widest uppercase">
                    Refactoring database synergy vectors...
                  </div>
                ) : members.length === 0 ? (
                  <div className="py-16 bg-white border border-slate-200/60 rounded-3xl text-center p-8 max-w-xl mx-auto space-y-4 shadow-sm">
                    <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl inline-flex items-center justify-center">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">Start the Telangana Node</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Currently, there are no active stakeholder registrations on this customized node. Be the first to build a real-world footprint!
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-2 bg-slate-100 font-bold text-slate-800 rounded-xl text-xs hover:bg-slate-200 transition cursor-pointer"
                      >
                        Register Profile Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {members.map(member => (
                      <UserCard
                        key={member.id}
                        member={member}
                        currentUser={currentUser}
                        connections={connections}
                        savedItems={savedItems}
                        onConnect={handleConnect}
                        onSave={handleSave}
                        onUnsave={handleUnsave}
                        onOpenDetails={setActiveMember}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* StartupZone Active Board */}
        {activeTab === 'startupzone' && (
          <StartupZoneSection
            currentUser={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {/* Feed & Updates social system */}
        {activeTab === 'feed' && (
          <FeedSection
            currentUser={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        </div>
      )}

      {/* --- Overlay Modals & Drawers --- */}

      {/* 1. MultiStep Register & Authorization Modal */}
      {showAuthModal && (
        <RegisterModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* 2. Expanded Profile Details Drawer Info Modal */}
      {activeMember && (
        <MemberProfileModal
          member={activeMember}
          currentUser={currentUser}
          isSaved={savedItems.some(s => s.item_id === activeMember.id)}
          onSave={() => {
            const already = savedItems.some(s => s.item_id === activeMember.id);
            if (already) {
              handleUnsave(activeMember.id);
            } else {
              handleSave(activeMember.id, 'profile');
            }
          }}
          onConnect={handleConnect}
          onClose={() => setActiveMember(null)}
          onUpdateProfile={(updatedUser) => {
            setCurrentUser(updatedUser);
            setActiveMember(updatedUser);
            fetchDirectory();
            addToast("Your professional profile has been updated and synchronized!", "success");
          }}
        />
      )}

    </div>
  );
}
