import { CONTACT, NAV_LINKS } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-10 py-16 border-b border-white/[0.06]">
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
