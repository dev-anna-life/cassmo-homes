/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0B3D24",
          deep: "#082C1A",
          800: "#0E4D2A",
        },
        brand: {
          green: "#24B550",
          greenDark: "#1D9642",
        },
        accent: {
          DEFAULT: "#FE8F01",
          dark: "#E07F00",
        },
        cream: "#FAF8F3",
        ink: "#14261C",
        muted: "#5B6B60",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "50%": { transform: "scale(1.03)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.6s ease-out both",
        "slide-in-left": "slide-in-left 0.6s ease-out both",
        "slide-in-right": "slide-in-right 0.6s ease-out both",
        "bounce-in": "bounce-in 0.5s ease-out both",
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};
