import { CONTACT, NAV_LINKS } from '../data/site.js'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      window.history.pushState(null, '', '#')
    } catch (e) {}
  }

  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 py-16 border-b border-white/[0.06] items-end">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-[15px] font-black tracking-[0.22em] text-white uppercase mb-4">
              Callybre
            </div>
            <p className="text-[13px] text-zinc-500 leading-relaxed max-w-[220px]">
              IT consulting and digital marketing for brands that want to grow.
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-block mt-5 text-[13px] text-zinc-400 hover:text-white transition-colors"
            >
              {CONTACT.email}
            </a>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-700 mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13px] text-zinc-500 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to top button */}
          <div className="flex flex-col items-end justify-end">
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex flex-col items-center gap-2 focus:outline-none"
              aria-label="Back to home"
              title="Go to top / Home"
            >
              <div className="w-14 h-14 rounded-full border border-white/12 bg-[#121214] flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-purple-500/60 group-hover:bg-[#1a1a22] group-hover:shadow-[0_0_28px_rgba(167,139,250,0.35)] active:scale-90 transition-all duration-300">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform group-hover:-translate-y-1 transition-transform duration-200"
                >
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 group-hover:text-zinc-200 transition-colors">
                Back to Top
              </span>
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-700">
          <span>© {new Date().getFullYear()} Callybre. All rights reserved.</span>
          <div className="flex gap-6">
            <span>{CONTACT.location}</span>
            <span className="text-zinc-800">·</span>
            <span>{CONTACT.hours}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
