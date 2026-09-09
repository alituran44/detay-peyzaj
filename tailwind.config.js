/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f4',
          100: '#e1f0e7',
          200: '#c3e2d1',
          300: '#97cdb3',
          400: '#64b18f',
          500: '#3d9471',
          600: '#2b7759',
          700: '#235f48',
          800: '#1e4c3a',
          900: '#1a3f31',
          950: '#0b231b',
        },
        obsidian: {
          800: '#161d19',
          850: '#121814',
          900: '#0d1310',
          950: '#070b09',
        },
        gold: {
          400: '#e4c478',
          500: '#d4af37',
          600: '#aa8820',
        },
        sand: {
          50: '#fbfaf8',
          100: '#f5f3ee',
          200: '#eae6dc',
          300: '#dcd4c3',
          400: '#c7bba4',
          500: '#b4a287',
        }
      },
      fontFamily: {
        sans: ['" Plus Jakarta Sans\', 'system-ui', 'sans-serif'],
 serif: ['\Playfair Display\', 'Georgia', 'serif'],
 },
 boxShadow: {
 'glow': '0 0 30px -5px rgba(61, 148, 113, 0.3)',
 'glow-gold': '0 0 30px -5px rgba(212, 175, 55, 0.25)',
 'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
 }
 },
 },
 plugins: [],
}
