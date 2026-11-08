'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import StampFace from './StampFace';
import type { Stamp } from './stamps';
import styles from './stamps.module.css';

type StampDialogProps = {
  stamps: Stamp[];
  index: number;
  reserved: Record<string, string>;
  onClose: () => void;
  onStep: (delta: number) => void;
  onToggle: (id: string) => void;
};

export default function StampDialog({ stamps, index, reserved, onClose, onStep, onToggle }: StampDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const stamp = stamps[index];
  const reservedAt = reserved[stamp.id];

  // Keep the latest handler without re-binding the listener on every render.
  const stepRef = useRef(onStep);
  useEffect(() => {
    stepRef.current = onStep;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    // The page's typewriter listens for keys on the window; keep keystrokes in here out of it.
    const onKey = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === 'ArrowRight') stepRef.current(1);
      if (event.key === 'ArrowLeft') stepRef.current(-1);
    };
    dialog.addEventListener('keydown', onKey);
    return () => dialog.removeEventListener('keydown', onKey);
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="stamp-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
      // A <dialog> sits above the site's custom cursor, so the real cursor is restored inside it (same as the team card).
      className="m-auto w-[min(92vw,820px)] max-w-none cursor-default overflow-visible bg-transparent p-0 text-[#f5f0e8] backdrop:cursor-default backdrop:bg-black/75 backdrop:backdrop-blur-sm [&_*]:cursor-auto [&_a]:cursor-pointer! [&_button]:cursor-pointer!"
    >
      <div className={styles.dialogBody}>
        <div className={styles.mount} style={{ '--glow': stamp.glow } as CSSProperties}>
          <div key={`${stamp.id}-${reservedAt ?? 'mint'}`} className={styles.bigStamp}>
            <StampFace stamp={stamp} reservedAt={reservedAt} />
          </div>
          <div className={styles.nav}>
            <button type="button" aria-label="Previous stamp" className={styles.navBtn} onClick={() => onStep(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Next stamp" className={styles.navBtn} onClick={() => onStep(1)}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div key={stamp.id} className="flex flex-col gap-5 p-7 md:p-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#e8c547]">
            Nº {stamp.no} · {stamp.category}
          </p>
          <div>
            <h3 id="stamp-dialog-title" className="font-serif text-[clamp(2rem,4.6vw,2.9rem)] font-extrabold leading-[1]">
              {stamp.name}
            </h3>
            <p className="mt-2 font-handwriting text-[1.5rem] leading-tight text-[#e8c547]">{stamp.tagline}</p>
          </div>

          <p className="text-[14.5px] leading-7 text-[#f5f0e8]/72">{stamp.story}</p>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f5f0e8]/42">What comes with it</p>
            <ul className="mt-2 grid gap-x-6 gap-y-1.5 text-[13.5px] text-[#f5f0e8]/85 sm:grid-cols-2">
              {stamp.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#e8c547]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>Timeline</dt>
              <dd>{stamp.timeline}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{stamp.status}</dd>
            </div>
          </dl>
          <p className="-mt-1 text-[13px] leading-6 text-[#f5f0e8]/60">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#f5f0e8]/42">How we run it &nbsp;</span>
            {stamp.how}
          </p>

          <div className="mt-1 border-t border-white/10 pt-5">
            <p className="text-[13px] leading-6 text-[#f5f0e8]/55">
              Finish a project in this category with us and this stamp is yours, postmarked with the delivery date. Want to see how it looks on yours?
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <button type="button" className={styles.reserve} data-on={reservedAt ? 'true' : 'false'} onClick={() => onToggle(stamp.id)}>
                {reservedAt ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Reserved · undo
                  </>
                ) : (
                  'Reserve this stamp'
                )}
              </button>
              <a href="#contact" className={styles.ghost} onClick={() => ref.current?.close()}>
                Start this project <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={() => ref.current?.close()}
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-black/70 text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur transition-all duration-200 hover:scale-110 hover:border-[#e8c547] hover:bg-[#e8c547] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c547]"
        >
          <X className="h-[18px] w-[18px]" strokeWidth={2.75} />
        </button>
      </div>
    </dialog>
  );
}
