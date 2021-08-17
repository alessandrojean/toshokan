import md from 'markdown-it'

export default function useMarkdown () {
  const markdown = md()
    .disable([
      'table',
      'code',
      'fence',
      'blockquote',
      'hr',
      'list',
      'reference',
      'html_block',
      'heading',
      'lheading',
      'image'
    ])

  function renderMarkdown (source) {
    return markdown.render(source)
  }

  return { markdown, renderMarkdown }
}
