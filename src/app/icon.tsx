import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

// Image generation
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
          background: 'linear-gradient(135deg, #008080 0%, #006666 100%)',
          position: 'relative',
        }}
      >
        {/* Border (3D effect) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#ffffff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '8px',
            background: '#ffffff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '8px',
            background: '#808080',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#808080',
          }}
        />

        {/* Calendar Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '320px',
            height: '300px',
            background: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {/* Calendar Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px',
              background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ffffff',
              fontFamily: 'system-ui',
            }}
          >
            97
          </div>

          {/* Calendar Grid */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '16px',
            }}
          >
            {/* Week days */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div
                  key={i}
                  style={{
                    width: '36px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#666',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Date grid (simplified) */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              {[...Array(28)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: i === 14 ? '#ffffff' : '#333',
                    background: i === 14 ? '#fbbf24' : 'transparent',
                    borderRadius: '4px',
                    fontWeight: i === 14 ? 'bold' : 'normal',
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
