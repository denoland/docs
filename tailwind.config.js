// tailwind.config.js
/** @type {import('npm:tailwindcss').Config} */
export default {
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

        "primary": "#5673B8",

        runtime: "rgba(112, 255, 175, 1)",
        "runtime-dark": "#172723",
        "runtime-secondary": "#EBFF01",
        "runtime-secondary-dark": "#232711",

        deploy: "#01C2FF",
        "deploy-dark": "#0C212A",

        subhosting: "#FF8A01",
        "subhosting-dark": "#251C11",

        fresh: "#FFDB1E",
        "fresh-dark": "#401C00",

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

      width: {
        74: "18.5rem",
      },
      margin: {
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
      },
    },
  ],
};
