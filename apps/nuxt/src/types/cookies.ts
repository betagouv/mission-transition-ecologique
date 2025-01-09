export enum CookieValue {
  Posthog = 'posthog'
}

export type CookieManager = { name: string; value: CookieValue; accepted: boolean; description: string }

export type Cookies = {
  [CookieValue.Posthog]: CookieManager
}
