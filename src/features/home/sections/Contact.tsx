"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');

.typewriter-os-wrapper {
  --char-width: 9.6px;
  --line-height: 28px;
  overflow: hidden; 
  background-color: #0a0102; 
  user-select: none;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(130, 20, 25, 0.4) 0%, rgba(20, 2, 5, 0.95) 100%),
    repeating-linear-gradient(45deg, rgba(80, 10, 15, 0.1) 25%, transparent 25%, transparent 75%, rgba(80, 10, 15, 0.1) 75%, rgba(80, 10, 15, 0.1)),
    repeating-linear-gradient(45deg, rgba(80, 10, 15, 0.1) 25%, transparent 25%, transparent 75%, rgba(80, 10, 15, 0.1) 75%, rgba(80, 10, 15, 0.1));
  background-position: 0 0, 40px 40px, 40px 40px;
  background-size: 100% 100%, 80px 80px, 80px 80px;
}

.volumetric-ray {
  position: absolute;
  inset: -50%;
  background: linear-gradient(115deg, transparent 0%, transparent 40%, rgba(255, 235, 200, 0.15) 45%, rgba(255, 235, 200, 0.25) 50%, transparent 55%, transparent 100%);
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 999;
  animation: ray-shift 20s infinite alternate ease-in-out;
}

@keyframes ray-shift {
  0% { transform: translateY(-5%) rotate(0deg); }
  100% { transform: translateY(5%) rotate(2deg); }
}

