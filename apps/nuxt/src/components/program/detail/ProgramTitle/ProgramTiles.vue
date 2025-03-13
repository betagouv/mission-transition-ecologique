<template>
  <!-- PROGRAM COST | LOAN | AID -->
  <ul class="fr-raw-list fr-grid-row fr-grid-row--gutters fr-mb-8v">
    <li
      v-if="programCost"
      :class="columnTiles"
    >
      <ProgramTile
        class="tee-no-hover"
        :title="Translation.t('programCosts.cost')"
        image-path="/images/TEE-cout-02.svg"
        :description="`${programCost}`"
      />
    </li>

    <li
      v-if="programAidAmount"
      :class="columnTiles"
    >
      <ProgramTile
        class="tee-no-hover"
        :title="Translation.t('programCosts.aid')"
        image-path="/images/TEE-cout-02.svg"
        :description="`${programAidAmount}`"
      />
    </li>

    <li
      v-if="programTaxAdvantage"
      :class="columnTiles"
    >
      <ProgramTile
        class="tee-no-hover"
        :title="Translation.t('programCosts.taxAdvantage')"
        image-path="/images/TEE-cout-02.svg"
        :description="`${programTaxAdvantage}`"
      />
    </li>

    <li
      v-if="programLoan"
      :class="columnTiles"
    >
      <ProgramTile
        class="tee-no-hover"
        :title="Translation.t('programCosts.loan')"
        image-path="/images/TEE-cout-02.svg"
        :description="`${programLoan}`"
      />
    </li>

    <!-- PROGRAM DURATION -->
    <li
      v-if="programDuration"
      :class="columnTiles"
    >
      <ProgramTile
        class="tee-no-hover"
        :title="Translation.t('program.programDuration')"
        image-path="/images/TEE-duree.svg"
        :description="programDuration"
      />
    </li>
    <li
      v-if="programLoanDuration"
      :class="columnTiles"
    >
      <ProgramTile
        class="tee-no-hover"
        :title="Translation.t('program.programLoanDuration')"
        image-path="/images/TEE-duree.svg"
        :description="programLoanDuration"
      />
    </li>

    <!-- PROGRAM PROVIDERS -->
    <li :class="columnTiles">
      <ProgramTile
        v-if="programProvider"
        class="tee-no-hover"
        :title="Translation.t('program.programProviders')"
        image-path="/images/TEE-porteur.svg"
        :description="Translation.to(programProvider)"
      />
    </li>

    <!-- PROGRAM END VALIDITY -->
    <li :class="columnTiles">
      <ProgramTile
        class="tee-no-hover"
        :title="Translation.t('program.programEndValidity')"
        image-path="/images/TEE-date-fin.svg"
        :description="
          Program.isTemporaryUnavailable(currentProgram)
            ? 'Aide temporairement indisponible'
            : programEndValidity
              ? Translation.t(Translation.t('program.programAvailableUntil'), { date: programEndValidity })
              : Translation.t('program.programAvailable')
        "
      />
    </li>
  </ul>
</template>
<script setup lang="ts">
import ProgramTile from '@/components/program/detail/ProgramTitle/ProgramTile.vue'
import Program from '@/tools/program/program'
import Translation from '@/tools/translation'

const { currentProgram } = storeToRefs(useProgramStore())

const programCost = computed(() => currentProgram.value?.[`coût de l'accompagnement`])
const programAidAmount = computed(() => currentProgram.value?.[`montant du financement`])
const programTaxAdvantage = computed(() => currentProgram.value?.[`montant de l'avantage fiscal`])
const programLoan = computed(() => currentProgram.value?.[`montant du prêt`])
const programDuration = computed(() => currentProgram.value?.[`durée de l'accompagnement`])
const programLoanDuration = computed(() => currentProgram.value?.[`durée du prêt`])
const programProvider = computed(() => currentProgram.value?.['opérateur de contact'])
const programEndValidity = computed(() => currentProgram.value?.[`fin de validité`])

const columnTiles = computed(() => {
  const infoBlocks = [
    !!programCost.value,
    !!programAidAmount.value,
    !!programTaxAdvantage.value,
    !!programLoan.value,
    !!programDuration.value,
    !!programLoanDuration.value,
    true, // shortcut for programValidity block (always exists)
    true // shortcut for programProvider block (always exists)
  ].filter(Boolean)
  const colsSize = Math.round(12 / infoBlocks.length)
  return `fr-col fr-col-xs-12 fr-col-sm-12 fr-col-md-${colsSize} fr-tee-detail-info-tile`
})
</script>
