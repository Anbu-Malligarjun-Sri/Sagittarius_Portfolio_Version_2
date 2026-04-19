import { render, screen, waitFor } from '@testing-library/react';
import App from './page';

vi.mock('../features/home/gsapClient', () => ({
  initializeGSAP: vi.fn().mockResolvedValue({ ok: false, error: 'offline test mode' }),
}));

describe('App integration without network dependency', () => {
  it('renders the startup landing page in safe mode and injects no CDN scripts', async () => {
    render(<App />);

    expect(document.querySelector('main')).not.toBeNull();

    await waitFor(() => {
      expect(document.querySelector('[data-animation-mode="safe"]')).not.toBeNull();
    });

    expect(screen.getByRole('heading', { name: /we build/i })).toBeInTheDocument();

    const cdnScripts = Array.from(document.querySelectorAll('script[src]')).filter((script) => {
      const src = script.getAttribute('src') ?? '';
      return src.includes('cdnjs.cloudflare.com/ajax/libs/gsap');
    });

    expect(cdnScripts.length).toBe(0);
  });
});
