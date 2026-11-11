import { remoteFont } from '@/features/fontDescriptor';

// Old-style press type: an antique body face and a blackletter masthead.
const fell = remoteFont({
  family: 'IM Fell English',
  variable: '--font-fell',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

const fraktur = remoteFont({
  family: 'UnifrakturCook',
  variable: '--font-fraktur',
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
});

export const newspaperFontVariables = `${fell.variable} ${fraktur.variable}`;
