import { MAX_PROJECT_SLOTS, PROJECTS } from '@/features/home/sections/active/data';
import ProjectFile from './ProjectFile';
import { ACCENT } from './themes';
import styles from './projects.module.css';

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five'];
const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

/** The case-file view of all projects, used on the /projects page. */
export default function CaseFiles() {
  const slotCount = Math.max(MAX_PROJECT_SLOTS, PROJECTS.length);
  const slots = Array.from({ length: slotCount }, (_, i) => PROJECTS[i] ?? null);
  const incoming = slots.length - PROJECTS.length;
  const logged = NUMBER_WORDS[PROJECTS.length] ?? String(PROJECTS.length);

  return (
    <section className={`${styles.section} relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8`}>
      <div className={`${styles.grid} pointer-events-none absolute inset-0`} aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="section-header-container px-0 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="overflow-hidden">
              <p className="header-anim-item font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547]">WORK</p>
            </div>
            <div className="overflow-hidden">
              <h2 className="header-anim-item mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#f5f0e8]">
                Case files from the lab.
              </h2>
            </div>
            <div className="overflow-hidden">
              <p className="header-anim-item mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72">
                {logged} {PROJECTS.length === 1 ? 'project' : 'projects'} logged so far, each with its own interface and its own world.
                {incoming > 0 ? ` ${incoming} more ${incoming === 1 ? 'file is' : 'files are'} on the way.` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* File index: one tab per slot */}
        <nav aria-label="Project files" className="mt-12 px-0 sm:px-6 lg:px-8">
          <ol className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}>
            {slots.map((project, i) => {
              const num = String(i + 1).padStart(2, '0');
              return (
                <li key={project?.id ?? `slot-${i}`}>
                  {project ? (
                    <a
                      href={`#project-${project.id}`}
                      className={`${styles.tab} block rounded-xl border border-white/15 bg-white/[0.02] px-2.5 py-3 sm:px-4`}
                      style={css({ '--accent': ACCENT[project.theme ?? 'default'] })}
                    >
                      <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 sm:text-[10px]">File {num}</span>
                      <span className="mt-1 block truncate text-[12px] font-semibold text-[#f5f0e8] sm:text-[14px]">{project.title}</span>
                    </a>
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/15 px-2.5 py-3 sm:px-4" aria-label={`File ${num}, reserved`}>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 sm:text-[10px]">File {num}</span>
                      <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 sm:text-[11px]">Reserved</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* The files */}
        <div className="mt-20 space-y-28 px-0 sm:px-6 lg:px-8">
          {PROJECTS.map((project, i) => (
            <ProjectFile key={project.id} project={project} index={i} total={slotCount} flip={i % 2 === 1} />
          ))}
        </div>

        {/* Slots still waiting for a project */}
        {incoming > 0 ? (
          <div className="mt-28 px-0 sm:px-6 lg:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">Incoming</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map((project, i) =>
                project ? null : (
                  <div key={`incoming-${i}`} className={`${styles.incoming} px-5 py-6`}>
                    <p className="relative font-mono text-[10px] uppercase tracking-[0.3em] text-[#e8c547]/80">File {String(i + 1).padStart(2, '0')}</p>
                    <p className="relative mt-3 font-display text-[1.3rem] font-bold tracking-[-0.02em] text-[#f5f0e8]/80">Next experiment</p>
                    <p className={`${styles.waiting} relative mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35`}>Awaiting transmission</p>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
