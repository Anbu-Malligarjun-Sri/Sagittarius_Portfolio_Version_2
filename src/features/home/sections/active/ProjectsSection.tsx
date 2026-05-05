'use client';

import { PROJECTS } from './data';

interface ProjectsSectionProps {
  activeSection: string;
}

export default function ProjectsSection({ activeSection }: ProjectsSectionProps) {
  return (
    <section id="projects" className="section-block newspaper-section scroll-mt-28 bg-[#f8f4ec] px-4 py-24 text-[#1a1208] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#b8b0a0] pb-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.04em]">The Portfolio Times</div>
              <div className="mt-1 font-body text-[13px] italic text-[#1a1208]/60">All the work that&apos;s fit to ship, from research systems to launch pages.</div>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.35em]">Tuesday, January 2025</div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1px_1fr]">
          <article className="space-y-5">
            <div className="overflow-hidden border border-[#b8b0a0] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <img src={PROJECTS[0].image} alt={PROJECTS[0].title} className="w-full object-cover grayscale-[20%] contrast-[1.05]" loading="lazy" decoding="async" />
            </div>
            <div className="font-mono text-[11px] italic text-[#1a1208]/55">Fig. 1 — The Sagittarius homepage, 2025.</div>
            <span className="inline-flex border border-[#1a1208] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em]">{PROJECTS[0].category}</span>
            <h3 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold leading-tight tracking-[-0.04em]">{PROJECTS[0].title}</h3>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1a1208]/50">By Sagittarius · Design & engineering</div>
            <div className="grid gap-4 md:grid-cols-2">
              <p className="text-[13px] leading-8 text-[#1a1208]">New York, January 2025 — the site was rebuilt as a proof object for the studio&apos;s motion, structure, and editorial systems rather than another generic agency landing page.</p>
              <blockquote className="border-l-4 border-[#1a1208] pl-4 font-display text-[16px] font-bold italic leading-7">A product page should feel like a position, not a template.</blockquote>
            </div>
            <div className="columns-2 gap-4 border-t border-[#c8c0b0] pt-4 text-[13px] leading-7 text-[#1a1208]">
              <p>{PROJECTS[0].body}</p>
              <p>The rest of the edition shows the lab, the assistant stack, the AR prototype, and the education work behind the portfolio.</p>
            </div>
          </article>

          <div className="hidden bg-[#b8b0a0] lg:block" />

          <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-2">
            {PROJECTS.slice(1).map((project) => (
              <article key={project.title} className="story-card border border-[#b8b0a0] bg-[#fbf8f0] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
                <img src={project.image} alt={project.title} className="aspect-[4/3] w-full object-cover grayscale-[20%] contrast-[1.02]" loading="lazy" decoding="async" />
                <span className="mt-4 inline-flex border border-[#1a1208] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em]">{project.category}</span>
                <h4 className="mt-3 font-display text-[1.2rem] font-bold tracking-[-0.03em]">{project.title}</h4>
                <p className="mt-2 text-[13px] leading-7">{project.body}</p>
                <div className="mt-3 border-t border-dashed border-[#1a1208]/30 pt-3 font-mono text-[10px] italic text-[#1a1208]/60">Continued on page 2 →</div>
              </article>
            ))}
            <div className="border border-[#b8b0a0] bg-[#fbf8f0] p-4 font-mono text-[12px] leading-7 text-[#1a1208]">
              <div className="text-[11px] uppercase tracking-[0.35em]">Inside this edition</div>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <span>Sagittarius homepage</span><span>2</span>
                <span>Zenith engine</span><span>4</span>
                <span>Sagittarius LLM</span><span>6</span>
                <span>EDITH and Sagittarix</span><span>8</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
