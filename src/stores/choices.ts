import { ref } from 'vue'
import { defineStore } from 'pinia'

export const choicesStore = defineStore('choices', () => {
  
  // internationalization
  const dict: any = {
    fr: {
      next: 'Suivant',
      send: 'Envoyer',
      modify: 'modifier',
      licence: 'Ce widget et son code source sont sous licence',
      form: {
        mandatory: "Champs obligatoires",
      },
      results: {
        alertTitle: "Merci, voici vos résultats",
        alertTitleNoResult: "Pas de résultats",
        alertNoResult: "Désolé, nous n'avons pas trouvé d'aides correspondant à vos choix",
        alertDescription: "Vous pouvez également nous envoyer un mail via le formulaire ci-après pour être mis en contact avec des conseillers",
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
