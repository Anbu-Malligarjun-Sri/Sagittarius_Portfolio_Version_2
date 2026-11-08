import { SERVICES } from '@/features/home/sections/active/data';
import type { ServiceRow } from '@/features/home/sections/active/types';

export type StampMotif = 'ui' | 'web' | 'mobile' | 'brand' | 'ai' | 'advice';

type StampExtras = {
  id: string;
  /** The stamp's main ink colour (used for its printed text). */
  ink: string;
  /** A lighter accent used for the glow behind the stamp. */
  glow: string;
  motif: StampMotif;
  /** The slight tilt the stamp rests at in the album, in degrees. */
  rest: number;
  tagline: string;
  story: string;
  includes: string[];
  how: string;
};

// Extra copy for each service, keyed by the service name in `data.ts` so the rows there stay the single source of truth.
const EXTRAS: Record<string, StampExtras> = {
  'UI/UX Design': {
    id: 'ui-ux',
    ink: '#b8432a',
    glow: '#f2a53b',
    motif: 'ui',
    rest: -2.2,
    tagline: 'Interfaces people understand on the first try.',
    story:
      'We start from what the person using the product is trying to get done, then draw the flows, the screens and the system that holds them together. What you get is a design a developer can build without guessing.',
    includes: ['User flows and wireframes', 'A component-based design system', 'A clickable prototype', 'Developer-ready handoff files'],
    how: 'Short design sprints, with a review at the end of each one.',
  },
  'Web Development': {
    id: 'web',
    ink: '#1e5a40',
    glow: '#5aa77a',
    motif: 'web',
    rest: 1.6,
    tagline: 'Fast, resilient sites that are easy to change.',
    story:
      'We build with Next.js and TypeScript, and treat motion as part of the architecture rather than a coat of paint. Pages stay quick and accessible, and your team can keep extending them after we leave.',
    includes: ['Next.js and TypeScript build', 'Motion and interaction layer', 'Accessibility and performance pass', 'Deployment and handover notes'],
    how: 'Working builds you can click through, not status reports.',
  },
  'Mobile Apps': {
    id: 'mobile',
    ink: '#1c1b4d',
    glow: '#9b8cff',
    motif: 'mobile',
    rest: -1,
    tagline: 'iOS and Android, ready for launch day.',
    story:
      "We shape the app around a small first release you can put in people's hands quickly, then iterate on what they actually do. Store submission and launch readiness are part of the job, not an afterthought.",
    includes: ['Product scope and screen map', 'iOS and Android builds', 'Store submission support', 'A plan for the first update'],
    how: 'Ship a thin version early, then widen it.',
  },
  'Brand Identity': {
    id: 'brand',
    ink: '#4b1d5f',
    glow: '#d8aa52',
    motif: 'brand',
    rest: 2.4,
    tagline: 'A name and a look that belong to you.',
    story:
      'Naming, logo, colour, type and the rules for using them, drawn together so a new product looks like itself from its first screen to its first poster.',
    includes: ['Naming and positioning', 'Logo and visual identity', 'Colour, type and usage rules', 'Launch art direction'],
    how: 'Directions first, then one refined together with you.',
  },
  'AI Integration': {
    id: 'ai',
    ink: '#14243d',
    glow: '#f4b13d',
    motif: 'ai',
    rest: -1.8,
    tagline: 'Practical models, wired into real workflows.',
    story:
      'We find the repeated, slow step in your workflow and put a model to work on it: an assistant surface, an automation, a retrieval layer. Useful first, impressive second.',
    includes: ['Workflow audit', 'Assistant or automation build', 'Model and data integration', 'Guardrails and a way to measure it'],
    how: 'Start with one workflow and prove it before widening.',
  },
  Consulting: {
    id: 'consulting',
    ink: '#14575a',
    glow: '#e0a73a',
    motif: 'advice',
    rest: 1.2,
    tagline: 'A week of clear thinking before you commit.',
    story:
      'A focused week with founders, product leads and early engineering teams: we pressure-test the plan, name the risks and leave you with decisions rather than a slide deck.',
    includes: ['Discovery conversation', 'Scope and risk review', 'Prioritised recommendations', 'A written decision summary'],
    how: 'One week, one clear outcome.',
  },
};

const FALLBACK: StampExtras = {
  id: 'other',
  ink: '#14575a',
  glow: '#e0a73a',
  motif: 'advice',
  rest: 0,
  tagline: '',
  story: '',
  includes: [],
  how: '',
};

export type Stamp = ServiceRow & StampExtras & { no: string };

export const STAMPS: Stamp[] = SERVICES.map((service, index) => {
  const extras = EXTRAS[service.name] ?? { ...FALLBACK, id: `service-${index}`, story: service.description };
  return { ...service, ...extras, no: String(index + 1).padStart(2, '0') };
});

/** "2-4 wks" -> { amount: "2–4", unit: "WKS" } for the stamp's big denomination. */
export function splitTimeline(timeline: string): { amount: string; unit: string } {
  const match = timeline.match(/^([\d\s–-]+)\s*(.*)$/);
  if (!match) return { amount: timeline, unit: '' };
  const unit = match[2].toUpperCase().replace(/^WKS?$/, (w) => (w === 'WK' ? 'WEEK' : 'WEEKS'));
  return { amount: match[1].trim().replace('-', '–'), unit };
}
