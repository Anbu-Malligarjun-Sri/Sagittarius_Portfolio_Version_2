---
title: "Dialogs on the home page must stop key events, because the typewriter swallows keys globally"
author: Anbu
date: 2026-11-07
branch: main
cost: { minutes: 20, tokens: 163870 }
id: l-f8206b39
scope: repo
status: active
src: agent
touches:
  - src/app/team/page.tsx
  - src/features/team/AssemblyChoreography.tsx
  - src/features/team/CursorSwarm.tsx
  - src/features/team/Exhibit.tsx
  - src/features/team/HeroPortrait.tsx
  - src/features/team/team.module.css
  - src/features/team/FounderDialog.tsx
  - src/features/social/plushHair.ts
  - src/features/social/plushShaders.ts
  - src/features/social/socials.ts
---

## Decided
Any dialog with a text input stops keydown from bubbling past itself (stopPropagation on the dialog).

## Tried and ruled out
Relying on the input having focus: the page-level handler still receives the event and cancels the default action, so typing does nothing.

## Watch out
The contact typewriter on the home page listens on window for keydown and prevents the default action for letters, arrows and Tab. Anything typed into an overlay on that page is swallowed unless propagation is stopped. Also, the hint-style cursor grows to 3x on links unless the element sets data-cursor-scale.
In the code: src/features/home/sections/Contact.tsx (window keydown listener near line 871); src/features/command/CommandPalette.tsx (onKeyDown stopPropagation on the dialog).
