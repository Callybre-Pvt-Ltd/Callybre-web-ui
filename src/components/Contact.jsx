import { useEffect, useRef, useState } from 'react'
import {
  CONTACT,
  CONTACT_COPY,
  CONTACT_STRIP,
  SERVICE_OPTIONS,
  SELECT_SERVICE_EVENT,
} from '../data/contact.js'
import Reveal from './Reveal.jsx'
import ServiceSelect from './ServiceSelect.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import { deliver, flushPending, newMessageId, warmUp } from '../lib/contactApi.js'

const EMPTY_FORM ={ name: '', email: '', phone: '', service: '', message: '' }

// Floating-label underline field (label sits in the field, lifts on focus / when filled)
function Field({ id, label, type = 'text', value, onChange, required, textarea, error }) {
  const shared = {
    id,
    name: id,
    value,
    onChange,
    required,
    placeholder: ' ',
    'aria-invalid': error ? 'true' : undefined,
    className:
      'peer block w-full bg-transparent border-0 border-b border-white/[0.18] px-0 pt-6 pb-2.5 text-[14px] text-white outline-none transition-colors focus:border-white placeholder-transparent resize-none',
  }

  return (
    <div className="relative">
      {textarea ? <textarea rows={3} {...shared} /> : <input type={type} {...shared} />}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-1 text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500 transition-all duration-200
          peer-placeholder-shown:top-6 peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-zinc-400
          peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-[0.18em] peer-focus:uppercase peer-focus:text-zinc-300"
      >
        {label}{required ? '' : ' (optional)'}
      </label>
      {error && <p className="mt-1.5 text-[11px] text-rose-400">{error}</p>}
    </div>
  )
}

function mailtoFor(msg) {
  const subject = `Website enquiry from ${msg.name}`
  const lines = [`Name: ${msg.name}`, `Email: ${msg.email}`]
  if (msg.phone) lines.push(`Phone: ${msg.phone}`)
  if (msg.service) lines.push(`Service: ${msg.service}`)
  const body = [...lines, '', msg.message].join('\n')
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  // 'sending' | 'delivered' | 'failed' — delivery runs in the background after the success screen shows
  const [delivery, setDelivery] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const [honeypot, setHoneypot] = useState('')
  const currentIdRef = useRef(null)

  // Wake the backend early (Render free tier sleeps) + resend anything left from a previous visit
  useEffect(() => {
    warmUp()
    flushPending()
  }, [])

  // Service rows elsewhere on the page can pre-select a service here
  useEffect(() => {
    const onSelect = (e) => {
      if (SERVICE_OPTIONS.includes(e.detail)) {
        setForm((f) => ({ ...f, service: e.detail }))
        setSent(false)
      }
    }
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect)
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect)
  }, [])

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!form.name.trim()) er.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'Please enter a valid email.'
    if (!form.message.trim()) er.message = 'Tell us a little about your project.'
    return er
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return

    const msg = { ...form, website: honeypot, id: newMessageId() }
    currentIdRef.current = msg.id

    // Show success immediately; the actual send happens in the background
    setLastMessage(msg)
    setDelivery('sending')
    setSent(true)
    setForm(EMPTY_FORM)

    deliver(msg).then(({ ok }) => {
      if (currentIdRef.current === msg.id) setDelivery(ok ? 'delivered' : 'failed')
    })
  }

  const reset = () => {
    currentIdRef.current = null
    setDelivery(null)
    setSent(false)
  }

  if (sent && delivery === 'failed' && lastMessage) {
    return (
      <div className="flex flex-col items-start justify-center min-h-[360px]">
        <div className="w-11 h-11 flex items-center justify-center border border-amber-400/30 bg-amber-400/10 text-amber-400 mb-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8v5M12 16.5v.5" /><circle cx="12" cy="12" r="9" /></svg>
        </div>
        <h3 className="text-2xl font-black tracking-tight text-white">{CONTACT_COPY.failedTitle}</h3>
        <p className="mt-3 text-[14px] text-zinc-400 leading-relaxed max-w-sm">{CONTACT_COPY.failedText}</p>
        <a
          href={mailtoFor(lastMessage)}
          className="mt-8 inline-flex items-center border border-white/20 px-5 py-3 text-[11px] font-bold tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-colors"
        >
          Email it instead →
        </a>
        <button
          type="button"
          onClick={reset}
          className="mt-5 text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors"
        >
          Back to form
        </button>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start justify-center min-h-[360px]">
        <div className="w-11 h-11 flex items-center justify-center border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 mb-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 className="text-2xl font-black tracking-tight text-white">{CONTACT_COPY.successTitle}</h3>
        <p className="mt-3 text-[14px] text-zinc-400 leading-relaxed max-w-sm">{CONTACT_COPY.successText}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors"
        >
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} onFocus={warmUp} noValidate className="space-y-7">
      <Field id="name" label="Your Name" value={form.name} onChange={update('name')} required error={errors.name} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <Field id="email" type="email" label="Your Email" value={form.email} onChange={update('email')} required error={errors.email} />
        <Field id="phone" type="tel" label="Phone" value={form.phone} onChange={update('phone')} />
      </div>

      <ServiceSelect
        name="service"
        label="Service"
        placeholder="What do you need help with?"
        options={SERVICE_OPTIONS}
        value={form.service}
        onChange={(service) => setForm((f) => ({ ...f, service }))}
      />

      <Field id="message" label="Share your thoughts" value={form.message} onChange={update('message')} required textarea error={errors.message} />

      {/* Honeypot — hidden from humans, bots fill it in */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />

      <div className="pt-4">
        <button type="submit" className="contact-glitch-btn">
          {CONTACT_COPY.submitLabel}
        </button>
      </div>
    </form>
  )
}