.ink-bleed {
  filter: url(#ink-displacement) drop-shadow(0px 0px 0.5px rgba(0,0,0,0.8));
  color: #1a1614;
  text-shadow: 0px 0px 1px rgba(0,0,0,0.4), 0.5px 0.5px 0px rgba(25,10,10,0.2);
}

.ink-strike-anim {
  animation: ink-strike 0.1s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
}

@keyframes ink-strike {
  0% { opacity: 0; transform: scale(0.8) translateY(-2px); filter: blur(2px); }
  50% { opacity: 1; transform: scale(1.05) translateY(0); filter: blur(0px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
}

.mat-bakelite-black {
  background: linear-gradient(135deg, #2b2b2b 0%, #151515 40%, #050505 100%), 
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
  box-shadow: 
    inset 0 2px 3px rgba(255,255,255,0.15),
    inset 0 -15px 30px rgba(0,0,0,0.9),
    0 40px 60px rgba(0,0,0,0.8),
    0 10px 20px rgba(0,0,0,0.6);
  border: 1px solid rgba(255,255,255,0.05);
}

.mat-brushed-metal {
  background: linear-gradient(90deg, #666 0%, #a0a0a0 20%, #707070 50%, #909090 80%, #555 100%);
  background-size: 200% 100%;
  box-shadow: 
    inset 0 1px 2px rgba(255,255,255,0.9), 
    inset 0 -2px 4px rgba(0,0,0,0.8),
    0 5px 15px rgba(0,0,0,0.9);
  border-bottom: 2px solid rgba(0,0,0,0.8);
}

.mat-platen-rubber {
  background: linear-gradient(to bottom, #111 0%, #333 5%, #1a1a1a 20%, #222 50%, #0a0a0a 80%, #000 100%);
  border-top: 1px solid rgba(255,255,255,0.2);
  border-bottom: 3px solid rgba(0,0,0,0.9);
  box-shadow: inset 0 10px 10px rgba(255,255,255,0.05);
}

.mech-key {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 25%, #fdf5e6 0%, #d8cbb5 40%, #a39580 80%, #5c5240 100%);
  border: 2px solid #1a1510;
  box-shadow: 
    inset 0 4px 6px rgba(255,255,255,1),
    inset 0 -4px 6px rgba(0,0,0,0.6),
    0 10px 12px rgba(0,0,0,0.9),
    0 15px 25px rgba(0,0,0,0.6),
    0 2px 2px rgba(0,0,0,0.5);
  transform-style: preserve-3d;
  transition: all 0.05s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #110e0c;
  font-family: 'Courier Prime', monospace;
  font-weight: 700;
  font-size: 15px;
  text-shadow: 0 1px 1px rgba(255,255,255,0.6);
  cursor: pointer;
}

.mech-key::before {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.25) 100%);
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.4);
}

.mech-key.pressed {
  transform: translateY(12px) scale(0.95);
  box-shadow: 
    inset 0 1px 2px rgba(255,255,255,0.2),
    inset 0 -1px 3px rgba(0,0,0,0.9),
    0 1px 2px rgba(0,0,0,1);
  filter: brightness(0.85);
  color: #fff;
  text-shadow: 0 0 8px rgba(255,255,255,0.8);
}

.mech-key.wide {
  width: 70px;
  border-radius: 22px;
  font-size: 10px;
  letter-spacing: 1px;
}

.mech-key.spacebar {
  width: 300px;
  height: 40px;
  border-radius: 8px;
}

.mech-key.submit-key {
  width: 182px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(180deg, #f1d68f 0%, #c89d4a 52%, #8b6225 100%);
  border: 2px solid #3a260d;
  box-shadow:
    inset 0 2px 3px rgba(255,245,215,0.9),
    inset 0 -4px 7px rgba(86,51,10,0.5),
    0 10px 18px rgba(0,0,0,0.55),
    0 2px 2px rgba(0,0,0,0.4);
  color: #2c1b07;
  text-shadow: 0 1px 0 rgba(255,244,214,0.7);
}

.mech-key.submit-key::before {
  inset: 4px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255,248,229,0.32), rgba(0,0,0,0.08));
  box-shadow: inset 0 1px 4px rgba(117,82,21,0.2);
}

.mech-key.submit-key.pressed {
  color: #1f1305;
  text-shadow: none;
}

.mech-key.disabled-key {
  filter: grayscale(0.18) brightness(0.72);
  cursor: not-allowed;
  box-shadow:
    inset 0 2px 3px rgba(255,255,255,0.18),
    inset 0 -4px 7px rgba(0,0,0,0.35),
    0 5px 9px rgba(0,0,0,0.35);
}

.mech-key.disabled-key::before {
  opacity: 0.7;
}

.typebar-basket {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.typebar {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 4px;
  height: 120px;
  background: linear-gradient(to right, #666, #aaa, #444);
  transform-origin: bottom center;
  opacity: 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.5);
  will-change: transform, opacity;
}

.strike-action {
  animation: mechanic-strike 0.12s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
}

@keyframes mechanic-strike {
  0% { transform: rotate(var(--angle)) rotateX(60deg) translateY(0); opacity: 0; }
  30% { opacity: 1; }
  50% { transform: rotate(0deg) rotateX(0deg) translateY(-75px); opacity: 1; filter: brightness(1.5); }
  100% { transform: rotate(var(--angle)) rotateX(60deg) translateY(0); opacity: 0; }
}
`;

class AudioEngine {
  ctx: AudioContext;
  masterGain: GainNode;

  constructor() {
    const audioWindow = window as Window & typeof globalThis & {
      webkitAudioContext?: typeof AudioContext;
    };
    const AudioContextClass = window.AudioContext || audioWindow.webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.ctx.destination);
  }

  resume() {
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  playClack(velocity = 1) {
    this.resume();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.03);

    filter.type = 'bandpass';
    filter.frequency.value = 4000;
    filter.Q.value = 1.5;

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.8 * velocity, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.06);

    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(150, t);
    thudOsc.frequency.exponentialRampToValueAtTime(40, t + 0.05);

    thudGain.gain.setValueAtTime(1 * velocity, t);
    thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    thudOsc.connect(thudGain);
    thudGain.connect(this.masterGain);
    thudOsc.start(t);
    thudOsc.stop(t + 0.06);
  }

  playDing() {
    this.resume();
    const t = this.ctx.currentTime;
    const freqs = [850, 1700, 2550];

    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime((0.5 / (i + 1)), t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 1.6);
    });
  }

  playZip() {
    this.resume();
    const t = this.ctx.currentTime;
    const dur = 0.3;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (i % 10 === 0 ? 1 : 0.2);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, t);
    filter.frequency.linearRampToValueAtTime(5000, t + dur);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.05);
    gain.gain.linearRampToValueAtTime(0, t + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);
  }
}

const BASE_PAPER_WIDTH = 560;
const MAX_PAPER_WIDTH = 820;
const PAPER_SIDE_PADDING = 50;
const PAPER_EXTRA_VISUAL_WIDTH = 40;
const PLATEN_EXTRA_WIDTH = 60;
const CARRIAGE_EXTRA_WIDTH = 220;
const CHASSIS_MIN_WIDTH = 750;
const TYPEBAR_MIN_WIDTH = 380;
const TYPEBAR_WIDTH_OFFSET = 180;
const PAPER_MIN_HEIGHT = 800;
const PAPER_BOTTOM_PADDING = 140;
const FIELD_GAP = 12;
const LINE_HEIGHT = 28;
const CHAR_WIDTH = 9.6;

const FORM_SCHEMA = [
  { id: 'title', type: 'static', text: "INFORMATION QUESTIONNAIRE", y: 40, center: true },
  { id: 'name', type: 'input', label: '1. Full Name', maxLength: 60, y: 120 },
  { id: 'email', type: 'input', label: '2. Email', maxLength: 120, y: 160 },
  { id: 'nationality', type: 'input', label: '3. Nationality', maxLength: 40, y: 200 },
  { id: 'contact', type: 'input', label: '4. Phone Number', maxLength: 24, y: 240 },
  { id: 'github', type: 'input', label: '5. Github or URL (optional)', maxLength: 200, y: 280 },
  { id: 'description', type: 'input', label: '6. Description', maxLength: 8000, y: 320 },
];

const KEYBOARD_MATRIX = [
  [{ l: '2', s: '"' }, { l: '3', s: '£' }, { l: '4', s: '$' }, { l: '5', s: '%' }, { l: '6', s: '^' }, { l: '7', s: '&' }, { l: '8', s: '*' }, { l: '9', s: '(' }, { l: '0', s: ')' }, { l: '-', s: '_' }],
  [{ l: 'Q' }, { l: 'W' }, { l: 'E' }, { l: 'R' }, { l: 'T' }, { l: 'Y' }, { l: 'U' }, { l: 'I' }, { l: 'O' }, { l: 'P' }],
  [{ l: 'A' }, { l: 'S' }, { l: 'D' }, { l: 'F' }, { l: 'G' }, { l: 'H' }, { l: 'J' }, { l: 'K' }, { l: 'L' }, { l: '@' }],
  [{ l: 'SHIFT', w: true }, { l: 'Z' }, { l: 'X' }, { l: 'C' }, { l: 'V' }, { l: 'B' }, { l: 'N' }, { l: 'M' }, { l: ',', s: '<' }, { l: '.', s: '>' }, { l: 'BACK', w: true }],
  [{ l: 'SPACE', w: true, space: true }],
  [{ l: 'SEND', w: true, submit: true }]
];

type KeyData = {
  l: string;
  s?: string;
  w?: boolean;
  space?: boolean;
  submit?: boolean;
};

type PosterCard = {
  src: string;
  width: number;
  height: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate: number;
  zIndex?: number;
  hiddenOnMobile?: boolean;
};

type StickyNote = {
  text: string;
  color: string;
  width: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate: number;
  zIndex?: number;
  hiddenOnMobile?: boolean;
};

const POSTER_CARDS: PosterCard[] = [
  {
    src: '/images/bg_posters/optimized/ChatGPT Image Apr 30, 2026, 02_59_31 PM.webp',
    width: 260,
    height: 380,
    top: '6%',
    left: '2.5%',
    rotate: -1.5,
    zIndex: 1,
  },
  {
    src: '/images/bg_posters/optimized/Warner 100th Anniversary_ Art of 100th - Batman Wall Poster.webp',
    width: 180,
    height: 250,
    top: '17%',
    left: '22%',
    rotate: -4,
    zIndex: 1,
  },
  {
    src: '/images/bg_posters/optimized/ChatGPT Image Apr 30, 2026, 02_51_19 PM.webp',
    width: 260,
    height: 350,
    bottom: '10%',
    left: '7%',
    rotate: 8,
    zIndex: 1,
    hiddenOnMobile: true,
  },
  {
    src: '/images/bg_posters/optimized/What If It Works_ _ Dark Aesthetic Motivational Wall Poster.webp',
    width: 172,
    height: 236,
    top: '16%',
    right: '21%',
    rotate: -3,
    zIndex: 1,
  },
  {
    src: '/images/bg_posters/optimized/Just a man.webp',
    width: 252,
    height: 372,
    top: '2.5%',
    right: '1.8%',
    rotate: 1.25,
    zIndex: 1,
  },
  {
    src: '/images/bg_posters/optimized/Developers Are Not Happy.webp',
    width: 164,
    height: 112,
    top: '46%',
    right: '15%',
    rotate: -1.5,
    zIndex: 2,
    hiddenOnMobile: true,
  },
  {
    src: '/images/bg_posters/optimized/graphic design advert flyer.webp',
    width: 200,
    height: 250,
    bottom: '7%',
    right: '0.5%',
    rotate: 5.5,
    zIndex: 1,
    hiddenOnMobile: true,
  },
  {
    src: '/images/bg_posters/optimized/stamp.webp',
    width: 96,
    height: 96,
    bottom: '33%',
    right: '18.5%',
    rotate: -9,
    zIndex: 3,
    hiddenOnMobile: true,
  },
  {
    src: '/images/bg_posters/optimized/van_gough.webp',
    width: 150,
    height: 188,
    top: '33%',
    left: '17%',
    rotate: 6.5,
    zIndex: 1,
    hiddenOnMobile: true,
  },
];

const STICKY_NOTES: StickyNote[] = [
  {
    text: "Let's\nconnect",
    color: '#f7db69',
    width: 104,
    top: '16%',
    left: '11.5%',
    rotate: 6,
    zIndex: 3,
  },
  {
    text: 'Contact\nus',
    color: '#b9df9b',
    width: 110,
    top: '13%',
    left: '27%',
    rotate: -3,
    zIndex: 3,
  },
  {
    text: "Let's\nconnect",
    color: '#f5df72',
    width: 112,
    top: '55%',
    right: '8%',
    rotate: 2.5,
    zIndex: 3,
  },
  {
    text: 'Contact\nus',
    color: '#e3c9f4',
    width: 108,
    top: '46%',
    right: '30%',
    rotate: -5,
    zIndex: 3,
    hiddenOnMobile: true,
  },
  {
    text: 'Contact\nus',
    color: '#f5df72',
    width: 116,
    top: '36%',
    left: '3.5%',
    rotate: 8,
    zIndex: 3,
    hiddenOnMobile: true,
  },
];

const MechanicalKey = React.memo(function MechanicalKey({
  data,
  isActive,
  disabled,
  onClick,
}: {
  data: KeyData;
  isActive: boolean;
  disabled?: boolean;
  onClick: (key: string) => void;
}) {
  let className = "mech-key ";
  if (data.w) className += "wide ";
  if (data.space) className += "spacebar ";
  if (data.submit) className += "submit-key ";
  if (disabled) className += "disabled-key ";
  if (isActive) className += "pressed ";

  return (
    <div
      className={className}
      aria-disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onClick(data.l);
      }}
    >
      <div className="absolute inset-0 rounded-full bg-black/10 pointer-events-none" />
      <div className="relative flex flex-col items-center justify-center leading-none mt-[-2px]">
        {data.s && <span className="text-[10px] text-[#4a3e30] opacity-80 mb-[-2px]">{data.s}</span>}
        <span className={data.submit ? 'text-[11px] tracking-[0.35em] pl-[0.35em]' : data.w ? 'text-[10px]' : 'text-sm'}>
          {data.l}
        </span>
      </div>
    </div>
  );
});

const wrapTypedValue = (value: string, lineLength: number) => {
  if (!value) return [''];

  const chunks: string[] = [];

  let remaining = value;
  while (remaining.length > lineLength) {
    const candidate = remaining.slice(0, lineLength + 1);
    const breakIndex = candidate.lastIndexOf(' ');

    if (breakIndex > 0) {
      chunks.push(remaining.slice(0, breakIndex).trimEnd());
      remaining = remaining.slice(breakIndex).trimStart();
    } else {
      chunks.push(remaining.slice(0, lineLength));
      remaining = remaining.slice(lineLength);
    }
  }

  chunks.push(remaining);
  return chunks;
};

const REQUIRED_FIELD_IDS = ['name', 'email', 'nationality', 'contact', 'description'] as const;

type SubmissionState =
  | { status: 'idle'; message: string }
  | { status: 'sending'; message: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

export default function ArchitectTypewriter() {
  const [formData, setFormData] = useState<Record<string, string>>(
    FORM_SCHEMA.filter(f => f.type === 'input').reduce((acc, f) => ({ ...acc, [f.id]: '' }), {})
  );
  const [activeFieldIndex, setActiveFieldIndex] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [strikeTrigger, setStrikeTrigger] = useState(0);
  const [strikeAngle, setStrikeAngle] = useState(0);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: 'idle',
    message: 'Complete the required fields, then press SEND.',
  });

  const audioRef = useRef<AudioEngine | null>(null);
  const inputs = FORM_SCHEMA.filter(f => f.type === 'input');
  const activeField = inputs[activeFieldIndex];
  const activeValue = formData[activeField.id];
  const platenCenterY = 180;
  const canSubmit = REQUIRED_FIELD_IDS.every((fieldId) => (formData[fieldId] || '').trim().length > 0);

  const layout = React.useMemo(() => {
    const requiredPaperWidth = inputs.reduce((largest, field) => {
      const labelWidth = (`${field.label}: `.length * CHAR_WIDTH);
      const valueWidth = Math.max(1, (formData[field.id] || '').length) * CHAR_WIDTH;
      const totalWidth = Math.ceil((PAPER_SIDE_PADDING * 2) + labelWidth + valueWidth + 24);
      return Math.max(largest, totalWidth);
    }, BASE_PAPER_WIDTH);

    const paperWidth = Math.min(MAX_PAPER_WIDTH, Math.max(BASE_PAPER_WIDTH, requiredPaperWidth));
    const writableWidth = paperWidth - (PAPER_SIDE_PADDING * 2);

    const fieldState = inputs.reduce(
      (acc, field, index) => {
        const labelText = `${field.label}: `;
        const labelWidth = labelText.length * CHAR_WIDTH;
        const charsPerLine = Math.max(
          1,
          Math.floor((writableWidth - labelWidth) / CHAR_WIDTH),
        );
      const lines = wrapTypedValue(formData[field.id] || '', charsPerLine);
        const top = index === 0 ? field.y : Math.max(field.y, acc.previousBottom + FIELD_GAP);
        const height = Math.max(1, lines.length) * LINE_HEIGHT;
        const bottom = top + height;

        return {
          previousBottom: bottom,
          fields: [
            ...acc.fields,
            {
              ...field,
              labelText,
              labelWidth,
              charsPerLine,
              lines,
              top,
              height,
            },
          ],
        };
      },
      {
        previousBottom: 0,
        fields: [] as Array<{
          id: string;
          type: string;
          label: string;
          maxLength: number;
          y: number;
          labelText: string;
          labelWidth: number;
          charsPerLine: number;
          lines: string[];
          top: number;
          height: number;
        }>,
      },
    );

    const fields = fieldState.fields;

    const activeFieldLayout = fields[activeFieldIndex];
    const cursorLineIndex = Math.max(0, activeFieldLayout.lines.length - 1);
    const cursorLineText = activeFieldLayout.lines[cursorLineIndex] ?? '';
    const cursorX = PAPER_SIDE_PADDING + activeFieldLayout.labelWidth + (cursorLineText.length * CHAR_WIDTH);
    const cursorY = activeFieldLayout.top + (cursorLineIndex * LINE_HEIGHT);
    const carriageShiftX = (paperWidth / 2) - cursorX;
    const paperHeight = Math.max(PAPER_MIN_HEIGHT, fieldState.previousBottom + PAPER_BOTTOM_PADDING);
    const paperVisualWidth = paperWidth + PAPER_EXTRA_VISUAL_WIDTH;
    const platenWidth = paperVisualWidth + PLATEN_EXTRA_WIDTH;
    const carriageWidth = platenWidth + CARRIAGE_EXTRA_WIDTH;
    const chassisWidth = Math.max(CHASSIS_MIN_WIDTH, paperVisualWidth + 190);
    const typebarWidth = Math.max(TYPEBAR_MIN_WIDTH, paperVisualWidth - TYPEBAR_WIDTH_OFFSET);

    return {
      paperWidth,
      paperVisualWidth,
      platenWidth,
      carriageWidth,
      chassisWidth,
      typebarWidth,
      paperHeight,
      paperTop: platenCenterY - cursorY,
      carriageShiftX,
      cursorX,
      cursorY,
      cursorLineIndex,
      fields,
    };
  }, [activeFieldIndex, formData, inputs]);

  const handleFieldClick = useCallback((fieldId: string) => {
    if (!audioRef.current) audioRef.current = new AudioEngine();
    const newIdx = inputs.findIndex(f => f.id === fieldId);
    if (newIdx !== -1 && newIdx !== activeFieldIndex) {
      audioRef.current.playZip();
      setActiveFieldIndex(newIdx);
    }
  }, [activeFieldIndex, inputs]);

  const handleSubmit = useCallback(async () => {
    if (!audioRef.current) audioRef.current = new AudioEngine();
    const ae = audioRef.current;

    if (!canSubmit) {
      ae.playDing();
      setSubmission({
        status: 'error',
        message: 'Fill in Name, Email, Nationality, Phone Number, and Description first.',
      });
      return;
    }

    setSubmission({
      status: 'sending',
      message: 'Transmitting your questionnaire...',
    });

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.contact.trim(),
        nationality: formData.nationality.trim(),
        github: formData.github.trim(),
        message: [
          `Nationality: ${formData.nationality.trim()}`,
          formData.github.trim() ? `GitHub / URL: ${formData.github.trim()}` : '',
          '',
          formData.description.trim(),
        ].filter(Boolean).join('\n'),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to send right now.');
      }

      ae.playZip();
      setSubmission({
        status: 'success',
        message: 'Message sent. Your typewriter transmission was delivered.',
      });
    } catch (error) {
      ae.playDing();
      setSubmission({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unable to send right now.',
      });
    }
  }, [canSubmit, formData]);

  const handleType = useCallback((char: string) => {
    if (!audioRef.current) audioRef.current = new AudioEngine();
    const ae = audioRef.current;

    if (char !== 'SEND' && submission.status !== 'idle') {
      setSubmission({
        status: 'idle',
        message: 'Complete the required fields, then press SEND.',
      });
    }

    if (char === 'BACK') {
      ae.playClack(0.6);
      setFormData(prev => ({
        ...prev,
        [activeField.id]: prev[activeField.id].slice(0, -1)
      }));
    } else if (char === 'SEND') {
      void handleSubmit();
    } else if (char === 'ENTER' || char === 'RETURN') {
      if (activeFieldIndex < inputs.length - 1) {
        ae.playZip();
        setActiveFieldIndex(prev => prev + 1);
      }
    } else if (char.length === 1 || char === 'SPACE') {
      const valToAdd = char === 'SPACE' ? ' ' : char;
      if ((activeValue || '').length < (activeField.maxLength || 25)) {
        const angle = (Math.random() * 60) - 30;
        setStrikeAngle(angle);
        setStrikeTrigger(prev => prev + 1);
        ae.playClack(0.8 + Math.random() * 0.4);

        if ((activeValue || '').length === (activeField.maxLength || 25) - 5) ae.playDing();

        setFormData(prev => ({
          ...prev,
          [activeField.id]: (prev[activeField.id] || '') + valToAdd
        }));
      }
    }
  }, [activeField, activeValue, activeFieldIndex, handleSubmit, inputs.length, submission.status]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!audioRef.current) audioRef.current = new AudioEngine();

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeFieldIndex > 0) {
          audioRef.current.playZip();
          setActiveFieldIndex(prev => prev - 1);
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeFieldIndex < inputs.length - 1) {
          audioRef.current.playZip();
          setActiveFieldIndex(prev => prev + 1);
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          if (activeFieldIndex > 0) {
            audioRef.current.playZip();
            setActiveFieldIndex(prev => prev - 1);
          }
        } else {
          if (activeFieldIndex < inputs.length - 1) {
            audioRef.current.playZip();
            setActiveFieldIndex(prev => prev + 1);
          }
        }
        return;
      }

      let keyId = e.key;
      const upperCheck = keyId.toUpperCase();
      if (upperCheck === ' ') keyId = 'SPACE';
      if (upperCheck === 'BACKSPACE') keyId = 'BACK';
      if (upperCheck === 'ENTER') keyId = 'RETURN';

      const upperKeyForState = keyId.length === 1 ? keyId.toUpperCase() : keyId;
      const mappedKey = upperKeyForState === 'RETURN' ? 'ENTER' : upperKeyForState;
      setActiveKey(mappedKey);
      setTimeout(() => setActiveKey(null), 100);

      // Allow length 1 to capture all valid typeable characters retaining their case
      if (keyId === 'BACK' || keyId === 'RETURN' || keyId === 'SPACE' || keyId.length === 1) {
        e.preventDefault();
        handleType(keyId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFieldIndex, handleType, inputs.length]);

  const handleMechanicalKeyPress = useCallback((key: string) => {
    const visualKey = key === 'RETURN' ? 'ENTER' : key;
    setActiveKey(visualKey);
    setTimeout(() => setActiveKey(null), 100);
    handleType(key);
  }, [handleType]);

  const renderTypingCaret = () => (
    <span className="inline-block align-middle ml-[4px] w-[8px] h-[20px] bg-black/60 animate-[pulse_0.8s_infinite] shadow-[0_0_4px_rgba(0,0,0,0.5)]" />
  );

  const renderTypedLine = (line: string, animateLastChar: boolean) => {
    if (!line) return <span className="relative inline-block" />;

    if (!animateLastChar || line.length === 1) {
      return (
        <span className="relative inline-block whitespace-pre">
          {animateLastChar && line.length === 1 ? (
            <span className="inline-block ink-strike-anim">{line}</span>
          ) : (
            line
          )}
        </span>
      );
    }

    return (
      <span className="relative inline-block whitespace-pre">
        {line.slice(0, -1)}
        <span className="inline-block ink-strike-anim">{line.slice(-1)}</span>
      </span>
    );
  };

  return (
    <section id="contact" className="relative w-full h-screen min-h-[900px] flex flex-col items-center justify-center typewriter-os-wrapper overflow-hidden">
      <style>{STYLES}</style>

      {/* Hidden SVG for physical ink-bleed displacement */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id="ink-displacement" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Volumetric Lighting & Atmospheric Noise (NOT SCALED) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(118,12,28,0.08)_0%,rgba(59,4,12,0.2)_42%,rgba(22,2,5,0.72)_100%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0)_45%),linear-gradient(180deg,rgba(82,8,20,0.08)_0%,rgba(42,3,10,0.22)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGZpbHRlciBpZD0ibiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none opacity-50 mix-blend-overlay z-0" />
      <div className="volumetric-ray z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-0" />

      {/* Universal Scale Wrapper to simulate a zoomed-out view (90%) */}
      <div className="absolute z-10 inset-0 flex flex-col items-center justify-center transform scale-[0.9] md:scale-[0.85] xl:scale-[0.85] origin-center w-full h-full">
        
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">


        {POSTER_CARDS.map((poster) => (
          <div
            key={poster.src}
            className={`absolute ${poster.hiddenOnMobile ? 'hidden lg:block' : 'hidden md:block'}`}
            style={{
              top: poster.top,
              left: poster.left,
              right: poster.right,
              bottom: poster.bottom,
              width: `${poster.width}px`,
              height: `${poster.height}px`,
              transform: `rotate(${poster.rotate}deg)`,
              zIndex: poster.zIndex,
            }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[2px] border border-[#f1dfb6]/30 bg-[#dbc497]/50 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
              <div
                className="absolute inset-0 bg-cover bg-center saturate-[0.92] contrast-[1.03]"
                style={{
                  backgroundImage: `url("${encodeURI(poster.src)}")`,
                }}
              />
            </div>
            <div className="absolute -top-2 left-5 h-4 w-16 rotate-[-10deg] rounded-[1px] bg-[#dcc7a1]/80 shadow-sm" />
            <div className="absolute -top-1 right-5 h-4 w-14 rotate-[14deg] rounded-[1px] bg-[#d3c09b]/72 shadow-sm" />
          </div>
        ))}

        {STICKY_NOTES.map((note, index) => (
          <div
            key={`${note.text}-${index}`}
            className={`absolute ${note.hiddenOnMobile ? 'hidden lg:block' : 'hidden md:flex'} items-center justify-center`}
            style={{
              top: note.top,
              left: note.left,
              right: note.right,
              bottom: note.bottom,
              width: `${note.width}px`,
              minHeight: '96px',
              transform: `rotate(${note.rotate}deg)`,
              zIndex: note.zIndex,
            }}
          >
            <div
              className="relative flex min-h-[92px] w-full items-center justify-center px-4 py-3 text-center font-['Special_Elite'] text-[22px] leading-[1.1] text-[#231b12] shadow-[0_16px_28px_rgba(0,0,0,0.32)]"
              style={{ backgroundColor: note.color }}
            >
              <div className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-4deg] bg-[#ddc9a2]/84 shadow-sm" />
              <span className="whitespace-pre-line">{note.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Core Scaled Container: Ensures the unified machine stays perfectly visible on any screen */}
      <div className="relative flex flex-col items-center transform scale-[0.55] sm:scale-[0.65] md:scale-[0.80] lg:scale-[0.85] origin-center transition-transform duration-500 ease-in-out mt-12 z-10 w-full">

        {/* CARRIAGE SYSTEM (Z-10) - Physically shifts Left/Right */}
        <div
          className="relative h-[280px] z-10 mt-[20vh] md:mt-[10vh]"
          style={{ width: `${layout.carriageWidth}px` }}
        >
          <div
            className="absolute top-0 left-1/2 h-full transition-transform duration-[150ms] ease-out will-change-transform"
            style={{ transform: `translateX(calc(-50% + ${layout.carriageShiftX}px))` }}
          >
            {/* 1. Platen Cylinder Base (Background Rubber) */}
            <div
              className="absolute bottom-0 left-1/2 h-[46px] -translate-x-1/2 mat-platen-rubber rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-10"
              style={{ width: `${layout.platenWidth}px` }}
            />

            {/* 2. Paper Container (Feeds UP from the Platen) */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-[#fdf8f0] shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_0_120px_rgba(180,160,130,0.15)] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] origin-top z-20 border-l-[1px] border-r-[1px] border-[#e6decc] rounded-t-sm"
              style={{
                top: `${layout.paperTop}px`,
                width: `${layout.paperVisualWidth}px`,
                height: `${layout.paperHeight}px`,
                backgroundImage: `
                  repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(0,0,0,0.04) 27px, rgba(0,0,0,0.04) 28px),
                  linear-gradient(to right, rgba(200,50,50,0.06) 1px, transparent 1px)
                `,
                backgroundSize: '100% 28px, 40px 100%',
                backgroundPosition: '0 12px, 40px 0'
              }}
            >
              <div className="pointer-events-none absolute inset-[10px] rounded-[2px] border border-[#d2ba79]/70 shadow-[inset_0_0_0_1px_rgba(109,79,24,0.22),0_0_0_1px_rgba(242,226,184,0.14)]" />
              <div className="pointer-events-none absolute inset-[18px] rounded-[1px] border border-[#b88e3c]/45 shadow-[inset_0_0_24px_rgba(188,147,60,0.08)]" />
              <div className="pointer-events-none absolute left-[18px] right-[18px] top-[18px] h-[20px] border-x border-t border-[#c4a35a]/55 opacity-80" />
              <div className="pointer-events-none absolute bottom-[18px] left-[18px] right-[18px] h-[20px] border-x border-b border-[#c4a35a]/45 opacity-60" />
              <div className="pointer-events-none absolute left-[18px] top-[18px] h-[42px] w-[42px] rounded-tl-[1px] border-l border-t border-[#e1c989]/70" />
              <div className="pointer-events-none absolute right-[18px] top-[18px] h-[42px] w-[42px] rounded-tr-[1px] border-r border-t border-[#e1c989]/70" />
              <div className="pointer-events-none absolute bottom-[18px] left-[18px] h-[42px] w-[42px] rounded-bl-[1px] border-b border-l border-[#bc9650]/60" />
              <div className="pointer-events-none absolute bottom-[18px] right-[18px] h-[42px] w-[42px] rounded-br-[1px] border-b border-r border-[#bc9650]/60" />
              <div
                className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' result='noise'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 0.9 0 0 0 0 0 0.8 0 0 0 0 0 0.15 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
              />

              <div className="relative w-full h-full p-8 pt-10 pb-20 font-['Special_Elite'] text-[16px] leading-[28px] ink-bleed z-10">
                {FORM_SCHEMA.map((field) => {
                  if (field.type === 'static') {
                    return (
                      <div key={field.id} className="absolute w-full text-center tracking-widest font-bold opacity-80" style={{ top: field.y, left: 0 }}>
                        {field.text}
                      </div>
                    );
                  }

                  const fieldLayout = layout.fields.find((entry) => entry.id === field.id);
                  if (!fieldLayout) return null;

                  const isActive = activeField.id === field.id;

                  return (
                    <div
                      key={field.id}
                      className="absolute transition-opacity duration-500 cursor-pointer hover:opacity-100"
                      style={{
                        top: fieldLayout.top,
                        left: PAPER_SIDE_PADDING,
                        opacity: isActive ? 1 : 0.75,
                        width: `${layout.paperWidth - (PAPER_SIDE_PADDING * 2)}px`,
                        minHeight: `${fieldLayout.height}px`,
                      }}
                      onClick={() => handleFieldClick(field.id)}
                    >
                      <div className="relative" style={{ minHeight: `${fieldLayout.height}px` }}>
                        <div className="absolute left-0 top-0 whitespace-pre">
                          <span className="font-bold tracking-wider">{fieldLayout.labelText}</span>
                          {renderTypedLine(
                            fieldLayout.lines[0] ?? '',
                            isActive && layout.cursorLineIndex === 0,
                          )}
                          {isActive && layout.cursorLineIndex === 0 ? renderTypingCaret() : null}
                        </div>

                        {fieldLayout.lines.slice(1).map((line, lineIndex) => (
                          <div
                            key={`${field.id}-${lineIndex + 1}`}
                            className="absolute whitespace-pre"
                            style={{
                              top: `${(lineIndex + 1) * LINE_HEIGHT}px`,
                              left: `${fieldLayout.labelWidth}px`,
                            }}
                          >
                            {renderTypedLine(
                              line,
                              isActive && layout.cursorLineIndex === lineIndex + 1,
                            )}
                            {isActive && layout.cursorLineIndex === lineIndex + 1
                              ? renderTypingCaret()
                              : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between border-t border-[#c7a660]/35 pt-3 text-[12px] leading-none tracking-[0.18em]">
                  <span className="text-[#705222]">TRANSMISSION STATUS</span>
                  <span
                    className={
                      submission.status === 'success'
                        ? 'text-[#3b6a34]'
                        : submission.status === 'error'
                          ? 'text-[#8f3127]'
                          : submission.status === 'sending'
                            ? 'text-[#8a5a1d]'
                            : 'text-[#6d5a37]'
                    }
                  >
                    {submission.message}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Platen Foreground & Paper Bale (Overlaps Paper) */}
            <div
              className="absolute bottom-0 left-1/2 h-[46px] -translate-x-1/2 pointer-events-none z-30 flex items-center justify-between"
              style={{ width: `${layout.platenWidth}px` }}
            >
              <div className="w-12 h-12 -ml-6 rounded-full mat-bakelite-black border border-[#555] shadow-xl pointer-events-auto" />
              <div className="w-12 h-12 -mr-6 rounded-full mat-bakelite-black border border-[#555] shadow-xl pointer-events-auto" />

              {/* Metal Guide Bar */}
              <div className="absolute top-[60%] left-8 right-8 h-[4px] bg-gradient-to-b from-[#ddd] to-[#666] shadow-[0_4px_6px_rgba(0,0,0,0.6)] rounded-full" />
              {/* Rubber Guide Rollers */}
              <div className="absolute top-[45%] left-1/4 w-5 h-7 bg-gradient-to-r from-[#444] via-[#777] to-[#444] rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.8)] border border-[#222]" />
              <div className="absolute top-[45%] right-1/4 w-5 h-7 bg-gradient-to-r from-[#444] via-[#777] to-[#444] rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.8)] border border-[#222]" />
            </div>
          </div>
        </div>

        {/* STATIC CHASSIS & KEYBOARD (Z-40) - Overlaps Carriage Base */}
        <div
          className="relative -mt-[30px] mat-bakelite-black rounded-t-[70px] rounded-b-[24px] p-8 pt-[130px] pb-14 border-t-[3px] border-[#444] border-l border-r border-[#222] z-40"
          style={{ width: `${layout.chassisWidth}px` }}
        >

          {/* Typebar Basket */}
          <div
            className="absolute -top-[15px] left-1/2 h-[170px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,#1a1a1a_0%,#000_100%)] rounded-b-[190px] shadow-[inset_0_20px_40px_rgba(0,0,0,0.9),0_2px_0_rgba(255,255,255,0.05)] border-b border-[#333] overflow-hidden typebar-basket z-50"
            style={{ width: `${layout.typebarWidth}px` }}
          >
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className="absolute bottom-0 left-1/2 w-[2px] h-[100px] bg-gradient-to-t from-[#222] to-[#444] origin-bottom" style={{ transform: `translateX(-50%) rotate(${(i - 15) * 3.5}deg)` }} />
            ))}

            {strikeTrigger > 0 && (
              <div
                key={strikeTrigger}
                className="typebar strike-action z-[60]"
                style={{ '--angle': `${strikeAngle}deg` } as React.CSSProperties}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-[#aaa] to-[#555] rounded-t-sm shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
              </div>
            )}
          </div>

          {/* Brand Plate */}
          <div className="absolute top-[180px] left-1/2 -translate-x-1/2 w-48 h-8 mat-brushed-metal rounded-sm flex items-center justify-center shadow-[0_6px_15px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.7)] z-50">
            <span className="font-['Courier_Prime'] text-[#0a0a0a] text-[11px] font-bold tracking-[0.5em] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">ARCHITECT</span>
          </div>

          {/* Keyboard Sub-chassis */}
          <div className="relative mt-[80px] bg-gradient-to-b from-[#181210] to-[#050403] p-8 rounded-3xl shadow-[inset_0_15px_30px_rgba(0,0,0,1),0_2px_1px_rgba(255,255,255,0.05)] border border-[#2a2018]">
            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noise)\\' opacity=\\'0.04\\'/%3E%3C/svg%3E')] pointer-events-none mix-blend-overlay" />
            
            <div className="flex flex-col gap-4 items-center relative z-10">
              {KEYBOARD_MATRIX.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-3 justify-center" style={{
                  marginLeft: rIdx === 1 ? '24px' : rIdx === 2 ? '48px' : rIdx === 3 ? '12px' : '0'
                }}>
                  {row.map((keyData, kIdx) => (
                    <MechanicalKey
                      key={`${rIdx}-${kIdx}`}
                      data={keyData}
                      isActive={activeKey === keyData.l}
                      disabled={keyData.l === 'SEND' && (!canSubmit || submission.status === 'sending')}
                      onClick={handleMechanicalKeyPress}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ambient Chassis Shadow */}
        <div className="absolute -bottom-10 left-[5%] right-[5%] h-20 bg-black/90 blur-3xl -z-10 rounded-full" />
      </div>

      <div className="absolute bottom-6 left-6 font-['Courier_Prime'] text-[10px] text-red-500/60 tracking-widest pointer-events-none z-[1000] drop-shadow-[0_0_2px_rgba(255,0,0,0.4)]">
        SYSTEM // KINEMATIC DRIVE ACTIVE<br />
        INPUT // PHYSICAL KEYBOARD REQUIRED
      </div>
      
      </div> {/* <-- Universal Scale Wrapper closing tag */}
    </section>
  );
}
