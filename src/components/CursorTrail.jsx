import { useEffect, useRef } from "react"

// ─── pool of characters that appear on the trail ────────────────────────────
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?"

const TRAIL_LENGTH  = 22   // number of particles alive at once
const SPAWN_DIST    = 6    // px moved before spawning a new particle
const LIFETIME      = 680  // ms a particle lives
const FONT_SIZE_MIN = 11
const FONT_SIZE_MAX = 18

// single white color for all trail characters
const TRAIL_COLOR = "rgba(255,255,255,0.85)"

function rand(min, max) { return Math.random() * (max - min) + min }
function randChar() { return CHARS[Math.floor(Math.random() * CHARS.length)] }

// ─── Create one particle DOM node ────────────────────────────────────────────
function createParticle(x, y) {
  const el = document.createElement("span")
  const size = rand(FONT_SIZE_MIN, FONT_SIZE_MAX)
  const color = TRAIL_COLOR
  const vx = rand(-22, 22)
  const vy = rand(-28, -6)   // drift upward
  const rot = rand(-40, 40)

  Object.assign(el.style, {
    position:      "fixed",
    left:          x + "px",
    top:           y + "px",
    pointerEvents: "none",
    zIndex:        "99999",
    fontSize:      size + "px",
    fontFamily:    "'Inter', 'Courier New', monospace",
    fontWeight:    "700",
    color:         color,
    opacity:       "1",
    transform:     `translate(-50%,-50%) rotate(${rot}deg)`,
    userSelect:    "none",
    lineHeight:    "1",
    textShadow:    `0 0 6px rgba(255,255,255,0.4), 0 0 2px rgba(255,255,255,0.6)`,
    willChange:    "transform, opacity",
  })
  el.textContent = randChar()
  document.body.appendChild(el)

  let startTime = null

  function tick(ts) {
    if (!startTime) startTime = ts
    const elapsed = ts - startTime
    const progress = Math.min(elapsed / LIFETIME, 1)

    const eased = 1 - progress * progress          // ease-out
    const curX  = x + vx * progress * 2.2
    const curY  = y + vy * progress * 2.2
    const curRot = rot + progress * rand(-60, 60)

    el.style.left    = curX + "px"
    el.style.top     = curY + "px"
    el.style.opacity = (eased * 0.9).toString()
    el.style.transform = `translate(-50%,-50%) rotate(${curRot}deg) scale(${0.5 + eased * 0.6})`

    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      el.remove()
    }
  }

  requestAnimationFrame(tick)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CursorTrail() {
  const lastPos = useRef({ x: 0, y: 0 })
  const accum   = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      const dx = x - lastPos.current.x
      const dy = y - lastPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      accum.current += dist
      lastPos.current = { x, y }

      // spawn one particle every SPAWN_DIST px of travel
      while (accum.current >= SPAWN_DIST) {
        accum.current -= SPAWN_DIST
        createParticle(x, y)
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return null   // pure side-effect, no DOM output from React
}
