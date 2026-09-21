# LULUS CEPAT

## Product Requirement Document + UI/UX Specification

Product Type: AI Learning Assistant

Core Stack: React.js, Vite, Tailwind CSS, GSAP, GSAP ScrollTrigger, Lenis, Node.js, Express.js, Prisma ORM, Neon PostgreSQL, Gemini API

Core Input: PDF, Text, Image

Primary Purpose: Mengubah materi belajar yang panjang atau sulit menjadi pemahaman yang lebih terstruktur melalui AI.

---

# 1. PRODUCT VISION

Lulus Cepat adalah platform belajar berbasis AI yang membantu pengguna memahami materi, bukan sekadar memotong jumlah kata.

Pengguna dapat memberikan materi dalam bentuk PDF, text, atau gambar.

Gemini kemudian menganalisis materi dan menghasilkan:

- Summary
- Important Points
- Simple Explanation
- Learning Notes
- Keywords
- Flashcards
- Quiz
- AI Tutor Context

# 2. PRODUCT PRINCIPLE

Prinsip utama produk:

1. Understand first.
2. Summarize second.
3. Practice third.

Lulus Cepat tidak boleh terasa seperti chatbot yang dibungkus dashboard.

Produk harus terasa seperti learning workspace modern.

# 3. TARGET USER

Primary:
- Siswa SMA
- Mahasiswa
- Pembelajar umum

Use Case:
- Mempelajari materi ujian
- Meringkas modul
- Memahami jurnal
- Mempelajari catatan
- Membuat latihan soal
- Review materi

# 4. PRODUCT DIFFERENTIATION

Lulus Cepat bukan hanya: "Upload PDF → Summary"

Tetapi: "Upload → Understand → Structure → Practice → Review"

Hasil AI harus bisa dilanjutkan menjadi aktivitas belajar.

# 5. CORE FEATURES

## 5.1 AI Material Analyzer

Input: PDF, TXT, Text input, PNG, JPG, JPEG

AI melakukan:
- Document understanding
- Text extraction
- Image understanding
- Context analysis
- Concept extraction

Output: Summary, Important points, Definitions, Keywords, Explanation, Conclusion

## 5.2 Smart Summary

Format hasil: Title, Overview, Key Ideas, Important Details, Conclusion

Summary harus:
- Mudah dibaca
- Tidak terlalu panjang
- Mempertahankan konsep penting
- Menghindari pengulangan

## 5.3 AI Explanation

Mode: Simple, Standard, Deep, Analogy

Contoh: User memilih sebuah konsep. AI menjelaskan konsep tersebut berdasarkan materi yang sedang dipelajari.

## 5.4 AI Notes

AI menghasilkan: Definition, Concept, Example, Important Note, Common Mistake, Conclusion

## 5.5 Flashcard Generator

AI membuat: Question, Answer, Concept, Difficulty

Flashcard dapat: Dibaca, Diedit, Dihapus, Diulang

## 5.6 Quiz Generator

Jenis: Multiple Choice, True / False, Essay
Difficulty: Easy, Medium, Hard

Setelah quiz: Score, Correct Answer, Explanation, Learning recommendation

## 5.7 AI Tutor

AI Tutor harus memiliki konteks dari materi yang sedang dipelajari.

Flow: Material → AI Context → User Question → Gemini → Contextual Answer

AI tidak boleh secara default memberikan jawaban tanpa konteks ketika pertanyaan berhubungan dengan materi yang sedang aktif.

# 6. INPUT SYSTEM

## PDF
Support: PDF documents, Book chapters, Modules, Journals, Lecture materials

## Text
User dapat: Paste text, Type notes, Paste article

## Image
Support: PNG, JPG, JPEG
Contoh: Foto buku, Foto papan tulis, Screenshot, Catatan tulisan

# 7. FILE PROCESSING FLOW

```
USER
  ↓
SELECT INPUT
  ├── PDF
  ├── TEXT
  └── IMAGE
  ↓
VALIDATION
  ↓
UPLOAD / PREPARE CONTENT
  ↓
GEMINI PROCESSING
  ↓
STRUCTURE CONTENT
  ↓
GENERATE LEARNING OUTPUT
  ↓
SAVE RESULT
  ↓
LEARNING WORKSPACE
```

# 8. INFORMATION ARCHITECTURE

