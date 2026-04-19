'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { HomeWindow, TweenLike } from '../gsapTypes';

const NAV_ITEMS = [
  { label: 'MISSION', sectionId: 'mission' },
  { label: 'LLM', sectionId: 'llm' },
  { label: 'PRODUCTS', sectionId: 'products' },
  { label: 'TECH', sectionId: 'tech' },
  { label: 'ROADMAP', sectionId: 'roadmap' },
  { label: 'LAB', sectionId: 'lab' },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const w = window as HomeWindow;
    const tweens: TweenLike[] = [];

    // Scroll shrink + blur
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('bg-black/55', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3');
        nav.classList.remove('py-8');
      } else {
        nav.classList.remove('bg-black/55', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3');
        nav.classList.add('py-8');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    nav.style.opacity = '1';
    nav.style.visibility = 'visible';
    nav.style.transform = 'translateY(0)';

    if (w.gsap) {
      tweens.push(
        w.gsap.fromTo(
          nav,
          { y: -24 },
          { y: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' },
        ),
      );

      if (logoRef.current) {
        tweens.push(
          w.gsap.to(logoRef.current, {
            textShadow: '0px 0px 20px rgba(34,211,238,0.8)',
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: 'sine.inOut',
          }),
        );
      }

      if (linksRef.current?.children?.length) {
        tweens.push(
          w.gsap.from(linksRef.current.children, {
            opacity: 0,
            y: -20,
            stagger: 0.1,
            delay: 0.5,
            duration: 0.8,
            ease: 'power3.out',
          }),
        );
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      tweens.forEach((tween) => tween?.kill?.());
      nav.style.opacity = '1';
      nav.style.transform = 'none';
      nav.style.visibility = 'visible';
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateBodyOverflow = () => {
      const isSmallScreen = window.innerWidth < 768;
      const shouldLock = menuOpen && isSmallScreen;
      document.body.style.overflow = shouldLock ? 'hidden' : '';
      if (!isSmallScreen && menuOpen) {
        setMenuOpen(false);
      }
    };

    updateBodyOverflow();
    window.addEventListener('resize', updateBodyOverflow);

    return () => {
      window.removeEventListener('resize', updateBodyOverflow);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 inset-x-0 z-200 pointer-events-auto flex items-center justify-between px-6 md:px-16 transition-all duration-500 py-6 md:py-8 text-xs font-mono tracking-widest bg-black/45 backdrop-blur-md border-b border-white/10"
      >
        <Link href="/" ref={logoRef} className="flex items-center gap-3 cursor-pointer group" aria-label="Sagittarius home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white group-hover:text-cyan-400 transition-colors" role="img" aria-label="Sagittarius logo">
            <path d="M12 2v20M17 5c0 0-3.5 3-5 3S7 5 7 5M12 2L9 5M12 2l3 3" />
          </svg>
          <span className="font-display font-bold text-lg tracking-widest text-white group-hover:text-cyan-400 transition-colors">
            SAGITTARIUS
          </span>
        </Link>

        <div ref={linksRef} className="hidden md:flex gap-10 text-white/50">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={`#${item.sectionId}`}
              className="relative group overflow-hidden"
            >
              <span className="group-hover:text-cyan-400 transition-colors duration-300">
                {item.label}
              </span>
              <span className="absolute left-0 bottom-0 w-0 h-px bg-cyan-400 transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 blur-md opacity-70" />
            </div>
            <span className="text-white/60">SYSTEM ONLINE</span>
          </div>

          <Link
            href="/species-de-extinction"
            className="hidden md:inline-flex items-center border border-cyan-400/40 px-5 py-3 rounded text-xs font-mono tracking-widest text-cyan-100 hover:border-cyan-300 hover:text-cyan-300 transition-colors"
          >
            DE-EXTINCTION
          </Link>

          <a
            href="#contact"
            className="hidden md:inline-block relative border border-white/20 px-6 py-3 rounded overflow-hidden group"
          >
            <span className="relative z-10 group-hover:text-orange-400 transition-colors">
              ENTER LAB
            </span>
            <span className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="absolute inset-0 rounded border border-orange-400 opacity-0 group-hover:opacity-100 blur-sm transition duration-500" />
          </a>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded border border-white/20 text-white hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[210] bg-black/95 backdrop-blur-xl pt-24 px-8">
          <div className="flex flex-col gap-6 text-center font-mono text-xl tracking-wide">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={`#${item.sectionId}`}
                className="text-white/80 hover:text-cyan-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/species-de-extinction"
              className="text-cyan-300 hover:text-cyan-200 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              DE-EXTINCTION
            </Link>
            <a
              href="#contact"
              className="mt-4 inline-block border border-white/20 py-3 px-6 rounded text-white/90 hover:text-orange-400 hover:border-orange-400/60 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              ENTER LAB
            </a>
          </div>
        </div>
      )}
    </>
  );
}
