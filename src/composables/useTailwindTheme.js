import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config.js'

export default function useTailwindTheme() {
  const config = resolveConfig(tailwindConfig)

  const breakpoints = Object.entries(config.theme.screens).map(
    ([screen, minWidth]) => [screen, parseInt(minWidth.replace('px', ''))]
  )

  return { ...config, breakpoints: Object.fromEntries(breakpoints) }
}
