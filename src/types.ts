export type UserRole =
  | 'startup_founder'
  | 'investor'
  | 'mentor'
  | 'job_seeker'
  | 'aspiring_entrepreneur'
  | 'corporate_innovation'
  | 'service_partner'
  | 'msme'
  | 'ecosystem_enabler'
  | 'admin';

export type UserNetwork = 'TG10X' | 'BH10X';
export type UserMode = 'ecosystem' | 'campus';

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_seen_at?: string;
  network: UserNetwork;
  mode: UserMode;
}

export interface StartupProfile {
  id: string;
  user_id: string;
  company_name: string;
  tagline: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  industry: string[];
  stage: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth' | 'profitable';
  founded_year?: number;
  team_size: number;
  revenue_range?: string;
  funding_raised?: number;
  funding_currency: string;
  is_hiring: boolean;
  website?: string;
  pitch_deck_url?: string;
  sector_tags: string[];
  location?: string;
  city?: string;
  state?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvestorProfile {
  id: string;
  user_id: string;
  firm_name: string;
  firm_logo_url?: string;
  investor_type: 'angel' | 'vc' | 'family_office' | 'corporate_vc' | 'government_fund';
  investment_stages: string[];
  sectors_of_interest: string[];
  ticket_size_min: number;
  ticket_size_max: number;
  currency?: string;
  portfolio_count: number;
  notable_investments: string[];
  investment_thesis?: string;
  is_actively_investing: boolean;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface MentorProfile {
  id: string;
  user_id: string;
  expertise_areas: string[];
  industries: string[];
  years_of_experience: number;
  current_company?: string;
  current_role?: string;
  mentorship_style?: string;
  availability: 'available' | 'limited' | 'unavailable';
  session_type: 'free' | 'paid' | 'equity';
  mentees_count: number;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EcosystemEnabler {
  id: string;
  user_id: string;
  org_name: string;
  org_type: 'incubator' | 'accelerator' | 'government' | 'ngo' | 'academic' | 'corporate' | 'community';
  programs_offered: string[];
  sectors_focus: string[];
  org_logo_url?: string;
  org_website?: string;
  location?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ServicePartner {
  id: string;
  user_id: string;
  service_categories: ('legal' | 'accounting' | 'design' | 'marketing' | 'tech' | 'hr' | 'finance' | 'consulting')[];
  firm_name: string;
  firm_logo?: string;
  description: string;
  verified_startup_clients: number;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  created_by: string;
  type: 'job' | 'funding' | 'grant' | 'event' | 'partnership' | 'cofounder' | 'internship';
  title: string;
  description: string;
  company_name: string;
  company_logo_url?: string;
  location?: string;
  is_remote: boolean;
  salary_range_min?: number;
  salary_range_max?: number;
  equity_offered?: string;
  funding_amount?: number;
  deadline?: string;
  tags: string[];
  status: 'active' | 'closed' | 'draft';
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface AIMatch {
  id: string;
  user_id: string;
  matched_user_id: string;
  match_type: 'investor_startup' | 'mentor_founder' | 'cofounder' | 'job_candidate';
  score: number;
  reasons: string[];
  recommended_intro_message?: string;
  is_dismissed: boolean;
  created_at: string;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
}

export interface FeedPost {
  id: string;
  author_id: string;
  content: string;
  media_urls?: string[];
  post_type: 'update' | 'achievement' | 'ask' | 'job' | 'funding' | 'event';
  tags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  likes_count: number;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  target_id: string;
  target_type: 'post' | 'comment' | 'listing';
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  action_url?: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'profile' | 'listing' | 'event' | 'post';
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event_type: string;
  metadata?: Record<string, any>;
  ip?: string;
  user_agent?: string;
  created_at: string;
}
