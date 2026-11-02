// ============================================================
// Contact form delivery to callybre-backend (hosted on Render).
//
// Render's free tier sleeps after ~15 min idle and takes ~30-60s to
// wake up. To keep the form feeling instant:
//   1. warmUp()       pings /health on page load / form focus so the
//                     server is usually awake before the user hits Send.
//   2. deliver()      runs in the background (the UI shows success right
//                     away), with long timeouts + retries for cold starts.
//   3. pending queue  each message is saved in localStorage until the
//                     server confirms it, and re-sent on the next visit
//                     if the tab was closed before delivery.
//                     (No `keepalive`: some browsers reject it on CORS-preflighted requests.)
// Every message carries an `id`, and the server ignores duplicates, so
// retries never post twice to Slack.
// ============================================================

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')
const CONTACT_URL = `${API_URL}/api/contact`
const HEALTH_URL = `${API_URL}/health`

const PENDING_KEY = 'callybre:pending-contact'
const WARM_EVERY_MS = 5 * 60 * 1000 // don't ping more than once per 5 min
const ATTEMPT_TIMEOUT_MS = 75_000 // a cold start can take up to ~60s
const RETRY_DELAYS_MS = [2_000, 6_000, 15_000] // waits between attempts

let lastWarm = 0

export function warmUp() {
  const now = Date.now()
  if (now - lastWarm < WARM_EVERY_MS) return
  lastWarm = now
  fetch(HEALTH_URL, { cache: 'no-store' }).catch(() => {})
}

export function newMessageId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }
}

// ---- localStorage queue (all access guarded: storage can be blocked) ----
function readPending() {
  try {
    const list = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function writePending(list) {
  try {
    if (list.length) localStorage.setItem(PENDING_KEY, JSON.stringify(list))
    else localStorage.removeItem(PENDING_KEY)
  } catch {
    /* storage unavailable: message still sends from memory */
  }
}

const addPending = (msg) => writePending([...readPending().filter((m) => m.id !== msg.id), msg])
const removePending = (id) => writePending(readPending().filter((m) => m.id !== id))

// ---- sending ----
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// One request. Returns 'ok' | 'retry' | 'fail' (fail = server rejected it, retrying won't help)
async function attempt(msg) {
  try {
    const res = await fetch(CONTACT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    })
    if (res.ok) return 'ok'
    if (res.status >= 500) return 'retry' // waking up / Slack hiccup
    return 'fail' // 400 validation, 429 rate limit, etc.
  } catch {
    return 'retry' // network error or timeout
  }
}

// Sends a message with retries. Resolves to { ok: true } or { ok: false }.
export async function deliver(msg) {
  addPending(msg)
  for (let i = 0; i <= RETRY_DELAYS_MS.length; i++) {
    const result = await attempt(msg)
    if (result === 'ok') {
      removePending(msg.id)
      return { ok: true }
    }
    if (result === 'fail') {
      removePending(msg.id)
      return { ok: false }
    }
    if (i < RETRY_DELAYS_MS.length) await sleep(RETRY_DELAYS_MS[i])
  }
  // Still unreachable: leave it in the queue for the next visit
  return { ok: false }
}

// Re-send anything left over from a previous visit (fire and forget)
export function flushPending() {
  readPending().forEach((msg) => {
    deliver(msg).catch(() => {})
  })
}
