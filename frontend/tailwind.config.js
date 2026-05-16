/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a',
        'dark-card': '#1a1a1a',
        'dark-border': '#2a2a2a',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'gold': '#FFD700',
        'gold-dark': '#B8860B',
      },
    },
  },
  plugins: [],
}
