const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      ...defaultTheme.colors,
      primary: colors.indigo,
      secondary: colors.emerald,
      gray: {
        ...defaultTheme.colors.gray,
        850: '#17202D'
      }
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      display: ['Poppins', ...defaultTheme.fontFamily.sans]
    },
    extend: {
      boxShadow: {
        avatar: 'inset 0 0px 4px 0 rgba(0, 0, 0, 0.25)',
        top: '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      height: {
        's-40': '40vh',
        's-50': '50vh',
        's-60': '60vh'
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: theme('fontFamily.display').join(', ')
            },
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.800')
              },
              '&:focus': {
                outline: `2px solid ${theme('colors.primary.600')}`
              }
            }
          }
        },
        'dark': {
          css: {
            color: theme('colors.gray.300'),
            'strong, h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.200')
            },
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300')
              },
              '&:focus': {
                outline: `2px solid ${theme('colors.primary.500')}`
              }
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.400')
            }
          }
        }
      })
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
      backgroundColor: ['even', 'odd', 'active', 'focus-visible', 'disabled'],
      backgroundImage: ['dark'],
      blur: ['hover', 'group-hover', 'dark'],
      borderColor: ['active', 'focus-visible', 'group-focus-within', 'disabled'],
      borderRadius: ['dark'],
      borderWidth: ['focus', 'dark'],
      boxShadow: ['dark'],
      cursor: ['disabled'],
      display: ['group-focus-within'],
      fontWeight: ['dark'],
      invert: ['dark'],
      margin: ['dark'],
      opacity: ['focus-visible', 'focus-within', 'group-focus', 'disabled', 'dark'],
      outline: ['focus-visible'],
      padding: ['dark'],
      placeholderColor: ['hover'],
      ringColor: ['group-focus-visible', 'focus-visible'],
      ringOffsetColor: ['group-focus-visible', 'focus-visible', 'dark'],
      ringOffsetWidth: ['group-focus-visible', 'focus-visible'],
      ringOpacity: ['focus-visible'],
      ringWidth: ['group-focus-visible', 'focus-visible', 'active'],
      textColor: ['disabled', 'focus-visible', 'group-focus-within', 'group-focus-visible', 'group-disabled'],
      transform: ['motion-reduce'],
      transitionProperty: ['motion-safe', 'motion-reduce'],
      typography: ['dark'],
      userSelect: ['hover'],
      zIndex: ['focus-visible']
    }
  },
  plugins: [
    require('tailwindcss-interaction-variants'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
}
