/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fc',
          100: '#e0ecf8',
          200: '#c5dcf3',
          300: '#9ac4ea',
          400: '#67a3de',
          500: '#4383cf',
          600: '#2d67be',
          700: '#1e4fa4',
          800: '#0d3471', // Target primary: #0d3471
          900: '#0b2959',
          950: '#061734',
          DEFAULT: '#0d3471',
        },
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#c81414', // Target accent: #c81414
          800: '#a31111',
          900: '#821313',
          950: '#470505',
          DEFAULT: '#c81414',
        },
        brand: {
          50: '#f0f5fc',
          100: '#e0ecf8',
          200: '#c5dcf3',
          300: '#9ac4ea',
          400: '#67a3de',
          500: '#4383cf',
          600: '#2d67be',
          700: '#1e4fa4',
          800: '#0d3471',
          900: '#0b2959',
          950: '#061734',
          DEFAULT: '#0d3471',
        },
      },
    },
  },
  plugins: [],
}
