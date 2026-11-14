import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background:
            'radial-gradient(circle at top left, rgba(232, 197, 71, 0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(74, 144, 217, 0.18), transparent 36%), #0a0a0a',
          color: '#f5f0e8',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '999px',
              background: '#e8c547',
              boxShadow: '0 0 32px rgba(232, 197, 71, 0.45)',
            }}
          />
          <div style={{ fontSize: '24px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(245, 240, 232, 0.72)' }}>
            Sagittariuz
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '880px' }}>
          <div style={{ fontSize: '92px', lineHeight: '0.92', fontWeight: 800, letterSpacing: '-0.05em' }}>
            Less friction. More discovery.
          </div>
          <div style={{ fontSize: '30px', lineHeight: '1.35', color: 'rgba(245, 240, 232, 0.72)' }}>
            Thoughtful software and AI for researchers, students and the work ahead.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '18px', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(245, 240, 232, 0.48)' }}>
            Independent team / Est. 2026
          </div>
          <div style={{ fontSize: '18px', color: '#e8c547' }}>
            www.sagittariuz.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
