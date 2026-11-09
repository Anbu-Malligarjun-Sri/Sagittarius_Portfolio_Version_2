import { Cormorant_Garamond, EB_Garamond } from 'next/font/google';

// The letter's type: a book face for the body and an elegant italic for the headline. (The handwriting is the site's Caveat.)
const paperBody = EB_Garamond({ variable: '--font-paper-body', subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], display: 'swap' });
const paperTitle = Cormorant_Garamond({ variable: '--font-paper-title', subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], display: 'swap' });

/** Put on an ancestor of the letter. */
export const aboutFontVariables = `${paperBody.variable} ${paperTitle.variable}`;
