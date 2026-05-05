'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type PersonCard = {
  name: string;
  label: string;
  summary: string;
  portrait: string;
  background: string;
  accent: string;
  alignment: 'left' | 'right' | 'center';
  bodyFont: string;
  nameFont: string;
  noteFont: string;
  overlap: string;
};

const FOUNDERS: PersonCard[] = [
  {
    name: 'Anbu Malligarjun Sri',
    label: 'Founder & CEO',
    summary: 'Anbu shapes the vision, sets the pace, and keeps the work moving toward a clear standard. He leads the team with a sharp eye for direction, detail, and momentum.',
    portrait: encodeURI('/images/Portfolio Photos/Anbu Malligarjun Sri.png'),
    background: encodeURI('/images/Portfolio Photos/Background/For_Anbu.png'),
    accent: 'rgba(234, 194, 108, 0.95)',
    alignment: 'left',
    bodyFont: 'var(--font-body)',
    nameFont: 'var(--font-serif)',
    noteFont: 'var(--font-handwriting)',
    overlap: 'lg:translate-y-6',
  },
  {
    name: 'Arun G',
    label: 'Co-Founder & CTO',
    summary: 'Arun translates ideas into systems. He keeps the technical side clean, dependable, and easy to scale without losing the original intent of the design.',
    portrait: encodeURI('/images/Portfolio Photos/Arun G.png'),
    background: encodeURI('/images/Portfolio Photos/Background/For_ARUN.png'),
    accent: 'rgba(227, 184, 92, 0.94)',
    alignment: 'right',
    bodyFont: 'var(--font-body)',
    nameFont: 'var(--font-display)',
    noteFont: 'var(--font-mono)',
    overlap: 'lg:-translate-y-4',
  },
  {
    name: 'Brajin S J',
    label: 'Co-Founder & CPO',
    summary: 'Brajin focuses on product clarity and the shape of the user experience. He balances structure with taste so the output feels deliberate, not overworked.',
    portrait: encodeURI('/images/Portfolio Photos/Brajin S.jpeg'),
    background: encodeURI('/images/Portfolio Photos/Background/For Brajin.png'),
    accent: 'rgba(208, 177, 255, 0.9)',
    alignment: 'center',
    bodyFont: 'var(--font-body)',
    nameFont: 'var(--font-handwriting)',
    noteFont: 'var(--font-serif)',
    overlap: 'lg:translate-y-2',
  },
  {
    name: 'Clintan S',
    label: 'Developer',
    summary: 'Clintan turns the concept into the actual build. He keeps the implementation practical, resilient, and polished where it matters most.',
    portrait: encodeURI('/images/Portfolio Photos/Clintan S.png'),
    background: encodeURI('/images/Portfolio Photos/Background/For_Clintan.png'),
    accent: 'rgba(244, 214, 131, 0.92)',
    alignment: 'left',
    bodyFont: 'var(--font-body)',
    nameFont: 'var(--font-display)',
    noteFont: 'var(--font-mono)',
    overlap: 'lg:-translate-y-6',
  },
];

