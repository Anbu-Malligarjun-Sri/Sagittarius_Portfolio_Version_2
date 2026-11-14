# Sagittariuz Portfolio: Codebase Review

Read-only audit. No code was changed. Based on reading the source and file sizes; the app was not run and no Lighthouse audit was performed.

## 1. What this is and how it's built

**Stack:** Next.js 16.2.3 App Router, React 19, TypeScript, Tailwind v4, GSAP with ScrollTrigger, Three.js, Resend for email, Vitest. There is no CMS or database.

**Routes:**
- `/` is one long page.
- `/about` has the founders.
- `/api/contact` sends the contact form through Resend.
- Also present: `robots.ts`, `sitemap.ts`, and a generated `opengraph-image.tsx`.

**Structure:** feature-folder layout. `StartupShowcase.tsx` holds the shell and navbar, then composes `CinematicHero`, `Marquee`, 9 section components in `sections/active/`, and the `Contact` typewriter. Content lives in `active/data.ts`, and `REFACTORING_GUIDE.md` documents the split.

**Design pattern, and what makes it distinctive:** each section has its own physical metaphor, which is why it doesn't look like a template.

| Section | Metaphor |
|---|---|
| Projects | A newspaper, "The Portfolio Times" |
| Team | A Rolodex |
| Testimonials | A vinyl jukebox |
| Pricing | A chalkboard menu ("Chef's special") |
| Contact | A working typewriter OS with sound and ink-bleed effects |
| Footer | A city map with "You are here" |
| Hero | A black hole plus gold-on-black editorial typography |

Shared pieces are the gold `#e8c547` accent, a noise overlay, a custom cursor, and five Google fonts.

## 2. Design and engineering flaws to fix

### Credibility (the most damaging)
1. **The content is placeholder copy presented as fact.** The team (Mina Sol, Rowan Vale, and others) is fictional, and the testimonials are invented (Cinder Lane, Northglass). The stats say "200+ projects, 12+ years, 40 countries, 98% satisfaction". The hero says "12+ years", yet the team's own `/about` page shows founders who appear to be students. The footer has `+1 (555) ...` and "Tuesday, January 2025". A visitor who spots one fake claim will distrust the real work too. This is the biggest issue.
2. **There are two identities.** "Six people" says team, "Sagittariuz is a studio" says agency, and the projects say research lab and STEM initiative. The site doesn't say who it is for or what to buy.
3. **Pricing ($499/mo, "5 projects") contradicts the 4-12 week project timelines**, and the "Reserve a spot" button does nothing.
4. **Dead links and buttons:** the footer has 20 links that all go to `href="#"` (Careers, Blog, Terms, Twitter, LinkedIn and others). The three footer icons are decorative. The projects say "Continued on page 2 →" but there is no page 2, and no project has a case-study page or link.
5. **Project images are generated SVG posters** (`makePoster`), not real screenshots. For a portfolio, you can't see any of the work.

### Bugs found by reading
- `StartupShowcase.tsx` (~line 140): the menu effect runs `menuButtonRef.current?.focus()` when `menuOpen` is false, which includes first mount. The page steals focus on load, and the keyboard focus ring lands on the hamburger.
- Global ArrowLeft/ArrowRight handler hijacks arrow keys everywhere, including form fields, and is hardcoded to `6` instead of `TEAM.length`.
- The "About Us" nav item links to `/about` while the others are hash anchors. It also appears twice in the navbar, once as a link and once as a button.
- The sections receive `activeSection` props that they never use (dead props).
- `BlackHoleCanvas` (466 lines of Three.js) is imported in `StartupShowcase.tsx` but never rendered. `GlobalStyles.tsx` is not imported anywhere and references fonts that don't exist (`--font-poppins`, `--font-syne`). `BoneSkeletonAnimation.tsx` and `Later_use/Footer.tsx` are empty files, and `DNABackground` is orphaned too. About 2,500 lines of dead code remain.
- The hero GSAP targets `.hero-line`, `.hero-actions` and `.hero-blackhole`, none of which exist in the current hero. Those animations do nothing.
- The test checks a heading `/we build/i` that doesn't exist, so it likely fails. It is the only test in the repo.

### Performance
- `public/images` is 31 MB. The founder PNGs are 2-3 MB each, and two `ChatGPT Image ... .png` files are about 3 MB each.
- 3.1 MB of 15 demo fonts sit in `public/fonts`. Most are unused, and they are *demo* fonts, which usually have licensing limits.
- The whole page is `'use client'` (`page.tsx`), so nothing is server-rendered. The SEO benefit of the App Router is mostly lost. Content in `data.ts` could be rendered on the server.
- `<img>` is used instead of `next/image` in Projects and Team.
- There are 5 `next/font` families plus a second Google `@import` in `globals.css` (Bebas Neue, Space Grotesk, Space Mono). The `@import` blocks rendering, and the `.hero`/`.mega-headline` styles it serves are unused.
- `three` and `gsap` ship to everyone, including mobile.

