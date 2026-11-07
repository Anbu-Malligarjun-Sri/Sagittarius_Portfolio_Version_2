'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FOUNDERS } from '@/features/team/founders';
import { teamFontVariables } from '@/features/team/fonts';
import FounderDialog from '@/features/team/FounderDialog';

interface TeamSectionProps {
  activeSection: string;
  teamIndex: number;
  setTeamIndex: (index: number) => void;
}

export default function TeamSection({ activeSection, teamIndex, setTeamIndex }: TeamSectionProps) {
  const activeTeam = FOUNDERS[teamIndex];
  const [openId, setOpenId] = useState<string | null>(null);
  const openFounder = FOUNDERS.find((founder) => founder.id === openId) ?? null;

  return (
    <section id="team" className={`${teamFontVariables} section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">TEAM</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">Three people. One shared standard.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">We're small by choice. Every project has a lead who can answer the hard questions on day one.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl items-center justify-center gap-4">
        <button type="button" aria-label="Previous team member" onClick={() => setTeamIndex((teamIndex - 1 + FOUNDERS.length) % FOUNDERS.length)} className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-[#f5f0e8] transition-transform duration-200 hover:scale-[1.04]">
          <ChevronLeft className="mx-auto h-5 w-5" />
        </button>
        <div className="rolodex-shell relative w-full max-w-[760px] perspective-[800px]">
          <div className="absolute -left-1 top-1 h-[204px] w-[320px] rotate-[-3deg] rounded-[16px] bg-[#e9e1d7] opacity-25" />
          <div className="absolute left-1 top-2 h-[204px] w-[320px] rotate-[-1.5deg] rounded-[16px] bg-[#e9e1d7] opacity-35" />
          <div className="absolute left-3 top-3 h-[204px] w-[320px] rounded-[16px] bg-[#e9e1d7] opacity-45" />
          <div className="relative mx-auto max-w-[320px] rounded-[16px] border border-black/10 bg-[#f8f5f0] px-5 py-6 text-[#1a1208] shadow-[0_20px_50px_rgba(0,0,0,0.25)]" style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
            <button
              type="button"
              aria-label={`Open ${activeTeam.name}'s profile`}
              onClick={() => setOpenId(activeTeam.id)}
              className="absolute inset-0 z-10 rounded-[16px]"
            />
            <div className="absolute -top-6 left-5 rounded-t-[4px] px-4 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white" style={{ background: activeTeam.accent }}>
              {activeTeam.role}
            </div>
            <div className="border-t-2 border-black/10 pt-5">
              <div className="flex items-center gap-4">
                <Image
                  src={activeTeam.photo}
                  alt={`Portrait of ${activeTeam.name}`}
                  width={80}
                  height={80}
                  sizes="80px"
                  className="h-20 w-20 shrink-0 rounded-full border-2 object-cover object-top"
                  style={{ borderColor: activeTeam.accent }}
                />
                <div>
                  <h3 className="text-[26px] leading-[1.05]" style={{ fontFamily: activeTeam.nameFont }}>{activeTeam.name}</h3>
                  <p className="mt-1 font-body text-[12px] italic text-black/60">{activeTeam.role}</p>
                  <div className="mt-3 flex items-center gap-2 text-black/50">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13l-1.5-7.5M15.5 5.5h3M3 19h18M5 19v-2m4 2v-4m4 4v-6m4 6v-3" />
                    </svg>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-black/30">
                <span>{String(teamIndex + 1).padStart(2, '0')} / {String(FOUNDERS.length).padStart(2, '0')}</span>
                <span>Tap to open</span>
              </div>
            </div>
          </div>
        </div>
        <button type="button" aria-label="Next team member" onClick={() => setTeamIndex((teamIndex + 1) % FOUNDERS.length)} className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-[#f5f0e8] transition-transform duration-200 hover:scale-[1.04]">
          <ChevronRight className="mx-auto h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] text-[#f5f0e8]/30">
        <kbd className="rounded border border-white/15 px-1.5 py-0.5">←</kbd>
        <kbd className="rounded border border-white/15 px-1.5 py-0.5">→</kbd>
        <span>Navigate cards</span>
      </div>

      <div className="mt-6 flex justify-center gap-2 text-[#f5f0e8]/55">
        {FOUNDERS.map((member, index) => (
          <button key={member.name} type="button" aria-label={`Show ${member.name}`} onClick={() => setTeamIndex(index)} className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${index === teamIndex ? 'bg-[#e8c547] shadow-[0_0_12px_rgba(232,197,71,0.4)]' : 'bg-white/20'}`} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/team" className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#e8c547] transition-opacity hover:opacity-70">
          Meet the team →
        </Link>
      </div>

      {openFounder ? <FounderDialog founder={openFounder} onClose={() => setOpenId(null)} /> : null}
    </section>
  );
}
