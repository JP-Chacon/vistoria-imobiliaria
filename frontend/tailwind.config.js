/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9e9ff',
          200: '#b9d6ff',
          300: '#8abaff',
          400: '#5d9dff',
          500: '#357eff',
          600: '#1f63e6',
          700: '#164dc7',
          800: '#133ea0',
          900: '#13357f',
        },
      },
      boxShadow: {
        card: '0 10px 25px -15px rgba(15, 23, 42, 0.4)',
      },
    },
  },
  plugins: [],
}

