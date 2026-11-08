'use client';

import StampAlbum from '@/features/services/StampAlbum';

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

      <StampAlbum />
    </section>
  );
}
