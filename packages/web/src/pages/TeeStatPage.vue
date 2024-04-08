<template>
  <div
    id="simple-page"
    class="fr-container fr-my-8w"
  >
    <h1>Statistiques</h1>
    <div class="fr-mt-5w">
      <h3>Mises en relations</h3>
      <p class="subtitle">entre entreprises et administrations déployant des dispositifs d'aides</p>
      <div v-if="statsData">
        <div class="fr-highlight">
          <p>
            Depuis le lancement : <strong>{{ statsData.nOpportunitiesCreated }}</strong> <br />
            Sur les 30 derniers jours :
            <strong>
              {{ statsData.nOpportunitiesCreated }}
            </strong>
          </p>
        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
      <h6>Nombre de mises en relations mensuelles</h6>
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-md-10">
          <canvas
            ref="chartCanvas"
            width="1200"
            height="450"
          ></canvas>
        </div>
      </div>
      <div class="fr-mt-5w">
        <h3>Nombre de dispositifs d'aide activés</h3>
        <div class="fr-grid-row">
          <div
            class="fr-col-md-6"
            style="padding-left: 2rem"
          >
            <DsfrAlert
              title="Information non disponible"
              type="error"
            ></DsfrAlert>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-mt-5w">
      <h3>Dispositifs d'aide listés</h3>
      <div v-if="statsData">
        <div class="fr-highlight">
          Depuis le lancement : <strong>{{ 105 }}</strong> <br />Actifs :
          <strong>{{ 94 }}</strong>
        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
    <!-- <DsfrCard
          description="description"
          detail="Détails absolument essentiels"
          detail-icon="Détails absolument essentiels icons"
          end-detail="Autres détails absolument essentiels"
          end-detail-icon="fr-icon-arrow-right-line"
          title="Titre de la carte"
          title-tag="h5"
          size="large"
          ratio-img="large"
        >
        </DsfrCard> -->
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
import type { DsfrAlert } from '@gouvminint/vue-dsfr/types'
// import type { DsfrCard } from '@gouvminint/vue-dsfr/types'

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
.subtitle {
  font-size: 0.8rem;
  margin-top: -30px;
  margin-left: 0px;
}
</style>
