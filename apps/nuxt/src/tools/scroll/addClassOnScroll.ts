export default class AddClassOnScroll {
  constructor(
    private _stickyElement?: HTMLElement,
    private _offsetElement?: HTMLElement | null,
    private _className = 'fr-sticky'
  ) {}

  addEventListenerOnScroll(): void {
    window.addEventListener('scroll', this.handleScroll)
  }

  removeEventListenerOnScroll(): void {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = (): void => {
    if (this._stickyElement && this._offsetElement) {
      if (window.scrollY >= this._offsetElement.offsetTop) {
        this._stickyElement.classList.add(this._className)
      } else {
        this._stickyElement.classList.remove(this._className)
      }
    }
  }
}
