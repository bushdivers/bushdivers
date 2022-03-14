const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./resources/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      blue: colors.sky,
      green: colors.emerald,
      yellow: colors.yellow,
      orange: colors.orange
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
}
