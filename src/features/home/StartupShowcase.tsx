'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  ExternalLink,
  GitBranch,
  Mail,
  MapPinned,
  Menu,
  MessageSquareMore,
  Minus,
  Phone,
  Plus,
  Shield,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SectionId = 'about' | 'services' | 'process' | 'projects' | 'stats' | 'team' | 'testimonials' | 'pricing' | 'faq' | 'contact';

type ServiceRow = {
  name: string;
  category: string;
  timeline: string;
  status: 'AVAILABLE' | 'LIMITED' | 'BOOKING';
  description: string;
};

type ProjectCard = {
  title: string;
  category: string;
  body: string;
  image: string;
  tags: string[];
};

type TeamMember = {
  name: string;
  title: string;
  department: string;
  color: string;
};

type Testimonial = {
  quote: string;
  name: string;
  title: string;
  company: string;
  tint: string;
};

const NAV_ITEMS: Array<{ id: SectionId; label: string }> = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Projects' },
  { id: 'projects', label: 'Team' },
  { id: 'stats', label: 'Contact' },
];

const SERVICES: ServiceRow[] = [
  { name: 'UI/UX Design', category: 'Design', timeline: '2-4 wks', status: 'AVAILABLE', description: 'Design systems, product stories, and conversion-focused interface work.' },
  { name: 'Web Development', category: 'Engineering', timeline: '4-8 wks', status: 'AVAILABLE', description: 'Next.js builds, motion systems, and resilient frontend architecture.' },
  { name: 'Mobile Apps', category: 'Engineering', timeline: '6-12 wks', status: 'AVAILABLE', description: 'iOS and Android experiences tuned for fast iteration and launch readiness.' },
  { name: 'Brand Identity', category: 'Design', timeline: '2-3 wks', status: 'LIMITED', description: 'Naming, visual identity, and launch-ready art direction for new products.' },
  { name: 'AI Integration', category: 'Engineering', timeline: '4-6 wks', status: 'BOOKING', description: 'Workflow automation, assistant surfaces, and practical model integration.' },
  { name: 'Consulting', category: 'Strategy', timeline: '1 wk', status: 'AVAILABLE', description: 'Decision support for founders, product leads, and early engineering teams.' },
];

const PROJECTS: ProjectCard[] = [
  {
    title: 'Northline analytics suite',
    category: 'Engineering',
    body: 'A review-heavy dashboard reshaped into a newsroom style product with faster decisions and cleaner handoffs.',
    tags: ['Dashboard', 'Analytics', 'Systems'],
    image: makePoster('Northline', '#e8c547', '#f5f0e8', '#1a1208'),
  },
  {
    title: 'Morrow capital launch site',
    category: 'Design',
    body: 'A conversion page that uses editorial pacing, bold hierarchy, and a calmer onboarding path.',
    tags: ['Brand', 'Marketing'],
    image: makePoster('Morrow', '#4a90d9', '#f5f0e8', '#0a0a0a'),
  },
  {
    title: 'Field atlas mobile app',
    category: 'Case study',
    body: 'A mobile workflow for operators who needed status, traceability, and speed without friction.',
    tags: ['Mobile', 'Workflow'],
    image: makePoster('Atlas', '#e85d24', '#f5f0e8', '#21150c'),
  },
];

const TEAM: TeamMember[] = [
  { name: 'Mina Sol', title: 'Founding designer', department: 'Design', color: '#4a90d9' },
  { name: 'Rowan Vale', title: 'Engineering lead', department: 'Engineering', color: '#e8c547' },
  { name: 'Tamsin Roe', title: 'Product strategist', department: 'Marketing', color: '#e85d24' },
  { name: 'Ivo Mercer', title: 'Operations', department: 'Leadership', color: '#2ecc71' },
  { name: 'Ari Nox', title: 'Motion systems', department: 'Engineering', color: '#4a90d9' },
  { name: 'Elio Finch', title: 'Research', department: 'Design', color: '#e8c547' },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'They turned a messy, technical product into something our sales team could actually explain in a meeting.',
    name: 'Rhea Beaumont',
    title: 'CEO',
    company: 'Cinder Lane',
    tint: '#e8c547',
  },
  {
    quote: 'The handoff felt unusually calm. We got clear decisions, sharp writing, and no drift between screens.',
    name: 'Nico Hart',
    title: 'Product Director',
    company: 'Northglass',
    tint: '#4a90d9',
  },
  {
    quote: 'We went from feature bloat to a product that had one obvious job and did it well.',
    name: 'Mateo Voss',
    title: 'Founder',
    company: 'Relay Forge',
    tint: '#2ecc71',
  },
  {
    quote: 'Their launch system reduced the amount of back-and-forth we needed to close the project.',
    name: 'Sana Leclerc',
    title: 'COO',
    company: 'Cobalt Relay',
    tint: '#e85d24',
  },
];

const FAQS = [
  ['How do we start a project?', 'We begin with a short discovery sprint, then shape the scope into a plan that can be built and measured.'],
  ['What is your process?', 'We move through discovery, strategy, build, launch, and a short post-launch tuning window.'],
  ['How long does a typical project take?', 'Most design-to-build engagements land between three and eight weeks depending on scope.'],
  ['Do you work with early-stage startups?', 'Yes. We can work from rough clarity, prototype direction, or an existing product that needs a sharper system.'],
  ['What technologies do you use?', 'This site is built with Next.js, React, TypeScript, Tailwind, and GSAP for the motion layer.'],
  ['How do you handle revisions?', 'We keep revisions bounded by checkpoints so the team stays aligned without turning every choice into a loop.'],
  ['Do you offer maintenance and support?', 'Yes. We can continue with support, monitoring, and structured iterations after launch.'],
  ['What are your payment terms?', 'Projects begin with a deposit, then move through milestone-based payments tied to approved deliverables.'],
];

