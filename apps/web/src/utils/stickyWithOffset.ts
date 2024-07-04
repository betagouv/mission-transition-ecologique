export default class StickyWithOffset {
  private readonly class = 'fr-sticky'

  constructor(private stickyElement?: HTMLElement, private offsetElement?: HTMLElement | null) {}

  addEventListenerOnScroll(): void {
    window.addEventListener('scroll', this.handleScroll)
  }

  removeEventListenerOnScroll(): void {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = (): void => {
    if (this.stickyElement && this.offsetElement) {
      if (window.scrollY > this.offsetElement.offsetTop) {
        this.stickyElement.classList.add(this.class)
      } else {
        this.stickyElement.classList.remove('fr-sticky')
      }
    }
  }
}
