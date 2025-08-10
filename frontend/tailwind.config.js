/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy': {
          900: '#0C1A27',
          800: '#1A2B3A',
          700: '#283C4D',
        },
        'football-green': {
          500: '#2E9E48',
          400: '#4CAF50',
          600: '#1B5E20',
        },
        'light-grey': '#F2F2F2',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'navy-green-gradient': 'linear-gradient(135deg, #0C1A27 0%, #1A2B3A 50%, #2E9E48 100%)',
        'subtle-gradient': 'linear-gradient(135deg, #0C1A27 0%, #1A2B3A 100%)',
      },
    },
  },
  plugins: [],
};
