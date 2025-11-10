/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  purge:['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        actionColor: 'var(--color-primary)',
        actionColorHover: 'var(--action-color-hover)',
      }
    },
  },
  plugins: [],
}

