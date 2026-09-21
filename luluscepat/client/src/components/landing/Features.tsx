import { useReveal } from '../../hooks/useReveal'

// PRD §24 — no 6-card grid; three editorial blocks with # styling (01, 02, 03).
const FEATURES = [
  {
    n: '01',
    title: 'SUMMARY',
    desc: 'Pahami inti materi tanpa kehilangan konteks. Summary terstruktur: title, key ideas, conclusion.',
  },
  {
    n: '02',
    title: 'FLASHCARDS',
    desc: 'Ubah konsep menjadi latihan recall. Setiap kartu menyimpan concept + difficulty.',
  },
  {
    n: '03',
    title: 'QUIZ',
    desc: 'Uji apakah kamu benar-benar paham. Multiple choice / true-false / essay, dengan penjelasan.',
  },
]

export function Features() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="features" ref={ref} className="border-t border-border bg-surface py-[96px] md:py-[128px]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="reveal mb-[64px] max-w-[640px]">
          <h2 className="text-[32px] font-extrabold tracking-tight text-dark md:text-[42px]">Fitur yang membentuk pembelajaran</h2>
          <p className="mt-[12px] text-text-secondary">Tiga bentuk hasil belajar yang lahir dari satu materi.</p>
        </div>

        <div className="grid gap-[32px] md:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.n} className="reveal rounded-[16px] border border-border bg-bg p-[32px]">
              <div className="text-[12px] font-bold tracking-[0.16em] text-orange">{f.n}</div>
              <h3 className="mt-[8px] text-[18px] font-extrabold tracking-tight text-dark">{f.title}</h3>
              <p className="mt-[12px] text-[14px] leading-[1.7] text-text-secondary">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
