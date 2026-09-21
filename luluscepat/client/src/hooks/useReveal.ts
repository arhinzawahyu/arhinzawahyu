import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'

// Reveal-on-scroll for section content (PRD §17).
// Put class "reveal" on any direct children to stagger them.
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = [...el.querySelectorAll('.reveal')]
    const self = el.classList.contains('reveal') ? [el, ...targets] : targets
    if (self.length === 0) return

    const tween = gsap.fromTo(
      self,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return ref
}