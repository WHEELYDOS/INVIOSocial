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
        softBlue: "#DBE2EF",
        bgLight: "#F9F7F7",
      },
      backgroundColor: {
        primary: "#191923",
        accent: "#0E79B2",
        background: "#FBFEF9",
        softBlue: "#DBE2EF",
        bgLight: "#F9F7F7",
      },
      textColor: {
        primary: "#191923",
        accent: "#0E79B2",
        background: "#FBFEF9",
      },
      borderColor: {
        primary: "#191923",
        accent: "#0E79B2",
        softBlue: "#DBE2EF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
        "fade-in": "fade-in 0.8s ease-in-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 12s ease-in-out infinite",
        "float-gentle": "float-gentle 10s ease-in-out infinite",
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
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-8px) rotate(1deg)" },
          "66%": { transform: "translateY(4px) rotate(-0.5deg)" },
        },
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.22, 0.61, 0.36, 1)",
        "smooth-out": "cubic-bezier(0.0, 0.0, 0.2, 1)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

export default config;
