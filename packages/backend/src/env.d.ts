declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      readonly [key: string]: string | undefined
      SENTRY_DSN: string | undefined
      SENTRY_ENVIRONMENT: string
      // more env variables...
    }
  }
}

export {}
