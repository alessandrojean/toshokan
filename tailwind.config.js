const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './index.html',
    './src/**/*.vue',
    './src/**/*.js'
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
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
      colors: {
        primary: colors.indigo,
        secondary: colors.emerald,
        gray: {
          850: '#17202D'
        },
        picpay: '#21c25e',
        current: 'currentColor'
      },
      fontSize: {
        'xxs': '.7rem'
      },
      height: {
        's-40': '40vh',
        's-50': '50vh',
        's-60': '60vh'
      },
      spacing: {
        '2px': '2px'
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
    'disabled'
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
}