Public: `/`, `/features`, `/how-it-works`, `/pricing`, `/login`, `/register`

User: `/app`, `/app/materials`, `/app/materials/:id`, `/app/flashcards`, `/app/quiz`, `/app/progress`, `/app/profile`

Admin: `/admin`, `/admin/users`, `/admin/materials`, `/admin/ai-usage`, `/admin/logs`, `/admin/settings`

# 9. DESIGN DIRECTION

Design style: Editorial SaaS, Premium Education, Minimal, Motion-first, Typography-driven, Professional, Human

Inspirational direction: Linear, Vercel, Notion, Apple, high-end editorial websites, motion-focused premium showcase sites.

Jangan membuat UI terlihat seperti dashboard template.

# 10. ANTI AI SLOP RULE

Dilarang:
- Robot 3D
- Otak AI hologram
- Floating purple blobs
- Gradient berlebihan
- Glassmorphism di semua elemen
- Card grid berlebihan
- Badge "Powered by AI" di setiap section
- Fake dashboard screenshot
- Random floating shapes
- Animasi tanpa fungsi
- Rounded card berlebihan
- Shadow terlalu tebal

Wajib:
- Strong typography
- Clear hierarchy
- Asymmetric composition
- Controlled whitespace
- Editorial layout
- Purposeful motion
- Real interaction
- Consistent spacing
- Visual restraint

# 11. COLOR SYSTEM

- Primary Dark: `#1F2937`
- Primary Orange: `#EA580C`
- Background: `#F7F7F4`
- White: `#FFFFFF`
- Text: `#111827`
- Secondary Text: `#6B7280`
- Border: `#E5E7EB`
- Success: `#15803D`
- Warning: `#D97706`
- Error: `#DC2626`

Orange digunakan sebagai accent, bukan seluruh background.

Dark digunakan untuk: Navbar, Primary CTA, Headings tertentu, Navigation, Important controls

# 12. BUTTON LANGUAGE

Primary button: Dark background, White text.

Hover: Orange circular expansion dari area tertentu mengikuti inspirasi interaction button.

State: Default, Hover, Pressed, Loading, Disabled, Success

Animation: 450ms, ease-out. Hover: orange shape width+height expansion. Text tetap di foreground.

# 13. TYPOGRAPHY

Primary: Inter / Geist / Plus Jakarta Sans

Heading: Large, tight line-height, strong weight.

Body: Readable, comfortable line-height.

Jangan: oversized text everywhere, random font pairing, excessive italic.

# 14. SPACING

Base: 4px

Rhythm: 8, 12, 16, 24, 32, 48, 64, 96, 128

Desktop harus punya whitespace cukup. Mobile tidak boleh sekadar mengecilkan desktop.

# 15. GLOBAL MOTION SYSTEM

Libraries: GSAP, GSAP ScrollTrigger, Lenis

Optional: SVG animation, CSS transform, CSS clip-path, Canvas

Motion hierarchy:
- Micro interaction: 150–250ms
- Component transition: 300–500ms
- Section animation: 600–1000ms
- Hero sequence: 1000–1800ms
- Page transition: 500–800ms

# 16. LENIS

Untuk: smooth scrolling, scroll interpolation, scroll velocity, scroll-driven interaction.

Scroll harus smooth, responsive, tidak berat, tidak mengganggu aksesibilitas. Respect `prefers-reduced-motion`.

# 17. GSAP SYSTEM

GSAP untuk: hero sequence, text reveal, image reveal, section reveal, parallax, horizontal scrolling, progress animation, card transitions, modal animation, dashboard transitions, AI processing states.

GSAP ScrollTrigger untuk: section reveal, pinned storytelling, horizontal gallery, progress visualization, sticky learning interface.

# 18. HERO ANIMATION

Hero tidak memakai mockup dashboard generik.

Visual utama: Material → AI → Learning Output

Sequence:
- 0ms: Background masuk
- 150ms: Eyebrow muncul
- 350ms: Headline reveal
- 650ms: Description reveal
- 850ms: CTA reveal
- 1000ms: Material interface muncul
- 1200ms: AI processing mulai
- 1500ms: Learning output muncul

# 19. LANDING PAGE — NAVBAR

Desktop: logo kiri, nav Product/Features/How it Works/Pricing, kanan Login + CTA "Mulai".

