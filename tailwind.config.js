module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      colors: {
        fc: {
          green: "#20FC40",
          album: {
            blue: {
              100: "#f1f6ff",
              200: "#e3eeff",
              300: "#d5e5ff",
              400: "#c7ddff",
              500: "#b9d4ff",
              600: "#94aacc",
              700: "#6f7f99",
              800: "#4a5566",
              900: "#252a33",
            },
            red: {
              100: "#ecdee2",
              200: "#dabdc4",
              300: "#c79da7",
              400: "#b57c89",
              500: "#a25b6c",
              600: "#824956",
              700: "#613741",
              800: "#41242b",
              900: "#201216",
            },
            yellow: {
              100: "#f6f1df",
              200: "#ede3be",
              300: "#e4d49e",
              400: "#dbc67d",
              500: "#a25b6c",
              600: "#a8934a",
              700: "#7e6e38",
              800: "#544a25",
              900: "#2a2513",
            },
          },
        },
      },
      fontFamily: {
        serif: ["'Gambetta-Variable'"],
        sans: ["'Rowdies'"],
      },
    },
  },
  plugins: [],
};
