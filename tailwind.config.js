const { plugin } = require('twrnc')

module.exports = {
  content: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        'resize-repeat': {
          resizeMode: 'repeat'
        }
      })
    })
  ]
}
