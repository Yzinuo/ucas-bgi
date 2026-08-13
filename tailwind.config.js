/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#004A96',
        'brand-dark': '#002B5C',
        'brand-light': '#E8F0FE',
        surface: 'rgba(255,255,255,0.10)',
        'surface-hover': 'rgba(255,255,255,0.16)',
      },
    },
  },
  plugins: [],
}
