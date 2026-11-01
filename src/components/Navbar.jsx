import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../data/site.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
        backdropFilter: 'blur(12px)',
        background: scrolled || open ? 'rgba(10,10,10,0.92)' : 'rgba(10,10,10,0.5)',
        borderBottom: `1px solid ${scrolled || open ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="text-[13px] md:text-[15px] font-black tracking-[0.25em] text-white uppercase shrink-0">
          Callybre
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          {/* Always visible — compact on mobile, full size on md+ */}
          <a href="#contact" className="btn-primary nav-cta-mobile">
            Get in Touch
          </a>

          {/* Hamburger — hidden on desktop */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] group"
          >
            <span
              className="block w-5 h-[1.5px] bg-white transition-all duration-300"
              style={{ transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-[1.5px] bg-white transition-all duration-300"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-5 h-[1.5px] bg-white transition-all duration-300"
              style={{ transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '400px' : '0',
          borderTop: open ? '1px solid rgba(255,255,255,0.06)' : 'none',
          background: 'rgba(10,10,10,0.97)',
        }}
      >
        <div className="px-6 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="py-3 text-[13px] font-semibold tracking-widest uppercase text-zinc-400 hover:text-white border-b border-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={close}
            className="mt-4 btn-primary justify-center"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </nav>
  )
}
