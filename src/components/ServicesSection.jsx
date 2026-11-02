import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PIN_PRIORITY, refreshPins } from '../lib/scrollOrder.js'
import { itServices } from '../data/services.js'
import { useAppReady } from '../context/AppReadyContext.jsx'
import Icon from './Icon.jsx'
import { SELECT_SERVICE_EVENT, SERVICE_OPTIONS } from '../data/contact.js'

gsap.registerPlugin(ScrollTrigger)

const ACCENT_ICON = {
  purple: 'icon-accent-purple',
  blue:   'icon-accent-blue',
  indigo: 'icon-accent-indigo',
  emerald:'icon-accent-emerald',
}

function selectService(title) {
  window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: title }))
}

function ServiceRow({ service }) {
  return (
    <a
      href="#contact"
      onClick={() => selectService(service.title)}
      className="service-item group relative flex border-t border-white/[0.06] first-of-type:border-t-0 items-center gap-4 sm:gap-5 min-h-[88px] sm:min-h-[112px] px-5 sm:px-8 py-4 sm:py-5 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:bg-white/[0.05]"
    >
      <div className={`w-11 h-11 shrink-0 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] ${ACCENT_ICON[service.color] || 'text-white'} transition-transform duration-300 group-hover:scale-110`}>
        <Icon name={service.icon} className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] sm:text-[16px] font-bold leading-snug text-white group-hover:text-violet-300 transition-colors">
          {service.title}
        </div>
        <div className="text-[12.5px] sm:text-[13px] text-zinc-400 mt-1 leading-relaxed">
          {service.description}
        </div>
      </div>
      <span
        aria-hidden="true"
        className="shrink-0 text-zinc-600 transition-all duration-300 group-hover:text-violet-300 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  )
}

