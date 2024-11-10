import { defineNuxtModule } from '@nuxt/kit'
export default defineNuxtModule({
  meta: {
    name: 'sitemap',
    configKey: 'sitemap',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {},
  hooks: {},
  setup(moduleOptions, nuxt) {
    // console.log('======== Sitemap module loaded ========')
    // nuxt.hook('pages:resolved', (pages) => {
    //   console.log('======== Pages extended ========')
    //   pages.forEach((page) => {
    //     console.log(page)
    //     console.log(page.meta?.sitemap)
    //   })
    // })
    // useRouter()
    //   .getRoutes()
    //   .forEach((route) => {
    //     console.log(route.path)
    //   })
  }
})
