/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // bright blue
          light: "#60a5fa",
          dark: "#1e40af",
        },
        secondary: {
          DEFAULT: "#fb7185", // coral
          light: "#fda4af",
          dark: "#be123c",
        },
        accent: {
          DEFAULT: "#14b8a6", // teal
          light: "#5eead4",
          dark: "#0f766e",
        },
        yellow: {
          DEFAULT: "#facc15",
          light: "#fef08a",
          dark: "#ca8a04",
        },
        background: "#f9fafb", // very light gray
        surface: "#ffffff", // white
        muted: "#e5e7eb", // light gray
        border: "#d1d5db", // border gray
        text: "#1e293b", // dark blue-gray
      },
      fontFamily: {
        sans: ["Inter", "Lato", "Open Sans", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 8px 0 rgba(0,0,0,0.04)",
        button: "0 1px 4px 0 rgba(37,99,235,0.10)",
      },
    },
  },
  plugins: [],
};
