import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "rgb(var(--surface-base) / <alpha-value>)",
          soft: "rgb(var(--surface-soft) / <alpha-value>)"
        },
        accent: {
          cyan: "rgb(var(--accent-cyan) / <alpha-value>)",
          violet: "rgb(var(--accent-violet) / <alpha-value>)"
        }
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.8" }
        }
      },
      animation: {
        glowPulse: "glowPulse 3.2s ease-in-out infinite"
      }
    }
  },
  plugins: [typography]
};

export default config;
