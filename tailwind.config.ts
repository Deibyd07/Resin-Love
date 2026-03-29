import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fcf4ff",
        surface: "#fcf4ff",
        "surface-container-low": "#f6eefa",
        "surface-container-high": "#e8dfed",
        "surface-container-highest": "#e2dae8",
        "surface-variant": "#e2dae8",
        "on-surface": "#312d35",
        "on-surface-variant": "#5e5a63",
        primary: "#9f345d",
        "primary-container": "#fe7faa",
        secondary: "#006668",
        "secondary-container": "#5af8fb",
        "secondary-fixed": "#5af8fb",
        tertiary: "#705900",
        "tertiary-container": "#f5ce53",
        error: "#b41340",
        "error-container": "#f74b6d",
        "on-primary": "#ffeff1",
        "on-primary-container": "#59002b",
        "on-secondary-container": "#005b5d",
        "on-tertiary-container": "#584500",
      },
      fontFamily: {
        headline: ["var(--font-headline)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        label: ["var(--font-body)", "sans-serif"],
        brand: ["var(--font-brand)", "cursive"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(159,52,93,0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;
