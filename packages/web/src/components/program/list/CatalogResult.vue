<template>
  <div class="fr-container--fluid fr-container--fluid--no-overflow">
    <div class="fr-grid-row fr-justify-center">
      <div class="fr-mr-5v fr-col-2 fr-col-sm-2 fr-col-md-3 fr-col-lg-2 fr-hidden-xs">
        <div class="fr-sidemenu">
          <div class="fr-text--bold fr-text-left fr-mb-3v">Filtres</div>
          <ProgramFiltersAccordeon />
        </div>
      </div>
      <div class="fr-grid-row--center fr-col-8 fr-col-sm-9 fr-col-md-8 fr-col-lg-9 fr-col-xl-8">
        <ProgramList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
