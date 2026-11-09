---
title: "Page-level keyboard handler cancels Enter, Space and Tab, so interactive pieces must stop those keys themselves"
author: Anbu
date: 2026-11-09
branch: main
cost: { minutes: 1, tokens: 2801 }
id: l-e081519b
scope: repo
status: active
src: agent
touches:
  - src/features/home/sections/Contact.tsx
---

## Decided
Any button on the homepage that must work by keyboard (the About coins, like the stamp card before it) stops Enter, Space and Tab from bubbling to the window with onKeyDown stopPropagation, because otherwise the contact typewriter's window keydown handler calls preventDefault on those keys and the button never activates.

## Tried and ruled out
Relying on the button's default keyboard activation: it failed in a real browser, where pressing Enter on a focused coin left it unflipped (data-flipped stayed "false") until the keys were stopped. Editing the typewriter's handler: it belongs to another section, which was off limits, so it would have changed code outside the request.

## Watch out
The contact typewriter listens for keydown on the whole window and calls preventDefault on Enter, Space, Tab, arrows and every letter, so it cancels keyboard activation of every button and link on the homepage, and Tab navigation too, unless an element stops propagation. This is an existing accessibility problem for keyboard users. The real fix is for that handler to ignore keys unless the typewriter is focused and the event target is not a button or link.

In the code: src/features/about/CoinCluster.tsx (onKeyDown), src/features/home/sections/Contact.tsx lines ~815-870 (the window keydown handler).
