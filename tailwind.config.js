const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      title: ['Poppins', ...defaultTheme.fontFamily.sans]
    },
    extend: {}
  },
  variantOrder: [
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'group-hover',
    'group-focus',
    'focus-within',
    'hover',
    'focus',
    'focus-visible',
    'active',
    'group-disabled', // Custom variant
    'disabled'
  ],
  variants: {
    extend: {
      backgroundColor: ['even', 'odd', 'active', 'disabled'],
      borderColor: ['disabled'],
      borderWidth: ['dark'],
      cursor: ['disabled'],
      display: ['group-focus-within'],
      invert: ['dark'],
      opacity: ['disabled', 'dark'],
      outline: ['focus-visible'],
      placeholderColor: ['hover'],
      ringColor: ['group-focus-visible', 'focus-visible'],
      ringOffsetColor: ['group-focus-visible', 'focus-visible', 'dark'],
      ringOffsetWidth: ['group-focus-visible', 'focus-visible'],
      ringWidth: ['group-focus-visible', 'focus-visible', 'active'],
      textColor: ['group-focus-within', 'group-disabled'],
      zIndex: ['focus-visible']
    }
  },
  plugins: [
    require('tailwindcss-interaction-variants'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
}
