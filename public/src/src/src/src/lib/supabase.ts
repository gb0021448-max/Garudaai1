import { createClient } from "@supabase/supabase-js";

const cleanValue = (val: string) => {
  return (val || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
};

const rawSupabaseUrl = cleanValue(import.meta.env.VITE_SUPABASE_URL) || "https://phvpnhqdlgummivlscjo.supabase.co";
const supabaseAnonKey = cleanValue(import.meta.env.VITE_SUPABASE_ANON_KEY) || "sb_publishable_TvelvZpFnHNAO5lmkDYX3A_09clPd0L";

let sanitizedSupabaseUrl = rawSupabaseUrl;
if (sanitizedSupabaseUrl.endsWith("/")) {
  sanitizedSupabaseUrl = sanitizedSupabaseUrl.slice(0, -1);
}
if (sanitizedSupabaseUrl.endsWith("/rest/v1")) {
  sanitizedSupabaseUrl = sanitizedSupabaseUrl.slice(0, -8);
}
if (sanitizedSupabaseUrl.endsWith("/")) {
  sanitizedSupabaseUrl = sanitizedSupabaseUrl.slice(0, -1);
}

export const isSupabaseConfigured = !!(sanitizedSupabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(sanitizedSupabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (input, init) => window.fetch(input, init)
      }
    }) 
  : null;