function FounderPanel({ person, index }: { person: PersonCard; index: number }) {
  const reverse = person.alignment === 'right';
  const center = person.alignment === 'center';

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-4xl border border-white/10 bg-[#0d0c0b] shadow-[0_24px_70px_rgba(0,0,0,0.38)] ${person.overlap}`}
      style={{ minHeight: center ? 'min(72vh, 680px)' : 'min(56vh, 560px)' }}
    >
      <div className="absolute inset-0">
        <Image
          src={person.background}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover scale-[1.1] blur-2xl saturate-[0.85] opacity-70 transition-transform duration-700 group-hover:scale-[1.16]"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,5,5,0.76),rgba(5,5,5,0.34)_40%,rgba(5,5,5,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(255,208,120,0.14),transparent_24%),radial-gradient(circle_at_50%_85%,rgba(0,0,0,0.55),transparent_52%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.56)_100%)]" />
      </div>

      <div className="absolute left-5 top-5 z-10 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: person.accent, boxShadow: `0 0 18px ${person.accent}` }} />
        <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-white/55">0{index + 1}</span>
      </div>

      <div className={`relative z-10 flex h-full flex-col gap-6 p-6 sm:p-8 ${center ? 'justify-between' : 'lg:flex-row lg:items-end'} ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <div className={`flex flex-col justify-end ${center ? 'items-center text-center' : reverse ? 'lg:items-end lg:text-right' : 'lg:items-start'} ${center ? '' : 'lg:w-[48%]'}`}>
          <p className="text-[11px] uppercase tracking-[0.42em] text-white/70" style={{ fontFamily: person.noteFont }}>
            {person.label}
          </p>
          <h3 className="mt-4 max-w-[12ch] text-[clamp(2.4rem,4vw,4.75rem)] leading-[0.92] text-[#f7f0e4]" style={{ fontFamily: person.nameFont }}>
            {person.name}
          </h3>
          <p className={`mt-5 max-w-[34ch] text-[0.98rem] leading-8 text-white/72 ${center ? 'mx-auto' : ''}`} style={{ fontFamily: person.bodyFont }}>
            {person.summary}
          </p>
        </div>

        <div className={`relative ${center ? 'mx-auto w-full max-w-115' : 'w-full self-end lg:w-[48%]'}`}>
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/12 bg-black/18 shadow-[0_30px_60px_rgba(0,0,0,0.42)] backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.35))]" />
            <Image
              src={person.portrait}
              alt={`${person.name} portrait`}
              width={980}
              height={1200}
              className={`relative h-auto w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] ${center ? 'aspect-4/5' : 'aspect-5/4'}`}
              sizes="(max-width: 1024px) 100vw, 34vw"
            />
          </div>

          <div className={`absolute -bottom-4 z-20 rounded-full border border-white/12 bg-[#070707]/86 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-white/70 backdrop-blur-xl ${reverse ? 'right-4' : 'left-4'}`} style={{ fontFamily: person.noteFont }}>
            {reverse ? 'edited for impact' : 'blurred backdrop / crisp figure'}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.from('.about-hero-title', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.about-hero-desc', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.about-hero-cta', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.founder-card', {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.founders-section',
          start: 'top 75%',
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#050505] text-[#f5f0e8]">
      {/* Navigation */}
      <header className="fixed left-1/2 top-5 z-40 rounded-full border border-white/10 bg-[rgba(10,10,10,0.78)] px-5 shadow-[0_4px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl w-[min(90vw,820px)] -translate-x-1/2">
        <div className="flex h-13 items-center justify-between gap-4">
          <a href="/" className="font-display text-[0.7rem] font-bold tracking-wide text-[#e8c547] shrink-0">
            SAGITTARIUS
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            <a href="/" className="text-[13.5px] font-medium text-[#f5f0e8]/60 transition-colors hover:text-[#f5f0e8]">Home</a>
            <a href="#founders" className="text-[13.5px] font-medium text-[#f5f0e8] transition-colors">Founders</a>
          </nav>
          <a href="/#contact" className="hidden rounded-full bg-[#e8c547] px-5 py-2.25 text-[13px] font-semibold tracking-[0.02em] text-[#0a0a0a] transition-all duration-200 hover:scale-[1.04] md:inline-flex items-center">
            Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(26,10,46,0.35),transparent_60%),radial-gradient(ellipse_40%_50%_at_80%_70%,rgba(13,27,62,0.25),transparent_50%)]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="about-hero-title font-serif text-[clamp(3.5rem,8vw,6.5rem)] font-light leading-[1.0] tracking-[-0.06em] text-[#f7f0e4]">
            We build systems that last.
          </h1>

          <div className="about-hero-desc mt-8 space-y-6 max-w-3xl mx-auto">
            <p className="text-[1.15rem] leading-8 text-[#f5f0e8]/80" style={{ fontFamily: 'var(--font-body)' }}>
              Sagittarius is a design and engineering studio founded on a single conviction: great products begin with clarity. We don't add features; we remove obstacles. We don't chase trends; we build systems that serve their purpose for years without drift or decay.
            </p>

            <p className="text-[1.15rem] leading-8 text-[#f5f0e8]/80" style={{ fontFamily: 'var(--font-body)' }}>
              For over a decade, we've partnered with founders, product leaders, and ambitious teams to answer the hardest question first: <span className="italic text-[#f7f0e4]">What must this product do, and who does it serve?</span>
            </p>

            <p className="text-[1.15rem] leading-8 text-[#f5f0e8]/80" style={{ fontFamily: 'var(--font-body)' }}>
              Our work spans 200+ engagements across 40 countries. We've shipped products that redefined categories. We've turned confused feature bloat into focused, maintainable systems. We've built teams that move with intention.
            </p>
          </div>

          <div className="about-hero-cta mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="/#contact" className="rounded-full bg-[#e8c547] px-7 py-3 text-sm font-semibold tracking-[0.02em] text-[#0a0a0a] transition-all duration-200 hover:scale-[1.05] flex items-center gap-2">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#founders" className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold tracking-[0.02em] text-[#f5f0e8] transition-all duration-200 hover:border-white/40 hover:bg-white/5">
              Meet the team
            </a>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold text-[#e8c547]">Editorial Rigor</h3>
              <p className="text-[#f5f0e8]/72 leading-8">
                We believe every pixel, every line of code, every interaction should have a reason. Decoration without purpose is clutter. We strip away the noise and keep what serves the mission.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold text-[#e8c547]">Sustainable Systems</h3>
              <p className="text-[#f5f0e8]/72 leading-8">
                Software that requires constant heroic effort to maintain is not sustainable. We design for handoff. We build systems that your team can understand, extend, and improve without diving into legacy chaos.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold text-[#e8c547]">Speed Through Clarity</h3>
              <p className="text-[#f5f0e8]/72 leading-8">
                Unclear products are slow products. A team that agrees on what the product *is* can move fast. We spend time up front clarifying the shape before building at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="founders-section relative px-4 sm:px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547]">THE TEAM</p>
            <h2 className="mt-4 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[0.96] text-[#f7f0e4]">
              Four people, one mission.
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-[1.05rem] leading-8 text-[#f5f0e8]/72">
              We're small by choice. Each person can articulate why we're building this, and each decision carries their conviction.
            </p>
          </div>

          <div className="mt-16 grid max-w-7xl gap-6 lg:grid-cols-12 lg:gap-7">
            {FOUNDERS.map((founder, index) => (
              <div
                key={founder.name}
                className={`founder-card ${
                  index === 0
                    ? 'lg:col-span-7'
                    : index === 1
                      ? 'lg:col-span-5'
                      : index === 2
                        ? 'lg:col-span-5'
                        : 'lg:col-span-7'
                }`}
              >
                <FounderPanel person={founder} index={index} />
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-7xl px-1 sm:px-2 lg:px-0">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.38em] text-white/45">
              <span style={{ fontFamily: 'var(--font-mono)' }}>Founders and core team</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>Shaping the future</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#f7f0e4] mb-6">
            Ready to build something clear?
          </h2>
          <p className="text-[1.05rem] text-[#f5f0e8]/72 mb-8 leading-8">
            We work with founders and teams who are committed to clarity. If you're ready to move past the noise and build a system that lasts, let's talk.
          </p>
          <a href="/#contact" className="inline-flex rounded-full bg-[#e8c547] px-8 py-4 text-base font-semibold tracking-[0.02em] text-[#0a0a0a] transition-all duration-200 hover:scale-[1.05]">
            Start a project <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
