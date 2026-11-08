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
      // The site hides the native cursor and draws its own, but a <dialog> sits in the top layer above that
      // custom cursor. So inside the dialog (and its backdrop) the real cursor is restored.
      className="m-auto w-[min(92vw,780px)] max-w-none cursor-default overflow-visible bg-transparent p-0 text-[#f5f0e8] backdrop:cursor-default backdrop:bg-black/75 backdrop:backdrop-blur-sm [&_*]:cursor-auto [&_a]:cursor-pointer! [&_button]:cursor-pointer!"
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
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-black/70 text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur transition-all duration-200 hover:scale-110 hover:border-[#e8c547] hover:bg-[#e8c547] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c547]"
        >
          <X className="h-[18px] w-[18px]" strokeWidth={2.75} />
        </button>
      </div>
    </dialog>
  );
}
