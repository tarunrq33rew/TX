import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabaseClient: any = null;

async function fetchWithRetry(url: RequestInfo | URL, options?: RequestInit, retries = 3, delay = 1000): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok && (response.status >= 500 || response.status === 429) && retries > 0) {
      console.warn(`Supabase fetch returned status ${response.status}. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    return response;
  } catch (error: any) {
    console.error("Supabase Error:", error.message, error);
    if (retries > 0) {
      console.warn(`Supabase fetch failed: ${error.message || error}. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

export function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        supabaseClient = createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false,
          },
          global: {
            fetch: fetchWithRetry,
          }
        });
        console.log("Supabase client initialized successfully.");

        // Register auth state change listener
        supabaseClient.auth.onAuthStateChange((event: string, session: any) => {
          console.log(`Supabase Auth Event: ${event}`, session ? `Session User ID: ${session.user.id}` : "No Active Session");
        });
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
      }
    } else {
      console.warn("SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY are not set in the environment. Operating in sandbox fallback mode.");
    }
  }
  return supabaseClient;
}

