import { useEffect, useId, useRef, useState } from 'react'

// Custom dropdown (ARIA listbox pattern) styled to match the underline form fields.
// Keyboard: ↑/↓ move, Home/End jump, Enter/Space pick, Esc/Tab close, letters jump.
export default function ServiceSelect({ label, placeholder, options, value, onChange, name }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const uid = useId()
  const listId = `${uid}-list`
  const optId = (i) => `${uid}-opt-${i}`
  const selectedIndex = options.indexOf(value)

  const openList = (startIndex) => {
    setActive(startIndex ?? (selectedIndex >= 0 ? selectedIndex : 0))
    setOpen(true)
  }

  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) buttonRef.current?.focus()
  }

  const pick = (i) => {
    onChange(options[i])
    close()
  }

  // Focus the list when it opens so it receives keyboard events
  useEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true })
  }, [open])

  // Close on click / tap outside
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) close(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // Keep the highlighted option visible
  useEffect(() => {
    if (open && active >= 0) {
      document.getElementById(optId(active))?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, active])

  const onButtonKeyDown = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      openList(e.key === 'ArrowUp' && selectedIndex < 0 ? options.length - 1 : undefined)
    }
  }

  const onListKeyDown = (e) => {
    const last = options.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => (i >= last ? 0 : i + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => (i <= 0 ? last : i - 1))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (active >= 0) pick(active)
        break
      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        close()
        break
      case 'Tab':
        close(false)
        break
      default:
        // Type-ahead: jump to the next option starting with the typed letter
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const ch = e.key.toLowerCase()
          const order = [...options.keys()].map((k) => (active + 1 + k) % options.length)
          const hit = order.find((k) => options[k].toLowerCase().startsWith(ch))
          if (hit !== undefined) setActive(hit)
        }
    }
  }

  const hasValue = selectedIndex >= 0

  return (
    <div ref={rootRef} className="relative">
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={hasValue ? `${label}: ${value}` : label}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKeyDown}
        className={`group relative block w-full text-left border-0 border-b px-0 pt-6 pb-2.5 pr-8 text-[14px] outline-none transition-colors ${
          open ? 'border-white' : 'border-white/[0.18] hover:border-white/40 focus-visible:border-white'
        }`}
      >
        {/* Floating label — sits in the field when empty, lifts once a value is chosen */}
        <span
          className={`pointer-events-none absolute left-0 transition-all duration-200 ${
            hasValue || open
              ? 'top-1 text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500'
              : 'top-6 text-[14px] text-zinc-400'
          }`}
        >
          {hasValue || open ? label : placeholder}
        </span>

        <span className={`block min-h-[1.25rem] ${hasValue ? 'text-white' : 'text-transparent'}`}>
          {hasValue ? value : placeholder}
        </span>

        <svg
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 bottom-3.5 transition-transform duration-300 ${
            open ? 'rotate-180 text-white' : 'text-zinc-500 group-hover:text-zinc-300'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        aria-activedescendant={open && active >= 0 ? optId(active) : undefined}
        onKeyDown={onListKeyDown}
        className={`service-select-panel absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto border border-white/[0.1] bg-[#121214] py-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.6)] outline-none ${
          open ? 'is-open' : ''
        }`}
      >
        {options.map((opt, i) => {
          const selected = opt === value
          const isActive = i === active
          return (
            <li
              key={opt}
              id={optId(i)}
              role="option"
              aria-selected={selected}
              onPointerMove={() => setActive(i)}
              onClick={() => pick(i)}
              className={`relative flex items-center gap-4 px-4 py-3 text-[13.5px] cursor-pointer select-none transition-colors duration-150 ${
                isActive ? 'bg-white/[0.06] text-white' : 'text-zinc-400'
              }`}
            >
              {/* Accent bar on the highlighted row */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 bottom-0 w-[2px] bg-violet-400 transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              />
              <span className={`text-[10px] font-bold tabular-nums tracking-[0.14em] ${isActive || selected ? 'text-violet-400' : 'text-zinc-600'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`flex-1 ${selected ? 'text-white font-semibold' : ''}`}>{opt}</span>
              {selected && (
                <svg aria-hidden="true" className="text-violet-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
