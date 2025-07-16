// tailwind.config.js
/** @type {import('npm:tailwindcss').Config} */
export default {
  content: [
    "./deploy/**/*.{md,ts,tsx}",
    "./_components/**/*.{md,ts,tsx}",
    "./_includes/**/*.{md,ts,tsx}",
    "./runtime/**/*.{md,ts,tsx}",
    "./static/**/*.{md,ts,tsx}",
    "./subhosting/**/*.{md,ts,tsx}",
    "./404/**/*.{md,ts,tsx}",
    "./examples/**/*.{md,ts,tsx}",
    "./lint/**/*.{md,ts,tsx}",
    "*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: true,
  },
  darkMode: "selector",
  theme: {
    extend: {
      screens: {
        "xlplus": "82rem",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",

        // Dark/light with Tailwind done right using CSS variables:
        "background-primary": "hsla(var(--background-primary))",
        "background-secondary": "hsla(var(--background-secondary))",
        "background-tertiary": "hsla(var(--background-tertiary))",
        "foreground-primary": "hsla(var(--foreground-primary))",
        "foreground-secondary": "hsla(var(--foreground-secondary))",
        "foreground-tertiary": "hsla(var(--foreground-tertiary))",
        "foreground-quaternary": "hsla(var(--foreground-quaternary))",
        "runtime-background": "hsla(var(--runtime-background))",
        "runtime-foreground": "hsla(var(--runtime-foreground))",

        "info": "hsla(var(--info))",
        "note": "hsla(var(--note))",
        "caution": "hsla(var(--caution))",
        "tip": "hsla(var(--tip))",

        "primary": "hsla(var(--primary))",
        "header-highlight": "hsla(var(--header-highlight))",
        "blue-splash": "hsla(var(--blue-splash-hsl))",

        runtime: {
          "50": "#f0fff1",
          "100": "#d6ffe1",
          "200": "#b3ffcd",
          "300": "#70ffae",
          DEFAULT: "#70ffae",
          "400": "#32f59a",
          "500": "#09dc8b",
          "600": "#01b780",
          "700": "#058f71",
          "800": "#0a7163",
          "900": "#0a5c5b",
          "950": "#003033",
        },

        deploy: {
          "50": "hsl(var(--deploy-50-hsl))",
          "100": "hsl(var(--deploy-100-hsl))",
          "200": "hsl(var(--deploy-200-hsl))",
          "300": "hsl(var(--deploy-300-hsl))",
          "400": "hsl(var(--deploy-400-hsl))",
          "500": "hsl(var(--deploy-500-hsl))",
          DEFAULT: "hsl(var(--deploy-500-hsl))",
          "600": "hsl(var(--deploy-600-hsl))",
          "700": "hsl(var(--deploy-700-hsl))",
          "800": "hsl(var(--deploy-800-hsl))",
          "900": "hsl(var(--deploy-900-hsl))",
          "950": "hsl(var(--deploy-950-hsl))",
        },

        gray: {
          "50": "hsl(var(--gray-50-hsl))",
          "100": "hsl(var(--gray-100-hsl))",
          "200": "hsl(var(--gray-200-hsl))",
          "300": "hsl(var(--gray-300-hsl))",
          "400": "hsl(var(--gray-400-hsl))",
          "500": "hsl(var(--gray-500-hsl))",
          "600": "hsl(var(--gray-600-hsl))",
          "700": "hsl(var(--gray-700-hsl))",
          "800": "hsl(var(--gray-800-hsl))",
          "900": "hsl(var(--gray-900-hsl))",
          "950": "hsl(var(--gray-950-hsl))",
        },

        code: {
          1: "#01C2FF",
          2: "#00A341",
          3: "#AE01FF",
          4: "#EA8E04",
          5: "#FFD601",
          6: "#01ff67",
          7: "#db01ff",
        },

        "jsr-yellow": {
          DEFAULT: "#f7df1e",
          "50": "#fefee8",
          "100": "#fdfdc4",
          "200": "#fcf98c",
          "300": "#faee4a",
          "400": "#f7df1e",
          "500": "#e7c50b",
          "600": "#c79a07",
          "700": "#9f7009",
          "800": "#835710",
          "900": "#704713",
          "950": "#412507",
        },

        "jsr-gray": {
          DEFAULT: "#121417",
          "50": "#f6f7f9",
          "100": "#e5e8eb",
          "200": "#ced3da",
          "300": "#a8b2bd",
          "400": "#7a8999",
          "500": "#5f6f81",
          "600": "#515d6c",
          "700": "#47515c",
          "800": "#40474f",
          "900": "#3a3f45",
          "950": "#121417",
        },

        "jsr-cyan": {
          DEFAULT: "#083344",
          "50": "#ebf6ff",
          "100": "#cde9fe",
          "200": "#a6d8fc",
          "300": "#67bef9",
          "400": "#209fee",
          "500": "#0789d5",
          "600": "#0875af",
          "700": "#0e6590",
          "800": "#155775",
          "900": "#164d64",
          "950": "#083344",
        },
      },

      spacing: {
        74: "18.5rem",
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "'Noto Sans'",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [
    {
      handler(api) {
        api.addVariant("current", "[aria-current]&");
        api.addVariant("sidebar-open", "[data-open=true]&");
      },
    },
  ],
};
