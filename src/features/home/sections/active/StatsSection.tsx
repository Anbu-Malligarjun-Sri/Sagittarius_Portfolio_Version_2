'use client';

import { GAUGES } from './data';
import { Gauge, Indicator } from './utils';

interface StatsSectionProps {
  activeSection: string;
}

export default function StatsSection({ activeSection }: StatsSectionProps) {
  return (
    <section id="stats" className="section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">STATS</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">Numbers that show the system is working.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">These are the signals we track while the work is in motion, not decorative metrics.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl rounded-[8px] border-2 border-[#1e1e1e] bg-[#0f0f0f] p-6 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8),0_0_0_4px_#0a0a0a,0_0_0_6px_#1a1a1a]">
        <div className="mb-5 inline-flex rounded-[4px] border border-white/10 bg-[#1a1209] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e8c547]">Performance metrics / SYS-01</div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {GAUGES.map((gauge) => (
            <Gauge key={gauge.label} label={gauge.label} value={gauge.value} display={gauge.display} active={activeSection === 'stats'} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-end gap-4 font-mono text-[9px] uppercase tracking-[0.35em] text-white/45">
          <Indicator light="green" label="SYS OK" active />
          <Indicator light="green" label="BUILD" active />
          <Indicator light="amber" label="WARN" active blinking />
          <Indicator light="off" label="IDLE" />
          <Indicator light="off" label="QUEUE" />
          <Indicator light="off" label="SYNC" />
        </div>
      </div>
    </section>
  );
}
