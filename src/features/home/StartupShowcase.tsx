"use client";

import { useEffect, useRef, useState } from 'react';
import SiteNav from './SiteNav';
import BlackHoleCanvas from './BlackHoleCanvas';
import Marquee from './Marquee';
import CinematicHero from './CinematicHero';
import ArchitectTypewriter from './sections/Contact';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import section components
import AboutSection from './sections/active/AboutSection';
import ServicesSection from './sections/active/ServicesSection';
import ProcessSection from './sections/active/ProcessSection';
import ProjectsSection from './sections/active/ProjectsSection';
import TeamSection from './sections/active/TeamSection';
import StartSection from './sections/active/StartSection';
import FAQSection from './sections/active/FAQSection';
import FooterSection from './sections/active/FooterSection';

// Import data
import { FOUNDERS } from '@/features/team/founders';
import type { SectionId } from './sections/active/types';

export default function StartupShowcase() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [teamIndex, setTeamIndex] = useState(0);
  const [faqIndex, setFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    });

    const sectionObserverIds: SectionId[] = ['about', 'services', 'process', 'projects', 'team', 'start', 'faq', 'contact'];
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const line = Math.min(window.innerHeight * .35, 220);
      const hero = document.querySelector<HTMLElement>('[data-easylog]')?.getBoundingClientRect();
      if (hero && hero.top <= line && hero.bottom > line) {
        setActiveSection(null);
        return;
      }
      const current = sectionObserverIds.find(id => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect && rect.top <= line && rect.bottom > line;
      });
      setActiveSection(current ?? null);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(updateActive); };
    // The document body can be the scroller; capture events from either surface.
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.from('.section-block', {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { start: 'top 78%' },
      });

      gsap.from('.postit-card', {
        opacity: 0,
        y: 28,
        rotation: 'random(-8,8)',
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: { trigger: '#about', start: 'top 68%' },
      });

      gsap.utils.toArray<HTMLElement>('.section-header-container').forEach((el) => {
        gsap.from(el.querySelectorAll('.header-anim-item'), {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setTeamIndex((value) => (value - 1 + FOUNDERS.length) % FOUNDERS.length);
      }
      if (event.key === 'ArrowRight') {
        setTeamIndex((value) => (value + 1) % FOUNDERS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#050505] text-[#f5f0e8]">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(26,10,46,0.35),transparent_60%),radial-gradient(ellipse_40%_50%_at_80%_70%,rgba(13,27,62,0.25),transparent_50%)]" />

      <SiteNav activeSection={activeSection} />

      <main id="main-content" className="relative z-10">
        {/* ── HERO SECTION ── */}
        <CinematicHero />

        {/* ── Marquee strip ── */}
        <div className="relative z-10">
          <Marquee />
        </div>

        {/* ── SECTION COMPONENTS ── */}
        <AboutSection activeSection={activeSection} />
        <ServicesSection activeSection={activeSection} />
        <ProcessSection activeSection={activeSection} />
        <ProjectsSection activeSection={activeSection} />
        <TeamSection activeSection={activeSection} teamIndex={teamIndex} setTeamIndex={setTeamIndex} />
        <StartSection />
        <FAQSection />

        {/* ── CONTACT SECTION (External Component) ── */}
        <ArchitectTypewriter />

        {/* ── FOOTER SECTION ── */}
        <FooterSection activeSection={activeSection} />
      </main>
    </div>
  );
}
