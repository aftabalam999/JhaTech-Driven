/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19", // Deep Space Blue/Black
        cardBg: "rgba(22, 28, 45, 0.7)", // Glass Slate
        primary: {
          light: "#818cf8",
          DEFAULT: "#6366f1", // Indigo
          dark: "#4f46e5",
        },
        accent: {
          light: "#34d399",
          DEFAULT: "#10b981", // Emerald Green
          dark: "#059669",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 8px 32px 0 rgba(99, 102, 241, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
