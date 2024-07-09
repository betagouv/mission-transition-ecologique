import Widget from '@/utils/widget'

export class Scroll {
  private static readonly _defaultOptions: ScrollOptions = { behavior: 'smooth' }

  static toWithTopBarOffset(element: HTMLElement) {
    const topBar = document.getElementById('eligibility-criteria-bar')
    if (topBar) {
      const top = element.getBoundingClientRect().top + window.scrollY - topBar.offsetHeight
      window.scrollTo({ top: top, ...this._defaultOptions })
    }
  }

  static to(element: Element) {
    if (!Widget.is) {
      element.scrollIntoView()
    } else {
      setTimeout(() => {
        element.scrollIntoView({ ...this._defaultOptions })
      }, 100)
    }
  }

  static toBlockCenter(element: HTMLElement) {
    if (!Widget.is) {
      setTimeout(() => {
        const docHeight = document.documentElement.clientHeight
        const { offsetTop, clientHeight } = element
        window.scrollTo({ top: offsetTop + clientHeight / 2 - docHeight / 2 })
      }, 100)
    } else {
      setTimeout(() => {
        element.scrollIntoView({ ...this._defaultOptions, block: 'center' })
      }, 100)
    }
  }
}
