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

  // resolve takes an object `obj` and a hierarchical `path`, where successive keys are separated by
  // dots. If a key contains itself a dot, it must be preceded by a backslash.
  function resolve(path: string | string[], obj = self, separator = /(?<!\\)\./g) {
    let props: string[] = Array.isArray(path) ? path : path.split(separator)

    props = props.map((p) => p.replace('\\.', '.'))

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

  function translateWithDict(path: string, params: any = undefined, dictionnary: any) {
    const locDict = dictionnary[lang.value]
    let translated = (resolve(path, locDict) || path) as unknown as string
    if (params) {
      translated = ti(translated, params)
    }
    return translated
  }
  function t(path: string, params: any = undefined) {
    return translateWithDict(path, params, dict)
  }
  function to(path: string, params: any = undefined) {
    return translateWithDict(path, params, dictOperators)
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
