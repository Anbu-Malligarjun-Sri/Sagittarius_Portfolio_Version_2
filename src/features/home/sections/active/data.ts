import { ServiceRow, ProjectCard, TeamMember, Testimonial, FaqItem } from './types';

export const NAV_ITEMS = [
  { id: 'about' as const, label: 'About Us' },
  { id: 'services' as const, label: 'Services' },
  { id: 'projects' as const, label: 'Work' },
  { id: 'team' as const, label: 'Team' },
  { id: 'contact' as const, label: 'Contact' },
];

export const SERVICES: ServiceRow[] = [
  { name: 'UI/UX Design', category: 'Design', timeline: '2-4 wks', status: 'AVAILABLE', description: 'Design systems, product stories, and conversion-focused interface work.' },
  { name: 'Web Development', category: 'Engineering', timeline: '4-8 wks', status: 'AVAILABLE', description: 'Next.js builds, motion systems, and resilient frontend architecture.' },
  { name: 'Mobile Apps', category: 'Engineering', timeline: '6-12 wks', status: 'AVAILABLE', description: 'iOS and Android experiences tuned for fast iteration and launch readiness.' },
  { name: 'Brand Identity', category: 'Design', timeline: '2-3 wks', status: 'LIMITED', description: 'Naming, visual identity, and launch-ready art direction for new products.' },
  { name: 'AI Integration', category: 'Engineering', timeline: '4-6 wks', status: 'BOOKING', description: 'Workflow automation, assistant surfaces, and practical model integration.' },
  { name: 'Consulting', category: 'Strategy', timeline: '1 wk', status: 'AVAILABLE', description: 'Decision support for founders, product leads, and early engineering teams.' },
];

export const TEAM: TeamMember[] = [
  { name: 'Mina Sol', title: 'Founding designer', department: 'Design', color: '#4a90d9' },
  { name: 'Rowan Vale', title: 'Engineering lead', department: 'Engineering', color: '#e8c547' },
  { name: 'Tamsin Roe', title: 'Product strategist', department: 'Marketing', color: '#e85d24' },
  { name: 'Ivo Mercer', title: 'Operations', department: 'Leadership', color: '#2ecc71' },
  { name: 'Ari Nox', title: 'Motion systems', department: 'Engineering', color: '#4a90d9' },
  { name: 'Elio Finch', title: 'Research', department: 'Design', color: '#e8c547' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'They turned a messy, technical product into something our sales team could actually explain in a meeting.',
    name: 'Rhea Beaumont',
    title: 'CEO',
    company: 'Cinder Lane',
    tint: '#e8c547',
  },
  {
    quote: 'The handoff felt unusually calm. We got clear decisions, sharp writing, and no drift between screens.',
    name: 'Nico Hart',
    title: 'Product Director',
    company: 'Northglass',
    tint: '#4a90d9',
  },
  {
    quote: 'We went from feature bloat to a product that had one obvious job and did it well.',
    name: 'Mateo Voss',
    title: 'Founder',
    company: 'Relay Forge',
    tint: '#2ecc71',
  },
  {
    quote: 'Their launch system reduced the amount of back-and-forth we needed to close the project.',
    name: 'Sana Leclerc',
    title: 'COO',
    company: 'Cobalt Relay',
    tint: '#e85d24',
  },
];

export const FAQS: FaqItem[] = [
  { question: 'How do we start a project?', answer: 'We begin with a short discovery sprint, then shape the scope into a plan that can be built and measured.', category: 'PROCESS' },
  { question: 'What is your process?', answer: 'We move through discovery, strategy, build, launch, and a short post-launch tuning window.', category: 'PROCESS' },
  { question: 'How long does a typical project take?', answer: 'Most design-to-build engagements land between three and eight weeks depending on scope.', category: 'TIMELINE' },
  { question: 'Do you work with early-stage startups?', answer: 'Yes. We can work from rough clarity, prototype direction, or an existing product that needs a sharper system.', category: 'SCOPE' },
  { question: 'What technologies do you use?', answer: 'This site is built with Next.js, React, TypeScript, Tailwind, and GSAP for the motion layer.', category: 'TECH' },
  { question: 'How do you handle revisions?', answer: 'We keep revisions bounded by checkpoints so the team stays aligned without turning every choice into a loop.', category: 'PROCESS' },
  { question: 'Do you offer maintenance and support?', answer: 'Yes. We can continue with support, monitoring, and structured iterations after launch.', category: 'SUPPORT' },
  { question: 'What are your payment terms?', answer: 'Projects begin with a deposit, then move through milestone-based payments tied to approved deliverables.', category: 'BILLING' },
];

