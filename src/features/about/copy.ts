/*
 * The letter on the About paper. One source for everything that shows it: the paper texture, the plain-text version
 * for screen readers and search engines, and the fallback when WebGL is unavailable.
 *
 * How it is written, and why (each point is from research on how readers decide whether to trust a writer):
 *  - Warmth first. It opens with a human image and says who it is for before it says what we have done.
 *  - Honest about the stage. Sagittariuz started in 2026 and the letter says so plainly. A small, real admission paired
 *    with something we have actually built reads as credible; a vague boast does not.
 *  - Every limit is followed by what we do about it (a promise small enough to keep).
 *  - Modesty is shown through specific facts, never announced. No "humbled", no "passionate".
 *  - Plain, short words. Specific, true details (the real projects, the four sciences). No claims we cannot back up:
 *    no years of experience, client counts or retention figures.
 */

export const LETTER = {
  letterhead: ['Sagittariuz', 'Est. 2026'] as const,
  headline: 'Every invention begins with someone tired of the hard way.',
  paragraphs: [
    'The wheel took the weight out of carrying. The map took the guesswork out of wandering. Every tool we love is friction, quietly removed.',
    'We are Sagittariuz: three of us, started in 2026. That makes us new, and we would rather say so than dress it up. Our idea is small and stubborn: use AI to take the friction out of ordinary days, first for cafés, shops and homes, and, closest to our hearts, for science.',
    'Biologists, physicists, chemists, mathematicians, this is for you. Lately, machines have begun to settle some questions that took people years, and awe and grief are both fair responses. We do not want a louder machine. We want a kinder colleague: one that talks like a person, knows when it is unsure, and remembers that you are tired, curious, and allowed to be wrong.',
    'So far we have built three small things: an AI that reads deep-sea DNA, a local AI assistant, and a website for a symposium. They are early. Judge us by them.',
  ],
  promisesLead: 'We promise',
  promises: ["to say what the AI can't do,", 'to show our reasoning,', "and to tell you when we're wrong."],
  closing: 'Tell us what slows you down. That is where we begin.',
  signature: 'Anbu, Brajin & Arun',
  signoff: 'Sagittariuz, 2026',
};

/** Who the letter is for, shown as little notes beside the paper. */
export const FOR_WHOM = ['Biology', 'Physics', 'Chemistry', 'Mathematics', 'Cafés, shops & homes'] as const;

export const LETTER_TEXT = [LETTER.headline, ...LETTER.paragraphs, `${LETTER.promisesLead} ${LETTER.promises.join(' ')}`, LETTER.closing, `${LETTER.signature}. ${LETTER.signoff}`].join('\n\n');
