/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,vue,js,ts}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#000000',
      white: '#ffffff',
      gray: {
        '50': '#f8fafc',
        '100': '#f1f5f9',
        '200': '#e2e8f0',
        '300': '#cbd5e1',
        '400': '#94a3b8',
        '500': '#64748b',
        '600': '#475569',
        '700': '#334155',
        '800': '#1e293b',
        '900': '#0f172a',
      },
      brand: {
        'light': '#a7f3d0',
        'mid': '#10b981',
        'dark': '#065f46'
      },
      accent: {
        'light': '#bfdbfe',
        'mid': '#3b82f6',
        'dark': '#1e40af'
      },
      error: {
        'light': '#fbcfe8',
        'mid': '#ec4899',
        'dark': '#9d174d'
      }
    },
    extend: {},
  },
  plugins: [],
}
