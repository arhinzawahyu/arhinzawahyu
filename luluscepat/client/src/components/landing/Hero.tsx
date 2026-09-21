import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/motion'

// PRD §18 — hero sequence, timed reveals. No generic dashboard mockup.
export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero-bg', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
        .fromTo('.hero-eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.15)
        .fromTo('.hero-line', { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.1 }, 0.35)
        .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.65)
        .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.85)
        .fromTo('.hero-visual', { y: 32, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, 1.0)
        .fromTo('.hero-step', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.15 }, 1.2)
        .fromTo('.hero-output', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.5)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="hero-bg relative overflow-hidden pt-[110px] pb-[64px] md:pt-[150px] md:pb-[96px]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-[48px] px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="hero-eyebrow text-[12px] font-bold uppercase tracking-[0.2em] text-text-secondary">
            AI Learning Assistant
          </span>
          <h1 className="mt-[20px] text-[52px] font-black leading-[1.02] tracking-tight text-dark md:text-[84px]">
            <span className="block overflow-hidden"><span className="hero-line block">Belajar.</span></span>
            <span className="block overflow-hidden"><span className="hero-line block">Pahami.</span></span>
            <span className="block overflow-hidden"><span className="hero-line block text-orange">Lulus.</span></span>
          </h1>
          <p className="hero-desc mt-[20px] max-w-[460px] text-[17px] leading-[1.65] text-text-secondary">
            Ubah materi panjang menjadi pemahaman yang lebih sederhana. Upload PDF, gambar, atau teks — AI menyusunnya jadi ringkasan, catatan, dan latihan.
          </p>
          <div className="hero-cta mt-[36px] flex flex-wrap items-center gap-3">
            <a
              href="#register"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-dark px-[28px] py-[15px] text-[15px] font-semibold text-white no-underline"
            >
              <span className="relative z-10">Mulai Belajar</span>
              <span className="relative z-10" aria-hidden>→</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-orange transition duration-[450ms] ease-out group-hover:translate-x-0" aria-hidden />
            </a>
            <a href="#how" className="rounded-full px-[24px] py-[15px] text-[15px] font-semibold text-dark no-underline transition hover:bg-white">
              Lihat cara kerja
            </a>
          </div>
        </div>

        <div className="hero-visual relative overflow-hidden rounded-[16px] border border-border bg-surface p-[24px] md:p-[28px]">
          <div className="mb-[16px] text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
            Drop your material
          </div>
          <div className="grid grid-cols-3 gap-[10px]">
            {[
              { icon: '📄', label: 'PDF' },
              { icon: '🖼', label: 'IMAGE' },
              { icon: '✎', label: 'TEXT' },
            ].map((t) => (
              <div key={t.label} className="hero-step rounded-[10px] border border-border bg-bg px-[8px] py-[18px] text-center">
                <div className="text-[20px]" aria-hidden>{t.icon}</div>
                <div className="mt-[6px] text-[10px] font-bold tracking-[0.12em] text-dark">{t.label}</div>
              </div>
            ))}
          </div>
          <div className="hero-step mt-[16px] text-[13px] font-medium text-text-secondary">
            <span className="text-orange">●</span> Understanding…
          </div>
          <div className="hero-step mt-[8px] h-[4px] w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[62%] rounded-full bg-orange" />
          </div>
          <div className="hero-output mt-[20px] border-t border-border pt-[16px]">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">Learning ready</div>
            <div className="mt-[6px] flex flex-wrap gap-[8px]">
              {['Summary', 'Flashcards', 'Quiz'].map((o) => (
                <span key={o} className="rounded-full bg-dark px-[12px] py-[5px] text-[12px] font-semibold text-white">{o}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
