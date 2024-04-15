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
          title="931"
          description="Entreprises mises en relations avec un opérateur public sur un sujet de transition écologique depuis le lancement (mars 2023)."
          class="fr-mr-md-3v"
        ></TeeCard>
      </div>
      <div class="fr-col-md-6">
        <h4 class="fr-ml-md-3v">Sur les 30 derniers jours</h4>
        <TeeCard
          title="65"
          description="Entreprises mises en relations avec un opérateur public sur un sujet de transition écologique sur les 30 derniers jours."
          class="fr-ml-md-3v"
        ></TeeCard>
      </div>
    </div>
    <div class="fr-col-12 fr-mt-md-6w fr-mb-md-10w">
      <h4>Sur ces derniers mois</h4>
      <canvas
        ref="chartCanvas"
        width="1200"
        height="450"
      ></canvas>
    </div>
    <div class="fr-mb-5w">
      <h2>Nombre de dispositifs d'aide activés</h2>
      <div class="fr-col-md-6">
        <TeeCard
          type="warning"
          description="Nous travaillons actuellement sur cette mesure.
Cette information sera disponible prochainement."
          image="missingDataSvg"
          class="fr-mr-md-3v"
        ></TeeCard>
      </div>
    </div>
    <div class="fr-mb-5w">
      <h2>Nombre de dispositifs d'aide listés sur la plateforme</h2>
      <div class="fr-grid-row fr-grid-row--center fr-mb-5w">
        <div class="fr-col-md-6">
          <h4>Depuis le lancement</h4>
          <TeeCard
            title="65"
            description="Entreprises mises en relations avec un opérateur public sur un sujet de transition écologique sur les 30 derniers jours."
            class="fr-mr-md-3v"
          ></TeeCard>
        </div>
        <div class="fr-col-md-6">
          <h4 class="fr-ml-md-3v">Actifs</h4>
          <TeeCard
            title="65"
            description="Entreprises mises en relations avec un opérateur public sur un sujet de transition écologique sur les 30 derniers jours."
            class="fr-ml-md-3v"
          ></TeeCard>
        </div>
      </div>
    </div>
    <div class="fr-mb-5w">
      <h2>Trafic web</h2>
      <div class="fr-col-md-6">
        <TeeCard
          title="65"
          description="Entreprises mises en relations avec un opérateur public sur un sujet de transition écologique sur les 30 derniers jours."
          class="fr-mr-md-3v"
        ></TeeCard>
      </div>
    </div>

    <div v-if="statsData">
      Depuis le lancement : <strong>{{ statsData.nOpportunitiesCreated }}</strong> <br />
      Sur les 30 derniers jours :
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <div class="fr-mt-5w">
      <h3>Traffic web</h3>
      <a
        target="_blank"
        href="https://stats.beta.gouv.fr/index.php?module=CoreHome&action=index&idSite=23&period=day&date=yesterday#?period=day&date=yesterday&category=Dashboard_Dashboard&subcategory=1&idSite=23"
      >
        Découvrez toutes les statistiques du site Transition écologique des entreprises sur le tableau de bord de notre outil de suivi
        Matomo
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import type StatsData from '@tee/common/src/stats/types'
import StatsApi from '@/service/api/statsApi'
// import missingDataSvg from '@tee/web/images/pictogrammes/missingData.svg' TODO

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
    console.error(result.error)
  }
  drawChart()
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
</style>
