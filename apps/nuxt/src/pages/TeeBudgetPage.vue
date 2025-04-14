<template>
  <div>
    <TeeDsfrBreadcrumb :links="[{ text: 'Budget', to: RouteName.Budget }]" />
    <div class="fr-container fr-mb-8w">
      <div class="fr-mb-6w">
        <h1 class="fr-mb-3w fr-text--blue-france">Budget</h1>
        <p>
          Transition Écologique des Entreprises est un service public numérique, c’est pourquoi nous sommes transparents sur les ressources
          allouées et la manière dont elles sont employées.
        </p>
      </div>
      <h2 class="fr-text--blue-france">Principes</h2>
      Nous suivons le
      <a
        href="https://beta.gouv.fr/approche/manifeste"
        target="_blank"
        >manifeste beta.gouv</a
      >
      dont nous rappelons les principes ici :
      <ul>
        <li>Les besoins des utilisateurs sont prioritaires sur les besoins de l’administration</li>
        <li>Le mode de gestion de l’équipe repose sur la confiance</li>
        <li>L’équipe adopte une approche itérative et d’amélioration en continu</li>
      </ul>

      <h2 class="fr-mt-3w fr-text--blue-france">Fonctionnement</h2>
      <p>
        Transition Écologique des Entreprises est une start-up d'état. L'équipe est donc portée par un intrapreneur qui est responsable du
        service numérique développé. Son rôle est multiple : déploiement, gestion des produits, référent auprès de son administration
        (budget, compte rendus d'avancement).
      </p>
      <p>
        L'ensemble de l'équipe et le descriptif du produit est décrit sur la
        <a
          href="https://beta.gouv.fr/startups/transition-ecologique-des-entreprises.html"
          target="_blank"
          >fiche du produit beta.gouv.fr</a
        >.
      </p>

      <h2 class="fr-text--blue-france">Cofinancement</h2>
      La particularité de notre Startup d'Etat est le cofinancement par plusieurs entités publiques :
      <ul>
        <li>
          <a
            href="https://www.ademe.fr/"
            target="_blank"
            >ADEME - Agence de la transition écologique</a
          >
        </li>
        <li>
          <a
            href="https://www.entreprises.gouv.fr/fr/la-direction-generale-des-entreprises-dge"
            target="_blank"
            >DGE - Direction Générale des Entreprises</a
          >
        </li>
        <li>
          <a
            href="https://www.ecologie.gouv.fr/commissariat-general-au-developpement-durable-cgdd"
            target="_blank"
            >CGDD - Commissariat général au développement durable</a
          >
        </li>
        <li>
          <a
            href="https://www.bpifrance.fr/"
            target="_blank"
            >Bpifrance - Banque publique d'investissement</a
          >
        </li>
        <li>
          <a
            href="https://www.numerique.gouv.fr/services/fonds-dinvestissement-numerique-et-donnees-pour-la-planification-ecologique/"
            target="_blank"
            >FINDPE - Fonds d’investissement « Numérique et Données » pour la Planification écologique</a
          >
          de la
          <a
            href="https://www.numerique.gouv.fr/"
            target="_blank"
            >DINUM</a
          >
          &
          <a
            href="https://www.info.gouv.fr/grand-dossier/france-nation-verte/le-secretariat-general-a-la-planification-ecologique"
            target="_blank"
            >SGPE</a
          >
        </li>
      </ul>

      <h2 class="fr-mt-3w fr-text--blue-france">Consommation</h2>

      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-lg-7 fr-col--middle fr-col-justify--center">
          <DsfrTable
            class="fr-mt-0 fr-m-auto"
            title=""
          >
            <thead>
              <tr>
                <th>Dépense</th>
                <th
                  v-for="(label, year) in yearsLabels"
                  :key="year"
                  class="text-center"
                >
                  {{ label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(label, index) in budgetLabels"
                :key="index"
              >
                <td>{{ label }}</td>
                <td
                  v-for="(_, year) in yearsLabels"
                  :key="year"
                  class="text-right"
                >
                  {{ formatCurrency(budgetData[year][index]) }}
                </td>
              </tr>
              <tr>
                <td><strong>Total TTC</strong></td>
                <td
                  v-for="(label, year) in yearsLabels"
                  :key="year"
                  class="text-right"
                >
                  <strong>{{ formatCurrency(yearlyTotals[year]) }}</strong>
                </td>
              </tr>
            </tbody>
          </DsfrTable>
        </div>

        <div class="fr-col-12 fr-col-lg-5 fr-col-xl-4 fr-flex fr-flex--center fr-col-justify--center fr-col--middle">
          <canvas ref="budgetChartCanvas"></canvas>
        </div>
      </div>
    </div>
    <ContactMail />
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/types'
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  path: '/budget',
  name: RouteName.Budget
})

const budgetChartCanvas = ref<HTMLCanvasElement | null>(null)

const budgetLabels = ['Design', 'Développement et Data engineering', 'Pilotage', 'Coaching', 'BizDev']
const budgetData = {
  2023: [83194, 164674, 154627, 48600, 10819],
  2024: [152552.4, 439117.59, 192628.8, 61862.4, 172558.18]
}
const yearsLabels = {
  2023: 2023,
  2024: '2024 (Prévisionnel)'
}
const yearlyTotals = computed(() => {
  return Object.entries(budgetData).reduce(
    (acc, [year, values]) => {
      acc[Number(year)] = values.reduce((sum, value) => sum + value, 0)
      return acc
    },
    {} as Record<number, number>
  )
})
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const drawBudgetChart = () => {
  if (!budgetChartCanvas.value) return

  const chartContext = budgetChartCanvas.value.getContext('2d')
  if (!chartContext) return

  const totalByCategory = budgetLabels.map((label, index) => {
    return budgetData[2023][index] + budgetData[2024][index]
  })

  // const chartColors = [Color.yellow, Color.red, Color.purple, Color.green, Color.blueFrance]
  const chartColors = ['#facf35', '#fca081', '#6a62f4', '#1ebe8e', '#001891']

  new Chart(chartContext, {
    type: 'doughnut',
    data: {
      labels: budgetLabels,
      datasets: [
        {
          label: 'Répartition des dépenses',
          data: totalByCategory,
          backgroundColor: chartColors
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          display: true
        },
        tooltip: {
          callbacks: {
            title: () => '',
            label: (tooltipItem) => {
              const dataset = tooltipItem.dataset
              const total = dataset.data.reduce((sum, value) => sum + value, 0)
              const currentValue = dataset.data[tooltipItem.dataIndex]
              const percentage = ((currentValue / total) * 100).toFixed(2)
              return `${tooltipItem.label}: ${percentage}%`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  drawBudgetChart()
})

useHead(MetaRobots.indexFollow())
</script>

<style scoped>
ul {
  padding-left: 1.5rem;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}
</style>
