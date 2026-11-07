export type SectionId = 'about' | 'services' | 'process' | 'projects' | 'stats' | 'team' | 'testimonials' | 'pricing' | 'faq' | 'contact';

export type ServiceRow = {
  name: string;
  category: string;
  timeline: string;
  status: 'AVAILABLE' | 'LIMITED' | 'BOOKING';
  description: string;
};

export type ProjectCard = {
  title: string;
  category: string;
  body: string;
  image: string;
  tags: string[];
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
