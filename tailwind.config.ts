import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070d18",
          900: "#0c1726",
          850: "#111f33",
          800: "#162740",
          700: "#1f3659",
          600: "#2a4975",
        },
        brass: {
          DEFAULT: "#cda03c",
          bright: "#e5c572",
          light: "#f5e6b8",
          dim: "rgba(205, 160, 60, 0.12)",
          dark: "#a57d23",
        },
        paper: {
          DEFAULT: "#f7f9fc",
          2: "#eef2f7",
          surface: "#ffffff",
          line: "#e2e7f0",
          "line-strong": "#cbd5e1",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(12, 23, 38, 0.05), 0 4px 12px rgba(12, 23, 38, 0.03)",
        card: "0 2px 6px rgba(12, 23, 38, 0.04), 0 12px 28px rgba(12, 23, 38, 0.07)",
        elevated: "0 16px 40px -8px rgba(12, 23, 38, 0.16)",
        modal: "0 25px 60px -15px rgba(7, 13, 24, 0.35)",
        gold: "0 4px 20px rgba(205, 160, 60, 0.28)",
      },
      borderRadius: {
        legal: "14px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 2.5s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

