-- ====================================================================================
-- 10X MEMBER PORTAL & ECOSYSTEM REGISTRY
-- SQL Setup Schema for Supabase (Idempotent & Safe Patch)
-- ====================================================================================
--
-- 💡 TROUBLESHOOTING "ERROR: 42P07: relation \"profiles\" already exists"
--
-- This error occurs because Supabase Starter Templates automatically create a default
-- "profiles" table with "id uuid REFERENCES auth.users".
-- 
-- To resolve this, you have two simple choices based on your preference:
--
-- 👉 OPTION A: CLEAN RE-INITIALIZATION (Recommended for Dev Sandbox / New Projects)
--    If you don't have active production users yet, run this block FIRST to clean the slate:
--
--    DROP TABLE IF EXISTS analytics_events CASCADE;
--    DROP TABLE IF EXISTS saved_items CASCADE;
--    DROP TABLE IF EXISTS notifications CASCADE;
--    DROP TABLE IF EXISTS likes CASCADE;
--    DROP TABLE IF EXISTS comments CASCADE;
--    DROP TABLE IF EXISTS feed_posts CASCADE;
--    DROP TABLE IF EXISTS listings CASCADE;
--    DROP TABLE IF EXISTS service_partners CASCADE;
--    DROP TABLE IF EXISTS ecosystem_enablers CASCADE;
--    DROP TABLE IF EXISTS mentor_profiles CASCADE;
--    DROP TABLE IF EXISTS investor_profiles CASCADE;
--    DROP TABLE IF EXISTS startup_profiles CASCADE;
--    DROP TABLE IF EXISTS profiles CASCADE;
--
-- 👉 OPTION B: SAFE SURGICAL PATCH (If you must retain existing "profiles" data)
--    Simply skip the "CREATE TABLE IF NOT EXISTS profiles" block and run the ALTER TABLE
--    statements starting at Line 63 to append the required metadata elements safely.
--
-- ====================================================================================

-- 1. Profiles (Main Stakeholder Registry)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY, -- Supports both Supabase UUID and String Seed IDs
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    phone TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    role TEXT NOT NULL DEFAULT 'startup_founder',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ,
    network TEXT NOT NULL DEFAULT 'TG10X',
    mode TEXT NOT NULL DEFAULT 'ecosystem'
);

-- Ensure all profiles have necessary columns even if table existed already (e.g. from Supabase default template)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'startup_founder';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS network TEXT DEFAULT 'TG10X';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'ecosystem';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url TEXT;

-- 2. Startup Profiles
CREATE TABLE IF NOT EXISTS startup_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    industry TEXT[] DEFAULT '{}',
    stage TEXT DEFAULT 'idea',
    founded_year INTEGER,
    team_size INTEGER DEFAULT 1,
    revenue_range TEXT,
    funding_raised NUMERIC DEFAULT 0,
    funding_currency TEXT DEFAULT 'INR',
    is_hiring BOOLEAN DEFAULT FALSE,
    website TEXT,
    pitch_deck_url TEXT,
    sector_tags TEXT[] DEFAULT '{}',
    location TEXT,
    city TEXT,
    state TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Investor Profiles
CREATE TABLE IF NOT EXISTS investor_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    firm_name TEXT NOT NULL,
    firm_logo_url TEXT,
    investor_type TEXT DEFAULT 'angel',
    investment_stages TEXT[] DEFAULT '{}',
    sectors_of_interest TEXT[] DEFAULT '{}',
    ticket_size_min NUMERIC DEFAULT 0,
    ticket_size_max NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    portfolio_count INTEGER DEFAULT 0,
    notable_investments TEXT[] DEFAULT '{}',
    investment_thesis TEXT,
    is_actively_investing BOOLEAN DEFAULT TRUE,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Mentor Profiles
CREATE TABLE IF NOT EXISTS mentor_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    expertise_areas TEXT[] DEFAULT '{}',
    industries TEXT[] DEFAULT '{}',
    years_of_experience INTEGER DEFAULT 0,
    current_company TEXT,
    "current_role" TEXT,
    mentorship_style TEXT,
    availability TEXT DEFAULT 'available',
    session_type TEXT DEFAULT 'free',
    mentees_count INTEGER DEFAULT 0,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ecosystem Enablers (Accelerators, Labs, etc.)
CREATE TABLE IF NOT EXISTS ecosystem_enablers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    org_name TEXT NOT NULL,
    org_type TEXT DEFAULT 'incubator',
    programs_offered TEXT[] DEFAULT '{}',
    sectors_focus TEXT[] DEFAULT '{}',
    org_logo_url TEXT,
    org_website TEXT,
    location TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Service Partners (Legal, Tech, CA, HR)
