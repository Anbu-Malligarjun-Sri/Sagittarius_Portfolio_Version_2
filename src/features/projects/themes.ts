import type { ProjectTheme } from '@/features/home/sections/active/types';

/** Accent colour of each project world (taken from the project's own interface). */
export const ACCENT: Record<ProjectTheme, string> = {
  ocean: '#2dd4bf',
  terminal: '#f59e0b',
  event: '#fb923c',
  default: '#e8c547',
};