export default function ServicesSection() {
  const { ready } = useAppReady()
  const sectionRef = useRef(null)
  const slatsRef = useRef(null)
  const trackRef = useRef(null)
  const leftContentRef = useRef(null)
  const rightContentRef = useRef(null)

  useEffect(() => {
    const trigger = sectionRef.current
    const slats = slatsRef.current
    const track = trackRef.current
    const rightCard = rightContentRef.current
    const leftContent = leftContentRef.current
    if (!trigger || !slats || !track || !rightCard) return

    const mm = gsap.matchMedia()

    /* ── DESKTOP (>= 768px): Side-by-side grid with 100 Slats Card Wave ── */
    mm.add('(min-width: 768px)', () => {
      const boxes = slats.querySelectorAll('.box')
      const serviceItems = rightCard.querySelectorAll('.service-item')

      // Set initial states for desktop:
      gsap.set(track, { x: 0 })

      gsap.set(boxes, {
        xPercent: 0,
        rotation: 0,
        transformOrigin: '50% 50%',
        force3D: true,
      })

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
          refreshPriority: PIN_PRIORITY.services,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Sequence:
      // 1. Move 100 slats from left (0%) to right (100% of 50vw)
      tl.to(boxes, {
        force3D: true,
        duration: 1,
        xPercent: 100,
        ease: 'power1.inOut',
        stagger: { amount: 1 },
      })
      // 2. Rotate to 45° midway
      .to(boxes, { ease: 'power1.out', duration: 1, rotation: '45deg' }, 0)
      // 3. Rotate back to 0° at end
      .to(boxes, { ease: 'power1.in', duration: 1, rotation: '0deg' }, 1)

      // 4. Reveal the Right Services Card as animated card locks in
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

      // 5. Stagger the services inside the card vertically
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

    /* ── MOBILE (< 768px): Pinned Horizontal Card Transition with Venetian Blinds & Vertical Stagger ── */
    mm.add('(max-width: 767px)', () => {
      const boxes = slats.querySelectorAll('.box')
      const serviceItems = rightCard.querySelectorAll('.service-item')

      // Set initial states for mobile:
      gsap.set(boxes, {
        xPercent: 0,
        rotation: 0,
        transformOrigin: '50% 50%',
        force3D: true,
      })

      gsap.set(track, {
        x: 0,
        force3D: true,
      })

      gsap.set(rightCard, {
        opacity: 0.85,
        scale: 0.94,
        x: 0,
        pointerEvents: 'auto',
      })

      gsap.set(serviceItems, {
        opacity: 0,
        y: 24,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.5}`,
          pin: true,
          refreshPriority: PIN_PRIORITY.services,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1. Horizontal scroll: slide from Panel 1 (Intro) to Panel 2 (Services)
      tl.to(
        track,
        {
          x: '-100vw',
          ease: 'power1.inOut',
          duration: 1.2,
        },
        0
      )

      // 2. Venetian blinds zipper wave across mobile screen
      .to(
        boxes,
        {
          force3D: true,
          duration: 1.2,
          xPercent: 100,
          ease: 'power1.inOut',
          stagger: { amount: 0.8 },
        },
        0
      )
      .to(boxes, { ease: 'power1.out', duration: 0.6, rotation: '40deg' }, 0)
      .to(boxes, { ease: 'power1.in', duration: 0.6, rotation: '0deg' }, 0.6)

      // 3. Right services card scales smoothly into full view
      .to(
        rightCard,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        0.5
      )

      // 4. Vertically stagger the services cards as the right card arrives
      .to(
        serviceItems,
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: 'power2.out',
          duration: 0.5,
        },
        0.65
      )

      return () => {
        tl.kill()
      }
    })

    refreshPins()
    return () => {
      mm.revert()
      refreshPins()
    }
  }, [])

  // Refresh ScrollTrigger when preloader completes & on mount
  useEffect(() => {
    const t = setTimeout(() => {
      refreshPins()
    }, 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (ready) {
      refreshPins()
    }
  }, [ready])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="trigger relative bg-[#0a0a0a] border-t border-white/[0.06] overflow-hidden h-screen flex items-center z-10"
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
          FOREGROUND CONTENT LAYER: z-10
          Mobile (<md): Horizontal track of 2 full-screen panels (w-[200vw])
          Desktop (>=md): Standard 2-column grid inside max-w-7xl
      ═════════════════════════════════════════════════════════════ */}
      <div
        ref={trackRef}
        className="relative z-10 flex flex-row w-[200vw] md:w-full md:grid md:grid-cols-2 md:max-w-7xl md:mx-auto px-0 md:px-12 md:gap-16 items-center h-full will-change-transform"
      >
        {/* ── PANEL 1 / LEFT COLUMN: Intro Text ── */}
        <div
          ref={leftContentRef}
          className="w-screen md:w-auto shrink-0 px-6 sm:px-10 md:px-0 flex flex-col justify-center py-8 sm:py-12 h-full max-h-screen"
        >
          <div className="max-w-lg mx-auto md:mx-0 w-full">
            <p className="sec-label">What We Do</p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mt-1">
              Our Expertise
            </h2>
            <p className="mt-2.5 sm:mt-4 text-zinc-400 text-[13px] sm:text-[15px] leading-relaxed">
              IT consulting and custom engineering — built for scale, performance, and long-term security.
            </p>

            <div className="h-px bg-white/[0.08] my-4 sm:my-6" />

            <p className="sec-label text-[11px] text-violet-400 font-bold uppercase tracking-widest">
              Why Callybre
            </p>
            <p className="text-[12.5px] sm:text-[14px] text-zinc-400 leading-relaxed mt-1.5 sm:mt-2">
              Every technical decision — from architecture to deployment — points at the same goal: measurable, reliable growth.
            </p>

            {/* Feature Checkmarks */}
            <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3.5">
              {[
                'Clean, documented code',
                'Short delivery sprints',
                'Security built in from day 1',
                'Dedicated post-launch support',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 text-[12.5px] sm:text-[13px] text-zinc-300">
                  <span className="text-emerald-400 font-bold text-sm sm:text-base">✓</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button & Mobile Indicator */}
            <div className="pt-5 sm:pt-8 flex items-center justify-between gap-4">
              <a
                href="#contact"
                className="btn-primary inline-flex items-center gap-2 text-[11px] sm:text-[12px] uppercase tracking-wider font-bold cursor-pointer"
              >
                Discuss Your Project →
              </a>

              {/* Mobile swipe hint */}
              <span className="md:hidden inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider animate-pulse">
                Scroll for services →
              </span>
            </div>
          </div>
        </div>

        {/* ── PANEL 2 / RIGHT COLUMN: Services Card (Revealed with Animated Card) ── */}
        <div
          ref={rightContentRef}
          className="w-screen md:w-auto shrink-0 px-6 sm:px-10 md:px-0 flex flex-col justify-center py-8 sm:py-12 h-full max-h-screen will-change-transform"
        >
          <div className="max-w-lg w-full mx-auto md:max-w-none">
            {/* Header Badge — Clean without service count or green dot */}
            <div className="flex items-center mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-white uppercase bg-white/[0.06] border border-white/[0.1] px-3.5 py-1.5">
                IT Consulting Services
              </span>
            </div>

            {/* The Services Card Container */}
            <div className="relative bg-[#0d0d10]/95 border border-white/[0.1] backdrop-blur-md shadow-2xl overflow-hidden">
              {/* Subtle background glow */}
              <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-violet-600/10 rounded-full blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl" />

              {/* All 4 IT Services rendered directly and clearly visible */}
              {itServices.map((service) => (
                <ServiceRow key={service.id} service={service} />
              ))}

              {/* Bottom Card Footer — whole bar is clickable */}
              <a
                href="#contact"
                onClick={() => selectService(SERVICE_OPTIONS[SERVICE_OPTIONS.length - 1])}
                className="group border-t border-white/[0.06] px-5 sm:px-8 py-4 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex items-center justify-between"
              >
                <span className="text-[12px] text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">Enterprise & Custom Solutions</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 group-hover:text-white transition-colors inline-flex items-center gap-1">
                  Get Started →
                </span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}


