'use client';

import PlushSocials from '@/features/social/PlushSocials';

interface FooterSectionProps {
  activeSection: string;
}

export default function FooterSection({ activeSection }: FooterSectionProps) {
  return (
    <footer className="section-block scroll-mt-28 border-t border-white/10 bg-[#111111] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PlushSocials />
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[11px] text-[#f5f0e8]/30">
        <div>© 2026 Sagittariuz. All rights reserved.</div>
      </div>
    </footer>
  );
}
