// Evidence available in this portfolio. A screenshot demonstrates an interface, not model accuracy or adoption.
export const PROJECT_EVIDENCE: Record<string, { contribution: string; demonstrated: string; limitation: string }> = {
  edna: {
    contribution: 'An eDNA analysis concept and web interface that bring sequence input, predicted species and biodiversity exploration into one place.',
    demonstrated: 'The project preview shows a DNA prediction panel and a path through analysis and biodiversity exploration. A linked deployment lets visitors inspect the experience.',
    limitation: 'We have not published a benchmark dataset, independently verified accuracy, or evidence of use in field research. Predictions need scientific validation before research decisions depend on them.',
  },
  tars: {
    contribution: 'A local-LLM orchestration project exploring retrieval and a TARS-inspired conversational persona, with controls for how the assistant responds.',
    demonstrated: 'The interface preview shows personality controls and a conversation surface. The linked repository is the place to inspect the implementation and setup requirements.',
    limitation: 'Behaviour depends on the connected model and local setup. Interface status labels are not performance measurements, and the portfolio does not establish reliability or hardware benchmarks.',
  },
  techazura: {
    contribution: 'An event website that brings the symposium programme, event information and registration entry points into a single experience.',
    demonstrated: 'The published design shows event navigation, a registration call to action and a countdown. It is included here as a web-design project.',
    limitation: 'We do not claim attendance, registration conversions or other event outcomes. The 2026 event information is historical; the linked site may retain its original launch copy.',
  },
};
