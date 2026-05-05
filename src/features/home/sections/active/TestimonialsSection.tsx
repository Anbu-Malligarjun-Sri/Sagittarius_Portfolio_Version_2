'use client';

import { Star } from 'lucide-react';
import { TESTIMONIALS } from './data';

interface TestimonialsSectionProps {
  activeSection: string;
  testimonialIndex: number;
  setTestimonialIndex: (index: number) => void;
}

export default function TestimonialsSection({ activeSection, testimonialIndex, setTestimonialIndex }: TestimonialsSectionProps) {
  const activeTestimonial = TESTIMONIALS[testimonialIndex];

  return (
    <section id="testimonials" className="section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">TESTIMONIALS</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">What clients say after the work ships.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">The strongest feedback usually comes down to clarity, speed, and the absence of churn.</p>
          </div>
        </div>
      </div>

      <div className="jukebox-shell mx-auto mt-12 max-w-7xl rounded-[16px] border-4 border-[#2a2010] bg-[#1a1209] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="rounded-t-[12px] bg-[linear-gradient(#3a2a10,#2a1a08)] px-4 py-3" />
        <div className="grid gap-6 p-4 lg:grid-cols-[0.9fr_1.2fr]">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="vinyl-record relative flex h-[260px] w-[260px] items-center justify-center rounded-full border border-white/10 bg-[#101010] shadow-[inset_0_0_0_10px_rgba(255,255,255,0.02)]" style={{ animation: 'spin 4s linear infinite', animationPlayState: activeSection === 'testimonials' ? 'running' : 'paused' }}>
              {[45, 60, 75, 90, 105].map((radius) => (
                <div key={radius} className="absolute rounded-full border border-white/5" style={{ width: radius * 2, height: radius * 2 }} />
              ))}
              <div className="absolute h-[70px] w-[70px] rounded-full" style={{ background: activeTestimonial.tint }} />
              <div className="absolute right-4 top-8 h-32 w-px rotate-[28deg] bg-[#f5f0e8]/35" />
              <div className="absolute right-2 top-10 h-3 w-3 rounded-full bg-[#e8c547] shadow-[0_0_6px_rgba(232,197,71,0.4)]" />
            </div>
            <div className="rounded-[4px] border border-white/10 bg-[#f5f0e8] px-4 py-3 text-[#1a1208] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="font-body text-[13px] font-semibold text-[#e8c547]">{activeTestimonial.name}</div>
              <div className="font-mono text-[11px] text-[#1a1208]/60">{activeTestimonial.company}</div>
            </div>
          </div>

          <div className="rounded-[4px] border border-white/10 bg-[#f5f0e8] p-6 text-[#2a1a08] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/40">Liner notes</div>
              <div className="flex gap-1 text-[#e8c547]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
              </div>
            </div>
            <p className="mt-6 text-[16px] italic leading-8">"{activeTestimonial.quote}"</p>
            <div className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-black/55">— {activeTestimonial.name}, {activeTestimonial.title} at {activeTestimonial.company}</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pb-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              aria-label={`Show testimonial from ${testimonial.name}`}
              onClick={() => setTestimonialIndex(index)}
              className={`h-9 w-9 rounded-full border text-[11px] font-mono transition-all duration-200 ${index === testimonialIndex ? 'border-[#e8c547] bg-[#e8c547] text-[#0a0a0a] shadow-[0_0_12px_rgba(232,197,71,0.4)]' : 'border-white/20 bg-white/5 text-[#f5f0e8]'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
