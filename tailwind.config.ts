import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#f8f9fc",
          200: "#f1f3f9",
          300: "#dee3ed",
          400: "#c2c9d6",
          500: "#8f96a3",
          600: "#5e636e",
          700: "#2f3237",
          800: "#1d1e20",
          900: "#111213",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 6px -1px rgba(0,0,0,0.16), 0 1px 4px -1px rgba(0,0,0,0.04)",
        "card-active": "0 0 8px -2px rgba(0,0,0,0.1), 0 6px 20px -3px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
