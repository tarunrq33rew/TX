import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabaseClient: any = null;

export function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        supabaseClient = createClient(url, key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          }
        });
        console.log("Supabase client initialized successfully.");
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
      }
    } else {
      console.warn("SUPABASE_URL and SUPABASE_ANON_KEY are not set in the environment. Operating in sandbox fallback mode.");
    }
  }
  return supabaseClient;
}
