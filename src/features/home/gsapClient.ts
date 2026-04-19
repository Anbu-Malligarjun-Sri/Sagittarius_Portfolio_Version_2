import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type GsapLoadResult = {
  ok: boolean;
  error?: string;
};

type GsapWindow = Window & {
  gsap?: typeof gsap;
  ScrollTrigger?: typeof ScrollTrigger;
};

let pluginRegistered = false;
let hasLoggedFailure = false;

const registerPluginOnce = () => {
  if (pluginRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  pluginRegistered = true;
};

const logFailureOnce = (message: string) => {
  if (hasLoggedFailure) return;
  hasLoggedFailure = true;
  console.warn(`[Sagittarius] Animations running in safe mode: ${message}`);
};

export const initializeGSAP = async (): Promise<GsapLoadResult> => {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Not running in browser context' };
  }

  try {
    registerPluginOnce();

    const w = window as GsapWindow;
    w.gsap = gsap;
    w.ScrollTrigger = ScrollTrigger;

    return { ok: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown GSAP initialization failure';
    logFailureOnce(message);
    return { ok: false, error: message };
  }
};
