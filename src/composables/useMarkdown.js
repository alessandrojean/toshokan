import dedent from 'dedent'
import md from 'markdown-it'
import mdAbbr from 'markdown-it-abbr'

function youtube (md) {
  const defaultRenderer = md.renderer.rules.image
  const youtubeRegex = /^https?:\/\/(www\.)?youtu\.?be(\.com)?\/(watch|embed)?(\?v=|\/)?([^$\/\n]+)/

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const aIndex = token.attrIndex('src')

    if (youtubeRegex.test(token.attrs[aIndex][1])) {
      const id = token.attrs[aIndex][1].match(youtubeRegex)[5]

      return dedent`
        <figure>
          <div class="aspect-w-16 aspect-h-9">
            <iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
          </div>
          ${token.content && token.content.length ? '<figcaption>' + token.content + '</figcaption>' : ''}
        </figure>
      `
    }

    return defaultRenderer(tokens, idx, options, env, self)
  }
}

export default function useMarkdown (options = {}) {
  let markdown = md()
    .use(mdAbbr)

  if (options.youtube) {
    markdown = markdown.use(youtube)
  }

  markdown = markdown.disable([
    'table',
    'code',
    'fence',
    'blockquote',
    'hr',
    'reference',
    'html_block',
    // 'heading',
    'lheading'
  ])

  function renderMarkdown (source) {
    return markdown.render(source)
  }

  return { markdown, renderMarkdown }
}
