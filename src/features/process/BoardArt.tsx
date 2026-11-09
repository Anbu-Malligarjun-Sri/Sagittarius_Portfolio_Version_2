import type { ReactNode } from 'react';
import type { StageId } from './stages';
import styles from './board.module.css';

/*
 * The things pinned to the board, one kind of evidence per stage: three photographs, a blueprint print, a
 * newspaper clipping and an index card. The photographs are small flat illustrations, drawn in code.
 */

const n = (value: number) => value.toFixed(2);

/** Print-style finish for a photograph: a white border, a little gloss and a darkened edge. */
function Polaroid({ children }: { children: ReactNode }) {
  return (
    <div className={styles.polaroid}>
      <div className={styles.photo}>{children}</div>
    </div>
  );
}

/* ── 01 · a photograph of the discovery workshop: sticky notes on a whiteboard ── */
function Workshop() {
  const notes: [number, number, number, string][] = [
    [20, 16, -4, '#f7d154'],
    [48, 20, 3, '#f4a3b5'],
    [76, 15, -2, '#8fc3ea'],
    [104, 21, 4, '#a6d68f'],
    [26, 46, 3, '#8fc3ea'],
    [58, 50, -3, '#f7d154'],
    [90, 48, 2, '#f4a3b5'],
    [118, 46, -4, '#f7d154'],
  ];
  return (
    <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="160" height="120" fill="#cfc6b4" />
      <rect x="10" y="8" width="140" height="78" rx="2" fill="#f6f4ee" stroke="#8d8a82" strokeWidth="3" />
      <rect x="38" y="86" width="84" height="4" fill="#8d8a82" />
      {notes.map(([x, y, rot, color]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <rect width="22" height="20" fill={color} />
          <path d="M3 6h14M3 11h10M3 16h12" stroke="#00000033" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
      <g fill="none" stroke="#3b3b44" strokeWidth="1.2" strokeLinecap="round">
        <path d="M44 28q8 10 18 20" />
        <path d="M100 36q-4 6-8 12" />
        <path d="M138 36q-2 6-8 8" />
      </g>
      <path d="M58 46l4 2-5 1z" fill="#3b3b44" />
      <rect y="96" width="160" height="24" fill="#7a5a3c" />
      <rect x="18" y="90" width="38" height="20" rx="2" fill="#44505e" />
      <rect x="22" y="93" width="30" height="13" fill="#9fc4e8" />
      <rect x="128" y="88" width="13" height="14" rx="2" fill="#e8e2d4" />
      <path d="M141 92q6 2 0 7" fill="none" stroke="#e8e2d4" strokeWidth="2" />
    </svg>
  );
}

/* ── 03 · a photograph of a monitor full of code ── */
function CodeScreen() {
  // [indent, colour, width, second colour, second width]
  const lines: [number, string, number, string | null, number][] = [
    [0, '#ff7b72', 14, '#e6edf3', 30],
    [1, '#d2a8ff', 18, '#79c0ff', 26],
    [1, '#e6edf3', 38, null, 0],
    [2, '#ffa657', 10, '#7ee787', 36],
    [2, '#e6edf3', 44, null, 0],
    [1, '#ff7b72', 12, '#e6edf3', 24],
    [0, '#79c0ff', 24, null, 0],
    [0, '#7ee787', 30, '#e6edf3', 18],
  ];
  return (
    <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="160" height="120" fill="#26202a" />
      <rect x="18" y="10" width="124" height="80" rx="4" fill="#14161c" stroke="#3b3f4c" strokeWidth="3" />
      <rect x="24" y="16" width="112" height="68" fill="#0d1117" />
      {lines.map(([indent, c1, w1, c2, w2], i) => {
        const y = 22 + i * 7.6;
        const x = 30 + indent * 7;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w1} height="3.4" rx="1" fill={c1} />
            {c2 ? <rect x={x + w1 + 3} y={y} width={w2} height="3.4" rx="1" fill={c2} /> : null}
          </g>
        );
      })}
      <rect x="30" y="83" width="3" height="3.4" fill="#e6edf3" opacity="0.9" />
      <path d="M72 90h16l4 14H68z" fill="#2b2f3a" />
      <rect x="54" y="104" width="52" height="4" rx="2" fill="#2b2f3a" />
      <rect y="108" width="160" height="12" fill="#3a2f2a" />
      <rect x="124" y="96" width="11" height="13" rx="2" fill="#d9d2c2" />
      <rect x="22" y="110" width="40" height="5" rx="1.5" fill="#4a4f5c" />
    </svg>
  );
}

/* ── 05 · a photograph of a launch at dusk ── */
function Launch() {
  const stars = [[16, 14], [38, 28], [122, 12], [146, 30], [100, 20], [60, 10], [136, 52], [24, 50]];
  return (
    <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="launch-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14213d" />
          <stop offset="0.6" stopColor="#5b4a7a" />
          <stop offset="1" stopColor="#f4a261" />
        </linearGradient>
      </defs>
      <rect width="160" height="120" fill="url(#launch-sky)" />
      {stars.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#fff6dc" opacity={n(0.5 + ((x * y) % 5) / 10)} />
      ))}
      <path d="M0 96Q40 82 80 94T160 90V120H0Z" fill="#1b2a3a" />
      <path d="M74 76Q80 112 86 76Z" fill="#ffb703" />
      <path d="M77 76Q80 100 83 76Z" fill="#fb5607" />
      <path d="M80 14C92 28 94 52 90 76H70C66 52 68 28 80 14Z" fill="#f1ede2" />
      <path d="M80 14C86 20 89 26 90 32H70C71 26 74 20 80 14Z" fill="#d6453d" />
      <circle cx="80" cy="48" r="6" fill="#5db7e8" stroke="#2a3a4a" strokeWidth="2" />
      <path d="M70 62L58 84L70 76Z" fill="#d6453d" />
      <path d="M90 62L102 84L90 76Z" fill="#d6453d" />
      <g fill="#fff" opacity="0.88">
        <circle cx="58" cy="98" r="12" />
        <circle cx="78" cy="103" r="14" />
        <circle cx="100" cy="98" r="12" />
        <circle cx="46" cy="105" r="9" />
        <circle cx="114" cy="104" r="9" />
      </g>
      <rect y="108" width="160" height="12" fill="#1b2a3a" />
    </svg>
  );
}

