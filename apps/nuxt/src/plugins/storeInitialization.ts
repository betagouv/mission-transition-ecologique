import { Pinia, PiniaPluginContext } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia
  pinia.use(({ store }: PiniaPluginContext) => {
    if (store.$id === 'filters') {
      setTimeout(() => {
        if ('initializeStore' in store) {
          store.initializeStore()
        }
      }, 0)
    }
  })
})
