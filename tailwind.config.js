// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* Royal editorial tokens (driven by CSS vars in globals.css) */
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        "surface-1": "var(--surface-1)",
        "surface-2": "var(--surface-2)",

        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",

        hairline: "var(--hairline)",
        "hairline-2": "var(--hairline-2)",

        gold: {
          1: "var(--gold-1)",
          2: "var(--gold-2)",
          3: "var(--gold-3)",
        },
      },

      /* Premium readability defaults */
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
      },

      letterSpacing: {
        royal: "0.22em",
        "royal-2": "0.28em",
      },

      boxShadow: {
        "royal-soft": "0 30px 90px rgba(11,12,16,0.10)",
        "royal-card": "0 54px 190px rgba(0,0,0,0.22)",
      },

      borderRadius: {
        "royal-2xl": "28px",
        "royal-3xl": "36px",
      },
    },
  },
  plugins: [],
};
