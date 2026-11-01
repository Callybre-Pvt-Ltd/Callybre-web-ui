import { useEffect, useRef, useState, useCallback } from "react"
import { PROJECTS } from "../data/site.js"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import useScrollReveal from "../hooks/useScrollReveal.js"

gsap.registerPlugin(Draggable)

const COLOR = {
  purple:  "#a78bfa",
  blue:    "#60a5fa",
  indigo:  "#818cf8",
  emerald: "#34d399",
  rose:    "#fb7185",
  amber:   "#fbbf24",
}

function CardIcon({ name, color }) {
  const s = { width: 22, height: 22, stroke: color, fill: "none", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" }
  if (name === "mobile") return (
    <svg viewBox="0 0 24 24" style={s}>
      <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>
    </svg>
  )
  if (name === "ai") return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z"/>
      <path d="M9 9h.01M15 9h.01M9 15h6"/>
    </svg>
  )
  if (name === "video") return (
    <svg viewBox="0 0 24 24" style={s}>
      <rect x="2" y="6" width="15" height="12" rx="2"/><path d="M17 9l5-3v12l-5-3V9z"/>
    </svg>
  )
  if (name === "seo") return (
    <svg viewBox="0 0 24 24" style={s}>
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6M11 8v6"/>
    </svg>
  )
  if (name === "shield") return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M12 2l8 4v6c0 5-4 8-8 10C8 20 4 17 4 12V6l8-4z"/><path d="M9 12l2 2 4-4"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8l2 2-2 2M13 10h3"/>
    </svg>
  )
}

const STYLES = `
  .portfolio-section{position:relative;overflow:hidden;background:#0a0a0a;border-top:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;min-height:100vh;}
  .cf-stage{flex:1;display:flex;align-items:center;justify-content:center;perspective:1200px;perspective-origin:50% 50%;overflow:hidden;cursor:grab;user-select:none;-webkit-user-select:none;min-height:320px;}
  .cf-stage:active{cursor:grabbing;}
  .cf-track{position:relative;display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;width:100%;height:100%;}
  .cover-card{position:absolute;width:340px;min-height:420px;background:#111111;border:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;overflow:hidden;will-change:transform,opacity;backface-visibility:hidden;transform-style:preserve-3d;transition:border-color .3s;}
  .cover-card:hover{border-color:rgba(255,255,255,0.18);}
  .cc-glow{position:absolute;inset:0;pointer-events:none;z-index:0;}
  .cc-strip{height:3px;width:100%;flex-shrink:0;position:relative;z-index:1;}
  .cc-body{padding:28px 28px 24px;display:flex;flex-direction:column;flex:1;position:relative;z-index:1;}
  .cc-tagrow{display:flex;align-items:center;gap:10px;margin-bottom:18px;}
  .cc-icon{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
  .cc-tag{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;}
  .cc-title{font-size:20px;font-weight:800;color:#fff;margin-bottom:10px;line-height:1.25;}
  .cc-text{font-size:13px;color:#71717a;line-height:1.6;flex:1;}
  .cc-pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:20px;}
  .cc-pill{font-size:10px;font-weight:600;padding:3px 9px;border:1px solid;letter-spacing:.06em;}
  .cc-footer{margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;}
  .cc-result{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#3f3f46;}
  .cc-arrow{font-size:18px;line-height:1;}
  .cf-nav{display:flex;align-items:center;justify-content:center;gap:12px;padding:24px 0 16px;flex-shrink:0;}
  .cf-btn{width:44px;height:44px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#a1a1aa;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;transition:border-color .2s,color .2s,transform .15s;}
  .cf-btn:hover{border-color:rgba(255,255,255,.3);color:#fff;}
  .cf-btn:active{transform:scale(.92);}
  .cf-dots{display:flex;align-items:center;gap:8px;}
  .cf-dot{width:6px;height:6px;border-radius:50%;background:#3f3f46;transition:background .3s,transform .3s;cursor:pointer;border:none;padding:0;}
  .cf-dot.active{background:#fff;transform:scale(1.4);}
  .cf-hint{text-align:center;font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#3f3f46;padding-bottom:10px;flex-shrink:0;}
  .cf-active-label{text-align:center;padding:10px 24px 0;flex-shrink:0;}
  .cf-active-name{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#52525b;}
  @media(max-width:768px){
    .portfolio-section{min-height:0;}
    .cover-card{width:270px;min-height:340px;}
    .cf-stage{height:400px;min-height:0;flex:none;}
  }
  @media(min-width:769px) and (max-width:1366px){
    .cover-card{width:300px;min-height:370px;}
    .cf-stage{min-height:390px;}
    .cf-body{padding:20px 20px 18px;}
    .cf-nav{padding:14px 0 10px;}
    .cf-hint{padding-bottom:6px;}
    .cf-active-label{padding:6px 24px 0;}
  }
`

