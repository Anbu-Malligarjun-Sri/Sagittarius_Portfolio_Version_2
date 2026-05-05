'use client';

interface ProcessSectionProps {
  activeSection: string;
}

export default function ProcessSection({ activeSection }: ProcessSectionProps) {
  return (
    <section id="process" className="section-block scroll-mt-28 bg-[#0d1b2a] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-header-container">
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547] header-anim-item">HOW IT WORKS</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] mt-4 header-anim-item">A process that keeps decisions visible.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72 header-anim-item">Discovery, strategy, build, and launch stay explicit so teams can see what changed and why.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl rounded-none border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px,40px_40px,8px_8px,8px_8px] p-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="relative min-h-[520px]">
            <svg className="absolute inset-0 h-full w-full">
              <path className="blueprint-path" d="M90 88 H320 V162 H470" stroke="rgba(255,255,255,0.22)" strokeDasharray="6 4" strokeWidth="1.5" fill="none" />
              <path className="blueprint-path" d="M470 162 V270 H220" stroke="rgba(255,255,255,0.22)" strokeDasharray="6 4" strokeWidth="1.5" fill="none" />
              <path className="blueprint-path" d="M220 270 V392 H460" stroke="rgba(255,255,255,0.22)" strokeDasharray="6 4" strokeWidth="1.5" fill="none" />
            </svg>
            <div className="relative grid gap-16 pt-8">
              {[
                ['01', 'Discovery', 'We map the problem space, the constraints, and the decision makers before design starts.' ],
                ['02', 'Strategy', 'We turn the research into a focused plan, a clear message, and a buildable system.' ],
                ['03', 'Build', 'The interface gets engineered carefully, with motion and structure carrying the same intent.' ],
                ['04', 'Launch', 'We ship, tune the edges, and hand over a product that is ready to use without extra explanation.' ],
              ].map(([number, title, copy], index) => (
                <div key={title} className={`step-node flex items-start gap-6 ${index % 2 === 0 ? 'justify-self-start' : 'justify-self-end'}`}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-[#0d1b2a]/90 backdrop-blur-[8px]">
                    <div className="text-center font-mono text-[18px] font-bold text-[#e8c547]">{number}</div>
                  </div>
                  <div className="step-card max-w-[240px] rounded-[6px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 backdrop-blur-[20px]">
                    <div className="font-display text-[15px] font-bold text-[#f5f0e8]">{title}</div>
                    <p className="mt-2 text-[13px] leading-7 text-[#f5f0e8]/70">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute right-0 top-0 rounded-[4px] border border-white/15 bg-[#0a0f14] px-4 py-3 font-mono text-[11px] text-white/50">
              PROJECT: SAGITTARIUS
              <br />
              DRAWING: PROCESS FLOW
              <br />
              SCALE: NTS / REV 01
            </div>
            <div className="mt-24 space-y-4 text-white/60">
              <div className="rounded-[4px] border border-white/10 px-4 py-3 font-mono text-[11px] italic">Dimension line 48.2m · confidence vector stable</div>
              <div className="rounded-[4px] border border-white/10 px-4 py-3 font-mono text-[11px] italic">Section note: keep the story visible before the micro-details.</div>
              <div className="rounded-[4px] border border-white/10 px-4 py-3 font-mono text-[11px] italic">Field note: paths draw on scroll to match plan views.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
