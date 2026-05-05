'use client';

import { CircleDot } from 'lucide-react';
import { SERVICES } from './data';
import { SplitFlapText } from './utils';

interface ServicesSectionProps {
  activeSection: string;
}

export default function ServicesSection({ activeSection }: ServicesSectionProps) {
  return (
    <section id="services" className="section-block scroll-mt-28 bg-[#0d0d0d] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">SERVICES</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">Sharp work. Clear scope. No agency theatre.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">Each engagement is sized to the problem, not the retainer. We move fast because we've solved these categories before.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl rounded-[4px] border-2 border-[#2a2a2a] bg-[#111111] p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_0_6px_#0a0a0a,0_0_0_8px_#1e1e1e]">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px border border-[#e8c547]/15 bg-[#e8c547]/15 text-[12px] font-mono uppercase tracking-[0.3em] text-[#e8c547]">
          {['Service name', 'Category', 'Timeline', 'Status'].map((header) => (
            <div key={header} className="bg-[#1a1209] px-4 py-3">{header}</div>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {SERVICES.map((service) => (
            <div key={service.name} className="group border border-white/5 bg-[#111111] transition-colors duration-200 hover:border-[#e8c547]/30 hover:bg-[rgba(232,197,71,0.04)]">
              <div className="board-row grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-px text-[14px] font-mono text-[#f5f0e8]">
                <div className="px-4 py-4">
                  <SplitFlapText text={service.name} active={activeSection === 'services'} />
                </div>
                <div className="border-l border-white/5 px-4 py-4">{service.category}</div>
                <div className="border-l border-white/5 px-4 py-4">{service.timeline}</div>
                <div className="border-l border-white/5 px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-2 ${service.status === 'AVAILABLE' ? 'text-[#2ecc71]' : service.status === 'LIMITED' ? 'text-[#e8c547]' : 'text-[#e85d24]'}`}
                  >
                    <CircleDot className="h-3 w-3 fill-current" /> {service.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden px-4 pb-4 text-[12px] leading-7 text-[#f5f0e8]/60">{service.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
