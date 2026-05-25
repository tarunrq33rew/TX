import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Network, Sparkles, LogIn, LogOut, Bell, Shield, User, Globe, Moon, Sun, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  activeNetwork: 'TG10X' | 'BH10X';
  activeMode: 'ecosystem' | 'campus';
  setNetwork: (net: 'TG10X' | 'BH10X') => void;
  setMode: (mode: 'ecosystem' | 'campus') => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenMyProfile: () => void;
  notifications: any[];
  onMarkRead: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({
  currentUser,
  activeNetwork,
  activeMode,
  setNetwork,
  setMode,
  onLogout,
  onOpenAuth,
  onOpenMyProfile,
  notifications,
  onMarkRead,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab
}: NavbarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 text-slate-800 dark:border-brand-navy/60 dark:bg-brand-dark/95 dark:text-white backdrop-blur-md transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => { setActiveTab('landing'); }}>
            <span className="w-8 h-8 rounded bg-brand-primary shadow-md shadow-brand-primary/20 text-white flex items-center justify-center transform group-hover:scale-105 transition-all">
              <span className="font-extrabold text-lg tracking-wider">T</span>
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                TG10X <span className="text-[8px] bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded font-black tracking-widest uppercase">Ecosystem</span>
              </span>
              <span className="text-[9px] text-slate-400 dark:text-gray-400 font-mono tracking-widest leading-none mt-1 uppercase font-bold">NON-PROFIT PORTAL</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { id: 'landing', label: 'Ecosystem Portal' },
              { id: 'explore', label: 'Explore Catalog' },
              { id: 'startupzone', label: 'StartupZone' },
              { id: 'feed', label: 'Feed updates' }
            ].map(item => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Controls: Mode Switcher, Network, Notification, Profile */}
          <div className="flex items-center space-x-2">
            
            {/* Mode Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-brand-navy rounded-full p-0.5 border border-slate-200 dark:border-white/10">
              <button
                id="mode-ecosystem"
                onClick={() => setMode('ecosystem')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                  activeMode === 'ecosystem'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3 h-3 text-emerald-500" />
                Ecosyst
              </button>
              <button
                id="mode-campus"
                onClick={() => setMode('campus')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                  activeMode === 'campus'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <Shield className="w-3 h-3 text-indigo-500" />
                Campus
              </button>
            </div>

            {/* Network Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-brand-navy rounded-full p-0.5 border border-slate-200 dark:border-white/10 font-mono text-[10px]">
              <button
                id="net-tg10x"
                onClick={() => setNetwork('TG10X')}
                className={`px-2.5 py-1 rounded-full font-extrabold transition-all cursor-pointer ${
                  activeNetwork === 'TG10X'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                TG10X
              </button>
              <button
                id="net-bh10x"
                onClick={() => setNetwork('BH10X')}
                className={`px-2.5 py-1 rounded-full font-extrabold transition-all cursor-pointer ${
                  activeNetwork === 'BH10X'
                    ? 'bg-slate-400 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                BH10X
              </button>
            </div>

            {/* Theme Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-brand-navy rounded-full p-0.5 border border-slate-200 dark:border-white/10 font-mono text-[10px]">
              <button
                id="theme-light-btn"
                onClick={() => setTheme('light')}
                className={`p-1 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  mounted && resolvedTheme === 'light'
                    ? 'bg-white text-amber-500 shadow-xs px-2'
                    : 'text-slate-400 hover:text-slate-900 dark:text-gray-450 dark:hover:text-white px-1.5'
                }`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
                {mounted && resolvedTheme === 'light' && <span className="text-[8px] font-black uppercase tracking-wider ml-1">Light</span>}
              </button>
              <button
                id="theme-dark-btn"
                onClick={() => setTheme('dark')}
                className={`p-1 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  mounted && resolvedTheme === 'dark'
                    ? 'bg-brand-primary text-white shadow-xs px-2'
                    : 'text-slate-400 hover:text-slate-900 dark:text-gray-450 dark:hover:text-white px-1.5'
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
                {mounted && resolvedTheme === 'dark' && <span className="text-[8px] font-black uppercase tracking-wider ml-1">Dark</span>}
              </button>
            </div>

            {/* Notifications - Desktop Only */}
            {currentUser && (
              <div className="relative hidden md:block">
                <button
                  id="notifications-btn"
                  onClick={() => setShowNotif(!showNotif)}
                  className="p-1.5 rounded-xl text-slate-555 border border-slate-200 hover:text-slate-900 dark:border-white/10 dark:text-gray-450 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-primary text-[10px] text-white font-black flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 dark:bg-brand-dark dark:border-brand-navy rounded-2xl shadow-xl z-50 overflow-hidden text-slate-800 dark:text-white">
                    <div className="p-3.5 border-b border-slate-150 dark:border-brand-navy flex justify-between items-center bg-slate-50 dark:bg-brand-navy/50">
                      <span className="text-[10px] font-black uppercase tracking-wider">Live Updates</span>
                      {unreadCount > 0 && <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-black uppercase">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-brand-navy">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                           No new notifications
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              onMarkRead(n.id);
                              setShowNotif(false);
                            }}
                            className={`p-3.5 hover:bg-slate-50 dark:hover:bg-brand-navy/35 transition cursor-pointer flex flex-col ${!n.is_read ? 'bg-brand-primary/5 border-l-2 border-brand-primary' : ''}`}
                          >
                            <span className="text-xs font-black text-slate-905 dark:text-white">{n.title}</span>
                            <p className="text-[11px] text-slate-500 dark:text-gray-405 mt-1 font-semibold">{n.body}</p>
                            <span className="text-[9px] text-slate-400 dark:text-gray-500 mt-1.5 font-mono">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown or Apply Button - Desktop Only */}
            {currentUser ? (
              <div className="hidden md:flex items-center space-x-1.5 border-l border-slate-200 dark:border-white/10 pl-2">
                <button
                  id="navbar-profile-btn"
                  onClick={onOpenMyProfile}
                  className="flex items-center space-x-1.5 text-left hover:opacity-85 transition group cursor-pointer"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={currentUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.full_name}`}
                    alt={currentUser.full_name}
                    className="w-7 h-7 rounded-full border border-brand-primary/30 object-cover shadow-xs bg-slate-100"
                  />
                  <div className="hidden lg:flex flex-col">
                    <span className="text-xs font-black text-slate-800 dark:text-white leading-none whitespace-nowrap">{currentUser.full_name}</span>
                    <span className="text-[9px] text-slate-400 dark:text-gray-400 font-bold capitalize mt-0.5">{currentUser.role.replace('_', ' ')}</span>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden md:flex px-3.5 py-1.5 rounded-full bg-brand-primary text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md hover:bg-brand-primary/95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                Apply / Login
              </button>
            )}

            {/* Hamburger Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden p-1.5 rounded-xl text-slate-500 hover:text-slate-900 border border-slate-200 dark:border-white/10 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer ml-1 relative"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              {!mobileMenuOpen && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Dynamic Slidedown Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-collapsible-menu" className="md:hidden border-t border-slate-200 dark:border-brand-navy/60 bg-white/98 dark:bg-brand-dark/98 backdrop-blur-md px-4 py-5 space-y-5 shadow-lg transition-all duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto">
          
          {/* Section: Main Tabs Link list */}
          <div className="space-y-1">
            <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2 px-1">
              Navigation Menu
            </h5>
            {[
              { id: 'landing', label: 'Ecosystem Portal' },
              { id: 'explore', label: 'Explore Catalog' },
              { id: 'startupzone', label: 'StartupZone' },
              { id: 'feed', label: 'Feed updates' }
            ].map(item => (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {activeTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            ))}
          </div>

          {/* Section: Controls & Selectors on Mobile */}
          <div className="pt-4 border-t border-slate-100 dark:border-brand-navy/30 space-y-4">
            
            {/* Custom Mode Switcher */}
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2 px-1">
                Active Registry Mode
              </h5>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-brand-navy p-1 rounded-xl border border-slate-200 dark:border-white/5">
                <button
                  id="mobile-mode-ecosystem"
                  onClick={() => {
                    setMode('ecosystem');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeMode === 'ecosystem'
                      ? 'bg-brand-primary text-white shadow-xs font-extrabold'
                      : 'text-slate-500 dark:text-gray-400 font-semibold'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  Ecosystem
                </button>
                <button
                  id="mobile-mode-campus"
                  onClick={() => {
                    setMode('campus');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeMode === 'campus'
                      ? 'bg-brand-primary text-white shadow-xs font-extrabold'
                      : 'text-slate-500 dark:text-gray-400 font-semibold'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  Campus
                </button>
              </div>
            </div>

            {/* Custom Network Switcher */}
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2 px-1">
                Ecosystem Network Segment
              </h5>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-brand-navy p-1 rounded-xl border border-slate-200 dark:border-white/5">
                <button
                  id="mobile-net-tg10x"
                  onClick={() => {
                    setNetwork('TG10X');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    activeNetwork === 'TG10X'
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'text-slate-500 dark:text-gray-400'
                  }`}
                >
                  TG10X
                </button>
                <button
                  id="mobile-net-bh10x"
                  onClick={() => {
                    setNetwork('BH10X');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    activeNetwork === 'BH10X'
                      ? 'bg-slate-450 text-white shadow-xs'
                      : 'text-slate-500 dark:text-gray-400'
                  }`}
                >
                  BH10X
                </button>
              </div>
            </div>

            {/* Theme selector row context */}
            <div className="flex items-center justify-between pt-1 px-1">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-450 dark:text-gray-405">
                Display theme appearance
              </span>
              <div className="flex bg-slate-50 dark:bg-brand-navy rounded-lg p-0.5 border border-slate-200 dark:border-white/5">
                <button
                  id="mobile-theme-light"
                  onClick={() => {
                    setTheme('light');
                  }}
                  className={`p-1.5 px-3 rounded-md text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all duration-155 ${
                    mounted && resolvedTheme === 'light'
                      ? 'bg-white text-amber-500 shadow-xs font-black'
                      : 'text-slate-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  Light
                </button>
                <button
                  id="mobile-theme-dark"
                  onClick={() => {
                    setTheme('dark');
                  }}
                  className={`p-1.5 px-3 rounded-md text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all duration-155 ${
                    mounted && resolvedTheme === 'dark'
                      ? 'bg-brand-primary text-white shadow-xs font-black'
                      : 'text-slate-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Dark
                </button>
              </div>
            </div>

            {/* Section: User Account & Action Center */}
            <div className="pt-4 border-t border-slate-100 dark:border-brand-navy/30">
              {currentUser ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-brand-navy/40 p-3 rounded-2xl border border-slate-150 dark:border-white/5">
                    <img
                      referrerPolicy="no-referrer"
                      src={currentUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.full_name}`}
                      alt={currentUser.full_name}
                      className="w-10 h-10 rounded-xl object-cover border border-brand-primary/30"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {currentUser.full_name}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-gray-400 font-bold capitalize mt-0.5">
                        {currentUser.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Live Notifications List preview */}
                  {notifications.length > 0 && (
                    <div className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-150 dark:border-white/5">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-450 dark:text-gray-500">
                          Latest Notifications ({unreadCount} new)
                        </span>
                      </div>
                      <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800 max-h-40 overflow-y-auto">
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              onMarkRead(n.id);
                            }}
                            className={`pt-2 first:pt-0 pb-1.5 cursor-pointer flex flex-col ${!n.is_read ? 'opacity-100' : 'opacity-60'}`}
                          >
                            <div className="flex items-center gap-1.5">
                              {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />}
                              <span className="text-[10px] font-bold text-slate-800 dark:text-gray-200 line-clamp-1">{n.title}</span>
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-gray-400 line-clamp-2 mt-0.5 font-medium">{n.body}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="mobile-view-profile-btn"
                      onClick={() => {
                        onOpenMyProfile();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-brand-navy/30 dark:hover:bg-brand-navy/60 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 border border-slate-200/50 dark:border-white/5 shadow-3xs"
                    >
                      <User className="w-3.5 h-3.5 text-brand-primary" />
                      My Profile
                    </button>
                    <button
                      id="mobile-logout-btn"
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 border border-rose-150/50 dark:border-rose-950/30 shadow-3xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  id="mobile-login-btn"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-brand-primary text-white font-extrabold text-xs uppercase tracking-widest shadow-sm hover:shadow-md hover:bg-brand-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-brand-primary/10"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Apply / Sign In
                </button>
              )}
            </div>

          </div>

        </div>
      )}
    </nav>
  );
}
