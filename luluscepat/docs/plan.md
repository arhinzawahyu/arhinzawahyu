# Lulus Cepat — Plan

> PRD master: `luluscepat/docs/PRD.md` (112 section, sumber tunggal)

## Stack final (sesuai PRD, bukan Next.js lama)
- Client: React 19 + Vite 6 + Tailwind 4 + GSAP + ScrollTrigger + Lenis
- Server: Node + Express + Prisma + Neon PostgreSQL + Gemini API
- Auth: JWT (httpOnly cookie) + bcrypt, Google OAuth bertahap
- Repo: monorepo `luluscepat/` — `client/` + `server/` + `prisma/` + `scripts/`

## Slice (thin vertical)
1. **A — Scaffold + Landing** ← sekarang
   Scaffold Vite+TS, Tailwind, GSAP/Lenis, tokens warna (#1F2937, #EA580C, #F7F7F4), navbar+hero+why+features+workspace+how+CTA+footer (desktop+mobile), motion hierarchy, prefers-reduced-motion. Tanpa backend.
2. **B — Auth + DB**
   Prisma schema (User/Material/AIAnalysis/Flashcard/Quiz/QuizAttempt/LearningProgress/AIUsage/SystemLog), Neon connection, `npm run db:setup` health check, Express auth routes, login/register pages (split layout), middleware protect `/app`, `/admin`.
3. **C — Upload + Analyzer**
   Validasi PDF/text/image, file processing flow (S7), Gemini service, structured JSON validation, save Neon, processing screen (4 steps).
4. **D — Learning Workspace**
   Tabs Summary/Notes/Flashcards/Quiz/Ask AI, flashcard flip (GSAP 3D), quiz flow + score, AI Tutor contextual.
5. **E — Dashboard + Progress**
   Sidebar workspace, material library (search/filter), material detail, progress page, empty/error/skeleton states.
6. **F — Admin**
   `/admin/*` guard, CRUD users, AI usage chart, logs, settings.

Setiap slice: implement → 1 test runnable → verify build → commit atomik.

## Perintah dev (target)
```
npm install
npm run dev          # vite
npm run db:setup     # check env → connect neon → migrate → seed → verify
npm run db:migrate
npm run db:deploy
npm run build
```

## Env (placeholder, tak pernah commit secret)
```
DATABASE_URL=
NEON_DATABASE_URL=
GEMINI_API_KEY=
JWT_SECRET=
```

## Anti-slop gate tiap slice
- Typography kuat, whitespace editorial, orange = accent only, dark = struktur
- Larang: 3D robot, hologram, purple blobs, glassmorphism massal, grid 6 card identik, fake dashboard

## Definisi selesai produk (§109-112)
User bisa: landing → daftar → upload PDF/text/image → analisis Gemini → summary/notes/flashcard/quiz/tutor → progress → admin monitor.
