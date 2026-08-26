import { defineMiddleware } from "astro:middleware";
import { buatKlienSupabase, supabaseTerkonfigurasi } from "./lib/auth/server";
import { tentukanRute } from "./lib/auth/rute";

export const onRequest = defineMiddleware(async (context, next) => {
  if (!supabaseTerkonfigurasi()) {
    // Tanpa kunci Supabase: tetap lindungi rute privat secara kasar (anggap anonim).
    const arah = tentukanRute(context.url.pathname, false);
    return arah ? context.redirect(arah) : next();
  }

  const supabase = buatKlienSupabase(context.request.headers.get("cookie"), context.cookies);
  const { data } = await supabase.auth.getUser();
  const sesiAda = Boolean(data.user);

  context.locals.pengguna = data.user ?? null;
  context.locals.supabase = supabase;

  const arah = tentukanRute(context.url.pathname, sesiAda);
  if (arah) return context.redirect(arah);
  return next();
});
