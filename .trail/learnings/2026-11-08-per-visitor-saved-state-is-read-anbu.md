---
title: "Per-visitor saved state is read with an external store, not copied into state in an effect"
author: Anbu
date: 2026-11-08
branch: main
cost: { minutes: 7, tokens: 130988 }
id: l-4f178819
scope: repo
status: active
src: agent
touches:
  - public/Project_images/Techazura.png
  - public/Project_images/techazura-site.webp
  - src/app/projects/page.tsx
  - src/app/sitemap.ts
  - src/features/command/CommandPalette.tsx
  - src/features/home/sections/active/ProjectsSection.tsx
  - src/features/home/sections/active/data.ts
  - src/features/home/sections/active/types.ts
  - src/features/projects/CaseFiles.tsx
  - src/features/projects/ProjectFile.tsx
---

## Decided
Visitor keepsakes kept in localStorage (the reserved service stamps) are read through useSyncExternalStore with an empty server snapshot, so server and first client render match and the saved value appears after hydration.

## Tried and ruled out
Loading localStorage inside useEffect and calling setState. The project's lint rule react-hooks/set-state-in-effect rejects it as an error.

## Watch out
Writes must notify subscribers by hand (same-tab writes do not fire the storage event). Keep an in-memory fallback for private windows where localStorage throws.

In the code: src/features/services/StampAlbum.tsx (subscribe, readRaw, writeRaw); storage key "sagittarius-stamp-album".
