'use client';

import { useEffect, useState } from 'react';
import { initializeGSAP } from '../features/home/gsapClient';
import StartupShowcase from '../features/home/StartupShowcase';

export default function App() {
  const [safeMode, setSafeMode] = useState(false);

  useEffect(() => {
    let mounted = true;

    const prevBodyOverflowY = document.body.style.overflowY;
    const prevHtmlOverflowY = document.documentElement.style.overflowY;
    const prevBodyHeight = document.body.style.height;
    const prevHtmlHeight = document.documentElement.style.height;

    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';

    initializeGSAP().then((result) => {
      if (!mounted) return;
      setSafeMode(!result.ok);
    });

    return () => {
      mounted = false;
      document.body.style.overflowY = prevBodyOverflowY;
      document.documentElement.style.overflowY = prevHtmlOverflowY;
      document.body.style.height = prevBodyHeight;
      document.documentElement.style.height = prevHtmlHeight;
    };
  }, []);

  return (
    <div
      className="relative min-h-screen bg-[#0a0a0a] text-[#f5f0e8] selection:bg-[#e8c547]/30 selection:text-[#f5f0e8]"
      data-animation-mode={safeMode ? 'safe' : 'enhanced'}
    >
      <StartupShowcase />
    </div>
  );
}
