/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f18',
        surface: 'rgba(15, 23, 42, 0.4)',
        border: 'rgba(59, 130, 246, 0.2)',
        primary: '#f8fafc',
        secondary: '#94a3b8',
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb'
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
