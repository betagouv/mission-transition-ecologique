<template>
  <div>

    <!-- PROGRAM INFOS -->
    <div
      v-show="true" 
      class="fr-grid-row fr-grid-row--gutters fr-mb-5v">
      <!-- PROGRAM PROVIDERS -->
      <div
        v-if="program.program_providers" 
        class="fr-col-3">
        <TeeTile
          :title="choices.t('program.programProviders')">
          <template #description>
            <ul style="list-style-type: none; margin: 0 ; padding: 0;">
              <li
                v-for="(provider, index) in program.program_providers"
                :key="`provider-${index}-${provider.code || provider}`">
                <a 
                  v-if="provider.href"
                  :href="provider.href">
                  {{ provider.code || provider }}
                </a>
                <span v-else>
                  {{ provider.code || provider }}
                </span>
              </li>
            </ul>
          </template>
        </TeeTile>
      </div>

      <!-- PROGRAM TYPE -->
      <div
        v-if="program.program_type" 
        class="fr-col-3">
        <TeeTile
          :title="choices.t('program.programType')"
          :description="choices.t(`programTypes.${program.program_type}`)"
        />
      </div>

      <!-- PROGRAM GEO ZONES -->
      <div
        v-if="program.geo_zones" 
        class="fr-col-3">
        <TeeTile
          :title="choices.t('program.programGeoZones')"
          :description="'...'"
        />
      </div>

      <!-- PROGRAM START -->
      <div
        v-if="program.date_start" 
        class="fr-col-3">
        <TeeTile
          :title="choices.t('program.programStartDate')"
          :description="'...'"
        />
      </div>

      <!-- PROGRAM END -->
      <div
        v-if="program.date_end" 
        class="fr-col-3">
        <TeeTile
          :title="choices.t('program.programEndDate')"
          :description="'...'"
        />
      </div>
    </div>

    <!-- PROGRAM RESUME -->
    <h6 :style="`color: ${blockColor}`">
      {{ choices.t('program.programResume') }}
    </h6>
    <p
      v-if="program.resume"
      v-html="program.resume">
    </p>

    <!-- PROGRAM DESCRIPTION -->
    <h6 :style="`color: ${blockColor}`">
      {{ choices.t('program.programDescription') }}
    </h6>
    <p 
      v-if="program.description"
      v-html="program.description">
    </p>
  </div>
</template>


<script setup lang="ts">

// @ts-ignore
import type { ProgramData } from '@/types/index'

// @ts-ignore
import TeeTile from './TeeTile.vue'

import { choicesStore } from '../stores/choices'
const choices = choicesStore()

const blockColor= 'var(--text-default-info)'

defineProps<{
  program: ProgramData,
  debug?: boolean,
}>()

</script>