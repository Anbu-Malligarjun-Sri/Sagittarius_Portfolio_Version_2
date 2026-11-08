"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });
    };

    const handleHover = (e: Event) => {
      // An element (or any ancestor) can opt into a different size with data-cursor-scale; everything else grows to 3x.
      const custom = Number((e.currentTarget as HTMLElement).closest<HTMLElement>('[data-cursor-scale]')?.dataset.cursorScale);
      gsap.to(cursor, { scale: custom || 3, duration: 0.3, ease: "back.out(1.7)" });
    };

    const handleHoverOut = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    // Need a tiny delay to ensure DOM is fully ready for selector querying
    const initHoverEffects = () => {
      const interactiveElements = document.querySelectorAll("a, button, .magnetic-target");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleHover);
        el.addEventListener("mouseleave", handleHoverOut);
      });
      return interactiveElements;
    };

    const interactiveElements = initHoverEffects();
    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleHoverOut);
      });
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `body { cursor: none; } a, button { cursor: none; }` }} />
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 bg-white mix-blend-difference rounded-full pointer-events-none z-[9999]"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
