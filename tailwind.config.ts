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
        background: "#0F0F0F",
        foreground: "#EDEDED",
        card: "#1A1A1A",
        "card-border": "#2A2A2A",
        accent: "#10B981",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};
export default config;
