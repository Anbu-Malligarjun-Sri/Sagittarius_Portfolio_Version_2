import styles from './stamps.module.css';

/** A screen-printed automaton workshop, in the same 192 × 190 window as the other stamps. */
export default function AgentsArt({ uid }: { uid: string }) {
  const brass = '#d6b46c', paper = '#f2e3be', green = '#254e46';
  const gear = (x: number, y: number, radius: number) => <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
    <g className={styles.agentsGear}>
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x="-2.2" y={-radius-2} width="4.4" height="5" fill={brass} transform={`rotate(${i*30})`} />)}
      <circle r={radius} fill={brass} stroke="#7a5a35" strokeWidth="1" /><circle r={radius*.57} fill={green} stroke={paper} strokeWidth=".7" />
      <path d={`M${-radius*.45} 0H${radius*.45}M0 ${-radius*.45}V${radius*.45}`} stroke={brass} strokeWidth="2" /><circle r="2" fill={paper} />
    </g>
  </g>;
  return <>
    <defs><linearGradient id={`${uid}-atelier`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#122f30"/><stop offset="1" stopColor="#427361"/></linearGradient></defs>
    <rect width="192" height="190" fill={`url(#${uid}-atelier)`}/>
    <g stroke={paper} strokeOpacity=".12" strokeWidth=".5">{Array.from({length:12},(_,i)=><path key={i} d={`M${i*18} 0V190M0 ${i*18}H192`}/>)}</g>
    <path d="M11 168V61Q11 10 96 10Q181 10 181 61V168" fill="none" stroke={brass} strokeWidth="1.5"/>
    <path d="M17 166V62Q17 17 96 17Q175 17 175 62V166" fill="none" stroke={paper} strokeWidth=".5"/>
    <text x="96" y="34" textAnchor="middle" fill={paper} fontSize="6" letterSpacing="1.5" style={{fontFamily:'var(--font-stamp-agents), serif'}}>THE AUTOMATON ATELIER</text>
    <path d="M40 45H152M34 49H158" stroke={brass} strokeWidth=".6"/>
    {gear(96,75,23)}{gear(60,94,12)}{gear(131,98,14)}
    <g stroke={brass} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M34 150V122L53 111L65 124M157 150V121L139 111L123 127"/>
      <path d="M65 124l-7 8m7-8 5 8M123 127l-7 7m7-7 6 6" strokeWidth="2"/>
    </g>
    <g fill={paper} stroke="#946c3e" strokeWidth="1">{[[34,122],[53,111],[157,121],[139,111]].map(([x,y])=><circle key={x} cx={x} cy={y} r="4"/>)}</g>
    <g className={styles.agentParcel}><rect x="80" y="118" width="29" height="22" rx="1" fill={paper} stroke="#b98448"/><path d="M80 118l14.5 12L109 118M80 140l11-13m18 13-11-13" fill="none" stroke="#b98448" strokeWidth=".8"/><circle cx="95" cy="130" r="3" fill="#b8553c"/></g>
    <rect x="24" y="145" width="144" height="7" fill={brass}/><path d="M30 152V166M162 152V166" stroke={brass} strokeWidth="4"/>
    <g fill={paper} fontSize="5.5" textAnchor="middle" letterSpacing="1" style={{fontFamily:'var(--font-stamp-agents), serif'}}><text x="43" y="162">PLAN</text><text x="96" y="162">ACT</text><text x="149" y="162">CHECK</text></g>
    <path d="M22 171H170" stroke={brass} strokeWidth=".7"/>
    <text x="96" y="185" textAnchor="middle" fontSize="12" letterSpacing="3" fill={paper} style={{fontFamily:'var(--font-stamp-agents), serif',fontWeight:700}}>AI AGENTS</text>
  </>;
}
