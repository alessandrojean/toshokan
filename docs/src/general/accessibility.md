# Accessibility

This site has some accessibility features.

## Jump to the content

All pages have a internal link to jump to the main content.
It can be used by users browsing with only the keyboard
or by users that depend on a screenreader. Follow the link
to get the focus directly in the page main content.

## Jump to the navigation

In pages such as Dashboard, you will also find a internal
link to jump directly to the main navigation.

## Menus

The menus utilized in this website are from the Headless UI library,
and they follow all the WAI-ARIA patterns for menu components.
The keyboard shortcuts can be found in the table below.

| Command                 | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| [[Enter]] or [[Space]]  | Opens menu and focuses first non-disabled item.              |
| [[▲]] or [[▼]]          | Opens menu and focuses first/last non-disabled itemm.        |
| [[Esc]]                 | Close any open menus.                                        |
| [[▼]] or [[▲]]          | When opened, focuses previous/next non-disabled item.        |
| [[Home]] or [[End]]     | When opened, focuses first/last non-disabled item.           |
| [[Enter]] or [[Space]]  | When opened, activates/clicks the current menu item.         |
| [[A-Z]] or [[a-z]]      | When opened, focuses first item that matches keyboard input. |

## Navigation

This website load dinamically its content. When the page is
changed, the screenreader will be updated by a modification
of a control element.

## Animations

This website follow the Operating System setting, if available,
to disable non-essential animations. You can find this setting
at the Accessibility section of your computer or device.

## Keyboard input

This website supports the navigation with keyboard only. The navigation
tries to implement the good practices and commands normally used.
The commands are available in the tables below.

### Simple commands

All HTML5 components supports these commands.

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| [[Tab]]                 | Jump to the next focusable component.     |
| [[Shift]] + [[Tab]]     | Jump to the previous focusable component. |
| [[Enter]] or [[Space]]  | Activates/clicks the focused component.   |

### Selectable components commands

Selectable components includes the group and book grid, the book table
in the library and the carousels in the *dashboard*.

| Command                                     | Description                                         |
| ------------------------------------------- | --------------------------------------------------- |
| [[▼]] or [[▲]]                              | Focuses the item above/below.                       |
| [[►]] or [[◄]]                              | Advance/go back one item.                           |
| [[Home]] or [[End]]                         | Jump to the first/last item.                        |
| [[Shift]] + [[▼]] or [[Shift]] + [[▲]]      | Increase the selection in the bottom/top direction. |
| [[Shift]] + [[End]] or [[Shift]] + [[Home]] | Increase the selection to the last/first.           |
| [[Ctrl]] + [[▼]] or [[Ctrl]] + [[▲]]        | Move the cursor to the item above/below.            |
| [[Ctrl]] + [[End]] or [[Ctrl]] + [[Home]]   | Move the cursor to the last/first item.             |
| [[Ctrl]] + [[A]]                            | Select/unselect all items.                          |
| [[Ctrl]] + [[K]]                            | Open the dashboard book search.                     |

In macOS, use [[Command]] instead of [[Ctrl]].

## Issues during access

If you find some issue during the access or some wrong implementation
of an accessibility feature, please report it at the [repository
on GitHub].

[repository on GitHub]: https://github.com/alessandrojean/toshokan/issues/new/choose
