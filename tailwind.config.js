/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}", // entry point
    "./app/**/*.{js,jsx,ts,tsx}", // if you're using app directory
    "./src/**/*.{js,jsx,ts,tsx}", // for src-based structure
    "./components/**/*.{js,jsx,ts,tsx}", // root-level folders
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1B1730",
        secondary: "#262438",
        orange: "#FE744D",
      },
    },
  },
  plugins: [],
};
