import { useReveal } from '../../hooks/useReveal'

const PIPELINE = ['MATERIAL', 'SUMMARY', 'NOTES', 'FLASHCARDS', 'QUIZ']

// PRD §23 — editorial split; pipeline reveals one by one via .reveal stagger.
export function Why() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="product" ref={ref} className="py-[96px] md:py-[128px]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-[48px] px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="reveal text-[12px] font-bold uppercase tracking-[0.2em] text-orange">
            Kenapa Lulus Cepat
          </span>
          <h2 className="reveal mt-[16px] text-[36px] font-extrabold leading-[1.12] tracking-tight text-dark md:text-[48px]">
            Bukan sekadar ringkasan. Materimu diproses menjadi sesuatu yang bisa dipelajari.
          </h2>
          <p className="reveal mt-[20px] text-[17px] leading-[1.7] text-text-secondary">
            AI membaca, memahami, lalu menyusun ulang materi menjadi struktur belajar: inti, catatan, flashcard, dan latihan. Ringkasan hanyalah awal.
          </p>
        </div>

        <div className="reveal overflow-hidden rounded-[16px] border border-border bg-dark p-[24px] md:p-[32px]">
          {PIPELINE.map((step, i) => (
            <div key={step} className="flex items-center border-b border-white/10 py-[18px] last:border-0">
              <span className="mr-[20px] text-[11px] font-bold text-orange">0{i + 1}</span>
              <span className="text-[15px] font-semibold tracking-[0.08em] text-white">{step}</span>
              {i < PIPELINE.length - 1 && <span className="ml-auto text-white/30" aria-hidden>↓</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}