CREATE TABLE IF NOT EXISTS service_partners (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_categories TEXT[] DEFAULT '{}',
    firm_name TEXT NOT NULL,
    firm_logo TEXT,
    description TEXT,
    verified_startup_clients INTEGER DEFAULT 0,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Listings (Job Postings, Funding notices, Grants, Events)
CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    created_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'job', 'funding', 'grant', 'event', 'partnership'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_logo_url TEXT,
    location TEXT,
    is_remote BOOLEAN DEFAULT FALSE,
    salary_range_min NUMERIC,
    salary_range_max NUMERIC,
    equity_offered TEXT,
    funding_amount NUMERIC,
    deadline TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active',
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Feed Posts
CREATE TABLE IF NOT EXISTS feed_posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    post_type TEXT DEFAULT 'update',
    tags TEXT[] DEFAULT '{}',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Post Comments
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Connections (Social Networking Sync)
CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    requester_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'blocked'
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (requester_id, receiver_id)
);

-- Ensure connections table has created_at
ALTER TABLE connections ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 11. Likes (Atomic Upvotes tracker)
CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL, -- 'post', 'comment', 'listing'
    UNIQUE(user_id, target_id, target_type)
);

-- 12. Saved items (Bookmarks)
CREATE TABLE IF NOT EXISTS saved_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_id, item_type)
);

-- 13. System Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure notifications table has body
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS body TEXT;

-- =====================================================================
-- 💡 SELF-HEALING COLUMN PATCHES & SURGICAL FIXES
-- Ensure that if tables already existed from standard template generation,
-- they dynamically receive all necessary columns and columns match exact casing.
-- =====================================================================

-- 1. Profiles Table Healing
-- Drop strict foreign key constraints targeting auth.users so local seed data can sync seamlessly
ALTER TABLE ONLY public.profiles DROP CONSTRAINT IF EXISTS "profiles_userId_fkey" CASCADE;
ALTER TABLE ONLY public.profiles DROP CONSTRAINT IF EXISTS "profiles_id_fkey" CASCADE;
ALTER TABLE ONLY public.profiles DROP CONSTRAINT IF EXISTS "profiles_user_id_fkey" CASCADE;

-- Safely make custom old columns nullable if they exist from standard templates to prevent constraints error
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='updatedAt') THEN
        ALTER TABLE public.profiles ALTER COLUMN "updatedAt" DROP NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='userId') THEN
        ALTER TABLE public.profiles ALTER COLUMN "userId" DROP NOT NULL;
    END IF;
END $$;

-- Ensure id column can store custom string IDs (e.g. seed data usr_founder_1)
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT;

-- Safely append missing columns for Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'startup_founder';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS network TEXT DEFAULT 'TG10X';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'ecosystem';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url TEXT;

-- 2. Connections Table Healing
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS requester_id TEXT;
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS receiver_id TEXT;
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Notifications Table Healing
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS action_url TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Feed Posts Table Healing
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS author_id TEXT;
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}';
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'update';
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Comments Table Healing
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS post_id TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS author_id TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_comment_id TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 14. Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- Disable Row Level Security & Create permissive policies dynamically
-- =====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_enablers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Creating permissive policies safely (dropping if exists first)
DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON profiles;
CREATE POLICY "Enable read/write bypass for everyone" ON profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON startup_profiles;
CREATE POLICY "Enable read/write bypass for everyone" ON startup_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON investor_profiles;
CREATE POLICY "Enable read/write bypass for everyone" ON investor_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON mentor_profiles;
CREATE POLICY "Enable read/write bypass for everyone" ON mentor_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON ecosystem_enablers;
CREATE POLICY "Enable read/write bypass for everyone" ON ecosystem_enablers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON service_partners;
CREATE POLICY "Enable read/write bypass for everyone" ON service_partners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON listings;
CREATE POLICY "Enable read/write bypass for everyone" ON listings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON feed_posts;
CREATE POLICY "Enable read/write bypass for everyone" ON feed_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON comments;
CREATE POLICY "Enable read/write bypass for everyone" ON comments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON connections;
CREATE POLICY "Enable read/write bypass for everyone" ON connections FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON likes;
CREATE POLICY "Enable read/write bypass for everyone" ON likes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON saved_items;
CREATE POLICY "Enable read/write bypass for everyone" ON saved_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON notifications;
CREATE POLICY "Enable read/write bypass for everyone" ON notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read/write bypass for everyone" ON analytics_events;
CREATE POLICY "Enable read/write bypass for everyone" ON analytics_events FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance speed-ups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_feed_posts_author ON feed_posts(author_id);