/* ── 02 · a blueprint print of the wireframes ── */
function Blueprint() {
  return (
    <div className={styles.blueprint}>
      <svg viewBox="0 0 190 150" aria-hidden="true">
        <defs>
          <pattern id="bp-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="#dfeaff" strokeOpacity="0.14" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="190" height="150" fill="url(#bp-grid)" />
        <g fill="none" stroke="#dfeaff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="12" y="10" width="130" height="104" rx="3" />
          <path d="M12 24H142" />
          <circle cx="19" cy="17" r="1.4" fill="#dfeaff" />
          <circle cx="25" cy="17" r="1.4" fill="#dfeaff" />
          <path d="M96 17H106M112 17H122M128 17H136" />
          <rect x="20" y="32" width="114" height="32" />
          <path d="M20 32L134 64M134 32L20 64" strokeOpacity="0.55" />
          <rect x="20" y="72" width="34" height="30" />
          <rect x="60" y="72" width="34" height="30" />
          <rect x="100" y="72" width="34" height="30" />
          <path d="M20 108H78" strokeOpacity="0.7" />
          <path d="M12 130H142M12 126V134M142 126V134" />
        </g>
        <g fill="#dfeaff" style={{ fontFamily: 'var(--font-handwriting), cursive' }}>
          <text x="148" y="36" fontSize="12">nav?</text>
          <text x="148" y="74" fontSize="12">hero</text>
          <text x="77" y="128" fontSize="10" textAnchor="middle">1440</text>
        </g>
        <path d="M146 40Q140 46 134 44M146 78Q140 80 136 76" fill="none" stroke="#dfeaff" strokeWidth="1" strokeLinecap="round" />
        <rect x="118" y="136" width="66" height="11" fill="none" stroke="#dfeaff" strokeWidth="1" />
        <text x="151" y="144.3" fontSize="6" letterSpacing="1.2" textAnchor="middle" fill="#dfeaff" style={{ fontFamily: 'var(--font-mono), monospace' }}>
          WIREFRAME v2
        </text>
      </svg>
    </div>
  );
}

/* ── 04 · a newspaper clipping about a bug caught before launch ── */
function Clipping() {
  return (
    <div className={styles.clipWrap}>
      <div className={styles.clipping}>
        <p className={styles.clipKicker}>The QA Times · Late edition</p>
        <h4 className={styles.clipHead}>Bug caught before launch</h4>
        <div className={styles.clipRule} />
        <div className={styles.clipBody}>
          <div className={styles.clipFigure}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <rect width="48" height="48" fill="#cfc7b0" />
              <path d="M8 36h32M8 30h20M8 24h26" stroke="#8a826c" strokeWidth="2" strokeLinecap="round" />
              <circle cx="30" cy="22" r="9" fill="#e8e0c8" fillOpacity="0.7" stroke="#2b2418" strokeWidth="2.4" />
              <path d="M37 29l8 8" stroke="#2b2418" strokeWidth="3.4" strokeLinecap="round" />
              <ellipse cx="30" cy="23" rx="3" ry="3.8" fill="#2b2418" />
              <path d="M26 20l-3-2M34 20l3-2M26 24l-3 0M34 24l3 0" stroke="#2b2418" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.clipLines}>
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <p className={styles.clipSmall}>Tests run. Fixes verified. Nothing ships until it passes.</p>
      </div>
    </div>
  );
}

/* ── 06 · an index card from the support log ── */
function IndexCard() {
  return (
    <div className={styles.indexCard}>
      <p className={styles.cardHead}>Support log</p>
      <ul>
        <li>✓ Monitoring on</li>
        <li>✓ Fixes shipped</li>
        <li>→ Next iteration</li>
      </ul>
      <span className={styles.rubber}>On call</span>
    </div>
  );
}

export function Artefact({ id }: { id: StageId }) {
  switch (id) {
    case 'discovery':
      return (
        <Polaroid>
          <Workshop />
        </Polaroid>
      );
    case 'design':
      return <Blueprint />;
    case 'development':
      return (
        <Polaroid>
          <CodeScreen />
        </Polaroid>
      );
    case 'testing':
      return <Clipping />;
    case 'deployment':
      return (
        <Polaroid>
          <Launch />
        </Polaroid>
      );
    default:
      return <IndexCard />;
  }
}
