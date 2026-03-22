/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo 600
        secondary: '#10b981', // Emerald 500
        dark: '#0f172a',    // Slate 900
        light: '#f8fafc',   // Slate 50
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
