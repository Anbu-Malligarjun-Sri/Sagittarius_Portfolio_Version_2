import { ArrowUpRight } from 'lucide-react';
import type { Founder } from './founders';

/** Name in the founder's own typeface; a hyperlink when the founder has a link. */
export function FounderName({ founder, className = '' }: { founder: Founder; className?: string }) {
  const style = { fontFamily: founder.nameFont };
  if (!founder.link) {
    return (
      <span className={className} style={style}>
        {founder.name}
      </span>
    );
  }
  return (
    <a
      href={founder.link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition-colors duration-300 hover:text-[var(--accent)]`}
      style={{ ...style, ['--accent' as string]: founder.accent }}
    >
      {founder.name}
    </a>
  );
}

/** The visible link line shown under a name. */
export function FounderLink({ founder }: { founder: Founder }) {
  if (!founder.link) return null;
  return (
    <a
      href={founder.link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 font-mono text-[13px] tracking-[0.08em]"
      style={{ color: founder.accent }}
    >
      <span className="h-px w-8 bg-current opacity-60 transition-all duration-300 group-hover:w-12" />
      <span className="relative">
        {founder.link.label}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
