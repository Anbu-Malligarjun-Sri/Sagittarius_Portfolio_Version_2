'use client';

import { FOR_WHOM } from '@/features/about/copy';
import { aboutFontVariables } from '@/features/about/fonts';
import LivePaper from '@/features/about/LivePaper';
import styles from '@/features/about/about.module.css';

interface AboutSectionProps {
  activeSection: string;
}

// little notes, each a different colour and tilt
const NOTES = [
  { color: '#f7d154', tilt: -4 },
  { color: '#f4a3b5', tilt: 3 },
  { color: '#8fc3ea', tilt: -2 },
  { color: '#a6d68f', tilt: 4 },
  { color: '#f4b183', tilt: -3 },
];

export default function AboutSection({ activeSection }: AboutSectionProps) {
  return (
    <section id="about" className={`section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8 ${aboutFontVariables}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">ABOUT</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">We started in 2026. Here is what we are trying to do.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">A clear idea, three early projects, and a promise to be straight with you.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl items-start gap-12 px-0 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <div className="order-2 lg:sticky lg:top-32 lg:order-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#f5f0e8]/45">Who we are building for</p>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-6">
            {FOR_WHOM.map((label, index) => (
              <div
                key={label}
                className="postit-card relative min-w-[8.5rem] px-5 pb-5 pt-6 text-[#2a2015] shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
                style={{ background: NOTES[index % NOTES.length].color, transform: `rotate(${NOTES[index % NOTES.length].tilt}deg)` }}
              >
                <span aria-hidden="true" className="absolute left-1/2 top-[-9px] h-[18px] w-14 -translate-x-1/2 rotate-[-3deg] bg-[#f4ead0]/70 shadow-[0_1px_3px_rgba(0,0,0,0.25)]" />
                <span className="font-handwriting text-[1.7rem] leading-none">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-sm text-[14px] leading-7 text-[#f5f0e8]/60">
            Friction is the small, daily drag on good work: the file that will not open, the unit that did not convert, the hour spent on the thing that was never the point.
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <p className="mb-3 text-center font-handwriting text-[1.7rem] leading-none text-[#f5f0e8]/70">Press and hold the paper. Drag it. Let go.</p>
          <div className={styles.lamp}>
            <LivePaper />
          </div>
        </div>
      </div>
    </section>
  );
}
