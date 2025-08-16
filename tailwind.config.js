/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        brand: {
          'dark': '#0f0f23',
          'medium': '#1a1a3e',
          'light': '#2d2d5f',
          'purple': '#6366f1',
          'purple-light': '#8b5cf6',
          'pink': '#ec4899',
        },
        // CTA highlight color
        cta: {
          'primary': '#ff6b35',
          'hover': '#e55a2b',
        },
        // Extended grays
        neutral: {
          'white': '#ffffff',
          'light': '#f1f5f9',
          'medium': '#64748b',
          'dark': '#334155',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}