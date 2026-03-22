<template>
  <div class="fr-p-4w naf-selector">
    <p class="fr-label fr-text--bold fr-mb-2w">Filtrer par secteur d'activité (Code NAF)</p>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col-12 fr-col-md-4">
        <div class="fr-select-group">
          <label class="fr-label" for="naf-section">Section</label>
          <select id="naf-section" class="fr-select" v-model="selectedSection" @change="onSectionChange">
            <option value="">-- Priorité globale --</option>
            <option v-for="s in mainSections" :key="s.code" :value="s.code">{{ s.code }} – {{ s.label }}</option>
          </select>
        </div>
      </div>
      <template v-if="selectedSection">
        <div class="fr-col-auto naf-arrow" aria-hidden="true">›</div>
        <div class="fr-col-12 fr-col-md-4">
          <div class="fr-select-group">
            <label class="fr-label" for="naf-division">Division</label>
            <select id="naf-division" class="fr-select" v-model="selectedDivision" @change="onDivisionChange">
              <option value="">-- Toute la section {{ selectedSection }} --</option>
              <option v-for="d in filteredDivisions" :key="d.NIV2" :value="d.NIV2">{{ d.NIV2 }} – {{ d.label_vf }}</option>
            </select>
          </div>
        </div>
      </template>
      <template v-if="selectedDivision">
        <div class="fr-col-auto naf-arrow" aria-hidden="true">›</div>
        <div class="fr-col-12 fr-col-md-4">
          <div class="fr-select-group">
            <label class="fr-label" for="naf-code">Code précis</label>
            <select id="naf-code" class="fr-select" v-model="selectedCode">
              <option value="">-- Toute la division {{ selectedDivision }} --</option>
              <option v-for="c in filteredCodes" :key="c.NIV5" :value="c.NIV5">{{ c.NIV5 }} – {{ c.label_vf }}</option>
            </select>
          </div>
        </div>
      </template>
    </div>
    <p v-if="selectedNaf" class="fr-text--sm fr-mt-2w fr-mb-0">
      Filtre actif :
      <span class="fr-badge fr-badge--sm fr-badge--blue-cumulus">{{ selectedNaf }}</span>
      <span class="fr-ml-1w">{{ selectedNafLabel }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
const { selectedSection, selectedDivision, selectedCode, selectedNaf, selectedNafLabel, mainSections, filteredDivisions, filteredCodes, onSectionChange, onDivisionChange } = useNafSelector()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
watch(selectedNaf, (val) => emit('update:modelValue', val))
</script>

<style scoped>
.naf-selector {
  background-color: #f5f5fe;
  border-radius: 0.25rem;
}
.naf-arrow {
  font-size: 1.5rem;
  color: #6a6af4;
  padding-top: 1.5rem;
}
</style>
