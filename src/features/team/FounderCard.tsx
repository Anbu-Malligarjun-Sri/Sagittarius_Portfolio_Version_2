'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { Founder } from './founders';
import styles from './team.module.css';

// Each founder's place in the deck. Change a rank or suit here and the card follows.
const DECK: Record<Founder['id'], { rank: string; suit: string; from: 'left' | 'bottom' | 'right'; tilt: number; nameSize: number }> = {
  anbu: { rank: 'A', suit: '♠', from: 'left', tilt: -22, nameSize: 8 },
  brajin: { rank: 'K', suit: '♣', from: 'bottom', tilt: 9, nameSize: 9.6 },
  arun: { rank: 'J', suit: '♦', from: 'right', tilt: 22, nameSize: 13 },
};

const INK = '#1b1712';

function CornerIndex({ rank, suit, color, flipped }: { rank: string; suit: string; color: string; flipped?: boolean }) {
  return (
    <div
      className="absolute flex flex-col items-center leading-none"
      style={{
        color,
        fontFamily: 'var(--font-serif)',
        ...(flipped ? { right: '5.5cqw', bottom: '4.5cqw', transform: 'rotate(180deg)' } : { left: '5.5cqw', top: '4.5cqw' }),
      }}
      aria-hidden="true"
    >
      <span style={{ fontSize: '11cqw', fontWeight: 800 }}>{rank}</span>
      <span style={{ fontSize: '8cqw', marginTop: '0.5cqw' }}>{suit}</span>
    </div>
  );
}

/**
 * A founder as a playing card. The outer link is what the page's arrow choreography "deals": it arrives
 * face-down (showing the back), is carried by two arrows, and flips face-up as it lands.
 * The pointer tilt below happens on an inner layer, so it never fights those animations.
 */
export default function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const deck = DECK[founder.id];
  const suitColor = founder.field;

  const onMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    const r = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width;
    const py = (event.clientY - r.top) / r.height;
    tilt.style.setProperty('--ry', `${((px - 0.5) * 16).toFixed(2)}deg`);
    tilt.style.setProperty('--rx', `${((0.5 - py) * 14).toFixed(2)}deg`);
    tilt.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    tilt.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    tilt.style.setProperty('--glare', '1');
  };
  const onLeave = () => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    for (const name of ['--ry', '--rx', '--glare']) tilt.style.removeProperty(name);
  };

  return (
    <a
      href={`#${founder.id}`}
      data-assemble=""
      data-assemble-kind="card"
      data-from={deck.from}
      data-tilt={deck.tilt}
      data-accent={suitColor}
      data-label={founder.name.split(' ')[0]}
      aria-label={`${founder.name}, ${founder.role}. Jump to the full profile.`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`${styles.card} relative mx-auto block aspect-[5/7.2] w-full max-w-[330px]`}
    >
      <div ref={tiltRef} className={styles.tilt}>
        {/* ── Face ── */}
        <div className={styles.face}>
          <div className={styles.frame} style={{ borderColor: `${suitColor}88` }} />

          <CornerIndex rank={deck.rank} suit={deck.suit} color={suitColor} />
          <CornerIndex rank={deck.rank} suit={deck.suit} color={suitColor} flipped />

          {/* Portrait, in the founder's colour like a face card */}
          <div
            className="absolute overflow-hidden"
            style={{ left: '15cqw', right: '15cqw', top: '9cqw', height: '68cqw', backgroundColor: suitColor, border: `0.6cqw solid ${INK}`, borderRadius: '2cqw' }}
          >
            <Image
              src={founder.photo}
              alt={`Portrait of ${founder.name}`}
              fill
              sizes="(max-width: 768px) 70vw, 240px"
              className={`object-cover object-top ${founder.medium === 'ink' ? 'mix-blend-multiply' : ''}`}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_40%,rgba(0,0,0,0.18))]" />
          </div>

          {/* Details */}
          <div className="absolute text-center" style={{ left: '14cqw', right: '14cqw', top: '79cqw' }}>
            <p style={{ fontFamily: founder.nameFont, fontSize: `${deck.nameSize}cqw`, lineHeight: 1.05, color: INK }}>{founder.name}</p>
            <p
              className="font-mono font-bold uppercase"
              style={{ fontSize: '3cqw', letterSpacing: '0.22em', marginTop: '1.6cqw', color: suitColor }}
            >
              {founder.role}
            </p>
            <p style={{ fontSize: '3.9cqw', lineHeight: 1.45, marginTop: '2.6cqw', color: '#4a4136' }}>{founder.tagline}</p>
            <div className="flex flex-wrap justify-center" style={{ gap: '1.4cqw', marginTop: '3cqw' }}>
              {founder.focus.map((tag) => (
                <span
                  key={tag}
                  className="font-mono font-bold uppercase"
                  style={{ fontSize: '2.5cqw', letterSpacing: '0.14em', padding: '0.8cqw 1.8cqw', border: `0.3cqw solid ${INK}55`, color: INK, borderRadius: '1cqw' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.glare} aria-hidden="true" />
        </div>

        {/* ── Back (shown while the card is dealt face-down) ── */}
        <div className={styles.back} aria-hidden="true">
          <div className={styles.backFrame} />
          <svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 w-[44cqw] -translate-x-1/2 -translate-y-1/2" fill="none" stroke="#e8c547">
            <circle cx="50" cy="50" r="44" strokeOpacity="0.35" />
            <circle cx="50" cy="50" r="30" strokeOpacity="0.55" />
            <circle cx="50" cy="50" r="15" strokeOpacity="0.9" />
            <circle cx="50" cy="50" r="3" fill="#e8c547" stroke="none" />
            <path d="M8 92 L88 12" strokeWidth="2.2" strokeLinecap="round" stroke="#f5f0e8" />
            <path d="M88 12 L74 14 M88 12 L86 26" strokeWidth="2.2" strokeLinecap="round" stroke="#ff3b3b" />
          </svg>
          <p className="absolute inset-x-0 text-center font-mono font-bold uppercase text-[#e8c547]" style={{ bottom: '9cqw', fontSize: '3cqw', letterSpacing: '0.4em' }}>
            Sagittarius
          </p>
          <span className="absolute font-mono text-[#e8c547]/60" style={{ left: '6cqw', top: '5cqw', fontSize: '3cqw' }}>
            0{index + 1}
          </span>
        </div>
      </div>
    </a>
  );
}
