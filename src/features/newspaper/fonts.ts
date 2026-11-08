import { IM_Fell_English, UnifrakturCook } from 'next/font/google';

// Old-style press type: an antique body face and a blackletter masthead.
const fell = IM_Fell_English({
  variable: '--font-fell',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

const fraktur = UnifrakturCook({
  variable: '--font-fraktur',
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
});

export const newspaperFontVariables = `${fell.variable} ${fraktur.variable}`;
