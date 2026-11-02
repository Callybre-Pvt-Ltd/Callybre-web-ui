# Callybre — React Version

Original single-file HTML/CSS/JS landing page converted into a component-based
React app (Vite + Tailwind CSS). Same visuals, same animations — now easy to
extend one component at a time.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Folder structure

```
src/
  components/
    Icon.jsx            # all SVG icon paths in one place
    Preloader.jsx        # C-A-L-L-Y-B-R-E intro animation
    Navbar.jsx
    Hero.jsx
    TechMarquee.jsx       # scrolling tech-stack strip
    ServicesSection.jsx   # IT/DM tab toggle + horizontal carousel
    ServiceCard.jsx        # single service card (used by ServicesSection)
    Stats.jsx              # animated counters strip
    WhyUs.jsx              # 6 feature cards
    Methodology.jsx        # 5-step timeline
    Portfolio.jsx          # filterable project grid
    About.jsx              # story + values
    Testimonials.jsx
    FAQ.jsx                # accordion
    CTABanner.jsx
    Contact.jsx            # validated form, POSTs to callybre-backend (VITE_API_URL) -> Slack
    Footer.jsx
    Reveal.jsx / SectionHeading.jsx   # small reusable helpers
    TimelineStep.jsx        # single timeline step (used by Methodology)
    Modal.jsx               # generic sharp-edged modal shell
    modals/
      WebDevModal.jsx        # pricing modal for Web Development card
      VideoModal.jsx          # pricing modal for Video Shoot card
  context/
    ModalContext.jsx     # tracks which modal (if any) is open, app-wide
  hooks/
    useScrollReveal.js   # IntersectionObserver -> adds .is-visible class
    useEscapeToClose.js  # closes active modal on Esc key
  data/
    site.js              # ALL page text: stats, projects, testimonials, FAQ, contact info (PLACEHOLDERS - replace!)
    services.js          # IT + Digital Marketing service list, color themes, timeline steps
    techStack.js          # marquee items
  index.css               # Tailwind + all custom animation CSS
  main.jsx
  App.jsx                  # composes everything together
index.html
tailwind.config.js
postcss.config.js
vite.config.js
package.json
```

## How to add a new service card

Open `src/data/services.js` and add an object to `itServices` or `dmServices`:

```js
{
  id: 'newThing',
  title: 'New Thing',
  color: 'blue',        // must be a key that exists in `themes`
  icon: 'mobile',        // must be a key that exists in src/components/Icon.jsx
  description: '...',
  modalId: null,          // or 'someModalId' if it should open a modal
}
```

If it needs its own pricing modal, copy `src/components/modals/VideoModal.jsx`
as a starting point, give it a new `id`, and render it inside
`ModalsLayer` in `App.jsx`.

## Notes

- Colors are intentionally spelled out as full Tailwind class names (in
  `src/data/services.js`) instead of built dynamically with
  `` `text-${color}-500` `` — Tailwind's JIT scanner only keeps classes it can
  see literally in your source files, so dynamic strings would get dropped
  from the production build.
- Browser localStorage/sessionStorage isn't used anywhere; all UI state
  (active tab, open modal, preloader) lives in React state/context.
