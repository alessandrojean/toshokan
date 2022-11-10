import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'

import typographyPlugin from '@tailwindcss/typography'
import formsPlugin from '@tailwindcss/forms'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.vue', './src/**/*.js', './src/**/*.ts'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      'sans-var': ['Inter var', ...defaultTheme.fontFamily.sans],
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
        xxs: '.7rem'
      },
      height: {
        's-40': '40vh',
        's-50': '50vh',
        's-60': '60vh'
      },
      spacing: {
        '2px': '2px'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: theme('fontFamily.display').join(', '),
              scrollMargin: theme('scrollMargin.4'),

              '&:focus': {
                outline: 'none'
              }
            },
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: `${theme('colors.primary.800')} !important`
              },
              '&:focus': {
                outline: 'none'
              },
              '&:focus-visible': {
                outline: `2px solid ${theme('colors.primary.600')}`
              }
            },
            figure: {
              maxWidth: '100%',
              textAlign: 'center',
              paddingTop: theme('padding.4'),
              paddingBottom: theme('padding.4'),

              '& > img, & > .video-player': {
                margin: '0 auto',
                borderRadius: theme('borderRadius.lg'),
                boxShadow: theme('boxShadow.lg')
              },

              '& > .video-player': {
                backgroundColor: theme('colors.gray.50'),
                overflow: 'hidden'
              },

              figcaption: {
                textAlign: 'center',
                marginTop: theme('margin.5')
              }
            },
            details: {
              summary: {
                fontFamily: theme('fontFamily.display').join(', '),
                fontWeight: theme('fontWeight.medium'),
                cursor: theme('cursor.pointer'),

                '&::marker': {
                  color: theme('colors.gray.400')
                }
              },

              'summary + *': {
                margin: `${theme('margin.4')} ${theme('margin.2')}`
              },

              '& + details': {
                marginTop: theme('margin.2')
              }
            },
            '.header-anchor': {
              float: 'left',
              marginLeft: '-1.25em',
              opacity: '0',
              paddingRight: '0.25em',
              textDecoration: 'none',

              '&:focus-visible': {
                opacity: '1'
              }
            },
            ':where(h1, h2, h3, h4, h5, h6):hover .header-anchor': {
              opacity: '1'
            },
            'table tbody': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-th-borders)'
            },
            ol: {
              listStyleType: 'decimal'
            }
          }
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            'strong, h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.200')
            },
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: `${theme('colors.primary.300')} !important`
              },
              '&:focus': {
                outline: 'none'
              },
              '&:focus-visible': {
                outline: `2px solid ${theme('colors.primary.500')}`
              }
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.400')
            },
            'details summary': {
              color: theme('colors.gray.200'),

              '&::marker': {
                color: theme('colors.gray.500')
              }
            },
            'figure > .video-player': {
              backgroundColor: theme('colors.gray.800')
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
    typographyPlugin,
    formsPlugin,
    aspectRatioPlugin,
    function ({ addVariant }) {
      addVariant(
        'supports-backdrop-blur',
        '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))'
      )
      addVariant('hocus', ['&:hover', '&:focus-visible'])
      addVariant('not-disabled', '&:not(:disabled)')
      addVariant('group-not-disabled', ':merge(.group):not(:disabled) &')
      addVariant(
        'supports-var-font',
        '@supports (font-variation-settings: normal)'
      )
    },
    function ({ matchUtilities, theme }) {
      matchUtilities(
        { skeleton: (value) => ({ backgroundColor: value }) },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      )
    }
  ]
}
