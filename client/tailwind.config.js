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
        primary: '#e91e8c',       // logo magenta/pink
        'primary-hover': '#c4166f',
        secondary: '#7b2ff7',     // logo purple
        accent: '#f5a623',        // logo gold
        danger: '#EF4444',
        success: '#10B981',
        dark: '#0a0008',          // logo black background
        'card-dark': '#1a0a2e',
        text: '#F8FAFC',
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        'pulse-fast': 'pulse 0.5s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      }
    },
  },
  plugins: [],
}
