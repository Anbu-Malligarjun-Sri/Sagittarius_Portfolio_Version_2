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
- Validate affected files with ESLint and TypeScript, and verify desktop/mobile interactions in a browser. The repository has pre-existing TypeScript failures in the older homepage test and Later_use; distinguish those from regressions rather than reporting a clean whole-project build.

## Inquiry and portfolio refinement notes - 2026-11-10

- Service stamps now link to six `/services/[slug]` pages. `inquirySchema.ts` defines the routes and service-specific questions; `InquiryForm.tsx` provides two entry stages and a review. Do not restore browser-only reservation confirmations or imply that an inquiry books work.
- `/api/inquiries` and `/api/contact` validate on the server, cap actual request bytes, and send through Resend. Success means provider acceptance, not guaranteed inbox delivery. Keep the request ID stable on unchanged retries; provider idempotency lasts 24 hours. Rate limits are per-instance, not a distributed abuse-control system. Do not test by sending real email without explicit authorization.
- Service draft saving is explicit and local to the device, with a seven-day expiry checked on restore. Handle unavailable/corrupt storage, preserve answers after failed requests, and keep the downloadable brief and email alternatives.
- The contact typewriter uses `ContactBrief.tsx` for a native-dialog form with labels, touch/paste support, optional project/service/budget/timeline/URL fields, and permission to reply. Name, email and message are essential; nationality and mandatory phone collection are retired. Scope mechanical keyboard capture to the typewriter, never the whole homepage. Audio must not be required to submit the form.
- The contact launcher must sit below the fixed navigation. Keep the dialog viewport-bounded and scrollable, with a visible close control and Escape support.
- `/projects` now renders only `LivingNewspaper`; the alternate project case-file components are removed. The Process section's separate detective-board case files are unrelated and remain.
- `newspaper/evidence.ts` separates contribution, visible artifacts and limitations. Screenshots, interface telemetry and a repository link do not establish benchmark accuracy, adoption or client outcomes. Replace evidence only with verified results; keep the Techazura story historical.
- The About letter and paper physics remain unchanged. Its instrument uses deliberate discipline selection, a unified cabinet and an illustrative signal control; these are not measured research data.
- Founder arrows still assemble actual DOM targets. Card-corner tracking includes scale; registration marks briefly confirm alignment after the flip and disappear with the crew. No decorative wandering arrows or full-page red margin rule.
- Metadata and social previews describe AI/STEM software, founded in 2026. Service routes have distinct canonicals and sitemap entries. Do not generate false modification dates or add unverified SEO claims. The homepage search launcher is retired in favour of the Index.
- Ways to Begin offers a scoped working prototype (one workflow, demo/walkthrough, known limits), not a fixed one-week consulting engagement. Agree timeline and commercial terms per project.
