import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1220',
          900: '#121B2E',
          800: '#1A2540',
          700: '#22304A',
          600: '#334361',
        },
        mist: {
          50: '#F7F8FB',
          100: '#EDF1F7',
          200: '#DCE1EA',
          400: '#8A93A6',
          700: '#5B6472',
          900: '#101828',
        },
        teal: {
          DEFAULT: '#22D3B4',
          600: '#17B89D',
          700: '#119682',
        },
        amber: {
          DEFAULT: '#F5A623',
          600: '#DB8F14',
        },
        violet: {
          DEFAULT: '#8B7CF6',
          600: '#7561EE',
        },
        danger: {
          DEFAULT: '#F04438',
          50: '#FEF3F2',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'teal-violet-gradient': 'linear-gradient(135deg, #22D3B4 0%, #8B7CF6 100%)',
        'amber-teal-gradient': 'linear-gradient(135deg, #F5A623 0%, #22D3B4 100%)',
        // Nuage de couleur plus riche et plus présent, dès le haut de page
        // (le header n'est plus jamais sur du blanc plat) — sans repasser
        // par un fond sombre dominant.
        'mesh-light':
          'radial-gradient(700px 600px at 8% -5%, rgba(34,211,180,0.26), transparent 60%), radial-gradient(800px 700px at 95% 0%, rgba(139,124,246,0.26), transparent 60%), radial-gradient(650px 600px at 70% 85%, rgba(245,166,35,0.18), transparent 60%), radial-gradient(500px 450px at 25% 60%, rgba(139,124,246,0.14), transparent 60%)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.10)',
        glow: '0 0 0 1px rgba(34, 211, 180, 0.25), 0 8px 24px rgba(34, 211, 180, 0.15)',
        elevated: '0 24px 48px -12px rgba(11, 18, 32, 0.35), 0 8px 16px -8px rgba(11, 18, 32, 0.2)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'pulse-bar': {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '1' },
          '50%': { transform: 'scaleY(0.55)', opacity: '0.7' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-slow-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        'pulse-bar': 'pulse-bar 2.4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'spin-slow': 'spin-slow 60s linear infinite',
        'spin-slow-reverse': 'spin-slow-reverse 60s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;