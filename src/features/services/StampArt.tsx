import type { CSSProperties, ReactNode } from 'react';
import type { StampMotif } from './stamps';
import styles from './stamps.module.css';

/*
 * The printed artwork for each stamp. Every scene is drawn in a 192 x 190 window and is clipped to that
 * stamp's own window shape (an ogee arch, a round arch, a phone, a jewel cut, a vase panel, a map with notched
 * corners). Colours are flat and layered, like a screen-printed travel poster. Small details move
 * (see the animation classes in stamps.module.css); they all stop under prefers-reduced-motion.
 */

export const WINDOW_H = 190;

const n = (value: number) => value.toFixed(2);
const polar = (cx: number, cy: number, radius: number, degrees: number) => {
  const a = (degrees * Math.PI) / 180;
  return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const;
};

/** Tiny deterministic random so server and browser draw identical stars. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Arched window shape: rectangle with a semicircular head. */
const archPath = (x: number, y: number, w: number, h: number) => `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;

/** A staggered delay, for things that should not all move in step. */
const delayed = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

export const WINDOW_PATHS: Record<StampMotif, string> = {
  // Mughal ogee arch with a point at the top
  ui: 'M0 190V104C0 78 28 70 44 52C60 34 82 24 96 0C110 24 132 34 148 52C164 70 192 78 192 104V190Z',
  // Round arch
  web: 'M0 190V96A96 96 0 0 1 192 96V190Z',
  // A phone, with breathing room around it for the signal rings
  mobile: 'M30 4H162A26 26 0 0 1 188 30V160A26 26 0 0 1 162 186H30A26 26 0 0 1 4 160V30A26 26 0 0 1 30 4Z',
  // Chamfered (jewel-cut) corners
  brand: 'M18 0H174L192 18V172L174 190H18L0 172V18Z',
  // The panel of a Greek vase: a wide oval between two bands of key pattern
  ai: 'M12 95A84 78 0 1 1 180 95A84 78 0 1 1 12 95Z',
  // A flat-topped hexagon, like a lantern room
  seo: 'M48 0H144L192 95L144 190H48L0 95Z',
  // Map sheet with concave corners
  advice: 'M16 0H176A16 16 0 0 0 192 16V174A16 16 0 0 0 176 190H16A16 16 0 0 0 0 174V16A16 16 0 0 0 16 0Z',
};

type ArtProps = { uid: string };

const bird = (x: number, y: number, size: number, stroke: string, delay: number, key: string) => (
  <g key={key} className={`${styles.fb} ${styles.flap}`} style={delayed(delay)}>
    <path d={`M${x} ${y}q${size / 2} ${-size / 1.6} ${size} 0q${size / 2} ${-size / 1.6} ${size} 0`} fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
  </g>
);

/* ───────────── 1. UI/UX: the design house ───────────── */
function UiArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-ui), Georgia, serif';
  const windows: ReactNode[] = [];
  const row = (count: number, x0: number, step: number, y: number, w: number, h: number, tag: string) => {
    for (let i = 0; i < count; i++) {
      const lit = (i + tag.length) % 3 === 0;
      // a few dark windows light up in turn, like screens waking
      const wakes = !lit && (i * 3 + tag.charCodeAt(0)) % 5 === 0;
      windows.push(
        <path
          key={`${tag}${i}`}
          d={archPath(x0 + i * step, y, w, h)}
          fill={lit ? '#f6e3bf' : '#12213f'}
          className={wakes ? styles.wake : undefined}
          style={wakes ? delayed(((i * 1.7 + tag.charCodeAt(0)) % 9) * 0.8) : undefined}
        />,
      );
    }
  };
  row(9, 28, 15, 118, 9, 15, 'a');
  row(9, 28, 15, 136, 9, 15, 'b');
  row(7, 48, 14, 98, 8, 12, 'c');
  row(5, 68, 12, 80, 7, 11, 'd');
  row(3, 84, 10, 64, 6, 9, 'e');
  const letters = ['U', 'I', '/', 'U', 'X'];
  const letterFill = ['#f6e3bf', '#e58b73', '#f0a23a', '#8fd0c8', '#f6e3bf'];
  const rosette = (x: number, y: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-4.4" rx="1.9" ry="4.2" transform={`rotate(${i * 45})`} fill={i % 2 ? '#f0a23a' : '#d7604a'} />
      ))}
      <circle r="1.8" fill="#f6e3bf" />
    </g>
  );
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d3b0" />
          <stop offset="1" stopColor="#e8a384" />
        </linearGradient>
        <pattern id={`${uid}-jali`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M3 0L6 3L3 6L0 3Z" fill="none" stroke="#f3a08a" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-sky)`} />
      <circle className={`${styles.fb} ${styles.breathe}`} cx="138" cy="72" r="34" fill="#f0a23a" />
      <circle cx="138" cy="72" r="27" fill="none" stroke="#f6c36a" strokeWidth="0.8" />
      {bird(112, 50, 8, '#3a2a2a', 0, 'b1')}
      {bird(130, 40, 6, '#3a2a2a', 0.5, 'b2')}
      {bird(118, 62, 6, '#3a2a2a', 1.1, 'b3')}
      {rosette(58, 66, 'r1')}

      {/* the haveli: tiers of arched windows, each one a little interface card */}
      <rect x="6" y="90" width="22" height="64" fill="#c4503c" />
      <rect x="6" y="90" width="22" height="64" fill={`url(#${uid}-jali)`} />
      <path d="M6 90a11 11 0 0 1 22 0z" fill="#e07a62" />
      <path d="M17 79v-8" stroke="#c4503c" strokeWidth="1.6" />
      <circle cx="17" cy="69" r="2" fill="#c4503c" />
      <rect x="22" y="112" width="148" height="40" fill="#d7604a" />
      <rect x="40" y="92" width="112" height="20" fill="#e07a62" />
      <rect x="60" y="76" width="72" height="16" fill="#d7604a" />
      <rect x="78" y="62" width="36" height="14" fill="#e58b73" />
      {/* little domed pavilions at the corners of the tiers */}
      {[[44, 92, 5], [148, 92, 5], [64, 76, 4], [128, 76, 4], [26, 112, 5], [166, 112, 5]].map(([x, y, r]) => (
        <g key={`${x}${y}`}>
          <path d={`M${x - r} ${y}a${r} ${r} 0 0 1 ${r * 2} 0z`} fill="#c4503c" />
          <path d={`M${x} ${y - r}v-3`} stroke="#c4503c" strokeWidth="1" />
        </g>
      ))}
      <path d="M80 62a16 16 0 0 1 32 0z" fill="#c4503c" />
      <path d="M96 62V47M88 62Q88 52 92 48M104 62Q104 52 100 48" stroke="#e58b73" strokeWidth="0.7" fill="none" />
      <path d="M96 46v-18" stroke="#c4503c" strokeWidth="1.6" />
      <circle cx="96" cy="27" r="2" fill="#c4503c" />
      <path className={styles.flag} d="M97 28l13 3.2L97 35z" fill="#f0a23a" />
      <path d="M22 112h148M40 92h112M60 76h72" stroke="#f3a08a" strokeWidth="1.4" />
      {windows}
      <path d="M0 150h192" stroke="#b9493a" strokeWidth="8" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={i * 8} y="144" width="5" height="5" fill="#b9493a" />
      ))}

      <circle cx="16" cy="168" r="34" fill="#f0a23a" opacity="0.95" />
      <circle cx="16" cy="168" r="22" fill="none" stroke="#12213f" strokeWidth="0.9" />
      <circle cx="184" cy="176" r="40" fill="#2c6e73" />
      <circle cx="184" cy="176" r="28" fill="none" stroke="#f6e3bf" strokeWidth="0.8" strokeDasharray="1.5 3" />
      <circle cx="172" cy="148" r="11" fill="#1f5a58" />
      <circle cx="160" cy="153" r="8" fill="#1f5a58" />

      {/* a pen-tool curve with its anchor points and handles */}
      <path d="M-4 138C38 98 70 166 112 130S170 98 198 116" stroke="#f6e3bf" fill="none" strokeWidth="1.3" strokeLinecap="round" />
      <g stroke="#f6e3bf" strokeWidth="0.8" fill="none" opacity="0.9">
        <path d="M112 130L70 166M112 130L154 94" />
      </g>
      <rect className={`${styles.fb} ${styles.pulse}`} x="109" y="127" width="6" height="6" fill="#12213f" stroke="#f6e3bf" strokeWidth="1.1" />
      <circle cx="70" cy="166" r="2.3" fill="#12213f" stroke="#f6e3bf" strokeWidth="1" />
      <circle className={styles.pulse} style={delayed(0.8)} cx="154" cy="94" r="2.3" fill="#12213f" stroke="#f6e3bf" strokeWidth="1" />

      <rect y="150" width="192" height="40" fill="#12213f" />
      <path d="M0 150h192" stroke="#f0a23a" strokeWidth="1" />
      <text x="96" y="182" textAnchor="middle" fontSize="35" letterSpacing="2.5" style={{ fontFamily: font }}>
        {letters.map((l, i) => (
          <tspan key={i} fill={letterFill[i]}>
            {l}
          </tspan>
        ))}
      </text>
    </>
  );
}