Navbar tidak harus pill. Transparent, minimal border, sticky saat scroll.

Animation: initial `y: -30, opacity: 0`; scroll down mengecil; scroll up muncul kembali.

Mobile: logo + hamburger. Menu fullscreen/large overlay. GSAP clip-path reveal, stagger menu items.

# 20. LANDING HERO

Layout: kiri headline besar "Belajar. Pahami. Lulus." + deskripsi + CTA; kanan visual upload interface (Drop material, PDF/IMAGE/TEXT) dengan status process (Reading… Understanding… Learning Ready).

Hero visual harus terasa seperti proses yang sedang berlangsung.

# 21. HERO INTERACTION

Upload interface states: Idle, Drag, File selected, Uploading, Processing, Completed, Error.

Drag hover: border transition, scale 1.02, orange accent, magnetic cursor effect.
File masuk: card morph.
Processing: material berubah menjadi structured learning output.

# 22. HERO SIGNATURE ANIMATION

Konsep: **Material Transformation.**

```
PDF → ANALYZING → UNDERSTANDING → SUMMARY → FLASHCARDS → QUIZ
```

GSAP line movement. Visual terasa seperti transformasi informasi.

# 23. SECTION: WHY LULUS CEPAT

Layout editorial. Heading "Bukan sekadar ringkasan." + deskripsi + visual pipeline MATERIAL → SUMMARY → NOTES → FLASHCARDS → QUIZ.

Section pinned. Material bergerak mengikuti timeline. Setiap output muncul satu per satu.

# 24. SECTION: FEATURES

Bukan grid 6 card identik. Gunakan horizontal storytelling (01 SUMMARY, 02 FLASHCARDS, 03 QUIZ) dengan interactive preview. ScrollTrigger: pin section, animate content, progress indicator.

# 25. SECTION: HOW IT WORKS

```
UPLOAD → ANALYZE → UNDERSTAND → PRACTICE → REVIEW
```

Visual line pakai SVG. Progress line berjalan sesuai scroll.

# 26. SECTION: AI WORKSPACE

Tampilkan workspace representatif: Material title, Summary, Key Concepts, "Ask Lulus Cepat" input.

# 27. SECTION: FINAL CTA

Minimal. "Materimu sudah ada. Sekarang tinggal pahami." + [ Mulai Belajar ]

# 28. FOOTER

Minimal: Lulus Cepat + Product / Features / Privacy / Terms / Contact. Tidak puluhan link.

# 29. LOGIN PAGE

Desktop split layout: kiri branding + animated learning visual (slow SVG line animation); kanan form (Selamat datang kembali, Email, Password, Masuk, atau Google). Form stagger reveal.

# 30. REGISTER PAGE

Fields: Name, Email, Password, Confirm Password. Tombol "Buat Akun" + Google OAuth. Inline validation, tidak agresif.

# 31. AUTH FLOW

```
LANDING → LOGIN/REGISTER → AUTH PROVIDER → SESSION CREATED → CHECK ROLE
  ├── USER → USER APP
  └── ADMIN → ADMIN PANEL
```

# 32. USER DASHBOARD

Workspace, bukan admin panel mini. Sidebar (Dashboard, Materials, Flashcards, Quiz, Progress, Settings) + main (greeting, upload area, Continue Learning, Recent Activity).

# 33. DASHBOARD MOTION

Sidebar `x: -20 → 0`, header opacity reveal, upload area scale 0.98→1, material cards stagger 80ms, progress animated counter.

# 34. MATERIAL LIBRARY

Search, filter, sort. Card tidak seragam tingginya. Metadata: Title, Type, Date, Progress. Hover: preview text muncul.

# 35. MATERIAL DETAIL

Back, title, metadata, Summary, Key Concepts, AI Explanation, aksi [ Generate Flashcards ] [ Generate Quiz ].

# 36. UPLOAD MODAL

Drop zone + "or paste text" + [ Analyze ]. Enter 500ms (`y:30, scale:0.97`), exit 350ms.

# 37. AI PROCESSING SCREEN

Jangan spinner tunggal. Steps: 01 READING, 02 EXTRACTING CONCEPTS, 03 BUILDING STRUCTURE, 04 PREPARING LEARNING dengan progress bar per step. GSAP timeline mengaktifkan step satu per satu. Jangan berpura-pura progress kalau backend belum selesai.

