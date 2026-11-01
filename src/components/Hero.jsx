import { useState, useEffect, useRef } from 'react'
import { useAppReady } from '../context/AppReadyContext.jsx'

const WORDS = ['RESULTS.', 'REVENUE.', 'RANKINGS.', 'RETENTION.']

export default function Hero() {
  const sectionRef = useRef(null)
  const { ready } = useAppReady()
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  // Add hero-ready class to section when preloader exits
  useEffect(() => {
    if (ready && sectionRef.current) {
      sectionRef.current.classList.add('hero-ready')
    }
  }, [ready])

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length)
        setVisible(true)
      }, 300)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="scroll-mt-20 relative bg-[#0a0a0a] flex flex-col overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >

      {/* Subtle grid lines — revealed via hero-ready class */}
      <div className="hero-grid-lines pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.03]" />
        <div className="absolute left-0 right-0 top-[70%] h-px bg-white/[0.03]" />
      </div>

      {/* Diagonal accent stripe */}
      <div
        className="hero-grid-lines pointer-events-none absolute top-0 right-[15%] w-px h-full z-0"
        style={{ background: 'linear-gradient(180deg,transparent,rgba(167,139,250,0.10) 40%,transparent)', transform: 'rotate(12deg)', transformOrigin: 'top' }}
      />

      {/* Main content — always visible, animations driven by hero-ready class */}
      <div className="hero-content relative z-10 flex-1 flex flex-col max-w-[1360px] mx-auto w-full px-6 md:px-12 lg:px-20">
        <div className="h-16 md:h-20 shrink-0" />

        <div className="flex-1 flex flex-col justify-center pb-6 md:pb-12">
          <div className="flex items-start gap-0">

            {/* Left column */}
            <div className="flex-1">

              {/* Headline */}
              <h1
                className="hero-fade-in font-black leading-[0.88] tracking-[-0.04em] text-white mb-8"
                style={{ fontSize: 'clamp(3.2rem,9.5vw,8.5rem)', '--delay': '0.08s' }}
              >
                <span className="block">WE BUILD</span>
                <span className="block text-white/[0.12]">THINGS THAT</span>
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(110deg,#fff 0%,#c4b5fd 45%,#93c5fd 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(-12px)',
                    transition: 'opacity 0.28s ease, transform 0.28s ease',
                  }}
                >
                  {WORDS[wordIdx]}
                </span>
              </h1>

              {/* Sub-copy */}
              <p
                className="hero-fade-in text-zinc-600 leading-[1.7] mb-10 max-w-[420px]"
                style={{ fontSize: 'clamp(14px,1.8vw,17px)', '--delay': '0.20s' }}
              >
                Custom web platforms, mobile apps, AI automations and
                marketing — built as one integrated growth engine for
                startups and small businesses.
              </p>

              {/* CTAs */}
              <div className="hero-fade-in flex flex-wrap items-center gap-4 mb-16" style={{ '--delay': '0.32s' }}>
                <a href="#services" className="btn-primary">
                  Explore Services <span className="hero-arrow-icon">→</span>
                </a>
                <a href="#contact" className="btn-ghost">
                  Free Consultation
                </a>
              </div>



            </div>

            {/* Right sidebar — visible on large screens */}
            <div className="hidden lg:flex flex-col min-w-[210px] border-l border-white/[0.06] pl-10 ml-14 pt-1">
              <p className="text-[9px] font-bold tracking-[0.24em] uppercase text-zinc-700 mb-5">Services</p>
              {[
                ['01', 'Web Development'],
                ['02', 'Mobile Apps'],
                ['03', 'AI Automation'],
                ['04', 'IT Consulting'],
                ['05', 'SEO &amp; Marketing'],
                ['06', 'Video Production'],
              ].map(([num, name]) => (
                <a
                  key={name}
                  href="#services"
                  className="flex justify-between items-center py-[11px] text-[10px] font-bold tracking-[0.16em] uppercase text-zinc-700 border-b border-white/[0.04] last:border-b-0 hover:text-white transition-colors group"
                  dangerouslySetInnerHTML={{ __html: `<span>${name}</span><span class="text-[9px] text-zinc-800 group-hover:text-violet-400 transition-colors">${num}</span>` }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>



    </section>
  )
}
