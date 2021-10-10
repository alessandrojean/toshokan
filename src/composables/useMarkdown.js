import md from 'markdown-it'
import mdAbbr from 'markdown-it-abbr'

export default function useMarkdown () {
  const markdown = md()
    .use(mdAbbr)
    .disable([
      'table',
      'code',
      'fence',
      'blockquote',
      'hr',
      'reference',
      'html_block',
      // 'heading',
      'lheading',
      'image'
    ])

  function renderMarkdown (source) {
    return markdown.render(source)
  }

  return { markdown, renderMarkdown }
}
