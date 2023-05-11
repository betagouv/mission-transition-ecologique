import { ref } from 'vue'
import { defineStore } from 'pinia'

export const choicesStore = defineStore('choices', () => {
  
  // internationalization
  const dict: any = {
    fr: {
      next: 'Suivant',
      modify: 'modifier',
      results: {
        alertTitle: "Merci, c'est fini",
        alertDescription: "Vous recevrez prochainement un mail d'accusé de réception (si vous avez laissé vos coordonnées)",
        yourResults: 'Vos résultats',
        fittingPrograms: 'Les aides correspondant à vos choix',
      },
    }
  }

  // language selection
  const lang = ref('fr')

  // actions
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
    dict,
    lang,
    setLocale,
    t,
  }
})
