<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🚀 TG10X Startup & Ecosystem Registry

A next-generation, high-performance community portal and connection catalog designed to bind startup founders, active investors, experienced mentors, service partners, and ecosystem enablers into a cohesive web platform.

Built with **React 19**, **Vite 6**, **TailwindCSS v4**, **Express**, **Supabase (Postgres)**, and integrated with the **Google Gemini 3.5 Flash** AI engine.

---

## 🌟 Key Features

*   **👥 Unified Registry Catalog:** Explore member profiles filtered by specific roles (Founders, Investors, Mentors, Service Partners, Enablers) and location (cities, states).
*   **💡 AI Strategic Match-making:** Leveraging Gemini 3.5 Flash, the app computes matching scores between different stakeholders, drafts customizable introductory messages, and explains strategic reasons for the match.
*   **✍️ AI Professional Bio Generator:** Auto-generates high-converting, tailored Indian ecosystem professional bios based on input skills, goals, and affiliations.
*   **🔍 AI Natural Language Search:** Translates conversational search queries (e.g., *"SaaS investors in Hyderabad looking for seed stage startups"*) into structured database parameters.
*   **🤝 Networking & Connections:** Send, accept, or reject connection requests. Dynamic system notifications update users on activities.
*   **📢 Community Feed:** Share updates, post articles, comment, and like ecosystem activities in real-time.
*   **💼 StartupZone Listings:** Publish and browse job postings, funding alerts, grants, events, and service partner listings.
*   **🛡️ Robust Hybrid Architecture:** Features a self-healing fallback registry (`server_temp_db.json`) that keeps the app fully functional if Supabase is offline or tables are uninitialized.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19 (SPA), Vite 6, TypeScript, TailwindCSS v4, Motion (Framer Motion), Lucide React, Next Themes |
| **Backend** | Node.js, Express, ESBuild, TSX |
| **Database** | Supabase (PostgreSQL), native Row-Level Security (RLS) policies, indexes |
| **AI Engine** | Google Gemini 3.5 Flash via `@google/genai` SDK |

---

## 🚀 Local Development Setup

### Prerequisites

*   **Node.js** (v18+ recommended)
*   **npm** (comes with Node.js)
*   **Supabase Account** (for live PostgreSQL integration)
*   **Gemini API Key** (from Google AI Studio)

---

### Step 1: Install Dependencies

Clone the workspace and run the installer:
```bash
npm install
```

---

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory. You can copy the template from `.env.example`:

```bash
# GEMINI_API_KEY: Required for Gemini AI matching, search interpretation, and bio generation
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: The URL where the application is hosted
APP_URL="http://localhost:3000"

# SUPABASE_URL & SUPABASE_ANON_KEY: Required for database storage and profiles ingestion
SUPABASE_URL="your_supabase_project_url_here"
SUPABASE_ANON_KEY="your_supabase_anon_key_here"
```

---

### Step 3: Initialize Supabase Database

1. Go to your **Supabase Dashboard** and open your project.
2. Navigate to the **SQL Editor** from the left panel.
3. Open the file [supabase_setup.sql](./supabase_setup.sql) located in the root of this project.
4. Copy its contents, paste them into the Supabase SQL Editor, and click **Run**.
   * *This will safely initialize all 14 tables, set up performance indexes, and configure permissive Row Level Security (RLS) read/write bypass policies for testing.*

---

### Step 4: Run the App

Launch the development server:
```bash
npm run dev
```

The Express server will start up, configure `dotenv` environment variables, hook up the Supabase PostgreSQL connection, and start serving the Vite React client at:
👉 **http://localhost:3000**

---

## 🏗️ Production Build

To compile a highly optimized production bundle of both the frontend React client and the backend Express server, execute:

```bash
# 1. Compile frontend client and bundle server
npm run build

# 2. Run the production build
npm run start
```

This compiles static assets into `dist/` and runs the production server using the compiled `dist/server.cjs` bundle.

---

## 📁 Project Structure

```
tg10x-explore/
├── src/                    # Frontend React SPA
│   ├── components/         # Reusable UI widgets & layout templates
│   ├── data/               # Local seed datasets
│   ├── types.ts            # Common TypeScript type interfaces
│   ├── App.tsx             # Main dashboard shell & page router
│   ├── main.tsx            # React application mount script
│   └── index.css           # Global styles and Tailwind configuration
├── server/                 # Express Backend Server Modules
│   ├── ai.ts               # Gemini AI engine (matching, bios, search parsing)
│   ├── db.ts               # Database coordinator & sync pipeline
│   └── supabase.ts         # Supabase client instantiation
├── server.ts               # Entrypoint Express Server script
├── supabase_setup.sql      # Idempotent PostgreSQL schema setup for Supabase
├── .env.example            # Environment variables template
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build pipeline setup
```

---

## 🤖 AI Core Integrations

1.  **AI Matching engine** (`server/ai.ts` -> `computeAiMatch`): Takes two member profiles and runs a compatibility check, outputs a percentage score (50-99), 3 bullet points of strategic reasons, and drafts a friendly, personalized introduction message.
2.  **AI Bio Generator** (`server/ai.ts` -> `generateProfileBio`): Generates a custom, high-impact personal overview paragraph tailored for the startup ecosystem.
3.  **AI Search Parser** (`server/ai.ts` -> `interpretVagueSearch`): Translates human questions (e.g. *"who is a mentor in Noida?"*) into structured filter schema objects: `{ role: "mentor", city: "Noida" }`.
