import {
  User,
  StartupProfile,
  InvestorProfile,
  MentorProfile,
  EcosystemEnabler,
  ServicePartner,
  Listing,
  FeedPost,
  Comment
} from '../types';

export const SEED_USERS: User[] = [
  // Startup founders
  {
    id: "usr_founder_1",
    email: "ramesh@dhruvaspace.io",
    full_name: "Ramesh Kumar",
    username: "ramesh_dhruva",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    bio: "Co-founder at Dhruva Space, building the next generation of space infrastructure. IIT Hyderabad alum, passionate about cubesats and small satellite launch services.",
    location: "Hyderabad, Telangana, India",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    role: "startup_founder",
    is_verified: true,
    is_active: true,
    network: "TG10X",
    mode: "ecosystem",
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2026-05-20T12:30:00Z"
  },
  {
    id: "usr_founder_2",
    email: "anitha@khetipoint.com",
    full_name: "Anitha Reddy",
    username: "anitha_agritech",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    bio: "Founder of KhetiPoint, empowering farmers with real-time crop intelligence using hyper-local IoT sensors and AI diagnostics. Rural champion, Nizamabad native.",
    location: "Warangal, Telangana, India",
    city: "Warangal",
    state: "Telangana",
    country: "India",
    role: "startup_founder",
    is_verified: true,
    is_active: true,
    network: "TG10X",
    mode: "ecosystem",
    created_at: "2025-02-15T09:00:00Z",
    updated_at: "2026-05-24T15:45:00Z"
  },
  {
    id: "usr_founder_3",
    email: "sandeep@t-delivery.in",
    full_name: "Sandeep Varma",
    username: "sandeep_ev",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    bio: "Aspiring to carbon-neutralize the Indian last-mile logistics. Running T-Delivery with a fleet of 500+ electric cargo two-wheelers in Hyderabad.",
    location: "Hyderabad, Telangana, India",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    role: "startup_founder",
    is_verified: false,
    is_active: true,
    network: "TG10X",
    mode: "ecosystem",
    created_at: "2025-03-01T14:20:00Z",
    updated_at: "2026-05-18T10:15:00Z"
  },
  // Investors
  {
    id: "usr_investor_1",
    email: "kavitha@anthillventures.com",
    full_name: "Kavitha Rao",
    username: "kavitha_anthill",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    bio: "Partner at Anthill Ventures. Investing in early-growth stage scaleups with speed-scaling potential across Media, Urban Tech, and HealthTech. Hyderabad angel network lead.",
    location: "Hyderabad, Telangana, India",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    role: "investor",
    is_verified: true,
    is_active: true,
    network: "TG10X",
    mode: "ecosystem",
    created_at: "2024-11-20T08:30:00Z",
    updated_at: "2026-05-25T01:10:00Z"
  },
  {
    id: "usr_investor_2",
    email: "vamsi@telanganabulls.com",
    full_name: "Vamsi Krishna",
    username: "vamsi_bulls",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    bio: "Angel Investor & Managing Director at Hyderabad Capital Partners. Active mentor at T-Hub and deep believer in Tier-2 startup potential.",
    location: "Khammam, Telangana, India",
    city: "Khammam",
    state: "Telangana",
    country: "India",
    role: "investor",
    is_verified: true,
    is_active: true,
    network: "BH10X",
    mode: "ecosystem",
    created_at: "2025-01-05T11:00:00Z",
    updated_at: "2026-05-15T18:30:00Z"
  },
  // Mentors
  {
    id: "usr_mentor_1",
    email: "shrinivas@mentor.org",
    full_name: "Dr. Shrinivas Iyer",
    username: "shri_iyer",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    bio: "Ex-Director of Engineering at Microsoft India. 25+ years of software architect experience. Helping deep-tech startups build elastic infra and robust tech teams.",
    location: "Hyderabad, Telangana, India",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    role: "mentor",
    is_verified: true,
    is_active: true,
    network: "TG10X",
    mode: "ecosystem",
    created_at: "2024-05-01T09:00:00Z",
    updated_at: "2026-05-23T09:00:00Z"
  },
  {
    id: "usr_mentor_2",
    email: "manisha@advisor.co",
    full_name: "Manisha Goud",
    username: "manisha_growth",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    bio: "Growth Marketer & Brand Strategist. Directed Go-To-Market programs for 15+ SaaS startups. Conducting monthly masterclasses at T-Hub and WE Hub.",
    location: "Nizamabad, Telangana, India",
    city: "Nizamabad",
    state: "Telangana",
    country: "India",
    role: "mentor",
    is_verified: true,
    is_active: true,
    network: "TG10X",
    mode: "ecosystem",
    created_at: "2025-01-20T10:30:00Z",
    updated_at: "2026-05-22T14:40:00Z"
  },
  // Ecosystem Enablers
  {
    id: "usr_enabler_1",
    email: "contact@t-hub.co",
    full_name: "Srinivas Kollipara (T-Hub)",
    username: "thub_official",
    avatar_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150",
    bio: "Official handle of T-Hub, India's pioneering innovation hub and ecosystem enabler based in Hyderabad, creating impact via state-of-the-art incubation.",
    location: "Hyderabad, Telangana, India",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    role: "ecosystem_enabler",
    is_verified: true,
    is_active: true,
    network: "TG10X",
    mode: "ecosystem",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2026-05-24T18:00:00Z"
  },
  // Service Partners
  {
    id: "usr_partner_1",
    email: "legal@indialegal.com",
    full_name: "Harish Chandra (Chandra & Co)",
    username: "chandra_legal",
    avatar_url: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150",
    bio: "Harish is the managing partner of Chandra & Co, offering startup incorporation, seed financing paperwork, IP filings, and compliant corporate governance.",
    location: "Hyderabad, Telangana, India",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    role: "service_partner",
    is_verified: true,
    is_active: true,
    network: "TG10X",
    mode: "ecosystem",
    created_at: "2024-08-12T13:15:00Z",
    updated_at: "2026-05-19T11:20:00Z"
  },
  // Job Seekers
  {
    id: "usr_seeker_1",
    email: "vignesh@gmail.com",
    full_name: "Vignesh Myadam",
    username: "vignesh_dev",
    avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    bio: "Full Stack Developer (Next.js, Node.js, Express, Postgres). Seeking backend role in deep tech or dynamic AI startups. warangal native, active open source contributor.",
    location: "Karimnagar, Telangana, India",
    city: "Karimnagar",
    state: "Telangana",
    country: "India",
    role: "job_seeker",
    is_verified: true,
    is_active: true,
    network: "TG10X",
    mode: "campus",
    created_at: "2025-04-01T08:00:00Z",
    updated_at: "2026-05-25T11:00:00Z"
  }
];

