import type { ReactNode } from 'react';
import type { StampMotif } from './stamps';
import styles from './stamps.module.css';

/*
 * The printed artwork for each stamp. Every scene is drawn in a 192 x 190 window and is clipped to that
 * stamp's own window shape (an ogee arch, a round arch, a phone, a jewel cut, a porthole, a map with notched
 * corners). Colours are flat and layered, like a screen-printed travel poster.
 */

export const WINDOW_W = 192;
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

export const WINDOW_PATHS: Record<StampMotif, string> = {
  // Mughal ogee arch with a point at the top
  ui: 'M0 190V104C0 78 28 70 44 52C60 34 82 24 96 0C110 24 132 34 148 52C164 70 192 78 192 104V190Z',
  // Round arch
  web: 'M0 190V96A96 96 0 0 1 192 96V190Z',
  // A phone, with breathing room around it for the signal rings
  mobile: 'M30 4H162A26 26 0 0 1 188 30V160A26 26 0 0 1 162 186H30A26 26 0 0 1 4 160V30A26 26 0 0 1 30 4Z',
  // Chamfered (jewel-cut) corners
  brand: 'M18 0H174L192 18V172L174 190H18L0 172V18Z',
  // Porthole
  ai: 'M1 95A95 95 0 1 1 191 95A95 95 0 1 1 1 95Z',
  // Map sheet with concave corners
  advice: 'M16 0H176A16 16 0 0 0 192 16V174A16 16 0 0 0 176 190H16A16 16 0 0 0 0 174V16A16 16 0 0 0 16 0Z',
};

type ArtProps = { uid: string };

