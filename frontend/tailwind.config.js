/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0058be',
          'blue-hover': '#0047a0',
          dark: '#191c1d',
          mid: '#424754',
          muted: '#727785',
          light: '#f3f4f5',
          faint: '#f8f9fa',
          border: '#e7e8e9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
