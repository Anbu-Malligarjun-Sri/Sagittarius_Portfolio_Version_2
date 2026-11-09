import { Barlow_Condensed, Bitter, Cormorant_Garamond, DM_Sans, EB_Garamond, STIX_Two_Text } from 'next/font/google';

// The letter's type: a book face for the body and an elegant italic for the headline. (The handwriting is the site's Caveat.)
const paperBody = EB_Garamond({ variable: '--font-paper-body', subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], display: 'swap' });
const paperTitle = Cormorant_Garamond({ variable: '--font-paper-title', subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], display: 'swap' });

// One typeface for each field in the instrument beside the letter, so every figure reads as its own instrument.
const physics = Barlow_Condensed({ variable: '--font-field-physics', subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], display: 'swap' }); // a spectrometer's labels
const chemistry = Bitter({ variable: '--font-field-chemistry', subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], display: 'swap' }); // a lab notebook
const mathematics = STIX_Two_Text({ variable: '--font-field-mathematics', subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], display: 'swap' }); // typeset maths
const companion = DM_Sans({ variable: '--font-field-companion', subsets: ['latin'], weight: ['400', '500', '700'], style: ['normal', 'italic'], display: 'swap' }); // a friendly, plain voice

/** Put on an ancestor of the letter and the instrument. */
export const aboutFontVariables = [paperBody, paperTitle, physics, chemistry, mathematics, companion].map((font) => font.variable).join(' ');