/* ───────────── 1. UI/UX: the design house ───────────── */
function UiArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-ui), Georgia, serif';
  const windows: ReactNode[] = [];
  const row = (count: number, x0: number, step: number, y: number, w: number, h: number, tag: string) => {
    for (let i = 0; i < count; i++) {
      const lit = (i + tag.length) % 3 === 0;
      windows.push(<path key={`${tag}${i}`} d={archPath(x0 + i * step, y, w, h)} fill={lit ? '#f6e3bf' : '#12213f'} />);
    }
  };
  row(9, 28, 15, 118, 9, 15, 'a');
  row(9, 28, 15, 136, 9, 15, 'b');
  row(7, 48, 14, 98, 8, 12, 'c');
  row(5, 68, 12, 80, 7, 11, 'd');
  row(3, 84, 10, 64, 6, 9, 'e');
  const letters = ['U', 'I', '/', 'U', 'X'];
  const letterFill = ['#f6e3bf', '#e58b73', '#f0a23a', '#8fd0c8', '#f6e3bf'];
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d3b0" />
          <stop offset="1" stopColor="#e8a384" />
        </linearGradient>
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-sky)`} />
      <circle cx="138" cy="72" r="34" fill="#f0a23a" />
      <circle cx="138" cy="72" r="27" fill="none" stroke="#f6c36a" strokeWidth="0.8" />
      <g fill="none" stroke="#3a2a2a" strokeWidth="1.3" strokeLinecap="round">
        <path d="M112 50q4-5 8 0q4-5 8 0" />
        <path d="M130 40q3-4 6 0q3-4 6 0" />
        <path d="M118 62q3-3 6 0q3-3 6 0" />
      </g>

      {/* the haveli: tiers of arched windows, each one a little interface card */}
      <rect x="6" y="90" width="22" height="64" fill="#c4503c" />
      <path d="M6 90a11 11 0 0 1 22 0z" fill="#e07a62" />
      <path d="M17 79v-8" stroke="#c4503c" strokeWidth="1.6" />
      <circle cx="17" cy="69" r="2" fill="#c4503c" />
      <rect x="22" y="112" width="148" height="40" fill="#d7604a" />
      <rect x="40" y="92" width="112" height="20" fill="#e07a62" />
      <rect x="60" y="76" width="72" height="16" fill="#d7604a" />
      <rect x="78" y="62" width="36" height="14" fill="#e58b73" />
      <path d="M80 62a16 16 0 0 1 32 0z" fill="#c4503c" />
      <path d="M96 46v-12" stroke="#c4503c" strokeWidth="1.6" />
      <circle cx="96" cy="32" r="2.2" fill="#c4503c" />
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
      <g stroke="#f6e3bf" fill="none" strokeWidth="1.3" strokeLinecap="round">
        <path d="M-4 138C38 98 70 166 112 130S170 98 198 116" />
      </g>
      <g stroke="#f6e3bf" strokeWidth="0.8" fill="none" opacity="0.9">
        <path d="M112 130L70 166M112 130L154 94" />
      </g>
      <rect x="109" y="127" width="6" height="6" fill="#12213f" stroke="#f6e3bf" strokeWidth="1.1" />
      <circle cx="70" cy="166" r="2.3" fill="#12213f" stroke="#f6e3bf" strokeWidth="1" />
      <circle cx="154" cy="94" r="2.3" fill="#12213f" stroke="#f6e3bf" strokeWidth="1" />

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
function WebArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-web), Georgia, serif';
  const leaf = (x: number, y: number, rot: number, s: number, fill: string, key: string) => (
    <path key={key} d="M0 0C4-5 11-5 16 0C11 5 4 5 0 0Z" transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill={fill} />
  );
  const tier = (cx: number, w: number, y: number, h: number, key: string) => (
    <g key={key}>
      <rect x={cx - w / 2} y={y} width={w} height={h} fill="#c58963" />
      <rect x={cx - w / 2} y={y} width={w} height={h} fill={`url(#${uid}-pillars)`} />
      <rect x={cx - w / 2} y={y} width={w} height="2.2" fill="#dfae8a" />
      <rect x={cx - w / 2} y={y + h - 1.4} width={w} height="1.4" fill="#8c5a3f" />
    </g>
  );
  const main = [70, 58, 46, 34, 22].map((w, i) => tier(112, w, 150 - i * 10, 10, `m${i}`));
  const side = [38, 30, 22].map((w, i) => tier(158, w, 151 - i * 9, 9, `s${i}`));
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
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-g)`} />
      <rect width="192" height="190" fill={`url(#${uid}-glow)`} />

      {/* blossom branch */}
      <path d="M194 4C170 6 150 22 124 14" stroke="#9a7a55" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {leaf(176, 8, 160, 0.9, '#e8c57e', 'l1')}
      {leaf(160, 16, 20, 0.85, '#f1d9a0', 'l2')}
      {leaf(150, 20, 150, 0.8, '#e8c57e', 'l3')}
      {leaf(138, 21, 10, 0.8, '#f1d9a0', 'l4')}
      {leaf(168, 12, 45, 0.7, '#f1d9a0', 'l5')}
      {leaf(130, 15, 175, 0.7, '#e8c57e', 'l6')}
      <circle cx="156" cy="26" r="2.6" fill="#e9a499" />
      <circle cx="132" cy="24" r="2.2" fill="#e9a499" />
      <circle cx="170" cy="22" r="2.2" fill="#e9a499" />

      <text x="96" y="48" textAnchor="middle" fontSize="5.2" letterSpacing="3" fill="#d4ecc9" style={{ fontFamily: 'var(--font-body), sans-serif', fontWeight: 600 }}>
        CRAFTED IN CODE
      </text>
      <text x="96" y="72" textAnchor="middle" fontSize="23" fill="#a9d8a4" style={{ fontFamily: font, fontWeight: 600 }}>
        Web Development
      </text>
      <text x="96" y="84" textAnchor="middle" fontSize="4.8" letterSpacing="2.6" fill="#d4ecc9" style={{ fontFamily: 'var(--font-body), sans-serif', fontWeight: 600 }}>
        FAST · RESILIENT · YOURS
      </text>

      {/* cloud, sea, stone */}
      <g fill="#f8ecce">
        <circle cx="12" cy="124" r="13" />
        <circle cx="28" cy="117" r="16" />
        <circle cx="44" cy="124" r="12" />
        <rect x="0" y="124" width="52" height="12" />
      </g>
      <path d="M0 140H96V190H0Z" fill="#5aa7a0" />
      <g fill="none" stroke="#9bd6cc" strokeWidth="1.1" strokeLinecap="round">
        <path d="M6 150q5-4 10 0t10 0t10 0t10 0" />
        <path d="M22 162q5-4 10 0t10 0t10 0t10 0" />
        <path d="M2 174q5-4 10 0t10 0t10 0t10 0" />
      </g>
      <ellipse cx="66" cy="164" rx="18" ry="8" fill="#a8704f" />
      <ellipse cx="44" cy="172" rx="14" ry="6" fill="#8f5b40" />

      <rect x="64" y="160" width="128" height="30" fill="#b87a58" />
      <path d="M64 160H192" stroke="#d29b78" strokeWidth="1.6" />
      {side}
      <ellipse cx="158" cy="128" rx="5" ry="5.5" fill="#c58963" />
      <path d="M158 123v-6" stroke="#c58963" strokeWidth="1.4" />
      <circle cx="158" cy="115" r="1.8" fill="#c58963" />
      {main}
      <ellipse cx="112" cy="106" rx="8" ry="8.5" fill="#c58963" />
      <path d="M112 98v-8" stroke="#c58963" strokeWidth="1.6" />
      <circle cx="112" cy="88" r="2.2" fill="#c58963" />
      <path d="M104 155l-5 4 5 4M120 155l5 4-5 4M115 153l-6 12" stroke="#7a4a33" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <g>
        <ellipse cx="146" cy="170" rx="18" ry="8" fill="#d6a07d" />
        <circle cx="130" cy="166" r="5.5" fill="#d6a07d" />
        <path d="M126 162l-3-5M133 162l1-5" stroke="#d6a07d" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <g fill="none" stroke="#f6e9c9" strokeWidth="1.1" strokeLinecap="round">
        <path d="M142 104q3-3 6 0q3-3 6 0" />
        <path d="M170 96q2.5-2.5 5 0q2.5-2.5 5 0" />
      </g>
    </>
  );
}

