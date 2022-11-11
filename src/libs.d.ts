declare module 'paginator' {
  class Paginator {
    constructor(per_page: number, length: number)

    build(total_results: number, current_page: number): PaginationInfo
  }

  export type PaginationInfo = {
    total_pages: number
    current_page: number
    first_page: number
    last_page: number
    previous_page: number
    next_page: number
    has_previous_page: boolean
    has_next_page: boolean
    total_results: number
    results: number
    first_result: number
    last_result: number
  }

  export = Paginator
}

declare module '~~/tailwind.config.js' {
  import type { Config } from 'tailwindcss'
  const config: Config
  export default config
}

declare module 'markdown-it-abbr' {
  import type { PluginSimple } from 'markdown-it'
  const abbr: PluginSimple
  export default abbr
}

declare module 'markdown-it-deflist' {
  import type { PluginSimple } from 'markdown-it'
  const deflist: PluginSimple
  export default deflist
}

declare module 'markdown-it-implicit-figures' {
  import type { PluginWithOptions } from 'markdown-it'
  type Options = {
    dataType?: boolean
    figcaption?: boolean
    tabindex?: boolean
    link?: boolean
    copyAttrs?: boolean
  }
  const implicitFigures: PluginWithOptions<Options>
  export default implicitFigures
}

declare module 'markdown-it-table-of-contents' {
  import type md, { PluginWithOptions } from 'markdown-it'
  type Options = {
    dincludeLevel?: number[]
    containerClass?: string
    slugify?: (text: string) => string
    markerPattern?: RegExp
    listType?: 'ul' | 'ol'
    format?: (content: string, md: md) => string
    containerHeaderHtml?: string
    containerFooterHtml?: string
    transformLink?: (link: string) => string
  }
  const tableOfContents: PluginWithOptions<Options>
  export default tableOfContents
}