/* ───────────── 2. Web: the temple of code ───────────── */
const wave = (y: number) => `M-20 ${y}q5-4 10 0${'t10 0'.repeat(13)}`;

function WebArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-web), Georgia, serif';
  const rng = seeded(21);
  const stars = Array.from({ length: 16 }, (_, i) => (
    <circle
      key={i}
      className={styles.twinkle}
      style={delayed((i % 6) * 0.6)}
      cx={n(14 + rng() * 164)}
      cy={n(10 + rng() * 90)}
      r={n(0.5 + rng() * 0.6)}
      fill="#e8f4dc"
    />
  ));
  const leaf = (x: number, y: number, rot: number, s: number, fill: string, key: string) => (
    <path key={key} d="M0 0C4-5 11-5 16 0C11 5 4 5 0 0Z" transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill={fill} />
  );
  const tier = (cx: number, w: number, y: number, h: number, niches: number, key: string, door = false) => (
    <g key={key}>
      <rect x={cx - w / 2} y={y} width={w} height={h} fill="#c58963" />
      <rect x={cx - w / 2} y={y} width={w} height={h} fill={`url(#${uid}-pillars)`} />
      <rect x={cx - w / 2} y={y} width={w} height="2.2" fill="#dfae8a" />
      <rect x={cx - w / 2} y={y + h - 1.4} width={w} height="1.4" fill="#8c5a3f" />
      {door ? (
        <path d={archPath(cx - 5, y + 2, 10, h - 2)} fill="#4f2f20" />
      ) : (
        Array.from({ length: niches }, (_, k) => (
          <path key={k} d={archPath(cx - w / 2 + (w / (niches + 1)) * (k + 1) - 2, y + 3.4, 4, h - 4.6)} fill="#6d3f2a" />
        ))
      )}
    </g>
  );
  const main = [70, 58, 46, 34, 22].map((w, i) => tier(112, w, 150 - i * 10, 10, 5 - i, `m${i}`, i === 0));
  const side = [38, 30, 22].map((w, i) => tier(158, w, 151 - i * 9, 9, 3 - i, `s${i}`));
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e5a40" />
          <stop offset="1" stopColor="#174a33" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.2" cy="0.75" r="0.5">
          <stop offset="0" stopColor="#f9e7b4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#f9e7b4" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${uid}-pillars`} width="5" height="12" patternUnits="userSpaceOnUse">
          <rect x="0" width="1.5" height="12" fill="#9c6648" opacity="0.75" />
        </pattern>
        <clipPath id={`${uid}-sea`}>
          <rect x="0" y="140" width="72" height="50" />
        </clipPath>
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-g)`} />
      <rect width="192" height="190" fill={`url(#${uid}-glow)`} />
      {stars}
      <g fill="#f6e9c9">
        <circle cx="24" cy="34" r="8" opacity="0.9" />
        <circle cx="28" cy="31.5" r="7.2" fill="#1e5a40" />
      </g>

      {/* blossom branch */}
      <path d="M194 4C170 6 150 22 124 14" stroke="#9a7a55" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <g className={`${styles.fb} ${styles.sway}`}>
        {leaf(176, 8, 160, 0.9, '#e8c57e', 'l1')}
        {leaf(160, 16, 20, 0.85, '#f1d9a0', 'l2')}
        {leaf(150, 20, 150, 0.8, '#e8c57e', 'l3')}
        {leaf(138, 21, 10, 0.8, '#f1d9a0', 'l4')}
        {leaf(168, 12, 45, 0.7, '#f1d9a0', 'l5')}
        {leaf(130, 15, 175, 0.7, '#e8c57e', 'l6')}
        <circle cx="156" cy="26" r="2.6" fill="#e9a499" />
        <circle cx="132" cy="24" r="2.2" fill="#e9a499" />
        <circle cx="170" cy="22" r="2.2" fill="#e9a499" />
      </g>

      <text x="96" y="48" textAnchor="middle" fontSize="5.2" letterSpacing="3" fill="#d4ecc9" style={{ fontFamily: 'var(--font-body), sans-serif', fontWeight: 600 }}>
        CRAFTED IN CODE
      </text>
      <text x="96" y="72" textAnchor="middle" fontSize="23" fill="#a9d8a4" style={{ fontFamily: font, fontWeight: 600 }}>
        Web Development
      </text>
      <text x="96" y="84" textAnchor="middle" fontSize="4.8" letterSpacing="2.6" fill="#d4ecc9" style={{ fontFamily: 'var(--font-body), sans-serif', fontWeight: 600 }}>
        FAST · RESILIENT · YOURS
      </text>

      {/* a cloud that drifts, and a sea that rolls */}
      <g className={styles.drift}>
        <g fill="#f8ecce">
          <circle cx="12" cy="124" r="13" />
          <circle cx="28" cy="117" r="16" />
          <circle cx="44" cy="124" r="12" />
          <rect x="-24" y="124" width="76" height="12" />
          <circle cx="-8" cy="124" r="13" />
        </g>
      </g>
      <path d="M0 140H96V190H0Z" fill="#5aa7a0" />
      <g clipPath={`url(#${uid}-sea)`}>
        <g className={styles.roll} fill="none" stroke="#9bd6cc" strokeWidth="1.1" strokeLinecap="round">
          <path d={wave(150)} />
          <path d={wave(162)} transform="translate(10 0)" />
          <path d={wave(174)} />
        </g>
      </g>
      <ellipse cx="66" cy="164" rx="18" ry="8" fill="#a8704f" />
      <ellipse cx="44" cy="172" rx="14" ry="6" fill="#8f5b40" />

      <rect x="64" y="160" width="128" height="30" fill="#b87a58" />
      <path d="M64 160H192" stroke="#d29b78" strokeWidth="1.6" />
      <rect x="92" y="160" width="40" height="3" fill="#cf9470" />
      <rect x="96" y="163" width="32" height="3" fill="#c3875f" />
      <rect x="100" y="166" width="24" height="3" fill="#b87a58" />
      <text x="112" y="182" textAnchor="middle" fontSize="9" fill="#8a553c" style={{ fontFamily: 'var(--font-mono), monospace', fontWeight: 700 }}>
        {'</>'}
      </text>
      {side}
      <ellipse cx="158" cy="128" rx="5" ry="5.5" fill="#c58963" />
      <path d="M158 123v-6" stroke="#c58963" strokeWidth="1.4" />
      <circle cx="158" cy="115" r="1.8" fill="#c58963" />
      {main}
      <ellipse cx="112" cy="106" rx="8" ry="8.5" fill="#c58963" />
      <path d="M112 98v-8" stroke="#c58963" strokeWidth="1.6" />
      <circle cx="112" cy="88" r="2.2" fill="#c58963" />
      <path className={styles.flag} d="M113 88.5l11 3-11 3z" fill="#e9a499" />
      <g>
        <ellipse cx="146" cy="170" rx="18" ry="8" fill="#d6a07d" />
        <circle cx="130" cy="166" r="5.5" fill="#d6a07d" />
        <path d="M126 162l-3-5M133 162l1-5" stroke="#d6a07d" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      {bird(142, 104, 6, '#f6e9c9', 0, 'w1')}
      {bird(170, 96, 5, '#f6e9c9', 0.7, 'w2')}
      {bird(120, 128, 4, '#f6e9c9', 1.3, 'w3')}
    </>
  );
}