function ContactTitle() {
  return (
    <div className="relative">
      {/* Organic outline blob behind the title */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -left-10 -top-16 w-[min(440px,110%)] h-auto text-white/[0.14]"
        fill="none"
      >
        <path
          d="M118 62c46-34 132-40 186 2 52 41 70 128 52 196-17 66-71 117-136 116-62-1-104-48-140-96C44 230 20 180 34 136c13-40 45-46 84-74z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <h2
        className="relative font-black tracking-[-0.03em] text-white leading-[0.92] contact-chroma"
        style={{ fontSize: 'clamp(3.2rem, 7vw, 6rem)' }}
      >
        <span className="block">{CONTACT_COPY.titleTop}</span>
        <span className="flex items-center gap-5">
          <span aria-hidden="true" className="block h-[3px] w-[clamp(3rem,8vw,7rem)] bg-white contact-chroma-line" />
          {CONTACT_COPY.titleBottom}
        </span>
      </h2>

      <p className="relative mt-10 max-w-[340px] text-[14px] text-zinc-400 leading-relaxed">
        {CONTACT_COPY.intro}
      </p>
    </div>
  )
}

export default function Contact() {
  const headRef = useScrollReveal()

  const strip = [
    { label: CONTACT_STRIP.phoneLabel, value: CONTACT.phone, href: CONTACT.phoneHref },
    { label: CONTACT_STRIP.locationLabel, value: CONTACT.location },
    { label: CONTACT_STRIP.emailLabel, value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  ]

  return (
    <section id="contact" className="scroll-mt-20 bg-[#0a0a0a] border-t border-white/[0.06] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-12">
        <div ref={headRef} className="reveal-on-scroll mb-8 md:mb-10">
          <p className="sec-label">Contact</p>
        </div>

        <Reveal>
          <div className="border border-white/[0.08] bg-[#0d0d0d]">
            {/* Main area: form + title */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Title — first on mobile, right on desktop */}
              <div className="order-1 md:order-2 px-6 sm:px-10 lg:px-16 pt-14 pb-10 md:py-20 flex items-center md:border-l border-white/[0.08] overflow-hidden">
                <ContactTitle />
              </div>

              {/* Form */}
              <div className="order-2 md:order-1 px-6 sm:px-10 lg:px-16 pb-14 pt-4 md:py-20 border-t md:border-t-0 border-white/[0.08]">
                <div className="max-w-md">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Info strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/[0.08]">
              {strip.map((item, i) => (
                <div
                  key={item.label}
                  className={`px-6 py-5 text-center ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-white/[0.08]' : ''}`}
                >
                  <div className="text-[9px] font-bold tracking-[0.22em] uppercase text-zinc-500 mb-1.5">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="text-[13px] font-semibold text-zinc-200 hover:text-white transition-colors break-all">
                      {item.value}
                    </a>
                  ) : (
                    <div className="text-[13px] font-semibold text-zinc-200">{item.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
