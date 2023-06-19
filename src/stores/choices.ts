import { ref } from 'vue'
import { defineStore } from 'pinia'

import { frDict } from '@/translations/fr'

export const choicesStore = defineStore('choices', () => {
  
  const publicPath = ref<string>()

  // internationalization
  const dict: any = {
    fr: frDict
  }

  // language selection
  const lang = ref('fr')

  // actions
  function setPublicPath(path: string) {
    publicPath.value = path
  }
  function setLocale(loc: string) {
    lang.value = loc
  }

  function resolve(path: string, obj=self, separator='.') {
    const props = Array.isArray(path) ? path : path.split(separator)
    // @ts-ignore
    return props.reduce((prev, curr) => prev?.[curr], obj)
  }

  function t (path: string) {
    const locDict = dict[lang.value]
    return resolve(path, locDict)
  }

  return {
    publicPath,
    dict,
    lang,
    setPublicPath,
    setLocale,
    t,
  }
})
