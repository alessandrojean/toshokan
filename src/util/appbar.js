export function bottomNavIsShowing () {
  const bottomNav = document.querySelector('.v-bottom-navigation')

  if (bottomNav) {
    const style = window.getComputedStyle(bottomNav)
    return style.display === 'flex'
  }

  return false
}
