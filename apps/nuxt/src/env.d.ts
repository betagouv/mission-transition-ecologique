/// <reference types="vite/client" />
export interface ImportMetaEnv {
  readonly [key: string]: boolean | string | number
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_MATOMO_ENABLE: string
  readonly SENTRY_CLIENT_DSN: string | undefined
  readonly SENTRY_SERVER_DSN: string | undefined
  readonly SENTRY_AUTH_TOKEN: string | undefined
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  readonly POSTHOG_API_KEY: string
  readonly VITE_DATA_TEST: string
  // more env variables...
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}

export interface PosthogType {
  capture: (event: string, properties?: Record<string, any>) => void
}
declare global {
  interface Window {
    posthog: PosthogType
  }
}
