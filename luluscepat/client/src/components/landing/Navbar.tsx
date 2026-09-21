import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-40 border-b transition-all',
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-border'
            : 'bg-transparent border-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between gap-6 px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2 text-[13px] font-extrabold tracking-[0.14em] text-dark">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-dark text-[11px] font-black text-white">LC</span>
            LULUS CEPAT
          </a>

          <nav className="hidden items-center gap-7 text-[13px] font-medium text-text-secondary md:flex">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="transition hover:text-text">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#login"
              className="rounded-full px-4 py-2 text-[13px] font-semibold text-text transition hover:bg-white"
            >
              Login
            </a>
            <a
              href="#register"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-dark px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-dark-soft"
            >
              <span className="relative z-10">Mulai</span>
              <span className="relative z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[11px] transition group-hover:translate-x-0.5">→</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-orange transition duration-[450ms] ease-out group-hover:translate-x-0" aria-hidden />
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-dark md:hidden"
          >
            <span className="text-[16px] leading-none">{open ? '×' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* mobile overlay */}
      <div
        className={[
          'fixed inset-0 z-30 bg-white transition md:hidden',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        ].join(' ')}
        style={{ clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', transition: 'clip-path 420ms ease, opacity 300ms ease, transform 300ms ease' }}
      >
        <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col px-6 pb-10 pt-[84px]">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-5 text-[22px] font-semibold tracking-tight text-text"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex gap-3 pt-8">
            <a href="#login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-border bg-white px-5 py-3 text-center text-sm font-semibold">Login</a>
            <a href="#register" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-dark px-5 py-3 text-center text-sm font-semibold text-white">Mulai belajar</a>
          </div>
        </div>
      </div>
    </>
  )
}
