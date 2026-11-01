import Modal from '../Modal.jsx'

const INCLUSIONS = [
  'High-retention short-form reel formats',
  'Perfect for vehicle deliveries & inaugurations',
  'Professional on-location shoot',
  'Color grading & sound design',
  'Delivery in 48–72 hours',
]

export default function VideoModal() {
  return (
    <Modal
      id="videoModal"
      icon="video"
      iconColor="#fb7185"
      title="Video Production"
      subtitle="Cinematic quality for stories that demand attention."
      footer={
        <div className="p-6 flex justify-end">
          <a href="#contact" className="btn-primary">
            Book Your Shoot →
          </a>
        </div>
      }
    >
      <div className="p-6">
        <div className="bg-[#0f0f0f] border border-white/[0.06] p-7">
          <div className="flex items-baseline gap-3 mb-1">
            <h4 className="text-[16px] font-bold text-white">Promotional &amp; Reels</h4>
          </div>
          <div className="text-[32px] font-black text-white tracking-tight leading-none mt-3 mb-6">
            ₹14,999
            <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest ml-2">starts at</span>
          </div>
          <ul className="space-y-3 mb-6">
            {INCLUSIONS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[13px] text-zinc-400">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#fb7185" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[12px] text-zinc-600 border-t border-white/[0.06] pt-4">
            Pricing varies by shoot duration and location. Contact us for a custom quote.
          </p>
        </div>
      </div>
    </Modal>
  )
}
