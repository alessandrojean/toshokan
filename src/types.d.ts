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
