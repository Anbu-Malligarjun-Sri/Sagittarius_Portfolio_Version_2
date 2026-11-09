import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProjectsView from '@/features/projects/ProjectsView';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'The projects of the Sagittariuz lab, told as a living newspaper: Oceanography AI, TARS and the Techazura Symposium website.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <div data-cursor-scale="1.6" className="relative min-h-screen overflow-x-clip bg-[#070b0e] text-[#f5f0e8]">
      <Link
        href="/"
        aria-label="Back to the main page"
        className="fixed left-5 top-4 z-40 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-[rgba(10,10,12,0.8)] pl-3.5 pr-5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-2xl transition-all duration-200 hover:-translate-x-0.5 hover:border-[#e8c547] hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <main id="main-content">
        <ProjectsView />
      </main>
    </div>
  );
}
