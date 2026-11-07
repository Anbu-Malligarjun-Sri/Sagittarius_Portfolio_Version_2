---
title: "This site scrolls inside the body element, so window scroll listeners never fire"
author: Anbu
date: 2026-11-07
branch: main
cost: { minutes: 9, tokens: 122119 }
id: l-f0fdea3f
scope: repo
status: active
src: agent
touches:
  - CLAUDE.md
  - public/Reference/Reference video - for Team section.mp4
  - src/app/sitemap.ts
  - src/app/team/page.tsx
  - src/features/home/StartupShowcase.tsx
  - src/features/home/sections/active/TeamSection.tsx
  - src/features/home/sections/active/data.ts
  - src/features/home/sections/active/types.ts
  - src/features/review.md
---

## Decided
Scroll-driven code on pages under the root layout listens for scroll in the capture phase, so it catches whichever element is actually scrolling.

## Tried and ruled out
A plain window scroll listener (and window.scrollTo in browser tests): neither does anything here, because the window itself never scrolls.

## Watch out
The root layout gives body a full-height box with its own overflow, so body is the scroller and the document height equals the viewport. Scroll-triggered effects silently never fire; in tests, scroll with the mouse wheel or body.scrollTo.
In the code: src/app/layout.tsx (body className h-full); src/app/globals.css (html, body overflow-x hidden); src/features/team/AssemblyChoreography.tsx (scroll listener uses capture: true).
