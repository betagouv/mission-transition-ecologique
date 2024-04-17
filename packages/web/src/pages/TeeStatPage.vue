<template>
  <div
    id="simple-page"
    class="fr-container fr-my-8w statistics"
  >
    <div class="fr-mb-5w">
      <h1 class="fr-mb-3w">Statistiques d'usage</h1>
      <p>
        Vous trouverez ici les statistiques d'utilisation du site Transition écologique des entreprises. Ces données nous permettent de
        suivre les évolutions d'usage de la plateforme dans le temps mais également de mieux comprendre vos besoins et d'orienter nos
        actions pour améliorer ce service.
      </p>
      <p>
        Ces données étant en cours de construction, elles peuvent, dans certains cas, être incomplètes. Nous vous remercions de votre
        compréhension.
      </p>
    </div>

    <h2>Nombre de mises en relation</h2>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-md-6">
        <h4>Depuis le lancement</h4>
        <TeeCard
          :title="statsData ? statsData.nOpportunitiesTotal || undefined : undefined"
          class="fr-mr-md-3v"
          >Demandes d'entreprises mises en relations avec un opérateur public sur un sujet de transition écologique depuis le lancement (été
          2023).</TeeCard
        >
      </div>
      <div class="fr-col-md-6 fr-mt-3w fr-mt-md-0 extendShorterContentContainer">
        <h4 class="fr-ml-md-3v">Sur les 30 derniers jours</h4>
        <TeeCard
          :title="statsData ? statsData.nOpportunities30Days || undefined : undefined"
          class="fr-ml-md-3v extendVertically"
          >Demandes d'entreprises mises en relations avec un opérateur public sur un sujet de transition écologique sur les 30 derniers
          jours.</TeeCard
        >
      </div>
    </div>
    <div class="fr-col-12 fr-mt-3w fr-mt-md-4w fr-mb-md-8w">
      <h4>Ces derniers mois</h4>
      <canvas
        ref="chartCanvas"
        width="1200"
        height="450"
      ></canvas>
    </div>
    <div class="fr-mt-5w fr-mt-md-0 fr-mb-5w">
      <h2>Nombre de dispositifs d'aide activés</h2>
      <div class="fr-col-md-6">
        <TeeCard
          :type="CardType.Warning"
          imglink="../../../images/pictogrammes/missingData.svg"
          class="fr-mr-md-3v"
          >Nous travaillons actuellement sur cette mesure.<br /><br />
          Cette information sera disponible prochainement.</TeeCard
        >
      </div>
    </div>
    <div class="fr-mb-5w">
      <h2>Nombre de dispositifs d'aide listés sur la plateforme</h2>
      <div class="fr-grid-row fr-grid-row--center fr-mb-5w">
        <div class="fr-col-md-6">
          <h4>Depuis le lancement</h4>
          <TeeCard
            :title="statsData ? statsData.nProgramsTotal || undefined : undefined"
            class="fr-mr-md-3v"
            >Dispositifs d’aides référencés sur la plateforme depuis le lancement (été 2023).</TeeCard
          >
        </div>
        <div class="fr-col-12 fr-col-md-6 fr-mt-3w fr-mt-md-0 extendShorterContentContainer">
          <h4 class="fr-ml-md-3v">Actifs</h4>
          <TeeCard
            :title="statsData ? statsData.nProgramsNow || undefined : undefined"
            class="fr-ml-md-3v extendVertically extendHor"
            >Dispositifs d’aides actuellement référencés sur la plateforme.</TeeCard
          >
        </div>
      </div>
    </div>
    <div class="fr-mb-5w">
      <h2>Trafic web</h2>
      <div class="fr-col-md-6">
        <TeeCard
          class="fr-mr-md-3v"
          link="https://stats.beta.gouv.fr/index.php?module=CoreHome&action=index&idSite=23&period=day&date=yesterday#?period=day&date=yesterday&category=Dashboard_Dashboard&subcategory=1&idSite=23"
          link-text="Tableau de bord Matomo"
          >Consultez toutes les statistiques de notre site sur le tableau de bord de notre outil de suivi Matomo.</TeeCard
        >
      </div>
    </div>
  </div>
  <ContactMail></ContactMail>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import type StatsData from '@tee/common/src/stats/types'
import StatsApi from '@/service/api/statsApi'
import { CardType } from '@/types/elementsPropsTypes'
import ProgramService from '@tee/backend/src/program/application/programService'
import type { Program } from '@tee/data/src/type/program'

const statsData = ref<StatsData | null>(null)
const chartCanvas = ref<HTMLCanvasElement | null>(null)

const drawChart = () => {
  if (statsData.value && statsData.value.demandsTimeSeries) {
    const labels = statsData.value.demandsTimeSeries.map((item) => `${item.month}/${item.year}`)
    const data = statsData.value.demandsTimeSeries.map((item) => item.nDemands)

    if (!chartCanvas.value) return
    const chartContext = chartCanvas.value.getContext('2d')
    if (!chartContext) return

    new Chart(chartContext, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nombre de mises en relation',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 3
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  }
}

onMounted(async () => {
  const result = await new StatsApi().get()
  if (result.isOk) {
    statsData.value = result.value
  } else {
    console.error('Error calling the stat API', result.error)
  }
  drawChart()
  ProgramService.init()
  const service = new ProgramService()

  const allProgramsIds = service.getAll().map((program: Program) => program.id)
  const activeProgramsResult = service.getFilteredPrograms({})
  if (activeProgramsResult.isErr) {
    throw activeProgramsResult.error
  }
  const activeProgramsIds = activeProgramsResult.value.map((p: Program) => p.id)
  if (statsData.value) statsData.value.nProgramsTotal = allProgramsIds.length
  if (statsData.value) statsData.value.nProgramsNow = activeProgramsIds.length
})
</script>

<style scoped>
.statistics h1 {
  color: var(--light-background-action-high-blue-france, #000091);
  font-family: Marianne;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3rem; /* 120% */
}

.statistics p {
  color: #000;
  font-family: Marianne;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 150% */
}

.statistics h2 {
  color: var(--light-text-title-grey, #161616);
  font-family: Marianne;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2.5rem; /* 125% */
  margin-bottom: 1rem;
}

.statistics h4 {
  color: #6a6af4;
  font-family: Marianne;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem; /* 160% */
  margin-bottom: 0.75rem;
}

.statistics .extendShorterContentContainer {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Make flex items stretch vertically */
}
.statistics .extendVertically {
  flex: 1;
}

.extendHor {
  width: 100%;
}
</style>
