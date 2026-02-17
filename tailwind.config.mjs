/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ada: {
          purple: "#8B5CF6",
          cyan: "#06B6D4",
        },
      },
    },
  },
  plugins: [],
};
