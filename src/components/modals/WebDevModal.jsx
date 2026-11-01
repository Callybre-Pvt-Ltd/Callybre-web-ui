import Modal from '../Modal.jsx'

const FEATURES = [
  { label: 'Responsive design (5–7 pages)', tier: 'both' },
  { label: 'Mobile-first & performance optimised', tier: 'both' },
  { label: 'Basic on-page SEO setup', tier: 'both' },
  { label: 'Contact form integration', tier: 'both' },
  { label: 'Custom database & REST API', tier: 'enterprise' },
  { label: 'E-commerce & payment gateways', tier: 'enterprise' },
  { label: 'Admin dashboard', tier: 'enterprise' },
  { label: 'Dedicated post-launch support', tier: 'enterprise' },
]

function Tick({ color }) {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function WebDevModal() {
  return (
    <Modal
      id="webDevModal"
      icon="webdev"
      iconColor="#a78bfa"
      title="Web Development"
      subtitle="Select your scale — we build for performance and longevity."
      footer={
        <div className="p-6 flex justify-end">
          <a
            href="#contact"
            className="btn-primary"
            onClick={() => document.querySelector('[data-close-modal]')?.click()}
          >
            Start Your Project →
          </a>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06] m-6">
        {/* Starter */}
        <div className="bg-[#111111] p-7">
          <div className="flex items-baseline gap-3 mb-1">
            <h4 className="text-[16px] font-bold text-white">Starter</h4>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-white/10 text-zinc-500">
              Most Popular
            </span>
          </div>
          <div className="text-[32px] font-black text-white tracking-tight leading-none mt-3 mb-6">
            ₹39,999
            <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest ml-2">one time</span>
          </div>
          <ul className="space-y-3">
            {FEATURES.filter(f => f.tier === 'both').map(f => (
              <li key={f.label} className="flex items-start gap-3 text-[13px] text-zinc-400">
                <Tick color="#a78bfa" />
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise */}
        <div className="bg-[#0f0f0f] p-7 border-l border-white/[0.06]">
          <div className="flex items-baseline gap-3 mb-1">
            <h4 className="text-[16px] font-bold text-white">Enterprise</h4>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-emerald-500/30 text-emerald-500">
              Scale
            </span>
          </div>
          <div className="text-[32px] font-black text-white tracking-tight leading-none mt-3 mb-6">
            Custom
            <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest ml-2">tailored</span>
          </div>
          <ul className="space-y-3">
            {FEATURES.map(f => (
              <li key={f.label} className="flex items-start gap-3 text-[13px] text-zinc-400">
                <Tick color={f.tier === 'enterprise' ? '#a78bfa' : '#3f3f46'} />
                <span className={f.tier === 'enterprise' ? 'text-zinc-300' : ''}>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  )
}
