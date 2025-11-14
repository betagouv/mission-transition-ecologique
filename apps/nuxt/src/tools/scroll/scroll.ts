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

  static async toHashWithRetry(hash: string) {
    const cleanHash = hash.replace('#', '')
    if (!cleanHash) {
      return
    }

    await nextTick()

    let tries = 0
    const maxTries = 5

    const tryScroll = async () => {
      const el = document.getElementById(cleanHash)

      if (el) {
        Scroll.to(el, false)
      } else if (tries++ < maxTries) {
        await new Promise((r) => setTimeout(r, 40))
        await nextTick()
        tryScroll()
      }
    }

    tryScroll()
  }

  static async toHashInSequence(hash: string) {
    await Scroll.toHashWithRetry(hash)

    await new Promise((resolve) => setTimeout(resolve, 100))

    await Scroll.toHashWithRetry(hash)
  }
}
