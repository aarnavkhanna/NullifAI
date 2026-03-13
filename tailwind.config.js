/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        marquee: "marquee 50s linear infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "0.35",
            boxShadow: "0 0 4px rgba(255,255,255,0.15)",
          },
          "50%": {
            opacity: "1",
            boxShadow: "0 0 16px rgba(255,255,255,0.5)",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% center" },
          "50%": { backgroundPosition: "100% center" },
          "100%": { backgroundPosition: "0% center" },
        },
      },
    },
  },
  plugins: [],
}
