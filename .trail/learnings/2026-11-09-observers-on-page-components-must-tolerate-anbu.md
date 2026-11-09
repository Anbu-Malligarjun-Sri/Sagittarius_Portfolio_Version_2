---
title: Observers on page components must tolerate unmount and very tall targets
author: Anbu
date: 2026-11-09
branch: main
cost: { minutes: 13, tokens: 517688 }
id: l-23fe6233
scope: repo
status: active
src: agent
touches:
  - public/Reference/Jaipur Travel Poster _ Wonders Atlas.jpg
  - "public/Reference/Mahabalipuram Travel Guide_ Explore Tamil Nadu's UNESCO World Heritage Treasure.jpg"
  - src/app/projects/page.tsx
  - src/features/home/CinematicHero.tsx
  - src/features/home/sections/active/FooterSection.tsx
  - src/features/home/sections/active/ProjectsSection.tsx
  - src/features/home/sections/active/ServicesSection.tsx
  - src/features/newspaper/LivingNewspaper.tsx
---

## Decided
Any ResizeObserver callback that reads element refs checks that they still exist and are connected before measuring. Any "reveal when scrolled into view" observer on a tall element triggers on the element's edge entering the screen, never on a percentage of its area.

## Tried and ruled out
Reading refs with non-null assertions inside a ResizeObserver callback. Triggering a reveal at 20% visible.

## Watch out
A ResizeObserver can fire one last time while the page is being left, after React has cleared the refs, which crashed client-side navigation with "Cannot read properties of null (reading 'getBoundingClientRect')". On a phone the evidence board is several screens tall, so a percentage threshold is never reached and its pieces stayed hidden. Also: a grid that sets a z-index becomes its own stacking layer, so children cannot rise above a sibling overlay.

In the code: src/features/process/EvidenceBoard.tsx (measure guard, IntersectionObserver rootMargin), src/features/process/board.module.css (.grid has no z-index on purpose).
