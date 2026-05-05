'use client';

import { ExternalLink, MapPinned, Sparkles, MessageSquareMore } from 'lucide-react';

interface FooterSectionProps {
  activeSection: string;
}

export default function FooterSection({ activeSection }: FooterSectionProps) {
  return (
    <footer className="section-block scroll-mt-28 border-t border-white/10 bg-[#111111] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[280px] overflow-hidden rounded-none border border-white/10 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[size:36px_36px] p-6">
          <div className="absolute left-10 top-8 h-24 w-12 bg-[#222]" />
          <div className="absolute left-24 top-16 h-32 w-14 bg-[#2a2a2a]" />
          <div className="absolute left-44 top-10 h-40 w-16 bg-[#1a1a1a]" />
          <div className="absolute left-52 top-4 h-28 w-20 bg-[rgba(232,197,71,0.6)]" />
          <div className="absolute bottom-8 left-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8c547]">
            <MapPinned className="h-4 w-4" /> You are here
          </div>
          <a href="/species-de-extinction" className="absolute bottom-8 right-8 rounded-full border border-white/10 bg-black/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 transition-colors duration-200 hover:text-[#e8c547]">
            Lab
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Navigate', ['Home', 'About', 'Projects', 'Services', 'Contact']],
            ['Services', ['UI/UX Design', 'Development', 'Mobile Apps', 'Branding', 'Consulting']],
            ['Company', ['About Us', 'Team', 'Careers', 'Blog', 'Terms']],
            ['Contact', ['hello@sagittarius.ai', '+1 (555) 204-8812', 'Twitter', 'LinkedIn', 'GitHub']],
          ].map(([title, links]) => (
            <div key={String(title)}>
              <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8c547]">{title as string}</div>
              <div className="mt-3 space-y-3">
                {(links as string[]).map((link) => (
                  <a key={link} href="#" className="block text-[13px] text-[#f5f0e8]/50 transition-all duration-200 hover:translate-x-1 hover:text-[#f5f0e8]">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[11px] text-[#f5f0e8]/30">
        <div>© 2025 Sagittarius. All rights reserved.</div>
        <div className="flex items-center gap-3 text-[#f5f0e8]/50">
          <ExternalLink className="h-4 w-4" />
          <Sparkles className="h-4 w-4" />
          <MessageSquareMore className="h-4 w-4" />
        </div>
      </div>
    </footer>
  );
}