/* ───────────── 3. Mobile: the night window ───────────── */
function MobileArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-mobile), sans-serif';
  const rng = seeded(11);
  const stars = Array.from({ length: 22 }, (_, i) => (
    <circle
      key={i}
      className={i % 3 === 0 ? styles.twinkle : undefined}
      style={i % 3 === 0 ? delayed((i % 5) * 0.7) : undefined}
      cx={n(40 + rng() * 112)}
      cy={n(14 + rng() * 80)}
      r={n(0.4 + rng() * 0.8)}
      fill="#fff1d6"
      opacity={n(0.5 + rng() * 0.5)}
    />
  ));
  const dock = ['#2ec4b6', '#ffb38a', '#9b8cff', '#fff1d6'];
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fadfc4" />
          <stop offset="1" stopColor="#f3b793" />
        </linearGradient>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1946" />
          <stop offset="0.55" stopColor="#5a3d8c" />
          <stop offset="1" stopColor="#ff9a76" />
        </linearGradient>
        <radialGradient id={`${uid}-moon`}>
          <stop offset="0.35" stopColor="#ffe3b8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffe3b8" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-screen`}>
          <rect x="35" y="9" width="122" height="172" rx="21" />
        </clipPath>
        <filter id={`${uid}-card`} x="-20%" y="-30%" width="140%" height="190%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0f0e2e" floodOpacity="0.45" />
        </filter>
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-bg)`} />
      {/* signal rings that ping outwards */}
      <g fill="none" stroke="#1c1b4d" strokeWidth="1">
        {[82, 102, 124].map((r, i) => (
          <circle key={r} className={`${styles.fb} ${styles.sonar}`} style={delayed(i * 1.3)} cx="96" cy="95" r={r} />
        ))}
      </g>
      <rect x="30" y="4" width="132" height="182" rx="26" fill="#0f0e2e" />
      <g clipPath={`url(#${uid}-screen)`}>
        <rect x="35" y="9" width="122" height="172" fill={`url(#${uid}-sky)`} />
        {stars}
        <path className={styles.shoot} d="M104 24L88 16" stroke="#fff1d6" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="96" cy="112" r="46" fill={`url(#${uid}-moon)`} />
        <circle cx="96" cy="112" r="24" fill="#ffdcae" />
        <path d="M35 132C60 118 76 128 96 120C116 112 134 126 157 118V181H35Z" fill="#6a4c9c" />
        <path d="M35 146C56 134 80 146 100 138C122 130 140 144 157 138V181H35Z" fill="#2f2a6b" />
        <path d="M35 160C60 150 84 162 108 156C130 150 144 160 157 156V181H35Z" fill="#1a1745" />
        <g fill="#ffb38a" opacity="0.85">
          <circle cx="62" cy="152" r="1.4" />
          <circle cx="104" cy="160" r="1.4" />
          <circle cx="128" cy="154" r="1.4" />
        </g>
        <text x="96" y="52" textAnchor="middle" fontSize="15" letterSpacing="2" fill="#fff1d6" style={{ fontFamily: font, fontWeight: 800 }}>
          MOBILE
        </text>
        <text x="96" y="66" textAnchor="middle" fontSize="7.4" letterSpacing="7" fill="#ffb38a" style={{ fontFamily: font, fontWeight: 700 }}>
          APPS
        </text>
        <rect x="76" y="14" width="40" height="9" rx="4.5" fill="#0f0e2e" />
        {/* status bar */}
        <text x="47" y="21.4" fontSize="5.4" fill="#fff1d6" style={{ fontFamily: font, fontWeight: 700 }}>
          9:41
        </text>
        <g fill="#fff1d6">
          <rect x="130" y="19" width="1.6" height="3" rx="0.4" />
          <rect x="133" y="17.6" width="1.6" height="4.4" rx="0.4" />
          <rect x="136" y="16.2" width="1.6" height="5.8" rx="0.4" />
          <rect x="140" y="17" width="9" height="5" rx="1.4" fill="none" stroke="#fff1d6" strokeWidth="0.6" />
          <rect x="141" y="18" width="6" height="3" rx="0.7" />
        </g>
        {/* the dock */}
        {dock.map((c, i) => (
          <rect key={c} x={62 + i * 17} y="149" width="12" height="12" rx="3.4" fill={c} opacity="0.92" />
        ))}
        <rect x="78" y="173" width="36" height="3" rx="1.5" fill="#fff1d6" opacity="0.75" />
      </g>
      {/* notification cards breaking out of the frame, bobbing gently */}
      <g filter={`url(#${uid}-card)`}>
        <g className={styles.bob}>
          <rect x="3" y="116" width="58" height="24" rx="7" fill="#fff1d6" />
          <circle cx="15" cy="128" r="5.5" fill="#2ec4b6" />
          <rect x="25" y="122" width="26" height="3" rx="1.5" fill="#1c1b4d" opacity="0.8" />
          <rect x="25" y="129" width="18" height="3" rx="1.5" fill="#1c1b4d" opacity="0.35" />
        </g>
        <g className={styles.bob} style={delayed(-1.3)}>
          <rect x="131" y="62" width="58" height="24" rx="7" fill="#2ec4b6" />
          <circle cx="143" cy="74" r="5.5" fill="#fff1d6" />
          <rect x="153" y="68" width="26" height="3" rx="1.5" fill="#0f0e2e" opacity="0.8" />
          <rect x="153" y="75" width="18" height="3" rx="1.5" fill="#0f0e2e" opacity="0.4" />
        </g>
      </g>
    </>
  );
}

