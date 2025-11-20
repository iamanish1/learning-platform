/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1e3a8a',
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
        },
        brand: {
          dark: '#1e3a8a',
          light: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
