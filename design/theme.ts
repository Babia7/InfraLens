export const themeTokens = {
  colors: {
    pageBg: '#09090b',
    cardBg: '#18181b',
    border: '#27272a',
    primary: '#ffffff',
    secondary: '#a1a1aa',
    hosDayStart: '#f97316',
    hosDayMid: '#818cf8',
    hosDayEnd: '#312e81',
    hosCurveStart: '#71717a',
    hosCurveEnd: '#a855f7'
  },
  fonts: {
    sans: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
    serif: 'Playfair Display, serif'
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-out',
    spinSlow: 'spin 12s linear infinite',
    spinSlower: 'spin 20s linear infinite',
    float: 'float 6s ease-in-out infinite',
    floatDelayed: 'float 6s ease-in-out 3s infinite',
    breathe: 'breathe 8s ease-in-out infinite',
    pulseSlow: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }
};

export const tailwindTheme = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Playfair Display', 'serif']
      },
      colors: {
        'page-bg': '#09090b',
        'card-bg': '#18181b',
        'primary': '#ffffff',
        'secondary': '#a1a1aa',
        'border': '#27272a',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'spin-slow': 'spin 12s linear infinite',
        'spin-slower': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.2)' },
        }
      }
    }
  }
};
