<template>
  <div class="fr-container--fluid fr-container--fluid--no-overflow">
    <div class="fr-grid-row fr-justify-center">
      <div class="fr-tee-add-padding fr-mt-10v fr-col-3 fr-col-md-4 fr-col-lg-3 fr-col-xl-2 fr-col-sm-hide">
        <div class="fr-sidemenu fr-sidemenu--sticky-full-height">
          <div class="fr-mb-6v">
            <ProgramFilterByAidType />
          </div>
        </div>
      </div>
      <div class="fr-grid-row--center fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-9 fr-col-xl-8">
        <ProgramList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
