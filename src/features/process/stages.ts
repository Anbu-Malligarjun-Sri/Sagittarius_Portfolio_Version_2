export type StageId = 'discovery' | 'design' | 'development' | 'testing' | 'deployment' | 'maintenance';

export type Stage = {
  id: StageId;
  number: string;
  /** The stage's name in a standard software development lifecycle. */
  title: string;
  /** What is written on the label taped to its photograph on the board. */
  label: string;
  /** A fuller description, shown in the case file. */
  happens: string;
  receive: string[];
  decide: string;
  checkpoint: string;
};

// A standard software development lifecycle, in the order a project moves through it. Wording follows what the site
// already says about how projects run (see the FAQ in data.ts): a short discovery sprint, revisions bounded by
// checkpoints, milestone-based payments tied to approved deliverables, a post-launch tuning window, and optional support.
export const STAGES: Stage[] = [
  {
    id: 'discovery',
    number: '01',
    title: 'Discovery & Requirements',
    label: 'Discovery & Requirements',
    happens:
      'A short discovery sprint. We talk to the people who use the product and the people who sign it off, and write down the requirements: what is fixed, what can move, and what success looks like.',
    receive: ['A written requirements brief', 'A map of constraints and decision makers'],
    decide: 'What the project is really for, and who signs it off.',
    checkpoint: 'Requirements signed off',
  },
  {
    id: 'design',
    number: '02',
    title: 'Architecture & Design',
    label: 'Architecture & Design',
    happens:
      'The requirements become a plan: the system architecture, the user flows and the interface design, with the things that can wait set aside on purpose.',
    receive: ['A system architecture outline', 'Wireframes and a design system', 'A scoped plan and order of work'],
    decide: 'Which route to take, and what waits for later.',
    checkpoint: 'Design approved',
  },
  {
    id: 'development',
    number: '03',
    title: 'Development',
    label: 'Development',
    happens:
      'Design and engineering move together in short iterations, so structure, motion and code carry the same intent. You see working builds, not status updates.',
    receive: ['Working builds to click through', 'Reviewed, version-controlled code', 'A note of what changed and why'],
    decide: 'Approve or redirect at each checkpoint. Revisions stay bounded by them.',
    checkpoint: 'Build approved',
  },
  {
    id: 'testing',
    number: '04',
    title: 'Testing & QA',
    label: 'Testing & QA',
    happens:
      'Before anything ships it is tested: functional checks, edge cases, performance and accessibility, with every fix verified before it is closed.',
    receive: ['A test report', 'Bugs fixed and re-checked', 'Performance and accessibility results'],
    decide: 'What counts as ready, and which known issues can wait.',
    checkpoint: 'QA passed',
  },
  {
    id: 'deployment',
    number: '05',
    title: 'Deployment & Launch',
    label: 'Deployment & Launch',
    happens:
      'We release to production, watch it closely, and hand over something your team can use without extra explanation.',
    receive: ['A live, released product', 'Handover notes and documentation'],
    decide: 'When it goes live.',
    checkpoint: 'Released',
  },
  {
    id: 'maintenance',
    number: '06',
    title: 'Maintenance & Support',
    label: 'Maintenance & Support',
    happens:
      'After launch we keep watching: a short tuning window first, then ongoing support, monitoring and structured iterations if you want them. What we learn feeds the next cycle.',
    receive: ['A short post-launch tuning window', 'Monitoring and support, if you want them', 'A list of what to improve next'],
    decide: 'Whether to keep us on for support, and what to build next.',
    checkpoint: 'Next iteration planned',
  },
];

export const PROCESS_FACTS = [
  'Most design-to-build engagements land between three and eight weeks, depending on scope.',
  'Payments follow approved milestones, so every step is something you have signed off.',
];
