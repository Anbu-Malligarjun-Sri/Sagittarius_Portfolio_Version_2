'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PROJECTS } from './data';
import type { ProjectCard } from './types';

interface ProjectsSectionProps {
  activeSection: string;
}

/** Wraps children in a link to the project's primary page (opens in a new tab), or renders them as they are. */
function ProjectLink({ project, className, children }: { project: ProjectCard; className?: string; children: React.ReactNode }) {
  const primary = project.links?.[0];
  if (!primary) return <>{children}</>;
  return (
    <a href={primary.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}: ${primary.label} (opens in a new tab)`} className={className}>
      {children}
    </a>
  );
}

export default function ProjectsSection({ activeSection }: ProjectsSectionProps) {
  const [lead, ...rest] = PROJECTS;
  if (!lead) return null;
  const leadLink = lead.links?.[0];

  return (
    <section id="projects" className="section-block newspaper-section scroll-mt-28 bg-[#f8f4ec] px-4 py-24 text-[#1a1208] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#b8b0a0] pb-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.04em]">The Portfolio Times</div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1a1208] px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#f8f4ec] transition-transform duration-200 hover:scale-[1.04]"
                >
                  Open the live newspaper <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-1 font-body text-[13px] italic text-[#1a1208]/60">All the work that&apos;s fit to ship, from research systems to launch pages.</div>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.35em]">Vol. 01 · Edition 2026</div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1px_1fr]">
          <article className="space-y-5">
            <ProjectLink project={lead} className="group block">
              <div className="overflow-hidden border border-[#b8b0a0] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <Image
                  src={lead.image.src}
                  alt={lead.image.alt}
                  width={lead.image.width}
                  height={lead.image.height}
                  sizes="(min-width: 1024px) 64vw, 92vw"
                  className="h-auto w-full object-cover grayscale-[20%] contrast-[1.05] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </ProjectLink>
            <div className="font-mono text-[11px] italic text-[#1a1208]/55">Fig. 1 — {lead.title}: {lead.subtitle}.</div>
            <span className="inline-flex border border-[#1a1208] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em]">{lead.category}</span>
            <h3 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold leading-tight tracking-[-0.04em]">
              <ProjectLink project={lead} className="underline-offset-4 hover:underline">
                {lead.title}
              </ProjectLink>
            </h3>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1a1208]/50">By Sagittarius · Design & engineering</div>
            <div className="grid gap-4 md:grid-cols-2">
              <p className="text-[13px] leading-8 text-[#1a1208]">{lead.summary}</p>
              <blockquote className="border-l-4 border-[#1a1208] pl-4 font-display text-[16px] font-bold italic leading-7">{lead.pullQuote}</blockquote>
            </div>
            <div className="columns-2 gap-4 border-t border-[#c8c0b0] pt-4 text-[13px] leading-7 text-[#1a1208]">
              {lead.readout.map(([label, value]) => (
                <p key={label}>
                  <strong>{label}.</strong> {value}.
                </p>
              ))}
              <p className="font-mono text-[11px] italic text-[#1a1208]/60">Filed under: {lead.tags.join(' · ')}.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-dashed border-[#1a1208]/30 pt-4 font-mono text-[11px] uppercase tracking-[0.25em]">
              {leadLink ? (
                <a href={leadLink.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold underline-offset-4 hover:underline">
                  {leadLink.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : null}
              <Link href="/projects" className="underline-offset-4 hover:underline">
                Read the full case files →
              </Link>
            </div>
          </article>

          <div className="hidden bg-[#b8b0a0] lg:block" />

          <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-2">
            {rest.map((project) => {
              const link = project.links?.[0];
              return (
                <article key={project.id} className="story-card border border-[#b8b0a0] bg-[#fbf8f0] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
                  <ProjectLink project={project} className="block overflow-hidden">
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      sizes="(min-width: 1024px) 30vw, 92vw"
                      className="aspect-[16/10] w-full object-cover object-top grayscale-[20%] contrast-[1.02]"
                    />
                  </ProjectLink>
                  <span className="mt-4 inline-flex border border-[#1a1208] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em]">{project.category}</span>
                  <h4 className="mt-3 font-display text-[1.2rem] font-bold tracking-[-0.03em]">
                    <ProjectLink project={project} className="underline-offset-4 hover:underline">
                      {project.title}
                    </ProjectLink>
                  </h4>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1a1208]/55">{project.subtitle}</p>
                  <p className="mt-2 text-[13px] leading-7">{project.summary}</p>
                  {link ? (
                    <div className="mt-3 border-t border-dashed border-[#1a1208]/30 pt-3 font-mono text-[10px] uppercase tracking-[0.22em]">
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold underline-offset-4 hover:underline">
                        {link.label} <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  ) : null}
                </article>
              );
            })}
            <div className="border border-[#b8b0a0] bg-[#fbf8f0] p-4 font-mono text-[12px] leading-7 text-[#1a1208]">
              <div className="text-[11px] uppercase tracking-[0.35em]">Inside this edition</div>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                {PROJECTS.map((project, i) => (
                  <span key={project.id} className="contents">
                    <span>{project.title}</span>
                    <span>{i + 1}</span>
                  </span>
                ))}
              </div>
              <Link
                href="/projects"
                className="mt-4 inline-flex border border-[#1a1208] px-3 py-2 text-[10px] uppercase tracking-[0.28em] transition-colors duration-200 hover:bg-[#1a1208] hover:text-[#f8f4ec]"
              >
                All case files →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
