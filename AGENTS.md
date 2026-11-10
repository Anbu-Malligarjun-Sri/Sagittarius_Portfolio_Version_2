<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Portfolio implementation notes — 2026-11-10

- The brand is **Sagittariuz**, started in **2026**. Its purpose is to reduce friction through useful AI, including tools for researchers and students. Do not invent client results, company age, prices, or agreed commercial terms.
- `src/features/home/CinematicHero.tsx` delegates to `easylog/Hero.tsx`. The log artwork and moss interaction remain; visible copy belongs to Sagittariuz. Keep both log images aligned, preserve reduced motion, and avoid changing other sections through hero CSS.
- `src/features/home/SiteNav.tsx` is the homepage's single persistent navigation. Do not recreate a second hero navbar or hide/swap the navigation at the hero boundary. Its Index dialog provides real section links and project/team subpage links. Preserve Escape, focus restoration, and body-scroll restoration.
- The document body can be the scroll container. Navigation tracking listens in capture phase and measures actual section rectangles. Browser checks should wait for the target position rather than assume a fixed delay completes a long smooth scroll.
- The six active services are UI/UX Design, Web Development, Mobile Apps, AI Agents, AI Integration, and SEO Optimization. `src/features/home/sections/active/data.ts` and `src/features/services/stamps.ts` must agree. Consulting and Brand Identity are retired. Do not map their stored reservation IDs to new services.
- The AI Agents artwork is `src/features/services/AgentsArt.tsx`: a 192 × 190 SVG automaton atelier, rendered through the existing perforated stamp frame. Keep SVG IDs instance-specific, and respect reduced motion. The SEO artwork still depends on its `rollingWave` helper.
- The reading room is `FAQSection.tsx`, `faq.module.css`, and `Lantern.tsx`. Its lantern cursor is limited to `#faq`; leaving the section restores the normal cursor. Answers must remain accessible through keyboard focus, the show-all control, and touch layouts. Do not make pointer movement the only way to read them.
- The previous 3D knowledge atlas is preserved in `src/features/home/drafts/knowledge-atlas/`, with restoration instructions in its README. It is not loaded by the active homepage.
- Validate affected files with ESLint and TypeScript, and verify desktop/mobile interactions in a browser. The repository has pre-existing TypeScript failures in Contact, the older homepage test, and Later_use; distinguish those from regressions rather than reporting a clean whole-project build.
