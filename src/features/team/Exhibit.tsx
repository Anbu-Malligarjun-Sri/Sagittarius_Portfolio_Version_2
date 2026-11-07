import Image from 'next/image';
import type { Founder } from './founders';
import { FounderLink, FounderName } from './FounderParts';
import styles from './team.module.css';

const SHORT_ROLE: Record<Founder['id'], string> = { anbu: 'CEO', brajin: 'CTO', arun: 'COO' };

/** One founder profile: portrait on a flat colour field, details beside it. */
export default function Exhibit({ founder, index }: { founder: Founder; index: number }) {
  const flip = index % 2 === 1;
  const num = String(index + 1).padStart(2, '0');

  return (
    <section
      id={founder.id}
      className={`${styles.reveal} mx-auto grid max-w-6xl scroll-mt-24 items-center gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}
    >
      <div className={`relative mx-auto w-full max-w-[400px] ${flip ? 'lg:order-2' : ''}`}>
        <div className="absolute inset-0 -translate-x-3 translate-y-3 border" style={{ borderColor: founder.field }} />
        <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ backgroundColor: founder.field }}>
          <Image
            src={founder.photo}
            alt={`Portrait of ${founder.name}`}
            fill
            sizes="(max-width: 1024px) 80vw, 400px"
            className={`object-cover object-top ${founder.medium === 'ink' ? 'mix-blend-multiply' : ''}`}
          />
          <span className="absolute right-3 top-3 font-mono text-[10px] tracking-[0.25em] text-white/80">#SYS-{num}</span>
        </div>
        <p
          className="absolute -bottom-3 left-3 flex items-center gap-2 border bg-[#060608]/90 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur"
          style={{ borderColor: founder.field, color: founder.field }}
        >
          <span className={`${styles.liveDot} h-1.5 w-1.5 rounded-full`} style={{ backgroundColor: founder.field }} />
          {SHORT_ROLE[founder.id]} active
        </p>
      </div>

      <div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em]" style={{ color: founder.field }}>
          Founder profile // {SHORT_ROLE[founder.id]}
        </p>
        <h2 className="mt-4 text-[clamp(2.8rem,6.5vw,5.2rem)] leading-[0.95] text-white">
          <FounderName founder={founder} />
        </h2>
        <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.2em] text-white/50">{founder.role}</p>

        {founder.link ? (
          <div className="mt-5">
            <FounderLink founder={founder} />
          </div>
        ) : null}

        <div className="mt-8 max-w-[52ch] space-y-4 text-[1rem] leading-8 text-white/70">
          {founder.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <blockquote
          className="mt-8 max-w-[52ch] border-l-4 pl-4 text-[1.05rem] font-bold italic leading-7 text-white"
          style={{ borderColor: founder.field, fontFamily: 'var(--font-display)' }}
        >
          {founder.tagline}
        </blockquote>

        <div className="mt-7 flex flex-wrap gap-2">
          {founder.focus.map((tag) => (
            <span key={tag} className="border border-white/20 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
