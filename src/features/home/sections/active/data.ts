import { ServiceRow, ProjectCard, Testimonial, FaqItem } from './types';

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

/** How many file slots the Work section shows. Slots without a project render as "incoming" until one is added. */
export const MAX_PROJECT_SLOTS = 5;

// To add a project: append an entry here. It takes the next free slot automatically.
export const PROJECTS: ProjectCard[] = [
  {
    id: 'edna',
    title: 'Oceanography AI',
    subtitle: 'eDNA biodiversity pipeline',
    category: 'AI × Marine science',
    summary: 'An AI-driven pipeline for identifying deep-sea biodiversity from eDNA sequencing data.',
    tags: ['eDNA sequencing', 'Deep-sea biodiversity', 'AI pipeline', 'DNA barcoding'],
    readout: [
      ['Input', 'eDNA sequencing data'],
      ['Method', 'AI-driven pipeline'],
      ['Output', 'Deep-sea species identification'],
    ],
    image: {
      src: encodeURI('/project_images/Ai pipeline eDNA..png'),
      width: 1898,
      height: 872,
      alt: 'The eDNA platform: identifying species through DNA barcodes, with a DNA prediction panel.',
    },
    theme: 'ocean',
  },
  {
    id: 'tars',
    title: 'TARS',
    subtitle: 'Local LLM Augmentation & Retrieval System',
    category: 'Local AI × Orchestration',
    summary:
      'A fine-tuned orchestration layer. Connect a local LLM to it and the model takes on the voice of TARS from Interstellar, the robot famous for its sarcastic way of speaking.',
    tags: ['Local LLM', 'Retrieval (RAG)', 'Orchestration', 'Persona tuning'],
    readout: [
      ['Core', 'Fine-tuned orchestration'],
      ['Connects to', 'A local LLM'],
      ['Voice', 'TARS, sarcasm included'],
    ],
    image: {
      src: encodeURI('/project_images/The TARS profile.png'),
      width: 1469,
      height: 880,
      alt: 'The TARS interface: a personality matrix with humor, honesty and discretion controls, and a command line.',
    },
    theme: 'terminal',
  },
];