/* ───────────── 4. Brand: the jewel seal ───────────── */
function BrandArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-brand), Georgia, serif';
  const rays = Array.from({ length: 18 }, (_, i) => {
    const [x0, y0] = polar(96, 86, 150, i * 20 - 90);
    const [x1, y1] = polar(96, 86, 150, i * 20 + 10 - 90);
    return <path key={i} d={`M96 86L${n(x0)} ${n(y0)}L${n(x1)} ${n(y1)}Z`} fill="#d8aa52" opacity="0.09" />;
  });
  const dots = Array.from({ length: 36 }, (_, i) => {
    const [x, y] = polar(96, 86, 79, i * 10);
    return <circle key={i} cx={n(x)} cy={n(y)} r={i % 3 === 0 ? 1.1 : 0.6} fill="#d8aa52" />;
  });
  const sparkle = (x: number, y: number, s: number, key: string, delay: number) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <path className={`${styles.fb} ${styles.glint}`} style={delayed(delay)} d="M0-6Q0 0 6 0Q0 0 0 6Q0 0-6 0Q0 0 0-6Z" transform={`scale(${s})`} fill="#f9e9b8" />
    </g>
  );
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-bg`} cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#4a1d62" />
          <stop offset="1" stopColor="#210a30" />
        </radialGradient>
        <path id={`${uid}-ring`} d="M96 86m-66 0a66 66 0 1 1 132 0a66 66 0 1 1-132 0" />
        <clipPath id={`${uid}-gem`}>
          <path d="M48 76L72 52H120L144 76L96 126Z" />
        </clipPath>
        <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-bg)`} />
      {rays}
      <rect x="6" y="6" width="180" height="178" fill="none" stroke="#d8aa52" strokeWidth="0.5" opacity="0.4" />
      {/* deco fans in the top corners */}
      <g fill="none" stroke="#d8aa52" strokeWidth="0.7" opacity="0.55">
        {[12, 20, 28, 36].map((r) => (
          <g key={r}>
            <path d={`M0 ${r}A${r} ${r} 0 0 0 ${r} 0`} />
            <path d={`M192 ${r}A${r} ${r} 0 0 1 ${192 - r} 0`} />
          </g>
        ))}
      </g>
      {/* the seal turns slowly */}
      <g className={`${styles.vb} ${styles.spin}`} style={{ transformOrigin: '96px 86px' }}>
        <circle cx="96" cy="86" r="73" fill="none" stroke="#d8aa52" strokeWidth="0.9" />
        <circle cx="96" cy="86" r="59" fill="none" stroke="#d8aa52" strokeWidth="0.6" strokeDasharray="1 3" />
        {dots}
        <text fontSize="6.6" letterSpacing="3.1" fill="#e9c97a" style={{ fontFamily: font, fontWeight: 700 }}>
          <textPath href={`#${uid}-ring`}>NAME ✦ MARK ✦ COLOUR ✦ TYPE ✦ VOICE ✦ RULES ✦ NAME ✦</textPath>
        </text>
      </g>
      {/* the gem */}
      <g stroke="#3b1850" strokeWidth="0.6" strokeLinejoin="round">
        <path d="M48 76L72 52L72 76Z" fill="#f3d98a" />
        <path d="M72 52L96 76L72 76Z" fill="#e2b95e" />
        <path d="M72 52L120 52L96 76Z" fill="#f9e9b8" />
        <path d="M120 52L120 76L96 76Z" fill="#e2b95e" />
        <path d="M120 52L144 76L120 76Z" fill="#f3d98a" />
        <path d="M48 76L72 76L96 126Z" fill="#b98a3e" />
        <path d="M72 76L96 76L96 126Z" fill="#e2b95e" />
        <path d="M96 76L120 76L96 126Z" fill="#c99a48" />
        <path d="M120 76L144 76L96 126Z" fill="#9c7230" />
      </g>
      <g clipPath={`url(#${uid}-gem)`}>
        <rect className={styles.shimmer} x="-30" y="40" width="26" height="100" fill={`url(#${uid}-shine)`} opacity="0.85" style={{ mixBlendMode: 'soft-light' }} />
      </g>
      {sparkle(150, 46, 1.1, 'a', 0)}
      {sparkle(40, 108, 0.8, 'b', 1.1)}
      {sparkle(128, 24, 0.7, 'c', 2.1)}
      <g stroke="#d8aa52" strokeWidth="0.7">
        <path d="M14 168H64M128 168H178" />
      </g>
      <path d="M96 163l4 5-4 5-4-5z" fill="#d8aa52" />
      <text x="96" y="184" textAnchor="middle" fontSize="12" letterSpacing="3.2" fill="#e9c97a" style={{ fontFamily: font, fontWeight: 700 }}>
        BRAND IDENTITY
      </text>
    </>
  );
}

