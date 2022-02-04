import dedent from 'dedent'
import md from 'markdown-it'
import mdAbbr from 'markdown-it-abbr'
import mdAnchor from 'markdown-it-anchor'
import mdDefList from 'markdown-it-deflist'
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

      return dedent`
        <figure>
          <div class="aspect-w-16 aspect-h-9 bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden shadow-lg">
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
          ${token.content?.length ? '<figcaption>' + token.content + '</figcaption>' : ''}
        </figure>
      `
    }

    return defaultRenderer(tokens, idx, options, env, self)
  }
}

function imageLazyLoad (md) {
  const defaultRenderer = md.renderer.rules.image

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    token.attrSet('loading', 'lazy')

    return defaultRenderer(tokens, idx, options, env, self)
  }
}

export default function useMarkdown (options = {}) {
  const { t } = useI18n()

  let markdown = md(options.mdOptions || {})
    .use(mdAbbr)
    .use(mdDefList)
    .use(mdAnchor, { slugify: s => slugify(s, { lower: true }) })
    .use(mdToc, {
      slugify: s => slugify(s, { lower: true }),
      listType: 'ol',
      containerHeaderHtml: `<h2>${t('about.summary')}</h2>`
    })
    .use(imageLazyLoad)

  if (options.youtube) {
    markdown = markdown.use(youtube)
  }

  markdown = markdown.disable([
    'table',
    'code',
    'fence',
    'hr',
    'reference',
    'html_block',
    'lheading'
  ])

  function renderMarkdown (source) {
    return markdown.render(source)
  }

  return { markdown, renderMarkdown }
}
