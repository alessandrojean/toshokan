import dedent from 'dedent'
import md, { type PluginSimple } from 'markdown-it'
import mdAbbr from 'markdown-it-abbr'
import mdAnchor from 'markdown-it-anchor'
import mdDefList from 'markdown-it-deflist'
import mdFrontMatter from 'markdown-it-front-matter'
import mdImplicitFigures from 'markdown-it-implicit-figures'
import mdKbd from 'markdown-it-kbd'
import mdToc from 'markdown-it-table-of-contents'
import slugify from 'slugify'
import YAML from 'yaml'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const youtube: PluginSimple = (md) => {
  const defaultRenderer = md.renderer.rules.image!
  const youtubeRegex
    = /^https?:\/\/(www\.)?youtu\.?be(\.com)?\/(watch|embed|playlist)?(\?(?:v|list)=|\/)?([^$/\n]+)/

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const aIndex = token.attrIndex('src')

    if (youtubeRegex.test(token.attrs![aIndex][1])) {
      const matches = token.attrs![aIndex][1].match(youtubeRegex)!
      const id = matches[5]
      const type = matches[3] === 'playlist' ? 'videoseries?list=' : ''

      const thumbnail = `
        <img
          src="https://img.youtube.com/vi/${id}/maxresdefault.jpg"
          class="w-full h-full !my-0 object-cover blur scale-105 opacity-80"
          aria-hidden="true"
        >
      `

      return dedent`
        <div class="video-player aspect-w-16 aspect-h-9">
          ${matches[3] !== 'playlist' ? thumbnail : ''}
          <iframe
            src="https://www.youtube-nocookie.com/embed/${type}${id}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          >
          </iframe>
        </div>
      `
    }

    return defaultRenderer(tokens, idx, options, env, self)
  }
}

const imageLazyLoad: PluginSimple = (md) => {
  const defaultRenderer = md.renderer.rules.image!

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const aIndex = tokens[idx].attrIndex('loading')

    if (aIndex < 0) {
      tokens[idx].attrPush(['loading', 'lazy'])
    } else {
      tokens[idx].attrs![aIndex][1] = 'lazy'
    }

    return defaultRenderer(tokens, idx, options, env, self)
  }
}

const externalLinks: PluginSimple = (md) => {
  const defaultRenderer
    = md.renderer.rules.link_open
    ?? function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const aIndex = tokens[idx].attrIndex('target')
    const hrefIndex = tokens[idx].attrIndex('href')

    if (tokens[idx].attrs![hrefIndex][1][0] !== '#') {
      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank'])
      } else {
        tokens[idx].attrs![aIndex][1] = '_blank'
      }
    }

    return defaultRenderer(tokens, idx, options, env, self)
  }
}

export interface UseMarkdownOptions {
  disable?: string[]
  mdOptions?: md.Options
  typographer?: boolean
  youtube?: boolean
}

export default function useMarkdown(
  options: UseMarkdownOptions = { typographer: true },
) {
  const { t } = useI18n({ useScope: 'global' })
  const frontmatter = ref<string>()

  let markdown = md(options.mdOptions || {})
    .use(mdAbbr)
    .use(mdDefList)
    .use(mdAnchor, {
      permalink: mdAnchor.permalink.linkInsideHeader(),
      slugify: s => slugify(s, { lower: true, remove: /[*+~.()'"!:@]/g }),
    })
    .use(mdToc, {
      slugify: (s: string) =>
        slugify(s, { lower: true, remove: /[*+~.()'"!:@]/g }),
      listType: 'ol',
      containerHeaderHtml: `<h2>${t('about.summary')}</h2>`,
    })
    .use(mdFrontMatter, (fm) => {
      frontmatter.value = fm
    })
    .use(mdKbd)
    .use(imageLazyLoad)
    .use(externalLinks)

  if (options.youtube) {
    markdown = markdown.use(youtube)
  }

  // Add image later to not cause conflicts with YouTube.
  markdown = markdown
    .use(mdImplicitFigures, { figcaption: true })
    .disable([
      'code',
      'fence',
      'hr',
      'html_block',
      'lheading',
      ...(options.disable ?? []),
    ])

  function renderMarkdown(source: string) {
    return source ? markdown.render(source) : null
  }

  return {
    markdown,
    renderMarkdown,
    escapeHtml: markdown.utils.escapeHtml,
    frontmatter: computed(() =>
      frontmatter.value ? YAML.parse(frontmatter.value) : null,
    ),
  }
}
