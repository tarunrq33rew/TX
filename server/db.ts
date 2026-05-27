import fs from 'fs';
import path from 'path';
import { getSupabase } from './supabase';
import {
  User,
  StartupProfile,
  InvestorProfile,
  MentorProfile,
  EcosystemEnabler,
  ServicePartner,
  Listing,
  Connection,
  AIMatch,
  FeedPost,
  Comment,
  Like,
  Notification,
  SavedItem,
  AnalyticsEvent
} from '../src/types';
import {
  SEED_USERS,
  SEED_STARTUPS,
  SEED_INVESTORS,
  SEED_MENTORS,
  SEED_ENABLERS,
  SEED_SERVICE_PARTNERS,
  SEED_LISTINGS,
  SEED_POSTS,
  SEED_POST_COMMENTS
} from '../src/data/seedData';

interface DbSchema {
  users: User[];
  startup_profiles: StartupProfile[];
  investor_profiles: InvestorProfile[];
  mentor_profiles: MentorProfile[];
  ecosystem_enablers: EcosystemEnabler[];
  service_partners: ServicePartner[];
  listings: Listing[];
  connections: Connection[];
  ai_matches: AIMatch[];
  feed_posts: FeedPost[];
  comments: Comment[];
  likes: Like[];
  notifications: Notification[];
  saved_items: SavedItem[];
  analytics_events: AnalyticsEvent[];
}

const DB_FILE = path.join(process.cwd(), 'server_temp_db.json');

class Database {
  private missingTables: Set<string> = new Set();
  private missingColumnsByTable: Record<string, Set<string>> = {};
  private activeSchemaWarnings: string[] = [];

  public getSupabaseSyncErrors() {
    return {
      missingTables: Array.from(this.missingTables),
      missingColumns: Object.keys(this.missingColumnsByTable).reduce((acc: any, table) => {
        acc[table] = Array.from(this.missingColumnsByTable[table]);
        return acc;
      }, {}),
      warnings: this.activeSchemaWarnings
    };
  }

  private data: DbSchema = {
    users: [],
    startup_profiles: [],
    investor_profiles: [],
    mentor_profiles: [],
    ecosystem_enablers: [],
    service_partners: [],
    listings: [],
    connections: [],
    ai_matches: [],
    feed_posts: [],
    comments: [],
    likes: [],
    notifications: [],
    saved_items: [],
    analytics_events: []
  };

  constructor() {
    this.load();
    this.loadFromSupabase();
  }

  private async loadFromSupabase() {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      console.log("Supabase active. Attempting to ingest live PostgreSQL dynamic state...");
      
      const loadTable = async (tableName: string) => {
        if (this.missingTables.has(tableName)) return null;
        try {
          const { data, error } = await supabase.from(tableName).select('*');
          if (error) {
            console.error("Supabase Error:", error.message, error);
            const msg = error.message;
            const tableMatch = msg.match(/Could not find the table 'public\.([^']+)' in the schema cache/i);
            if (tableMatch) {
              this.missingTables.add(tableMatch[1]);
              const warningMsg = `Supabase setup warning: Table '${tableMatch[1]}' is missing. Apply 'supabase_setup.sql' to initialize.`;
              if (!this.activeSchemaWarnings.includes(warningMsg)) {
                this.activeSchemaWarnings.push(warningMsg);
              }
            }
            console.warn(`Supabase load error on table '${tableName}':`, msg);
            return null;
          }
          return data;
        } catch (err: any) {
          console.error("Supabase Error:", err.message, err);
          console.warn(`Could not load table '${tableName}' from Supabase:`, err.message || err);
          return null;
        }
      };

      const [
        users,
        startups,
        investors,
        mentors,
        enablers,
        partners,
        listings,
        connections,
        feed_posts,
        comments,
        likes,
        notifications,
        saved_items
      ] = await Promise.all([
        loadTable('profiles'),
        loadTable('startup_profiles'),
        loadTable('investor_profiles'),
        loadTable('mentor_profiles'),
        loadTable('ecosystem_enablers'),
        loadTable('service_partners'),
        loadTable('listings'),
        loadTable('connections'),
        loadTable('feed_posts'),
        loadTable('comments'),
        loadTable('likes'),
        loadTable('notifications'),
        loadTable('saved_items')
      ]);

