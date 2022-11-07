import type { InjectionKey, Ref } from 'vue'

/**
 * Dashboard
 */

export type ShowSearchDialog = (query?: string) => void
export type ShowSettingsDialog = (delay?: number) => void
export type DisableSearchShortcut = () => void
export type EnableSearchShortcut = () => void
export type SetNavbarTransparent = (value: boolean) => void

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
export type CategoryOrder = Ref<string[]>

export const RebuildPageContentsKey: InjectionKey<RebuildPageContents> = Symbol(
  'rebuildPageContents'
)

export const CategoryOrderKey: InjectionKey<CategoryOrder> =
  Symbol('categoryOrder')
