export type SectionId = 'about' | 'services' | 'process' | 'projects' | 'stats' | 'team' | 'testimonials' | 'pricing' | 'faq' | 'contact';

export type ServiceRow = {
  name: string;
  category: string;
  timeline: string;
  status: 'AVAILABLE' | 'LIMITED' | 'BOOKING';
  description: string;
};

export type ProjectTheme = 'ocean' | 'terminal' | 'default';

export type ProjectCard = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
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
