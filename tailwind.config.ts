import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          obsidian: "#08090c",
          carbon: "#101217",
          caviar: "#161922",
          slate: "#1e222e",
          ivory: "#fbf9f4",
          alabaster: "#f5f0e6",
          parchment: "#ede5d5",
          gold: "#b38728",
          brightGold: "#d4af37",
          champagne: "#e6ca65",
          antiqueGold: "#9b7736",
          silk: "#f7f6f2",
          silver: "#a6acba",
          charcoal: "#141312",
        },
        navy: {
          950: "#0b0f19",
          900: "#0f172a",
          800: "#1e3a8a",
          700: "#1d4ed8",
          600: "#2563eb",
          500: "#3b82f6",
          100: "#dbeafe",
          50: "#eff6ff",
        },
        brass: {
          DEFAULT: "#b38728",
          dark: "#d4af37",
          light: "#f5eed9",
          subtle: "rgba(179, 135, 40, 0.12)",
        },
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        display: ["Cinzel", "Cormorant Garamond", "Georgia", "serif"],
        serif: ["Cormorant Garamond", "Georgia", "Times New Roman", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        body: ["Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        luxury: "0 4px 20px -2px rgba(18, 16, 12, 0.05), 0 1px 3px rgba(18, 16, 12, 0.02)",
        luxuryDark: "0 8px 32px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(212, 175, 55, 0.1)",
        goldGlow: "0 0 20px -2px rgba(212, 175, 55, 0.25)",
        goldGlowSubtle: "0 0 12px 0 rgba(212, 175, 55, 0.12)",
        elevated: "0 16px 40px -8px rgba(18, 16, 12, 0.08)",
        modal: "0 24px 64px -12px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
