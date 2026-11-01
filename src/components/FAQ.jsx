import { useState } from 'react'
import { FAQS } from '../data/site.js'
import Reveal from './Reveal.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'

const categoryIcons = [
  <svg key="0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>,
  <svg key="3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  <svg key="5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
]

const ACCENTS = [
  { text: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.3)' },
  { text: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.3)'  },
  { text: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.3)'  },
  { text: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.3)'  },
  { text: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.3)' },
  { text: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.3)' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [hoverIndex, setHoverIndex] = useState(null)
  const headRef = useScrollReveal()

  return (
    <section
      id="faq"
      className="scroll-mt-20"
      style={{ background: '#080808', paddingTop: '7rem', paddingBottom: '7rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient blobs + dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ position: 'relative', zIndex: 1 }}>

        {/* Shared header */}
        <div ref={headRef} className="reveal-on-scroll" style={{ marginBottom: '4rem' }}>
          <p className="sec-label">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mt-1">
            Common{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              questions
            </span>
          </h2>
          <p style={{ color: '#71717a', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '480px', marginTop: '1.25rem' }}>
            Can't find an answer?{' '}
            <a href="#contact" style={{ color: '#a78bfa', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Send us a message</a>{' '}
            and we'll get back to you within one business day.
          </p>
        </div>

        {/* ══════════ DESKTOP — original 2-col grid ══════════ */}
        <div className="hidden md:block">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 540px), 1fr))', gap: '1px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            {FAQS.map((item, i) => {
              const open = openIndex === i
              const hovered = hoverIndex === i
              const c = ACCENTS[i % ACCENTS.length]
              return (
                <Reveal key={item.q} delay={i * 0.06}>
                  <div
                    style={{ background: open ? c.bg : hovered ? 'rgba(255,255,255,0.02)' : '#0d0d0d', transition: 'background 0.3s', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${c.text}, transparent)`, opacity: open ? 1 : 0, transition: 'opacity 0.3s' }} />
                    <button
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: '1rem', textAlign: 'left', padding: '1.5rem', cursor: 'pointer', background: 'none', border: 'none', outline: 'none' }}
                    >
                      <span style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: open ? c.bg : 'rgba(255,255,255,0.04)', border: `1px solid ${open ? c.border : 'rgba(255,255,255,0.08)'}`, color: open ? c.text : '#52525b', transition: 'all 0.3s', marginTop: '1px' }}>
                        {categoryIcons[i]}
                      </span>
                      <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 700, color: open ? '#fff' : '#d4d4d8', lineHeight: 1.4, transition: 'color 0.2s', letterSpacing: '-0.01em' }}>
                        {item.q}
                      </span>
                      <span style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: open ? c.bg : 'rgba(255,255,255,0.04)', border: `1px solid ${open ? c.border : 'rgba(255,255,255,0.07)'}`, color: open ? c.text : '#52525b', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', marginTop: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </button>
                    <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 1.5rem 1.5rem 4.25rem', borderTop: `1px solid ${c.border}` }}>
                          <p style={{ paddingTop: '1rem', fontSize: '0.875rem', color: '#a1a1aa', lineHeight: 1.75 }}>{item.a}</p>
                          <span style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.text, padding: '0.3rem 0.65rem', background: c.bg, border: `1px solid ${c.border}` }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            Answered
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* ══════════ MOBILE — compact accordion ══════════ */}
        <div className="md:hidden">
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {FAQS.map((item, i) => {
              const open = openIndex === i
              const c = ACCENTS[i % ACCENTS.length]
              const isLast = i === FAQS.length - 1
              return (
                <div
                  key={item.q}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    background: open ? c.bg : 'transparent',
                    transition: 'background 0.25s',
                    position: 'relative',
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: c.text, opacity: open ? 1 : 0, transition: 'opacity 0.25s' }} />

                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', padding: '1rem 1rem 1rem 1.25rem', background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
                  >
                    <span style={{ flexShrink: 0, width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: open ? c.bg : 'rgba(255,255,255,0.04)', border: `1px solid ${open ? c.border : 'rgba(255,255,255,0.08)'}`, color: open ? c.text : '#52525b', transition: 'all 0.25s' }}>
                      {categoryIcons[i]}
                    </span>
                    <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 700, color: open ? '#fff' : '#d4d4d8', lineHeight: 1.35, transition: 'color 0.2s', letterSpacing: '-0.01em' }}>
                      {item.q}
                    </span>
                    <span style={{ flexShrink: 0, color: open ? c.text : '#52525b', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display: 'flex' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 1rem 1rem 1.25rem', borderTop: `1px solid ${c.border}` }}>
                        <p style={{ paddingTop: '0.875rem', fontSize: '0.8125rem', color: '#a1a1aa', lineHeight: 1.7 }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile CTA strip */}
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.25rem', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#d4d4d8' }}>Still have questions?</p>
            <a href="#contact" style={{ flexShrink: 0, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a78bfa' }}>
              Contact Us →
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
