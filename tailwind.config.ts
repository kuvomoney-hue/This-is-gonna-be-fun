import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0f0a",
        surface: "#111811",
        primary: "#14591D",
        "primary-bright": "#1a7a27",
        "text-primary": "#e8f5e9",
        "text-secondary": "#81c784",
        border: "#1e3320",
        success: "#4caf50",
        danger: "#ef5350",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "glow-green": "0 0 16px rgba(20, 89, 29, 0.4)",
        "glow-green-lg": "0 0 32px rgba(26, 122, 39, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
