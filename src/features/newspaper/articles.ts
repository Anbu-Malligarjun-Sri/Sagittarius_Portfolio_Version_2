import { PROJECT_EVIDENCE } from './evidence';
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
const EDITORIAL: Record<string, { kicker: string; headline: string; quote: string; caption: string; position: string }> = {
  edna: { kicker: 'BIOLOGY / AN EARLY EXPLORATION', headline: 'Making the ocean’s traces easier to explore', quote: 'A useful tool begins with a question worth asking.', caption: 'The eDNA interface: sequence input and a species-prediction panel.', position: 'left top' },
  tars: { kicker: 'LOCAL AI / A PERSONALITY EXPERIMENT', headline: 'A familiar voice, running closer to home', quote: 'Personality is the invitation. Usefulness is the test.', caption: 'TARS: a conversation interface with a personality matrix.', position: 'center center' },
  techazura: { kicker: 'WEB DESIGN / THE EVENT ARCHIVE', headline: 'A place for the programme, before the gathering', quote: 'Good event design helps people find their next step.', caption: 'The Techazura 2026 event website, preserved as a design showcase.', position: 'left top' },
};

export function buildArticles(projects: ProjectCard[]): Article[] {
  return projects.map((project) => {
    const editorial = EDITORIAL[project.id];
    return {
      id: project.id,
      kicker: editorial?.kicker ?? project.category.toUpperCase(),
      headline: editorial?.headline ?? project.title,
      byline: 'Project notes from Sagittariuz',
      paragraphs: PROJECT_EVIDENCE[project.id] ? [
        project.summary,
        `Our contribution. ${PROJECT_EVIDENCE[project.id].contribution}`,
        `What you can inspect. ${PROJECT_EVIDENCE[project.id].demonstrated}`,
        `Where the evidence stops. ${PROJECT_EVIDENCE[project.id].limitation}`,
      ] : [project.summary],
      quote: editorial?.quote ?? project.pullQuote,
      caption: editorial?.caption ?? `${project.title}: ${project.subtitle}.`,
      facts: project.readout,
      tags: project.tags,
      links: project.links ?? [],
      photo: { ...project.image, position: editorial?.position ?? 'center top' },
    };
  });
}