export const SEED_STARTUPS: StartupProfile[] = [
  {
    id: "sup_1",
    user_id: "usr_founder_1",
    company_name: "Dhruva Aerospace",
    tagline: "Unlocking space for small satellites.",
    description: "Dhruva Aerospace develops full-stack space solutions active across launch operations, cubesat designs, ground stations, and orbital deployers. Proudly incubated at T-Hub, working with ISRO.",
    logo_url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=150",
    banner_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    industry: ["Aerospace", "DeepTech", "Hardware"],
    stage: "series-a",
    founded_year: 2021,
    team_size: 45,
    revenue_range: "₹2Cr - ₹5Cr",
    funding_raised: 45000000,
    funding_currency: "INR",
    is_hiring: true,
    website: "https://dhruvaspace.io",
    pitch_deck_url: "https://dhruvaspace.io/deck.pdf",
    sector_tags: ["Cubesat", "Launchers", "Satellite Systems"],
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    state: "Telangana",
    is_featured: true,
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2026-05-20T12:30:00Z"
  },
  {
    id: "sup_2",
    user_id: "usr_founder_2",
    company_name: "KhetiPoint Intelligence",
    tagline: "Hyperlocal IoT & AI crop diagnostics.",
    description: "KhetiPoint offers modular IoT soil probes combined with advanced AI mobile imaging. Farmers take pictures of diseased leaves, and our LLaMA-based local diagnostics engine returns instant solutions.",
    logo_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150",
    banner_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
    industry: ["AgTech", "IoT", "AI/ML"],
    stage: "seed",
    founded_year: 2023,
    team_size: 14,
    revenue_range: "₹50L - ₹1Cr",
    funding_raised: 15000000,
    funding_currency: "INR",
    is_hiring: true,
    website: "https://khetipoint.com",
    sector_tags: ["Farming", "Sensor Cloud", "Agri-AI"],
    location: "Warangal, Telangana",
    city: "Warangal",
    state: "Telangana",
    is_featured: true,
    created_at: "2025-02-15T09:00:00Z",
    updated_at: "2026-05-24T15:45:00Z"
  },
  {
    id: "sup_3",
    user_id: "usr_founder_3",
    company_name: "T-Delivery EV",
    tagline: "Telangana's cleanest last-mile delivery fleet.",
    description: "An EV-first delivery service powering small MSMEs and e-commerce giants. Operating out of solar-powered battery-swapping warehouses situated around Secunderabad and Charminar.",
    logo_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=150",
    banner_url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800",
    industry: ["EV", "Logistics", "Mobility"],
    stage: "pre-seed",
    founded_year: 2024,
    team_size: 8,
    revenue_range: "₹10L - ₹30L",
    funding_raised: 2500000,
    funding_currency: "INR",
    is_hiring: false,
    website: "https://t-delivery.in",
    sector_tags: ["Electric Vehicles", "Green Logistics", "On-Demand"],
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    state: "Telangana",
    is_featured: false,
    created_at: "2025-03-01T14:20:00Z",
    updated_at: "2026-05-18T10:15:00Z"
  }
];

