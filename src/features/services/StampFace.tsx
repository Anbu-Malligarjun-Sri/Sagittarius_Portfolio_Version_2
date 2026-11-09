import { useId } from 'react';
import type { CSSProperties } from 'react';
import { StampArt, WINDOW_H, WINDOW_PATHS } from './StampArt';
import { splitTimeline } from './stamps';
import type { Stamp } from './stamps';
import styles from './stamps.module.css';

/** The ink postmark that lands on a stamp once it has been reserved. */
export function Postmark({ date }: { date: string }) {
  const uid = useId().replace(/:/g, '');
  const when = new Date(date);
  const day = when.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  const year = String(when.getFullYear());
  return (
    <svg className={styles.postmark} viewBox="0 0 170 110" aria-hidden="true">
      <defs>
        <path id={`pm-${uid}`} d="M55 55m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0" />
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="55" cy="55" r="51" />
        <circle cx="55" cy="55" r="29" strokeWidth="1.4" />
        <path d="M108 38q6-6 12 0t12 0t12 0t12 0M108 52q6-6 12 0t12 0t12 0t12 0M108 66q6-6 12 0t12 0t12 0t12 0" strokeWidth="2" />
      </g>
      <text fill="currentColor" fontSize="9.5" fontWeight="700" letterSpacing="2.6" style={{ fontFamily: 'var(--font-mono), monospace' }}>
        <textPath href={`#pm-${uid}`} startOffset="0">
          SAGITTARIUZ ✦ RESERVED ✦ SAGITTARIUZ ✦
        </textPath>
      </text>
      <g fill="currentColor" style={{ fontFamily: 'var(--font-mono), monospace' }} textAnchor="middle" fontWeight="700">
        <text x="55" y="52" fontSize="12">{day}</text>
        <text x="55" y="66" fontSize="10">{year}</text>
      </g>
    </svg>
  );
}

const STATUS_DOT: Record<Stamp['status'], string> = { AVAILABLE: '#2e9b5a', LIMITED: '#d89a1c', BOOKING: '#d2552b' };

// The sheet is 240 x 300. Perforation holes sit on a regular pitch, with a hole on every corner.
const SHEET_W = 240;
const SHEET_H = 300;
const HOLE_R = 8;
const holes: [number, number][] = [];
for (let i = 0; i <= 10; i++) holes.push([i * 24, 0], [i * 24, SHEET_H]);
for (let j = 1; j < 12; j++) holes.push([0, j * 25], [SHEET_W, j * 25]);

// The paper grain is a pre-rendered image (not a live SVG filter), so stamps with moving parts don't re-run the noise every frame.
const GRAIN = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 240 300"><filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.1  0 0 0 0 0.06  1.1 0 0 0 -0.42"/></filter><rect width="240" height="300" filter="url(#g)"/></svg>',
)}`;

const label = { fontFamily: 'var(--font-body), sans-serif' } as const;

type StampFaceProps = {
  stamp: Stamp;
  /** ISO date when the visitor reserved this stamp; shows the postmark. */
  reservedAt?: string;
  className?: string;
  style?: CSSProperties;
};

/** One printed, perforated stamp, drawn as a single SVG so it stays sharp at any size. */
export default function StampFace({ stamp, reservedAt, className = '', style }: StampFaceProps) {
  const uid = useId().replace(/:/g, '');
  const { amount, unit } = splitTimeline(stamp.timeline);
  const ink = stamp.ink;
  return (
    <div className={`${styles.stamp} ${className}`} style={style}>
      <svg viewBox={`0 0 ${SHEET_W} ${SHEET_H}`} className={styles.sheet} role="img" aria-label={`${stamp.name} stamp`}>
        <defs>
          <mask id={`${uid}-cut`}>
            <rect width={SHEET_W} height={SHEET_H} fill="#fff" />
            {holes.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={HOLE_R} fill="#000" />
            ))}
          </mask>
          <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f9f0dc" />
            <stop offset="1" stopColor="#eee0c3" />
          </linearGradient>
          <clipPath id={`${uid}-clip`}>
            <path d={WINDOW_PATHS[stamp.motif]} />
          </clipPath>
          <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g mask={`url(#${uid}-cut)`}>
          <rect width={SHEET_W} height={SHEET_H} fill={`url(#${uid}-paper)`} />

          <g transform="translate(24 24)">
            {stamp.motif === 'ai' ? (
              <StampArt motif={stamp.motif} uid={uid} />
            ) : (
              <>
                <g clipPath={`url(#${uid}-clip)`}>
                  <StampArt motif={stamp.motif} uid={uid} />
                </g>
                <path d={WINDOW_PATHS[stamp.motif]} fill="none" stroke={ink} strokeOpacity="0.55" strokeWidth="0.9" />
              </>
            )}
          </g>

          {/* the information band: number | amount | status, then a tracked line, like the reference stamps */}
          <g transform={`translate(0 ${24 + WINDOW_H + 8})`} fill={ink}>
            <text x="24" y="17" fontSize="6.4" letterSpacing="2" fontWeight="700" style={label}>
              Nº {stamp.no}
            </text>
            <text x="24" y="28" fontSize="5.2" letterSpacing="1.4" opacity="0.7" style={label}>
              {stamp.category.toUpperCase()}
            </text>
            <path d="M74 6V42M168 6V42" stroke={ink} strokeOpacity="0.45" strokeWidth="0.7" />
            <text x="121" y="33" textAnchor="middle" fontSize="29" fontWeight="700" letterSpacing="-0.5" style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}>
              {amount}
            </text>
            <text x="121" y="43.5" textAnchor="middle" fontSize="5.8" letterSpacing="3" fontWeight="700" style={label}>
              {unit}
            </text>
            <text x="173" y="17" fontSize="5" letterSpacing="2" opacity="0.65" style={label}>
              STATUS
            </text>
            <circle cx="208" cy="15.4" r="2.4" fill={STATUS_DOT[stamp.status]} />
            <text x="173" y="29" fontSize="5.6" letterSpacing="1.1" fontWeight="700" style={label}>
              {stamp.status}
            </text>
            <text x="120" y="60" textAnchor="middle" fontSize="6" letterSpacing="2.8" fontWeight="600" style={label}>
              SAGITTARIUZ ✦ {stamp.name.toUpperCase()}
            </text>
          </g>

          <image href={GRAIN} width={SHEET_W} height={SHEET_H} opacity="0.34" style={{ mixBlendMode: 'multiply' }} />
          <rect className={styles.band} x="-60" y="-30" width="48" height="360" fill={`url(#${uid}-sheen)`} />
        </g>
      </svg>
      {reservedAt && <Postmark date={reservedAt} />}
    </div>
  );
}
