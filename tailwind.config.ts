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
        // Base
        bg:       "#0C0C0F",
        surface:  "#13131A",
        surface2: "#1A1A24",
        border:   "#22223A",

        // Rendyr / Trading (green)
        primary:        "#14591D",
        "primary-dim":  "#0D3912",
        "primary-bright": "#22C55E",

        // Way of Woof (navy/purple/amber)
        "wow-navy":       "#0A1E76",
        "wow-navy-dim":   "#071144",
        "wow-purple":     "#C59FC6",
        "wow-purple-dim": "#6B4471",
        "wow-amber":      "#B8A830",
        "wow-cream":      "#F9F6ED",

        // Text
        "text-primary":   "#F0EEF8",
        "text-secondary": "#8B8BA0",

        // Status
        success: "#22C55E",
        danger:  "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "glow-green":  "0 0 20px rgba(34,197,94,0.25)",
        "glow-navy":   "0 0 20px rgba(10,30,118,0.4)",
        "glow-purple": "0 0 20px rgba(197,159,198,0.25)",
        "glow-amber":  "0 0 20px rgba(184,168,48,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
