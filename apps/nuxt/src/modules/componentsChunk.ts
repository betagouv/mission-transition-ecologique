import { defineNuxtModule, useNuxt } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'components-chunk'
  },
  setup() {
    const nuxt = useNuxt()
    let dirs: string[]

    nuxt.hook('components:dirs', (_dirs) => {
      dirs = _dirs.map((d) => (typeof d === 'string' ? d : d.path))
    })

    // Use single components chunk
    nuxt.hook('vite:extendConfig', (config, { isServer }) => {
      if (Array.isArray(config.build.rollupOptions.output) || isServer) {
        return
      }
      config.build.rollupOptions.output.manualChunks = (id) => {
        if (id.includes('components') && dirs.some((dir) => id.includes(dir))) {
          return 'components-chunk'
        }
      }
    })
  }
})
