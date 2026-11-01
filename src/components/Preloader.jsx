import { useEffect, useState } from 'react'
import { useAppReady } from '../context/AppReadyContext.jsx'

const LETTERS = ['C', 'A', 'L', 'L', 'Y', 'B', 'R', 'E']

// Longest strip transition: delay 0.6s + duration 0.9s ≈ 1.5s
// We add a small buffer so ready fires only after all strips finish.
const READY_AFTER   = 400   // ms — mark "loaded" (start slide-up)
const READY_SIGNAL  = 1600  // ms — animations can start
const HIDDEN_AFTER  = 1900  // ms — remove DOM node

export default function Preloader() {
  const [loaded, setLoaded]   = useState(false)
  const [hidden, setHidden]   = useState(false)
  const { setReady }          = useAppReady()

  useEffect(() => {
    // Always start at top on every page load / refresh
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const t1 = setTimeout(() => setLoaded(true),  READY_AFTER)
    const t2 = setTimeout(() => setReady(true), READY_SIGNAL)
    const t3 = setTimeout(() => setHidden(true), HIDDEN_AFTER)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [setReady])

  if (hidden) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex w-full h-full pointer-events-none ${loaded ? 'loaded' : ''}`}
    >
      {LETTERS.map((letter, i) => (
        <div
          key={`${letter}-${i}`}
          className="loader-strip flex-1 h-full bg-[#0a0a0a] flex items-center justify-center"
          style={{
            transitionDelay: `${(0.6 - i * 0.08).toFixed(2)}s`,
            borderBottom: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <span className="text-white text-3xl md:text-5xl font-black tracking-widest">{letter}</span>
        </div>
      ))}
    </div>
  )
}
