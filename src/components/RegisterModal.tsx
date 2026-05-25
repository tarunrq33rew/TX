import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  Coins,
  MapPin,
  Camera,
  Compass,
  CornerDownRight,
  School,
  Briefcase,
  Landmark,
  X,
  Target,
  Key,
  Mail,
  ArrowRight,
  Lock,
  Sparkles
} from 'lucide-react';

interface RegisterModalProps {
  onClose: () => void;
  onAuthSuccess: (user: any, message?: string) => void;
}

export default function RegisterModal({ onClose, onAuthSuccess }: RegisterModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alertError, setAlertError] = useState<string | null>(null);

  // Sign Up Form Data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    username: '',
    role: 'startup_founder',
    city: 'Hyderabad',
    state: 'Telangana',
    avatar_url: '',
    // Specialized questions
    company_name: '',
    tagline: '',
    description: '',
    stage: 'seed',
    industry: 'DeepTech',
    firm_name: '',
    investor_type: 'angel',
    ticket_size_min: '500000',
    ticket_size_max: '3000000',
    years_of_experience: '5',
    expertise: 'Growth Marketing, Sales Scaling',
    org_name: '',
    programs_offered: 'Incubation, Seed Grant',
    firm_name_partner: '',
    service_categories: 'legal'
  });

  // Login Form Data
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [avatarPreview, setAvatarPreview] = useState('');

  const rolesList = [
    { id: 'startup_founder', label: 'Startup Founder', icon: Target, desc: 'Building a technology startup or deep-tech product' },
    { id: 'investor', label: 'Ecosystem Investor', icon: Coins, desc: 'Angel syndicates, venture capitalists, family offices' },
    { id: 'mentor', label: 'Expert Mentor', icon: Award, desc: 'Guiding younger ventures, sharing tech/marketing coaching' },
    { id: 'ecosystem_enabler', label: 'Ecosystem Enabler', icon: Landmark, desc: 'Inclusion Hubs, accelerators, government agencies, NGOs' },
    { id: 'job_seeker', label: 'Job Seeker', icon: Briefcase, desc: 'Seeking tech, content, design roles inside startups' },
    { id: 'service_partner', label: 'Service Partner', icon: Users, desc: 'Offering legal incorporation, SaaS accounts, HR, design' },
    { id: 'aspiring_entrepreneur', label: 'Aspiring Entrepreneur', icon: School, desc: 'Students or operators gearing up to start a venture' }
  ];

  const handleNext = () => {
    setAlertError(null);
    if (step === 1 && (!formData.email || !formData.full_name || !formData.username || !formData.password)) {
      setAlertError("Please fill in your primary details and set a password.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setAlertError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleRoleSelect = (roleId: string) => {
    setFormData(prev => ({ ...prev, role: roleId }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    setAvatarPreview(url);
  };

  // Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError(null);
    setLoading(true);

    if (!loginEmail) {
      setAlertError("Please enter your email Address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword || undefined // fallback if blank helper
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onAuthSuccess(data.user, `Welcome back, ${data.user.full_name}!`);
      } else {
        setAlertError(data.error || "Login verification failed.");
      }
    } catch (err: any) {
      setAlertError("Network connection to login API failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle MultiStep Signup Final Submission
  const handleSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError(null);
    setLoading(true);

    // Assemble role specific fields
    const roleFields: any = {};
    if (formData.role === 'startup_founder') {
      roleFields.company_name = formData.company_name || 'My Startup Venture';
      roleFields.tagline = formData.tagline || 'Leading innovation';
      roleFields.description = formData.description;
      roleFields.stage = formData.stage;
      roleFields.industry = [formData.industry];
    } else if (formData.role === 'investor') {
      roleFields.firm_name = formData.firm_name || 'Personal Portfolio';
      roleFields.investor_type = formData.investor_type;
      roleFields.ticket_size_min = Number(formData.ticket_size_min);
      roleFields.ticket_size_max = Number(formData.ticket_size_max);
      roleFields.sectors_of_interest = ['SaaS', 'FinTech'];
    } else if (formData.role === 'mentor') {
      roleFields.years_of_experience = Number(formData.years_of_experience);
      roleFields.expertise_areas = formData.expertise.split(',').map(s => s.trim());
    } else if (formData.role === 'ecosystem_enabler') {
      roleFields.org_name = formData.org_name || 'Incubation Office';
      roleFields.programs_offered = [formData.programs_offered];
    } else if (formData.role === 'service_partner') {
      roleFields.firm_name = formData.firm_name_partner || 'Corporate Services';
      roleFields.service_categories = [formData.service_categories];
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          username: formData.username,
          role: formData.role,
          city: formData.city,
          state: formData.state,
          avatar_url: formData.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(formData.full_name),
          roleFields
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Complete current visual step
        setFormData(prev => ({ ...prev, ...data.user }));
        setStep(6);
      } else {
        setAlertError(data.error || "A registration error occurred on the server.");
        setStep(1); // Return to credential setup on error
      }
    } catch (err: any) {
      setAlertError("Database sandbox synchronization failed.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative transition-all duration-300">
        
        {/* Top bar with Toggle Switch */}
        <div className="bg-slate-50 dark:bg-slate-800/40 px-6 py-4 border-b border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-rose-500 text-white font-black text-xs font-mono">
              10X
            </span>
            <div>
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none block">
                MEMBERS PORTAL
              </span>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">
                {authMode === 'login' ? "Welcome back to 10X" : `Member Registration (Step ${step}/5)`}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-200/60 dark:bg-slate-800 p-1.5 rounded-xl">
            <button
              onClick={() => {
                setAuthMode('login');
                setAlertError(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 ${
                authMode === 'login'
                  ? 'bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setAlertError(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 ${
                authMode === 'register'
                  ? 'bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Register
            </button>
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Alert Banner */}
        {alertError && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-900/40 px-6 py-3 text-xs md:text-sm font-medium text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping flex-shrink-0" />
            <span className="flex-1">{alertError}</span>
          </div>
        )}

        {/* Core content wrapper */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto bg-white dark:bg-slate-900">
          
          {/* ===================================== */}
          {/* LOGIN VIEW                            */}
          {/* ===================================== */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto py-3">
              <div className="text-center pb-2">
                <Sparkles className="w-7 h-7 text-rose-500 mx-auto mb-2 animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                  Enter Secure Sandbox Portal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Connect and partner with high-potential synergy vectors
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. founder@myventure.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:border-rose-500 dark:bg-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Secured Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:border-rose-500 dark:bg-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-slate-400 border-t-white dark:border-slate-300 dark:border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="border border-indigo-150 bg-indigo-50/40 rounded-2xl p-4 mt-6">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secured Authentication Layer
                </h4>
                <p className="text-[11px] leading-relaxed text-indigo-800">
                  Secures verification workflows utilizing live accounts when configured.
                  Register a fresh corporate account or sign in with your active credentials to begin networking.
                </p>
              </div>
            </form>
          )}

          {/* ===================================== */}
          {/* REGISTER FLOW (MULTI STEP)           */}
          {/* ===================================== */}
          {authMode === 'register' && (
            <div className="space-y-4">
              
              {/* Step Progress Bar */}
              {step < 6 && (
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 flex rounded-full overflow-hidden mb-6">
                  {[1, 2, 3, 4, 5].map(idx => (
                    <div
                      key={idx}
                      className={`h-full flex-1 transition-all duration-300 ${
                        idx <= step ? 'bg-rose-500' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* STEP 1: Main Credentials */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleFormChange}
                      placeholder="e.g. Ramesh Goud"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:border-rose-500 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                        Creative Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleFormChange}
                        placeholder="e.g. ramesh_gotech"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:border-rose-500 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                        Professional Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="ramesh@myventure.co"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:border-rose-500 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                      Set Secure Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      placeholder="Minimum 6 characters for Supabase auth"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:border-rose-500 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Role Selection */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-2 leading-normal">
                    Select your predominant stakeholder role to customize listings, matchmaking tools, and platform filters.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rolesList.map(role => {
                      const Icon = role.icon;
                      return (
                        <div
                          key={role.id}
                          onClick={() => handleRoleSelect(role.id)}
                          className={`p-3.5 rounded-2xl border transition duration-200 cursor-pointer hover:border-rose-400 ${
                            formData.role === role.id
                              ? 'border-2 border-rose-500 bg-rose-50/10 dark:bg-rose-950/10'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`p-2 rounded-xl flex-shrink-0 ${formData.role === role.id ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                {role.label}
                              </h4>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                                {role.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Role Specific Fields */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Founder */}
                  {formData.role === 'startup_founder' && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Company / Venture Name
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleFormChange}
                          placeholder="e.g. Deccan Quantum Dynamics"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          one-liner description
                        </label>
                        <input
                          type="text"
                          name="tagline"
                          value={formData.tagline}
                          onChange={handleFormChange}
                          placeholder="e.g. Smart IoT systems for agricultural operations"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                            Core Stage
                          </label>
                          <select
                            name="stage"
                            value={formData.stage}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold dark:bg-slate-800 dark:text-white focus:outline-none"
                          >
                            <option value="idea">Idea Stage</option>
                            <option value="pre-seed">Pre-Seed</option>
                            <option value="seed">Seed Phase</option>
                            <option value="series-a">Series-A</option>
                            <option value="profitable">Profitable</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                            Industry Vertical
                          </label>
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold dark:bg-slate-800 dark:text-white focus:outline-none"
                          >
                            <option value="DeepTech">DeepTech / AI</option>
                            <option value="AgTech">AgTech</option>
                            <option value="SaaS">SaaS Enterprise</option>
                            <option value="EV">EV & Mobility</option>
                            <option value="HealthTech">HealthTech</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Brief summary describing your product
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleFormChange}
                          rows={3}
                          placeholder="Describe what your venture is building..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Investor */}
                  {formData.role === 'investor' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Investment Firm Name
                        </label>
                        <input
                          type="text"
                          name="firm_name"
                          value={formData.firm_name}
                          onChange={handleFormChange}
                          placeholder="e.g. Anthill Partners Syndicate"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                            Investor Class
                          </label>
                          <select
                            name="investor_type"
                            value={formData.investor_type}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold dark:bg-slate-800 dark:text-white focus:outline-none"
                          >
                            <option value="angel">Angel Investor</option>
                            <option value="vc">Venture Capitalist</option>
                            <option value="family_office">Family Office</option>
                            <option value="corporate_vc">Corporate CVC</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                            Preferred Currency
                          </label>
                          <input
                            type="text"
                            disabled
                            value="INR (Indian Rupee)"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 text-xs dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed font-medium"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                            Minimum Ticket (INR)
                          </label>
                          <input
                            type="number"
                            name="ticket_size_min"
                            value={formData.ticket_size_min}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                            Maximum Ticket (INR)
                          </label>
                          <input
                            type="number"
                            name="ticket_size_max"
                            value={formData.ticket_size_max}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mentor */}
                  {formData.role === 'mentor' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Years of Coaching Experience
                        </label>
                        <input
                          type="number"
                          name="years_of_experience"
                          value={formData.years_of_experience}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Expertise Areas (comma separated)
                        </label>
                        <input
                          type="text"
                          name="expertise"
                          value={formData.expertise}
                          onChange={handleFormChange}
                          placeholder="e.g. Sales Funnels, GTM, React, Cloud scaling"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Service Partner */}
                  {formData.role === 'service_partner' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Firm / Operations Title
                        </label>
                        <input
                          type="text"
                          name="firm_name_partner"
                          value={formData.firm_name_partner}
                          onChange={handleFormChange}
                          placeholder="e.g. Chandra Legal Partners"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Primary Category
                        </label>
                        <select
                          name="service_categories"
                          value={formData.service_categories}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold dark:bg-slate-800 dark:text-white focus:outline-none"
                        >
                          <option value="legal">Legal & Compliance</option>
                          <option value="accounting">Accounting & Audit</option>
                          <option value="tech">Tech / Web Development</option>
                          <option value="marketing">Growth & Brand Marketing</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Enabler */}
                  {formData.role === 'ecosystem_enabler' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Incubator / Organization Name
                        </label>
                        <input
                          type="text"
                          name="org_name"
                          value={formData.org_name}
                          onChange={handleFormChange}
                          placeholder="e.g. T-Hub Catalyst Catalyst"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                          Core Program Name
                        </label>
                        <input
                          type="text"
                          name="programs_offered"
                          value={formData.programs_offered}
                          onChange={handleFormChange}
                          placeholder="e.g. Lab32 Accelerator, Seed Capital"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Fallback descriptions */}
                  {(formData.role === 'job_seeker' || formData.role === 'aspiring_entrepreneur') && (
                    <div className="py-8 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
                      Awesome! Students, job seekers, and aspiring entrepreneurs are listed automatically inside our **Campus Mode**. No supplementary settings are required. Click Next to continue.
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Location */}
              {step === 4 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-rose-500 mx-auto" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Please let us know which region you operate from. Our non-profit network spans across multiple ecosystem nodes.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                        District / City
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold dark:bg-slate-800 dark:text-white"
                      >
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Warangal">Warangal</option>
                        <option value="Nizamabad">Nizamabad</option>
                        <option value="Khammam">Khammam</option>
                        <option value="Karimnagar">Karimnagar</option>
                        <option value="Secunderabad">Secunderabad</option>
                        <option value="Delhi">Noida / Delhi NCR</option>
                        <option value="Bangalore">Bangalore</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Final Photo & Submit */}
              {step === 5 && (
                <div className="space-y-5">
                  <p className="text-xs text-slate-550 dark:text-slate-450 text-center">
                    Select a professional avatar, upload your custom photo, or paste a web link to customize your card.
                  </p>

                  <div className="flex justify-center mb-2">
                    <div className="relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={avatarPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.full_name)}`}
                        alt="Photo Preview"
                        className="w-16 h-16 rounded-2xl object-cover bg-slate-100 border-2 border-rose-500 shadow-lg"
                      />
                      <span className="p-0.5 px-1.5 rounded bg-rose-500 text-white absolute -bottom-1 -right-1 font-mono text-[8px] font-extrabold tracking-wider">
                        PREVIEW
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4 max-w-md mx-auto">
                    {/* File Uploader button */}
                    <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 shadow-3xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Custom Profile Photo
                      </span>
                      <label className="inline-flex items-center px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer text-slate-700 dark:text-slate-300 transition-all duration-150 shadow-2xs">
                        <span>Upload Photo File</span>
                        <input
                          id="register-avatar-upload-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleAvatarSelect(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Presets Grid */}
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">
                        Or pick a professional preset
                      </span>
                      <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
                        {[
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
                        ].map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Avatar ${i}`}
                            onClick={() => handleAvatarSelect(url)}
                            className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 hover:border-rose-500 transition shadow-sm ${
                              avatarPreview === url ? 'border-rose-500 shadow-sm' : 'border-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Image URL text input */}
                    <div className="space-y-1">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Or paste direct photo web link
                      </span>
                      <input
                        id="register-avatar-url-input"
                        type="text"
                        value={avatarPreview.startsWith('data:') ? '' : avatarPreview}
                        onChange={(e) => handleAvatarSelect(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <form onSubmit={handleSubmitSignup} className="pt-4 flex justify-center flex-col items-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-rose-500/15 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-rose-300 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Create Secure Account</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">
                      🔐 Communicates with Supabase API for decentralized directory storage.
                    </p>
                  </form>
                </div>
              )}

              {/* STEP 6: Finished Onboarding Success Card */}
              {step === 6 && (
                <div className="text-center py-6 space-y-4 animate-scaleUp">
                  <span className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 inline-flex items-center justify-center animate-bounce">
                    <ShieldCheck className="w-8 h-8" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                      Ecosystem Profile Verified!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                      Your decentralized startup stakeholder identity card for <strong>{formData.full_name}</strong> was registered securely inside the system.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => onAuthSuccess(formData, `Successfully registered and logged into the portal!`)}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-50 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow transition cursor-pointer"
                    >
                      Activate Workspace Now
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom MultiStep Controls */}
              {step < 5 && (
                <div className="px-6 py-4 mt-6 border-t border-slate-100 dark:border-slate-850 flex justify-between bg-slate-50/50 dark:bg-slate-800/10 rounded-b-2xl">
                  <button
                    onClick={handlePrev}
                    disabled={step === 1}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 transition ${
                      step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 pointer'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-50 text-white text-xs font-black rounded-xl transition shadow cursor-pointer text-center"
                  >
                    Next Step
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
