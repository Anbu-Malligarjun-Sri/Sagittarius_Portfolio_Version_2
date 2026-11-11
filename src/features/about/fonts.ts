import { remoteFont } from '@/features/fontDescriptor';

// The letter's type: a book face for the body and an elegant italic for the headline. (The handwriting is the site's Caveat.)
const paperBody = remoteFont({ family: 'EB Garamond', variable: '--font-paper-body', subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], display: 'swap' });
const paperTitle = remoteFont({ family: 'Cormorant Garamond', variable: '--font-paper-title', subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], display: 'swap' });

// One typeface for each field in the instrument beside the letter, so every figure reads as its own instrument.
const physics = remoteFont({ family: 'Barlow Condensed', variable: '--font-field-physics', subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], display: 'swap' }); // a spectrometer's labels
const chemistry = remoteFont({ family: 'Bitter', variable: '--font-field-chemistry', subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], display: 'swap' }); // a lab notebook
const mathematics = remoteFont({ family: 'STIX Two Text', variable: '--font-field-mathematics', subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], display: 'swap' }); // typeset maths
const companion = remoteFont({ family: 'DM Sans', variable: '--font-field-companion', subsets: ['latin'], weight: ['400', '500', '700'], style: ['normal', 'italic'], display: 'swap' }); // a friendly, plain voice

/** Put on an ancestor of the letter and the instrument. */
export const aboutFontVariables = [paperBody, paperTitle, physics, chemistry, mathematics, companion].map((font) => font.variable).join(' ');