function CoverCard({ project, cardRef }) {
  const color = COLOR[project.color] || "#a1a1aa"
  return (
    <article ref={cardRef} className="cover-card" data-id={project.id}>
      <div className="cc-glow" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%,${color}22,transparent 70%)` }} />
      <div className="cc-strip" style={{ background: color }} />
      <div className="cc-body">
        <div className="cc-tagrow">
          <span className="cc-icon"><CardIcon name={project.icon} color={color} /></span>
          <span className="cc-tag" style={{ color }}>{project.tag}</span>
        </div>
        <h3 className="cc-title">{project.title}</h3>
        <p className="cc-text">{project.text}</p>
        <div className="cc-pills">
          {project.tech.map(t => (
            <span key={t} className="cc-pill" style={{ borderColor: `${color}40`, color }}>{t}</span>
          ))}
        </div>
        <div className="cc-footer">
          <span className="cc-result">{project.result}</span>
          <span className="cc-arrow" style={{ color }}>&#8599;</span>
        </div>
      </div>
    </article>
  )
}

export default function Portfolio() {
  const headRef = useScrollReveal()
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)
  const proxyRef   = useRef({ offset: 0 })
  const cardRefs   = useRef([])
  const [activeIdx, setActiveIdx] = useState(0)

  const N = PROJECTS.length
  const items = [...PROJECTS, ...PROJECTS, ...PROJECTS]
  const ORIGIN = N

  const normalise = useCallback(i => ((i % N) + N) % N, [N])

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    if (!cards.length) return

    const CARD_W  = cards[0].offsetWidth || 340
    const GAP     = 32
    const SPREAD  = CARD_W * 0.72 + GAP * 0.6
    const playhead = proxyRef.current

    const applyFrame = () => {
      const prog = playhead.offset
      cards.forEach((card, i) => {
        let raw = i - ORIGIN - prog
        // wrap raw to [-N/2, N/2)
        raw = ((raw % N) + N + N / 2) % N - N / 2
        const abs  = Math.abs(raw)
        const sc   = Math.max(0.70, 1 - abs * 0.09)
        const op   = Math.max(0.12, 1 - abs * 0.22)
        const z    = -abs * 90
        const x    = raw * SPREAD
        const rotY = raw * -14
        gsap.set(card, {
          x, z,
          rotationY: rotY,
          scale: sc,
          opacity: op,
          zIndex: Math.round(100 - abs * 10),
          transformOrigin: "50% 50% -200px",
        })
      })
      const centred = normalise(Math.round(playhead.offset))
      setActiveIdx(centred)
    }

    gsap.ticker.add(applyFrame)
    applyFrame()



    const drag = Draggable.create(trackRef.current, {
      type: "x",
      onDrag() {
        gsap.to(playhead, {
          offset: playhead.offset - this.deltaX / (CARD_W * 0.5),
          duration: 0.25,
          ease: "none",
          overwrite: true,
        })
        gsap.set(trackRef.current, { x: 0 })
      },
    })[0]

    return () => {
      gsap.ticker.remove(applyFrame)
      drag.kill()
    }
  }, [normalise, N, ORIGIN])

  const navigate = useCallback(dir => {
    const playhead = proxyRef.current
    gsap.to(playhead, {
      offset: playhead.offset + dir,
      duration: 0.7,
      ease: "power3.out",
      overwrite: true,
    })
  }, [])

  return (
    <>
      <style>{STYLES}</style>
      <section id="portfolio" ref={sectionRef} className="portfolio-section scroll-mt-20">

        {/* Header */}
        <div ref={headRef} className="reveal-on-scroll" style={{ padding: "clamp(20px,3.5vw,56px) clamp(20px,4vw,48px) 16px", flexShrink: 0 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p className="sec-label">Our Work</p>
              <h2 style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
                Selected Projects
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 14, color: "#3f3f46", fontWeight: 700 }}>
                &nbsp;/ {String(N).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Active name */}
        <div className="cf-active-label">
          <p className="cf-active-name">{PROJECTS[activeIdx]?.title}</p>
        </div>

        {/* Stage */}
        <div className="cf-stage">
          <div ref={trackRef} className="cf-track">
            {items.map((project, i) => (
              <CoverCard
                key={`${project.id}-${i}`}
                project={project}
                cardRef={el => (cardRefs.current[i] = el)}
              />
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="cf-nav">
          <button className="cf-btn" onClick={() => navigate(-1)} aria-label="Previous">&#8592;</button>
          <div className="cf-dots">
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                className={"cf-dot" + (i === activeIdx ? " active" : "")}
                onClick={() => {
                  const delta = i - normalise(Math.round(proxyRef.current.offset))
                  navigate(delta)
                }}
                aria-label={`Project ${i + 1}`}
              />
            ))}
          </div>
          <button className="cf-btn" onClick={() => navigate(1)} aria-label="Next">&#8594;</button>
        </div>

        <p className="cf-hint">Scroll &middot; Drag &middot; Navigate</p>
      </section>
    </>
  )
}
