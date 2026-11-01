import { useState, useEffect, useRef } from "react"
import { TESTIMONIALS } from "../data/site.js"
import gsap from "gsap"
import useScrollReveal from "../hooks/useScrollReveal.js"

// ─── 18 cards cycling the real testimonials ───────────────────────────────────
const TOTAL = 18
const CARDS  = Array.from({ length: TOTAL }, (_, i) => TESTIMONIALS[i % TESTIMONIALS.length])

// ─── Angular slot array — spec: clamp(-90, 90, i*18-90) ─────────────────────
// slot 0 → -90° (hidden left)
// slots 1-10 → -72° … +90° (visible arc)
// slots 11+ → clamped at +90° (hidden right, standby queue)
const ROTS = Array.from({ length: TOTAL }, (_, i) =>
  Math.max(-90, Math.min(90, i * 18 - 90))
)

// ─── Stars HTML string ────────────────────────────────────────────────────────
function starsHTML(n = 5) {
  return Array.from({ length: 5 }, (_, i) => {
    const on = i < n
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="${on ? "#fbbf24" : "none"}" stroke="${on ? "#fbbf24" : "#3f3f46"}" stroke-width="1.5" style="flex-shrink:0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  }).join("")
}

// ─── Scoped CSS ───────────────────────────────────────────────────────────────
const STYLES = `
  /* Section */
  .tw-section {
    background: #0a0a0a;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 80px 0 0;
    position: relative;
    overflow: hidden;
  }

  /* Header row */
  .tw-head {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px 56px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
  }

  /* ── Wheel stage ──
     Full-width, fixed height, clips left/right overflow.
     cursor:none hides the default pointer inside. */
  .tw-stage {
    position: relative;
    width: 100%;
    height: 600px;
    overflow: hidden;
    cursor: none;
    user-select: none;
  }

  /* ── cards-wrapper ──
     Spec: anchored at top:20%, left:50%.
     Cards stack absolutely inside it, all at top:0 left:0.
     transform-origin on each card does the Ferris-wheel magic. */
  .tw-cards-wrapper {
    position: absolute;
    top: 20%;
    left: 50%;
    width: 0;
    height: 0;
  }

  /* ── Individual card ──
     Spec: transformOrigin "50% 275%" — pivot pushed 275% of card
     height below its top edge → card hangs below the pivot like a
     Ferris-wheel gondola and sweeps an arc when rotated. */
  .tw-card {
    position: absolute;
    top: 0;
    left: -140px;          /* half of 280px card width to centre on pivot */
    width: 280px;
    transform-origin: 50% 275%;
    will-change: transform, opacity;
    cursor: none;
  }

  /* Card face */
  .tw-card-face {
    background: #111111;
    border: 1px solid rgba(255,255,255,0.07);
    padding: 24px 22px 20px;
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .tw-card-face::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: linear-gradient(90deg, #a78bfa, #60a5fa);
    opacity: 0;
    transition: opacity 0.3s;
  }
  /* Centre slot (slot 5 = 0 degrees) gets the spotlight */
  .tw-card.tw-active .tw-card-face {
    border-color: rgba(255,255,255,0.18);
    box-shadow: 0 0 48px rgba(167,139,250,0.12);
  }
  .tw-card.tw-active .tw-card-face::before { opacity: 1; }

  /* Quote mark */
  .tw-qm {
    font-size: 44px;
    font-weight: 900;
    line-height: 0.7;
    color: rgba(255,255,255,0.05);
    font-family: Georgia, serif;
    user-select: none;
    margin-bottom: 0;
  }
  .tw-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .tw-card-expand {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #71717a;
    transition: all 0.2s ease;
  }
  .tw-card:hover .tw-card-face {
    border-color: rgba(167,139,250,0.4);
    box-shadow: 0 8px 30px rgba(0,0,0,0.5), 0 0 24px rgba(167,139,250,0.12);
  }
  .tw-card:hover .tw-card-expand {
    background: rgba(167,139,250,0.18);
    border-color: rgba(167,139,250,0.45);
    color: #a78bfa;
    transform: scale(1.08);
  }
  /* Stars row */
  .tw-stars { display: flex; gap: 3px; margin-bottom: 10px; }
  /* Quote text */
  .tw-qt {
    font-size: 12.5px;
    color: #a1a1aa;
    line-height: 1.65;
    flex: 1;
    min-height: 60px;
  }
  /* Footer */
  .tw-foot {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .tw-av {
    width: 30px; height: 30px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 900;
    color: #a1a1aa; flex-shrink: 0;
    background: #1a1a1a;
  }
  .tw-nm  { font-size: 12px; font-weight: 700; color: #fff; }
  .tw-rl  { font-size: 10px; color: #52525b; margin-top: 2px; }

  /* ── Custom cursor ── */
  .tw-cursor {
    position: fixed;
    top: 0; left: 0;
    width: 50px; height: 50px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 800;
    border: 1.5px solid rgba(167,139,250,0.5);
    background: rgba(167,139,250,0.10);
    color: rgba(167,139,250,0.95);
    /* GSAP drives left/top; we centre with negative margin */
    margin-left: -25px; margin-top: -25px;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
  }
  .tw-cursor.dir-left  {
    border-color: rgba(96,165,250,0.55);
    background:   rgba(96,165,250,0.10);
    color:        rgba(96,165,250,0.95);
  }
  .tw-cursor.dir-right {
    border-color: rgba(167,139,250,0.55);
    background:   rgba(167,139,250,0.10);
    color:        rgba(167,139,250,0.95);
  }
  .tw-cursor.pressing {
    transform: scale(0.8);
    background: rgba(167,139,250,0.25);
  }
  .tw-cursor.on-card {
    border-color: rgba(167,139,250,0.9);
    background: rgba(167,139,250,0.25);
    color: #fff;
    transform: scale(1.1);
  }

  /* ── ELEVATED CARD ON CLICK (Comes completely on top so it's not hidden by other cards!) ── */
  .tw-card.tw-elevated {
    z-index: 9999 !important;
  }
  .tw-card.tw-elevated .tw-card-face {
    background: #171717 !important;
    border-color: rgba(167, 139, 250, 0.95) !important;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.95), 0 0 50px rgba(167, 139, 250, 0.35) !important;
  }
  .tw-card.tw-elevated .tw-card-face::before {
    opacity: 1 !important;
    height: 3px !important;
  }
  .tw-card.tw-elevated .tw-card-expand {
    background: rgba(167, 139, 250, 0.3) !important;
    border-color: rgba(167, 139, 250, 0.8) !important;
    color: #fff !important;
    transform: rotate(180deg);
  }

  /* ── Header nav controls ── */
  .tw-nav-controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .tw-nav-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: #121212;
    color: #a1a1aa;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .tw-nav-btn:hover {
    border-color: rgba(255, 255, 255, 0.35);
    background: #1c1c1c;
    color: #fff;
    transform: translateY(-1px);
  }
  .tw-nav-btn:active {
    transform: translateY(0) scale(0.92);
  }

  /* ── Bottom bar ── */
  .tw-bar {
    padding: 28px 48px 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
  }
  .tw-hint {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #3f3f46;
  }
  .tw-dots { display: flex; gap: 8px; }
  .tw-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #3f3f46;
    border: none; padding: 0; cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }
  .tw-dot.active { background: #a78bfa; transform: scale(1.5); }

  @media (max-width: 640px) {
    .tw-stage  { height: 480px; }
    .tw-card   { width: 230px; left: -115px; }
    .tw-head   { padding: 0 24px 40px; }
  }
`

// ─── Component ────────────────────────────────────────────────────────────────
export default function Testimonials() {
  const headRef         = useScrollReveal()
  const stageRef        = useRef(null)
  const wrapperRef      = useRef(null)
  const cursorRef       = useRef(null)
  const dotsRef         = useRef(null)
  const dirRef          = useRef(1)
  const moveRef         = useRef(null)
  const lastClickRef    = useRef(0)
  const elevatedCardRef = useRef(null)

  // ── Build card DOM nodes ─────────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current
    const stage   = stageRef.current
    const cursor  = cursorRef.current
    if (!wrapper || !stage || !cursor) return

    // ── Populate cards ─────────────────────────────────────────────────────────
    wrapper.innerHTML = ""
    CARDS.forEach((t) => {
      const card       = document.createElement("div")
      card.className   = "tw-card"
      card.dataset.quote = t.quote
      card.dataset.name  = t.name
      card.dataset.role  = t.role
      card.setAttribute("title", "Click to bring to front")
      card.innerHTML   = `
        <div class="tw-card-face">
          <div class="tw-card-top">
            <div class="tw-qm">\u201c</div>
            <div class="tw-card-expand" title="Click to bring to front">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </div>
          </div>
          <div class="tw-stars">${starsHTML(5)}</div>
          <p class="tw-qt">${t.quote}</p>
          <div class="tw-foot">
            <div class="tw-av">${t.name.charAt(0)}</div>
            <div>
              <div class="tw-nm">${t.name}</div>
              <div class="tw-rl">${t.role}</div>
            </div>
          </div>
        </div>`
      wrapper.appendChild(card)
    })

    // ── Initial snap (no animation) ────────────────────────────────────────────
    applyRots(true)

    // ── One move step ──────────────────────────────────────────────────────────
    function move(explicitDir) {
      elevatedCardRef.current = null
      const dir = explicitDir !== undefined ? explicitDir : dirRef.current
      if (dir > 0) {
        // Forward: recycle first card to end
        wrapper.appendChild(wrapper.firstElementChild)
      } else {
        // Backward: recycle last card to front
        wrapper.insertBefore(wrapper.lastElementChild, wrapper.firstElementChild)
      }
      applyRots(false)
    }
    moveRef.current = move

    // ── Apply rotations per spec with natural & elevated stacking ──────────────
    function applyRots(instant) {
      const cards = Array.from(wrapper.children)

      cards.forEach((card, i) => {
        const angle      = ROTS[i]
        const visible    = i >= 1 && i <= 10
        const isCentre   = i === 5          // slot 5 = 0°
        const isElevated = card === elevatedCardRef.current

        card.classList.toggle("tw-active", isCentre)
        card.classList.toggle("tw-elevated", isElevated)

        // Stacking order:
        // Elevated card gets 9999 so it is NEVER hidden behind any other card!
        // Default: center card (slot 5) has highest (20), decreasing outward so center is in front.
        const baseZ = visible ? Math.max(1, 20 - Math.abs(i - 5)) : 0
        const z = isElevated ? 9999 : baseZ
        gsap.set(card, { zIndex: z })

        if (!visible || instant) {
          gsap.set(card, {
            rotation: angle,
            opacity:  visible ? 1 : 0,
            scale:    isElevated ? 1.14 : (isCentre ? 1.02 : 1),
            y:        isElevated ? -25 : 0,
          })
        } else {
          const t       = (i - 1) / 9          // 0 at slot 1, 1 at slot 10
          const delay   = gsap.utils.interpolate(0, 0.22, t)
          const isEdge  = i === 1 || i === 10
          const ease    = isEdge ? "power3.out" : "elastic.out(0.5, 0.4)"
          const dur     = isEdge ? 0.9 : 1.35
          const opDelay = i === 1 ? delay + 0.18 : delay

          const baseScale   = isCentre ? 1.02 : Math.max(0.82, 1 - Math.abs(angle) / 350)
          const targetScale = isElevated ? 1.14 : baseScale
          const targetY     = isElevated ? -25 : 0

          gsap.to(card, {
            rotation:  angle,
            scale:     targetScale,
            y:         targetY,
            duration:  isElevated ? 0.35 : dur,
            delay:     isElevated ? 0 : delay,
            ease:      isElevated ? "power2.out" : ease,
            overwrite: "auto",
          })
          gsap.to(card, {
            opacity:   1,
            duration:  0.35,
            delay:     opDelay,
            ease:      "none",
            overwrite: "auto",
          })
        }
      })

      // Sync dots
      updateDots()
    }

    // ── Dot sync ───────────────────────────────────────────────────────────────
    function updateDots() {
      const dotsEl = dotsRef.current
      if (!dotsEl) return
      const centreCard = wrapper.children[5]
      if (!centreCard) return
      const quote = centreCard.querySelector(".tw-qt")?.textContent?.trim() || ""
      const idx   = TESTIMONIALS.findIndex(t => t.quote.trim() === quote)
      Array.from(dotsEl.children).forEach((dot, i) => {
        dot.classList.toggle("active", i === idx)
      })
    }

    // ── GSAP quickTo cursor — smooth, no layout thrash ─────────────────────────
    const qx = gsap.quickTo(cursor, "left",  { duration: 0.1, ease: "none" })
    const qy = gsap.quickTo(cursor, "top",   { duration: 0.1, ease: "none" })

    // ── Event handlers ─────────────────────────────────────────────────────────
    function onMouseMove(e) {
      qx(e.clientX)
      qy(e.clientY)

      const cardTarget = e.target.closest(".tw-card")
      if (cardTarget && stage.contains(cardTarget)) {
        const isCurrentElevated = cardTarget === elevatedCardRef.current
        cursor.textContent = isCurrentElevated ? "↓" : "↑"
        cursor.classList.add("on-card")
        cursor.classList.remove("dir-left", "dir-right")
        return
      }

      cursor.classList.remove("on-card")
      const rect = stage.getBoundingClientRect()
      const isLeft = e.clientX < rect.left + rect.width / 2
      dirRef.current = isLeft ? -1 : 1
      cursor.textContent = isLeft ? "←" : "→"
      cursor.classList.toggle("dir-left",  isLeft)
      cursor.classList.toggle("dir-right", !isLeft)
    }

    // Single click handler:
    // 1. If clicked on a card: elevate it on top of all cards ("usi same place pe upar aa jaye")
    // 2. If clicked on stage background: rotate wheel!
    function onStageClick(e) {
      const cardTarget = e.target.closest(".tw-card")
      if (cardTarget && stage.contains(cardTarget)) {
        if (elevatedCardRef.current === cardTarget) {
          // If clicked the already elevated card, drop it back down
          elevatedCardRef.current = null
        } else {
          // Elevate this card to the absolute top!
          elevatedCardRef.current = cardTarget
        }
        applyRots(false)
        return
      }

      // If a card was elevated and user clicked stage background, lower it
      if (elevatedCardRef.current) {
        elevatedCardRef.current = null
        applyRots(false)
        return
      }

      // Rotate wheel
      const now = Date.now()
      if (now - lastClickRef.current < 200) return
      lastClickRef.current = now

      const rect = stage.getBoundingClientRect()
      const isLeft = e.clientX < rect.left + rect.width / 2
      const dir = isLeft ? -1 : 1

      cursor.classList.add("pressing")
      setTimeout(() => cursor.classList.remove("pressing"), 140)

      move(dir)
    }

    function onStageEnter() { gsap.to(cursor, { opacity: 1, duration: 0.2 }) }
    function onStageLeave() { gsap.to(cursor, { opacity: 0, duration: 0.2 }) }

    window.addEventListener("mousemove",  onMouseMove, { passive: true })
    stage.addEventListener("mouseenter",  onStageEnter)
    stage.addEventListener("mouseleave",  onStageLeave)
    stage.addEventListener("click",       onStageClick)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      stage.removeEventListener("mouseenter", onStageEnter)
      stage.removeEventListener("mouseleave", onStageLeave)
      stage.removeEventListener("click",      onStageClick)
    }
  }, [])

  // Header button navigation
  const handleManualNav = (dir) => {
    const now = Date.now()
    if (now - lastClickRef.current < 200) return
    lastClickRef.current = now

    if (moveRef.current) {
      moveRef.current(dir)
    }
  }

  return (
    <>
      <style>{STYLES}</style>

      {/* Fixed custom cursor */}
      <div ref={cursorRef} className="tw-cursor" style={{ opacity: 0 }}>→</div>

      <section id="testimonials" className="tw-section scroll-mt-20">

        {/* Header */}
        <div ref={headRef} className="tw-head reveal-on-scroll">
          <div>
            <p className="sec-label">Client Feedback</p>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
              What clients say
            </h2>
            <p style={{ marginTop: 12, color: "#52525b", fontSize: 13, margin: "12px 0 0" }}>
              Click any card to bring it to the front &nbsp;·&nbsp; Click left or right to rotate
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="tw-nav-controls">
            <button
              type="button"
              className="tw-nav-btn"
              onClick={() => handleManualNav(-1)}
              aria-label="Previous testimonial"
              title="Previous testimonial"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button
              type="button"
              className="tw-nav-btn"
              onClick={() => handleManualNav(1)}
              aria-label="Next testimonial"
              title="Next testimonial"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Ferris wheel stage ── */}
        <div ref={stageRef} className="tw-stage">
          <div ref={wrapperRef} className="tw-cards-wrapper" />
        </div>

        {/* Bottom hint */}
        <div className="tw-bar">
          <p className="tw-hint">Click card to pop in front &nbsp;·&nbsp; Click left or right to rotate</p>
        </div>

      </section>
    </>
  )
}
