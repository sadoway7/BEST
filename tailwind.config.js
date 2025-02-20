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
        'primary': {
          main: '#0084FF',
          light: '#3399FF',
          lighter: '#E6F3FF',
        },
        'status': {
          admin: '#0084FF',
          employee: '#6B7280',
          'super-admin': '#0047AB',
          'hr-admin': '#00A3B5',
        },
        'ui': {
          border: '#E5E7EB',
          hover: '#F3F4F6',
          focus: '#E6F3FF',
          text: {
            secondary: '#6B7280',
          },
        },
      },
    },
  },
  plugins: [],
}
