/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terracotta': {
          main: '#c45d45',
          light: '#e07a63',
          lighter: '#f9d0c7',
        },
        'claybrown': {
          main: '#8b4513',
          light: '#a66643',
          lighter: '#d4b8a7',
        },
        'warmbeige': {
          main: '#d2b48c',
          light: '#e2cba8',
          lighter: '#f5e6d3',
        },
        'bg': {
          main: '#faf8f6',
          light: '#ffffff',
          darker: '#f5f2ef',
        },
      },
    },
  },
  plugins: [],
}
