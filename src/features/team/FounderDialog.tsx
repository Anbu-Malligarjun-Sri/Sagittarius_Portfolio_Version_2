'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { Founder } from './founders';
import { FounderLink, FounderName } from './FounderParts';

const PHOTO_BG: Record<Founder['medium'], string> = {
  ink: '#ece4d2',
  signal: '#06101f',
  oil: '#14100a',
};

export default function FounderDialog({ founder, onClose }: { founder: Founder; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="founder-dialog-name"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
      className="founder-dialog m-auto w-[min(92vw,780px)] max-w-none overflow-visible bg-transparent p-0 text-[#f5f0e8] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div className="relative grid overflow-hidden rounded-[20px] border border-white/12 bg-[#0c0b0a] shadow-[0_40px_120px_rgba(0,0,0,0.7)] md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-[280px] md:min-h-[420px]" style={{ background: PHOTO_BG[founder.medium] }}>
          <Image
            src={founder.photo}
            alt={`Portrait of ${founder.name}`}
            fill
            sizes="(max-width: 768px) 92vw, 340px"
            className={`object-cover object-top ${founder.medium === 'ink' ? 'mix-blend-multiply' : ''}`}
          />
          <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: founder.accent }} />
        </div>

        <div className="flex flex-col justify-center gap-4 p-7 md:p-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: founder.accent }}>
            {founder.role}
          </p>
          <h3 id="founder-dialog-name" className="text-[clamp(2.2rem,5vw,3.2rem)] leading-[0.98]">
            <FounderName founder={founder} />
          </h3>
          <FounderLink founder={founder} />
          <div className="space-y-3 text-[14.5px] leading-7 text-[#f5f0e8]/72">
            {founder.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link
            href={`/team#${founder.id}`}
            className="mt-2 w-fit font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5f0e8]/55 transition-colors hover:text-[#f5f0e8]"
          >
            Full profile →
          </Link>
        </div>

        <button
          type="button"
          aria-label="Close profile"
          onClick={() => ref.current?.close()}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#f5f0e8] backdrop-blur transition-transform hover:scale-105"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </dialog>
  );
}
