// ============================================================
// ALL website content lives here. Edit text/numbers in this file
// and the sections update automatically.
// ============================================================

// Contact details (phone, location, email) live in ./contact.js

export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#about', label: 'About Us' },
  { href: '#faq', label: 'FAQ' },
]

// Stats strip numbers. The <Stats /> section is currently hidden in App.jsx;
// put real numbers here and re-add it there to show it again.
export const STATS = [
  { value: 15, suffix: '+', label: 'Projects Delivered' },
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

// Real client projects shown in the "Selected Projects" carousel
export const PROJECTS = [
  {
    id: 'kk-techtherm',
    category: 'mobile',
    color: 'blue',
    icon: 'mobile',
    tag: 'Web + Mobile App',
    title: 'KK TechTherm',
    text: "One app to run their construction sites. Admins, managers and site engineers handle attendance, salaries and salary slips, inventory, expenses, billing and POs, and add or manage sites from the same place.",
    tech: ['Attendance & Payroll', 'Inventory', 'Billing & POs', 'Site Management'],
    result: 'Construction site management',
  },
  {
    id: 'drivers-welfare',
    category: 'web',
    color: 'emerald',
    icon: 'webdev',
    tag: 'Website',
    title: 'All Drivers Welfare Association',
    text: "A website for an association that works for drivers all over Madhya Pradesh, so drivers and their families can see what it does and get in touch.",
    tech: ['Website', 'Non-profit', 'Madhya Pradesh'],
    result: 'Working for drivers across MP',
  },
  {
    id: 'eventok',
    category: 'web',
    color: 'purple',
    icon: 'webdev',
    tag: 'Web + Mobile App',
    title: 'EventOK',
    text: "An event marketplace. Vendors open their own store and list their services, customers book them online and pay an advance upfront. The admin and vendors each get their own panel to manage everything.",
    tech: ['Vendor Stores', 'Online Booking', 'Advance Payments', 'Admin & Vendor Panels'],
    result: 'Event booking marketplace',
  },
  {
    id: 'health-shift',
    category: 'marketing',
    color: 'rose',
    icon: 'social',
    tag: 'Digital Marketing',
    title: 'Health Shift',
    text: "We handle Health Shift's digital marketing and run their social media handles, from planning what goes out to posting it and keeping the pages active.",
    tech: ['Social Media', 'Content', 'Digital Marketing'],
    result: 'Social media management',
  },
]

export const VALUES = [
  { icon: 'check', title: 'Transparency', text: 'Clear scope, clear pricing and honest timelines.' },
  { icon: 'rocket', title: 'Speed With Quality', text: 'We move fast but never ship what we would not use.' },
  { icon: 'users', title: 'Partnership', text: 'We act like part of your team, not an outside vendor.' },
  { icon: 'shield', title: 'Ownership', text: 'You own your code, your data and your accounts. Always.' },
]

// Client testimonials. Note: quotes are rendered as HTML, so avoid "&", "<" and ">" in them.
export const TESTIMONIALS = [
  {
    quote:
      "Running several sites meant chasing numbers from everyone. Now attendance, salaries, stock and bills are all in one app, and the team really understood how a site works.",
    name: 'Vaibhav Prajapati',
    role: 'KK TechTherm',
  },
  {
    quote:
      "Our association finally has a proper website. Drivers can see what we do and reach us easily. The team was patient with every change we asked for.",
    name: 'Subhash Wakoday',
    role: 'Member, All Drivers Welfare Association',
  },
  {
    quote:
      "They built all of EventOK for us: vendor stores, bookings, advance payments and both panels. Whenever we needed something changed, they sorted it quickly.",
    name: 'Ankit',
    role: 'EventOK',
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
