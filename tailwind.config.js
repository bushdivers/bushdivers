// const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./resources/**/*.jsx', './resources/**/*.css'],
  // darkMode: 'class',
  // theme: {
  //   colors: {
  //     transparent: 'transparent',
  //     white: colors.white,
  //     gray: colors.gray,
  //     red: colors.red,
  //     blue: colors.sky,
  //     green: colors.emerald,
  //     yellow: colors.yellow,
  //     orange: colors.orange
  //   },
  //   extend: {}
  // },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#f97316',
          secondary: '#4b5563',
          accent: '#0ea5e9',
          neutral: '#fff',
          'primary-content': '#1f2937',
          'base-content': '#1f2937',
          'neutral-content': '#1f2937',
          'base-100': '#f3f4f6',
          'secondary-content': '#f3f4f6',
          info: '#40bcd8',
          success: '#4ade80',
          warning: '#facc15',
          error: '#f87171'
        },
        dark: {
          primary: '#f97316',
          secondary: '#4b5563',
          accent: '#0ea5e9',
          neutral: '#1f2937',
          'primary-content': '#e5e7eb',
          'neutral-content': '#e5e7eb',
          'base-content': '#e5e7eb',
          'base-100': '#111827',
          info: '#40bcd8',
          success: '#4ade80',
          warning: '#facc15',
          error: '#f87171'
        }
      }
    ]
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('daisyui')
  ]
}
