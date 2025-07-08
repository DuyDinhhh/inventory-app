/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/**/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  theme: {
    fontFamily: {
      slab: ['"Roboto Slab"', "serif"],
      inter: ["Inter", "sans-serif"],
    },
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
