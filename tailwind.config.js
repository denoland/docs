// tailwind.config.js
/** @type {import('npm:tailwindcss').Config} */
export default {
  content: [
    "{by-example,deploy,_components,_includes,runtime,static,subhosting}/**/*.{md,ts,tsx}",
    "*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: true,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",

        // New design system
        white: "#ffffff",
        black: "#0B0D11",
        "true-black": "#000000",
        offblack: "#121417",
        "white-veil": "#ffffff03",
        "black-veil": "#00000003",

        "primary": "rgb(9, 105, 218)",

        "runtime-dark": "#172723",
        "runtime-secondary": "#EBFF01",
        "runtime-secondary-dark": "#232711",

        "deploy-dark": "#0C212A",

        subhosting: "#FF8A01",
        "subhosting-dark": "#251C11",

        fresh: "#FFDB1E",
        "fresh-dark": "#401C00",

        runtime: {
          "50": "#f0fff1",
          "100": "#d6ffe1",
          "200": "#b3ffcd",
          "300": "#70ffae",
          DEFAULT: "70ffae",
          "400": "#32f59a",
          "500": "#09dc8b",
          "600": "#01b780",
          "700": "#058f71",
          "800": "#0a7163",
          "900": "#0a5c5b",
          "950": "#003033",
        },

        deploy: {
          "50": "#effaff",
          "100": "#def4ff",
          "200": "#b6ecff",
          "300": "#75e0ff",
          "400": "#2cd1ff",
          "500": "#01c2ff",
          DEFAULT: "#01c2ff",
          "600": "#0097d4",
          "700": "#0078ab",
          "800": "#00658d",
          "900": "#065474",
          "950": "#04354d",
        },

        gray: {
          "000": "#e3e5e9",
          "00": "#cfd1d6",
          0: "#9EA0A5",
          1: "#868789",
          2: "#56575A",
          3: "#25272B",
          4: "#191B1F",
          5: "#14161A",
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
