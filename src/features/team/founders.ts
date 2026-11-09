export type Founder = {
  id: 'anbu' | 'brajin' | 'arun';
  name: string;
  role: string;
  /** One-line summary used on the home card. */
  tagline: string;
  /** Longer copy used in the modal and on /team. Draft text: edit freely. */
  bio: string[];
  photo: string;
  link?: { label: string; href: string };
  /** CSS variable of the font used for this person's name (see fonts.ts). */
  nameFont: string;
  accent: string;
  /** The "medium" the portrait is made in; drives the /team exhibit styling. */
  medium: 'ink' | 'signal' | 'oil';
  /** Flat colour block behind the portrait on /team. */
  field: string;
  /** Short skill chips shown on /team. */
  focus: string[];
};

export const FOUNDERS: Founder[] = [
  {
    id: 'anbu',
    name: 'Anbu Malligarjun Sri',
    role: 'Founder & CEO',
    tagline: 'Sets the direction and the pace, and keeps every build pointed at a clear standard.',
    bio: [
      'Anbu started Sagittariuz and sets the direction for everything the studio takes on, from research systems to launch pages.',
      'He cares about clarity first: a sharp idea, a bounded scope, and work that ships with rigor instead of noise.',
    ],
    photo: encodeURI('/images/Portfolio Photos/Anbu Malligarjun Sri.png'),
    link: { label: 'anbumalligarjun.me', href: 'https://anbumalligarjun.me' },
    nameFont: 'var(--font-name-anbu)',
    accent: '#e8c547',
    medium: 'ink',
    field: '#e5383b',
    focus: ['Vision', 'Direction', 'Product'],
  },
  {
    id: 'brajin',
    name: 'Brajin S J',
    role: 'Co-Founder & CTO',
    tagline: 'Owns the technical architecture and turns ambitious ideas into systems that hold up.',
    bio: [
      'Brajin leads technology at Sagittariuz: architecture, engineering standards, and the choices that decide whether a prototype can grow into a product.',
      'He keeps the stack practical and dependable, so the team can move fast without breaking what already works.',
    ],
    photo: encodeURI('/images/Portfolio Photos/Brajin S.jpeg'),
    nameFont: 'var(--font-name-brajin)',
    accent: '#4a90d9',
    medium: 'signal',
    field: '#2f6fed',
    focus: ['Architecture', 'Engineering', 'Systems'],
  },
  {
    id: 'arun',
    name: 'Arun G',
    role: 'Co-Founder & COO',
    tagline: 'Runs the machinery behind the work so projects stay calm, on time, and well delivered.',
    bio: [
      'Arun runs operations at Sagittariuz: planning, delivery, and the day-to-day rhythm that turns good intentions into finished work.',
      'He is the reason timelines hold and handoffs feel unusually calm.',
    ],
    photo: encodeURI('/images/Portfolio Photos/Arun G.png'),
    link: { label: 'arun-g.vercel.app', href: 'https://arun-g.vercel.app/' },
    nameFont: 'var(--font-name-arun)',
    accent: '#e85d24',
    medium: 'oil',
    field: '#f08a24',
    focus: ['Operations', 'Delivery', 'Planning'],
  },
];
