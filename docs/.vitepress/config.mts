import { defineConfig } from 'vitepress'
import mdDeflist from 'markdown-it-deflist'
import mdImplicitFigures from 'markdown-it-image-figures'
import mdKbd from 'markdown-it-kbd'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: 'Toshokan',
  description: 'Book collection manager using Google Sheets',

  base: '/toshokan/',

  srcDir: './src',
  lastUpdated: true,

  markdown: {
    config: md => {
      md.use(mdImplicitFigures, {
        lazy: true,
        figcaption: 'alt',
      })

      md.use(mdDeflist)
      md.use(mdKbd)
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    pt: {
      label: 'Português',
      lang: 'pt',

      themeConfig: {
        nav: [
          { text: 'Início', link: '/pt/' },
          { text: 'Guias', link: '/pt/guides/instructions' }
        ],

        footer: {
          message: 'Lançado sob a <a href="https://github.com/alessandrojean/toshokan/blob/main/LICENSE" target="_blank">licença MIT</a>.',
          copyright: 'Copyright © 2020-presente <a href="https://alessandrojean.github.io" target="_blank">Alessandro Jean</a>',
        },

        sidebar: [
          {
            text: 'Guias',
            items: [
              { text: 'Instruções', link: '/pt/guides/instructions' },
              { text: 'Pesquisando', link: '/pt/guides/searching' },
              { text: 'Compartilhando', link: '/pt/guides/sharing' },
            ],
          },
          {
            text: 'Geral',
            items: [
              { text: 'Sobre o projeto', link: '/pt/general/about' },
              { text: 'Acessibilidade', link: '/pt/general/accessibility' },
              { text: 'Política de Privacidade', link: '/pt/general/privacy-policy' },
              { text: 'Termos de Uso', link: '/pt/general/terms-of-use' },
            ],
          }
        ],
      },
    }
  },

  head: [
    ['link', {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/toshokan/logo.svg',
    }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/instructions' }
    ],

    footer: {
      message: 'Released under the <a href="https://github.com/alessandrojean/toshokan/blob/main/LICENSE" target="_blank">MIT license</a>.',
      copyright: 'Copyright © 2020-present <a href="https://alessandrojean.github.io" target="_blank">Alessandro Jean</a>',
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          pt: {
            translations: {
              button: {
                buttonText: 'Pesquisar',
                buttonAriaLabel: 'Pesquisar',
              },
              modal: {
                displayDetails: 'Mostrar lista detalhada',
                noResultsText: 'Nenhum resultado encontrado para',
                resetButtonTitle: 'Limpar pesquisa',
                backButtonTitle: 'Fechar pesquisa',
                footer: {
                  selectText: 'para selecionar',
                  navigateText: 'para navegar',
                  navigateDownKeyAriaLabel: 'seta para baixo',
                  navigateUpKeyAriaLabel: 'seta para cima',
                  closeText: 'para fechar',
                  closeKeyAriaLabel: 'esc'
                },
              },
            },
          },
        },
      },
    },

    editLink: {
      pattern: 'https://github.com/alessandrojean/toshokan/edit/main/docs/:path',
    },

    outline: [2, 3],

    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Instructions', link: '/guides/instructions' },
          { text: 'Searching', link: '/guides/searching' },
          { text: 'Sharing', link: '/guides/sharing' },
        ],
      },
      {
        text: 'General',
        items: [
          { text: 'About the project', link: '/general/about' },
          { text: 'Accessibility', link: '/general/accessibility' },
          { text: 'Privacy Policy', link: '/general/privacy-policy' },
          { text: 'Terms of Use', link: '/general/terms-of-use' },
        ],
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alessandrojean/toshokan' }
    ]
  }
})
