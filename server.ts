import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db";
import { computeAiMatch, generateProfileBio, interpretVagueSearch } from "./server/ai";
import { getSupabase } from "./server/supabase";


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // --- Supabase Diagnostics API ---
  app.get("/api/supabase/status", (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.json({
        active: false,
        message: "Supabase integration not configured. Key variables are missing."
      });
    }
    const syncStatus = db.getSupabaseSyncErrors();
    const hasIssues = syncStatus.warnings.length > 0 || syncStatus.missingTables.length > 0;
    res.json({
      active: true,
      has_issues: hasIssues,
      ...syncStatus
    });
  });

  // Helper middleware to get current authenticated user
  // Falls back to Ramesh (usr_founder_1) so the preview works seamlessly instantly!
  const getAuthUser = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const username = authHeader.split(' ')[1];
      const user = db.getUsers().find(u => u.username === username);
      if (user) return user;
    }
    // Default active fallback
    return db.getUserById("usr_founder_1");
  };

  // --- Auth APIs ---
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, full_name, username, role, city, state, network, mode, avatar_url, roleFields } = req.body;

    const supabase = getSupabase();
    let supabaseUserId: string | null = null;
    let isSupabaseActive = false;

    if (supabase && password) {
      isSupabaseActive = true;
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name,
              username,
              role
            }
          }
        });

        if (error) {
          return res.status(400).json({ error: error.message });
        }
        supabaseUserId = data.user?.id || null;
      } catch (err: any) {
        return res.status(400).json({ error: err.message || "Supabase authentication failed" });
      }
    }

    if (db.getUserByEmail(email)) {
      return res.status(400).json({ error: "Email already registered in ecosystem" });
    }
    if (db.getUserByUsername(username)) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const newUser = db.addUser({
      id: supabaseUserId || "usr_" + Math.random().toString(36).substr(2, 9),
      email,
      full_name,
      username,
      role,
      city,
      state,
      country: "India",
      location: `${city}, ${state}, India`,
      network: network || "TG10X",
      mode: mode || "ecosystem",
      is_verified: isSupabaseActive,
      is_active: true,
      avatar_url: avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Create role-specific profiles
    if (role === "startup_founder") {
      db.createOrUpdateStartup(newUser.id, {
        company_name: roleFields?.company_name || `${full_name}'s Startup`,
        tagline: roleFields?.tagline || "",
        description: roleFields?.description || "",
        stage: roleFields?.stage || "idea",
        industry: roleFields?.industry || []
      });
    } else if (role === "investor") {
      db.createOrUpdateInvestor(newUser.id, {
        firm_name: roleFields?.firm_name || "Personal Angel Portfolio",
        investor_type: roleFields?.investor_type || "angel",
        investment_stages: roleFields?.investment_stages || [],
        sectors_of_interest: roleFields?.sectors_of_interest || [],
        ticket_size_min: Number(roleFields?.ticket_size_min) || 0,
        ticket_size_max: Number(roleFields?.ticket_size_max) || 0
      });
    } else if (role === "mentor") {
      db.createOrUpdateMentor(newUser.id, {
        expertise_areas: roleFields?.expertise_areas || [],
        industries: roleFields?.industries || [],
        years_of_experience: Number(roleFields?.years_of_experience) || 0,
        availability: "available",
        session_type: "free"
      });
    } else if (role === "ecosystem_enabler") {
      db.createOrUpdateEnabler(newUser.id, {
        org_name: roleFields?.org_name || "Ecosystem Office",
        org_type: roleFields?.org_type || "incubator",
        programs_offered: roleFields?.programs_offered || [],
        description: roleFields?.description || ""
      });
    } else if (role === "service_partner") {
      db.createOrUpdatePartner(newUser.id, {
        firm_name: roleFields?.firm_name || "Service Firm",
        service_categories: roleFields?.service_categories || [],
        description: roleFields?.description || ""
      });
    }

    res.json({ success: true, user: newUser, supabaseActive: isSupabaseActive });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const supabase = getSupabase();
    let isSupabaseActive = false;

    if (supabase && password) {
      isSupabaseActive = true;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          return res.status(401).json({ error: error.message });
        }
      } catch (err: any) {
        return res.status(401).json({ error: err.message || "Supabase authentication failed" });
      }
    }

    let user = db.getUserByEmail(email);
    if (!user) {
      if (isSupabaseActive) {
        // Authenticated in Supabase, auto-provision local dynamic entry
        user = db.addUser({
          id: "usr_" + Math.random().toString(36).substr(2, 9),
          email,
          full_name: email.split('@')[0],
          username: email.split('@')[0],
          role: "startup_founder",
          city: "Hyderabad",
          state: "Telangana",
          country: "India",
          location: "Hyderabad, Telangana, India",
          network: "TG10X",
          mode: "ecosystem",
          is_verified: true,
          is_active: true,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        user = db.getUsers().find(u => u.email === email) || db.getUsers()[0];
      }
    }
    res.json({ success: true, token: user.username, user, supabaseActive: isSupabaseActive });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const user = getAuthUser(req);
    res.json({ user });
  });

  // --- Users / Profiles Catalog APIs ---
  app.get("/api/users", (req, res) => {
    const { role, location, search, sort, network, mode } = req.query;
    let users = [...db.getUsers()];

    // Network & Mode switcher filters
    if (network && network !== "All") {
      users = users.filter(u => u.network === network);
    }
    if (mode && mode !== "All") {
      users = users.filter(u => u.mode === mode);
    }

    // Role filters
    if (role && role !== "All") {
      const roleStr = String(role).toLowerCase();
      if (roleStr === "startup_founder") {
        users = users.filter(u => u.role === "startup_founder");
      } else if (roleStr === "investor" || roleStr === "investors") {
        users = users.filter(u => u.role === "investor");
      } else if (roleStr === "mentor" || roleStr === "mentors") {
        users = users.filter(u => u.role === "mentor");
      } else if (roleStr === "ecosystem_enabler") {
        users = users.filter(u => u.role === "ecosystem_enabler");
      } else if (roleStr === "service_partner") {
        users = users.filter(u => u.role === "service_partner");
      } else if (roleStr === "job_seeker" || roleStr === "job_seekers") {
        users = users.filter(u => u.role === "job_seeker");
      } else {
        users = users.filter(u => u.role === roleStr);
      }
    }

    // Location state/city filters
    if (location && location !== "All") {
      const locStr = String(location).toLowerCase();
      users = users.filter(u =>
        u.city?.toLowerCase().includes(locStr) ||
        u.state?.toLowerCase().includes(locStr) ||
        u.location?.toLowerCase().includes(locStr)
      );
    }

    // Keyword search
    if (search) {
      const term = String(search).toLowerCase();
      users = users.filter(u =>
        u.full_name?.toLowerCase().includes(term) ||
        u.bio?.toLowerCase().includes(term) ||
        u.city?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term)
      );
    }

    // Join Profiles
    const results = users.map(u => {
      return {
        ...u,
        startup: db.getStartupProfileByUserId(u.id),
        investor: db.getInvestorProfileByUserId(u.id),
        mentor: db.getMentorProfileByUserId(u.id),
        enabler: db.getEnablerProfileByUserId(u.id),
        partner: db.getPartnerProfileByUserId(u.id)
      };
    });

    // Custom sorting
    if (sort === "Alphabetical") {
      results.sort((a, b) => a.full_name.localeCompare(b.full_name));
    } else if (sort === "Featured First") {
      results.sort((a, b) => {
        const featA = a.startup?.is_featured || a.is_verified ? 1 : 0;
        const featB = b.startup?.is_featured || b.is_verified ? 1 : 0;
        return featB - featA;
      });
    } else {
      // Create date sort
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    res.json({ success: true, users: results });
  });

  app.get("/api/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const fullProfile = {
      ...user,
      startup: db.getStartupProfileByUserId(user.id),
      investor: db.getInvestorProfileByUserId(user.id),
      mentor: db.getMentorProfileByUserId(user.id),
      enabler: db.getEnablerProfileByUserId(user.id),
      partner: db.getPartnerProfileByUserId(user.id)
    };
    res.json({ success: true, user: fullProfile });
  });

  app.put("/api/users/:id", (req, res) => {
    const currentUser = getAuthUser(req);
    if (currentUser.id !== req.params.id) {
      return res.status(403).json({ error: "Unauthorized profile update" });
    }

    const { full_name, bio, city, state, website_url, linkedin_url, avatar_url, startup, investor, mentor, enabler, partner } = req.body;

    const updatedUser = db.updateUser(req.params.id, {
      full_name,
      bio,
      city,
      state,
      website_url,
      linkedin_url,
      avatar_url,
      location: `${city}, ${state}, India`
    });

    if (currentUser.role === "startup_founder" && startup) {
      db.createOrUpdateStartup(currentUser.id, startup);
    } else if (currentUser.role === "investor" && investor) {
      db.createOrUpdateInvestor(currentUser.id, investor);
    } else if (currentUser.role === "mentor" && mentor) {
      db.createOrUpdateMentor(currentUser.id, mentor);
    } else if (currentUser.role === "ecosystem_enabler" && enabler) {
      db.createOrUpdateEnabler(currentUser.id, enabler);
    } else if (currentUser.role === "service_partner" && partner) {
      db.createOrUpdatePartner(currentUser.id, partner);
    }

    res.json({ success: true, user: updatedUser });
  });

  // --- Connections APIs ---
  app.get("/api/connections", (req, res) => {
    const currentUser = getAuthUser(req);
    const userConnections = db.getConnections().filter(
      c => c.requester_id === currentUser.id || c.receiver_id === currentUser.id
    );

    const enriched = userConnections.map(c => {
      const peerId = c.requester_id === currentUser.id ? c.receiver_id : c.requester_id;
      const peer = db.getUserById(peerId);
      return {
        ...c,
        peer: peer ? {
          id: peer.id,
          full_name: peer.full_name,
          username: peer.username,
          avatar_url: peer.avatar_url,
          role: peer.role,
          city: peer.city,
          state: peer.state
        } : null
      };
    });

    res.json({ success: true, connections: enriched });
  });

  app.post("/api/connections", (req, res) => {
    const currentUser = getAuthUser(req);
    const { receiver_id, message } = req.body;
    if (!receiver_id) {
      return res.status(400).json({ error: "receiver_id required" });
    }
    const conn = db.sendConnectionRequest(currentUser.id, receiver_id, message);
    res.json({ success: true, connection: conn });
  });

  app.put("/api/connections/:id", (req, res) => {
    const { status } = req.body;
    if (!["accepted", "rejected", "blocked"].includes(status)) {
      return res.status(400).json({ error: "Invalid connection status" });
    }
    const updated = db.updateConnectionStatus(req.params.id, status as any);
    if (!updated) {
      return res.status(404).json({ error: "Connection mapping not found" });
    }
    res.json({ success: true, connection: updated });
  });

  // --- Listings (StartupZone) APIs ---
  app.get("/api/listings", (req, res) => {
    const { type, location, search } = req.query;
    let list = db.getListings();

    if (type && type !== "All") {
      list = list.filter(l => l.type === type);
    }
    if (location && location !== "All") {
      const locStr = String(location).toLowerCase();
      list = list.filter(l => l.location?.toLowerCase().includes(locStr));
    }
    if (search) {
      const term = String(search).toLowerCase();
      list = list.filter(l =>
        l.title.toLowerCase().includes(term) ||
        l.description.toLowerCase().includes(term) ||
        l.company_name.toLowerCase().includes(term)
      );
    }

    res.json({ success: true, listings: list });
  });

  app.post("/api/listings", (req, res) => {
    const currentUser = getAuthUser(req);
    const { type, title, description, company_name, company_logo_url, location, is_remote, salary_range_min, salary_range_max, tags, deadline } = req.body;

    const newListing = db.addListing({
      created_by: currentUser.id,
      type,
      title,
      description,
      company_name: company_name || "My Venture",
      company_logo_url: company_logo_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150",
      is_remote: !!is_remote,
      location: location || "Hyderabad, Telangana",
      salary_range_min: Number(salary_range_min) || undefined,
      salary_range_max: Number(salary_range_max) || undefined,
      tags: tags || [],
      deadline: deadline || undefined,
      status: "active"
    });

    res.json({ success: true, listing: newListing });
  });

  app.get("/api/listings/:id", (req, res) => {
    const listing = db.getListingById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json({ success: true, listing });
  });

  app.post("/api/listings/:id/apply", (req, res) => {
    const listing = db.getListingById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    listing.applications_count += 1;
    db.save();

    res.json({ success: true, applications_count: listing.applications_count });
  });

  // --- Feed & Posts APIs ---
  app.get("/api/feed", (req, res) => {
    const posts = db.getFeedPosts();
    const enriched = posts.map(p => {
      const author = db.getUserById(p.author_id);
      return {
        ...p,
        author: author ? {
          id: author.id,
          full_name: author.full_name,
          username: author.username,
          avatar_url: author.avatar_url,
          role: author.role
        } : null
      };
    });
    res.json({ success: true, posts: enriched });
  });

  app.post("/api/feed", (req, res) => {
    const currentUser = getAuthUser(req);
    const { content, post_type, tags } = req.body;
    if (!content) return res.status(400).json({ error: "content required" });

    const newPost = db.addFeedPost({
      author_id: currentUser.id,
      content,
      post_type: post_type || "update",
      tags: tags || [],
      is_pinned: false
    });

    res.json({ success: true, post: { ...newPost, author: currentUser } });
  });

  app.post("/api/feed/:id/like", (req, res) => {
    const currentUser = getAuthUser(req);
    const result = db.togglePostLike(req.params.id, currentUser.id);
    res.json({ success: true, ...result });
  });

  app.get("/api/feed/:id/comments", (req, res) => {
    const comments = db.getComments(req.params.id);
    const enriched = comments.map(c => {
      const author = db.getUserById(c.author_id);
      return {
        ...c,
        author: author ? {
          id: author.id,
          full_name: author.full_name,
          username: author.username,
          avatar_url: author.avatar_url,
          role: author.role
        } : null
      };
    });
    res.json({ success: true, comments: enriched });
  });

  app.post("/api/feed/:id/comments", (req, res) => {
    const currentUser = getAuthUser(req);
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "content required" });

    const comment = db.addComment(req.params.id, currentUser.id, content);
    res.json({ success: true, comment: { ...comment, author: currentUser } });
  });

  // --- AI Matches & Assistant Operations ---
  app.get("/api/ai/matches", async (req, res) => {
    const currentUser = getAuthUser(req);
    const matches = db.getAiMatches(currentUser.id);

    // If zero matches, let's auto-generate 2 gorgeous ones dynamically!
    if (matches.length === 0) {
      const peers = db.getUsers().filter(u => u.id !== currentUser.id);
      for (const peer of peers.slice(0, 2)) {
        const matchData = await computeAiMatch(
          currentUser,
          db.getStartupProfileByUserId(currentUser.id) || db.getMentorProfileByUserId(currentUser.id) || {},
          peer,
          db.getStartupProfileByUserId(peer.id) || db.getInvestorProfileByUserId(peer.id) || db.getMentorProfileByUserId(peer.id) || {},
          currentUser.role === "startup_founder" ? "investor_startup" : "mentor_founder"
        );
        db.addAiMatch({
          user_id: currentUser.id,
          matched_user_id: peer.id,
          match_type: currentUser.role === "startup_founder" ? "investor_startup" : "mentor_founder",
          score: matchData.score,
          reasons: matchData.reasons,
          recommended_intro_message: matchData.recommended_intro_message
        });
      }
    }

    const latestMatches = db.getAiMatches(currentUser.id).map(m => {
      const peer = db.getUserById(m.matched_user_id);
      return {
        ...m,
        matched_user: peer ? {
          id: peer.id,
          full_name: peer.full_name,
          username: peer.username,
          avatar_url: peer.avatar_url,
          role: peer.role,
          bio: peer.bio,
          startup: db.getStartupProfileByUserId(peer.id),
          investor: db.getInvestorProfileByUserId(peer.id),
          mentor: db.getMentorProfileByUserId(peer.id)
        } : null
      };
    });

    res.json({ success: true, matches: latestMatches });
  });

  app.post("/api/ai/generate-bio", async (req, res) => {
    const { role, skills, company, goals } = req.body;
    try {
      const bio = await generateProfileBio({ role, skills: skills || [], company, goals });
      res.json({ success: true, bio });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed dynamically writing bio" });
    }
  });

  app.post("/api/ai/match-score", async (req, res) => {
    const currentUser = getAuthUser(req);
    const { matched_user_id } = req.body;
    if (!matched_user_id) return res.status(400).json({ error: "matched_user_id is required" });

    const peer = db.getUserById(matched_user_id);
    if (!peer) return res.status(404).json({ error: "Peer user not found" });

    const scoreData = await computeAiMatch(
      currentUser,
      db.getStartupProfileByUserId(currentUser.id) || {},
      peer,
      db.getStartupProfileByUserId(peer.id) || db.getInvestorProfileByUserId(peer.id) || db.getMentorProfileByUserId(peer.id) || {},
      "cofounder"
    );

    res.json({ success: true, ...scoreData });
  });

  // --- Saved Items APIs ---
  app.get("/api/saved", (req, res) => {
    const currentUser = getAuthUser(req);
    const items = db.getSavedItems(currentUser.id);
    res.json({ success: true, saved: items });
  });

  app.post("/api/saved", (req, res) => {
    const currentUser = getAuthUser(req);
    const { item_id, item_type } = req.body;
    const item = db.saveItem(currentUser.id, item_id, item_type);
    res.json({ success: true, saved: item });
  });

  app.delete("/api/saved/:id", (req, res) => {
    const currentUser = getAuthUser(req);
    db.unsaveItem(currentUser.id, req.params.id, "profile");
    db.unsaveItem(currentUser.id, req.params.id, "listing");
    res.json({ success: true });
  });

  // --- Notifications APIs ---
  app.get("/api/notifications", (req, res) => {
    const currentUser = getAuthUser(req);
    res.json({ success: true, notifications: db.getNotifications(currentUser.id) });
  });

  app.put("/api/notifications/:id/read", (req, res) => {
    db.markNotificationRead(req.params.id);
    res.json({ success: true });
  });

  app.put("/api/notifications/read-all", (req, res) => {
    const currentUser = getAuthUser(req);
    db.markAllNotificationsRead(currentUser.id);
    res.json({ success: true });
  });

  // --- Global Search API with AI Intelligence ---
  app.get("/api/search", async (req, res) => {
    const query = String(req.query.q || "");
    if (!query) return res.json({ users: [], listings: [] });

    // AI interpret natural search
    const parsed = await interpretVagueSearch(query);

    // Run structured query fallback
    let users = [...db.getUsers()];
    let listings = [...db.getListings()];

    // Apply AI parsed roles
    if (parsed.role) {
      users = users.filter(u => u.role === parsed.role);
    }
    // Apply parsed city
    if (parsed.city) {
      const c = parsed.city.toLowerCase();
      users = users.filter(u => u.city?.toLowerCase().includes(c));
    }

    // Keyword Match across items
    const term = (parsed.clean_term || query || "").toLowerCase();
    const finalUsers = users.filter(u =>
      u.full_name?.toLowerCase().includes(term) ||
      u.bio?.toLowerCase().includes(term) ||
      u.city?.toLowerCase().includes(term)
    ).map(u => ({
      ...u,
      startup: db.getStartupProfileByUserId(u.id),
      investor: db.getInvestorProfileByUserId(u.id),
      mentor: db.getMentorProfileByUserId(u.id)
    }));

    const finalListings = listings.filter(l =>
      l.title?.toLowerCase().includes(term) ||
      l.description?.toLowerCase().includes(term) ||
      l.company_name?.toLowerCase().includes(term)
    );

    res.json({
      success: true,
      ai_interpreted: parsed,
      users: finalUsers,
      listings: finalListings
    });
  });

  // --- Setup Static & Vite Bundling Pipelines ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Correct CJS dynamic static server path for building
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Stack ready! TG10X Ecosystem running on port http://localhost:${PORT}`);
  });
}

startServer();
