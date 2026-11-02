import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Pinned sections must have their positions calculated top-to-bottom,
// otherwise a later section measures the page before an earlier pin's
// spacer exists and the two pins overlap. Creation order isn't reliable
// (hot reload, re-mounts, preloader timing), so each pin gets an explicit
// refresh priority in page order (higher = earlier on the page).
export const PIN_PRIORITY = {
  services: 40,
  why: 30,
  methodology: 20,
  about: 10,
}

let queued = false

// Re-sort all triggers by priority and recalculate. Batched to one call per frame.
export function refreshPins() {
  if (queued) return
  queued = true
  requestAnimationFrame(() => {
    queued = false
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  })
}
