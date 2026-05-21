import type { Config } from "tailwindcss";

/* === CONFIGURACAO DO TAILWIND | inicio === */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lexend", "Lexand", "system-ui", "sans-serif"],
        display: ["Lexend", "Lexand", "system-ui", "sans-serif"],
      },
      colors: {
        hss: {
          roxo: "#291B7F",
          violeta: "#4B32D8",
          lavanda: "#8D7BFF",
          ciano: "#22D3EE",
          verde: "#34D399",
          tinta: "#080711",
          gelo: "#EEF0F7",
        },
      },
      boxShadow: {
        neon: "0 24px 90px rgba(75, 50, 216, 0.18)",
        suave: "0 18px 42px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "grade-hss": "linear-gradient(rgba(75,50,216,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(75,50,216,.10) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
/* === CONFIGURACAO DO TAILWIND | fim === */