# 38. AI RESULT EXPERIENCE

Tabs: Summary, Notes, Flashcards, Quiz, Ask AI. Tab transition: underline slide, content fade + y movement.

# 39. FLASHCARD UI

Card dengan pertanyaan, [ Balik Kartu ], GSAP 3D rotationY. Mobile: swipe.

# 40. QUIZ UI

Question counter, pilihan ganda, [ Jawab ]. Setelah jawab: highlight benar/salah + explanation reveal.

# 41. PROGRESS PAGE

Materials completed, Quiz score, Study streak, Learning history. Editorial statistics, bukan analytics korporat.

# 42. MOBILE UI

Landing: logo + hamburger, hero vertikal. Setelah login: bottom navigation Home / Materials / Quiz / Me.

# 43. MOBILE PRINCIPLE

Komposisi desktop tidak dipaksa ke mobile. Prioritas: content, readability, touch target, speed. Minimum touch target 44px.

# 44. RESPONSIVE BREAKPOINT

- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: > 1024px
- Large desktop: > 1440px

# 45. CURSOR INTERACTION

Desktop only. Custom cursor hanya di area tertentu (CTA, interactive cards, upload zone, important visual). Tetap accessible.

# 46. MAGNETIC BUTTON

Primary CTA desktop. Maks movement 6–10px, GSAP quickTo.

# 47. HOVER INTERACTION

- Button: orange reveal
- Card: translateY(-4px)
- Icon: small rotation
- Arrow: translateX(4px)
- Link: underline draw

Semua subtle.

# 48. SCROLL STORYTELLING

Urutan landing: Hero → Problem → Transformation → Features → Workspace → How It Works → CTA. Scroll sebagai storytelling engine.

# 49. SECTION TRANSITIONS

Blur edge, soft mask, large whitespace, SVG separator, color transition. Bukan background beda tiap 100px.

# 50. LOADING SYSTEM

Global loading minimal. Page loading: thin orange progress line. AI loading: dedicated processing interface. Skeleton hanya untuk data async.

# 51. ERROR STATES

Contoh copy: "File belum bisa diproses." / "Analisis belum selesai. Coba lagi." / "Koneksi terputus." Bahasa manusiawi dan jelas.

# 52. EMPTY STATES

Materials: "Belum ada materi." CTA "Upload materi pertama". Quiz: "Belum ada latihan dari materi ini."

# 53. ADMIN DASHBOARD

Sidebar: Dashboard, Users, Materials, AI Usage, Logs, Settings.

# 54. ADMIN DASHBOARD WIREFRAME

Overview: kartu stat (Users / AI Requests / Materials), AI Usage Trend chart, Recent Activity feed.

# 55. ADMIN USER MANAGEMENT

View/search/filter role, suspend, delete, change role. Table: User, Email, Role, Materials, AI Usage, Status, Created.

# 56. ADMIN AI USAGE

Total requests, successful, failed, usage by day, usage by user, average processing time.

# 57. ADMIN LOGS

Event: Login, Register, Upload, AI processing, Quiz creation, Admin action, Error.

# 58. ADMIN SECURITY

Route `/admin/*`. Middleware: auth check → jika gagal redirect login; role check → user dapat 403.

# 59. DATABASE

Provider: Neon PostgreSQL. ORM: Prisma.

Core entities: User, Material, AIAnalysis, Flashcard, Quiz, QuizAttempt, LearningProgress, AIUsage, SystemLog.

# 60. DATABASE RELATIONSHIP

```
USER
 ├── MATERIAL ── AI ANALYSIS
 │        ├── FLASHCARD
 │        └── QUIZ ── QUIZ ATTEMPT
 ├── LEARNING PROGRESS
 ├── AI USAGE
 └── SYSTEM LOG
```

# 61. USER TABLE

Fields: id, name, email, password_hash, avatar_url, role, status, created_at, updated_at. Role: `user`, `admin`.

# 62. MATERIAL TABLE

Fields: id, user_id, title, file_name, file_type, file_url, raw_content, summary, created_at, updated_at.

# 63. AI ANALYSIS TABLE

Fields: id, material_id, status, model, token_usage, processing_time, error_message, created_at. Status: `processing`, `completed`, `failed`.

# 64. FLASHCARD TABLE

Fields: id, material_id, question, answer, difficulty, created_at.

