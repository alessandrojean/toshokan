import type { InjectionKey, Ref } from 'vue'

/**
 * Application
 */

export type ChangeTitle = (title?: string) => void

export const ChangeTitleKey: InjectionKey<ChangeTitle> = Symbol('changeTitle')

/**
 * Dashboard
 */

export type ShowAsideDialog = () => void
export type ShowSearchDialog = (query?: string) => void
export type ShowSettingsDialog = (delay?: number) => void
export type DisableSearchShortcut = () => void
export type EnableSearchShortcut = () => void
export type SetNavbarTransparent = (value: boolean) => void

export const ShowAsideDialogKey: InjectionKey<ShowAsideDialog> =
  Symbol('showAsideDialog')

export const ShowSearchDialogKey: InjectionKey<ShowSearchDialog> =
  Symbol('showSearchDialog')

export const ShowSettingsDialogKey: InjectionKey<ShowSettingsDialog> =
  Symbol('showSettingsDialog')

export const DisableSearchShortcutKey: InjectionKey<DisableSearchShortcut> =
  Symbol('disableSearchShortcut')

export const EnableSearchShortcutKey: InjectionKey<EnableSearchShortcut> =
  Symbol('enableSearchShortcut')

export const SetNavbarTransparentKey: InjectionKey<SetNavbarTransparent> =
  Symbol('setNavbarTransparent')

/**
 * Help
 */

export type RebuildPageContents = (resetPosition?: boolean) => void
export type DocumentationPage = {
  order: number
  slug: string
  locale: string
  title: string
  content: () => Promise<string>
}
export type DocumentationCategory = {
  order: number
  category: string
  pages: DocumentationPage[]
}
export type Documentation = DocumentationCategory[]

export const RebuildPageContentsKey: InjectionKey<RebuildPageContents> = Symbol(
  'rebuildPageContents'
)

export const DocumentationKey: InjectionKey<Documentation> =
  Symbol('documentation')
