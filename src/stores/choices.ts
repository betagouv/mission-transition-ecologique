import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const choicesStore = defineStore('choices', () => {
  
  const lang = ref('fr')

  const userChoices = ref({})

  // computed / getters
  const isActiveChoice = (trackId: string, value: string | number) => {
    return userChoices.value[trackId].includes(value)
  } 

  // methods
  function initiateUserChoice(trackId: string) {
    // console.log('store > choices > initiateUserChoice > trackId : ', trackId)
    userChoices.value[trackId] = []
  }
  function updateUserChoice(trackId: string, value: string | number, remove: boolean) {
    // console.log('\nstore > choices > updateUserChoice > trackId : ', trackId)
    // console.log('store > choices > updateUserChoice > value : ', value)
    // console.log('store > choices > updateUserChoice > remove : ', remove)
    if (!remove && !userChoices.value[trackId].includes(value)) {
      userChoices.value[trackId].push(value)
    }
    if (remove) {
      const newArray = userChoices.value[trackId].filter(i => i !== value)
      userChoices.value[trackId] = newArray
    }
  }

  return {
    lang,
    userChoices,
    initiateUserChoice,
    updateUserChoice,
    isActiveChoice
  }
})
