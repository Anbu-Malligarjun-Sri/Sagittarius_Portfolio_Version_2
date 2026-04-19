import type { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';

export type HomeWindow = Window & {
  gsap?: typeof gsap;
  ScrollTrigger?: typeof ScrollTrigger;
};

export type TweenLike = {
  kill?: () => void;
};