### Accessibility and UX
- `body { cursor: none }` hides the real cursor for everyone, including touch and keyboard users, and the custom cursor only listens to `mousemove`. It should be gated behind `(hover: hover)` and reduced motion.
- The Contact section sets `user-select: none`, which blocks copying your own email address.
- The contact form requires nationality and phone, which is unusual and hurts conversion. The typewriter metaphor also makes form entry slower and harder for screen readers.
- Colour contrast is weak in places: `text-white/30` and `/45`, and 10-11px mono text.
- Text sizes of 10-13px are common, and the hero is crowded (kicker, badge, headline, paragraph, 2 CTAs, 4 stats, floating tags, 3 stories).
- Reduced-motion handling is partial (only the hero CSS).

### Security and back end
- `/api/contact` has no rate limiting, no honeypot or CAPTCHA, and no length caps. It's an open mail relay and could be spammed. A malformed-JSON error is returned as "Invalid request payload", but a Resend failure is also reported as a 400.
- The recipient email is hardcoded as a fallback in source.
- The email regex `\S+@\S+\.\S+` is very loose.
- No security headers or CSP are configured in `next.config.ts`.

### SEO and meta
- `layout.tsx` hardcodes `https://sagittariuz.ai`. If you don't own that domain, canonical URLs, the sitemap and Open Graph are all pointing at someone else's site.
- `themeColor` should be in `viewport`, and the `Organization` JSON-LD is minimal.
- The OG image text says "Proof of work for ambitious systems", which is different from the hero copy.
- The `/about` page and the sitemap have no per-page metadata.
- The copyright is "© 2025".

## 3. What a professional startup site needs that's missing

- **Real proof:** real client logos or real projects with screenshots, metrics and outcomes, and at least 2 case-study pages with problem, approach, result.
- **Real people:** photos, bios, LinkedIn/GitHub links, and a clear story of who the founders are.
- **A real contact path:** a working email address, a booking link (Cal.com or Calendly), and a short form (name, email, message), with a confirmation email sent back.
- **Legal and trust pages:** Privacy Policy, Terms, cookie notice (GDPR/DPDP), and the legal entity name and address.
- **Analytics and monitoring:** Vercel Analytics or Plausible, Sentry, and uptime checks. Today there is no way to know whether anyone visits.
- **Blog or changelog,** which is also how you earn search traffic.
- **A 404 page, error boundaries, and a `loading` state.** None exist.
- **Brand assets:** a real logo (the favicon is the default), a `manifest`, apple-touch icons, and a press kit.
- **Quality gates:** CI (lint, type-check, test, build), a passing test suite, and an `.env.example`. The README is still the create-next-app default, and there are two lockfiles (`package-lock.json` and `pnpm-lock.yaml`), so pick one.
- **A production deploy** with a custom domain, security headers, and image/font optimization.
- **Newsletter or waitlist capture,** and a `/careers` page if you keep that footer link.

## 4. What would add the most value

Ordered by impact for effort:

1. **Make the portfolio the proof.** Add real case-study pages for Zenith, EDITH and Sagittariuz LLM, each with a live demo or video, and the stack, role and result. These are your strongest, most unique assets, so link them from the Projects cards and replace the posters with screenshots.
2. **Pick one positioning line and one audience** (for example "AI + robotics prototyping studio for founders"). Cut or rewrite the 4-5 sections that contradict it, such as the generic services table and the pricing. Replace the pricing with "Engagement models" or "How we work together" only if you can back it.
3. **Turn the metaphors into one cohesive system.** Right now each section is a different gimmick. A shared motion grammar (one easing, one reveal pattern) and a rule such as "one signature interaction per scroll screen" would make it feel designed rather than collected.
4. **Add an interactive "proof" moment on the home page.** Embed a small live version of the Zenith scene or the black hole, behind a lazy import and a reduced-motion fallback. That is more memorable than the 2D hero image.
5. **Performance and mobile pass.** Compress the images (WebP/AVIF, under about 200 KB each), delete unused fonts, lazy-load the three.js code, and test on a mid-range phone. The WebGL pages are the likeliest to fail there.
6. **Social proof you can verify:** GitHub activity, hackathon wins or certificates, press mentions, talks, and the Sagittarix STEM impact numbers (students taught, workshops run). Real numbers beat "200+".
7. **Small polish that signals craft:** a keyboard shortcut or command palette (Ctrl+K), dark/light or "calm mode" toggle, smooth page transitions, an easter egg (the black hole reacting to the cursor), and a `/uses` or `/lab` page.
8. **Resume or press kit download** and a one-click "Email us" button next to the form.

## 5. Where to start

1. Replace fake content (team, testimonials, stats, phone).
2. Fix the dead links.
3. Compress the 31 MB of images.
4. Delete the dead code.
5. Add case-study pages.

Those five steps change how the site looks to a visitor more than any new feature would.