/* ───────────── 5. AI: Athena's owl, on a Greek vase ───────────── */
function greekKey(y: number) {
  let d = `M24 ${y + 9}H168`;
  for (let x = 24; x < 160; x += 12) d += `M${x} ${y + 9}V${y}H${x + 8}V${y + 6}H${x + 3}V${y + 3}H${x + 5}`;
  return d;
}

function AiArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-ai), sans-serif';
  const rng = seeded(5);
  const rays = Array.from({ length: 40 }, (_, i) => {
    const [x0, y0] = polar(96, 96, 61, i * 9);
    const [x1, y1] = polar(96, 96, i % 2 ? 66 : 70, i * 9);
    return <path key={i} d={`M${n(x0)} ${n(y0)}L${n(x1)} ${n(y1)}`} />;
  });
  const crosses = [[34, 66], [160, 62], [30, 118], [164, 122], [48, 42], [146, 40]].map(([x, y], i) => (
    <path
      key={i}
      className={styles.twinkle}
      style={delayed(i * 0.55)}
      d={`M${x - 2.6} ${y}H${x + 2.6}M${x} ${y - 2.6}V${y + 2.6}`}
      stroke="#f1d9b0"
      strokeWidth="0.9"
      strokeLinecap="round"
    />
  ));
  const dust = Array.from({ length: 14 }, (_, i) => <circle key={i} cx={n(26 + rng() * 140)} cy={n(30 + rng() * 130)} r="0.6" fill="#f1d9b0" opacity="0.5" />);
  const rosette = (x: number, y: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y})`} fill="#a9502b">
      <circle r="3.4" fill="none" stroke="#a9502b" strokeWidth="0.8" />
      {Array.from({ length: 8 }, (_, i) => {
        const [px, py] = polar(0, 0, 5.8, i * 45);
        return <circle key={i} cx={n(px)} cy={n(py)} r="1" />;
      })}
    </g>
  );
  // The white of each eye stays put and blinks; the iris and pupil slide toward the cursor (--ex / --ey are set from the pointer).
  const eye = (cx: number, delay: number) => (
    <g key={cx}>
      <circle cx={cx} cy="80" r="17" fill="#e8ab7c" stroke="#17110f" strokeWidth="0.9" />
      <circle cx={cx} cy="80" r="14" fill="none" stroke="#17110f" strokeWidth="0.5" strokeDasharray="1.2 1.6" />
      <g className={`${styles.fb} ${styles.blink}`} style={delayed(delay)}>
        <circle cx={cx} cy="80" r="11" fill="#f1d9b0" stroke="#17110f" strokeWidth="0.8" />
        <g className={styles.pupil}>
          <circle cx={cx} cy="80" r="8.4" fill="none" stroke="#2fd0be" strokeWidth="1" />
          <circle cx={cx} cy="80" r="6.6" fill="#17110f" />
          <circle cx={cx - 2.2} cy="77.8" r="1.8" fill="#f1d9b0" />
          <circle className={styles.pulse} cx={cx + 2} cy="82.4" r="0.9" fill="#2fd0be" />
        </g>
      </g>
    </g>
  );
  const featherL = [0, 1, 2, 3].map((i) => `M${58 + i * 2} ${96 + i * 14}Q${52 + i * 4} ${106 + i * 14} ${60 + i * 5} ${112 + i * 13}`);
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-bg`} cx="0.5" cy="0.45" r="0.65">
          <stop offset="0" stopColor="#4a2a1a" />
          <stop offset="1" stopColor="#17110f" />
        </radialGradient>
      </defs>

      {/* the key-pattern bands above and below the panel, and a rosette in each corner */}
      <g fill="none" stroke="#a9502b" strokeWidth="1.2" strokeLinejoin="miter">
        <path d={greekKey(3)} />
        <path d={greekKey(178)} />
      </g>
      {rosette(10, 9, 'r1')}
      {rosette(182, 9, 'r2')}
      {rosette(10, 183, 'r3')}
      {rosette(182, 183, 'r4')}

      <g clipPath={`url(#${uid}-clip)`}>
        <rect width="192" height="190" fill={`url(#${uid}-bg)`} />
        {dust}
        <circle cx="96" cy="96" r="58" fill="none" stroke="#6b3a22" strokeWidth="0.8" />
        <g stroke="#8a4a2a" strokeWidth="0.8">{rays}</g>
        {crosses}

        {/* the owl: terracotta figure, black line work */}
        <g stroke="#17110f" strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round">
          <path d="M96 52C128 52 140 80 138 112C136 144 118 160 96 160C74 160 56 144 54 112C52 80 64 52 96 52Z" fill="#cf6a3c" />
          <path d="M66 60L60 38L82 54Z" fill="#cf6a3c" />
          <path d="M126 60L132 38L110 54Z" fill="#cf6a3c" />
          <path d="M56 90C46 116 54 144 74 154C66 134 62 112 66 92Z" fill="#a9502b" />
          <path d="M136 90C146 116 138 144 118 154C126 134 130 112 126 92Z" fill="#a9502b" />
          <g fill="none" strokeWidth="0.7">
            {featherL.map((d) => (
              <path key={d} d={d} />
            ))}
            {featherL.map((d, i) => (
              <path key={`r${i}`} d={`M${134 - i * 2} ${96 + i * 14}Q${140 - i * 4} ${106 + i * 14} ${132 - i * 5} ${112 + i * 13}`} />
            ))}
          </g>
          {/* brow, facial discs, eyes, beak */}
          <path d="M63 70Q80 56 95 72M129 70Q112 56 97 72" fill="none" strokeWidth="1" />
          {eye(80, 0)}
          {eye(112, 0)}
          <path d="M96 84L90 96L96 106L102 96Z" fill="#f1d9b0" />
          <path d="M96 84V100" fill="none" strokeWidth="0.5" />
        </g>

        {/* circuit traces run through the feathers, like a mind under the plumage */}
        <g fill="none" stroke="#2fd0be" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
          <path className={styles.trace} d="M96 143V151" />
          <path className={styles.trace} d="M84 126H72V138H66" />
          <path className={styles.trace} d="M108 126H120V138H126" />
          <path className={styles.trace} d="M88 140L80 148H74" />
          <path className={styles.trace} d="M104 140L112 148H118" />
          <path className={styles.trace} d="M78 106V114H70" style={delayed(0.6)} />
          <path className={styles.trace} d="M114 106V114H122" style={delayed(0.9)} />
        </g>
        <g fill="#17110f" stroke="#2fd0be" strokeWidth="0.9">
          {[[96, 151], [66, 138], [126, 138], [74, 148], [118, 148], [70, 114], [122, 114]].map(([x, y], i) => (
            <circle key={i} className={styles.pulse} style={delayed(i * 0.3)} cx={x} cy={y} r="1.7" />
          ))}
        </g>
        {/* the "AI" plate on its chest */}
        <circle cx="96" cy="127" r="15" fill="#17110f" stroke="#f1d9b0" strokeWidth="1" />
        <circle cx="96" cy="127" r="12.6" fill="none" stroke="#2fd0be" strokeWidth="0.6" />
        <text x="96" y="132.6" textAnchor="middle" fontSize="14" letterSpacing="1" fill="#f1d9b0" style={{ fontFamily: font, fontWeight: 600 }}>
          AI
        </text>
        {/* feet on a perch */}
        <g stroke="#f1d9b0" strokeWidth="1.2" strokeLinecap="round" fill="none">
          <path d="M84 160l-4 6M84 160v7M84 160l4 6M108 160l-4 6M108 160v7M108 160l4 6" />
          <path d="M62 167H130" strokeWidth="2.2" />
        </g>
        <text x="96" y="33" textAnchor="middle" fontSize="5" letterSpacing="2.6" fill="#e8ab7c" style={{ fontFamily: font, fontWeight: 600 }}>
          ARTIFICIAL WISDOM
        </text>
      </g>
      <path d={WINDOW_PATHS.ai} fill="none" stroke="#a9502b" strokeWidth="1.6" />
      <path d="M17 95A79 73 0 1 1 175 95A79 73 0 1 1 17 95Z" fill="none" stroke="#f1d9b0" strokeWidth="0.5" strokeDasharray="1 2.5" opacity="0.6" />
    </>
  );
}

