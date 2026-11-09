'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FAQS } from './data';

// --- DATA ---
// The grid is filled from the site's real questions and answers (FAQS in data.ts). Empty cells are intentional negative space.
type GridCell = {
  id: string;
  /** The small label in the corner: the question's category. */
  year: string;
  title?: string;
  text: string;
  isEmpty: boolean;
};

const SLOTS = 12;
const FILLED = [0, 1, 3, 4, 6, 7, 8, 9]; // which of the 12 cells hold a question; the others stay empty
const GRID_DATA: GridCell[] = Array.from({ length: SLOTS }, (_, i) => {
  const faq = FILLED.includes(i) ? FAQS[FILLED.indexOf(i)] : undefined;
  return faq
    ? { id: `c${i + 1}`, year: faq.category, title: faq.question, text: faq.answer, isEmpty: false }
    : { id: `c${i + 1}`, year: '', text: '', isEmpty: true };
});

export default function InteractiveRevealGrid() {
  const [isLightOn, setIsLightOn] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // --- PHYSICS & PROXIMITY ENGINE ---
  // High-performance mouse tracking using requestAnimationFrame and direct DOM mutation.
  // We calculate Euclidean distance to each card's center to drive localized opacity and glow.
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isLightOn || !gridContainerRef.current) return;

    const { clientX, clientY } = e;

    cardsRef.current.forEach((card) => {
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Update local mouse coordinates for the radial gradient glow
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate distance from cursor to the exact center of this specific card
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));

      // Inverse square-like falloff for smooth proximity reveals (max radius 450px)
      const maxDistance = 450;
      const proximity = Math.max(0, 1 - (distance / maxDistance));
      
      // We square the proximity for a steeper, more cinematic drop-off curve
      card.style.setProperty('--proximity', `${Math.pow(proximity, 2)}`);
    });
  }, [isLightOn]);

  const handleMouseLeave = useCallback(() => {
    // Gracefully fade out the spotlight when the cursor leaves the grid area
    cardsRef.current.forEach((card) => {
      if (!card) return;
      card.style.setProperty('--proximity', '0');
    });
  }, []);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Reset proximity on mount to ensure clean state
    handleMouseLeave();
  }, [handleMouseLeave]);

  return (
    <section id="faq" className="relative min-h-screen w-full bg-[#030303] text-[#f5f5f5] selection:bg-[#e8c547] selection:text-black font-sans overflow-hidden py-24 px-4 sm:px-8 lg:px-16 flex flex-col justify-center">
      
      {/* Background Ambient Noise/Texture (Optional, adds cinematic depth) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div className="mx-auto max-w-7xl w-full relative z-10">
        
        {/* --- HEADER ARCHITECTURE --- */}
        <header className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-20 gap-10">
          <div className="max-w-xs">
            <h2 className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/40 leading-relaxed">
              Questions we expect<br />
              you to ask, answered<br />
              plainly.
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-8">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight text-white/95 leading-[1.1]">
              Switch on the light, <br className="hidden md:block"/>
              <span className="text-white/60 italic">read it all</span>
            </h1>

            {/* Hyper-Modern Toggle Switch */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full py-2 px-3 backdrop-blur-md">
              <button
                type="button"
                role="switch"
                aria-checked={isLightOn}
                onClick={() => setIsLightOn(!isLightOn)}
                className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"
                style={{ backgroundColor: isLightOn ? '#e8c547' : 'rgba(255,255,255,0.1)' }}
              >
                <span className="sr-only">Toggle: show every answer at once</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                    isLightOn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="font-mono text-xs uppercase tracking-widest text-white/70 pr-2 select-none">
                {isLightOn ? 'Dim the light' : 'Turn on the light'}
              </span>
            </div>
          </div>
        </header>

        {/* --- DYNAMIC INTERACTIVE GRID --- */}
        <div 
          ref={gridContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-white/5"
        >
          {GRID_DATA.map((cell, index) => {
            const isCenterEmpty = cell.isEmpty && index === 5; // The center blank square for the logo

            return (
              <div
                key={cell.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`
                  group relative h-[280px] border-r border-b border-white/5 
                  transition-all duration-500 ease-out overflow-hidden
                  ${cell.isEmpty ? 'bg-transparent' : 'cursor-crosshair'}
                  ${isCenterEmpty ? 'flex items-center justify-center' : ''}
                `}
              >
                {/* LAYER 1: The Ambient Radial Glow (Spotlight) 
                  Calculated purely via CSS variables mutated by JS requestAnimationFrame.
                */}
                {!isLightOn && !cell.isEmpty && (
                  <div 
                    className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(232, 197, 71, 0.12), transparent 40%)',
                      opacity: 'calc(var(--proximity, 0) * 1.5)',
                    }}
                  />
                )}

                {/* LAYER 2: The Exact Cell Content 
                */}
                {isCenterEmpty ? (
                  // The central aesthetic focal point
                  <Sparkles className={`w-8 h-8 text-white/20 transition-all duration-700 ${isLightOn ? 'text-[#e8c547] rotate-12 scale-110' : 'group-hover:text-white/60 group-hover:rotate-90'}`} strokeWidth={1} />
                ) : cell.isEmpty ? (
                  null // Intentional negative space
                ) : (
                  <div 
                    className={`
                      absolute inset-0 z-10 flex flex-col justify-between p-8
                      transition-all duration-500 ease-in-out
                      ${isLightOn ? 'bg-white/[0.02] opacity-100' : 'bg-transparent'}
                      hover:bg-[#e8c547] hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#e8c547]/20 hover:z-20
                    `}
                    style={{
                      // When the light is off, opacity is driven by proximity to cursor.
                      // When hovered, it forces full opacity.
                      opacity: isLightOn ? 1 : 'max(calc(var(--proximity, 0) * 2), 0.05)',
                    }}
                  >
                    {/* Top Row: Year/Id */}
                    <div className="flex justify-between items-start w-full">
                      <span className={`font-mono text-sm transition-colors duration-300 ${isLightOn ? 'text-[#e8c547]' : 'text-white/40'} group-hover:text-black/70`}>
                        {cell.year}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-black" />
                    </div>

                    {/* Bottom Row: Content */}
                    <div className="space-y-3">
                      {cell.title && (
                        <h3 className={`font-serif text-xl transition-colors duration-300 ${isLightOn ? 'text-white' : 'text-white/80'} group-hover:text-black`}>
                          {cell.title}
                        </h3>
                      )}
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${isLightOn ? 'text-white/70' : 'text-white/50'} group-hover:text-black/80 font-medium`}>
                        {cell.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}