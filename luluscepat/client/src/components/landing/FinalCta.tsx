import { useReveal } from '../../hooks/useReveal'

export function FinalCta() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="border-t border-border bg-bg py-[96px] text-center md:py-[128px]">
      <div className="mx-auto max-w-[720px] px-6">
        <h2 className="reveal text-[36px] font-extrabold leading-[1.1] tracking-tight text-dark md:text-[52px]">
          Materimu sudah ada.<br />Sekarang tinggal pahami.
        </h2>
        <div className="reveal mt-[32px]">
          <a href="#register" className="group relative inline-flex items-center gap-[10px] overflow-hidden rounded-full bg-dark px-[28px] py-[15px] text-[15px] font-semibold text-white no-underline">
            <span className="relative z-10">Mulai Belajar</span>
            <span className="relative z-10">→</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-orange transition duration-[450ms] ease-out group-hover:translate-x-0" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg py-[48px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-[24px] px-6 md:flex-row md:items-center lg:px-8">
        <div className="flex items-center gap-[10px] text-[12px] font-extrabold tracking-[0.14em] text-dark">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-dark text-[10px] font-black text-white">LC</span>
          LULUS CEPAT
        </div>
        <nav className="flex flex-wrap gap-[20px] text-[13px] font-medium text-text-secondary">
          {['Product', 'Features', 'Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="transition hover:text-text">{l}</a>
          ))}
        </nav>
        <p className="text-[12px] text-text-secondary">© 2026 Lulus Cepat</p>
      </div>
    </footer>
  )
}