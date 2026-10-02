/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9F5',
          100: '#E1F3EA',
          200: '#C2E6D5',
          300: '#95D3B8',
          400: '#5DB893',
          500: '#167A5B', // Primary ClimateCascade Brand
          600: '#11654B',
          700: '#0F513D',
          800: '#0D4A36', // Dark Forest Green
          900: '#0B3326',
          950: '#051E16',
        },
        surface: {
          50: '#FBFDFB',
          100: '#F4F7F5', // App background
          200: '#E9EFEA',
          300: '#DCE5E0', // Subtle grey-green border
          400: '#CAD4CD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 42, 30, 0.04), 0 1px 2px -1px rgba(16, 42, 30, 0.04)',
        'card': '0 2px 6px -1px rgba(16, 42, 30, 0.06), 0 2px 4px -2px rgba(16, 42, 30, 0.04)',
        'elevation': '0 10px 25px -3px rgba(16, 42, 30, 0.08), 0 4px 6px -4px rgba(16, 42, 30, 0.04)',
      }
    },
  },
  plugins: [],
}
