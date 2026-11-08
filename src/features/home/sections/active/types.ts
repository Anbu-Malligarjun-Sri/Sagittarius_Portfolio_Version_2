export type SectionId = 'about' | 'services' | 'process' | 'projects' | 'stats' | 'team' | 'testimonials' | 'pricing' | 'faq' | 'contact';

export type ServiceRow = {
  name: string;
  category: string;
  timeline: string;
  status: 'AVAILABLE' | 'LIMITED' | 'BOOKING';
  description: string;
};

export type ProjectTheme = 'ocean' | 'terminal' | 'event' | 'default';

export type ProjectCard = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  /** A short line shown as the pull quote in the newspaper layout (use words from the project itself). */
  pullQuote: string;
  tags: string[];
  /** Short "mission readout" rows shown beside the image: [label, value]. */
  readout: [string, string][];
  image: { src: string; width: number; height: number; alt: string };
  /** Visual world for the project's panel. Omit for the neutral gold frame. */
  theme?: ProjectTheme;
  links?: { label: string; href: string }[];
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  company: string;
  tint: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  category: string;
};
