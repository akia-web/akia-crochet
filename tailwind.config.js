/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  purge:['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        actionColor: 'var(--action-color)',
        actionColorHover: 'var(--action-color-hover)',
        bgSite: 'var(--bg-site)',
        bgLightGrey: 'var(--very-light-grey)',
        otherPink: '#CD829F'
      }
    },
  },
  plugins: [],
}

