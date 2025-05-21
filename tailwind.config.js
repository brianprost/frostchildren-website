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
        "sister-red": "#800000",
        "sister-green": "#B6D250",
        "sister-red-lighter": "#A52A2A",
        "sister-red-lightest": "#FFE4E1",
        "sister-bg": "#F7F7F7",
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
