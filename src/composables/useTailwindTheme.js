import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config.js'

export default function useTailwindTheme () {
  return resolveConfig(tailwindConfig)
}
