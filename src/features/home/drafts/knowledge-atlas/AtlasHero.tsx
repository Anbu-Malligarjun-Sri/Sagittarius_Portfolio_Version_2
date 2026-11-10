"use client";

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowUpRight, RotateCcw, Pause, Play, Plus, Minus, X, MoveHorizontal } from 'lucide-react';
import { DOMAINS, STUDIES } from './knowledge/studies';
import type { KnowledgeScene } from './knowledge/scene';
import styles from './hero.module.css';

export default function CinematicHero() {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<string, HTMLButtonElement>());
  const scene = useRef<KnowledgeScene | null>(null);
  const card = useRef<HTMLDialogElement>(null);
  const picker = useRef<HTMLSelectElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const study = STUDIES.find(item => item.id === selected);
  const domain = DOMAINS.find(item => item.id === (study?.domain ?? selected));
  const color = domain?.color ?? '#e8c547';

  useEffect(() => {
    let cancelled = false;
    let instance: KnowledgeScene | null = null;
    import('./knowledge/scene').then(({ createKnowledgeScene }) => {
      if (cancelled || !host.current) return;
      instance = createKnowledgeScene(host.current, labels.current, () => { if (!cancelled) setStatus('fallback'); });
      scene.current = instance;
      setStatus('ready');
    }).catch(() => { if (!cancelled) setStatus('fallback'); });
    return () => { cancelled = true; instance?.dispose(); scene.current = null; };
  }, []);
  useEffect(() => {
    scene.current?.focus(selected);
    if (selected && card.current && !card.current.open) {
      card.current.show();
      closeButton.current?.focus({ preventScroll: true });
    } else if (!selected) card.current?.close();
  }, [selected, status]);
  useEffect(() => { scene.current?.pause(paused); }, [paused, status]);
  useEffect(() => { scene.current?.refresh(); }, [showLabels, status]);
  const close = () => { setSelected(null); picker.current?.focus({ preventScroll: true }); };

  const nodes = [
    { id: 'stem', name: 'STEM', color: '#e8c547', hub: true, domain: '' },
    ...DOMAINS.map(item => ({ ...item, hub: true, domain: item.id })),
    ...STUDIES.map(item => ({ ...item, color: DOMAINS.find(d => d.id === item.domain)!.color, hub: false })),
  ];
  return (
    <section className={styles.hero} aria-labelledby="hero-heading" data-cursor-scale="1.2"
      style={{ '--field-color': color } as CSSProperties}
      onKeyDown={event => { event.stopPropagation(); if (event.key === 'Escape' && selected) close(); }}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}><span /> Sagittariuz · An atlas of possibility</p>
        <h1 id="hero-heading">Great questions.<br /><em>Unexpected connections.</em></h1>
        <p className={styles.intro}>We’re building AI to take the friction out of discovery.<br />Explore the world of ideas that inspires us.</p>
        <div className={styles.links}><a href="#projects">Explore our work <ArrowUpRight size={15} /></a><Link href="/team">Meet our team <ArrowUpRight size={15} /></Link></div>
      </header>
      <div className={styles.explorer}>
        <div className={styles.mapHeader}><span>STEM / 30 connected studies</span>
          <label className={styles.find}>Find a study
            <select ref={picker} id="atlas-study" value={selected ?? ''} onChange={event => setSelected(event.target.value || null)}>
              <option value="">Explore the atlas</option>
              {DOMAINS.map(item => <optgroup key={item.id} label={item.name}>
                <option value={item.id}>{item.name} — overview</option>
                {STUDIES.filter(s => s.domain === item.id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </optgroup>)}
            </select>
          </label>
        </div>
        <div ref={host} className={styles.graph} data-ready={status === 'ready'} data-labels={showLabels}
          tabIndex={0} role="group" aria-label="3D knowledge atlas. Drag to orbit, or use arrow keys. Plus and minus zoom. Select a point for its field notes."
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            const rotations: Record<string, [number, number]> = { ArrowLeft: [-.15, 0], ArrowRight: [.15, 0], ArrowUp: [0, -.1], ArrowDown: [0, .1] };
            if (rotations[event.key]) { event.preventDefault(); scene.current?.orbit(...rotations[event.key]); }
            if (event.key === '+' || event.key === '=') { event.preventDefault(); scene.current?.zoom(-1); }
            if (event.key === '-') { event.preventDefault(); scene.current?.zoom(1); }
          }}>
          <div className={styles.nodes} style={{ visibility: status === 'ready' ? 'visible' : 'hidden' }}>
            {nodes.map(node => <button key={node.id} type="button"
              ref={element => { if (element) labels.current.set(node.id, element); else labels.current.delete(node.id); }}
              className={styles.node} data-hub={node.hub} data-selected={selected === node.id}
              data-near={domain?.id === node.domain} aria-label={`Explore ${node.name}`}
              aria-haspopup={node.id === 'stem' ? undefined : 'dialog'}
              aria-pressed={node.id === 'stem' ? !selected : selected === node.id}
              style={{ '--node-color': node.color } as CSSProperties}
              onClick={() => setSelected(node.id === 'stem' ? null : node.id)}>
              <span className={styles.nodeDot} /><span className={styles.nodeName}>{node.name}</span>
            </button>)}
          </div>
          {status !== 'ready' && <div className={styles.fallback}>
            <strong>STEM</strong><p>{status === 'loading' ? 'Opening the atlas…' : 'Choose a branch or use the study finder.'}</p>
            <div>{DOMAINS.map(item => <button key={item.id} onClick={() => setSelected(item.id)} style={{ color: item.color }}>{item.name}</button>)}</div>
          </div>}
        </div>
        <div className={styles.toolbar}>
          <p><MoveHorizontal size={15} /> Drag to orbit · Tap a point to discover</p>
          <div>
            <button onClick={() => scene.current?.zoom(-1)} aria-label="Zoom in"><Plus size={16} /></button>
            <button onClick={() => scene.current?.zoom(1)} aria-label="Zoom out"><Minus size={16} /></button>
            <button onClick={() => { setSelected(null); scene.current?.focus(null); }} aria-label="Reset atlas view"><RotateCcw size={15} /></button>
            <button onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? 'Resume map rotation' : 'Pause map rotation'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
            <button onClick={() => setShowLabels(value => !value)} aria-pressed={showLabels}>Labels</button>
          </div>
        </div>
        <div className={styles.legend} aria-label="Knowledge branches">
          {DOMAINS.map(item => <button key={item.id} aria-pressed={domain?.id === item.id} onClick={() => setSelected(item.id)} style={{ '--node-color': item.color } as CSSProperties}><i />{item.name}</button>)}
        </div>
      </div>
      {status !== 'loading' && createPortal(<dialog ref={card} className={styles.card} style={{ '--field-color': color } as CSSProperties} aria-labelledby="atlas-card-title" onClose={() => setSelected(null)}>
        <div className={styles.cardTop}><span>FIELD NOTES / {String(STUDIES.findIndex(s => s.id === selected) + 1).padStart(2, '0')}</span><button ref={closeButton} onClick={close} aria-label="Close field notes"><X size={19} /></button></div>
        <div className={styles.cardBody}>
          <p className={styles.breadcrumb}>STEM / {domain?.name}</p>
          <h2 id="atlas-card-title">{study?.name ?? domain?.name}</h2>
          <p className={styles.description}>{study?.description ?? domain?.description}</p>
          {study ? <blockquote>{study.question}</blockquote> : <div className={styles.branchList}>
            {STUDIES.filter(s => s.domain === domain?.id).map(s => <button key={s.id} onClick={() => setSelected(s.id)}>{s.name}<ArrowUpRight size={14} /></button>)}
          </div>}
          {study && <button className={styles.backBranch} onClick={() => setSelected(study.domain)}>← Explore {domain?.name}</button>}
        </div>
        <button className={styles.backAtlas} onClick={close}>Back to the whole atlas <RotateCcw size={14} /></button>
      </dialog>, document.body)}
      <footer className={styles.footnote}><span>A map of our curiosity. Not a complete taxonomy or a catalogue of services.</span><a href="#about">Our reason for being ↗</a></footer>
    </section>
  );
}
