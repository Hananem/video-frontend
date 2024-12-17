/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a010f', // Dark purple as primary color
        secondary: '#e61244', // Vibrant pinkish red as secondary color
        deepPurple: '#170621' // Deep purple for additional styling
      },
    },
  },
  plugins: [],
}

