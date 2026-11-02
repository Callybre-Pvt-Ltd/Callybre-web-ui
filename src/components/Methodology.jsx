import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PIN_PRIORITY, refreshPins } from '../lib/scrollOrder.js'
import Reveal from './Reveal.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import { methodologySteps } from '../data/services.js'

gsap.registerPlugin(ScrollTrigger)

const ACCENT = { purple: '#a78bfa', blue: '#60a5fa' }

export default function Methodology() {
  const headRef      = useScrollReveal()

  /* mobile refs */
  const mSectionRef  = useRef(null)   // outer tall scroll container
  const mTrackRef    = useRef(null)   // horizontal flex track
  const mProgressRef = useRef(null)   // progress fill bar

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(max-width: 767px)', () => {
      const section = mSectionRef.current
      const track   = mTrackRef.current
      if (!section || !track) return

      const getAmt = () => -(track.scrollWidth - window.innerWidth)

      gsap.to(track, {
        x: getAmt,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getAmt())}`,
          pin: true,
          refreshPriority: PIN_PRIORITY.methodology,
          scrub: 1.1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (mProgressRef.current) {
              mProgressRef.current.style.width = `${self.progress * 100}%`
            }
          },
        },
      })
    })

    refreshPins()
    return () => {
      mm.revert()
      refreshPins()
    }
  }, [])

  return (
    <section id="methodology" className="bg-[#0d0d0d] border-t border-white/[0.06]">

      {/* ═══════════════════════════════════════
          DESKTOP — unchanged table rows
      ═══════════════════════════════════════ */}
      <div className="hidden md:block py-28 max-w-7xl mx-auto px-6 lg:px-20">

        {/* Heading */}
        <div ref={headRef} className="reveal-on-scroll mb-16">
          <p className="sec-label">How We Work</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mt-1">
            Our Process
          </h2>
        </div>

        {/* Rows */}
        {methodologySteps.map((step, i) => {
          const color  = ACCENT[step.color] || '#a78bfa'
          const isLast = i === methodologySteps.length - 1
          return (
            <Reveal key={step.number} delay={i * 0.07}>
              <div
                className={`group grid grid-cols-[80px_1fr_1.4fr] gap-10 py-10 ${
                  !isLast ? 'border-b border-white/[0.06]' : ''
                } hover:bg-white/[0.02] transition-colors duration-200 px-2`}
              >
                <div className="pt-1">
                  <span className="text-[11px] font-black tracking-[0.22em] uppercase" style={{ color }}>
                    {step.number}
                  </span>
                </div>
                <div>
                  <div
                    className="h-[2px] w-10 rounded-full mb-4 transition-all duration-400 group-hover:w-16"
                    style={{ background: color }}
                  />
                  <h3 className="text-[22px] font-black text-white tracking-tight leading-tight">
                    {step.title}
                  </h3>
                </div>
                <div className="flex items-center">
                  <p className="text-zinc-400 text-[14px] leading-relaxed">{step.text}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════
          MOBILE — GSAP horizontal scroll
      ═══════════════════════════════════════ */}
      <div
        ref={mSectionRef}
        className="md:hidden"
      >
        {/* Sticky viewport panel */}
        <div className="sticky top-0 h-screen flex flex-col bg-[#0d0d0d] overflow-hidden">

          {/* Heading */}
          <div className="px-6 pt-[68px] pb-3 shrink-0">
            <p className="sec-label">How We Work</p>
            <h2 className="text-[2.2rem] font-black tracking-tight text-white leading-tight mt-1">
              Our Process
            </h2>
          </div>

          {/* Progress bar */}
          <div className="h-[1px] bg-white/[0.07] mx-6 mb-6 shrink-0">
            <div
              ref={mProgressRef}
              className="h-full bg-indigo-400/70"
              style={{ width: '0%', transition: 'width 0.05s linear' }}
            />
          </div>

          {/* Horizontal scrolling track */}
          <div
            ref={mTrackRef}
            className="flex will-change-transform"
            style={{ width: `${methodologySteps.length * 100}vw`, flex: '1 1 0', minHeight: 0 }}
          >
            {methodologySteps.map((step, i) => {
              const color  = ACCENT[step.color] || '#a78bfa'
              return (
                <div
                  key={step.number}
                  className="flex flex-col justify-center px-6"
                  style={{ width: '100vw' }}
                >
                  {/* Step counter */}
                  <span
                    className="text-[11px] font-black tracking-[0.22em] uppercase mb-5"
                    style={{ color }}
                  >
                    {step.number} / {String(methodologySteps.length).padStart(2,'0')}
                  </span>

                  {/* Accent + title */}
                  <div className="h-[2px] w-10 rounded-full mb-4" style={{ background: color }} />
                  <h3 className="text-[1.9rem] font-black text-white tracking-tight leading-tight mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-[14px] leading-relaxed max-w-[320px]">
                    {step.text}
                  </p>

                  {/* Pip indicators */}
                  <div className="flex items-center gap-2 mt-8">
                    {methodologySteps.map((_, j) => (
                      <div
                        key={j}
                        className="h-[2px] rounded-full"
                        style={{
                          width: j === i ? 20 : 6,
                          background: j <= i ? color : 'rgba(255,255,255,0.12)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Scroll hint */}
          <div className="flex items-center gap-2 px-6 py-5 shrink-0 text-zinc-700">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            </svg>
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase">Scroll to explore</span>
          </div>
        </div>
      </div>

    </section>
  )
}