      if (users && users.length > 0) this.data.users = users;
      if (startups && startups.length > 0) this.data.startup_profiles = startups;
      if (investors && investors.length > 0) this.data.investor_profiles = investors;
      if (mentors && mentors.length > 0) this.data.mentor_profiles = mentors;
      if (enablers && enablers.length > 0) this.data.ecosystem_enablers = enablers;
      if (partners && partners.length > 0) this.data.service_partners = partners;
      if (listings && listings.length > 0) this.data.listings = listings;
      if (connections && connections.length > 0) this.data.connections = connections;
      if (feed_posts && feed_posts.length > 0) this.data.feed_posts = feed_posts;
      if (comments && comments.length > 0) this.data.comments = comments;
      if (likes && likes.length > 0) this.data.likes = likes;
      if (notifications && notifications.length > 0) this.data.notifications = notifications;
      if (saved_items && saved_items.length > 0) this.data.saved_items = saved_items;

      console.log(`Supabase state ingestion complete. Loaded ${this.data.users.length} profiles from live PostgreSQL.`);
    } catch (err: any) {
      console.warn("Could not load startup tables from Supabase yet. Have you executed the SQL setup script? Fallback to server JSON active.", err.message || err);
    }
  }

  private syncToSupabase(table: string, record: any) {
    const supabase = getSupabase();
    if (!supabase) return;

    if (this.missingTables.has(table)) {
      return; // Sync bypassed for known missing tables
    }

    const sanitizedRecord = { ...record };

    // Safety strip for internal credential properties
    if (table === 'profiles') {
      delete sanitizedRecord['password_hash'];
      delete sanitizedRecord['password'];
    }

    // Normalize camelCase fields to snake_case (Supabase uses snake_case columns)
    const camelToSnakeMap: Record<string, string> = {
      'userId': 'user_id',
      'authorId': 'author_id',
      'postId': 'post_id',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'actionUrl': 'action_url',
      'isRead': 'is_read',
      'targetId': 'target_id',
      'targetType': 'target_type',
      'requesterId': 'requester_id',
      'receiverId': 'receiver_id',
      'itemId': 'item_id',
      'itemType': 'item_type',
      'likesCount': 'likes_count',
      'commentsCount': 'comments_count',
      'sharesCount': 'shares_count',
      'viewsCount': 'views_count',
      'applicationsCount': 'applications_count',
      'isPinned': 'is_pinned',
      'mediaUrls': 'media_urls',
      'postType': 'post_type',
      'parentCommentId': 'parent_comment_id',
      'fullName': 'full_name',
      'avatarUrl': 'avatar_url',
      'createdBy': 'created_by',
    };

    // If record has a camelCase key, ensure its value goes into the snake_case key
    for (const [camel, snake] of Object.entries(camelToSnakeMap)) {
      if (sanitizedRecord[camel] !== undefined) {
        // Only set snake_case if not already present
        if (sanitizedRecord[snake] === undefined) {
          sanitizedRecord[snake] = sanitizedRecord[camel];
        }
        // Remove the camelCase key so it doesn't get sent to Supabase
        delete sanitizedRecord[camel];
      }
    }

    // Ensure notifications have required 'content' field (Supabase NOT NULL)
    if (table === 'notifications') {
      if (!sanitizedRecord.content) {
        sanitizedRecord.content = sanitizedRecord.body || sanitizedRecord.title || '';
      }
    }

    // Dynamic field filtering based on checked missing schema attributes
    if (this.missingColumnsByTable[table]) {
      this.missingColumnsByTable[table].forEach(col => {
        delete sanitizedRecord[col];
      });
    }

    supabase.from(table).upsert(sanitizedRecord)
      .then(({ error }: { error: any }) => {
        if (error) {
          const msg = error.message;

          // Detect missing table
          const tableMatch = msg.match(/Could not find the table 'public\.([^']+)' in the schema cache/i);
          if (tableMatch) {
            const missingT = tableMatch[1];
            this.missingTables.add(missingT);
            const warningMsg = `Supabase setup warning: Table '${missingT}' is missing. Apply 'supabase_setup.sql' to initialize.`;
            if (!this.activeSchemaWarnings.includes(warningMsg)) {
              this.activeSchemaWarnings.push(warningMsg);
            }
            console.warn(`Supabase sync skipped: Table '${missingT}' is missing.`);
            return;
          }

          // Detect missing column — strip it and retry once
          const colMatch = msg.match(/Could not find the '([^']+)' column of '([^']+)' in the schema cache/i);
          if (colMatch) {
            const missingCol = colMatch[1];
            const targetTable = colMatch[2];
            
            if (!this.missingColumnsByTable[targetTable]) {
              this.missingColumnsByTable[targetTable] = new Set();
            }

            if (!this.missingColumnsByTable[targetTable].has(missingCol)) {
              this.missingColumnsByTable[targetTable].add(missingCol);
              console.log(`Healing schema: Stripping column '${missingCol}' from '${table}' and retrying.`);
              this.syncToSupabase(table, record);
              return;
            }
            // Already known missing column — silently skip
            return;
          }

          // Foreign key violations — log but don't retry (parent record may not exist in Supabase yet)
          if (error.code === '23503') {
            console.warn(`Supabase FK skip on '${table}': ${msg.substring(0, 120)}`);
            return;
          }

          // NOT NULL violations — log but don't retry
          if (error.code === '23502') {
            console.warn(`Supabase NOT NULL skip on '${table}': ${msg.substring(0, 120)}`);
            return;
          }

          // Other errors
          console.error(`Supabase sync error on '${table}':`, msg);
        }
      });
  }

  private deleteFromSupabase(table: string, id: string) {
    const supabase = getSupabase();
    if (!supabase) return;

    if (this.missingTables.has(table)) {
      return;
    }

    supabase.from(table).delete().eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error("Supabase Error:", error.message, error);
          console.error(`Supabase delete error on ${table}:`, error.message);
        } else {
          console.log(`Successfully deleted from Supabase table '${table}': ID ${id}`);
        }
      });
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        if (fileContent.includes('dhruvaspace') || fileContent.includes('usr_founder_1') || fileContent.includes('ramesh')) {
          console.log('Detected legacy seed database. Wiping for clean real-world mode...');
          this.resetToSeed();
        } else {
          this.data = JSON.parse(fileContent);
        }
      } else {
        this.resetToSeed();
      }
    } catch (e) {
      console.error('Error loading database, resetting to seed:', e);
      this.resetToSeed();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving database:', e);
    }
  }

  public resetToSeed() {
    this.data.users = [];
    this.data.startup_profiles = [];
    this.data.investor_profiles = [];
    this.data.mentor_profiles = [];
    this.data.ecosystem_enablers = [];
    this.data.service_partners = [];
    this.data.listings = [];
    this.data.feed_posts = [];
    this.data.comments = [];
    this.data.connections = [];
    this.data.ai_matches = [];
    this.data.likes = [];
    this.data.notifications = [];
    this.data.saved_items = [];
    this.data.analytics_events = [];

    this.save();
  }

  // --- Users Operations ---
  public getUsers() {
    return this.data.users;
  }

  public getUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByUsername(username: string) {
    if (!username) return undefined;
    return this.data.users.find(u => u.username?.toLowerCase() === username.toLowerCase());
  }

  public getUserByEmail(email: string) {
    if (!email) return undefined;
    return this.data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  }

  public addUser(user: User) {
    if (!(user as any).userId && user.id) {
      (user as any).userId = user.id;
    }
    this.data.users.push(user);
    this.save();
    this.syncToSupabase('profiles', user);
    return user;
  }

  public updateUser(id: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = {
        ...this.data.users[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      if (!(this.data.users[idx] as any).userId && this.data.users[idx].id) {
        (this.data.users[idx] as any).userId = this.data.users[idx].id;
      }
      this.save();
      this.syncToSupabase('profiles', this.data.users[idx]);
      return this.data.users[idx];
    }
    return null;
  }

  // --- Role Profiles Operations ---
  public getStartupProfileByUserId(userId: string) {
    return this.data.startup_profiles.find(p => p.user_id === userId);
  }

  public getInvestorProfileByUserId(userId: string) {
    return this.data.investor_profiles.find(p => p.user_id === userId);
  }

  public getMentorProfileByUserId(userId: string) {
    return this.data.mentor_profiles.find(p => p.user_id === userId);
  }

  public getEnablerProfileByUserId(userId: string) {
    return this.data.ecosystem_enablers.find(p => p.user_id === userId);
  }

  public getPartnerProfileByUserId(userId: string) {
    return this.data.service_partners.find(p => p.user_id === userId);
  }

  public createOrUpdateStartup(userId: string, profile: Partial<StartupProfile>) {
    const existingIdx = this.data.startup_profiles.findIndex(p => p.user_id === userId);
    if (existingIdx !== -1) {
      this.data.startup_profiles[existingIdx] = {
        ...this.data.startup_profiles[existingIdx],
        ...profile,
        updated_at: new Date().toISOString()
      };
      this.save();
      this.syncToSupabase('startup_profiles', this.data.startup_profiles[existingIdx]);
      return this.data.startup_profiles[existingIdx];
    } else {
      const newProf: StartupProfile = {
        id: 'sup_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        company_name: profile.company_name || 'My Startup',
        tagline: profile.tagline || '',
        description: profile.description || '',
        logo_url: profile.logo_url,
        industry: profile.industry || [],
        stage: profile.stage || 'idea',
        team_size: profile.team_size || 1,
        funding_currency: profile.funding_currency || 'INR',
        is_hiring: profile.is_hiring || false,
        sector_tags: profile.sector_tags || [],
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profile
      };
      this.data.startup_profiles.push(newProf);
      this.save();
      this.syncToSupabase('startup_profiles', newProf);
      return newProf;
    }
  }

  public createOrUpdateInvestor(userId: string, profile: Partial<InvestorProfile>) {
    const existingIdx = this.data.investor_profiles.findIndex(p => p.user_id === userId);
    if (existingIdx !== -1) {
      this.data.investor_profiles[existingIdx] = {
        ...this.data.investor_profiles[existingIdx],
        ...profile,
        updated_at: new Date().toISOString()
      };
      this.save();
      this.syncToSupabase('investor_profiles', this.data.investor_profiles[existingIdx]);
      return this.data.investor_profiles[existingIdx];
    } else {
      const newProf: InvestorProfile = {
        id: 'inv_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        firm_name: profile.firm_name || 'My Investment Office',
        investor_type: profile.investor_type || 'angel',
        investment_stages: profile.investment_stages || [],
        sectors_of_interest: profile.sectors_of_interest || [],
        ticket_size_min: profile.ticket_size_min || 0,
        ticket_size_max: profile.ticket_size_max || 0,
        currency: profile.currency || 'INR',
        portfolio_count: profile.portfolio_count || 0,
        notable_investments: profile.notable_investments || [],
        is_actively_investing: profile.is_actively_investing !== undefined ? profile.is_actively_investing : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profile
      };
      this.data.investor_profiles.push(newProf);
      this.save();
      this.syncToSupabase('investor_profiles', newProf);
      return newProf;
    }
  }

  public createOrUpdateMentor(userId: string, profile: Partial<MentorProfile>) {
    const existingIdx = this.data.mentor_profiles.findIndex(p => p.user_id === userId);
    if (existingIdx !== -1) {
      this.data.mentor_profiles[existingIdx] = {
        ...this.data.mentor_profiles[existingIdx],
        ...profile,
        updated_at: new Date().toISOString()
      };
      this.save();
      this.syncToSupabase('mentor_profiles', this.data.mentor_profiles[existingIdx]);
      return this.data.mentor_profiles[existingIdx];
    } else {
      const newProf: MentorProfile = {
        id: 'men_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        expertise_areas: profile.expertise_areas || [],
        industries: profile.industries || [],
        years_of_experience: profile.years_of_experience || 0,
        availability: profile.availability || 'available',
        session_type: profile.session_type || 'free',
        mentees_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profile
      };
      this.data.mentor_profiles.push(newProf);
      this.save();
      this.syncToSupabase('mentor_profiles', newProf);
      return newProf;
    }
  }

  public createOrUpdateEnabler(userId: string, profile: Partial<EcosystemEnabler>) {
    const existingIdx = this.data.ecosystem_enablers.findIndex(p => p.user_id === userId);
    if (existingIdx !== -1) {
      this.data.ecosystem_enablers[existingIdx] = {
        ...this.data.ecosystem_enablers[existingIdx],
        ...profile,
        updated_at: new Date().toISOString()
      };
      this.save();
      this.syncToSupabase('ecosystem_enablers', this.data.ecosystem_enablers[existingIdx]);
      return this.data.ecosystem_enablers[existingIdx];
    } else {
      const newProf: EcosystemEnabler = {
        id: 'ena_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        org_name: profile.org_name || 'My Institution',
        org_type: profile.org_type || 'incubator',
        programs_offered: profile.programs_offered || [],
        sectors_focus: profile.sectors_focus || [],
        description: profile.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profile
      };
      this.data.ecosystem_enablers.push(newProf);
      this.save();
      this.syncToSupabase('ecosystem_enablers', newProf);
      return newProf;
    }
  }

  public createOrUpdatePartner(userId: string, profile: Partial<ServicePartner>) {
    const existingIdx = this.data.service_partners.findIndex(p => p.user_id === userId);
    if (existingIdx !== -1) {
      this.data.service_partners[existingIdx] = {
        ...this.data.service_partners[existingIdx],
        ...profile,
        updated_at: new Date().toISOString()
      };
      this.save();
      this.syncToSupabase('service_partners', this.data.service_partners[existingIdx]);
      return this.data.service_partners[existingIdx];
    } else {
      const newProf: ServicePartner = {
        id: 'ser_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        service_categories: profile.service_categories || [],
        firm_name: profile.firm_name || 'My Consulting Firm',
        description: profile.description || '',
        verified_startup_clients: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profile
      };
      this.data.service_partners.push(newProf);
      this.save();
      this.syncToSupabase('service_partners', newProf);
      return newProf;
    }
  }

  // --- Connections Operations ---
  public getConnections() {
    return this.data.connections;
  }

  public sendConnectionRequest(reqId: string, recId: string, msg?: string) {
    const existing = this.data.connections.find(
      c => (c.requester_id === reqId && c.receiver_id === recId) ||
           (c.requester_id === recId && c.receiver_id === reqId)
    );
    if (existing) return existing;

    const newConn: Connection = {
      id: 'con_' + Math.random().toString(36).substr(2, 9),
      requester_id: reqId,
      receiver_id: recId,
      status: 'pending',
      message: msg,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.connections.push(newConn);
    this.save();
    this.syncToSupabase('connections', newConn);

    // Create a real notification for the receiver
    this.addNotification(recId, 'connection_request', 'New Connection Request', `${this.getUserById(reqId)?.full_name || 'Someone'} requested to connect with you.`);

    return newConn;
  }

  public updateConnectionStatus(id: string, status: 'accepted' | 'rejected' | 'blocked') {
    const idx = this.data.connections.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.connections[idx].status = status;
      this.data.connections[idx].updated_at = new Date().toISOString();
      this.save();
      this.syncToSupabase('connections', this.data.connections[idx]);

      const conn = this.data.connections[idx];
      if (status === 'accepted') {
        this.addNotification(conn.requester_id, 'connection_request', 'Connection Accepted!', `${this.getUserById(conn.receiver_id)?.full_name || 'Someone'} accepted your connection request.`);
      }
      return conn;
    }
    return null;
  }

  // --- Listings (StartupZone) Operations ---
  public getListings() {
    return this.data.listings;
  }

  public getListingById(id: string) {
    return this.data.listings.find(l => l.id === id);
  }

  public addListing(listing: Omit<Listing, 'id' | 'views_count' | 'applications_count' | 'created_at' | 'updated_at'> & { id?: string }) {
    const newLst: Listing = {
      id: listing.id || 'lst_' + Math.random().toString(36).substr(2, 9),
      views_count: 0,
      applications_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...listing
    };
    this.data.listings.push(newLst);
    this.save();
    this.syncToSupabase('listings', newLst);
    return newLst;
  }

  public updateListing(id: string, updates: Partial<Listing>) {
    const idx = this.data.listings.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.data.listings[idx] = {
        ...this.data.listings[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.save();
      this.syncToSupabase('listings', this.data.listings[idx]);
      return this.data.listings[idx];
    }
    return null;
  }

  public deleteListing(id: string) {
    const idx = this.data.listings.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.data.listings.splice(idx, 1);
      this.save();
      this.deleteFromSupabase('listings', id);
      return true;
    }
    return false;
  }

  // --- Feed Posts & Comments ---
  public getFeedPosts() {
    return this.data.feed_posts;
  }

  public addFeedPost(post: Omit<FeedPost, 'id' | 'likes_count' | 'comments_count' | 'shares_count' | 'created_at' | 'updated_at'>) {
    const newPost: FeedPost = {
      id: 'pst_' + Math.random().toString(36).substr(2, 9),
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...post
    };
    this.data.feed_posts.unshift(newPost);
    this.save();
    this.syncToSupabase('feed_posts', newPost);
    return newPost;
  }

  public togglePostLike(postId: string, userId: string) {
    const existingLikeIdx = this.data.likes.findIndex(l => l.user_id === userId && l.target_id === postId && l.target_type === 'post');
    const postIdx = this.data.feed_posts.findIndex(p => p.id === postId);

    if (existingLikeIdx !== -1) {
      const activeLikeId = this.data.likes[existingLikeIdx].id;
      this.data.likes.splice(existingLikeIdx, 1);
      if (postIdx !== -1) {
        this.data.feed_posts[postIdx].likes_count = Math.max(0, this.data.feed_posts[postIdx].likes_count - 1);
        this.syncToSupabase('feed_posts', this.data.feed_posts[postIdx]);
      }
      this.save();
      this.deleteFromSupabase('likes', activeLikeId);
      return { liked: false, likes_count: postIdx !== -1 ? this.data.feed_posts[postIdx].likes_count : 0 };
    } else {
      const newLike: Like = {
        id: 'lik_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        target_id: postId,
        target_type: 'post'
      };
      this.data.likes.push(newLike);
      if (postIdx !== -1) {
        this.data.feed_posts[postIdx].likes_count += 1;
        this.syncToSupabase('feed_posts', this.data.feed_posts[postIdx]);
        // Notify owner if post belongs to another user
        const post = this.data.feed_posts[postIdx];
        if (post.author_id !== userId) {
          const liker = this.getUserById(userId);
          this.addNotification(post.author_id, 'like', 'Post Liked', `${liker?.full_name || 'Someone'} liked your update.`);
        }
      }
      this.save();
      this.syncToSupabase('likes', newLike);
      return { liked: true, likes_count: postIdx !== -1 ? this.data.feed_posts[postIdx].likes_count : 1 };
    }
  }

  public getComments(postId: string) {
    return this.data.comments.filter(c => c.post_id === postId);
  }

  public addComment(postId: string, authorId: string, content: string) {
    const newComment: Comment = {
      id: 'com_' + Math.random().toString(36).substr(2, 9),
      post_id: postId,
      author_id: authorId,
      content,
      likes_count: 0,
      created_at: new Date().toISOString()
    };
    this.data.comments.push(newComment);

    const postIdx = this.data.feed_posts.findIndex(p => p.id === postId);
    if (postIdx !== -1) {
      this.data.feed_posts[postIdx].comments_count += 1;
      this.syncToSupabase('feed_posts', this.data.feed_posts[postIdx]);
      const post = this.data.feed_posts[postIdx];
      if (post.author_id !== authorId) {
        const commenter = this.getUserById(authorId);
        this.addNotification(post.author_id, 'comment', 'New Comment On Post', `${commenter?.full_name || 'Someone'} commented: "${content.substring(0, 30)}..."`);
      }
    }
    this.save();
    this.syncToSupabase('comments', newComment);
    return newComment;
  }

  // --- Notifications ---
  public getNotifications(userId: string) {
    return this.data.notifications.filter(n => n.user_id === userId);
  }

  public addNotification(userId: string, type: string, title: string, body: string, actionUrl?: string) {
    const newNotif: Notification = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      type,
      title,
      body,
      action_url: actionUrl,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    this.syncToSupabase('notifications', newNotif);
    return newNotif;
  }

  public markNotificationRead(id: string) {
    const idx = this.data.notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.data.notifications[idx].is_read = true;
      this.save();
      this.syncToSupabase('notifications', this.data.notifications[idx]);
    }
  }

  public markAllNotificationsRead(userId: string) {
    this.data.notifications.forEach(n => {
      if (n.user_id === userId) {
        n.is_read = true;
        this.syncToSupabase('notifications', n);
      }
    });
    this.save();
  }

  // --- Saved Items ---
  public getSavedItems(userId: string) {
    return this.data.saved_items.filter(s => s.user_id === userId);
  }

  public saveItem(userId: string, itemId: string, itemType: SavedItem['item_type']) {
    const existing = this.data.saved_items.find(s => s.user_id === userId && s.item_id === itemId && s.item_type === itemType);
    if (existing) return existing;

    const newItem: SavedItem = {
      id: 'sav_' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      item_id: itemId,
      item_type: itemType,
      created_at: new Date().toISOString()
    };
    this.data.saved_items.push(newItem);
    this.save();
    this.syncToSupabase('saved_items', newItem);
    return newItem;
  }

  public unsaveItem(userId: string, itemId: string, itemType: SavedItem['item_type']) {
    const idx = this.data.saved_items.findIndex(s => s.user_id === userId && s.item_id === itemId && s.item_type === itemType);
    if (idx !== -1) {
      const activeSaveId = this.data.saved_items[idx].id;
      this.data.saved_items.splice(idx, 1);
      this.save();
      this.deleteFromSupabase('saved_items', activeSaveId);
      return true;
    }
    return false;
  }

  // --- AI Matches Operations ---
  public getAiMatches(userId: string) {
    return this.data.ai_matches.filter(m => m.user_id === userId && !m.is_dismissed);
  }

  public addAiMatch(match: Omit<AIMatch, 'id' | 'is_dismissed' | 'created_at'>) {
    const newMatch: AIMatch = {
      id: 'mch_' + Math.random().toString(36).substr(2, 9),
      is_dismissed: false,
      created_at: new Date().toISOString(),
      ...match
    };
    this.data.ai_matches.push(newMatch);
    this.save();
    return newMatch;
  }

  public dismissAiMatch(id: string) {
    const idx = this.data.ai_matches.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.data.ai_matches[idx].is_dismissed = true;
      this.save();
      return true;
    }
    return false;
  }

  // --- Analytics & Views ---
  public trackAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>) {
    const newEv: AnalyticsEvent = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      ...event
    };
    this.data.analytics_events.push(newEv);
    this.save();
    return newEv;
  }

  public getProfileViewsCount(userId: string) {
    return this.data.analytics_events.filter(e => e.event_type === 'profile_view' && e.metadata?.target_user_id === userId).length;
  }
}

export const db = new Database();
export default db;
