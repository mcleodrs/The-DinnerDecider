import { createClient } from "@supabase/supabase-js";

// 👇 Replace these with your actual Supabase values
const supabaseUrl = "https://ynxqhamvzmdobfdaahwu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueHFoYW12em1kb2JmZGFhaHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMjE0MTIsImV4cCI6MjA2NTY5NzQxMn0.2MmhMLyvww6IEdnq3Y9XmhZ5BcMrvoRYkKSKEratD8o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
