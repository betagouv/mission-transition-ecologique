import { type CookieManager, CookieValue, Cookies } from '@/types/cookies'
import { useNavigationStore } from '@/stores/navigation'
import { app } from '../main'
import posthogPlugin from '../plugin/posthog'

export default class Cookie {
  static getCookieByValue(value: CookieValue): CookieManager | undefined {
    return useNavigationStore().cookies[value]
  }

  static activateCookie(value: CookieValue) {
    if (value === CookieValue.Posthog) {
      posthogPlugin.activatePosthogCookie(app)
    }
  }
  static deactivateCookie(value: CookieValue) {
    if (value === CookieValue.Posthog) {
      posthogPlugin.deactivatePosthogCookie(app)
    }
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
        accepted: cookiesStatus[CookieValue.Posthog] || false,
        description:
          "Ces cookies fournissent des informations statistiques sur notre site. Ils permettent de mesurer l'audience et les performances du site de manière anonyme afin d'en améliorer le fonctionnement. "
      }
    }
  }

  static saveCookies(cookies: Cookies) {
    Object.values(cookies).forEach((cookie: CookieManager) => {
      document.cookie = `${cookie.value}=${cookie.accepted}`
      if (cookie.accepted) {
        Cookie.activateCookie(cookie.value)
      } else {
        Cookie.deactivateCookie(cookie.value)
      }
    })
    document.cookie = 'tee-accept-cookies=true'
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
  static areCookiesSet() {
    const match = document.cookie.match(new RegExp('(^| )tee-accept-cookies=([^;]+)'))
    const cookieValue = match && match[2]
    return cookieValue === 'true' || false
  }
}
