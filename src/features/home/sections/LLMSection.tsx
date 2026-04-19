'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Code2, Database, Layers, TerminalSquare } from 'lucide-react';
import type { HomeWindow } from '../gsapTypes';

type LlmTab = 'M1' | 'M2' | 'ORGANIZER';

export default function LLMSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<LlmTab>('M1');

  useLayoutEffect(() => {
    const container = containerRef.current;
    const w = window as HomeWindow;
    const gsap = w.gsap;
    if (!container || !gsap) return;

    const ctx = gsap.context(() => {
      gsap.from('.llm-element', {
        scrollTrigger: { trigger: container, start: 'top 65%' },
        y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const pythonSnippet = `from sagittarius import SagittariusM1, Organizer

model = SagittariusM1.load('sgr-m1-base')
org = Organizer(models=[model])

response = org.run(
    query = "Analyze mammoth genome sequence",
    mode = "scientific"
)
print(response.output)
# > [SGR-M1]: Initiating genomic analysis...`;

  return (
    <section id="llm" ref={containerRef} className="py-32 px-8 md:px-16 border-y border-white/5 bg-[#010206]/90 z-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 w-full">
          <div className="llm-element font-mono text-cyan-400 text-xs tracking-widest mb-4">// CORE INTELLIGENCE</div>
          <h2 className="llm-element font-display font-bold text-4xl md:text-5xl mb-8">Sagittarius LLM</h2>

          <div className="llm-element flex gap-4 mb-8 border-b border-white/10 pb-4">
            {(['M1', 'M2', 'ORGANIZER'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`font-mono text-xs px-4 py-2 rounded-sm transition-all ${activeTab === tab ? 'bg-white/10 text-white border-b-2 border-cyan-400' : 'text-white/40 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="llm-element min-h-[120px] mb-8">
            {activeTab === 'M1' && <div><span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono mb-4">STATUS: IN DEVELOPMENT</span><p className="text-white/60 font-light">Base language model. Core reasoning and scientific generation trained exclusively on astrophysics and biological data sets.</p></div>}
            {activeTab === 'M2' && <div><span className="inline-block px-2 py-1 bg-white/5 text-white/50 border border-white/10 text-[10px] font-mono mb-4">STATUS: PLANNED</span><p className="text-white/60 font-light">Enhanced reasoning module with deep context and infinite memory. Built for continuous RAG pipeline integration.</p></div>}
            {activeTab === 'ORGANIZER' && <div><span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono mb-4">STATUS: CONCEPTUAL</span><p className="text-white/60 font-light">System orchestrator. Intelligently routes queries between M1, M2, and external computing APIs like Quantum hardware.</p></div>}
          </div>

          <div className="llm-element glass-panel p-6 rounded relative overflow-hidden">
            <div className="font-mono text-xs text-white/30 mb-4 flex items-center gap-2"><Code2 size={14} /> SYSTEM ORCHESTRATION</div>
            <pre className="font-mono text-xs text-green-400/80 overflow-x-auto"><code>{pythonSnippet}</code></pre>
          </div>
        </div>

        <div className="flex-1 w-full flex justify-center items-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.1)_0%,transparent_70%)]" />
          <div className="flex flex-col gap-8 w-full max-w-sm relative z-10">
            <div className="llm-element glass-panel p-4 flex justify-between items-center border-l-2 border-l-cyan-400"><div className="font-mono text-xs">INPUT VECTOR</div><Database size={16} className="text-cyan-400" /></div>
            <div className="flex justify-center -my-4 z-[-1] opacity-50"><div className="w-px h-12 bg-cyan-400/50" /></div>
            <div className="llm-element glass-panel p-4 flex justify-between items-center border-l-2 border-l-orange-500"><div className="font-mono text-xs">ATTENTION LAYERS (M1)</div><Layers size={16} className="text-orange-500" /></div>
            <div className="flex justify-center -my-4 z-[-1] opacity-50"><div className="w-px h-12 bg-orange-500/50" /></div>
            <div className="llm-element glass-panel p-4 flex justify-between items-center border-l-2 border-l-green-500"><div className="font-mono text-xs">OUTPUT GENERATION</div><TerminalSquare size={16} className="text-green-500" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
