import Reveal from './Reveal.jsx'

export default function CTABanner() {
  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 p-10 md:p-14 border border-white/[0.1]"
            style={{ background: 'linear-gradient(135deg, #111 0%, #0d0d0d 100%)' }}
          >
            {/* Text */}
            <div className="flex-1">
              <p className="sec-label">Ready to start?</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight mt-1">
                Let's build something that{' '}
                <span className="text-zinc-400">actually works.</span>
              </h2>
              <p className="mt-4 text-zinc-500 text-[14px] leading-relaxed max-w-md">
                Tell us about your idea. We'll reply with a clear plan and a free consultation within one business day.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a href="#contact" className="btn-primary">
                Book Free Consultation →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
