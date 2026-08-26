/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    pengguna: import("@supabase/supabase-js").User | null;
    supabase: import("@supabase/supabase-js").SupabaseClient;
  }
}
