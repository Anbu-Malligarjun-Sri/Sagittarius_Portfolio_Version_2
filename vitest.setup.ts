import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// next/font/google only works inside Next's own build. In tests every font loader just returns empty font info.
vi.mock('next/font/google', () =>
	new Proxy(
		{},
		{
			has: (_target, name) => name !== 'then',
			get: (_target, name) => (name === 'then' ? undefined : () => ({ className: '', variable: '', style: {} })),
		},
	),
);

class MockIntersectionObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
	writable: true,
	configurable: true,
	value: MockIntersectionObserver,
});
