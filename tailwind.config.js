/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        "fcs-red": "#800000",
        "fcs-green": "#B6D250",
        "fcs-red-lighter": "#A52A2A",
        "fcs-red-lightest": "#FFE4E1",
        "fcs-bg": "#F7F7F7",
      },
      fontFamily: {
        // sans: ['Nippo', 'sans-serif'],
        sans: ["Times", "Times New Roman", "sans-serif"],
        serif: ["EB Garamond", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
