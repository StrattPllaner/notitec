import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Marca monocromática (blanco y negro). El acento es una rampa de
        // grises: en modo claro se usan los tonos oscuros (~negro) y en modo
        // oscuro los claros, vía las variantes dark: de cada componente.
        acento: {
          50: '#f6f6f7',
          100: '#ececee',
          200: '#d9d9dd',
          300: '#b8b8bf',
          400: '#8a8a93',
          500: '#5b5b63',
          600: '#1b1b1e',
          700: '#131316',
          800: '#0b0b0d',
          900: '#050506',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'ui-serif', 'serif'],
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
