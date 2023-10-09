import { ref } from 'vue'
import { defineStore } from 'pinia'

import { frDict } from '@/translations/fr'
import { frOperatorsDict } from '@/translations/fr-operators'

export const choicesStore = defineStore('choices', () => {
  
  const publicPath = ref<string>()

  // internationalization
  const dict: any = {
    fr: frDict
  }
  const dictOperators: any = {
    fr: frOperatorsDict
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

  function ti(translation: string, params: any = undefined) {
    let translated = translation
    if (params) {
      for (const key in params) {
        const reg = new RegExp(`{${key}}`, 'g')
        translated = translated.replace(reg, params[key])
      }
    }
    return translated
  }

  function t(path: string, params: any = undefined) {
    const locDict = dict[lang.value]
    let translated = resolve(path, locDict) || path
    if (params) {
      translated = ti(translated, params)
    }
    return translated
  }
  function to(path: string, params: any = undefined) {
    const locDict = dictOperators[lang.value]
    let translated = resolve(path, locDict) || path
    if (params) {
      translated = ti(translated, params)
    }
    return translated
  }

  return {
    publicPath,
    dict,
    lang,
    setPublicPath,
    setLocale,
    t,
    to,
    ti
  }
})