export const SEED_INVESTORS: InvestorProfile[] = [
  {
    id: "inv_1",
    user_id: "usr_investor_1",
    firm_name: "Anthill Ventures",
    firm_logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150",
    investor_type: "vc",
    investment_stages: ["seed", "series-a"],
    sectors_of_interest: ["DeepTech", "Media & Entertainment", "HealthTech", "AgTech"],
    ticket_size_min: 5000000,
    ticket_size_max: 30000000,
    currency: "INR",
    portfolio_count: 32,
    notable_investments: ["Skyroot Aerospace", "Custom Technologies", "Goud Robotics"],
    investment_thesis: "We partner with resilient founders looking to scale dynamically across the Asian-Pacific corridor using our speedscaling workspace programs.",
    is_actively_investing: true,
    location: "Hyderabad, India",
    created_at: "2024-11-20T08:30:00Z",
    updated_at: "2026-05-25T01:10:00Z"
  },
  {
    id: "inv_2",
    user_id: "usr_investor_2",
    firm_name: "Deccan Capital Angels",
    firm_logo_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150",
    investor_type: "family_office",
    investment_stages: ["idea", "pre-seed", "seed"],
    sectors_of_interest: ["MSMEs", "RetailTech", "EdTech", "CleanTech"],
    ticket_size_min: 1000000,
    ticket_size_max: 10000000,
    portfolio_count: 12,
    notable_investments: ["Karimnagar Organic Store", "Vemulawada Tech Academy"],
    investment_thesis: "Unearthing founders in Tier-2 and Tier-3 Telangana districts, focusing on capital efficiency and localized commerce success.",
    is_actively_investing: true,
    location: "Khammam, Telangana",
    created_at: "2025-01-05T11:00:00Z",
    updated_at: "2026-05-15T18:30:00Z"
  }
];

// Let's patch inv_2 ticket sizes
SEED_INVESTORS[1].ticket_size_max = 5000000;
SEED_INVESTORS[1].currency = "INR";

export const SEED_MENTORS: MentorProfile[] = [
  {
    id: "men_1",
    user_id: "usr_mentor_1",
    expertise_areas: ["Cloud Infrastructure", "Kubernetes", "DevOps scaling", "API Security"],
    industries: ["DeepTech", "SaaS", "Enterprise Tech"],
    years_of_experience: 26,
    current_company: "Ex-Microsoft Engineers Alliance",
    current_role: "Engineering Advisor",
    mentorship_style: "Structured, code-review focused, hands-on architectural sprints",
    availability: "available",
    session_type: "free",
    mentees_count: 42,
    created_at: "2024-05-01T09:00:00Z",
    updated_at: "2026-05-23T09:00:00Z"
  },
  {
    id: "men_2",
    user_id: "usr_mentor_2",
    expertise_areas: ["Growth Marketing", "B2B Lead Gen", "Cold Emailing", "Sales Funnels"],
    industries: ["SaaS", "EdTech", "Consumer Products"],
    years_of_experience: 12,
    current_company: "T-Hub Academy",
    current_role: "Chief Coach",
    mentorship_style: "Practical homeworks, marketing template tear-downs, metrics audit",
    availability: "limited",
    session_type: "free",
    mentees_count: 18,
    created_at: "2025-01-20T10:30:00Z",
    updated_at: "2026-05-22T14:40:00Z"
  }
];

export const SEED_ENABLERS: EcosystemEnabler[] = [
  {
    id: "ena_1",
    user_id: "usr_enabler_1",
    org_name: "T-Hub Hyderabad",
    org_type: "incubator",
    programs_offered: ["T-Tribe", "Lab32 Scaling Scheme", "Social Alpha Incubation"],
    sectors_focus: ["SaaS", "Blockchain", "AeroTech", "Hardware", "AGTech"],
    org_logo_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150",
    org_website: "https://t-hub.co",
    location: "IT Corridor, Gachibowli, Hyderabad",
    description: "T-Hub (Telangana Hub) is India's leading startup incubator. It powers tech scale-ups and fosters public-private corporate collaborations to boost startups.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2026-05-24T18:00:00Z"
  }
];

export const SEED_SERVICE_PARTNERS: ServicePartner[] = [
  {
    id: "ser_1",
    user_id: "usr_partner_1",
    service_categories: ["legal", "accounting", "consulting"],
    firm_name: "Chandra & Co Corporate Counsel",
    firm_logo: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=150",
    description: "A premier legal advisory offering frictionless startup registrations, SHA drafting, convertible loan structures, and intellectual property registrations.",
    verified_startup_clients: 24,
    location: "Jubilee Hills, Hyderabad",
    created_at: "2024-08-12T13:15:00Z",
    updated_at: "2026-05-19T11:20:00Z"
  }
];

