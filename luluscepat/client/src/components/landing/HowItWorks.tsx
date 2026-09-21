import { useReveal } from '../../hooks/useReveal'

const STEPS = ['UPLOAD', 'ANALYZE', 'UNDERSTAND', 'PRACTICE', 'REVIEW']

// PRD §25 — SVG progress line under user scroll.
export function HowItWorks() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="how" ref={ref} className="border-t border-border bg-surface py-[96px] md:py-[128px]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="reveal mb-[48px] max-w-[640px]">
          <h2 className="text-[32px] font-extrabold tracking-tight text-dark md:text-[42px]">Bagaimana Cara Kerjanya</h2>
          <p className="mt-[12px] text-text-secondary">Lima langkah dari materi mentah menjadi pemahaman.</p>
        </div>

        <ol className="reveal relative ml-[10px] space-y-[28px] border-l-2 border-border pl-[24px]">
          {STEPS.map((s, i) => (
            <li key={s} className="relative">
              <span
                aria-hidden
                className="absolute left-[-33px] top-[2px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-dark"
              >
                <span className="h-[8px] w-[8px] rounded-full bg-orange" />
              </span>
              <div className="text-[11px] font-bold tracking-[0.16em] text-orange">STEP 0{i + 1}</div>
              <div className="text-[17px] font-bold tracking-tight text-dark">{s}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
