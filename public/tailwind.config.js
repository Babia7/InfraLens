tailwind.config = {
  theme: {
    fontSize: {
      xs: ['0.78rem', { lineHeight: '1.2rem' }],
      sm: ['0.92rem', { lineHeight: '1.5rem' }],
      base: ['1.02rem', { lineHeight: '1.7rem' }],
      lg: ['1.125rem', { lineHeight: '1.8rem' }],
      xl: ['1.25rem', { lineHeight: '1.9rem' }],
      '2xl': ['1.5rem', { lineHeight: '2.1rem' }],
      '3xl': ['1.9rem', { lineHeight: '2.4rem' }],
      '4xl': ['2.3rem', { lineHeight: '2.7rem' }],
      '5xl': ['3rem', { lineHeight: '3.3rem' }],
      '6xl': ['3.6rem', { lineHeight: '1' }],
      '7xl': ['4.3rem', { lineHeight: '1' }]
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Playfair Display', 'serif']
      },
      colors: {
        'page-bg': '#0b0c10',
        'card-bg': '#151821',
        'primary': '#f8fafc',
        'secondary': '#c0c6d4',
        'border': '#2a313d'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'spin-slow': 'spin 12s linear infinite',
        'spin-slower': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        breathe: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.2)' }
        }
      }
    }
  }
};
