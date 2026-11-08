'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PlushSocials from '@/features/social/PlushSocials';

interface FooterSectionProps {
  activeSection: string;
}

export default function FooterSection({ activeSection }: FooterSectionProps) {
  return (
    <footer className="section-block scroll-mt-28 border-t border-white/10 bg-[#111111] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <div className="font-display text-[1.6rem] font-extrabold tracking-[0.04em] text-[#e8c547]">SAGITTARIUS</div>
          <p className="mt-4 max-w-[38ch] text-[14.5px] leading-7 text-[#f5f0e8]/60">
            A design and engineering studio for teams that want clarity before velocity.
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e8c547] px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-[#0a0a0a] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(232,197,71,0.3)]"
          >
            Start a project <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <nav aria-label="Explore">
          <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8c547]">Explore</div>
          <div className="mt-4 space-y-3">
            {[
              ['Services', '#services'],
              ['Process', '#process'],
              ['Work', '#projects'],
              ['Pricing', '#pricing'],
            ].map(([label, href]) => (
              <a key={label} href={href} className="block text-[13.5px] text-[#f5f0e8]/55 transition-all duration-200 hover:translate-x-1 hover:text-[#f5f0e8]">
                {label}
              </a>
            ))}
          </div>
        </nav>

        <nav aria-label="Studio">
          <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8c547]">Studio</div>
          <div className="mt-4 space-y-3">
            <Link href="/team" className="block text-[13.5px] text-[#f5f0e8]/55 transition-all duration-200 hover:translate-x-1 hover:text-[#f5f0e8]">
              The team
            </Link>
            <Link href="/species-de-extinction" className="block text-[13.5px] text-[#f5f0e8]/55 transition-all duration-200 hover:translate-x-1 hover:text-[#f5f0e8]">
              The lab <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f0e8]/30">Zenith</span>
            </Link>
            <a href="#contact" className="block text-[13.5px] text-[#f5f0e8]/55 transition-all duration-200 hover:translate-x-1 hover:text-[#f5f0e8]">
              Contact
            </a>
          </div>
        </nav>
      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-14">
        <PlushSocials />
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[11px] text-[#f5f0e8]/30">
        <div>© 2025 Sagittarius. All rights reserved.</div>
      </div>
    </footer>
  );
}