export const PRICING = [
  {
    name: 'Starter',
    price: '$499/mo',
    details: ['5 projects', 'Email support', 'One monthly strategy call'],
    popular: false,
  },
  {
    name: 'Studio',
    price: '$999/mo',
    details: ['20 projects', 'Priority support', 'Weekly review sessions'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    details: ['Unlimited scope', 'Dedicated team', 'White-glove support'],
    popular: false,
  },
];

export const GAUGES = [
  { label: 'Projects completed', value: 85, display: '200+' },
  { label: 'Client satisfaction', value: 98, display: '98%' },
  { label: 'Years experience', value: 65, display: '12+' },
  { label: 'Countries served', value: 40, display: '40+' },
];

function makePoster(seed: string, accent: string, foreground: string, background: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#111111" />
        </linearGradient>
      </defs>
      <rect width="720" height="540" fill="url(#g)"/>
      <rect x="24" y="24" width="672" height="492" rx="24" fill="none" stroke="${accent}" stroke-width="2" opacity="0.8"/>
      <circle cx="120" cy="118" r="52" fill="${accent}" opacity="0.9"/>
      <path d="M122 246 L602 132" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
      <path d="M78 420 C180 360, 274 448, 372 386 S604 330, 648 420" fill="none" stroke="${foreground}" stroke-width="2" opacity="0.8"/>
      <text x="48" y="470" fill="${foreground}" font-family="Arial, sans-serif" font-size="54" font-weight="700">${seed}</text>
      <text x="48" y="512" fill="${foreground}" font-family="Arial, sans-serif" font-size="16" opacity="0.7">Premium startup systems</text>
    </svg>
  `)}`;
}

export const PROJECTS: ProjectCard[] = [
  {
    title: 'Sagittarius portfolio site',
    category: 'Frontend',
    body: "The homepage you are reading now. Built as proof of the studio's motion system, typography stack, and editorial layout discipline.",
    tags: ['Next.js', 'GSAP', 'Design system'],
    image: makePoster('Sagittarius', '#e8c547', '#f5f0e8', '#1a1208'),
  },
  {
    title: 'Zenith de-extinction engine',
    category: 'WebGL',
    body: 'A reactive specimen viewer with bone animation, HUD overlays, and a procedural scene that treats the lab as a product.',
    tags: ['Three.js', 'HUD', 'Simulation'],
    image: makePoster('Zenith', '#4a90d9', '#f5f0e8', '#0a0a0a'),
  },
  {
    title: 'Sagittarius LLM',
    category: 'AI systems',
    body: 'A dual-module assistant stack with organizer routing, research mode, and a practical response layer for day-to-day use.',
    tags: ['RAG', 'Routing', 'Automation'],
    image: makePoster('LLM', '#e85d24', '#f5f0e8', '#21150c'),
  },
  {
    title: 'EDITH AR system',
    category: 'Hardware',
    body: 'An augmented-reality prototype that pairs Raspberry Pi hardware, overlay logic, and a lightweight field interface.',
    tags: ['Raspberry Pi', 'AR', 'Vision'],
    image: makePoster('EDITH', '#2ecc71', '#f5f0e8', '#10190f'),
  },
  {
    title: 'Sagittarix',
    category: 'Education',
    body: "A STEM initiative focused on curriculum design, systems thinking, and making technical ideas usable for younger builders.",
    tags: ['Curriculum', 'Community'],
    image: makePoster('X', '#e8c547', '#f5f0e8', '#17120a'),
  },
];

export function makeAvatar(seed: string, accent: string, label: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#111111" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="24" fill="url(#g)"/>
      <circle cx="128" cy="96" r="42" fill="#f5f0e8" opacity="0.92"/>
      <path d="M66 208c12-30 34-48 62-48s50 18 62 48" fill="#f5f0e8" opacity="0.92"/>
      <text x="24" y="232" fill="#f5f0e8" font-family="Arial, sans-serif" font-size="24" font-weight="700">${label}</text>
      <text x="24" y="30" fill="#f5f0e8" font-family="Arial, sans-serif" font-size="12" opacity="0.7">${seed}</text>
    </svg>
  `)}`;
}
