---
title: "The live paper must not force-lose its WebGL context, and its test shots must be full-window"
author: Anbu
date: 2026-11-09
branch: main
cost: { minutes: 21, tokens: 245681 }
id: l-27c48c68
scope: repo
status: active
src: agent
touches:
  - public/Issue/image.png
  - src/app/api/contact/route.ts
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/opengraph-image.tsx
  - src/app/projects/page.tsx
  - src/app/robots.ts
  - src/app/sitemap.ts
  - src/app/team/page.tsx
  - src/features/command/CommandPalette.tsx
---

## Decided
The live About paper disposes its renderer with renderer.dispose() only, never forceContextLoss(). Its test screenshots are taken of the whole window, not a cropped region.

## Tried and ruled out
forceContextLoss() on cleanup: React dev mode (StrictMode) mounts, unmounts and remounts effects, and a canvas whose context was force-lost cannot start a new renderer, so the paper would silently fall back to the static letter in development. Puppeteer clip regions for screenshots: clip is in page coordinates, so on a scrolled page it captured the wrong area and looked like a rendering bug.

## Watch out
After editing code, the dev server recompiles and the paper (which loads three on demand) can take ~10s to appear, so tests must wait for data-mode="live" on the paper's wrapper before judging it. A component that calls window.matchMedia directly will crash the homepage integration test environment; guard it with optional chaining.

In the code: src/features/about/paperScene.ts (dispose), src/features/about/LivePaper.tsx (reducedNow, data-mode).
