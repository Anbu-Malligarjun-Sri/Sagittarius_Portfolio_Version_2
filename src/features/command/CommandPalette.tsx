'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CornerDownLeft, Hash, Search } from 'lucide-react';
import { SOCIALS } from '@/features/social/socials';

type Command =
  | { id: string; group: string; label: string; hint?: string; keywords: string; kind: 'section'; target: string }
  | { id: string; group: string; label: string; hint?: string; keywords: string; kind: 'page'; target: string }
  | { id: string; group: string; label: string; hint?: string; keywords: string; kind: 'external'; target: string };

const COMMANDS: Command[] = [
  { id: 'home', group: 'Go to', label: 'Home', kind: 'page', target: '/', keywords: 'start top landing' },
  { id: 'services', group: 'Go to', label: 'Services', hint: 'Home', kind: 'section', target: 'services', keywords: 'design web mobile ai consulting seo' },
  { id: 'process', group: 'Go to', label: 'Process', hint: 'Home', kind: 'section', target: 'process', keywords: 'how we work steps' },
  { id: 'work', group: 'Go to', label: 'Work', hint: 'Home', kind: 'section', target: 'projects', keywords: 'projects portfolio case studies' },
  { id: 'start', group: 'Go to', label: 'Ways to begin', hint: 'Home', kind: 'section', target: 'start', keywords: 'start begin pricing cost quote price' },
  { id: 'contact', group: 'Go to', label: 'Contact', hint: 'Home', kind: 'section', target: 'contact', keywords: 'hire message email start a project typewriter' },
  { id: 'projects', group: 'Pages', label: 'All projects', hint: 'Case files', kind: 'page', target: '/projects', keywords: 'work portfolio edna tars techazura oceanography symposium' },
  { id: 'team', group: 'Pages', label: 'The team', kind: 'page', target: '/team', keywords: 'founders anbu brajin arun about people' },
  { id: 'lab', group: 'Pages', label: 'The lab', hint: 'Zenith', kind: 'page', target: '/species-de-extinction', keywords: 'zenith de-extinction webgl experiment' },
  ...SOCIALS.map(
    (s): Command => ({ id: `social-${s.id}`, group: 'Find us', label: s.label, kind: 'external', target: s.href, keywords: `social ${s.id}` }),
  ),
];

const ICON = { section: Hash, page: ArrowRight, external: ArrowUpRight } as const;

function Palette({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => `${c.label} ${c.group} ${c.hint ?? ''} ${c.keywords}`.toLowerCase().includes(q));
  }, [query]);

  const current = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [current, results]);

  const run = (command: Command | undefined) => {
    if (!command) return;
    ref.current?.close();
    // Let the dialog finish closing before moving, so focus and scroll land cleanly.
    window.setTimeout(() => {
      if (command.kind === 'external') {
        window.open(command.target, '_blank', 'noopener,noreferrer');
      } else if (command.kind === 'page') {
        router.push(command.target);
      } else if (pathname === '/') {
        document.getElementById(command.target)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.assign(`/#${command.target}`);
      }
    }, 0);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(results.length ? (current + 1) % results.length : 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(results.length ? (current - 1 + results.length) % results.length : 0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(results[current]);
    }
  };

  let lastGroup = '';

  return (
    <dialog
      ref={ref}
      aria-label="Command palette"
      onClose={onClose}
      // The home page's typewriter listens to the whole window and swallows letters, arrows and Tab.
      // Keys typed in here must not reach it.
      onKeyDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
      // A <dialog> sits above the site's custom cursor, so the real cursor is restored inside it.
      className="m-auto mt-[14vh] w-[min(92vw,600px)] max-w-none cursor-default overflow-visible bg-transparent p-0 text-[#f5f0e8] backdrop:cursor-default backdrop:bg-black/70 backdrop:backdrop-blur-sm [&_*]:cursor-auto [&_button]:cursor-pointer! [&_input]:cursor-text! [&_li]:cursor-pointer!"
    >
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0c0b0a] shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-[#e8c547]" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={results[current] ? `cmd-${results[current].id}` : undefined}
            aria-label="Search pages and links"
            placeholder="Jump to a section, page or profile…"
            className="h-14 w-full bg-transparent font-mono text-[14px] text-[#f5f0e8] placeholder:text-[#f5f0e8]/35 focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-[#f5f0e8]/45">esc</kbd>
        </div>

        <ul ref={listRef} id="command-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li role="presentation" className="px-3 py-8 text-center font-mono text-[12px] text-[#f5f0e8]/45">
              Nothing matches &ldquo;{query}&rdquo;
            </li>
          ) : (
            results.map((command, index) => {
              const showGroup = command.group !== lastGroup;
              lastGroup = command.group;
              const Icon = ICON[command.kind];
              const selected = index === current;
              return (
                <li key={command.id} role="presentation">
                  {showGroup ? (
                    <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e8c547]/80">{command.group}</p>
                  ) : null}
                  <div
                    id={`cmd-${command.id}`}
                    role="option"
                    aria-selected={selected}
                    onMouseMove={() => setActive(index)}
                    onClick={() => run(command)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] ${selected ? 'bg-[#e8c547] text-[#0a0a0a]' : 'text-[#f5f0e8]/80'}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                    <span className="font-medium">{command.label}</span>
                    {command.hint ? <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${selected ? 'text-[#0a0a0a]/55' : 'text-[#f5f0e8]/30'}`}>{command.hint}</span> : null}
                    {selected ? <CornerDownLeft className="ml-auto h-3.5 w-3.5 opacity-60" aria-hidden="true" /> : null}
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f0e8]/35">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </dialog>
  );
}

/** Ctrl/Cmd + K opens a quick-jump palette anywhere on the site; a small hint button does the same for mouse and touch. */
export default function CommandPalette() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const immersive = pathname.startsWith('/species-de-extinction'); // the lab has its own full-screen UI

  useEffect(() => {
    if (immersive) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        event.stopPropagation(); // keep the typewriter form from also typing a "K"
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [immersive]);

  if (immersive) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search (Ctrl K)"
        data-cursor-scale="1.6"
        className="fixed bottom-4 right-4 z-[45] hidden items-center gap-2 rounded-full border border-white/15 bg-[#0c0b0a]/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f0e8]/60 backdrop-blur transition-colors duration-200 hover:border-[#e8c547]/70 hover:text-[#e8c547] sm:flex"
      >
        <Search className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Search</span>
        <kbd className="rounded border border-white/20 px-1.5 py-px">Ctrl K</kbd>
      </button>
      {open ? <Palette onClose={() => setOpen(false)} /> : null}
    </>
  );
}
