import techStack from '../data/techStack.js'

// Quadruple all items for a seamless CSS loop at any screen width
const items = [...techStack, ...techStack, ...techStack, ...techStack]

function TechItem({ tech }) {
  return (
    <div
      className="flex items-center gap-3 px-6 shrink-0 group"
      style={{ height: '52px' }}
    >
      <span
        className="w-5 h-5 shrink-0 transition-opacity duration-300 opacity-50 group-hover:opacity-100"
        style={{ color: tech.color }}
        dangerouslySetInnerHTML={{ __html: tech.svg }}
      />
      <span className="text-[11px] font-bold tracking-[0.18em] uppercase whitespace-nowrap transition-colors duration-300 text-zinc-600 group-hover:text-zinc-300">
        {tech.label}
      </span>
      <span className="ml-4 w-[3px] h-[3px] rounded-full bg-white/10 shrink-0" />
    </div>
  )
}

export default function TechMarquee() {
  return (
    <div className="mb-20 overflow-hidden border-y border-white/[0.06] select-none marquee-pause-hover">
      <div
        className="flex items-center"
        style={{
          animation: 'marqueeLeft 40s linear infinite',
          width: 'max-content',
        }}
      >
        {items.map((tech, i) => (
          <TechItem key={`t-${tech.label}-${i}`} tech={tech} />
        ))}
      </div>

      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>
    </div>
  )
}

