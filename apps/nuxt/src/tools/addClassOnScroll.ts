export default class AddClassOnScroll {
  constructor(
    private stickyElement?: HTMLElement,
    private offsetElement?: HTMLElement | null,
    private className = 'fr-sticky'
  ) {}

  addEventListenerOnScroll(): void {
    window.addEventListener('scroll', this.handleScroll)
  }

  removeEventListenerOnScroll(): void {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = (): void => {
    if (this.stickyElement && this.offsetElement) {
      if (window.scrollY >= this.offsetElement.offsetTop) {
        this.stickyElement.classList.add(this.className)
      } else {
        this.stickyElement.classList.remove(this.className)
      }
    }
  }
}
