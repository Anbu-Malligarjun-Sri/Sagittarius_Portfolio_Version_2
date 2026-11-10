# Knowledge atlas — preserved draft

Snapshot before the easylog hero replacement. Includes the 30-study dataset, Three.js scene, popup cards, and styles.

To restore it, change `src/features/home/CinematicHero.tsx` to:

```tsx
export { default } from './drafts/knowledge-atlas/AtlasHero';
```

The draft is not imported by the active homepage. It uses the existing site font variables and installed Three.js package.
