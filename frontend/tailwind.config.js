const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#4f39f6",
          light: "#e0e7ff",
        },
        secondary: {
          dark: "#101828",
          light: "#6a7282",
        },
      },
    },
  },
  darkMode: "class",
};