const PRICING = [
  {
    name: 'Starter',
    price: '$499/mo',
    details: ['5 projects', 'Email support', 'One monthly strategy call'],
    popular: false,
  },
  {
    name: 'Studio',
    price: '$999/mo',
    details: ['20 projects', 'Priority support', 'Weekly review sessions'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    details: ['Unlimited scope', 'Dedicated team', 'White-glove support'],
    popular: false,
  },
];

const GAUGES = [
  { label: 'Projects completed', value: 85, display: '200+' },
  { label: 'Client satisfaction', value: 98, display: '98%' },
  { label: 'Years experience', value: 65, display: '12+' },
  { label: 'Countries served', value: 40, display: '40+' },
];

function makePoster(seed: string, accent: string, foreground: string, background: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#111111" />
        </linearGradient>
      </defs>
      <rect width="720" height="540" fill="url(#g)"/>
      <rect x="24" y="24" width="672" height="492" rx="24" fill="none" stroke="${accent}" stroke-width="2" opacity="0.8"/>
      <circle cx="120" cy="118" r="52" fill="${accent}" opacity="0.9"/>
      <path d="M122 246 L602 132" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
      <path d="M78 420 C180 360, 274 448, 372 386 S604 330, 648 420" fill="none" stroke="${foreground}" stroke-width="2" opacity="0.8"/>
      <text x="48" y="470" fill="${foreground}" font-family="Arial, sans-serif" font-size="54" font-weight="700">${seed}</text>
      <text x="48" y="512" fill="${foreground}" font-family="Arial, sans-serif" font-size="16" opacity="0.7">Premium startup systems</text>
    </svg>
  `)}`;
}

function makeAvatar(seed: string, accent: string, label: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#111111" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="24" fill="url(#g)"/>
      <circle cx="128" cy="96" r="42" fill="#f5f0e8" opacity="0.92"/>
      <path d="M66 208c12-30 34-48 62-48s50 18 62 48" fill="#f5f0e8" opacity="0.92"/>
      <text x="24" y="232" fill="#f5f0e8" font-family="Arial, sans-serif" font-size="24" font-weight="700">${label}</text>
      <text x="24" y="30" fill="#f5f0e8" font-family="Arial, sans-serif" font-size="12" opacity="0.7">${seed}</text>
    </svg>
  `)}`;
}

function sectionHeadingClass(additional = '') {
  return `font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.96] text-[#f5f0e8] ${additional}`;
}

function sectionLabelClass() {
  return 'font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547]';
}

function glassCardClass(extra = '') {
  return `rounded-[6px] border border-white/10 bg-[rgba(255,255,255,0.04)] backdrop-blur-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-all duration-300 ${extra}`;
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const tween = { value: 0 };
    const animation = gsap.to(tween, {
      value: target,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => setValue(Math.round(tween.value)),
    });

    return () => {
      animation.kill();
    };
  }, [active, target]);

  return value;
}

function AnimatedCount({ target, active }: { target: number; active: boolean }) {
  const value = useCountUp(target, active);
  return <span>{value}</span>;
}

function SplitFlapText({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    let index = 0;
    const sequence = text.split('');
    const timer = window.setInterval(() => {
      setDisplay(
        sequence
          .map((char, current) => (current <= index ? char : chars[Math.floor(Math.random() * chars.length)]))
          .join(''),
      );
      index += 1;
      if (index > sequence.length + 2) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 45);

    return () => window.clearInterval(timer);
  }, [active, text]);

  return <span>{display}</span>;
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl">
        <p className={sectionLabelClass()}>{label}</p>
        <h2 className={sectionHeadingClass('mt-4')}>{title}</h2>
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72">{subtitle}</p>
      </div>
    </div>
  );
}

