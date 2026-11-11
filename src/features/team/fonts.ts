import { remoteFont } from '@/features/fontDescriptor';

// One distinct typeface per founder name. Put `teamFontVariables` on an ancestor element.
const anbuFont = remoteFont({
  family: 'Cormorant Garamond',
  variable: '--font-name-anbu',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const brajinFont = remoteFont({
  family: 'Syne',
  variable: '--font-name-brajin',
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

const arunFont = remoteFont({
  family: 'Pinyon Script',
  variable: '--font-name-arun',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// Condensed display face for the giant outlined headline on /team.
const displayFont = remoteFont({
  family: 'Anton',
  variable: '--font-team-display',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const teamFontVariables = `${anbuFont.variable} ${brajinFont.variable} ${arunFont.variable} ${displayFont.variable}`;
