import { Cinzel, Cormorant_Garamond, DM_Serif_Display, IM_Fell_English, Josefin_Sans, Syne } from 'next/font/google';

// One typeface per stamp, so each reads as its own printed piece. Put `stampFontVariables` on an ancestor element.
const ui = DM_Serif_Display({ variable: '--font-stamp-ui', subsets: ['latin'], weight: '400', display: 'swap' });
const web = Cormorant_Garamond({ variable: '--font-stamp-web', subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], display: 'swap' });
const mobile = Syne({ variable: '--font-stamp-mobile', subsets: ['latin'], weight: ['700', '800'], display: 'swap' });
const brand = Cinzel({ variable: '--font-stamp-brand', subsets: ['latin'], weight: ['500', '700'], display: 'swap' });
const ai = Josefin_Sans({ variable: '--font-stamp-ai', subsets: ['latin'], weight: ['300', '400', '600'], display: 'swap' });
const advice = IM_Fell_English({ variable: '--font-stamp-advice', subsets: ['latin'], weight: '400', style: ['normal', 'italic'], display: 'swap' });

export const stampFontVariables = [ui, web, mobile, brand, ai, advice].map((font) => font.variable).join(' ');
