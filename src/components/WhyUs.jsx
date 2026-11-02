import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PIN_PRIORITY, refreshPins } from '../lib/scrollOrder.js'
import { WHY_US } from '../data/site.js'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import { useAppReady } from '../context/AppReadyContext.jsx'

gsap.registerPlugin(ScrollTrigger)

const ACCENT = {
  purple:  '#a78bfa',
  blue:    '#60a5fa',
  indigo:  '#818cf8',
  emerald: '#34d399',
  rose:    '#fb7185',
  amber:   '#fbbf24',
}

export default function WhyUs() {
  const headRef      = useScrollReveal()
  const { ready }    = useAppReady()

  /* desktop refs */
  const dSectionRef  = useRef(null)
  const dTrackRef    = useRef(null)
  const dProgressRef = useRef(null)

  /* mobile refs — same pattern as Methodology */
  const mSectionRef  = useRef(null)
  const mTrackRef    = useRef(null)
  const mProgressRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    /* ── DESKTOP: pinned horizontal scroll ── */
    mm.add('(min-width: 768px)', () => {
      const section = dSectionRef.current
      const track   = dTrackRef.current
      if (!section || !track) return

      const getAmt = () => -(track.scrollWidth - track.clientWidth)

      gsap.from(track.querySelectorAll('.why-card'), {
        opacity: 0, y: 40, stagger: 0.1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      })

      gsap.to(track, {
        x: getAmt,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getAmt())}`,
          pin: true,
          refreshPriority: PIN_PRIORITY.why,
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (dProgressRef.current)
              dProgressRef.current.style.width = `${self.progress * 100}%`
          },
        },
      })
    })

    /* ── MOBILE: same GSAP pin as Methodology ── */
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
          refreshPriority: PIN_PRIORITY.why,
          scrub: 1.1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (mProgressRef.current)
              mProgressRef.current.style.width = `${self.progress * 100}%`
          },
        },
      })
    })

    refreshPins()
    const onResize = () => refreshPins()
    window.addEventListener('resize', onResize)
    return () => {
      mm.revert()
      window.removeEventListener('resize', onResize)
      refreshPins()
    }
  }, [])

  useEffect(() => {
    if (ready) {
      refreshPins()
    }
  }, [ready])

  return (
    <section id="why" className="scroll-mt-20 bg-[#0a0a0a] border-t border-white/[0.06]">

      {/* ═══════════════════════════════════════
          DESKTOP — pinned horizontal scroll
      ═══════════════════════════════════════ */}
      <div ref={dSectionRef} className="hidden md:flex flex-col max-w-none px-6 md:px-12 lg:px-20 py-16 bg-[#0a0a0a] relative z-20">

        {/* Heading */}
        <div ref={headRef} className="reveal-on-scroll flex items-end justify-between mb-10 max-w-[1360px] mx-auto w-full">
          <div>
            <p className="sec-label">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mt-1">
              Built different,{' '}
              <span className="text-zinc-500">delivered better.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-zinc-600 pb-1">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Scroll to explore</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[1px] bg-white/[0.06] mb-8 max-w-[1360px] mx-auto w-full">
          <div ref={dProgressRef} className="h-full bg-white/30 transition-none" style={{ width: '0%' }} />
        </div>

        {/* Horizontal track */}
        <div ref={dTrackRef} className="flex gap-5 will-change-transform" style={{ paddingRight: '5vw' }}>
          {WHY_US.map((item, i) => {
            const color = ACCENT[item.color] || '#a1a1aa'
            return (
              <div
                key={item.title}
                className="why-card flex-none flex flex-col bg-[#111111] border border-white/[0.07] p-8 hover:border-white/[0.18] transition-colors duration-300"
                style={{ width: 'clamp(280px, 28vw, 360px)' }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-11 h-11 flex items-center justify-center"
                    style={{ background: `${color}14`, border: `1px solid ${color}30`, color }}>
                    <Icon name={item.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black text-zinc-800 tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="h-[2px] w-8 mb-6 opacity-60" style={{ background: color }} />
                <h3 className="text-[16px] font-bold text-white mb-3 leading-snug">{item.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed flex-1">{item.text}</p>
              </div>
            )
          })}
        </div>

      </div>

      {/* ═══════════════════════════════════════
          MOBILE — GSAP horizontal scroll (same as Methodology)
      ═══════════════════════════════════════ */}
      <div ref={mSectionRef} className="md:hidden">

        {/* Sticky viewport panel */}
        <div className="sticky top-0 h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">

          {/* Heading */}
          <div className="px-6 pt-[68px] pb-3 shrink-0">
            <p className="sec-label">Why Choose Us</p>
            <h2 className="text-[2.2rem] font-black tracking-tight text-white leading-tight mt-1">
              Built different,{' '}
              <span className="text-zinc-500">better.</span>
            </h2>
          </div>

          {/* Progress bar */}
          <div className="h-[1px] bg-white/[0.07] mx-6 mb-6 shrink-0">
            <div
              ref={mProgressRef}
              className="h-full bg-violet-400/70"
              style={{ width: '0%', transition: 'width 0.05s linear' }}
            />
          </div>

          {/* Horizontal scrolling track */}
          <div
            ref={mTrackRef}
            className="flex will-change-transform"
            style={{ width: `${WHY_US.length * 100}vw`, flex: '1 1 0', minHeight: 0 }}
          >
            {WHY_US.map((item, i) => {
              const color = ACCENT[item.color] || '#a1a1aa'
              return (
                <div
                  key={item.title}
                  className="flex flex-col justify-center px-6"
                  style={{ width: '100vw' }}
                >
                  {/* Counter */}
                  <span
                    className="text-[11px] font-black tracking-[0.22em] uppercase mb-5"
                    style={{ color }}
                  >
                    {String(i + 1).padStart(2, '0')} / {String(WHY_US.length).padStart(2, '0')}
                  </span>

                  {/* Icon + accent line */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-11 h-11 flex items-center justify-center shrink-0"
                      style={{ background: `${color}14`, border: `1px solid ${color}30`, color }}
                    >
                      <Icon name={item.icon} className="w-5 h-5" />
                    </div>
                    <div className="h-[2px] w-10 rounded-full" style={{ background: color }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-[1.9rem] font-black text-white tracking-tight leading-tight mb-4">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-[14px] leading-relaxed max-w-[320px]">
                    {item.text}
                  </p>

                  {/* Pip indicators */}
                  <div className="flex items-center gap-2 mt-8">
                    {WHY_US.map((_, j) => (
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
