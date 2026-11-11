import localFont from 'next/font/local';
import { Cinzel, Cormorant_Garamond, DM_Serif_Display, Rozha_One, Syne } from 'next/font/google';

// One typeface per stamp, so each reads as its own printed piece. Put `stampFontVariables` on an ancestor element.
const ui = DM_Serif_Display({ variable: '--font-stamp-ui', subsets: ['latin'], weight: '400', display: 'swap' });
const web = Cormorant_Garamond({ variable: '--font-stamp-web', subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], display: 'swap' });
const mobile = Syne({ variable: '--font-stamp-mobile', subsets: ['latin'], weight: ['700', '800'], display: 'swap' });
const agents = Cinzel({ variable: '--font-stamp-agents', subsets: ['latin'], weight: ['500', '700'], display: 'swap' });
const ai = localFont({
  src: './josefin-sans-latin.woff2',
  variable: '--font-stamp-ai',
  weight: '300 600',
  style: 'normal',
  display: 'swap',
});
const seo = Rozha_One({ variable: '--font-stamp-seo', subsets: ['latin'], weight: '400', display: 'swap' });

export const stampFontVariables = [ui, web, mobile, agents, ai, seo].map((font) => font.variable).join(' ');
