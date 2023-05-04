<template>
  <div id="tee-app-ce">
    <!-- <HelloWorld msg="You did it!" /> -->
    <p class="fr-pb-5v">
      <DsfrHeader
        logo-text="ADEME"
        service-title="Transition écologique des entreprises"
        service-description="Vos aides en quelques clics"
      />
    </p>
    <h3 class="red-color">
      {{ msg }}
    </h3>
    <p>
      <!-- <DsfrBreadcrumb
        :links='[{"to":"/lien-1","text":"Lien 1"},{"to":"/lien-2","text":"Lien deux"},{"text":"Lien 3 avec plein de texte et patati et patata"}]'
      /> -->
      <!-- <DsefrLanguageSelector
        id="translate-1"
        current-language="fr"
        :languages='[{"label":"Français","codeIso":"fr"},{"label":"English","codeIso":"en"},{"label":"Deutsch","codeIso":"de"},{"label":"Dutch","codeIso":"nl"}]'
      /> -->
      <!-- <DsfrStpper
        :steps="userChoices.stepsArr"
        :current-step="userChoices.step"
      /> -->
    </p>
    <p>
      <!-- <DsfrButton 
        label="Remove step"
        class="fr-mr-2v"
        icon="ri-subtract-line"
        :disabled="userChoices.step < 2"
        @click="userChoices.changeStep(userChoices.step - 1)"
        />
      <DsfrButton 
        label="Add step"
        class="fr-mr-2v"
        icon="ri-add-line"
        :disabled="userChoices.step > 3"
        @click="userChoices.changeStep(userChoices.step + 1)"
      /> -->
      <!-- <DsfrRadioButton
        model-value="3"
        :options='[{"label":"Valeur 1","value":"1","hint":"Description 1","name":"Choix"},{"label":"Valeur 2","value":"2","disabled":true,"hint":"Description 2","name":"Choix"},{"label":"Valeur 3","value":"3","name":"Choix"}]'
      /> -->
    </p>
    <p class="fr-py-4v">
      <RadioChoices
        :choices="tracks.currentTrackConfig.choices"
      />
    </p>

    <p class="fr-py-5v">
      <h4>
        debug / userChoices :
      </h4>
      <code><pre>{{ tracks.userChoices  }}</pre></code>
    </p>
    <p class="fr-py-5v">
      <h4>
        debug / seed : {{ seed }} / tracks.maxDepth : {{ tracks.maxDepth }} 
      </h4>
      <h4>
        debug / currentTrackConfig :
      </h4>
      <!-- <code><pre>{{ tracks.seedTrack  }}</pre></code> -->
      <code><pre>{{ tracks.currentTrackConfig  }}</pre></code>
      <hr>
      <h4>
        debug programs :
      </h4>
      <code><pre>{{ programsArray  }}</pre></code>
    </p>
  </div>
</template>

<script setup lang="ts">
// cf : https://stackoverflow.com/questions/71163741/vuejs-script-setup-cannot-contain-es-module-exports

import { onBeforeMount } from 'vue'
import { tracksStore } from './stores/tracks'
import { programsStore } from './stores/programs'

import RadioChoices from './components/RadioChoices.vue'

// import HelloWorld from './components/HelloWorld.vue'

interface Props {
  msg?: string,
  seed: string,
  maxDepth?: number
}
const props = defineProps<Props>()

const tracks = tracksStore()
const programsArray = programsStore()

// @ts-ignore
window.stores = { tracks, programsArray }

onBeforeMount(() => {
  console.log('TeeApp > props.seed :', props.seed)
  console.log('TeeApp > props.maxDepth :', props.maxDepth)
  if (props.maxDepth) { tracks.setMaxDepth(props.maxDepth) }
  tracks.setSeedTrack(props.seed)
})

</script>

<style>
  /* .red-color {
    color: teal !important;
  } */
</style>

<style lang="scss">
  @import '~@gouvfr/dsfr/dist/core/core.main.min.css';
  @import '~@gouvfr/dsfr/dist/component/component.main.min.css';
  @import '~@gouvfr/dsfr/dist/utility/utility.main.min.css';
  @import '~@gouvfr/dsfr/dist/scheme/scheme.min.css';
  @import '~@gouvfr/dsfr/dist/utility/icons/icons.min.css';
  @import '~@gouvminint/vue-dsfr/dist/vue-dsfr.css';
</style>
