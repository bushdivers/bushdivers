const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./resources/**/*.jsx', './resources/**/*.css'],
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
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
}
