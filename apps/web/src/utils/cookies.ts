import { type CookieManager, CookieValue, Cookies } from '@/types/cookies'
import { useNavigationStore } from '@/stores/navigation'

export default class Cookie {
  static getCookieByValue(value: CookieValue): CookieManager | undefined {
    return useNavigationStore().cookies[value]
  }

  static getCookies(): Cookies {
    const cookiesStatus = document.cookie.split(';').reduce<Record<string, boolean>>((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value === 'true'
      return acc
    }, {})
    return {
      [CookieValue.Posthog]: {
        name: "Cookies d'analyse",
        value: CookieValue.Posthog,
        accepted: cookiesStatus[CookieValue.Posthog],
        description:
          "Ces cookies fournissent des informations statistiques sur notre site. Ils permettent de mesurer l'audience et les performances du site de manière anonyme afin d'en améliorer le fonctionnement. "
      }
    }
  }

  static saveCookies(cookies: Cookies) {
    const cookieString = Object.values(cookies)
      .map((cookie: CookieManager) => `${cookie.value}=${cookie.accepted}`)
      .join(';')
    document.cookie = cookieString
    window.location.reload()
  }

  static acceptAllCookies() {
    const cookies: CookieManager[] = Object.values(useNavigationStore().cookies)
    const newCookies: Cookies = cookies.reduce(
      (acc, cookie) => {
        acc[cookie.value] = { ...cookie, accepted: true }
        return acc
      },
      { ...useNavigationStore().cookies }
    )
    Cookie.saveCookies(newCookies)
  }

  static refuseAllCookies() {
    const cookies: CookieManager[] = Object.values(useNavigationStore().cookies)
    const newCookies: Cookies = cookies.reduce(
      (acc, cookie) => {
        acc[cookie.value] = { ...cookie, accepted: false }
        return acc
      },
      { ...useNavigationStore().cookies }
    )
    console.log(newCookies)
    Cookie.saveCookies(newCookies)
  }
  static acceptCookie(cookieValue: CookieValue) {
    useNavigationStore().cookies[cookieValue].accepted = true
    Cookie.saveCookies(useNavigationStore().cookies)
  }
  static refuseCookie(cookieValue: CookieValue) {
    useNavigationStore().cookies[cookieValue].accepted = false
    Cookie.saveCookies(useNavigationStore().cookies)
  }
}
