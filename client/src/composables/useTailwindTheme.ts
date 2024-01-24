import resolveConfig from 'tailwindcss/resolveConfig'
import type { Config } from 'tailwindcss'
import tailwindConfig from '~~/tailwind.config'

export type FontFamily = keyof (typeof tailwindConfig)['theme']['fontFamily']

export type TailwindTheme = Config & {
  breakpoints: Record<string, number>
  fontFamily: (name: FontFamily) => string[] | undefined
  color: (name: string, variation: number | string) => string | undefined
}

export default function useTailwindTheme(): TailwindTheme {
  const config = resolveConfig(tailwindConfig)

  const breakpoints = Object.entries(config.theme!.screens!).map(
    ([screen, minWidth]) => [screen, Number.parseInt(minWidth.replace('px', ''), 10)],
  )

  return {
    ...(config as unknown as Config),
    breakpoints: Object.fromEntries(breakpoints),
    fontFamily: (name: FontFamily): string[] | undefined => {
      const fonts = config.theme!.fontFamily
      const font = fonts[name]

      if (!font) {
        return undefined
      }

      return (Array.isArray(font[0]) ? font[0] : font) as string[]
    },
    color: (name: string, variation: number | string): string | undefined => {
      const colors = config.theme!.colors as Record<string, any>
      const variants = colors[name] as Record<string | number, string>

      return variants[variation]
    },
  }
}
