/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#2A96C9",
        primaryGreen: "#63B65A",
        mycolor: {
          100: "#E5E7EB",
          200: "#D1D5DB",
          300: "#9CA3AF",
          400: "#4B5563",
          500: "#1F2937",
          600: "#111827",
          700: "#0F172A",
          800: "#0D1321",
          900: "#0B1018",
        },
      },
      fontFamily: {
        rampart: ["Rampart One", "cursive"],
      },
    },
    screens: {
      xs: "425px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
