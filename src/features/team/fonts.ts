import { Anton, Cormorant_Garamond, Pinyon_Script, Syne } from 'next/font/google';

// One distinct typeface per founder name. Put `teamFontVariables` on an ancestor element.
const anbuFont = Cormorant_Garamond({
  variable: '--font-name-anbu',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const brajinFont = Syne({
  variable: '--font-name-brajin',
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

const arunFont = Pinyon_Script({
  variable: '--font-name-arun',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// Condensed display face for the giant outlined headline on /team.
const displayFont = Anton({
  variable: '--font-team-display',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const teamFontVariables = `${anbuFont.variable} ${brajinFont.variable} ${arunFont.variable} ${displayFont.variable}`;
