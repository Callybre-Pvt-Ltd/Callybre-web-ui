import Reveal from './Reveal.jsx'

/**
 * Generic section heading — kept for any sections that still use it,
 * but new sections use inline headings with .sec-label directly.
 */
export default function SectionHeading({ label, title, highlight, text, align = 'center' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <Reveal className={`mb-14 max-w-3xl ${alignClass}`}>
      {label && <p className="sec-label">{label}</p>}
      <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
        {title}{' '}
        {highlight && <span className="text-zinc-500">{highlight}</span>}
      </h2>
      {text && (
        <p className="mt-4 text-zinc-500 text-[15px] leading-relaxed">{text}</p>
      )}
    </Reveal>
  )
}