# 65. QUIZ TABLE

Fields: id, material_id, question, type, options, correct_answer, explanation, difficulty, created_at.

# 66. QUIZ ATTEMPT TABLE

Fields: id, quiz_id, user_id, answer, is_correct, score, created_at.

# 67. LEARNING PROGRESS TABLE

Fields: id, user_id, material_id, progress, completed, last_accessed, created_at, updated_at.

# 68. AI USAGE TABLE

Fields: id, user_id, model, input_tokens, output_tokens, total_tokens, processing_time, created_at.

# 69. SYSTEM LOG TABLE

Fields: id, user_id, action, metadata, ip_hash, created_at.

# 70. NEON AUTOMATED SETUP

Wajib `.env` dan `.env.example`. Required env:

```
DATABASE_URL=
NEON_DATABASE_URL=
GEMINI_API_KEY=
JWT_SECRET=
```

API key tidak boleh masuk ke frontend.

# 71. NEON CONNECTION FLOW

APPLICATION START → LOAD ENV → CHECK DATABASE_URL (missing → setup error) → PRISMA CLIENT → CONNECT NEON (failed → connection error) → DATABASE READY.

# 72. AUTOMATED DATABASE SETUP

`npm run db:setup` harus: check environment → connect Neon → check schema → run Prisma migration → create indexes → run seed → verify tables → output `Lulus Cepat database is ready.`

# 73. PRISMA COMMANDS

- `npm run db:migrate` (dev)
- `npm run db:deploy` (prod)
- `npm run db:seed`
- `npm run db:setup`
- `npx prisma generate`

# 74. DATABASE MIGRATION FLOW

CODE CHANGE → PRISMA SCHEMA → MIGRATION GENERATION → MIGRATION FILE → NEON DATABASE → SCHEMA UPDATED.

# 75. GEMINI INTEGRATION

Provider: Google Gemini API.

Digunakan untuk: PDF understanding, image understanding, text analysis, summary, notes, flashcard, quiz, tutor responses. Env: `GEMINI_API_KEY`.

# 76. GEMINI PROCESSING ARCHITECTURE

```
REACT → BACKEND API → VALIDATE INPUT → GEMINI SERVICE → GEMINI API
  → STRUCTURED JSON RESULT → VALIDATE OUTPUT → PRISMA → NEON → REACT RESULT UI
```

# 77. AI OUTPUT FORMAT

Structured JSON, divalidasi backend sebelum disimpan:

```json
{
  "title": "",
  "summary": "",
  "keyPoints": [],
  "keywords": [],
  "explanation": "",
  "conclusion": "",
  "flashcards": [],
  "quiz": []
}
```

# 78. GEMINI ERROR HANDLING

Retry dengan batas. Jika tetap gagal: `status = failed`, simpan error ke AIAnalysis. User melihat pesan manusiawi, bukan API error mentah.

# 79. FILE STORAGE

File terpisah dari data relasional. DB hanya simpan `file_url`, `file_name`, `file_type`.

# 80. SECURITY

Wajib: API keys server-side, env vars, HTTPS, auth, authorization, rate limiting, file validation, file size limit, input sanitization, structured AI output validation.

Jangan pernah: expose `GEMINI_API_KEY`, expose `DATABASE_URL`, expose DB credentials, simpan secret di Git.

# 81. AUTHENTICATION

Email + Password dan Google OAuth. Session: secure cookie / JWT. Password di-hash dengan algoritma aman.

# 82. AUTH FLOW

Register: VALIDATE → CREATE USER → HASH PASSWORD → SAVE DATABASE → CREATE SESSION → DASHBOARD.
Login: VALIDATE → FIND USER → VERIFY PASSWORD → CREATE SESSION → CHECK ROLE → APP atau ADMIN.

