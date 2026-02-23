export class Scroll {
  private static readonly _defaultOptions: ScrollOptions = { behavior: 'smooth' }

  static toWithEligibilityBarOffset(element: HTMLElement) {
    const topBar = document.getElementById('eligibility-bar')
    if (topBar) {
      const top = element.getBoundingClientRect().top + window.scrollY - topBar.offsetHeight
      window.scrollTo({ top: top, ...this._defaultOptions })
    } else {
      this.to(element)
    }
  }

  static to(element: Element, behaviorSmooth = true) {
    const scrollOptions: ScrollOptions = {}
    if (!behaviorSmooth) {
      scrollOptions.behavior = 'instant'
    }
    element.scrollIntoView({ ...this._defaultOptions, ...scrollOptions })
  }

  static toBlockCenter(element: HTMLElement) {
    const docHeight = document.documentElement.clientHeight
    const { offsetTop, clientHeight } = element
    window.scrollTo({ top: offsetTop + clientHeight / 2 - docHeight / 2 })
  }

  static async toHashWithRetries(hash: string) {
    const cleanHash = hash.replace('#', '')
    if (!cleanHash) {
      return
    }

    const maxTries = 5
    for (let tries = 0; tries < maxTries; tries++) {
      const el = document.getElementById(cleanHash)
      if (el) {
        Scroll.to(el, false)
      } else if (tries++ < maxTries) {
        await nextTick()
        await new Promise((r) => setTimeout(r, 50))
      }
    }
  }
}
