"use client";

import React from 'react';

export default function Marquee() {
  const items = [
    'TARS ROBOT',
    'DE-EXTINCTION AI',
    'LLM DUAL-MODULE',
    'SMART GLASS',
    'SCIENTIFIC COMPUTING',
  ];

  // Triple the items for seamless infinite scrolling
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee-wrap">
      <div className="marquee-inner" aria-hidden>
        {repeated.map((t, i) => (
          <span key={i} className="marquee-item">
            {t} <span className="dot">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
