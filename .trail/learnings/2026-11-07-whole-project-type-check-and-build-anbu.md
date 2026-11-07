---
title: "Whole-project type check and build already fail on old errors, so check only the files you changed"
author: Anbu
date: 2026-11-07
branch: main
cost: { minutes: 17, tokens: 334004 }
id: l-1a53bbcc
scope: repo
status: active
src: agent
touches:
  - pnpm-lock.yaml
  - pnpm-workspace.yaml
  - src/features/review.md
  - src/features/team/founders.ts
  - src/features/team/fonts.ts
  - src/features/team/FounderParts.tsx
  - src/features/team/FounderDialog.tsx
  - src/features/home/sections/active/TeamSection.tsx
  - src/app/sitemap.ts
  - src/features/team/team.module.css
---

## Decided
Verify changes by filtering type-check output to the touched files, plus eslint on them. A clean filtered result means the change is fine; do not wait for a green whole-project run.

## Tried and ruled out
Running the whole-project type check or the production build as the pass/fail signal: both fail on errors that predate any recent change.

## Watch out
The project-wide type check and the build currently fail on old errors, so a "pass" report from a tool may only reflect a filtered run.
In the code: src/features/home/sections/Contact.tsx (reduce call near line 626, type mismatch); src/app/page.integration.test.tsx (vitest globals not in tsconfig types); src/features/home/sections/Later_use/* (imports of missing modules). Command used: npx tsc --noEmit piped through grep for the touched paths.
