import resolveConfig from 'tailwindcss/resolveConfig'
import type { Config } from 'tailwindcss'
import tailwindConfig from '~~/tailwind.config.js'

export type TailwindTheme = Config & {
  breakpoints: Record<string, number>
  fontFamily: (name: string) => string[] | undefined
  color: (name: string, variantion: number | string) => string | undefined
}

export default function useTailwindTheme(): TailwindTheme {
  const config = resolveConfig(tailwindConfig)

  const breakpoints = Object.entries(config.theme!.screens!).map(
    ([screen, minWidth]) => [screen, parseInt(minWidth.replace('px', ''), 10)]
  )

  return {
    ...config,
    breakpoints: Object.fromEntries(breakpoints),
    fontFamily: (name: string): string[] | undefined => {
      const fonts = config.theme!.fontFamily as Record<string, string[]>

      return fonts[name]
    },
    color: (name: string, variantion: number | string): string | undefined => {
      const colors = config.theme!.colors as Record<string, any>
      const variants = colors[name] as Record<string | number, string>

      return variants[variantion]
    }
  }
}
