/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hermann: {
          bg: '#FFF7F8',
          card: '#FFFFFF',
          primary: '#E63956',
          primaryDark: '#B81D39',
          pink: '#FF758F',
          pinkLight: '#FFE5EC',
          pinkBg: '#FFF0F3',
          wine: '#7D1424',
          gold: '#D4AF37',
          goldLight: '#FDE047',
          textDark: '#2D151E',
          textMuted: '#6B4C57',
          sage: '#4A6B56',
          sageLight: '#E8F3EB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
        handwriting: ['"Dancing Script"', 'cursive'],
        bigbang: ['"DFVN Big Bang"', 'serif'],
        nvnvalky: ['NVNValky', 'serif'],
        sacviet: ['SacViet', 'sans-serif'],
      },
      fontSize: {
        titleSection: 'clamp(28px, 7vw, 34px)',
      },
      boxShadow: {
        'soft-pink': '0 10px 30px -5px rgba(230, 57, 86, 0.15)',
        'glow-pink': '0 0 25px rgba(255, 117, 143, 0.4)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
