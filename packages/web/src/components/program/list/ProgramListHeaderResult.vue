<template>
  <div class="fr-grid-row">
    <div class="fr-col-12">
      <h3
        class="fr-mb-2v"
        style="color: #000091; font-size: 2.75rem"
      >
        {{ label }}
      </h3>
    </div>
    <div class="fr-mt-5v fr-col-12">
      <p
        class="fr-mb-0"
        style="color: #000091"
      >
        {{ hint }}
      </p>
    </div>
    <div class="fr-mt-5v fr-col-12">
      <p>
        {{ injectValuesInString(resume) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import {
  TrackId //
} from '@/types'
import Translation from '@/utils/translation'

const trackStore = useTrackStore()
const usedTrackStore = useUsedTrackStore()

const trackResult = trackStore.getTrack(TrackId.Results)

const label: string = trackResult?.label?.[Translation.lang] || 'Vos résultats'

const hint: string = trackResult?.hint?.[Translation.lang] || '🎉 Félicitations, vous avez terminé !'

const resume: string =
  trackResult?.resume?.[Translation.lang] ||
  "D’après les informations que vous avez renseignées, voici les accompagnements dont vous pouvez bénéficier pour diminuer l'empreinte écologique de votre entreprise."

const injectValuesInString = (str: string) => {
  const userValues = usedTrackStore.usedTracksValuesPairs
  const regex = /\{.+?\}/g
  const matches = str.match(regex) || []
  const params: Record<string, string> = {}
  if (matches.length) {
    matches.forEach((s: string) => {
      const key: string = s.replace('{', '').replace('}', '')
      const usedTrack = userValues.find((i) => i.currentId === key)
      params[key] = usedTrack?.selection?.toString() || '' // .value.toString()
    })
  }
  return Translation.ti(str, params)
}
</script>
