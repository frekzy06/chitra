/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chitra: {
          burgundy: "#7A3E48",
          burgundyDark: "#5E2E36",
          rosewood: "#8B4752",
          cardBg: "#C69A9E",
          cardBgDark: "#A87C80",
          canvas: "#FEEAEA",
          accentRose: "#F8D7DA",
          darkSlate: "#1E293B",
          badgeRed: "#DC2626",
          badgeRedHover: "#B91C1C",
        }
      },
      boxShadow: {
        'figma-card': '0 12px 32px rgba(94, 46, 54, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08)',
        'figma-btn': '0 8px 24px rgba(122, 62, 72, 0.35)',
        'figma-inner': 'inset 0 2px 4px rgba(0,0,0,0.06)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
