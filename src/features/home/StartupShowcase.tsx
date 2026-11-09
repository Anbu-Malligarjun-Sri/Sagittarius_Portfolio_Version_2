"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BlackHoleCanvas from './BlackHoleCanvas';
import Marquee from './Marquee';
import CinematicHero from './CinematicHero';
import ArchitectTypewriter from './sections/Contact';
import {
  ArrowRight,
  X,
  Menu,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import section components
import AboutSection from './sections/active/AboutSection';
import ServicesSection from './sections/active/ServicesSection';
import ProcessSection from './sections/active/ProcessSection';
import ProjectsSection from './sections/active/ProjectsSection';
import StatsSection from './sections/active/StatsSection';
import TeamSection from './sections/active/TeamSection';
import TestimonialsSection from './sections/active/TestimonialsSection';
import PricingSection from './sections/active/PricingSection';
import FAQSection from './sections/active/FAQSection';
import FooterSection from './sections/active/FooterSection';

// Import data
import { NAV_ITEMS } from './sections/active/data';
import { FOUNDERS } from '@/features/team/founders';
import type { SectionId } from './sections/active/types';

export default function StartupShowcase() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedNav, setExpandedNav] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('about');
  const [teamIndex, setTeamIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [faqIndex, setFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    });

    const handleScroll = () => {
      setExpandedNav(window.scrollY > 100);
    };

    const sectionObserverIds: SectionId[] = ['about', 'services', 'process', 'projects', 'stats', 'team', 'testimonials', 'pricing', 'faq', 'contact'];
    const triggers = sectionObserverIds
      .map((id) => {
        const element = document.getElementById(id);
        if (!element) return null;

        return ScrollTrigger.create({
          trigger: element,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => {
            setActiveSection(id);
          },
          onEnterBack: () => {
            setActiveSection(id);
          },
        });
      })
      .filter(Boolean) as ScrollTrigger[];

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker', { opacity: 0, y: 20, duration: 0.6, delay: 0.2 });
      gsap.from('.hero-line', { opacity: 0, y: 52, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2 });
      gsap.from('.hero-actions', { opacity: 0, y: 16, duration: 0.6, delay: 0.35 });

      if (!reduceMotion) {
        gsap.from('.hero-blackhole', { opacity: 0, scale: 0.9, duration: 1.2, delay: 0.1, ease: 'power3.out' });
      }

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
    if (!menuOpen) {
      menuButtonRef.current?.focus();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFirstLink = window.setTimeout(() => {
      const firstFocusable = menuPanelRef.current?.querySelector<HTMLElement>('a[href],button:not([disabled])');
      firstFocusable?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusFirstLink);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

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

  const handleMobileMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = Array.from(menuPanelRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? []);
    if (!focusableElements.length) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  };

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#050505] text-[#f5f0e8]">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(26,10,46,0.35),transparent_60%),radial-gradient(ellipse_40%_50%_at_80%_70%,rgba(13,27,62,0.25),transparent_50%)]" />

      {/* ── Navbar ── */}
      <header
        className={`fixed inset-x-0 top-4 z-40 px-3 transition-all duration-500 sm:px-6 ${expandedNav ? 'md:top-3' : 'md:top-5'}`}
      >
        <div className="mx-auto flex h-13 w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[rgba(10,10,10,0.82)] px-5 shadow-[0_4px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl">
          <Link href="/" className="font-display text-[0.72rem] font-bold tracking-[0.12em] text-[#e8c547] shrink-0">
            SAGITTARIUZ
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                href={item.id === 'about' ? '/team' : `#${item.id}`}
                className={`nav-link group relative text-[13.5px] font-medium transition-colors duration-200 ${activeSection === item.id ? 'text-[#f5f0e8]' : 'text-[#f5f0e8]/60 hover:text-[#f5f0e8]'}`}
                style={{ animationDelay: `calc(var(--delay-layer-2-nav) + ${index * 80}ms)` }}
              >
                {item.label}
                <span className="absolute left-0 top-full mt-1 h-px w-full origin-left scale-x-0 bg-[#e8c547] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-full bg-[#e8c547] px-5 py-2.25 text-[13px] font-semibold tracking-[0.02em] text-[#0a0a0a] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(232,197,71,0.3)] md:inline-flex items-center"
            >
              Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              ref={menuButtonRef}
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f5f0e8] transition-transform duration-200 hover:scale-[1.03] md:hidden"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-[#050505]/98 px-6 py-24 md:hidden" onKeyDown={handleMobileMenuKeyDown}>
          <div ref={menuPanelRef} className="mx-auto flex h-full max-w-2xl flex-col justify-between" tabIndex={-1}>
            <div className="space-y-6">
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.id}
                  href={item.id === 'about' ? '/team' : `#${item.id}`}
                  className="flex items-baseline gap-4 border-b border-white/10 pb-4 text-[clamp(2rem,7vw,3.2rem)] font-display font-bold tracking-[-0.04em]"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="font-mono text-[12px] text-[#e8c547]">0{index + 1}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e8c547] px-5 py-3 font-medium text-[#0a0a0a]" onClick={() => {
              setMenuOpen(false);
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Get Started <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
        <StatsSection activeSection={activeSection} />
        <TeamSection activeSection={activeSection} teamIndex={teamIndex} setTeamIndex={setTeamIndex} />
        <TestimonialsSection activeSection={activeSection} testimonialIndex={testimonialIndex} setTestimonialIndex={setTestimonialIndex} />
        <PricingSection activeSection={activeSection} />
        <FAQSection />

        {/* ── CONTACT SECTION (External Component) ── */}
        <ArchitectTypewriter />

        {/* ── FOOTER SECTION ── */}
        <FooterSection activeSection={activeSection} />
      </main>
    </div>
  );
}
