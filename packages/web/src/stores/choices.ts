import { ref } from 'vue'
import { defineStore } from 'pinia'

import { frDict } from '@/translations/fr'
import { frOperatorsDict } from '@/translations/fr-operators'
import type { PropertyPath } from '@/types'

export const choicesStore = defineStore('choices', () => {
  const publicPath = ref<string>()

  // internationalization
  const dict: object = {
    fr: frDict
  }
  const dictOperators: Record<string, string> = {
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

  function resolve(path: PropertyPath, obj: object = self, separator = '.') {
    const props: string[] = Array.isArray(path) ? path : path.split(separator)

    return props.reduce((prev: string, curr: string) => prev?.[curr] as string | undefined, obj)
  }

  function ti(translation: string, params: Record<string, string | number> = undefined) {
    let translated = translation
    if (params) {
      for (const key in params) {
        const reg = new RegExp(`{${key}}`, 'g')
        translated = translated.replace(reg, params[key] ?? '...')
      }
    }
    return translated
  }

  function translateWithDict(path: string, dictionary: object, params: Record<string, string | number> = undefined) {
    const locDict = dictionary[lang.value] as object
    let translated = (resolve(path, locDict) || path) as unknown as string
    if (params) {
      translated = ti(translated, params)
    }
    return translated
  }
  function t(path: string, params: Record<string, string | number> = undefined) {
    return translateWithDict(path, dict, params)
  }
  function to(path: string, params: Record<string, string | number> = undefined) {
    return translateWithDict(path, dictOperators, params)
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
