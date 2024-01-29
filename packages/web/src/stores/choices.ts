// CONSOLE LOG TEMPLATE
// console.log(`store.choices > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref } from 'vue'
import { defineStore } from 'pinia'

import { frDict } from '@/translations/fr'
import { frOperatorsDict } from '@/translations/fr-operators'
import type { PropertyPath } from '@/types'

export const choicesStore = defineStore('choices', () => {
  // internationalization
  const dict: object = {
    fr: frDict
  }
  const dictOperators: Record<string, typeof frOperatorsDict> = {
    fr: frOperatorsDict
  }

  // language selection
  const lang = ref('fr')

  // actions
  function setLocale(loc: string) {
    lang.value = loc
  }

  function resolve(path: PropertyPath, obj: object = self, separator = '.') {
    const props: string[] = Array.isArray(path) ? path : path.split(separator)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return props.reduce((prev: string, curr: string) => prev?.[curr] as string | undefined, obj)
  }

  function ti(translation: string, params: Record<string, string | number> | undefined = undefined) {
    let translated = translation
    if (params) {
      for (const key in params) {
        const reg = new RegExp(`{${key}}`, 'g')
        translated = translated.replace(reg, params[key] ? params[key].toString() : '...')
      }
    }
    return translated
  }

  function translateWithDict(
    path: string,
    dictionary: Record<string, unknown>,
    params: Record<string, string | number> | undefined = undefined
  ) {
    const locDict = dictionary[lang.value] as object
    let translated = (resolve(path, locDict) || path) as unknown as string
    if (params) {
      translated = ti(translated, params)
    }
    return translated
  }
  function t(path: string, params: Record<string, string | number> | undefined = undefined) {
    return translateWithDict(path, dict as Record<string, unknown>, params)
  }
  function to(path: string, params: Record<string, string | number> | undefined = undefined) {
    return translateWithDict(path, dictOperators, params)
  }

  return {
    dict,
    lang,
    setLocale,
    t,
    to,
    ti
  }
})