/* ───────────── 6. Consulting: the chart room ───────────── */
function blob(cx: number, cy: number, r: number, seed: number) {
  const count = 12;
  const pts = Array.from({ length: count }, (_, i) => {
    const wobble = 1 + 0.16 * Math.sin(i * 1.7 + seed) + 0.1 * Math.sin(i * 3.1 + seed * 2);
    return polar(cx, cy, r * wobble, (i * 360) / count);
  });
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < count; i++) {
    const p0 = pts[(i - 1 + count) % count];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % count];
    const p3 = pts[(i + 2) % count];
    d += `C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])} ${n(p2[1])}`;
  }
  return `${d}Z`;
}

function AdviceArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-advice), Georgia, serif';
  const cx = 62;
  const cy = 102;
  const point = (angle: number, length: number, half: number, light: string, dark: string, key: string) => {
    const [tx, ty] = polar(cx, cy, length, angle);
    const [lx, ly] = polar(cx, cy, half, angle - 45);
    const [rx, ry] = polar(cx, cy, half, angle + 45);
    return (
      <g key={key}>
        <path d={`M${n(tx)} ${n(ty)}L${n(lx)} ${n(ly)}L${cx} ${cy}Z`} fill={dark} />
        <path d={`M${n(tx)} ${n(ty)}L${n(rx)} ${n(ry)}L${cx} ${cy}Z`} fill={light} />
      </g>
    );
  };
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const [x0, y0] = polar(cx, cy, 36, i * 7.5);
    const [x1, y1] = polar(cx, cy, i % 4 === 0 ? 31 : 33.5, i * 7.5);
    return <path key={i} d={`M${n(x0)} ${n(y0)}L${n(x1)} ${n(y1)}`} />;
  });
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e5c2" />
          <stop offset="1" stopColor="#e4cf9c" />
        </linearGradient>
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-bg)`} />
      <g stroke="#14575a" strokeWidth="0.5" opacity="0.14">
        {[32, 64, 96, 128, 160].map((v) => (
          <path key={v} d={`M${v} 0V190M0 ${v}H192`} />
        ))}
      </g>
      <g fill="none" stroke="#14575a" strokeWidth="0.8" opacity="0.4">
        {[9, 19, 29, 39, 49, 60, 72].map((r, i) => (
          <path key={r} d={blob(146, 64, r, 1.3)} opacity={n(1 - i * 0.08)} />
        ))}
      </g>
      <path d={blob(146, 64, 9, 1.3)} fill="#14575a" opacity="0.13" />
      {/* the names of places on a map of a decision */}
      <g fill="#14575a" opacity="0.7" style={{ fontFamily: font }} fontStyle="italic" fontSize="5">
        <text x="112" y="132" transform="rotate(-6 112 132)">Clarity</text>
        <text x="20" y="36" transform="rotate(-4 20 36)">Scope</text>
        <text x="158" y="104" transform="rotate(5 158 104)">Risk</text>
      </g>

      {/* compass rose: it settles to north, a little to either side */}
      <g className={`${styles.vb} ${styles.swing}`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r="40" fill="#f6ebcd" stroke="#1a2b2b" strokeWidth="0.9" />
        <circle cx={cx} cy={cy} r="36" fill="none" stroke="#1a2b2b" strokeWidth="0.5" />
        <g stroke="#1a2b2b" strokeWidth="0.6">{ticks}</g>
        {point(-45, 24, 6, '#3d8f8a', '#14575a', 'd1')}
        {point(45, 24, 6, '#3d8f8a', '#14575a', 'd2')}
        {point(135, 24, 6, '#3d8f8a', '#14575a', 'd3')}
        {point(-135, 24, 6, '#3d8f8a', '#14575a', 'd4')}
        {point(-90, 34, 7.5, '#e57a4d', '#b5532f', 'n')}
        {point(0, 30, 7.5, '#3d8f8a', '#14575a', 'e')}
        {point(90, 30, 7.5, '#3d8f8a', '#14575a', 's')}
        {point(180, 30, 7.5, '#3d8f8a', '#14575a', 'w')}
        <circle cx={cx} cy={cy} r="3.2" fill="#f6ebcd" stroke="#1a2b2b" strokeWidth="0.7" />
      </g>
      <text x={cx} y={cy - 43} textAnchor="middle" fontSize="10" fontStyle="italic" fill="#b5532f" style={{ fontFamily: font }}>
        N
      </text>

      {/* the decision route: dead ends crossed out, one road reaches the pin */}
      <g fill="none" stroke="#1a2b2b" strokeWidth="1.2" strokeDasharray="3 3" strokeLinecap="round">
        <path className={styles.march} d="M150 138V118" />
        <path className={styles.march} d="M150 118C150 100 146 90 146 70" />
        <path className={styles.march} d="M150 118C140 110 126 106 118 94" />
        <path className={styles.march} d="M150 118C160 110 172 106 176 94" />
      </g>
      <g stroke="#b5532f" strokeWidth="1.8" strokeLinecap="round">
        <path d="M114.5 90.5l7 7M121.5 90.5l-7 7" />
        <path d="M172.5 90.5l7 7M179.5 90.5l-7 7" />
      </g>
      <circle cx="150" cy="140" r="3.6" fill="#1a2b2b" />
      <circle className={`${styles.fb} ${styles.sonar}`} cx="150" cy="140" r="7" fill="none" stroke="#1a2b2b" strokeWidth="0.8" />
      <g className={styles.hop}>
        <path d="M139 56L146 70L153 56Z" fill="#e0a73a" stroke="#1a2b2b" strokeWidth="0.9" strokeLinejoin="round" />
        <circle cx="146" cy="50" r="9" fill="#e0a73a" stroke="#1a2b2b" strokeWidth="0.9" />
        <circle cx="146" cy="50" r="3.4" fill="#1a2b2b" />
      </g>

      {/* title ribbon */}
      <path d="M8 148H184L176 162L184 176H8L16 162Z" fill="#14575a" />
      <path d="M12 150.5H180M12 173.5H180" stroke="#e0a73a" strokeWidth="0.7" />
      <text x="96" y="168" textAnchor="middle" fontSize="15.5" fontStyle="italic" letterSpacing="2" fill="#f4e6c3" style={{ fontFamily: font }}>
        Consulting
      </text>
      <rect x="5" y="5" width="182" height="180" rx="12" fill="none" stroke="#14575a" strokeWidth="0.9" />
    </>
  );
}

/* ───────────── 7. SEO: the lighthouse that gets you found ───────────── */
const rollingWave = (y: number) => `M-20 ${y}q5-4 10 0${'t10 0'.repeat(25)}`;

function SeoArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-seo), Georgia, serif';
  const rng = seeded(31);
  const stars = Array.from({ length: 18 }, (_, i) => (
    <circle
      key={i}
      className={styles.twinkle}
      style={delayed((i % 6) * 0.55)}
      cx={n(30 + rng() * 132)}
      cy={n(8 + rng() * 86)}
      r={n(0.5 + rng() * 0.7)}
      fill="#fff6dc"
    />
  ));
  const bands = Array.from({ length: 8 }, (_, i) => (
    <rect key={i} x="80" y={56 + i * 9.4} width="32" height="4.7" fill="#d3382c" />
  ));
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#061d26" />
          <stop offset="0.42" stopColor="#0c4152" />
          <stop offset="0.64" stopColor="#e08d4a" />
          <stop offset="0.65" stopColor="#0d4552" />
          <stop offset="1" stopColor="#06222c" />
        </linearGradient>
        <radialGradient id={`${uid}-horizon`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffc46b" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffc46b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-lamp`}>
          <stop offset="0" stopColor="#fff0b8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffd36b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-beam`} gradientUnits="userSpaceOnUse" x1="96" y1="0" x2="230" y2="0">
          <stop offset="0" stopColor="#ffe08a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-tower`}>
          <path d="M84 130L89 56H103L108 130Z" />
        </clipPath>
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-sky)`} />
      {stars}
      <circle cx="40" cy="50" r="6.5" fill="#f6e9c9" />
      <circle cx="43" cy="48" r="5.8" fill="#0a3140" />
      <ellipse cx="96" cy="120" rx="104" ry="26" fill={`url(#${uid}-horizon)`} />

      {/* the sea, rolling, with the beam's gold laid along the horizon */}
      <g>
        <path d="M-10 128H202" stroke="#ffd36b" strokeWidth="0.8" opacity="0.5" />
        <g className={styles.roll} fill="none" stroke="#9bd6cc" strokeWidth="1" strokeLinecap="round" opacity="0.5">
          <path d={rollingWave(136)} />
          <path d={rollingWave(148)} transform="translate(10 0)" />
          <path d={rollingWave(160)} />
        </g>
      </g>

      {/* a little ship, making for the light */}
      <g className={styles.bob}>
        <path d="M24 118H54l-4 7H28Z" fill="#08151a" />
        <path d="M39 99V117" stroke="#08151a" strokeWidth="1.2" />
        <path d="M39 101V116H28Z" fill="#f0e2c0" />
        <path d="M41.5 105V116H53Z" fill="#e6d3a6" />
      </g>

      {/* the beam sweeps from one side to the other */}
      <g className={`${styles.vb} ${styles.sweep}`} style={{ transformOrigin: '96px 49px' }}>
        <path d="M96 49L230 26V72Z" fill={`url(#${uid}-beam)`} />
      </g>

      {/* the lighthouse */}
      <path d="M56 160C66 142 82 133 96 130C110 133 126 142 136 160Z" fill="#16282e" />
      <path d="M62 156C72 142 84 135 96 133" fill="none" stroke="#2c4a52" strokeWidth="1.2" />
      <path d="M84 130L89 56H103L108 130Z" fill="#efe6d2" />
      <g clipPath={`url(#${uid}-tower)`}>
        {bands}
        <rect x="98" y="50" width="16" height="84" fill="#000" opacity="0.18" />
        <rect x="82" y="50" width="6" height="84" fill="#fff" opacity="0.12" />
      </g>
      <path d="M92 130V121Q96 117 100 121V130Z" fill="#16282e" />
      <rect x="94" y="92" width="4" height="6" rx="1" fill="#ffe08a" />
      <rect x="94" y="74" width="4" height="6" rx="1" fill="#ffe08a" />
      <rect x="86.5" y="54" width="19" height="3.4" fill="#1c1c1c" />
      <path d="M88 50.5H104M89 50.5V54M96 50.5V54M103 50.5V54" stroke="#1c1c1c" strokeWidth="0.8" fill="none" />
      <circle className={`${styles.fb} ${styles.pulse}`} cx="96" cy="48" r="20" fill={`url(#${uid}-lamp)`} />
      <rect x="90" y="41" width="12" height="11" fill="#ffe08a" stroke="#1c1c1c" strokeWidth="0.8" />
      <path d="M96 41V52" stroke="#1c1c1c" strokeWidth="0.6" />
      <path d="M88 41L96 32L104 41Z" fill="#d3382c" />
      <path d="M96 32V24" stroke="#1c1c1c" strokeWidth="1.1" />
      <path className={styles.flag} d="M97 24.5l11 2.6-11 2.6Z" fill="#ffd36b" />
      <path d="M52 160q6-4 12 0t12 0t12 0t12 0t12 0t12 0t12 0" fill="none" stroke="#bfe3e6" strokeWidth="0.9" opacity="0.7" />

      <text x="96" y="178" textAnchor="middle" fontSize="29" letterSpacing="5" fill="#ffe08a" style={{ fontFamily: font }}>
        SEO
      </text>
      <text x="96" y="187.2" textAnchor="middle" fontSize="4.6" letterSpacing="3.2" fill="#9ed8d2" style={{ fontFamily: 'var(--font-body), sans-serif', fontWeight: 700 }}>
        BE FOUND
      </text>
    </>
  );
}

export function StampArt({ motif, uid }: { motif: StampMotif; uid: string }) {
  switch (motif) {
    case 'ui':
      return <UiArt uid={uid} />;
    case 'web':
      return <WebArt uid={uid} />;
    case 'mobile':
      return <MobileArt uid={uid} />;
    case 'brand':
      return <BrandArt uid={uid} />;
    case 'ai':
      return <AiArt uid={uid} />;
    case 'seo':
      return <SeoArt uid={uid} />;
    default:
      return <AdviceArt uid={uid} />;
  }
}
