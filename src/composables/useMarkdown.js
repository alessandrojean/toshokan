import dedent from 'dedent'
import md from 'markdown-it'
import mdAbbr from 'markdown-it-abbr'
import mdAnchor from 'markdown-it-anchor'
import mdDefList from 'markdown-it-deflist'
import mdImplicitFigures from 'markdown-it-implicit-figures'
import mdToc from 'markdown-it-table-of-contents'
import slugify from 'slugify'

import { useI18n } from 'vue-i18n'

function youtube (md) {
  const defaultRenderer = md.renderer.rules.image
  const youtubeRegex = /^https?:\/\/(www\.)?youtu\.?be(\.com)?\/(watch|embed|playlist)?(\?(?:v|list)=|\/)?([^$/\n]+)/

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const aIndex = token.attrIndex('src')

    if (youtubeRegex.test(token.attrs[aIndex][1])) {
      const matches = token.attrs[aIndex][1].match(youtubeRegex)
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

function imageLazyLoad (md) {
  const defaultRenderer = md.renderer.rules.image

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const aIndex = tokens[idx].attrIndex('loading')

    if (aIndex < 0) {
      tokens[idx].attrPush(['loading', 'lazy'])
    } else {
      tokens[idx].attrs[aIndex][1] = 'lazy'
    }

    return defaultRenderer(tokens, idx, options, env, self)
  }
}

function externalLinks (md) {
  const defaultRenderer = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const aIndex = tokens[idx].attrIndex('target')
    const hrefIndex = tokens[idx].attrIndex('href')

    if (tokens[idx].attrs[hrefIndex][1][0] !== '#') {
      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank'])
      } else {
        tokens[idx].attrs[aIndex][1] = '_blank'
      }
    }

    return defaultRenderer(tokens, idx, options, env, self)
  }
}

export default function useMarkdown (options = {}) {
  const { t } = useI18n({ useScope: 'global' })

  let markdown = md(options.mdOptions || {})
    .use(mdAbbr)
    .use(mdDefList)
    .use(mdAnchor, {
      permalink: mdAnchor.permalink.linkInsideHeader(),
      slugify: s => slugify(s, { lower: true })
    })
    .use(mdToc, {
      slugify: s => slugify(s, { lower: true }),
      listType: 'ol',
      containerHeaderHtml: `<h2>${t('about.summary')}</h2>`
    })
    .use(imageLazyLoad)
    .use(externalLinks)

  if (options.youtube) {
    markdown = markdown.use(youtube)
  }

  // Add image later to not cause conflicts with YouTube.
  markdown = markdown
    .use(mdImplicitFigures, { figcaption: true })
    .disable([
      'table',
      'code',
      'fence',
      'hr',
      'reference',
      'html_block',
      'lheading',
      ...(options.disable || [])
    ])

  function renderMarkdown (source) {
    return markdown.render(source)
  }

  return { markdown, renderMarkdown, escapeHtml: markdown.utils.escapeHtml }
}