# 83. API STRUCTURE

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`
- Materials: `POST /api/materials`, `GET /api/materials`, `GET /api/materials/:id`, `DELETE /api/materials/:id`
- AI: `POST /api/ai/analyze`, `POST /api/ai/explain`, `POST /api/ai/flashcards`, `POST /api/ai/quiz`, `POST /api/ai/tutor`
- Progress: `GET /api/progress`, `POST /api/progress`
- Admin: `GET /api/admin/users`, `GET /api/admin/usage`, `GET /api/admin/logs`

# 84. API STATE SYSTEM

Setiap request punya state: `idle`, `loading`, `success`, `error`. UI merespons setiap state.

# 85. PERFORMANCE

Fast initial render, optimized images, lazy loading, code splitting, GPU-friendly animation (`transform`, `opacity`).

# 86. ACCESSIBILITY

Keyboard navigation, visible focus, semantic HTML, ARIA labels, readable contrast, `prefers-reduced-motion` (disable parallax berat, cursor animation, complex transition).

# 87. PERFORMANCE ANIMATION RULE

Prinsip "tidak semua elemen bergerak". Prioritas: 1) Hero, 2) Navigation, 3) Upload interaction, 4) AI processing, 5) Learning result, 6) Section storytelling. Dashboard lebih tenang daripada landing.

# 88. UI COMPONENT SYSTEM

Button, Input, Textarea, Modal, Drawer, Navbar, Sidebar, Tabs, Progress, Toast, Card, File Upload, AI Processing, Flashcard, Quiz, Tooltip, Dropdown, Table, Dialog, Skeleton.

# 89. COMPONENT STATES

Setiap komponen wajib: Default, Hover, Focus, Active, Loading, Disabled, Error, Success.

# 90. DESIGN TOKENS

Radius: Small 6px, Medium 10px, Large 16px. Hero boleh lebih besar. Shadow: very subtle, tanpa shadow hitam tebal.

# 91. ICONOGRAPHY

Icon system konsisten, prefer Lucide. Icon bukan sekadar dekorasi.

# 92. LANDING PAGE FLOWCHART

OPEN → NAVBAR → HERO → WHY LULUS CEPAT → MATERIAL TRANSFORMATION → FEATURE STORY → AI WORKSPACE → HOW IT WORKS → FINAL CTA → FOOTER.

# 93. USER LEARNING FLOWCHART

LOGIN → DASHBOARD → UPLOAD MATERIAL → CHOOSE INPUT (PDF/TEXT/IMAGE) → VALIDATION → GEMINI AI → AI ANALYSIS → STRUCTURED DATA → SAVE TO NEON → LEARNING PAGE (SUMMARY/NOTES/CARDS/QUIZ) → PROGRESS.

# 94. ADMIN FLOWCHART

ADMIN LOGIN → AUTHENTICATION → ROLE CHECK (user → denied) → ADMIN DASHBOARD (users/materials/ai usage/logs/settings).

# 95. FULL SYSTEM FLOWCHART

PUBLIC UI dan AUTH SYSTEM → USER/ADMIN → USER DASHBOARD / ADMIN PANEL → UPLOAD MATERIAL → BACKEND API → GEMINI + STORAGE → AI RESULT → PRISMA ORM → NEON POSTGRESQL → LEARNING UI → NOTES/CARDS/QUIZ → PROGRESS.

# 96. LANDING PAGE ASCII MAP

Desktop: logo + nav atas, hero kiri (eyebrow, Belajar./Pahami./Lulus., deskripsi, CTA) + kanan drop zone, lalu MATERIAL → UNDERSTANDING, FEATURE STORY, AI WORKSPACE, HOW IT WORKS, FINAL CTA, FOOTER.

# 97. MOBILE LANDING MAP

Navbar minim, hero vertikal (stack), drop zone penuh lebar, section ditumpuk tanpa sidebar.

# 98. ADMIN ASCII MAP

Sidebar kiri (Dashboard/Users/Materials/AI Usage/Logs/Settings) + kanan stat cards, AI Usage Trend, Recent Activity.

# 99. ERROR FLOWCHART

USER ACTION → VALIDATION (invalid → inline error) → API REQUEST (network error → retry state) → GEMINI (failed → log + user message) → VALIDATE AI JSON (invalid → fallback error) → SAVE NEON (failed → server error) → SUCCESS → RESULT UI.

# 100. FOLDER STRUCTURE

```
src/
  components/ ui/ landing/ auth/ dashboard/ admin/ learning/
  pages/ index.jsx login.jsx register.jsx app/ admin/
  services/ gemini/ database/ auth/
  lib/ prisma/ auth/ validation/
  hooks/ useLenis useGSAP useAuth
  animations/ hero scroll transitions interactions
  styles/ globals.css
server/
  routes/ middleware/ services/
prisma/
  schema.prisma migrations/
