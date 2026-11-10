"use client";
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus, X } from 'lucide-react';
import { NAV_ITEMS } from './sections/active/data';
import type { SectionId } from './sections/active/types';
import styles from './siteNav.module.css';

export default function SiteNav({ activeSection }: { activeSection: SectionId }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef('');
  const close = () => dialog.current?.close();
  const open = () => {
    if (!dialog.current || dialog.current.open) return;
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal(); document.body.style.overflow = 'hidden';
  };
  const restore = () => { document.body.style.overflow = previousOverflow.current; trigger.current?.focus({ preventScroll: true }); };
  useEffect(() => () => { if (dialog.current?.open) document.body.style.overflow = previousOverflow.current; }, []);
  const navigate = (id: string) => {
    close();
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      history.replaceState(null, '', `#${id}`);
    });
  };
  return <>
    <header className={styles.header} data-site-nav data-cursor-scale="1.3" onKeyDown={event => event.stopPropagation()}>
      <div className={styles.rail}>
        <Link href="/" className={styles.brand} aria-label="Sagittariuz home"><span className={styles.seal} aria-hidden="true">↗</span><span>SAGITTARIUZ<small>Curiosity, put to work.</small></span></Link>
        <nav className={styles.links} aria-label="Main navigation">{NAV_ITEMS.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-current={activeSection === item.id ? 'location' : undefined}><small>0{index + 1}</small>{item.label}</a>)}</nav>
        <button ref={trigger} className={styles.menu} onClick={open} aria-label="Open site index" aria-haspopup="dialog">Index <Plus size={17} /></button>
      </div>
    </header>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="site-index-title" onClose={restore} onKeyDown={event => event.stopPropagation()} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className={styles.sheet}>
        <div className={styles.top}><span>SAGITTARIUZ / DIRECTORY</span><button onClick={close} aria-label="Close site index"><X size={20} /></button></div>
        <h2 id="site-index-title">Find your way.</h2><p>A small studio. A world of questions.</p>
        <nav aria-label="Site index">{[...NAV_ITEMS, { id: 'faq' as const, label: 'Questions & answers' }].map((item, index) => <a key={item.id} href={`#${item.id}`} onClick={event => { event.preventDefault(); navigate(item.id); }}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={19} /></a>)}</nav>
        <div className={styles.subpages}><Link href="/team" onClick={close}>Meet the founders ↗</Link><Link href="/projects" onClick={close}>Open the project newspaper ↗</Link></div>
      </div>
    </dialog>
  </>;
}
