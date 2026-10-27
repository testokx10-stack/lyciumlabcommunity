import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f3faef 0%, #e0f3e7 52%, #d7eddf 100%)',
          color: '#063f32',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: 64,
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            background: 'rgba(255,255,255,0.82)',
            border: '2px solid rgba(0,110,66,0.14)',
            borderRadius: 40,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div style={{ color: '#008a38', fontSize: 34, fontWeight: 700, letterSpacing: 4 }}>
            LYCIUM
          </div>
          <div style={{ color: '#075e43', fontSize: 82, fontWeight: 700, letterSpacing: -2 }}>
            Media Lab
          </div>
          <div style={{ color: '#41655a', fontSize: 30, marginTop: 24 }}>
            Sciences agricoles · Ressources · Éducation
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
