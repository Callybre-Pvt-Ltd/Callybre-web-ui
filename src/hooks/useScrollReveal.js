import { useEffect, useRef } from 'react'
import { useAppReady } from '../context/AppReadyContext.jsx'

/**
 * Attaches an IntersectionObserver to the returned ref and adds the
 * `is-visible` class (see .reveal-on-scroll in index.css) once the
 * element scrolls into view — but only after the preloader has finished.
 */
export default function useScrollReveal() {
  const ref = useRef(null)
  const { ready } = useAppReady()

  useEffect(() => {
    if (!ready) return
    const el = ref.current
    if (!el) return

    // If already in viewport when ready fires, make visible immediately
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ready])

  return ref
}
