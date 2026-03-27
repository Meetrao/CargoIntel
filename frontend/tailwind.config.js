/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obsidian': '#05070a',
        'sidebar': '#0a0c10',
        'card': 'rgba(13, 17, 23, 0.7)',
        'accent-cyan': '#00f5ff',
        'accent-red': '#ff3b3b',
        'accent-amber': '#ff9f0a',
        'text-dim': '#64748b',
        'subtle': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'scan': 'scan-line 3s linear infinite',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}

