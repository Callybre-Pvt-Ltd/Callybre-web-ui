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
     Spec: anchored at top:24%, left:50%.
     Cards stack absolutely inside it, all at top:0 left:0.
     transform-origin on each card does the Ferris-wheel magic. */
  .tw-cards-wrapper {
    position: absolute;
    top: 24%;
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
  .tw-card.tw-active {
    z-index: 30 !important;
  }
  .tw-card.tw-active .tw-card-face {
    background: #151518;
    border-color: rgba(167, 139, 250, 0.45);
    box-shadow: 0 16px 48px rgba(0,0,0,0.85), 0 0 36px rgba(167,139,250,0.2);
  }
  .tw-card.tw-active .tw-card-face::before {
    opacity: 1;
    height: 2.5px;
    background: linear-gradient(90deg, #a78bfa, #60a5fa);
  }

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
  .tw-card:hover .tw-card-face {
    border-color: rgba(167,139,250,0.4);
    box-shadow: 0 8px 30px rgba(0,0,0,0.5), 0 0 24px rgba(167,139,250,0.12);
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

  /* Completely hide custom cursor on touch/mobile devices so it never gets stuck */
  @media (pointer: coarse), (hover: none) {
    .tw-cursor {
      display: none !important;
    }
  }

  /* ── Bottom nav controls ── */
  .tw-nav-controls {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
  }
  .tw-nav-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: #111111;
    color: #e4e4e7;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }
  .tw-nav-btn:hover {
    border-color: rgba(167, 139, 250, 0.6);
    background: #1a1a1a;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(167, 139, 250, 0.25);
  }
  .tw-nav-btn:active {
    transform: translateY(0) scale(0.92);
  }

  /* ── Bottom bar ── */
  .tw-bar {
    padding: 24px 24px 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  @media (max-width: 640px) {
    .tw-stage  { height: 500px; }
    .tw-cards-wrapper { top: 28%; }
    .tw-card   { width: 230px; left: -115px; }
    .tw-head   { padding: 0 24px 32px; }
    .tw-bar    { padding: 16px 24px 44px; }
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
      card.setAttribute("title", "Click to view testimonial")
      card.innerHTML   = `
        <div class="tw-card-face">
          <div class="tw-card-top">
            <div class="tw-qm">\u201c</div>
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

    // ── Rotate directly to clicked card slot into center (slot 5 = 0°) ────────
    function rotateToIndex(targetIndex) {
      const now = Date.now()
      if (now - lastClickRef.current < 220) return
      lastClickRef.current = now

      const steps = targetIndex - 5
      if (steps === 0) return

      if (steps > 0) {
        for (let s = 0; s < steps; s++) {
          wrapper.appendChild(wrapper.firstElementChild)
        }
      } else {
        for (let s = 0; s < Math.abs(steps); s++) {
          wrapper.insertBefore(wrapper.lastElementChild, wrapper.firstElementChild)
        }
      }
      applyRots(false)
    }

    // ── Apply rotations per spec with natural center spotlight ────────────────
    function applyRots(instant) {
      const cards = Array.from(wrapper.children)

      cards.forEach((card, i) => {
        const angle      = ROTS[i]
        const visible    = i >= 1 && i <= 10
        const isCentre   = i === 5          // slot 5 = 0°

        card.classList.toggle("tw-active", isCentre)

        // Center card (slot 5) has highest z-index, decreasing outward so center is in front.
        const baseZ = visible ? Math.max(1, 20 - Math.abs(i - 5)) : 0
        gsap.set(card, { zIndex: isCentre ? 30 : baseZ })

        if (!visible || instant) {
          gsap.set(card, {
            rotation: angle,
            opacity:  visible ? 1 : 0,
            scale:    isCentre ? 1.05 : 1,
            y:        0,
          })
        } else {
          const t       = (i - 1) / 9          // 0 at slot 1, 1 at slot 10
          const delay   = gsap.utils.interpolate(0, 0.22, t)
          const isEdge  = i === 1 || i === 10
          const ease    = isEdge ? "power3.out" : "elastic.out(0.5, 0.4)"
          const dur     = isEdge ? 0.9 : 1.25
          const opDelay = i === 1 ? delay + 0.18 : delay

          const baseScale = isCentre ? 1.05 : Math.max(0.82, 1 - Math.abs(angle) / 350)

          gsap.to(card, {
            rotation:  angle,
            scale:     baseScale,
            y:         0,
            duration:  dur,
            delay:     delay,
            ease:      ease,
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

      const rect = stage.getBoundingClientRect()
      const isLeft = e.clientX < rect.left + rect.width / 2
      dirRef.current = isLeft ? -1 : 1
      cursor.textContent = isLeft ? "←" : "→"
      cursor.classList.toggle("dir-left",  isLeft)
      cursor.classList.toggle("dir-right", !isLeft)
    }

    // Click handler:
    // 1. If clicked on ANY card: smoothly auto-swipe that card into center (slot 5)!
    // 2. If clicked on stage background: rotate 1 step in cursor direction!
    function onStageClick(e) {
      const cardTarget = e.target.closest(".tw-card")
      if (cardTarget && stage.contains(cardTarget)) {
        const cards = Array.from(wrapper.children)
        const clickedIndex = cards.indexOf(cardTarget)
        if (clickedIndex !== -1 && clickedIndex !== 5) {
          rotateToIndex(clickedIndex)
        }
        return
      }

      // Rotate wheel when clicking stage background
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
          </div>
        </div>

        {/* ── Ferris wheel stage ── */}
        <div ref={stageRef} className="tw-stage">
          <div ref={wrapperRef} className="tw-cards-wrapper" />
        </div>

        {/* Bottom controls */}
        <div className="tw-bar">
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

      </section>
    </>
  )
}