export const SEED_LISTINGS: Listing[] = [
  {
    id: "lst_1",
    created_by: "usr_founder_1",
    type: "job",
    title: "Lead Orbit Mechanics Engineer",
    description: "Join Dhruva Space to design satellite trajectories, constellation station-keeping parameters, and orbital insertion configurations. Experience with STK, GMAT or Python orbit tooling mandatory.",
    company_name: "Dhruva Aerospace",
    company_logo_url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=150",
    location: "Hyderabad, Telangana",
    is_remote: false,
    salary_range_min: 1500000,
    salary_range_max: 2800000,
    tags: ["Aerospace", "Physics", "Satellite", "Python"],
    status: "active",
    views_count: 145,
    applications_count: 19,
    created_at: "2026-05-10T12:00:00Z",
    updated_at: "2026-05-25T01:00:00Z"
  },
  {
    id: "lst_2",
    created_by: "usr_founder_2",
    type: "job",
    title: "Senior Agri-AI Vision Researcher",
    description: "KhetiPoint seeks a computer vision scientist to expand crop diagnostics models for tomato leaf blight, cotton curl leaf virus, and rice blast datasets. Remote hybrid accepted.",
    company_name: "KhetiPoint Intelligence",
    company_logo_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150",
    location: "Warangal / Remote",
    is_remote: true,
    salary_range_min: 1200000,
    salary_range_max: 1800000,
    tags: ["Computer Vision", "PyTorch", "LLaMA", "Agriculture"],
    status: "active",
    views_count: 98,
    applications_count: 8,
    created_at: "2026-05-18T10:00:00Z",
    updated_at: "2026-05-24T18:00:00Z"
  },
  {
    id: "lst_3",
    created_by: "usr_enabler_1",
    type: "event",
    title: "Telangana Seed Funding Catalyst 2026",
    description: "A marquee pitching masterclass and direct matchmaking arena uniting 50 premium regional angel syndicates with early-stage pre-seed and seed founders. Register now for pitches.",
    company_name: "T-Hub Hyderabad",
    company_logo_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150",
    location: "T-Hub Catalyst Hall, Gachibowli",
    is_remote: false,
    tags: ["Investor Pitching", "Seed Funding", "Government Grants"],
    status: "active",
    views_count: 512,
    applications_count: 134,
    deadline: "2026-06-15T18:00:00Z",
    created_at: "2026-05-22T09:00:00Z",
    updated_at: "2026-05-25T13:00:00Z"
  }
];

export const SEED_POSTS: FeedPost[] = [
  {
    id: "pst_1",
    author_id: "usr_founder_1",
    content: "Thrilled to share that Dhruva Space has successfully qualified our modular deployment dispensers for orbital tests on ISRO's PSLV-C78 next month! Huge thanks to the Telangana tech community for driving deep-tech ecosystem focus. Gearing up for space! 🚀🛰️ #SpaceTech #ISRO #TelanganaRules",
    post_type: "achievement",
    tags: ["SpaceTech", "Achievement", "DeepTech"],
    likes_count: 84,
    comments_count: 5,
    shares_count: 12,
    is_pinned: true,
    created_at: "2026-05-24T08:00:00Z",
    updated_at: "2026-05-24T08:00:00Z"
  },
  {
    id: "pst_2",
    author_id: "usr_founder_2",
    content: "Any legal service partners here experienced in setting up Farmers Producer Organizations (FPO) licensing integrations and SaaS subscription contracts? We are drafting customized terms for our soil sensing cloud. Let's connect! 🌾🚜 #AgTech #AskingForHelp",
    post_type: "ask",
    tags: ["AgTech", "Legal", "FPO"],
    likes_count: 18,
    comments_count: 3,
    shares_count: 1,
    is_pinned: false,
    created_at: "2026-05-25T01:30:00Z",
    updated_at: "2026-05-25T01:30:00Z"
  }
];

export const SEED_POST_COMMENTS: Comment[] = [
  {
    id: "com_1",
    post_id: "pst_1",
    author_id: "usr_investor_1",
    content: "Incredible news Ramesh! This puts Dhruva at the forefront of satellite dispenser deployment engines in Asia. Let's catch up at T-Hub this week.",
    likes_count: 8,
    created_at: "2026-05-24T09:12:00Z"
  },
  {
    id: "com_2",
    post_id: "pst_2",
    author_id: "usr_partner_1",
    content: "Hi Anitha, we've structured three such FPOs in Karimnagar last quarter. We'd love to help you draft the right SaaS terms of use. Let's start a connection request!",
    likes_count: 3,
    created_at: "2026-05-25T03:00:00Z"
  }
];
