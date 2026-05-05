'use client';

import { Cpu, Database, Network, Terminal } from 'lucide-react';

export default function TechStack() {
  return (
    <section id="tech" className="py-32 px-8 md:px-16 border-y border-white/5 bg-[#020308]/80 z-10 relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        <div className="flex-1">
          <div className="font-mono text-orange-400 text-xs tracking-widest mb-4">// INFRASTRUCTURE</div>
          <h2 className="font-display font-bold text-4xl mb-12">The Technology Matrix.</h2>

          <div className="space-y-8 font-mono text-sm">
            {[
              { cat: 'SOFTWARE', tech: 'Python, Next.js, PyTorch, OpenCV' },
              { cat: 'HARDWARE', tech: 'Raspberry Pi, Jetson Nano, LiDAR' },
              { cat: 'AI SYSTEMS', tech: 'FAISS, RAG, Transformers, LLMs' },
              { cat: 'QUANTUM OPS', tech: 'Scientific Computing, Qiskit' },
            ].map((item, i) => (
              <div key={i} className="flex border-b border-white/10 pb-4 hover:border-cyan-400/50 transition-colors group">
                <span className="w-32 text-white/40 group-hover:text-cyan-400 transition-colors">{item.cat}</span>
                <span className="text-white/80">{item.tech}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 relative">
          {[
            { icon: <Database size={24} />, label: 'VECTOR DB' },
            { icon: <Network size={24} />, label: 'NEURAL NET' },
            { icon: <Cpu size={24} />, label: 'TENSOR OPS' },
            { icon: <Terminal size={24} />, label: 'SYSTEM LOG' },
          ].map((item, i) => (
            <div key={i} className="glass-panel aspect-square flex flex-col items-center justify-center p-6 gap-4 hover:bg-white/5 transition-all duration-300">
              <div className="text-white/30">{item.icon}</div>
              <div className="font-mono text-xs tracking-widest text-center text-white/50">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
