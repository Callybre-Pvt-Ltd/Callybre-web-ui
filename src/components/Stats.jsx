import { useEffect, useRef, useState } from 'react'
import { STATS } from '../data/site.js'

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const dur = 1400
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1)
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => { observer.disconnect(); cancelAnimationFrame(raf) }
  }, [value])

  return <span ref={ref}>{n}{suffix}</span>
}

export default function Stats() {
  return (
    <section className="border-y border-white/[0.06] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.06]">
          {STATS.map((s) => (
            <div key={s.label} className="py-10 px-8 text-center">
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