export default function StartupShowcase() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroStripRef = useRef<HTMLDivElement | null>(null);
  const activeSectionRef = useRef<SectionId>('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedNav, setExpandedNav] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('about');
  const [heroPhrase, setHeroPhrase] = useState('Startups.');
  const [teamIndex, setTeamIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [faqIndex, setFaqIndex] = useState<number | null>(0);
  const [contactState, setContactState] = useState<'idle' | 'typing' | 'sending' | 'success' | 'error'>('idle');
  const [contactNote, setContactNote] = useState('READY >_');
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const canUseScrollTrigger = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

  useEffect(() => {
    if (!canUseScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    });

    const handleScroll = () => {
      setExpandedNav(window.scrollY > 100);
    };

    const sectionObserverIds: SectionId[] = ['about', 'services', 'process', 'projects', 'stats', 'team', 'testimonials', 'pricing', 'faq', 'contact'];
    const triggers = sectionObserverIds
      .map((id) => {
        const element = document.getElementById(id);
        if (!element) return null;

        return ScrollTrigger.create({
          trigger: element,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => {
            activeSectionRef.current = id;
            setActiveSection(id);
          },
          onEnterBack: () => {
            activeSectionRef.current = id;
            setActiveSection(id);
          },
        });
      })
      .filter(Boolean) as ScrollTrigger[];

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [canUseScrollTrigger]);

  useEffect(() => {
    const phrases = ['Startups.', 'Enterprises.', 'The Future.'];
    let index = 0;
    setHeroPhrase(phrases[0]);

    const timer = window.setInterval(() => {
      index = (index + 1) % phrases.length;
      const current = phrases[index];
      let cursor = 0;
      const typing = window.setInterval(() => {
        setHeroPhrase(current.slice(0, cursor + 1));
        cursor += 1;
        if (cursor >= current.length) {
          window.clearInterval(typing);
        }
      }, 40);
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!canUseScrollTrigger) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker', { opacity: 0, y: 20, duration: 0.6, delay: 0.2 });
      gsap.from('.hero-line', { opacity: 0, y: 52, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2 });
      gsap.from('.hero-subcopy', { opacity: 0, y: 20, duration: 0.7, delay: 0.3 });
      gsap.from('.hero-actions', { opacity: 0, y: 16, duration: 0.6, delay: 0.35 });
      gsap.from('.film-frame', { opacity: 0, x: 40, duration: 1, delay: 0.35, stagger: 0.08 });

      gsap.from('.section-block', {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { start: 'top 78%' },
      });

      gsap.from('.postit-card', {
        opacity: 0,
        y: 28,
        rotation: 'random(-8,8)',
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: { trigger: '#about', start: 'top 68%' },
      });

      gsap.from('.blueprint-path', {
        strokeDashoffset: 400,
        duration: 1.6,
        stagger: 0.25,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '#process', start: 'top 72%' },
      });

      gsap.from('.step-node', {
        scale: 0,
        opacity: 0,
        stagger: 0.18,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '#process', start: 'top 72%' },
      });

      gsap.from('.step-card', {
        opacity: 0,
        x: 18,
        stagger: 0.2,
        duration: 0.7,
        scrollTrigger: { trigger: '#process', start: 'top 72%' },
      });

      gsap.from('.board-row', {
        opacity: 0,
        y: -16,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#services', start: 'top 72%' },
      });

      gsap.from('.gauge-shell', {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.6,
        scrollTrigger: { trigger: '#stats', start: 'top 72%' },
      });

      gsap.from('.rolodex-shell', {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#team', start: 'top 75%' },
      });

      gsap.from('.jukebox-shell', {
        opacity: 0,
        y: 34,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#testimonials', start: 'top 75%' },
      });

      gsap.from('.chalk-plan', {
        opacity: 0,
        y: 28,
        stagger: 0.12,
        duration: 0.8,
        scrollTrigger: { trigger: '#pricing', start: 'top 72%' },
      });

      gsap.from('.drawer-item', {
        opacity: 0,
        x: -18,
        stagger: 0.06,
        duration: 0.5,
        scrollTrigger: { trigger: '#faq', start: 'top 72%' },
      });

      gsap.from('.phone-shell', {
        opacity: 0,
        y: 36,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#contact', start: 'top 75%' },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [canUseScrollTrigger]);

  useEffect(() => {
    if (!heroStripRef.current) return;
    const strip = gsap.to(heroStripRef.current, {
      yPercent: -50,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });

    return () => strip.kill();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setTeamIndex((value) => (value - 1 + TEAM.length) % TEAM.length);
      }
      if (event.key === 'ArrowRight') {
        setTeamIndex((value) => (value + 1) % TEAM.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const heroLines = useMemo(() => ['We build', 'products that', 'actually work.'], []);

  const activeTeam = TEAM[teamIndex];
  const activeTestimonial = TESTIMONIALS[testimonialIndex];

  const onSubmitContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactState('typing');
    setContactNote('DIALING...');

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.message) {
      setContactState('error');
      setContactNote('ERROR: CHECK FIELDS');
      return;
    }

    setContactState('sending');
    setContactNote('CONNECTING...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          message: `${payload.phone}\n\n${payload.message}`,
        }),
      });

      if (!response.ok) {
        throw new Error('request failed');
      }

      setContactState('success');
      setContactNote('MESSAGE SENT. THANK YOU.');
    } catch {
      setContactState('error');
      setContactNote('ERROR: RETRY');
    }
  };

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#0a0a0a] text-[#f5f0e8]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(232,197,71,0.08),_transparent_38%),radial-gradient(circle_at_bottom,_rgba(74,144,217,0.08),_transparent_35%)]" />

      <header
        className={`fixed left-1/2 top-4 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-[rgba(10,10,10,0.75)] px-4 shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-300 ${expandedNav ? 'w-[min(92vw,900px)]' : 'w-[min(92vw,480px)]'}`}
      >
        <div className="flex h-[54px] items-center justify-between gap-3">
          <a href="#main-content" className="font-display text-[0.95rem] font-bold tracking-[0.24em] text-[#e8c547]">
            HELIOFORGE
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group relative text-[14px] font-medium transition-colors duration-200 ${activeSection === item.id ? 'text-[#e8c547]' : 'text-[#f5f0e8]/70 hover:text-[#f5f0e8]'}`}
              >
                {item.label}
                <span className="absolute left-0 top-full mt-1 h-px w-full origin-left scale-x-0 bg-[#e8c547] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-full bg-[#e8c547] px-5 py-2 text-[13px] font-semibold tracking-[0.02em] text-[#0a0a0a] transition-transform duration-200 hover:scale-[1.04] md:inline-flex"
            >
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </a>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f5f0e8] transition-transform duration-200 hover:scale-[1.03] md:hidden"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/98 px-6 py-24 md:hidden">
          <div className="mx-auto flex h-full max-w-2xl flex-col justify-between">
            <div className="space-y-6">
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-baseline gap-4 border-b border-white/10 pb-4 text-[clamp(2rem,7vw,3.2rem)] font-display font-bold tracking-[-0.04em]"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="font-mono text-[12px] text-[#e8c547]">0{index + 1}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e8c547] px-5 py-3 font-medium text-[#0a0a0a]"
              onClick={() => {
                setMenuOpen(false);
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <main id="main-content" className="relative z-10">
        <section className="relative min-h-[100dvh] overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto grid min-h-[calc(100dvh-8rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.65fr_0.85fr]">
            <div className="max-w-4xl">
              <p className="hero-kicker font-mono text-[11px] uppercase tracking-[0.45em] text-[#e8c547]">INTRODUCING / 2025</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3.5rem,6vw,6rem)] font-display font-extrabold leading-[0.94] tracking-[-0.05em] text-[#f5f0e8]">
                {heroLines.map((line) => (
                  <span key={line} className="hero-line block text-wrap-balance">
                    {line}
                  </span>
                ))}
              </h1>
              <div className="mt-5 flex items-center gap-3 font-mono text-[1rem] text-[#e8c547] sm:text-[1.1rem]">
                Built for <span className="inline-block min-w-[11ch] border-b border-[#e8c547]/30 pb-1">{heroPhrase}</span>
              </div>
              <p className="hero-subcopy mt-6 max-w-2xl text-[1.05rem] leading-8 text-[#f5f0e8]/72">
                Helioforge is a premium startup studio that pairs sharp editorial storytelling with systems-level design, motion, and engineering.
              </p>
              <div className="hero-actions mt-8 flex flex-wrap items-center gap-4">
                <a href="#contact" className="inline-flex items-center gap-2 rounded-[4px] bg-[#e8c547] px-8 py-4 font-body text-[15px] font-semibold text-[#0a0a0a] transition-transform duration-200 hover:scale-[1.04]">
                  Start Your Project <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#projects" className="inline-flex items-center gap-2 rounded-[4px] border border-[#f5f0e8]/30 px-8 py-4 font-body text-[15px] font-semibold text-[#f5f0e8] transition-colors duration-200 hover:border-[#e8c547] hover:text-[#e8c547]">
                  See Our Work <ChevronDown className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-12 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.42em] text-[#f5f0e8]/55">
                <span>Scroll</span>
                <span className="inline-flex h-10 w-px bg-[#f5f0e8]/20" />
                <span>Case-led</span>
              </div>
            </div>

            <div className="relative self-stretch overflow-hidden rounded-[0px] border border-white/10 bg-[rgba(255,255,255,0.03)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="film-strip overflow-hidden">
                <div ref={heroStripRef} className="space-y-4 p-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="film-frame relative overflow-hidden rounded-[2px] border border-white/15 bg-[#111111] p-3">
                      <div className="absolute inset-y-0 left-2 flex w-3 flex-col justify-between py-3">
                        {Array.from({ length: 7 }).map((_, hole) => (
                          <span key={hole} className="h-2 w-2 rounded-full border border-white/15 bg-[#0a0a0a]" />
                        ))}
                      </div>
                      <div className="absolute inset-y-0 right-2 flex w-3 flex-col justify-between py-3">
                        {Array.from({ length: 7 }).map((_, hole) => (
                          <span key={hole} className="h-2 w-2 rounded-full border border-white/15 bg-[#0a0a0a]" />
                        ))}
                      </div>
                      <div className="ml-7 mr-7 overflow-hidden rounded-[2px] border border-white/10 bg-[#0f0f0f]">
                        <img
                          src={makePoster(`FRAME ${index + 1}`, index % 2 === 0 ? '#e8c547' : '#4a90d9', '#f5f0e8', '#111111')}
                          alt={`Magazine-style frame ${index + 1}`}
                          className="aspect-[4/3] w-full object-cover opacity-90"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <span className="absolute left-0 top-8 -rotate-180 font-mono text-[10px] uppercase tracking-[0.35em] text-white/30 [writing-mode:vertical-rl]">
                        reel {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.18),transparent)]" />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-center">
            <span className="font-mono text-[10px] tracking-[0.5em] text-[#f5f0e8]/50">SCROLL</span>
            <span className="inline-flex h-10 w-px animate-pulse bg-[#f5f0e8]/60" />
          </div>
        </section>

        <section id="about" className="section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="ABOUT" title="An open notebook spread for the founding story." subtitle="The left page carries handwritten clues and circled emphasis. The right page is a cleaner typed panel that explains how the studio thinks, builds, and ships." />

          <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-[1fr_24px_1fr]">
            <article className="relative overflow-hidden rounded-none border border-black/10 bg-[#f9f5ed] px-8 py-10 text-[#2a2015] shadow-[4px_4px_20px_rgba(0,0,0,0.15),-2px_0_8px_rgba(0,0,0,0.05)] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,rgba(100,100,150,0.12)_28px)] before:content-['']">
              <div className="relative rotate-[-1.5deg]">
                <p className="font-handwriting text-[clamp(2.3rem,4vw,3.6rem)] font-bold leading-none">We sketch the shape before we ship the system.</p>
                <p className="mt-5 max-w-xl text-[14px] leading-8">Every project starts with the same note on the page: what must this product do, what must it not do, and where does the team need clarity faster than more features?</p>
                <p className="mt-5 text-[14px] leading-8">The answer usually lives between a circled word, a crossed-out assumption, and a small line of underlined text in ember orange.</p>
                <p className="mt-6 inline-flex rounded-full border-2 border-[#e85d24] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.35em]">Focus</p>
                <div className="mt-6 h-8 w-8 border-l-2 border-b-2 border-[#e85d24] rotate-[12deg]" />
              </div>
            </article>

            <div className="hidden bg-[linear-gradient(to_right,rgba(0,0,0,0.08),rgba(0,0,0,0.02),rgba(0,0,0,0.08))] lg:block" />

            <article className="relative overflow-hidden rounded-none border border-white/10 bg-[#fefcf8] px-8 py-10 text-[#1a1208] shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
              <p className="max-w-prose text-[14px] leading-8">Helioforge began as a small studio for founders who wanted design and engineering to feel like one decision, not two different disciplines.</p>
              <p className="mt-4 max-w-prose text-[14px] leading-8">We pair editorial structure with product rigor so teams can launch with confidence, tighten the message, and keep the system maintainable after the first release.</p>
              <div className="absolute bottom-6 right-6 rotate-[5deg] border-2 border-black/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.35em] text-black/60">
                Est. 2024
              </div>
            </article>
          </div>

          <div className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['12+ Years', 12],
              ['200+ Projects', 200],
              ['40+ Clients', 40],
              ['98% Retention', 98],
            ].map(([label, target], index) => (
              <div
                key={label}
                className={`${glassCardClass('postit-card relative min-h-[120px] px-5 py-6')}`}
                style={{ transform: `rotate(${[-4, 5, -2, 3][index]}deg)` }}
              >
                <div className="mx-auto mb-3 h-2 w-12 rounded-[2px] bg-[#e8c547]/25" />
                <div className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold text-[#e8c547]">
                  <AnimatedCount target={Number(target)} active={activeSection === 'about'} />
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-[#f5f0e8]/60">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="section-block scroll-mt-28 bg-[#0d0d0d] px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="SERVICES" title="A split-flap departure board for the work we do." subtitle="Each row flips into place like a timetable row, with service, category, timeline, and status aligned to keep the board readable even as it moves." />

          <div className="mx-auto mt-12 max-w-7xl rounded-[4px] border-2 border-[#2a2a2a] bg-[#111111] p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_0_6px_#0a0a0a,0_0_0_8px_#1e1e1e]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px border border-[#e8c547]/15 bg-[#e8c547]/15 text-[12px] font-mono uppercase tracking-[0.3em] text-[#e8c547]">
              {['Service name', 'Category', 'Timeline', 'Status'].map((header) => (
                <div key={header} className="bg-[#1a1209] px-4 py-3">{header}</div>
              ))}
            </div>

            <div className="mt-3 space-y-2">
              {SERVICES.map((service) => (
                <div key={service.name} className="group border border-white/5 bg-[#111111] transition-colors duration-200 hover:border-[#e8c547]/30 hover:bg-[rgba(232,197,71,0.04)]">
                  <div className="board-row grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-px text-[14px] font-mono text-[#f5f0e8]">
                    <div className="px-4 py-4">
                      <SplitFlapText text={service.name} active={activeSection === 'services'} />
                    </div>
                    <div className="border-l border-white/5 px-4 py-4">{service.category}</div>
                    <div className="border-l border-white/5 px-4 py-4">{service.timeline}</div>
                    <div className="border-l border-white/5 px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-2 ${service.status === 'AVAILABLE' ? 'text-[#2ecc71]' : service.status === 'LIMITED' ? 'text-[#e8c547]' : 'text-[#e85d24]'}`}
                      >
                        <CircleDot className="h-3 w-3 fill-current" /> {service.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden px-4 pb-4 text-[12px] leading-7 text-[#f5f0e8]/60">{service.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="section-block scroll-mt-28 bg-[#0d1b2a] px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="HOW IT WORKS" title="A blueprint for discovery, strategy, build, and launch." subtitle="The plan view uses orthogonal paths, number markers, and dimension lines to turn the process into something you can read at a glance." />

          <div className="mx-auto mt-12 max-w-7xl rounded-none border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px,40px_40px,8px_8px,8px_8px] p-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div className="relative min-h-[520px]">
                <svg className="absolute inset-0 h-full w-full">
                  <path className="blueprint-path" d="M90 88 H320 V162 H470" stroke="rgba(255,255,255,0.22)" strokeDasharray="6 4" strokeWidth="1.5" fill="none" />
                  <path className="blueprint-path" d="M470 162 V270 H220" stroke="rgba(255,255,255,0.22)" strokeDasharray="6 4" strokeWidth="1.5" fill="none" />
                  <path className="blueprint-path" d="M220 270 V392 H460" stroke="rgba(255,255,255,0.22)" strokeDasharray="6 4" strokeWidth="1.5" fill="none" />
                </svg>
                <div className="relative grid gap-16 pt-8">
                  {[
                    ['01', 'Discovery', 'We map the problem space, the constraints, and the decision makers before design starts.' ],
                    ['02', 'Strategy', 'We turn the research into a focused plan, a clear message, and a buildable system.' ],
                    ['03', 'Build', 'The interface gets engineered carefully, with motion and structure carrying the same intent.' ],
                    ['04', 'Launch', 'We ship, tune the edges, and hand over a product that is ready to use without extra explanation.' ],
                  ].map(([number, title, copy], index) => (
                    <div key={title} className={`step-node flex items-start gap-6 ${index % 2 === 0 ? 'justify-self-start' : 'justify-self-end'}`}>
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-[#0d1b2a]/90 backdrop-blur-[8px]">
                        <div className="text-center font-mono text-[18px] font-bold text-[#e8c547]">{number}</div>
                      </div>
                      <div className="step-card max-w-[240px] rounded-[6px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 backdrop-blur-[20px]">
                        <div className="font-display text-[15px] font-bold text-[#f5f0e8]">{title}</div>
                        <p className="mt-2 text-[13px] leading-7 text-[#f5f0e8]/70">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute right-0 top-0 rounded-[4px] border border-white/15 bg-[#0a0f14] px-4 py-3 font-mono text-[11px] text-white/50">
                  PROJECT: HELIOFORGE
                  <br />
                  DRAWING: PROCESS FLOW
                  <br />
                  SCALE: NTS / REV 01
                </div>
                <div className="mt-24 space-y-4 text-white/60">
                  <div className="rounded-[4px] border border-white/10 px-4 py-3 font-mono text-[11px] italic">Dimension line 48.2m · confidence vector stable</div>
                  <div className="rounded-[4px] border border-white/10 px-4 py-3 font-mono text-[11px] italic">Section note: keep the story visible before the micro-details.</div>
                  <div className="rounded-[4px] border border-white/10 px-4 py-3 font-mono text-[11px] italic">Field note: paths draw on scroll to match plan views.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section-block scroll-mt-28 bg-[#f8f4ec] px-4 py-24 text-[#1a1208] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="border-b border-[#b8b0a0] pb-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-[-0.04em]">The Portfolio Times</div>
                  <div className="mt-1 font-body text-[13px] italic text-[#1a1208]/60">All the work that&apos;s fit to ship.</div>
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.35em]">Tuesday, January 2025</div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1px_1fr]">
              <article className="space-y-5">
                <div className="overflow-hidden border border-[#b8b0a0] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <img src={PROJECTS[0].image} alt={PROJECTS[0].title} className="w-full object-cover grayscale-[20%] contrast-[1.05]" loading="lazy" decoding="async" />
                </div>
                <div className="font-mono text-[11px] italic text-[#1a1208]/55">Fig. 1 — A redesigned dashboard, 2024.</div>
                <span className="inline-flex border border-[#1a1208] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em]">{PROJECTS[0].category}</span>
                <h3 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold leading-tight tracking-[-0.04em]">{PROJECTS[0].title}</h3>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1a1208]/50">By Helioforge · Design & engineering</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <p className="text-[13px] leading-8 text-[#1a1208]">New York, January 2025 — the redesign shifted the product from a cluttered operations surface to a calmer newsroom layout with sharper hierarchy and faster scanning.</p>
                  <blockquote className="border-l-4 border-[#1a1208] pl-4 font-display text-[16px] font-bold italic leading-7">A good product page should read like a strong front page.</blockquote>
                </div>
                <div className="columns-2 gap-4 border-t border-[#c8c0b0] pt-4 text-[13px] leading-7 text-[#1a1208]">
                  <p>{PROJECTS[0].body}</p>
                  <p>The rest of the newsroom uses smaller stories, captions, and section tags to keep the work readable without resorting to a generic card grid.</p>
                </div>
              </article>

              <div className="hidden bg-[#b8b0a0] lg:block" />

              <aside className="space-y-6">
                {PROJECTS.slice(1).map((project) => (
                  <article key={project.title} className="story-card border border-[#b8b0a0] bg-[#fbf8f0] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
                    <img src={project.image} alt={project.title} className="aspect-[4/3] w-full object-cover grayscale-[20%] contrast-[1.02]" loading="lazy" decoding="async" />
                    <span className="mt-4 inline-flex border border-[#1a1208] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em]">{project.category}</span>
                    <h4 className="mt-3 font-display text-[1.2rem] font-bold tracking-[-0.03em]">{project.title}</h4>
                    <p className="mt-2 text-[13px] leading-7">{project.body}</p>
                    <div className="mt-3 border-t border-dashed border-[#1a1208]/30 pt-3 font-mono text-[10px] italic text-[#1a1208]/60">Continued on page 2 →</div>
                  </article>
                ))}
                <div className="border border-[#b8b0a0] bg-[#fbf8f0] p-4 font-mono text-[12px] leading-7 text-[#1a1208]">
                  <div className="text-[11px] uppercase tracking-[0.35em]">Inside this edition</div>
                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                    <span>Northline dashboard</span><span>2</span>
                    <span>Morrow launch page</span><span>4</span>
                    <span>Field atlas app</span><span>6</span>
                    <span>Case study archive</span><span>8</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="stats" className="section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="STATS" title="Vintage instrumentation for the numbers that matter." subtitle="The gauges use arcs, needles, and tick marks to turn outcomes into something you can read at a glance without adding extra noise." />

          <div className="mx-auto mt-12 max-w-7xl rounded-[8px] border-2 border-[#1e1e1e] bg-[#0f0f0f] p-6 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8),0_0_0_4px_#0a0a0a,0_0_0_6px_#1a1a1a]">
            <div className="mb-5 inline-flex rounded-[4px] border border-white/10 bg-[#1a1209] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e8c547]">Performance metrics / SYS-01</div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {GAUGES.map((gauge) => (
                <Gauge key={gauge.label} label={gauge.label} value={gauge.value} display={gauge.display} active={activeSection === 'stats'} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-end gap-4 font-mono text-[9px] uppercase tracking-[0.35em] text-white/45">
              <Indicator light="green" label="SYS OK" active />
              <Indicator light="green" label="BUILD" active />
              <Indicator light="amber" label="WARN" active blinking />
              <Indicator light="off" label="IDLE" />
              <Indicator light="off" label="QUEUE" />
              <Indicator light="off" label="SYNC" />
            </div>
          </div>
        </section>

        <section id="team" className="section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="TEAM" title="A physical rolodex with cards that feel handled, not generated." subtitle="Arrow keys and the on-screen buttons flip through the roster while background cards shift to suggest the stack behind the active card." />

          <div className="mx-auto mt-12 flex max-w-7xl items-center justify-center gap-4">
            <button type="button" aria-label="Previous team member" onClick={() => setTeamIndex((value) => (value - 1 + TEAM.length) % TEAM.length)} className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-[#f5f0e8] transition-transform duration-200 hover:scale-[1.04]">
              <ChevronLeft className="mx-auto h-5 w-5" />
            </button>
            <div className="rolodex-shell relative w-full max-w-[760px] perspective-[800px]">
              <div className="absolute -left-1 top-1 h-[204px] w-[320px] rotate-[-3deg] rounded-[16px] bg-[#e9e1d7] opacity-25" />
              <div className="absolute left-1 top-2 h-[204px] w-[320px] rotate-[-1.5deg] rounded-[16px] bg-[#e9e1d7] opacity-35" />
              <div className="absolute left-3 top-3 h-[204px] w-[320px] rounded-[16px] bg-[#e9e1d7] opacity-45" />
              <div className="relative mx-auto max-w-[320px] rounded-[16px] border border-black/10 bg-[#f8f5f0] px-5 py-6 text-[#1a1208] shadow-[0_20px_50px_rgba(0,0,0,0.25)]" style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
                <div className="absolute -top-6 left-5 rounded-t-[4px] px-4 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white" style={{ background: activeTeam.color }}>
                  {activeTeam.department}
                </div>
                <div className="border-t-2 border-black/10 pt-5">
                  <div className="flex items-start gap-4">
                    <img src={makeAvatar(activeTeam.name, activeTeam.color, activeTeam.name.split(' ').map((part) => part[0]).join(''))} alt={activeTeam.name} className="h-16 w-16 rounded-full border-2 border-black/10 object-cover" loading="lazy" decoding="async" />
                    <div>
                      <h3 className="font-display text-[18px] font-bold">{activeTeam.name}</h3>
                      <p className="font-body text-[12px] italic text-black/60">{activeTeam.title}</p>
                      <div className="mt-3 flex items-center gap-2 text-black/50">
                        <GitBranch className="h-4 w-4" />
                        <ExternalLink className="h-4 w-4" />
                        <Mail className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-black/30">
                    <span>{String(teamIndex + 1).padStart(2, '0')} / {String(TEAM.length).padStart(2, '0')}</span>
                    <span>Rolodex</span>
                  </div>
                </div>
              </div>
            </div>
            <button type="button" aria-label="Next team member" onClick={() => setTeamIndex((value) => (value + 1) % TEAM.length)} className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-[#f5f0e8] transition-transform duration-200 hover:scale-[1.04]">
              <ChevronRight className="mx-auto h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2 text-[#f5f0e8]/55">
            {TEAM.map((member, index) => (
              <button key={member.name} type="button" aria-label={`Show ${member.name}`} onClick={() => setTeamIndex(index)} className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${index === teamIndex ? 'bg-[#e8c547] shadow-[0_0_12px_rgba(232,197,71,0.4)]' : 'bg-white/20'}`} />
            ))}
          </div>
        </section>

        <section id="testimonials" className="section-block scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="TESTIMONIALS" title="A jukebox player with record sleeves, liner notes, and track buttons." subtitle="The active record spins while the review card replaces its notes. The layout keeps the tactile feeling of a mechanical player without sacrificing legibility." />

          <div className="jukebox-shell mx-auto mt-12 max-w-7xl rounded-[16px] border-4 border-[#2a2010] bg-[#1a1209] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="rounded-t-[12px] bg-[linear-gradient(#3a2a10,#2a1a08)] px-4 py-3" />
            <div className="grid gap-6 p-4 lg:grid-cols-[0.9fr_1.2fr]">
              <div className="flex flex-col items-center justify-center gap-5">
                <div className="vinyl-record relative flex h-[260px] w-[260px] items-center justify-center rounded-full border border-white/10 bg-[#101010] shadow-[inset_0_0_0_10px_rgba(255,255,255,0.02)]" style={{ animation: 'spin 4s linear infinite', animationPlayState: activeSection === 'testimonials' ? 'running' : 'paused' }}>
                  {[45, 60, 75, 90, 105].map((radius) => (
                    <div key={radius} className="absolute rounded-full border border-white/5" style={{ width: radius * 2, height: radius * 2 }} />
                  ))}
                  <div className="absolute h-[70px] w-[70px] rounded-full" style={{ background: activeTestimonial.tint }} />
                  <div className="absolute right-4 top-8 h-32 w-px rotate-[28deg] bg-[#f5f0e8]/35" />
                  <div className="absolute right-2 top-10 h-3 w-3 rounded-full bg-[#e8c547] shadow-[0_0_6px_rgba(232,197,71,0.4)]" />
                </div>
                <div className="rounded-[4px] border border-white/10 bg-[#f5f0e8] px-4 py-3 text-[#1a1208] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                  <div className="font-body text-[13px] font-semibold text-[#e8c547]">{activeTestimonial.name}</div>
                  <div className="font-mono text-[11px] text-[#1a1208]/60">{activeTestimonial.company}</div>
                </div>
              </div>

              <div className="rounded-[4px] border border-white/10 bg-[#f5f0e8] p-6 text-[#2a1a08] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/40">Liner notes</div>
                  <div className="flex gap-1 text-[#e8c547]">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
                  </div>
                </div>
                <p className="mt-6 text-[16px] italic leading-8">“{activeTestimonial.quote}”</p>
                <div className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-black/55">— {activeTestimonial.name}, {activeTestimonial.title} at {activeTestimonial.company}</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pb-4">
              {TESTIMONIALS.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  aria-label={`Show testimonial from ${testimonial.name}`}
                  onClick={() => setTestimonialIndex(index)}
                  className={`h-9 w-9 rounded-full border text-[11px] font-mono transition-all duration-200 ${index === testimonialIndex ? 'border-[#e8c547] bg-[#e8c547] text-[#0a0a0a] shadow-[0_0_12px_rgba(232,197,71,0.4)]' : 'border-white/20 bg-white/5 text-[#f5f0e8]'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="section-block scroll-mt-28 bg-[#1c2820] px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="PRICING" title="Today's menu is chalked out for the appetite of the project." subtitle="The chalkboard style stays warm and tactile, with a special badge for the plan that needs to stand apart without looking louder than the rest." />

          <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-3">
            {PRICING.map((plan) => (
              <article key={plan.name} className="chalk-plan rounded-[4px] border-2 border-dashed border-white/30 p-6 text-[#f5f0e8] transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.06),inset_0_0_20px_rgba(255,255,255,0.02)]">
                {plan.popular ? <div className="mb-4 inline-flex rotate-[-3deg] rounded-[4px] bg-[#e8c547] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#1c2820]">Chef&apos;s special</div> : null}
                <div className="font-handwriting text-[24px] font-bold">{plan.name}</div>
                <div className="mt-3 border-b border-white/15 pb-3 text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-[#e8c547]">{plan.price}</div>
                <ul className="mt-4 space-y-3 font-handwriting text-[14px] leading-7">
                  {plan.details.map((detail) => <li key={detail}>○ {detail}</li>)}
                </ul>
                <button type="button" className="mt-8 rounded-[2px] bg-[#f5f0e8] px-6 py-3 font-handwriting text-[16px] font-bold text-[#1c2820] transition-colors duration-200 hover:bg-[#e8e4dc]">
                  Reserve a spot
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="section-block scroll-mt-28 bg-[linear-gradient(to_right,#2a2a2a,#3a3a3a,#2a2a2a)] px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="FAQ" title="Drawer-style answers inside a filing cabinet." subtitle="Each drawer carries a question label, handle, and expandable paper folder. It keeps the support section practical rather than decorative." />

          <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[4px] border-2 border-[#1a1a1a] bg-[linear-gradient(to_right,#2a2a2a,#3a3a3a,#2a2a2a)] shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
            {FAQS.map(([question, answer], index) => {
              const open = faqIndex === index;
              return (
                <button key={question} type="button" className="drawer-item block w-full border-b border-black/40 text-left" onClick={() => setFaqIndex(open ? null : index)}>
                  <div className="flex h-[52px] items-center justify-between px-5 text-[#f5f0e8]">
                    <div className="flex items-center gap-4">
                      <div className="hidden h-7 w-20 items-center justify-center rounded-[2px] bg-[#e8c547] font-mono text-[10px] uppercase tracking-[0.28em] text-[#1a1208] sm:flex">Help</div>
                      <span className="font-body text-[14px] font-semibold">{question}</span>
                    </div>
                    {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden bg-[#f5f0e8] px-6 py-4 text-[#1a1208]">
                      <p className="text-[14px] leading-7">{answer}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section id="contact" className="section-block scroll-mt-28 bg-[#0a0a0a] px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader label="CONTACT" title="A retro office phone body with a working form inside it." subtitle="The display, keypad, and handset make the form feel tactile while the actual inputs stay accessible, labeled, and keyboard-friendly." />

          <div className="phone-shell mx-auto mt-12 max-w-5xl rounded-[16px] border-2 border-[#1a2530] bg-[linear-gradient(135deg,#2c3e50,#34495e)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_2px_#1a2530,inset_0_2px_4px_rgba(255,255,255,0.1)]" style={{ transform: 'perspective(1000px) rotateX(4deg) rotateY(-2deg)' }}>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="rounded-[4px] border-2 border-inset border-black/40 bg-[#0a1f0a] p-3 font-mono text-[#39ff14] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                  <div className="h-[80px] overflow-hidden rounded-[2px] border border-black/30 bg-[#081508] p-3">
                    <div className="font-mono text-[13px] uppercase tracking-[0.25em] text-[#39ff14]/70">{contactNote}</div>
                    <div className="mt-2 text-[11px] text-[#39ff14]/40">{contactState === 'success' ? 'MESSAGE SENT' : contactState === 'error' ? 'ERROR: CHECK FIELDS' : 'INPUT MODE'}</div>
                  </div>
                </div>

                <form className="mt-6 space-y-4" onSubmit={onSubmitContact}>
                  {[
                    ['NAME', 'name', 'text'],
                    ['PHONE NUMBER', 'phone', 'tel'],
                    ['EMAIL ADDRESS', 'email', 'email'],
                  ].map(([label, key, type]) => (
                    <label key={label} className="block">
                      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.35em] text-[#e8c547]">{label}</span>
                      <input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                        onFocus={() => setContactNote(`INPUT MODE — ${label}`)}
                        onBlur={() => setContactNote(`OK: ${label}`)}
                        className="w-full rounded-[2px] border border-white/10 bg-black/40 px-3 py-2 font-mono text-[14px] text-[#e8c547] outline-none transition-colors duration-200 focus:border-[#e8c547]"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.35em] text-[#e8c547]">MESSAGE / DESCRIPTION</span>
                    <textarea
                      value={form.message}
                      onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                      onFocus={() => setContactNote('INPUT MODE — MESSAGE')}
                      onBlur={() => setContactNote('OK: MESSAGE')}
                      rows={4}
                      className="w-full rounded-[2px] border border-white/10 bg-black/40 px-3 py-2 font-mono text-[14px] text-[#e8c547] outline-none transition-colors duration-200 focus:border-[#e8c547]"
                    />
                  </label>

                  <button type="submit" className="inline-flex items-center gap-2 rounded-[4px] border-b-4 border-[#a03010] bg-[#e85d24] px-8 py-3 font-body text-[15px] font-bold text-white transition-transform duration-200 active:translate-y-[2px] active:border-b-2">
                    SEND <Phone className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <div className="rounded-[16px] border border-white/10 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#f5f0e8]/45">Keypad</div>
                    <div className={`h-2.5 w-2.5 rounded-full ${contactState === 'success' ? 'bg-[#2ecc71] shadow-[0_0_12px_rgba(46,204,113,0.8)]' : contactState === 'sending' ? 'bg-[#e8c547] shadow-[0_0_10px_rgba(232,197,71,0.8)]' : 'bg-[#e85d24] shadow-[0_0_8px_rgba(232,93,36,0.6)]'}`} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['1','2','3','4','5','6','7','8','9','*','0','#'].map((digit) => (
                      <button key={digit} type="button" onClick={() => setContactNote(`DIAL ${digit}`)} className="h-9 w-9 rounded-full border-b-[3px] border-black/40 bg-[linear-gradient(180deg,#4a5568,#374151)] font-mono text-[14px] font-bold text-[#f5f0e8] shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                        {digit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[16px] border border-white/10 bg-black/20 p-4 text-[#f5f0e8]/70">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[10px] uppercase tracking-[0.35em]">Status</div>
                    <Shield className="h-4 w-4 text-[#e8c547]" />
                  </div>
                  <p className="mt-4 text-[14px] leading-7">Use the form to send a message through the local API route. The display changes with focus, error, and success states so the whole object feels alive instead of decorative.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="section-block scroll-mt-28 border-t border-white/10 bg-[#111111] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[280px] overflow-hidden rounded-none border border-white/10 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[size:36px_36px] p-6">
              <div className="absolute left-10 top-8 h-24 w-12 bg-[#222]" />
              <div className="absolute left-24 top-16 h-32 w-14 bg-[#2a2a2a]" />
              <div className="absolute left-44 top-10 h-40 w-16 bg-[#1a1a1a]" />
              <div className="absolute left-52 top-4 h-28 w-20 bg-[rgba(232,197,71,0.6)]" />
              <div className="absolute bottom-8 left-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8c547]">
                <MapPinned className="h-4 w-4" /> You are here
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['Navigate', ['Home', 'About', 'Projects', 'Services', 'Contact']],
                ['Services', ['UI/UX Design', 'Development', 'Mobile Apps', 'Branding', 'Consulting']],
                ['Company', ['About Us', 'Team', 'Careers', 'Blog', 'Terms']],
                ['Contact', ['hello@helioforge.studio', '+1 (555) 204-8812', 'Twitter', 'LinkedIn', 'GitHub']],
              ].map(([title, links]) => (
                <div key={String(title)}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#e8c547]">{title as string}</div>
                  <div className="mt-3 space-y-3">
                    {(links as string[]).map((link) => (
                      <a key={link} href="#" className="block text-[13px] text-[#f5f0e8]/50 transition-all duration-200 hover:translate-x-1 hover:text-[#f5f0e8]">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[11px] text-[#f5f0e8]/30">
            <div>© 2025 Helioforge. All rights reserved.</div>
            <div className="flex items-center gap-3 text-[#f5f0e8]/50">
              <ExternalLink className="h-4 w-4" />
              <Sparkles className="h-4 w-4" />
              <MessageSquareMore className="h-4 w-4" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Gauge({ label, value, display, active }: { label: string; value: number; display: string; active: boolean }) {
  const progress = useCountUp(value, active);
  const radius = 60;
  const circumference = Math.PI * radius;
  const filled = (progress / 100) * circumference;

  return (
    <div className="gauge-shell rounded-[8px] border border-white/10 bg-[#111111] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <svg viewBox="0 0 150 150" className="mx-auto block h-[150px] w-[150px]">
        <circle cx="75" cy="75" r={radius} stroke="#1a1a1a" strokeWidth="8" fill="none" />
        <circle cx="75" cy="75" r={radius} stroke="#2a2a2a" strokeWidth="8" fill="none" strokeDasharray={`${filled} ${circumference}`} transform="rotate(-180 75 75)" strokeLinecap="round" />
        <circle cx="75" cy="75" r="49" stroke="rgba(232,93,36,0.3)" strokeWidth="8" fill="none" strokeDasharray={`${circumference * 0.2} ${circumference}`} transform="rotate(-180 75 75)" />
        {[...Array(18)].map((_, index) => {
          const angle = -180 + index * 10;
          const major = index % 3 === 0;
          const lineLength = major ? 12 : 6;
          const x1 = 75 + (radius - 6) * Math.cos((angle * Math.PI) / 180);
          const y1 = 75 + (radius - 6) * Math.sin((angle * Math.PI) / 180);
          const x2 = 75 + (radius - 6 - lineLength) * Math.cos((angle * Math.PI) / 180);
          const y2 = 75 + (radius - 6 - lineLength) * Math.sin((angle * Math.PI) / 180);
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={major ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'} strokeWidth={major ? 2 : 1} />;
        })}
        <g className="gauge-needle" transform={`rotate(${progress * 1.8 - 90} 75 75)`}>
          <line x1="75" y1="75" x2="75" y2="20" stroke="#e85d24" strokeWidth="2" strokeLinecap="round" />
          <circle cx="75" cy="75" r="4" fill="#e85d24" />
        </g>
      </svg>
      <div className="font-mono text-[28px] font-bold text-[#e8c547]">{display}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">{label}</div>
    </div>
  );
}

function Indicator({ light, label, active, blinking = false }: { light: 'green' | 'amber' | 'off'; label: string; active?: boolean; blinking?: boolean }) {
  const base = light === 'green' ? '#2ecc71' : light === 'amber' ? '#e8c547' : '#2a2a2a';
  const shadow = light === 'green' ? '0 0 8px #2ecc71' : light === 'amber' ? '0 0 8px #e8c547' : 'none';

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${active && blinking ? 'animate-pulse' : ''}`}
        style={{ background: base, boxShadow: shadow }}
      />
      <span>{label}</span>
    </div>
  );
}