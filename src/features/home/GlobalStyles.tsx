const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    :root {
      --color-void: #000208;
      --color-deep: #030510;
      --color-surface: #060916;
      --color-orange: #FF8C00;
      --color-orange-glow: rgba(255,140,0,0.25);
      --color-cyan: #00E5FF;
      --color-cyan-glow: rgba(0,229,255,0.2);
      --color-violet: #9D4EDD;
      --text-primary: #FFFFFF;
      --text-muted: rgba(255,255,255,0.4);
    }

    body {
      background-color: var(--color-void);
      color: var(--text-primary);
      font-family: var(--font-poppins), sans-serif;
      overflow-x: hidden;
      perspective: 1000px;
    }

    h1, h2, h3, h4, .font-display {
      font-family: var(--font-syne), sans-serif;
    }

    code, .font-mono {
      font-family: var(--font-space-mono), monospace;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--color-void); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--color-cyan); }

    .glass-panel {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      border-left: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1);
      border-radius: 16px;
      transform-style: preserve-3d;
    }

    .glass-panel:hover {
      border-color: rgba(0, 229, 255, 0.3);
      box-shadow: 0 0 40px rgba(0, 229, 255, 0.1), inset 0 1px 0 rgba(255,255,255,0.2);
    }

    .deep-scroll-item {
      will-change: transform, opacity, filter;
    }

    .glitch-text {
      position: relative;
      display: inline-block;
    }
    .glitch-text::before, .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
    .glitch-text::before {
      left: 2px;
      text-shadow: -2px 0 var(--color-cyan);
      clip: rect(24px, 550px, 90px, 0);
      animation: glitch-anim-2 3s infinite linear alternate-reverse;
    }
    .glitch-text::after {
      left: -2px;
      text-shadow: -2px 0 var(--color-orange);
      clip: rect(85px, 550px, 140px, 0);
      animation: glitch-anim 2.5s infinite linear alternate-reverse;
    }

    @keyframes glitch-anim { 0% { clip: rect(10px, 9999px, 44px, 0); } 20% { clip: rect(80px, 9999px, 14px, 0); } 40% { clip: rect(30px, 9999px, 88px, 0); } 60% { clip: rect(90px, 9999px, 22px, 0); } 80% { clip: rect(50px, 9999px, 66px, 0); } 100% { clip: rect(70px, 9999px, 33px, 0); } }
    @keyframes glitch-anim-2 { 0% { clip: rect(20px, 9999px, 80px, 0); } 20% { clip: rect(60px, 9999px, 20px, 0); } 40% { clip: rect(40px, 9999px, 60px, 0); } 60% { clip: rect(80px, 9999px, 40px, 0); } 80% { clip: rect(10px, 9999px, 90px, 0); } 100% { clip: rect(30px, 9999px, 10px, 0); } }
      `,
    }}
  />
);

export default GlobalStyles;
