import useScrollReveal from '../hooks/useScrollReveal.js'

/**
 * Small wrapper that fades/slides its children in when scrolled into view.
 * Use `delay` (seconds) to stagger items in a grid.
 */
export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}
