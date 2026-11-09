import type { FieldId } from './signals';

/*
 * The kinds of work we are building for, as listed beside the letter. This tells the truth about where we are: some have
 * a first thing made (status 'started'), and the rest are ones we are listening in, with nothing built yet.
 */

export type Field = {
  id: FieldId;
  /** Roman numeral in the list. */
  numeral: string;
  /** For the sciences this matches `FOR_WHOM` (copy.ts); 'Companion' is the assistant itself. */
  label: string;
  /**
   * Whether we have made anything there yet. This must stay in step with the letter, which says we have built two small
   * things: exactly two fields are 'started'. Change a field to 'started' only when there is real work to point to.
   */
  status: 'started' | 'listening';
  /** A small, everyday example of the friction we want to take out of that kind of work. */
  friction: string;
  /** What exists there, or what does not, in plain words. */
  work: string;
};

const NOT_YET = 'Nothing built here yet. We would like to begin with you.';

export const FIELDS: Field[] = [
  { id: 'biology', numeral: 'I', label: 'Biology', status: 'started', friction: 'The sequence file nobody can open.', work: 'First work: an AI that reads deep-sea DNA.' },
  { id: 'physics', numeral: 'II', label: 'Physics', status: 'listening', friction: 'The unit that quietly did not convert.', work: NOT_YET },
  { id: 'chemistry', numeral: 'III', label: 'Chemistry', status: 'listening', friction: 'The afternoon lost to reformatting.', work: NOT_YET },
  { id: 'mathematics', numeral: 'IV', label: 'Mathematics', status: 'listening', friction: 'The proof you cannot quite check at 2 a.m.', work: NOT_YET },
  {
    id: 'companion',
    numeral: 'V',
    label: 'Companion',
    status: 'started',
    friction: 'The question you were too tired to ask twice.',
    work: 'First work: a local AI assistant, a companion for researchers and students.',
  },
];