scripts/
  db-setup.js seed.js
```

# 101. DEVELOPMENT COMMANDS

- `npm install`
- `npm run dev`
- `npm run db:setup`
- `npm run db:migrate`
- `npm run db:deploy`
- `npm run db:seed`
- `npm run build`

# 102. ENVIRONMENT

`.env` dan `.env.example`:

```env
DATABASE_URL=
NEON_DATABASE_URL=
GEMINI_API_KEY=
JWT_SECRET=
```

Secret hanya server-side. **Credential asli tidak pernah masuk Git / source code / PRD.**

# 103. DEPLOYMENT FLOW

LOCAL DEVELOPMENT → GIT → CI/CD → INSTALL → ENV VARS → PRISMA GENERATE → PRISMA MIGRATE DEPLOY → NEON → BUILD REACT → DEPLOY.

# 104. UI QUALITY CHECKLIST

- Landing: hero tidak generik, typography kuat, no fake dashboard, clear CTA, motion bertujuan.
- Auth: simple, professional, fast.
- Dashboard: calm, readable, focused, tidak overload.
- Admin: dense but organized, clear hierarchy, efficient.
- Mobile: touch friendly, readable, no horizontal overflow.

# 105. ANIMATION QUALITY CHECKLIST

Smooth, purposeful, consistent, interruptible, responsive. Jangan: jitter, excessive bounce, random movement, slow interaction, heavy parallax.

# 106. MOTION MAPPING

- Navbar: reveal, shrink, hide/show
- Hero: text reveal, material transformation, CTA hover
- Feature: scroll storytelling, pinned content, progress line
- Upload: drag feedback, file morph
- AI process: step transition, progress state
- Result: tab transition, content reveal
- Flashcard: 3D flip
- Quiz: answer reveal
- Dashboard: stagger, counter, progress animation
- Admin: chart draw, table reveal

# 107. MICRO INTERACTIONS

Button: magnetic + orange reveal. Link: underline draw. Input: focus border animation. File: drop zone expansion. Card: lift 4px. Arrow: translateX 4px. Tab: sliding indicator. Toast: slide + fade.

# 108. REDUCED MOTION

Saat `prefers-reduced-motion: reduce`: disable parallax, large movement, custom cursor, complex page transition. Pertahankan opacity transition, instant state, usability.

# 109. PRODUCT SUCCESS CRITERIA

1. Landing page terbuka dan value produk jelas.
2. Akun dibuat.
3. Upload PDF/text/gambar.
4. Kirim ke Gemini.
5. Terima hasil analisis.
6. Lihat summary.
7. Buat notes, flashcards, quiz.
8. Pakai AI Tutor.
9. Simpan materi.
10. Lihat progress.
11. Admin memonitor sistem.

# 110. FINAL IMPLEMENTATION PRINCIPLE

Bukan "website AI dengan banyak card", melainkan "learning experience dengan AI sebagai engine".

Identitas: typography, editorial composition, orange interaction, dark controls, purposeful motion, learning transformation.

Hierarchy: Content > Interaction > Decoration. Motion: Meaning > Movement. AI: Understanding > Summary.

# 111. FINAL PRODUCT FLOW

LANDING → CREATE ACCOUNT → DASHBOARD → UPLOAD → VALIDATE → GEMINI ANALYSIS → STRUCTURED DATA → NEON → LEARNING WORKSPACE (SUMMARY/NOTES/FLASHCARDS/QUIZ/AI TUTOR) → PROGRESS → REVIEW.

# 112. FINAL DESIGN STATEMENT

Karakter akhir: **Quiet, Sharp, Editorial, Professional, Interactive, Motion-rich, Human.**

Orange = aksen interaksi. Dark = struktur. Whitespace = napas. GSAP = storytelling. Lenis = scroll natural. Gemini = intelligence layer. Neon = persistence. React = application layer.

Core experience: UPLOAD → UNDERSTAND → STRUCTURE → PRACTICE → LEARN.

---

## Catatan Keamanan

- API key Gemini dan kredensial Neon **tidak pernah** ditanam ke PRD/source code.
- Wajib lewat environment variable (`.env`, tidak di-track Git).
- PRD menggunakan variabel placeholder (`GEMINI_API_KEY=`, `DATABASE_URL=`) agar integrasi dibangun dengan benar tanpa membocorkan credential.