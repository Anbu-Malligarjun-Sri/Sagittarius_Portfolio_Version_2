import { useId } from 'react';

/** Brass hurricane lantern, drawn from the supplied antique-light reference. */
export default function Lantern() {
  const id = useId();
  return <svg viewBox="0 0 80 116" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-metal`}><stop stopColor="#4e3021"/><stop offset=".36" stopColor="#d59d55"/><stop offset=".65" stopColor="#79502b"/><stop offset="1" stopColor="#392519"/></linearGradient>
      <radialGradient id={`${id}-glass`}><stop stopColor="#fff1a5" stopOpacity=".95"/><stop offset=".55" stopColor="#ffb733" stopOpacity=".65"/><stop offset="1" stopColor="#ae531b" stopOpacity=".3"/></radialGradient>
    </defs>
    <path d="M23 35V23C23 2 57 2 57 23V35" stroke={`url(#${id}-metal)`} strokeWidth="3"/>
    <path d="M18 35C7 38 7 87 17 94M62 35C73 38 73 87 63 94" stroke={`url(#${id}-metal)`} strokeWidth="5"/>
    <path d="M24 42H56L61 83Q40 94 19 83Z" fill={`url(#${id}-glass)`} stroke="#d0a260" strokeWidth="1.5"/>
    <path d="M22 41L58 83M58 41L22 83" stroke="#674421" strokeWidth="2"/>
    <path d="M40 80C23 79 34 62 41 54C39 65 50 68 48 75C47 79 43 80 40 80Z" fill="#ffbf46"/>
    <path d="M40 79C33 77 39 68 41 65C41 72 47 76 40 79Z" fill="#fff6bf"/>
    <path d="M19 41L23 32H57L61 41ZM24 32L28 24H52L56 32Z" fill={`url(#${id}-metal)`} stroke="#36261c"/>
    <rect x="29" y="17" width="22" height="8" rx="3" fill={`url(#${id}-metal)`}/>
    <path d="M18 88H62L66 103H14ZM12 104H68V110H12Z" fill={`url(#${id}-metal)`} stroke="#3a291b"/>
    <ellipse cx="40" cy="87" rx="22" ry="4" fill="#5f4024" stroke="#b37e40"/>
    <path d="M24 49L26 68" stroke="#fff4d0" strokeOpacity=".5" strokeWidth="2"/>
    <g fill="#e9b668">{[28,36,44,52].map(x=><circle key={x} cx={x} cy="36" r="1.3"/>)}</g>
  </svg>;
}
