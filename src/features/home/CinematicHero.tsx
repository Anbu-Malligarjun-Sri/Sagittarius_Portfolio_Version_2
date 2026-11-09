"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const HERO_STORIES = [
  {
    label: 'Clarity first',
    value: 'Strategy, design, and build decisions that point in one direction.',
  },
  {
    label: 'Systems that hold',
    value: 'Architecture designed to keep working when the project gets real.',
  },
  {
    label: 'Shipping discipline',
    value: 'Tighter scopes, fewer loops, cleaner launches.',
  },
];

const HERO_STATS = [
  { value: '12+', label: 'Years of work' },
  { value: '200+', label: 'Projects shaped' },
  { value: '40', label: 'Clients across markets' },
  { value: '98%', label: 'Retention and repeat work' },
];

const FLOATING_TAGS = ['AI Systems', 'Product Design', 'Robotics', 'Launch Support'];

const STYLES = `
  .hero-shell {
    background:
      radial-gradient(circle at 18% 18%, rgba(232, 197, 71, 0.12), transparent 28%),
      radial-gradient(circle at 82% 26%, rgba(255, 255, 255, 0.06), transparent 20%),
      radial-gradient(circle at 72% 72%, rgba(232, 197, 71, 0.08), transparent 24%),
      linear-gradient(180deg, #0a0a0a 0%, #070707 55%, #050505 100%);
  }

  .hero-shell::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8), transparent 88%);
    opacity: 0.35;
  }

  .hero-shell::after {
    content: '';
    position: absolute;
    inset: auto -10% -12% -10%;
    height: 42vh;
    pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(232, 197, 71, 0.14), transparent 62%);
    filter: blur(28px);
  }

  @keyframes riseIn {
    from {
      opacity: 0;
      transform: translate3d(0, 24px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes floatSoft {
    0%, 100% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(0, -10px, 0);
    }
  }

  @keyframes pulseBorder {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.95;
    }
  }

  @keyframes driftLabels {
    0%, 100% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(0, -6px, 0);
    }
  }

  .hero-rise {
    animation: riseIn 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .hero-float {
    animation: floatSoft 7s ease-in-out infinite;
  }

  .hero-border-pulse {
    animation: pulseBorder 4s ease-in-out infinite;
  }

  .hero-drift {
    animation: driftLabels 5.5s ease-in-out infinite;
  }

  .hero-kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
    color: rgba(247, 240, 228, 0.78);
    font-family: var(--font-mono), monospace;
    font-size: 0.7rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    border-radius: 999px;
    padding: 0.72rem 1rem;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .hero-title {
    font-family: var(--font-serif), 'Playfair Display', serif;
    font-weight: 600;
    font-feature-settings: 'liga' 1, 'kern' 1;
    letter-spacing: -0.09em;
    line-height: 0.84;
  }

  .hero-title-accent {
    color: #e8c547;
  }

  .hero-copy {
    max-width: 52ch;
    color: rgba(245, 240, 232, 0.72);
    font-size: clamp(0.96rem, 0.7vw + 0.86rem, 1.04rem);
    line-height: 1.8;
    font-family: var(--font-body), 'Manrope', sans-serif;
  }

  .hero-button {
    transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease, color 180ms ease;
  }

  .hero-button:hover {
    transform: translateY(-2px);
  }

  .hero-button:active {
    transform: translateY(0) scale(0.99);
  }

  .hero-metric {
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0s !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default function CinematicHero() {
  return (
    <section className="hero-shell relative isolate min-h-dvh overflow-hidden text-[#f7f0e4]">
      <style>{STYLES}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 90%)',
        }}
      />

      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#e8c547]/10 blur-3xl hero-float" />
      <div className="pointer-events-none absolute right-0 top-28 h-80 w-80 rounded-full bg-white/6 blur-3xl hero-float" style={{ animationDelay: '1.2s' }} />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-7xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-[1fr_0.88fr] lg:items-center lg:px-10 lg:py-14 xl:py-16">
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:pr-3">
          <div className="space-y-4 hero-rise">
            <div className="flex flex-wrap items-center gap-3">
              <span className="hero-kicker">INTRODUCING 2026</span>
              <span className="rounded-full border border-white/10 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.26em] text-white/55">
                Founders, systems, and launches
              </span>
            </div>

            <div className="max-w-4xl space-y-2.5">
              <h1 className="hero-title text-[clamp(2.9rem,5.1vw,5rem)] leading-[0.86] lg:max-w-[9.2ch] xl:max-w-[8.8ch]">
                <span className="block">We shape</span>
                <span className="block">hard ideas into</span>
                <span className="block">
                  products people trust.
                </span>
              </h1>

              <p className="hero-copy pt-0.5">
                Sagittariuz is a design and engineering studio for teams that want clarity before velocity.
                We turn research, product ambition, and technical complexity into systems that are easier to understand,
                easier to run, and harder to break.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="hero-button inline-flex items-center justify-center gap-2 rounded-full bg-[#e8c547] px-6 py-2.75 text-sm font-semibold tracking-[0.02em] text-[#0b0b0b] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
              >
                Start a project
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/team"
                className="hero-button inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/4 px-6 py-2.75 text-sm font-semibold tracking-[0.02em] text-[#f7f0e4] backdrop-blur-md"
              >
                Meet our team
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            {HERO_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="hero-metric hero-rise rounded-[1.35rem] px-4 py-3"
                style={{ animationDelay: `${index * 60 + 120}ms` }}
              >
                <div className="font-mono text-[1rem] font-semibold tracking-[0.06em] text-[#f7f0e4]">
                  {stat.value}
                </div>
                <div className="mt-1 text-[0.66rem] uppercase tracking-[0.22em] text-white/45">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 lg:pl-5">
          <div className="hero-border-pulse relative overflow-hidden rounded-4xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_22px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(232,197,71,0.1),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%,rgba(0,0,0,0.16))]" />

            <div className="relative flex items-center justify-between border-b border-white/8 px-1.5 pb-2">
              <div>
                <div className="font-mono text-[0.63rem] uppercase tracking-[0.34em] text-white/40">
                  Studio signal
                </div>
                <div className="mt-1.5 text-[0.92rem] text-white/80">
                  Architecture, design, launch
                </div>
              </div>
              <div className="rounded-full border border-[#e8c547]/25 bg-[#e8c547]/10 px-3 py-1.5 font-mono text-[0.63rem] uppercase tracking-[0.28em] text-[#e8c547]">
                Available now
              </div>
            </div>

            <div className="relative mt-3 overflow-hidden rounded-3xl border border-white/10 bg-[#090909]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,197,71,0.08),transparent_36%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.06),transparent_18%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.16))]" />

              <div className="relative flex min-h-80 items-center justify-center p-2.5 sm:min-h-96">
                <div className="relative w-full max-w-md hero-float">
                  <Image
                    src="/images/Bg_Blackhole.png"
                    alt="Abstract Sagittariuz visual"
                    width={1200}
                    height={1200}
                    priority
                    className="h-auto w-full object-contain opacity-95"
                  />

                  {FLOATING_TAGS.map((tag, index) => (
                    <span
                      key={tag}
                      className="hero-drift absolute rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.26em] text-[#f7f0e4]/80 backdrop-blur-md"
                      style={{
                        top: `${index === 0 ? '16%' : index === 1 ? '18%' : index === 2 ? '74%' : '80%'}`,
                        left: `${index === 0 ? '8%' : index === 1 ? '72%' : index === 2 ? '12%' : '68%'}`,
                        animationDelay: `${index * 400}ms`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-3 grid gap-2.5 sm:grid-cols-3">
              {HERO_STORIES.map((story, index) => (
                <div
                  key={story.label}
                  className="hero-metric hero-rise rounded-[1.2rem] p-3"
                  style={{ animationDelay: `${200 + index * 60}ms` }}
                >
                  <div className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[#e8c547]">
                    {story.label}
                  </div>
                  <p className="mt-1.5 text-[0.84rem] leading-5.5 text-white/68">
                    {story.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
