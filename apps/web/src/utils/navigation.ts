// CONSOLE LOG TEMPLATE
// console.log(`utils.navigation > FUNCTION_NAME > MSG_OR_VALUE :`)
import { useNavigationStore } from '@/stores/navigation'
export default class Navigation {
  static hashByRouteName = (routeName: string) => {
    return `#${routeName}`
  }
  static toggleRegisterModal = (forceStatus?: boolean) => {
    const navigationStore = useNavigationStore()
    navigationStore.hasRegisterModal = forceStatus || !navigationStore.hasRegisterModal
    document.body.style.overflow = navigationStore.hasRegisterModal ? 'hidden' : ''
    const header = document.getElementById('tee-header')
    if (header) {
      const headerHeight = header.offsetHeight + 'px'
      document.documentElement.style.setProperty('--header-height', headerHeight)
    }
    if (navigationStore.hasRegisterModal) {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      })
    }
  }
}
