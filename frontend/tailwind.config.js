import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#4F46E5", // Indigo (trust)
        secondary: "#EC4899", // Pink accent (energy)
        accent: "#22C55E", // Green (charity/hope)
        neutral: "#1F2937", // Dark text
        base: "#F9FAFB", // Background
      },
    },
  },
  plugins: [daisyui, typography],
  daisyui: {
    themes: ["forest"],
  },
};
