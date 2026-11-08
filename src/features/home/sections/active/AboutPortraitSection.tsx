'use client';

import Image from 'next/image';

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

const PEOPLE: PersonCard[] = [
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
];

function PersonPanel({ person, index }: { person: PersonCard; index: number }) {
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
          <p className="text-[11px] uppercase tracking-[0.42em] text-white/70" style={{ fontFamily: person.noteFont }}>{person.label}</p>
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

export default function AboutPortraitSection() {
  return (
    <section id="about-portraits" className="section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="header-anim-item font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547]">ABOUT THE PEOPLE</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="header-anim-item mt-4 text-[clamp(2.7rem,5vw,5.4rem)] font-normal leading-[0.92] tracking-[-0.06em] text-[#f7f0e4]" style={{ fontFamily: 'var(--font-serif)' }}>
              Three portraits, three roles, one system.
            </h2>
          </div>
          <div className="overflow-hidden">
            <p className="header-anim-item mt-5 max-w-2xl text-[1.02rem] leading-8 text-[#f5f0e8]/72" style={{ fontFamily: 'var(--font-body)' }}>
              Each portrait opens like a card. The background blurs into atmosphere, the face stays crisp, and the typography changes personality from person to person.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-12 lg:gap-7">
        {PEOPLE.map((person, index) => (
          <div
            key={person.name}
            className={index === 0 ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-5' : 'lg:col-span-6 lg:col-start-4'}
          >
            <PersonPanel person={person} index={index} />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-1 sm:px-2 lg:px-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.38em] text-white/45">
          <span style={{ fontFamily: 'var(--font-mono)' }}>Blurred backplates. Sharp foregrounds.</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>Each portrait keeps its own spacing and tone.</span>
        </div>
      </div>
    </section>
  );
}