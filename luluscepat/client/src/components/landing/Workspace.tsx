import { useReveal } from '../../hooks/useReveal'

// PRD §26 — workspace preview with dark panel.
export function Workspace() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="workspace" ref={ref} className="border-t border-border bg-dark py-[96px] md:py-[128px]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="mb-[32px]">
          <span className="reveal text-[12px] font-bold uppercase tracking-[0.18em] text-orange">AI Workspace</span>
          <h2 className="reveal mt-[16px] text-[32px] font-extrabold tracking-tight text-white md:text-[42px]">
            Materi → Ringkasan → Catatan → Tanya AI
          </h2>
          <p className="reveal mt-[12px] text-[16px] leading-[1.7] text-white/60">
            Semuanya ada di satu workspace. Tugasmu: baca, pahami, latihan.
          </p>
        </div>

        <div className="reveal overflow-hidden rounded-[16px] border border-white/10 bg-black/40 p-[24px] font-mono text-[13px] leading-[1.7] text-white/95 md:p-[32px]">
          <div className="mb-[12px] border-b border-white/10 pb-[12px] text-white/45">
            <span className="font-semibold text-orange">📄</span> Sistem Operasi.pdf · 12 halaman
          </div>
          <div className="space-y-[10px]">
            <div className="border-l-[3px] border-orange pl-[12px]">
              <span className="text-[11px] font-bold tracking-[0.1em] text-orange">SUMMARY</span>
              <p className="mt-[4px] text-white/85">Sistem operasi adalah perangkat lunak yang mengatur sumber daya perangkat keras...</p>
            </div>
            <div className="border-l-[3px] border-white/15 pl-[12px]">
              <span className="text-[11px] font-bold tracking-[0.1em] text-white/45">KEY CONCEPTS</span>
              <div className="mt-[4px] flex flex-wrap gap-[8px]">
                {['Kernel', 'Process', 'Memory', 'File System'].map((k) => (
                  <span key={k} className="rounded-full bg-white/10 px-[10px] py-[4px] text-[12px]">{k}</span>
                ))}
              </div>
            </div>
            <div className="border-l-[3px] border-white/15 pl-[12px]">
              <span className="text-[11px] font-bold tracking-[0.1em] text-white/45">AI TUTOR</span>
              <p className="mt-[4px] text-white/60">Tanyakan apa saja — AI akan menjelaskan berdasarkan konteks materi ini.</p>
            </div>
          </div>
          <div className="mt-[16px] rounded-full bg-white/5 px-[14px] py-[10px]">
            <span className="text-white/35">Jelaskan bagian ini dengan analogi sederhana</span>
          </div>
        </div>
      </div>
    </section>
  )
}
