import useScrollReveal from '../hooks/useScrollReveal.js'

const BORDER = { purple: 'border-purple-500', blue: 'border-blue-500' }
const SHADOW = {
  purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  blue: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
}
const HOVER_BORDER = {
  purple: 'hover:border-purple-500/50',
  blue: 'hover:border-blue-500/50',
}
const ACCENT_BG = { purple: 'bg-purple-500', blue: 'bg-blue-500' }

export default function TimelineStep({ step, index }) {
  const revealRef = useScrollReveal()
  const isOdd = index % 2 === 0 // step 1 & 3 -> "odd" in the original markup

  return (
    <div
      ref={revealRef}
      className={`relative flex items-center justify-between md:justify-normal ${
        isOdd ? 'md:flex-row-reverse' : ''
      } group mb-12 reveal-on-scroll`}
    >
      <div className="hidden md:block w-5/12" />

      <div
        className={`absolute left-4 md:left-1/2 w-12 h-12 bg-[#09090b] border-2 ${BORDER[step.color]} md:-translate-x-1/2 flex items-center justify-center ${SHADOW[step.color]} z-10 transition-transform group-hover:scale-110`}
      >
        <span className="text-white text-sm font-black">{step.number}</span>
      </div>

      <div className="w-full pl-16 md:pl-0 md:w-5/12">
        <div
          className={`bg-white/5 border border-white/10 p-8 rounded-none hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 ${HOVER_BORDER[step.color]} relative`}
        >
          <div
            className={`absolute top-0 left-0 w-2 h-full ${ACCENT_BG[step.color]} opacity-50`}
          />
          <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
          <p className="text-gray-400 leading-relaxed text-sm">{step.text}</p>
        </div>
      </div>
    </div>
  )
}
