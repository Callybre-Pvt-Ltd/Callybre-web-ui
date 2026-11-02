// ============================================================
// CONTACT DETAILS — edit this file to change phone, location,
// email, form labels or the contact section copy anywhere on
// the site (contact section, footer, etc.).
// ============================================================

export const CONTACT = {
  phone: '+91 91311 59342',
  phoneHref: 'tel:+919131159342',
  location: 'Bhopal, India',
  email: 'business@callybre.com',
}

// Copy shown next to the contact form
export const CONTACT_COPY = {
  titleTop: 'Contact',
  titleBottom: 'Us',
  intro:
    'Tell us what you are building. Share a few details and we will get back to you with next steps and a rough estimate.',
  submitLabel: 'Send Message',
  successTitle: 'Message received.',
  successText: 'Thanks for reaching out — we will get back to you shortly.',
}

// Labels for the bottom info strip of the contact section
export const CONTACT_STRIP = {
  phoneLabel: 'Call us',
  locationLabel: 'Based in',
  emailLabel: 'Write to us',
}

// Options in the "Service" dropdown of the contact form
export const SERVICE_OPTIONS = [
  'Web Development',
  'Mobile App Dev',
  'AI Automation',
  'Video Shoot',
  'SEO, AEO, GEO',
  'Just Want to Chat ??',
]

// Fired by other sections (e.g. service rows) to pre-select a service in the form
export const SELECT_SERVICE_EVENT = 'callybre:select-service'
