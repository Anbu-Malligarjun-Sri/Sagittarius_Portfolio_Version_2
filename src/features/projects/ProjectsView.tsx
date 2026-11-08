'use client';

import { useCallback, useEffect, useState } from 'react';
import LivingNewspaper from '@/features/newspaper/LivingNewspaper';
import CaseFiles from './CaseFiles';

type View = 'paper' | 'files';

const TABS: { id: View; label: string }[] = [
  { id: 'paper', label: 'The newspaper' },
  { id: 'files', label: 'Case files' },
];

/** The /projects page: the living newspaper first, with the case-file view one tab away. */
export default function ProjectsView() {
  const [view, setView] = useState<View>('paper');
  const [jumpTo, setJumpTo] = useState<string | null>(null);

  // "The case file" button on a newspaper page: switch tabs, then scroll to that project's file.
  const openCaseFile = useCallback((id: string) => {
    setJumpTo(id);
    setView('files');
  }, []);

  useEffect(() => {
    if (view !== 'files' || !jumpTo) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`project-${jumpTo}`)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      setJumpTo(null);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [view, jumpTo]);

  return (
    <>
      <div
        role="group"
        aria-label="Choose how to read the projects"
        className="fixed left-1/2 top-[4.4rem] z-40 flex -translate-x-1/2 items-center rounded-full border border-white/15 bg-[rgba(10,10,12,0.85)] p-1 backdrop-blur-2xl sm:top-4"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={view === tab.id}
            onClick={() => setView(tab.id)}
            className={`whitespace-nowrap rounded-full px-3.5 py-2.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 ${
              view === tab.id ? 'bg-[#e8c547] text-[#0a0a0a]' : 'text-white/65 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'paper' ? <LivingNewspaper onOpenCaseFile={openCaseFile} /> : <CaseFiles />}
    </>
  );
}
