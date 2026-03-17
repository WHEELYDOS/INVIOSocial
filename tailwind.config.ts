import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#191923",
        accent: "#0E79B2",
        background: "#FBFEF9",
      },
      backgroundColor: {
        primary: "#191923",
        accent: "#0E79B2",
        background: "#FBFEF9",
      },
      textColor: {
        primary: "#191923",
        accent: "#0E79B2",
        background: "#FBFEF9",
      },
      borderColor: {
        primary: "#191923",
        accent: "#0E79B2",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
        "fade-in": "fade-in 0.8s ease-in-out",
      },
      keyframes: {
        "marquee": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

export default config;
