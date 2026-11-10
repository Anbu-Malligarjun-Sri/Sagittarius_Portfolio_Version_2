import { SERVICES } from '@/features/home/sections/active/data';
import type { ServiceRow } from '@/features/home/sections/active/types';

export type StampMotif = 'ui' | 'web' | 'mobile' | 'agents' | 'ai' | 'seo';

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
  'AI Agents': {
    id: 'ai-agents', ink: '#244d4c', glow: '#c49b58', motif: 'agents', rest: 2.4,
    tagline: 'From a clear instruction to a considered action.',
    story: 'We build agents around a defined job: break it into steps, connect the right tools, and check the result. You choose the boundaries, approval points, and actions that must stay in human hands.',
    includes: ['Workflow and tool design', 'Agent orchestration', 'Human approvals and activity logs', 'Evaluation and handover'],
    how: 'Start with one bounded task, test it, then expand what it can do.',
  },
  'AI Integration': {
    id: 'ai',
    ink: '#8c3d1d',
    glow: '#cf6a3c',
    motif: 'ai',
    rest: -1.8,
    tagline: 'Practical models, wired into real workflows.',
    story:
      'We find the repeated, slow step in your workflow and put a model to work on it: an assistant surface, an automation, a retrieval layer. Useful first, impressive second.',
    includes: ['Workflow audit', 'Assistant or automation build', 'Model and data integration', 'Guardrails and a way to measure it'],
    how: 'Start with one workflow and prove it before widening.',
  },
  'SEO Optimization': {
    id: 'seo',
    ink: '#0b4a5a',
    glow: '#ffd36b',
    motif: 'seo',
    rest: -1.4,
    tagline: 'Be found by the people already looking.',
    story:
      "Good work is no use if nobody can find it. We build and tune your site so search engines can read it, and so a person searching can tell at a glance that yours is the page they were after.",
    includes: ['Technical and on-page audit', 'Search-friendly structure and metadata', 'Content and keyword plan', 'Speed and page-experience pass'],
    how: 'Fix the foundations first, then measure what moves.',
  },
};

const FALLBACK: StampExtras = {
  id: 'other',
  ink: '#14575a',
  glow: '#e0a73a',
  motif: 'agents',
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
