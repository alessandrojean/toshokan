const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      title: ['Poppins', ...defaultTheme.fontFamily.sans]
    },
    extend: {
      boxShadow: {
        top: '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    }
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
      animation: ['motion-safe'],
      backgroundColor: ['even', 'odd', 'active', 'disabled'],
      backgroundImage: ['dark'],
      borderColor: ['disabled'],
      borderWidth: ['dark'],
      boxShadow: ['dark'],
      cursor: ['disabled'],
      display: ['group-focus-within'],
      invert: ['dark'],
      margin: ['dark'],
      opacity: ['disabled', 'dark'],
      outline: ['focus-visible'],
      padding: ['dark'],
      placeholderColor: ['hover'],
      ringColor: ['group-focus-visible', 'focus-visible'],
      ringOffsetColor: ['group-focus-visible', 'focus-visible', 'dark'],
      ringOffsetWidth: ['group-focus-visible', 'focus-visible'],
      ringWidth: ['group-focus-visible', 'focus-visible', 'active'],
      textColor: ['group-focus-within', 'group-disabled'],
      transform: ['motion-reduce'],
      transitionProperty: ['motion-safe', 'motion-reduce'],
      zIndex: ['focus-visible']
    }
  },
  plugins: [
    require('tailwindcss-interaction-variants'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
}