/* ───────────── 3. Mobile: the night window ───────────── */
function MobileArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-mobile), sans-serif';
  const rng = seeded(11);
  const stars = Array.from({ length: 22 }, (_, i) => (
    <circle key={i} cx={n(40 + rng() * 112)} cy={n(14 + rng() * 80)} r={n(0.4 + rng() * 0.8)} fill="#fff1d6" opacity={n(0.5 + rng() * 0.5)} />
  ));
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
      {/* signal rings */}
      <g fill="none" stroke="#1c1b4d">
        <circle cx="96" cy="95" r="82" opacity="0.28" strokeWidth="1" />
        <circle cx="96" cy="95" r="102" opacity="0.2" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="96" cy="95" r="124" opacity="0.14" strokeWidth="1" />
      </g>
      <rect x="30" y="4" width="132" height="182" rx="26" fill="#0f0e2e" />
      <g clipPath={`url(#${uid}-screen)`}>
        <rect x="35" y="9" width="122" height="172" fill={`url(#${uid}-sky)`} />
        {stars}
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
        <rect x="78" y="173" width="36" height="3" rx="1.5" fill="#fff1d6" opacity="0.75" />
      </g>
      {/* notification cards breaking out of the frame */}
      <g filter={`url(#${uid}-card)`}>
        <rect x="3" y="116" width="58" height="24" rx="7" fill="#fff1d6" />
        <circle cx="15" cy="128" r="5.5" fill="#2ec4b6" />
        <rect x="25" y="122" width="26" height="3" rx="1.5" fill="#1c1b4d" opacity="0.8" />
        <rect x="25" y="129" width="18" height="3" rx="1.5" fill="#1c1b4d" opacity="0.35" />
        <rect x="131" y="62" width="58" height="24" rx="7" fill="#2ec4b6" />
        <circle cx="143" cy="74" r="5.5" fill="#fff1d6" />
        <rect x="153" y="68" width="26" height="3" rx="1.5" fill="#0f0e2e" opacity="0.8" />
        <rect x="153" y="75" width="18" height="3" rx="1.5" fill="#0f0e2e" opacity="0.4" />
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
  const sparkle = (x: number, y: number, s: number, key: string) => (
    <path key={key} d="M0-6Q0 0 6 0Q0 0 0 6Q0 0-6 0Q0 0 0-6Z" transform={`translate(${x} ${y}) scale(${s})`} fill="#f9e9b8" />
  );
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-bg`} cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#4a1d62" />
          <stop offset="1" stopColor="#210a30" />
        </radialGradient>
        <path id={`${uid}-ring`} d="M96 86m-66 0a66 66 0 1 1 132 0a66 66 0 1 1-132 0" />
      </defs>
      <rect width="192" height="190" fill={`url(#${uid}-bg)`} />
      {rays}
      {/* deco fans in the corners */}
      <g fill="none" stroke="#d8aa52" strokeWidth="0.7" opacity="0.55">
        {[12, 20, 28, 36].map((r) => (
          <g key={r}>
            <path d={`M0 ${r}A${r} ${r} 0 0 0 ${r} 0`} />
            <path d={`M192 ${r}A${r} ${r} 0 0 1 ${192 - r} 0`} />
          </g>
        ))}
      </g>
      <circle cx="96" cy="86" r="73" fill="none" stroke="#d8aa52" strokeWidth="0.9" />
      <circle cx="96" cy="86" r="59" fill="none" stroke="#d8aa52" strokeWidth="0.6" strokeDasharray="1 3" />
      <text fontSize="6.6" letterSpacing="3.1" fill="#e9c97a" style={{ fontFamily: font, fontWeight: 700 }}>
        <textPath href={`#${uid}-ring`}>NAME ✦ MARK ✦ COLOUR ✦ TYPE ✦ VOICE ✦ RULES ✦ NAME ✦</textPath>
      </text>
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
      {sparkle(150, 46, 1.1, 'a')}
      {sparkle(40, 108, 0.8, 'b')}
      {sparkle(128, 24, 0.7, 'c')}
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

/* ───────────── 5. AI: the archer's star chart ───────────── */
function AiArt({ uid }: ArtProps) {
  const font = 'var(--font-stamp-ai), sans-serif';
  const rng = seeded(7);
  const stars = Array.from({ length: 54 }, (_, i) => {
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * 92;
    return (
      <circle
        key={i}
        className={i % 4 === 0 ? styles.twinkle : undefined}
        style={i % 4 === 0 ? { animationDelay: `${(i % 7) * 0.45}s` } : undefined}
        cx={n(96 + r * Math.cos(a))}
        cy={n(95 + r * Math.sin(a))}
        r={n(0.4 + rng() * 0.9)}
        fill="#fff"
        opacity={n(0.45 + rng() * 0.5)}
      />
    );
  });
  const nodes: [number, number, number][] = [
    [52, 112, 2.4],
    [70, 96, 3.2],
    [98, 88, 4],
    [122, 100, 3.2],
    [132, 124, 3.4],
    [112, 144, 3],
    [84, 142, 3],
    [68, 124, 2.8],
  ];
  const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 1], [7, 0], [2, 7]];
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const [x0, y0] = polar(96, 95, 97, i * 6);
    const [x1, y1] = polar(96, 95, i % 5 === 0 ? 102 : 99.5, i * 6);
    return <path key={i} d={`M${n(x0)} ${n(y0)}L${n(x1)} ${n(y1)}`} />;
  });
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-bg`} cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#21406a" />
          <stop offset="1" stopColor="#0a1322" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="#ffd982" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffd982" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${uid}-clip)`}>
        <rect width="192" height="190" fill={`url(#${uid}-bg)`} />
        {stars}
        <g fill="none">
          <ellipse cx="96" cy="95" rx="80" ry="28" transform="rotate(-24 96 95)" stroke="#3fb8af" strokeWidth="0.7" opacity="0.6" />
          <ellipse cx="96" cy="95" rx="62" ry="62" stroke="#f4b13d" strokeWidth="0.5" strokeDasharray="1 3.5" opacity="0.6" />
          <ellipse cx="96" cy="95" rx="40" ry="40" stroke="#f4b13d" strokeWidth="0.4" opacity="0.35" />
        </g>
        <circle cx="30" cy="104" r="2.4" fill="#3fb8af" />
        <circle cx="164" cy="116" r="2" fill="#3fb8af" />
        <g stroke="#f4b13d" strokeWidth="0.9" opacity="0.85" strokeLinecap="round">
          {edges.map(([a, b]) => (
            <path key={`${a}${b}`} d={`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`} />
          ))}
        </g>
        {/* faint network lines: a hint of the model behind the sky */}
        <g stroke="#3fb8af" strokeWidth="0.5" opacity="0.45">
          <path d="M52 112L30 104M132 124L164 116M98 88L96 60M112 144L120 168M84 142L72 166" />
        </g>
        {/* the archer's arrow */}
        <g stroke="#ffe3a1" strokeWidth="1.3" strokeLinecap="round" fill="none">
          <path d="M122 100L156 54" />
          <path d="M122 100l-3 -7M122 100l-7 -2M126 94l-3 -7M126 94l-7 -2" strokeWidth="1" />
        </g>
        <path d="M158 51l-1 8 -6 -5z" fill="#ffe3a1" />
        <circle cx="160" cy="48" r="14" fill={`url(#${uid}-glow)`} />
        <path d="M160 40Q160 48 168 48Q160 48 160 56Q160 48 152 48Q160 48 160 40Z" fill="#fff6d8" />
        {nodes.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r * 3.4} fill={`url(#${uid}-glow)`} opacity="0.7" />
            <circle cx={x} cy={y} r={r} fill="#ffe3a1" />
          </g>
        ))}
        <text x="96" y="32" textAnchor="middle" fontSize="5.4" letterSpacing="2.8" fill="#9ed8d2" style={{ fontFamily: font, fontWeight: 600 }}>
          THE ARCHER&apos;S CHART
        </text>
        <text x="96" y="165" textAnchor="middle" fontSize="9" letterSpacing="3" fill="#ffd982" style={{ fontFamily: font, fontWeight: 400 }}>
          AI INTEGRATION
        </text>
        <path d="M70 172h52" stroke="#ffd982" strokeWidth="0.5" opacity="0.6" />
      </g>
      <circle cx="96" cy="95" r="95" fill="none" stroke="#f4b13d" strokeWidth="1.1" />
      <g stroke="#14243d" strokeWidth="0.6" opacity="0.8">{ticks}</g>
      <g fill="#14243d" opacity="0.75" fontSize="9" fontStyle="italic" style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}>
        <text x="6" y="16">α</text>
        <text x="176" y="16">β</text>
        <text x="6" y="184">γ</text>
        <text x="176" y="184">δ</text>
      </g>
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

      {/* compass rose */}
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
      <text x={cx} y={cy - 41.5} textAnchor="middle" fontSize="10" fontStyle="italic" fill="#b5532f" style={{ fontFamily: font }}>
        N
      </text>

      {/* the decision route: dead ends crossed out, one road reaches the pin */}
      <g fill="none" stroke="#1a2b2b" strokeWidth="1.2" strokeDasharray="3 3" strokeLinecap="round">
        <path d="M150 138V118" />
        <path d="M150 118C150 100 146 90 146 70" />
        <path d="M150 118C140 110 126 106 118 94" />
        <path d="M150 118C160 110 172 106 176 94" />
      </g>
      <g stroke="#b5532f" strokeWidth="1.8" strokeLinecap="round">
        <path d="M114.5 90.5l7 7M121.5 90.5l-7 7" />
        <path d="M172.5 90.5l7 7M179.5 90.5l-7 7" />
      </g>
      <circle cx="150" cy="140" r="3.6" fill="#1a2b2b" />
      <circle cx="150" cy="140" r="6.5" fill="none" stroke="#1a2b2b" strokeWidth="0.7" />
      <path d="M139 56L146 70L153 56Z" fill="#e0a73a" stroke="#1a2b2b" strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="146" cy="50" r="9" fill="#e0a73a" stroke="#1a2b2b" strokeWidth="0.9" />
      <circle cx="146" cy="50" r="3.4" fill="#1a2b2b" />

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
    default:
      return <AdviceArt uid={uid} />;
  }
}
