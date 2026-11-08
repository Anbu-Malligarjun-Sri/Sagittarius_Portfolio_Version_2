import type { ProjectCard } from '@/features/home/sections/active/types';

export type Article = {
  id: string;
  kicker: string;
  headline: string;
  byline: string;
  paragraphs: string[];
  /** A short line set in large italic type between the paragraphs. */
  quote: string;
  caption: string;
  /** Rows for the "At a glance" box: [label, value]. */
  facts: [string, string][];
  tags: string[];
  links: { label: string; href: string }[];
  photo: { src: string; width: number; height: number; alt: string; position: string };
};

// The editorial copy for each project, written only from facts visible in the projects themselves.
// A project without an entry here still gets a front-page story, made from its summary and readout.
const EDITORIAL: Record<
  string,
  { kicker: string; headline: string; paragraphs: string[]; quote: string; caption: string; position: string; facts: [string, string][] }
> = {
  edna: {
    kicker: 'SCIENCE & THE SEA',
    headline: 'Artificial Mind Learns to Read the Ocean’s DNA',
    paragraphs: [
      'Life in the deep sea leaves traces of itself in the water. Now an AI-driven pipeline, built in the Sagittarius laboratory, is learning to read those traces: it takes eDNA sequencing data and identifies the deep-sea biodiversity hiding inside it.',
      'The platform works through DNA barcoding. A researcher uploads a barcode, and the DNA Prediction panel shows the predicted species together with a confidence score, so that no guess is ever passed off as certainty.',
      'The site is laid out like a field guide. Its front page introduces the platform with two invitations, Start DNA Analysis and Explore Biodiversity, and the navigation leads on to the Gallery, the Map, the Process, the Data and the Analysis pages, with a Login for returning researchers.',
      'A helpful assistant named Aris stands ready in the corner of the screen to answer questions. The whole affair is live upon the web, and may be visited by touching the photograph or the link beside this story.',
    ],
    quote: 'Identifying species through DNA barcodes.',
    caption: 'The platform’s front page: identifying species through DNA barcodes.',
    position: 'left top',
    facts: [
      ['Input', 'eDNA sequencing data'],
      ['Method', 'AI-driven pipeline'],
      ['Output', 'Deep-sea species identification'],
      ['Pages', 'Home, Gallery, Map, Process, Data, Analysis'],
      ['Assistant', 'Aris'],
    ],
  },
  tars: {
    kicker: 'ROBOTICS & LETTERS',
    headline: 'Local Robot Learns Sarcasm; Honesty Set to Ninety Per Cent',
    paragraphs: [
      'A fine-tuned orchestration layer, known as TARS, has been unveiled by the Sagittarius laboratory. Connect a local large language model to it, and the model begins to answer in the voice of TARS, the robot from the film Interstellar, famous for its sarcastic way of speaking.',
      'The interface offers a Personality Matrix. At the time of going to press, Humor stood at seventy-five per cent, Honesty at ninety and Discretion at fifty, with quick presets named Cooper, Brand, Comedy, Mission, Analyst and Creative.',
      'Behind the screen, the status panel reports the network online, the retrieval database synced and the language model active. The start screen announces itself as the Tactical Assistant Robot System, version 2.0, with memory of 512 GB, uptime without limit, and its status ready.',
      'A command line waits at the bottom of the screen, together with a voice mode for those who prefer to talk. Readers wishing to inspect the machinery may visit the repository on GitHub. Sarcasm, we are assured, is included.',
    ],
    quote: 'Connection established. All systems nominal.',
    caption: 'The TARS interface, with its Personality Matrix on the left.',
    position: 'center center',
    facts: [
      ['Core', 'Fine-tuned orchestration'],
      ['Connects to', 'A local LLM'],
      ['Voice', 'TARS, sarcasm included'],
      ['Status', 'Network online, RAG DB synced, LLM active'],
      ['Presets', 'Cooper, Brand, Comedy, Mission, Analyst, Creative'],
    ],
  },
  techazura: {
    kicker: 'EVENTS & GATHERINGS',
    headline: 'Techazura 2026 Opens Its Doors; Registration Now Open',
    paragraphs: [
      'Hindusthan College of Engineering and Technology will host Techazura 2026, a flagship CSE symposium of workshops, competitions, talks and community, on the twenty-seventh of February, 2026, in the Kalam Auditorium.',
      'More than five hundred participants are expected. The tracks span AI, Cloud, Dev and Security, and a countdown on the event website counts the days, hours, minutes and seconds to the opening.',
      'The event website, a Sagittarius project, lets visitors browse the Events, read the FAQ, reach the organisers through the Contact page, and register online to secure their seat.',
      'A banner on the front page reads Registration Open, a Register Now button sits in the navigation bar at all times, and the host college is named, with its crest, as proud host of the occasion.',
    ],
    quote: 'A flagship CSE symposium: workshops, competitions, talks and community.',
    caption: 'The Techazura 2026 website, with its countdown to the day.',
    position: 'left top',
    facts: [
      ['Event', 'Techazura 2026, CSE symposium'],
      ['Host', 'Hindusthan College of Engineering and Technology'],
      ['Date', '27 February 2026'],
      ['Venue', 'Kalam Auditorium'],
      ['Expected', '500+ participants'],
      ['Tracks', 'AI, Cloud, Dev, Security'],
    ],
  },
};

export function buildArticles(projects: ProjectCard[]): Article[] {
  return projects.map((project) => {
    const editorial = EDITORIAL[project.id];
    return {
      id: project.id,
      kicker: editorial?.kicker ?? project.category.toUpperCase(),
      headline: editorial?.headline ?? project.title,
      byline: 'By our Sagittarius correspondent',
      paragraphs: editorial?.paragraphs ?? [project.summary, ...project.readout.map(([label, value]) => `${label}: ${value}.`)],
      quote: editorial?.quote ?? project.pullQuote,
      caption: editorial?.caption ?? `${project.title}: ${project.subtitle}.`,
      facts: editorial?.facts ?? project.readout,
      tags: project.tags,
      links: project.links ?? [],
      photo: { ...project.image, position: editorial?.position ?? 'center top' },
    };
  });
}
