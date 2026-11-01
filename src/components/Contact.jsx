import { CONTACT } from '../data/site.js'
import Reveal from './Reveal.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'

const GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}&su=${encodeURIComponent('Project Enquiry — Callybre')}`

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
  </svg>
)

export default function Contact() {
  const headRef = useScrollReveal()

  return (
    <section id="contact" className="scroll-mt-20 bg-[#0a0a0a] border-t border-white/[0.06]">

      {/* ══════════ DESKTOP ══════════ */}
      <div className="hidden md:block">
        <div ref={headRef} className="reveal-on-scroll max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10">
          <p className="sec-label">Contact</p>
        </div>

        {/* Giant email as hero CTA */}
        <Reveal>
          <a
            href={GMAIL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block max-w-7xl mx-auto px-6 lg:px-12 pb-14"
          >
            <div className="flex items-end justify-between border-b border-white/[0.08] pb-10 gap-6">
              <h2
                className="font-black tracking-tight text-white leading-none transition-colors duration-300 group-hover:text-violet-300"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)' }}
              >
                {CONTACT.email}
              </h2>
              <span className="shrink-0 flex items-center gap-3 border border-white/[0.12] px-6 py-3 text-[11px] font-black tracking-[0.22em] uppercase text-white group-hover:bg-white group-hover:text-[#0a0a0a] transition-all duration-300 mb-1">
                <GmailIcon />
                Open Gmail →
              </span>
            </div>
          </a>
        </Reveal>

        {/* Info strip */}
        <Reveal delay={0.1}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
              {[
                { label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
                { label: 'Location', value: CONTACT.location },
                { label: 'Hours', value: CONTACT.hours },
                { label: 'Default mail app', value: 'Open in system mailer →', href: `mailto:${CONTACT.email}` },
              ].map((item) => (
                <div key={item.label} className="bg-[#0a0a0a] px-6 py-5">
                  <div className="text-[9px] font-bold tracking-[0.22em] uppercase text-zinc-700 mb-2">{item.label}</div>
                  {item.href
                    ? <a href={item.href} className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors">{item.value}</a>
                    : <div className="text-[13px] font-semibold text-zinc-400">{item.value}</div>}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ══════════ MOBILE — compact, no extra scroll ══════════ */}
      <div className="md:hidden px-5 py-10">

        {/* Heading */}
        <div ref={headRef} className="reveal-on-scroll mb-7">
          <p className="sec-label">Contact</p>
          <h2 className="text-[1.9rem] font-black tracking-tight text-white leading-tight">
            Let's build<br />something great.
          </h2>
          <p className="mt-2 text-zinc-600 text-[13px]">We reply within one business day.</p>
        </div>

        {/* Gmail CTA — full width white button */}
        <Reveal>
          <a
            href={GMAIL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between w-full bg-white text-[#0a0a0a] px-5 py-4 mb-3 hover:bg-zinc-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <GmailIcon />
              <span className="text-[11px] font-black tracking-[0.2em] uppercase">Email via Gmail</span>
            </div>
            <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </Reveal>

        {/* Email address */}
        <Reveal delay={0.05}>
          <div className="bg-[#111] border border-white/[0.07] px-5 py-3 mb-4">
            <div className="text-[9px] font-bold tracking-[0.22em] uppercase text-zinc-700 mb-1">Email</div>
            <p className="text-[13px] font-semibold text-zinc-300 break-all">{CONTACT.email}</p>
          </div>
        </Reveal>

        {/* Phone + Location */}
        <Reveal delay={0.08}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-[#111] border border-white/[0.07] px-4 py-3">
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-700 mb-1">Phone</div>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="text-[12px] font-semibold text-zinc-300 hover:text-white transition-colors">
                {CONTACT.phone}
              </a>
            </div>
            <div className="bg-[#111] border border-white/[0.07] px-4 py-3">
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-700 mb-1">Location</div>
              <div className="text-[12px] font-semibold text-zinc-300">{CONTACT.location}</div>
            </div>
          </div>
        </Reveal>

        {/* Hours + Mail app fallback */}
        <Reveal delay={0.11}>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#111] border border-white/[0.07] px-4 py-3">
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-700 mb-1">Hours</div>
              <div className="text-[11px] font-semibold text-zinc-400 leading-snug">{CONTACT.hours}</div>
            </div>
            <a
              href={`mailto:${CONTACT.email}`}
              className="bg-[#111] border border-white/[0.07] px-4 py-3 flex flex-col justify-between hover:border-white/[0.15] transition-colors group"
            >
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-700 mb-1">Mail App</div>
              <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-white transition-colors">Open →</span>
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  )
}
