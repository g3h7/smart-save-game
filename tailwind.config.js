/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#eef1f8', // fundo levemente azulado para quebrar o banco absoluto
        sidebar: '#111827', // dark blue/gray
        card: '#ffffff',
        primary: '#10b981', // green
        danger: '#ef4444', // red
        warning: '#f97316', // orange (xp)
        accent: '#2563eb', // blue accent
        textDark: '#1f2937',
        textLight: '#9ca3af',
        xpBarEmpty: '#1e293b',
        xpBarFill: '#f97316'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'system-ui'],
        display: ['Outfit', 'sans-serif'], // For headings
      }
    },
  },
  plugins: [],
}
