import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b4f30',
          border: '2px solid #fadb14',
          borderRadius: '4px',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#ff007f',
            border: '1px solid #0a2e1d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fadb14',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            transform: 'rotate(-5deg)',
          }}
        >
          गोवा
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
