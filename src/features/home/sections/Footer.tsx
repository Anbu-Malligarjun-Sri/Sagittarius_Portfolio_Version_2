'use client';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8 px-8 md:px-16 bg-[#000208] z-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="font-display font-bold text-xl tracking-widest text-white mb-4">SAGITTARIUS</div>
          <p className="font-mono text-sm text-white/40 max-w-sm">Building the machines that rebuild nature.</p>
        </div>
        <div>
          <h4 className="font-mono text-xs text-white/60 mb-6 tracking-widest">INITIATIVES</h4>
          <ul className="space-y-3 font-mono text-sm text-white/40">
            <li><a href="#llm" className="hover:text-cyan-400 transition-colors">Sagittarius LLM</a></li>
            <li><a href="#mission" className="hover:text-cyan-400 transition-colors">De-Extinction Research</a></li>
            <li><a href="#products" className="hover:text-cyan-400 transition-colors">SAGITTARIX STEM</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs text-white/60 mb-6 tracking-widest">CONNECT</h4>
          <ul className="space-y-3 font-mono text-sm text-white/40">
            <li><a href="https://github.com/Anbu-Malligarjun-Sri" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">GitHub Base</a></li>
            <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">LinkedIn Node</a></li>
            <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">X / Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center font-mono text-xs text-white/30">
        <div>© 2026 SAGITTARIUS - SGR A* INITIATIVE</div>
        <div className="mt-4 md:mt-0">BUILT WITH AI + AMBITION</div>
      </div>
    </footer>
  );
}
