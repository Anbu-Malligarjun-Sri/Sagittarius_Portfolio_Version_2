import type { LogoId } from './logoPaths';

export type Social = {
  id: LogoId;
  label: string;
  /**
   * TODO: replace the platform home pages below with the real profile URLs.
   * Only the GitHub link is known (it is the one already used in the site's structured data).
   */
  href: string;
  /** Dye for the logo: one colour, or gradient stops running from the bottom-left to the top-right. */
  dye: string | string[];
  /** Logo size as a fraction of the tile face. */
  scale: number;
};

export const SOCIALS: Social[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/Sagittariuz-tech', dye: '#1b1f23', scale: 0.6 },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/', dye: '#0a66c2', scale: 0.56 },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/sagittariuz.tech/', dye: ['#fdc468', '#f5802a', '#e1306c', '#a22fbd', '#5851db'], scale: 0.6 },
  { id: 'x', label: 'X', href: 'https://x.com/SagittariuzTech', dye: '#0b0b0b', scale: 0.5 },
  { id: 'reddit', label: 'Reddit', href: 'https://www.reddit.com/user/SagittariuzTech/', dye: '#ff4500', scale: 0.62 },
];

export const FUR_COLOR = '#F3EDE4';
