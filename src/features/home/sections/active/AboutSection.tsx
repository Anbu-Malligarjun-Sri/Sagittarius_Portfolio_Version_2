'use client';

import { aboutFontVariables } from '@/features/about/fonts';
import LivePaper from '@/features/about/LivePaper';
import Instrument from '@/features/about/Instrument';
import styles from '@/features/about/about.module.css';

interface AboutSectionProps {
  activeSection: string;
}

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
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">A clear idea, and a promise to be straight with you.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl items-start gap-12 px-0 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <div className="order-2 lg:order-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#f5f0e8]/45">Who we are building for</p>
          <div className="mt-8">
            <Instrument />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className={styles.lamp}>
            <LivePaper />
          </div>
        </div>
      </div>
    </section>
  );
}
