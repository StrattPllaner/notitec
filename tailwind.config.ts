import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Color de acento de la marca (rojo periodístico sobrio) + neutros.
        acento: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#e5322b',
          600: '#c81e1e',
          700: '#a41414',
          800: '#871515',
          900: '#701818',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Georgia"', 'ui-serif', 'serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
