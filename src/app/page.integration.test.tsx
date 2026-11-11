import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import App from './page';

vi.mock('../features/home/gsapClient', () => ({
  initializeGSAP: vi.fn().mockResolvedValue({ ok: false, error: 'offline test mode' }),
}));

// Test the page bootstrap independently of WebGL and browser animation APIs.
vi.mock('../features/home/StartupShowcase', () => ({
  default: () => <main aria-label="Portfolio sections" />,
}));

describe('App animation bootstrap', () => {
  it('renders the startup landing page in safe mode and injects no CDN scripts', async () => {
    const previousOverflow = document.body.style.overflowY;
    const { unmount } = render(<App />);

    expect(document.querySelector('main')).not.toBeNull();

    await waitFor(() => {
      expect(document.querySelector('[data-animation-mode="safe"]')).not.toBeNull();
    });

    expect(document.body.style.overflowY).toBe('auto');

    const cdnScripts = Array.from(document.querySelectorAll('script[src]')).filter((script) => {
      const src = script.getAttribute('src') ?? '';
      return src.includes('cdnjs.cloudflare.com/ajax/libs/gsap');
    });

    expect(cdnScripts.length).toBe(0);
    unmount();
    expect(document.body.style.overflowY).toBe(previousOverflow);
  });
});
