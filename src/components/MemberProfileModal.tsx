import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Globe, Linkedin, Info, Phone, Mail, Award, Target, HelpCircle, CheckCircle, Save } from 'lucide-react';
import { User } from '../types';

interface MemberProfileModalProps {
  member: any;
  currentUser: User | null;
  onClose: () => void;
  onConnect: (id: string) => void;
  isSaved: boolean;
  onSave: () => void;
  onUpdateProfile?: (updatedUser: any) => void;
}

export default function MemberProfileModal({
  member,
  currentUser,
  onClose,
  onConnect,
  isSaved,
  onSave,
  onUpdateProfile
}: MemberProfileModalProps) {
  const [initMessage, setInitMessage] = useState(`Hi ${member.full_name}, I saw your profile in the TG10X directory. Let's connect to share opportunities and collaborate!`);
  const [sent, setSent] = useState(false);

  // Profile Edit Mode states
  const isOwnProfile = currentUser && member.id === currentUser.id;
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(member.full_name || '');
  const [bio, setBio] = useState(member.bio || '');
  const [city, setCity] = useState(member.city || 'Hyderabad');
  const [state, setState] = useState(member.state || 'Telangana');
  const [websiteUrl, setWebsiteUrl] = useState(member.website_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(member.linkedin_url || '');
  const [avatarUrl, setAvatarUrl] = useState(member.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSendRequest = () => {
    onConnect(member.id);
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setSaveError('Full Name is required.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (currentUser) {
        headers['Authorization'] = `Bearer ${currentUser.username}`;
      }
      const response = await fetch(`/api/users/${member.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          full_name: fullName,
          bio,
          city,
          state,
          website_url: websiteUrl,
          linkedin_url: linkedinUrl,
          avatar_url: avatarUrl,
          // Maintain nested structures to preserve them on save
          startup: member.startup,
          investor: member.investor,
          mentor: member.mentor,
          enabler: member.enabler,
          partner: member.partner
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsEditing(false);
        if (onUpdateProfile) {
          onUpdateProfile(data.user);
        }
      } else {
        setSaveError(data.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      setSaveError('Network error while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayAvatar = isEditing
    ? (avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`)
    : (member.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.full_name)}`);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative transition-all duration-350">
        
        {/* Header line banner */}
        <div className="relative h-28 bg-gradient-to-tr from-rose-500 to-indigo-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition z-10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar Offsetting */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-10 mb-4">
            <img
              referrerPolicy="no-referrer"
              src={currentDisplayAvatar}
              alt={fullName}
              className="w-20 h-20 rounded-2xl object-cover bg-white border-4 border-white dark:border-slate-900 shadow-md transition-all duration-200"
            />

            <div className="flex items-center space-x-2">
              {isOwnProfile ? (
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setSaveError(null);
                  }}
                  className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:border-rose-900/40 dark:text-rose-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              ) : (
                <button
                  onClick={onSave}
                  className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition ${
                    isSaved
                      ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/20'
                      : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-300 hover:opacity-90'
                  }`}
                >
                  {isSaved ? 'Bookmarked' : 'Add Bookmark'}
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            /* --- Edit Mode Form Controls --- */
            <div className="space-y-4 my-4 max-h-[380px] overflow-y-auto pr-1">
              {saveError && (
                <div className="bg-rose-50 dark:bg-rose-950/25 text-rose-500 text-xs p-3 rounded-xl border border-rose-200/50">
                  {saveError}
                </div>
              )}

              {/* Editing Avatar & File Upload Choice */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5">
                    Profile Image Upload
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      referrerPolicy="no-referrer"
                      src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`}
                      alt="Crop preview"
                      className="w-11 h-11 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100"
                    />
                    <div className="flex-1">
                      <label className="inline-flex items-center px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer text-slate-700 dark:text-slate-300">
                        <span>Upload Photo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setAvatarUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[9px] text-slate-400 mt-1">Converts to a highly compatible Base64 string for offline storage</p>
                    </div>
                  </div>
                </div>

                {/* Pick preset avatar list */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">
                    Or pick an existing professional preset
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
                      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
                    ].map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Preset ${i}`}
                        onClick={() => setAvatarUrl(url)}
                        className={`w-9 h-9 object-cover rounded-xl cursor-pointer border-2 hover:border-rose-500 transition-all ${
                          avatarUrl === url ? 'border-rose-500 shadow-sm' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Direct photo URL */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">
                    Or paste direct web photo URL
                  </label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Full Name input */}
              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:bg-slate-800 dark:text-white"
                  placeholder="e.g. Ramesh Reddy"
                />
              </div>

              {/* Professional Bio */}
              <div>
                <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:bg-slate-800 dark:text-white"
                  placeholder="Tell us about yourself, your goals, and what you represent..."
                />
              </div>

              {/* Geopositioning City and State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:bg-slate-800 dark:text-white"
                    placeholder="e.g. Noida / Hyderabad"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:bg-slate-800 dark:text-white"
                    placeholder="e.g. NCR / Telangana"
                  />
                </div>
              </div>

              {/* Social networking credentials links */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">
                    Venture Web URL
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={e => setWebsiteUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:bg-slate-800 dark:text-white"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:bg-slate-800 dark:text-white"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>
          ) : (
            /* --- Display Mode View Block --- */
            <>
              {/* Profile Name Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-slate-950 dark:text-white">
                    {member.full_name}
                  </h2>
                  {member.is_verified && <ShieldCheck className="w-4.5 h-4.5 text-rose-500 fill-rose-50 dark:fill-transparent" />}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="capitalize font-black text-rose-500">{member.role.replace('_', ' ')}</span>
                  <span>•</span>
                  <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-0.5" />{member.city || 'Hyderabad'}, {member.state || 'Telangana'}</span>
                </div>
              </div>

              {/* Website / LinkedIn links */}
              <div className="flex space-x-2 pt-3">
                {member.website_url && (
                  <a href={member.website_url} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-rose-500 hover:opacity-80">
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    Venture Website
                  </a>
                )}
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-indigo-500 hover:opacity-80 pl-3 border-l">
                    <Linkedin className="w-3.5 h-3.5 mr-1" />
                    LinkedIn Profile
                  </a>
                )}
              </div>

              {/* Bio block */}
              <div className="mt-5">
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Professional Bio</h4>
                <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 pb-3 border-b border-slate-100 leading-relaxed dark:border-slate-800">
                  {member.bio || "No professional overview or customized biography statement specified for this community stakeholder profile."}
                </p>
              </div>

              {/* Core role specific features metadata */}
              <div className="mt-4">
                {member.role === 'startup_founder' && member.startup && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between font-black uppercase text-[10px]">
                      <span className="text-rose-500">🏢 Startup Enterprise Details</span>
                      <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 px-1.5 rounded">{member.startup.stage}</span>
                    </div>
                    <p className="font-extrabold text-slate-800 dark:text-white">Company: {member.startup.company_name}</p>
                    <p className="text-slate-500 italic mt-0.5">"{member.startup.tagline}"</p>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{member.startup.description || "Building and scaling a novel service delivery product based in Telangana."}</p>
                  </div>
                )}

                {member.role === 'investor' && member.investor && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between font-black uppercase text-[10px]">
                      <span className="text-amber-500">💰 Capital Investor Details</span>
                      <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 px-1.5 rounded">{member.investor.investor_type}</span>
                    </div>
                    <p className="font-extrabold text-slate-800 dark:text-white">Syndicate: {member.investor.firm_name}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="font-bold text-slate-500">Target Stages:</span>
                      {(member.investor.investment_stages || ['Seed', 'Pre-A']).map((st: string) => (
                        <span key={st} className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">{st}</span>
                      ))}
                    </div>
                  </div>
                )}

                {member.role === 'mentor' && member.mentor && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between font-black uppercase text-[10px]">
                      <span className="text-teal-600">🏆 Certified Mentor Profile</span>
                      <span className="bg-teal-100 dark:bg-teal-950/40 text-teal-600 px-1.5 rounded">{member.mentor.years_of_experience} Yrs Exp</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(member.mentor.expertise_areas || []).map((exp: string) => (
                        <span key={exp} className="bg-teal-50 dark:bg-teal-950/20 text-teal-600 px-2 py-0.5 rounded-lg border border-teal-250">
                          {exp}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-400 mt-1 text-[10px] uppercase font-mono tracking-wider">Availability: {member.mentor.availability}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Interactive Connection Form/Status OR Editing controls */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full py-2.5 bg-gradient-to-tr from-rose-500 to-rose-600 hover:opacity-95 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-slate-250 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Customized Profile</span>
                  </>
                )}
              </button>
            ) : isOwnProfile ? (
              <div className="bg-slate-50 text-slate-500 dark:bg-slate-805/40 text-[11px] p-3 rounded-xl font-bold text-center">
                ✨ You are viewing your own public ecosystem profile card view.
              </div>
            ) : sent ? (
              <div className="bg-emerald-50 text-emerald-605 dark:bg-emerald-950/30 p-3 rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 animate-pulse">
                <CheckCircle className="w-4 h-4" />
                Connection Proposal Pitch Transmitted!
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Accompanying Pitch Message
                </label>
                <textarea
                  rows={2}
                  value={initMessage}
                  onChange={e => setInitMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs dark:bg-slate-800 dark:text-white"
                />
                <button
                  onClick={handleSendRequest}
                  className="w-full py-2.5 bg-gradient-to-tr from-rose-500 to-rose-600 hover:opacity-95 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow cursor-pointer"
                >
                  Send synergy request
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
