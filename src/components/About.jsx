import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VALUES } from '../data/site.js'
import Reveal from './Reveal.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'

gsap.registerPlugin(ScrollTrigger)

const VALUE_ICONS = {
  Transparency:         '◈',
  'Speed With Quality': '◎',
  Partnership:          '◆',
  Ownership:            '◉',
}

const ACCENT_COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24']

export default function About() {
  const headRef     = useScrollReveal()
  const mSectionRef = useRef(null)
  const mTrackRef   = useRef(null)
  const mProgressRef = useRef(null)

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
          scrub: 1.1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (mProgressRef.current) {
              mProgressRef.current.style.width = `${self.progress * 100}%`
            }
          },
        },
      })

      return () => ScrollTrigger.getAll().forEach(t => t.kill())
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="about" className="bg-[#0d0d0d] border-t border-white/[0.06]">

      {/* ═══════════ DESKTOP ═══════════ */}
      <div className="hidden md:block py-28 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <div ref={headRef} className="reveal-on-scroll">
            <p className="sec-label">About Callybre</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mt-1">
              Technology and marketing,{' '}
              <span className="text-zinc-500">working together.</span>
            </h2>
            <p className="mt-6 text-zinc-400 text-[15px] leading-relaxed">
              Callybre is an IT consulting and digital marketing studio. We build the
              platforms, apps and automations your business runs on — and the content
              and search strategy that brings customers to them.
            </p>
            <p className="mt-4 text-zinc-500 text-[14px] leading-relaxed">
              Most businesses hire one team to build and another to promote, and the two
              never quite line up. We do both, so every decision from code to campaign
              points at the same goal: growth you can measure.
            </p>
            <div className="mt-10">
              <a href="#contact" className="btn-primary">Work With Us →</a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06]">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="bg-[#0d0d0d] p-8">
                  <div className="text-2xl font-black mb-4" style={{ color: ACCENT_COLORS[i] }}>
                    {VALUE_ICONS[v.title] || '◇'}
                  </div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ MOBILE — GSAP horizontal scroll ═══════════ */}
      <div ref={mSectionRef} className="md:hidden">
        <div className="sticky top-0 h-screen flex flex-col bg-[#0d0d0d] overflow-hidden">

          {/* Progress bar */}
          <div className="h-[1px] bg-white/[0.07] mx-6 mb-6 mt-[72px] shrink-0">
            <div
              ref={mProgressRef}
              className="h-full bg-violet-400/70"
              style={{ width: '0%', transition: 'width 0.05s linear' }}
            />
          </div>

          {/* Horizontal track — 1 intro slide + value cards */}
          <div
            ref={mTrackRef}
            className="flex will-change-transform"
            style={{ width: `${(VALUES.length + 1) * 100}vw`, flex: '1 1 0', minHeight: 0 }}
          >
            {/* ── Slide 0: Intro text ── */}
            <div className="flex flex-col justify-center px-6" style={{ width: '100vw' }}>
              <p className="sec-label">About Callybre</p>
              <h2 className="text-[2rem] font-black tracking-tight text-white leading-tight mt-1 mb-5">
                Technology and marketing,{' '}
                <span className="text-zinc-500">working together.</span>
              </h2>
              <p className="text-zinc-400 text-[13px] leading-relaxed mb-3 max-w-[320px]">
                Callybre is an IT consulting and digital marketing studio. We build the
                platforms, apps and automations your business runs on — and the content
                and search strategy that brings customers to them.
              </p>
              <p className="text-zinc-600 text-[12px] leading-relaxed mb-7 max-w-[300px]">
                Most businesses hire one team to build and another to promote, and the two
                never quite line up. We do both, so every decision from code to campaign
                points at the same goal: growth you can measure.
              </p>
              <a href="#contact" className="btn-primary self-start text-[11px]" style={{ padding: '0.6rem 1.25rem' }}>
                Work With Us →
              </a>
              {/* Scroll nudge */}
              <div className="flex items-center gap-2 mt-8 text-zinc-700">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Our core values →</span>
              </div>
            </div>

            {VALUES.map((v, i) => {
              const color = ACCENT_COLORS[i]
              return (
                <div
                  key={v.title}
                  className="flex flex-col justify-center px-6"
                  style={{ width: '100vw' }}
                >
                  <div className="text-3xl font-black mb-5" style={{ color }}>
                    {VALUE_ICONS[v.title] || '◇'}
                  </div>
                  <div className="h-[2px] w-10 rounded-full mb-4" style={{ background: color }} />
                  <h3 className="text-[1.9rem] font-black text-white tracking-tight leading-tight mb-4">
                    {v.title}
                  </h3>
                  <p className="text-zinc-400 text-[14px] leading-relaxed max-w-[320px]">
                    {v.text}
                  </p>
                  <span className="text-[11px] font-black tracking-[0.22em] uppercase mt-8" style={{ color }}>
                    {String(i + 1).padStart(2, '0')} / {String(VALUES.length).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2 mt-4">
                    {VALUES.map((_, j) => (
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
