import type { TrackId } from '@/types/track/trackId'

export type UrlParam = { name: TrackId; value?: string | string[] | null }

export enum CookieValue {
  Posthog = 'posthog'
}

export type CookieManager = { name: string; value: string; accepted: boolean }
