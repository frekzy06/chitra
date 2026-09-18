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
        background: "#FCE4E4",
        foreground: "#2A171D",
        primary: {
          DEFAULT: "#5E2E36",
          foreground: "#ffffff",
        },
        chitra: {
          canvas: "#FCE4E4",
          canvasSoft: "#F8D7DA",
          dustyRose: "#BD8587",
          dustyRoseDark: "#B0797B",
          dustyRoseLight: "#C99496",
          cardBg: "#BD8587",
          innerField: "#FCE4E4",
          burgundy: "#5E2E36",
          burgundyDark: "#4A2228",
          rosewood: "#7D4448",
          darkText: "#2A171D",
        }
      },
      boxShadow: {
        'figma-card': '0 14px 36px rgba(94, 46, 54, 0.25), 0 4px 14px rgba(0, 0, 0, 0.1)',
        'figma-btn': '0 8px 24px rgba(94, 46, 54, 0.35)',
      },
      fontFamily: {
        sans: ['Manrope', 'Geist', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Geist', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        fraunces: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}
