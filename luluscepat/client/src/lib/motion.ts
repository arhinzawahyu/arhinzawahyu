import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function initMotion() {
  if (registered) return
  registered = true
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
