import { type CookieManager, CookieValue, Cookies } from '@/types/cookies'
import posthogPlugin from './analytic/posthog'

export default class Cookie {
  static cookies = ref<Cookies | undefined>()

  static setCookies() {
    Cookie.cookies.value = Cookie.getCookies()
  }

  static getCookieByValue(value: CookieValue): CookieManager | undefined {
    if (Cookie.cookies.value) {
      return Cookie.cookies.value[value]
    }
  }

  static activateCookie(value: CookieValue) {
    if (value === CookieValue.Posthog) {
      posthogPlugin.activatePosthogCookie()
    }
  }

  static deactivateCookie(value: CookieValue) {
    if (value === CookieValue.Posthog) {
      posthogPlugin.deactivatePosthogCookie()
    }
  }

  static getCookieStatus(key: string): boolean {
    const cookies = document.cookie
    const cookiesArray = cookies.split('; ')

    for (const cookie of cookiesArray) {
      const [cookieKey, cookieValue] = cookie.split('=')
      if (cookieKey === key) {
        return decodeURIComponent(cookieValue).toLowerCase() === 'true'
      }
    }
    return false
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
  static hasCookieChanged(cookie: CookieManager): boolean {
    return !this.areCookiesSet() || this.getCookieStatus(cookie.value) !== cookie.accepted
  }
  static saveCookies(newCookies: Cookies) {
    if (Cookie.cookies.value) {
      Object.values(newCookies).forEach((cookie: CookieManager) => {
        if (this.hasCookieChanged(cookie)) {
          document.cookie = `${cookie.value}=${cookie.accepted}; path=/`
          if (cookie.accepted) {
            Cookie.activateCookie(cookie.value)
          } else {
            Cookie.deactivateCookie(cookie.value)
          }
        }
      })
      document.cookie = 'tee-accept-cookies=true; path=/'
    }
    this.setCookies()
  }

  static acceptAllCookies() {
    if (Cookie.cookies.value) {
      const cookies: CookieManager[] = Object.values(Cookie.cookies.value)
      const newCookies: Cookies = cookies.reduce(
        (acc, cookie) => {
          acc[cookie.value] = { ...cookie, accepted: true }
          return acc
        },
        { ...Cookie.cookies.value }
      )
      Cookie.saveCookies(newCookies)
    }
  }

  static refuseAllCookies() {
    if (Cookie.cookies.value) {
      const cookies: CookieManager[] = Object.values(Cookie.cookies.value)
      const newCookies: Cookies = cookies.reduce(
        (acc, cookie) => {
          acc[cookie.value] = { ...cookie, accepted: false }
          return acc
        },
        { ...Cookie.cookies.value }
      )
      Cookie.saveCookies(newCookies)
    }
  }
  static acceptCookie(cookieValue: CookieValue) {
    if (Cookie.cookies.value) {
      Cookie.cookies.value[cookieValue].accepted = true
      Cookie.saveCookies(Cookie.cookies.value)
    }
  }
  static refuseCookie(cookieValue: CookieValue) {
    if (Cookie.cookies.value) {
      Cookie.cookies.value[cookieValue].accepted = false
      Cookie.saveCookies(Cookie.cookies.value)
    }
  }
  static removeCookie(cookieName: string, startsWith: boolean) {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim()
      const match = startsWith ? name.startsWith(cookieName) : name === cookieName
      if (match) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
      }
    })
  }
  static areCookiesSet() {
    const match = document.cookie.match(new RegExp('(^| )tee-accept-cookies=([^;]+)'))
    const cookieValue = match && match[2]
    return cookieValue === 'true' || false
  }
}
