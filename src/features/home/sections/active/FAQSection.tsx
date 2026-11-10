'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FAQS } from './data';
import Lantern from './Lantern';
import styles from './faq.module.css';

export default function FAQSection() {
  const [lit, setLit] = useState(false);
  const [mounted, setMounted] = useState(false);
  const section = useRef<HTMLElement>(null);
  const lantern = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const root = section.current; if (!root) return;
    const mouse = matchMedia('(hover:hover) and (pointer:fine)');
    const reduce = matchMedia('(prefers-reduced-motion:reduce)');
    let frame = 0, active = false, x = 0, y = 0, tx = 0, ty = 0, last = 0;
    const draw = (now: number) => {
      frame = 0; if (!active) return;
      const dt = Math.min(now-last || 16.7,50); last=now;
      const ease=reduce.matches?1:1-Math.exp(-dt/45); x+=(tx-x)*ease; y+=(ty-y)*ease;
      if (lantern.current) { lantern.current.style.transform=`translate(${x-25}px,${y-42}px)`; lantern.current.dataset.visible='true'; }
      cards.current.forEach(card=>{
        if(!card)return;
        const r=card.getBoundingClientRect();card.style.setProperty('--light-x',`${x-r.left}px`);card.style.setProperty('--light-y',`${y-r.top}px`);
        const distance=Math.hypot(Math.max(r.left-x,0,x-r.right),Math.max(r.top-y,0,y-r.bottom));
        card.style.setProperty('--exposure',String(Math.max(.07,1-distance/220)));
        const answer=card.querySelector('p');if(answer){const a=answer.getBoundingClientRect();answer.style.setProperty('--beam-x',`${x-a.left}px`);answer.style.setProperty('--beam-y',`${y-a.top}px`);}
      });
      if(Math.hypot(tx-x,ty-y)>.1)frame=requestAnimationFrame(draw);
    };
    const move=(event:PointerEvent)=>{
      if(!mouse.matches||event.pointerType==='touch')return;
      tx=event.clientX;ty=event.clientY;
      if(!active){x=tx;y=ty;active=true;root.dataset.lanternActive='true';}
      if(!frame){last=performance.now();frame=requestAnimationFrame(draw);}
    };
    const leave=()=>{active=false;cancelAnimationFrame(frame);frame=0;root.dataset.lanternActive='false';if(lantern.current)lantern.current.dataset.visible='false';cards.current.forEach(card=>{card?.style.setProperty('--exposure','.07');card?.style.setProperty('--light-x','-500px');card?.style.setProperty('--light-y','-500px');});};
    root.addEventListener('pointermove',move);root.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);window.addEventListener('scroll',leave,true);mouse.addEventListener('change',leave);
    return()=>{leave();root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);window.removeEventListener('scroll',leave,true);mouse.removeEventListener('change',leave);};
  },[]);
  // A portal keeps the lantern above the site's layered sections without moving the content.
  useEffect(()=>{const frame=requestAnimationFrame(()=>setMounted(true));return()=>cancelAnimationFrame(frame);},[]);
  return <section ref={section} id="faq" className={styles.section} data-lit={lit} onKeyDown={event=>event.stopPropagation()}>
    <div className={styles.inner}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>The reading room / honest answers</p><h2>Switch on the light,<br/><em>read it all.</em></h2></div>
        <div><p className={styles.note}>Carry a little light through the questions. Or illuminate the whole room.</p><button className={styles.switch} aria-pressed={lit} onClick={()=>setLit(value=>!value)}><span aria-hidden="true"/>{lit?'Return to lantern light':'Show all answers'}</button></div>
      </header>
      <div className={styles.grid}>{FAQS.map((faq,index)=><article key={faq.question} ref={el=>{cards.current[index]=el;}} className={styles.card} tabIndex={0} aria-labelledby={`faq-question-${index}`}>
        <div className={styles.index}><span>{String(index+1).padStart(2,'0')}</span><span>{faq.category}</span></div><h3 id={`faq-question-${index}`}>{faq.question}</h3><p className={styles.answer}>{faq.answer}</p>
      </article>)}</div>
      <div className={styles.foot}><span>No fine print hidden in the dark.</span><a href="#contact">Still curious? Ask us directly ↗</a></div>
    </div>
    {mounted&&createPortal(<div ref={lantern} className={styles.lantern} aria-hidden="true"><Lantern/></div>,document.body)}
  </section>;
}
