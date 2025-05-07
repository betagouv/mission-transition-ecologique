import path from 'node:path'

import defu from 'defu'

import { addServerPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  maxAge?: number
  cacheDir?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ipx-cache',
    configKey: 'ipxCache',
    compatibility: { nuxt: '^3.x || ^4.x' }
  },

  async setup(opts, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    opts.maxAge ??= 86400 // 1 day
    opts.cacheDir ||= path.join(process.cwd(), '.cache/ipx')

    nuxt.options.image = defu(nuxt.options.image, {
      ipx: opts
    }) as unknown as typeof nuxt.options.image
    nuxt.options.routeRules = <typeof nuxt.options.routeRules>defu(nuxt.options.routeRules, {
      '/_ipx/**': {
        swr: false,
        cache: false,
        headers: {
          'cache-control': `s-maxage=${opts.maxAge}, stale-while-revalidate`
        }
      }
    })

    addServerPlugin(resolve('./runtime/server/plugin.ts'))
  }
})
