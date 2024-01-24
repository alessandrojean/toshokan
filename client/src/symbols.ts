import type { InjectionKey } from 'vue'

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
export type DisableSearchShortcut = () => void
export type EnableSearchShortcut = () => void
export type SetNavbarTransparent = (value: boolean) => void

export const ShowAsideDialogKey: InjectionKey<ShowAsideDialog>
  = Symbol('showAsideDialog')

export const ShowSearchDialogKey: InjectionKey<ShowSearchDialog>
  = Symbol('showSearchDialog')

export const DisableSearchShortcutKey: InjectionKey<DisableSearchShortcut>
  = Symbol('disableSearchShortcut')

export const EnableSearchShortcutKey: InjectionKey<EnableSearchShortcut>
  = Symbol('enableSearchShortcut')

export const SetNavbarTransparentKey: InjectionKey<SetNavbarTransparent>
  = Symbol('setNavbarTransparent')
