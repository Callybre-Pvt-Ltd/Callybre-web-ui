// ============================================================
// ALL website content lives here. Edit text/numbers in this file
// and the sections update automatically.
//
// IMPORTANT: Everything marked PLACEHOLDER below (stats, projects,
// testimonials, contact details) is sample content so the design looks
// complete. Replace it with your real information before going live.
// ============================================================

// PLACEHOLDER contact details
export const CONTACT = {
  email: 'hello@callybre.com',
  phone: '+91 00000 00000',
  location: 'Delhi, India',
  hours: 'Mon - Sat, 10:00 AM - 7:00 PM IST',
}

export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#about', label: 'About Us' },
  { href: '#faq', label: 'FAQ' },
]

// PLACEHOLDER numbers - replace with real ones
export const STATS = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 30, suffix: '+', label: 'Happy Clients' },
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 98, suffix: '%', label: 'Client Retention' },
]

export const WHY_US = [
  {
    icon: 'webdev',
    color: 'purple',
    title: 'Clean, Scalable Code',
    text: 'Modern stacks, tested builds and documentation, so your product keeps growing without rewrites.',
  },
  {
    icon: 'rocket',
    color: 'blue',
    title: 'Fast Delivery',
    text: 'Short sprints with working demos every week. You see progress early, not at the end.',
  },
  {
    icon: 'shield',
    color: 'emerald',
    title: 'Security First',
    text: 'Authentication, data protection and safe deployment are built in from day one.',
  },
  {
    icon: 'ai',
    color: 'indigo',
    title: 'AI-Ready Solutions',
    text: 'We add automation and AI where it saves real time and money, not just as a buzzword.',
  },
  {
    icon: 'seo',
    color: 'amber',
    title: 'Built To Be Found',
    text: 'SEO, speed and analytics are part of every build, so traffic and conversions follow.',
  },
  {
    icon: 'users',
    color: 'rose',
    title: 'Dedicated Support',
    text: 'One point of contact and post-launch support, so you are never left alone with a bug.',
  },
]

export const PORTFOLIO_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'ai', label: 'AI' },
  { id: 'marketing', label: 'Marketing' },
]

// PLACEHOLDER projects - replace with your real case studies
export const PROJECTS = [
  {
    id: 'p1',
    category: 'web',
    color: 'purple',
    icon: 'webdev',
    tag: 'Web Platform',
    title: 'Retail Commerce Portal',
    text: 'A fast, SEO-friendly online store with payments, inventory sync and an admin dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    result: 'Sample result: 2x faster checkout',
  },
  {
    id: 'p2',
    category: 'mobile',
    color: 'blue',
    icon: 'mobile',
    tag: 'Mobile App',
    title: 'Fleet Tracking App',
    text: 'Cross-platform app for live vehicle tracking, driver check-ins and trip reports.',
    tech: ['React Native', 'AWS', 'MongoDB'],
    result: 'Sample result: live updates every 5s',
  },
  {
    id: 'p3',
    category: 'ai',
    color: 'indigo',
    icon: 'ai',
    tag: 'AI Automation',
    title: 'Support Workflow Bot',
    text: 'Automates ticket sorting, first replies and report generation for a support team.',
    tech: ['Python', 'LLM APIs', 'n8n'],
    result: 'Sample result: 60% fewer manual tasks',
  },
  {
    id: 'p4',
    category: 'marketing',
    color: 'rose',
    icon: 'video',
    tag: 'Video Production',
    title: 'Showroom Reel Campaign',
    text: 'High-retention reels for vehicle deliveries and inaugurations, shot and edited end to end.',
    tech: ['Reels', 'Shoot', 'Edit'],
    result: 'Sample result: 3x more reach',
  },
  {
    id: 'p5',
    category: 'marketing',
    color: 'amber',
    icon: 'seo',
    tag: 'SEO / AEO',
    title: 'Local Search Growth',
    text: 'Search and AI-answer optimization that moves a local business to the top of results.',
    tech: ['SEO', 'AEO', 'Analytics'],
    result: 'Sample result: top 3 ranking',
  },
  {
    id: 'p6',
    category: 'web',
    color: 'emerald',
    icon: 'shield',
    tag: 'Security',
    title: 'Secure Client Dashboard',
    text: 'Role-based dashboard with audit logs, encrypted data and hardened deployment.',
    tech: ['Next.js', 'Auth', 'Kubernetes'],
    result: 'Sample result: zero critical findings',
  },
]

export const VALUES = [
  { icon: 'check', title: 'Transparency', text: 'Clear scope, clear pricing and honest timelines.' },
  { icon: 'rocket', title: 'Speed With Quality', text: 'We move fast but never ship what we would not use.' },
  { icon: 'users', title: 'Partnership', text: 'We act like part of your team, not an outside vendor.' },
  { icon: 'shield', title: 'Ownership', text: 'You own your code, your data and your accounts. Always.' },
]

// PLACEHOLDER testimonials - replace with real client feedback (with permission)
export const TESTIMONIALS = [
  {
    quote:
      'Sample testimonial: The team understood our business quickly and delivered a site that actually brings in enquiries.',
    name: 'Client Name',
    role: 'Founder, Company',
  },
  {
    quote:
      'Sample testimonial: Clear communication, weekly demos and zero surprises on the final invoice.',
    name: 'Client Name',
    role: 'Operations Head, Company',
  },
  {
    quote:
      'Sample testimonial: The automation they built saves our team hours every single week.',
    name: 'Client Name',
    role: 'Director, Company',
  },
]

export const FAQS = [
  {
    q: 'How long does a typical website take?',
    a: 'A standard 5-7 page business site usually takes 2 to 4 weeks, depending on content readiness and revisions. Larger web apps are planned in phases.',
  },
  {
    q: 'Do you work with small businesses and startups?',
    a: 'Yes. Our Starter packages are designed for small businesses, and we scale up to custom enterprise builds when you grow.',
  },
  {
    q: 'Will I own the code and the website?',
    a: 'Absolutely. Once the project is delivered and paid for, the code, design files and accounts belong to you.',
  },
  {
    q: 'Do you provide support after launch?',
    a: 'Yes. Every project includes a support window after launch, and ongoing maintenance plans are available.',
  },
  {
    q: 'Can you handle both the tech and the marketing?',
    a: 'That is exactly our model. IT consulting and digital marketing under one roof, so your website, SEO and content work together.',
  },
  {
    q: 'How do we get started?',
    a: 'Book a free consultation or send a message through the contact form. We will reply with next steps and a rough estimate.',
  },
]

export const FOOTER_COLUMNS = [
  {
    title: 'IT Consulting',
    links: ['Web Development', 'Mobile App Dev', 'AI Automation', 'Cyber Security'],
  },
  {
    title: 'Digital Marketing',
    links: ['Video Shoot', 'SEO, AEO, GEO', 'Social Media', 'Brand Strategy'],
  },
]

export const SERVICE_OPTIONS = [
  'Web Development',
  'Mobile App Dev',
  'AI Automation',
  'Cyber Security',
  'Video Shoot',
  'SEO, AEO, GEO',
  'Something else',
]
