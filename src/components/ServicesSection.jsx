import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { itServices } from '../data/services.js'
import { useAppReady } from '../context/AppReadyContext.jsx'
import Icon from './Icon.jsx'

gsap.registerPlugin(ScrollTrigger)

const ACCENT_ICON = {
  purple: 'icon-accent-purple',
  blue:   'icon-accent-blue',
  indigo: 'icon-accent-indigo',
  emerald:'icon-accent-emerald',
}

function ServiceRow({ service }) {
  return (
    <div className="service-item group transition-colors hover:bg-white/[0.04]">
      <div className="w-full flex items-center gap-5 py-5 sm:py-6 px-6 sm:px-8 text-left">
        <div className={`w-11 h-11 shrink-0 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] ${ACCENT_ICON[service.color] || 'text-white'} transition-transform duration-300 group-hover:scale-110`}>
          <Icon name={service.icon} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] sm:text-[16px] font-bold text-white group-hover:text-violet-300 transition-colors">
            {service.title}
          </div>
          <div className="text-[13px] text-zinc-400 mt-1 leading-snug">
            {service.description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const { ready } = useAppReady()
  const sectionRef = useRef(null)
  const slatsRef = useRef(null)
  const leftContentRef = useRef(null)
  const rightContentRef = useRef(null)

  useEffect(() => {
    const trigger = sectionRef.current
    const slats = slatsRef.current
    const rightCard = rightContentRef.current
    const leftContent = leftContentRef.current
    if (!trigger || !slats || !rightCard) return

    const mm = gsap.matchMedia()

    /* ── DESKTOP: 100 Slats Card Moving from Left to Right ── */
    mm.add('(min-width: 768px)', () => {
      const boxes = slats.querySelectorAll('.box')
      const serviceItems = rightCard.querySelectorAll('.service-item')

      // Set initial states:
      // 1. Slats start on the left half (0 to 50vw)
      gsap.set(boxes, {
        xPercent: 0,
        rotation: 0,
        transformOrigin: '50% 50%',
        force3D: true,
      })

      // 2. Right card starts completely HIDDEN so it DOES NOT look static!
      gsap.set(rightCard, {
        opacity: 0,
        scale: 0.92,
        x: 40,
        pointerEvents: 'none',
      })

      gsap.set(serviceItems, {
        opacity: 0,
        y: 16,
      })

      // 3. Left intro text is crisp and visible on the left
      gsap.set(leftContent, {
        opacity: 1,
        x: 0,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.5}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Sequence:
      // 1. Move 100 slats from left (0%) to right (100% of 50vw) in a staggered wave
      tl.to(boxes, {
        force3D: true,
        duration: 1,
        xPercent: 100,
        ease: 'power1.inOut',
        stagger: { amount: 1 },
      })
      // 2. Rotate to 45° midway (CodePen Photo 3)
      .to(boxes, { ease: 'power1.out', duration: 1, rotation: '45deg' }, 0)
      // 3. Rotate back to 0° at end (CodePen Photo 4)
      .to(boxes, { ease: 'power1.in', duration: 1, rotation: '0deg' }, 1)

      // 4. Reveal the Right Services Card EXACTLY when the animated card reaches the right!
      .to(
        rightCard,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          pointerEvents: 'auto',
          ease: 'power2.out',
          duration: 0.8,
        },
        0.7
      )

      // 5. Stagger the services inside the card as it locks into place
      .to(
        serviceItems,
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'power1.out',
          duration: 0.4,
        },
        1.1
      )

      return () => {
        tl.kill()
      }
    })

    /* ── MOBILE: Clean flow for mobile screens ── */
    mm.add('(max-width: 767px)', () => {
      const boxes = slats.querySelectorAll('.box')
      gsap.set(boxes, { xPercent: 0, rotation: 0, force3D: true })
      gsap.set(rightCard, { opacity: 1, scale: 1, x: 0, pointerEvents: 'auto' })
      gsap.set(rightCard.querySelectorAll('.service-item'), { opacity: 1, y: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
        },
      })

      tl.to(boxes, {
        force3D: true,
        duration: 1,
        xPercent: 100,
        ease: 'power1.inOut',
        stagger: { amount: 0.5 },
      })
      .to(boxes, { ease: 'power1.out', duration: 1, rotation: '30deg' }, 0)
      .to(boxes, { ease: 'power1.in', duration: 1, rotation: '0deg' }, 1)

      return () => {
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  // Refresh ScrollTrigger when preloader completes & on mount
  useEffect(() => {
    const t = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (ready) {
      ScrollTrigger.refresh()
    }
  }, [ready])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="trigger relative bg-[#0a0a0a] border-t border-white/[0.06] overflow-hidden min-h-screen flex items-center py-16 lg:py-0 z-10"
      style={{ clipPath: 'inset(0)' }}
    >
      {/* ═════════════════════════════════════════════════════════════
          BACKGROUND LAYER: 100 Slats Moving Card (Photos 2, 3, 4)
          Initially on left half (50vw), slides & twists 45° to right half (50vw)
      ═════════════════════════════════════════════════════════════ */}
      <div
        ref={slatsRef}
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none select-none overflow-hidden"
        style={{ clipPath: 'inset(0)', contain: 'paint' }}
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="box block w-full md:w-1/2 h-[1.2vh] -mb-[0.2vh] will-change-transform"
            style={{
              transformOrigin: '50% 50%',
              background: 'linear-gradient(90deg, #131316 0%, #1e1e24 50%, #131316 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            }}
          />
        ))}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          FOREGROUND CONTENT LAYER: z-10 (Always clearly visible & interactive)
      ═════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ── LEFT COLUMN: Intro Text ── */}
        <div ref={leftContentRef} className="flex flex-col justify-center py-6">
          <p className="sec-label">What We Do</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mt-1">
            Our Expertise
          </h2>
          <p className="mt-4 text-zinc-400 text-[15px] leading-relaxed max-w-lg">
            IT consulting and custom engineering — built for scale, performance, and long-term security.
          </p>

          <div className="h-px bg-white/[0.08] my-6 max-w-md" />

          <p className="sec-label text-[11px] text-violet-400 font-bold uppercase tracking-widest">
            Why Callybre
          </p>
          <p className="text-[14px] text-zinc-400 leading-relaxed mt-2 max-w-lg">
            Every technical decision — from architecture to deployment — points at the same goal: measurable, reliable growth.
          </p>

          {/* Feature Checkmarks */}
          <div className="mt-6 space-y-3.5">
            {[
              'Clean, documented code',
              'Short delivery sprints',
              'Security built in from day 1',
              'Dedicated post-launch support',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-[13px] text-zinc-300">
                <span className="text-emerald-400 font-bold text-base">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <a
              href="#contact"
              className="btn-primary inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-bold cursor-pointer"
            >
              Discuss Your Project →
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Services Card (Revealed with Animated Card) ── */}
        <div ref={rightContentRef} className="flex flex-col justify-center py-6 will-change-transform">
          {/* Header Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase bg-white/[0.06] border border-white/[0.1] px-3.5 py-1.5">
              IT Consulting Services
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] text-zinc-400 font-mono tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {itServices.length} Services
            </span>
          </div>

          {/* The Services Card Container */}
          <div className="relative bg-[#0d0d10]/95 border border-white/[0.1] backdrop-blur-md shadow-2xl divide-y divide-white/[0.06] overflow-hidden">
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl" />

            {/* All 4 IT Services rendered directly and clearly visible */}
            {itServices.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}


