<template>
  <div class="secteurs-page">
    <div class="fr-container fr-py-4w">
      <h1 class="fr-h2 fr-mb-1w">Statistiques par secteur d'activité</h1>
      <p class="fr-text--lead fr-mb-0">
        Comparez le comportement d'un sous-ensemble d'entreprises aux statistiques globales de navigation.
      </p>
    </div>

    <!-- Sticky filter bar -->
    <div class="filters-bar">
      <div class="fr-container">
        <div class="filters-bar__inner">
          <span class="filters-bar__label">Filtres</span>

          <!-- NAF section -->
          <div class="filter-group">
            <select
              v-model="filterNafSection"
              class="fr-select filter-select"
              @change="filterNafDivision = ''; filterNafGroup = ''; filterNafClass = ''; filterNafCode = ''"
            >
              <option value="">Tous les secteurs NAF</option>
              <option
                v-for="s in availableSections"
                :key="s.code"
                :value="s.code"
              >
                {{ s.code }} — {{ s.label }}
              </option>
            </select>
          </div>

          <!-- NAF division (visible when section selected) -->
          <div
            v-if="filterNafSection && availableDivisions.length > 1"
            class="filter-group"
          >
            <select
              v-model="filterNafDivision"
              class="fr-select filter-select"
              @change="filterNafGroup = ''; filterNafClass = ''; filterNafCode = ''"
            >
              <option value="">Toutes les divisions</option>
              <option
                v-for="d in availableDivisions"
                :key="d.code"
                :value="d.code"
              >
                {{ d.code }} — {{ d.label }}
              </option>
            </select>
          </div>

          <!-- NAF group -->
          <div
            v-if="filterNafDivision && availableGroups.length > 1"
            class="filter-group"
          >
            <select
              v-model="filterNafGroup"
              class="fr-select filter-select"
              @change="filterNafClass = ''; filterNafCode = ''"
            >
              <option value="">Tous les groupes</option>
              <option
                v-for="g in availableGroups"
                :key="g.code"
                :value="g.code"
              >
                {{ g.code }} — {{ g.label }}
              </option>
            </select>
          </div>

          <!-- NAF class -->
          <div
            v-if="filterNafGroup && availableClasses.length > 1"
            class="filter-group"
          >
            <select
              v-model="filterNafClass"
              class="fr-select filter-select"
              @change="filterNafCode = ''"
            >
              <option value="">Toutes les classes</option>
              <option
                v-for="c in availableClasses"
                :key="c.code"
                :value="c.code"
              >
                {{ c.code }} — {{ c.label }}
              </option>
            </select>
          </div>

          <!-- NAF code (APE) -->
          <div
            v-if="filterNafClass && availableCodes.length > 1"
            class="filter-group"
          >
            <select
              v-model="filterNafCode"
              class="fr-select filter-select"
            >
              <option value="">Tous les codes APE</option>
              <option
                v-for="c in availableCodes"
                :key="c.code"
                :value="c.code"
              >
                {{ c.code }} — {{ c.label }}
              </option>
            </select>
          </div>

          <!-- Region -->
          <div class="filter-group">
            <select
              v-model="filterRegion"
              class="fr-select filter-select"
            >
              <option value="">Toutes les régions</option>
              <option
                v-for="r in availableRegions"
                :key="r"
                :value="r"
              >
                {{ r }}
              </option>
            </select>
          </div>

          <!-- Size -->
          <div class="filter-group">
            <select
              v-model="filterSize"
              class="fr-select filter-select"
            >
              <option value="">Toutes les tailles</option>
              <option
                v-for="b in SIZE_BUCKETS"
                :key="b.key"
                :value="b.key"
              >
                {{ b.label }}
              </option>
            </select>
          </div>

          <!-- Period presets -->
          <div class="filter-group filter-group--period">
            <span class="period-label">Période</span>
            <div class="period-btns">
              <button
                v-for="p in PERIOD_PRESETS"
                :key="p.key"
                class="period-btn"
                :class="{ 'period-btn--active': filterPeriod === p.key }"
                @click="filterPeriod = filterPeriod === p.key ? '' : p.key"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <div class="filters-bar__actions">
            <span
              v-if="isFilterActive"
              class="filters-bar__subset-count"
            >
              {{ subset.length }} / {{ all.length }} entreprises
            </span>
            <button
              v-if="isFilterActive"
              class="filters-bar__clear"
              @click="clearFilters"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="fr-container fr-mt-4w fr-mb-8w">
      <div
        v-if="pending"
        class="fr-py-8w fr-text--center"
      >
        Chargement…
      </div>
      <div
        v-else-if="error"
        class="fr-alert fr-alert--error fr-mb-4w"
      >
        <p>Impossible de charger les statistiques.</p>
      </div>

      <template v-else-if="data">
        <!-- ① KPIs -->
        <section class="stat-section">
          <h2 class="stat-section__title">
            Vue d'ensemble
            <span
              v-if="isFilterActive"
              class="stat-section__subtitle"
            >— comparaison sélection vs global</span>
          </h2>

          <div class="kpi-grid">
            <div
              v-for="kpi in kpiCards"
              :key="kpi.label"
              class="kpi-card"
            >
              <p class="kpi-card__label">{{ kpi.label }}</p>
              <p class="kpi-card__value">{{ kpi.globalValue }}</p>
              <template v-if="isFilterActive && subsetKpis">
                <p class="kpi-card__subset">{{ kpi.subsetValue }}</p>
                <span
                  v-if="kpi.showDelta !== false"
                  class="kpi-card__delta"
                  :class="kpi.deltaClass"
                >{{ kpi.delta }}</span>
              </template>
            </div>
          </div>
        </section>

        <!-- ② Sector distribution -->
        <section class="stat-section">
          <h2 class="stat-section__title">
            Répartition sectorielle
            <span class="stat-section__subtitle">— nos visiteurs vs entreprises françaises (INSEE 2023)</span>
          </h2>
          <p class="fr-text--sm fr-mb-2w stat-section__hint">
            Les entreprises françaises ont des codes APE dans des secteurs qui pourraient bénéficier d'aides à la
            transition. Un secteur sur-représenté parmi nos visiteurs indique un intérêt fort pour le dispositif.
          </p>
          <div class="chart-wrapper">
            <canvas ref="sectorChartCanvas" />
          </div>
        </section>

        <!-- ③ Themes -->
        <section class="stat-section">
          <h2 class="stat-section__title">
            Thèmes explorés
            <span
              v-if="isFilterActive"
              class="stat-section__subtitle"
            >— différentiel sélection vs global</span>
          </h2>

          <div class="themes-list">
            <div
              v-for="t in themeStats"
              :key="t.theme"
              class="theme-row"
            >
              <span class="theme-row__name">{{ t.theme }}</span>
              <div class="theme-row__bars">
                <div class="theme-bar-wrap">
                  <div
                    class="theme-bar theme-bar--global"
                    :style="{ width: `${t.globalPct}%` }"
                  />
                  <span class="theme-bar__pct">{{ fmt1(t.globalPct) }}%</span>
                </div>
                <div
                  v-if="isFilterActive"
                  class="theme-bar-wrap"
                >
                  <div
                    class="theme-bar theme-bar--subset"
                    :style="{ width: `${t.subsetPct}%` }"
                  />
                  <span class="theme-bar__pct">{{ fmt1(t.subsetPct) }}%</span>
                  <span
                    class="theme-delta"
                    :class="t.delta >= 0 ? 'theme-delta--pos' : 'theme-delta--neg'"
                  >
                    {{ t.delta >= 0 ? '+' : '' }}{{ fmt1(t.delta) }}pp
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="!isFilterActive"
            class="themes-legend"
          >
            <span class="legend-dot legend-dot--global" /> % d'entreprises ayant exploré ce thème
          </div>
          <div
            v-else
            class="themes-legend"
          >
            <span class="legend-dot legend-dot--global" /> Global &nbsp;
            <span class="legend-dot legend-dot--subset" /> Sélection &nbsp;
            <span class="legend-dot legend-dot--delta" /> Différentiel (pp)
          </div>
        </section>

        <!-- ④ Top content -->
        <section class="stat-section">
          <h2 class="stat-section__title">
            Projets &amp; aides les plus consultés
            <span
              v-if="isFilterActive"
              class="stat-section__subtitle"
            >— ratio sélection / global</span>
          </h2>

          <div class="content-table-wrap">
            <table class="content-table fr-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>% global</th>
                  <th v-if="isFilterActive">% sélection</th>
                  <th v-if="isFilterActive">Ratio ×</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in topContent"
                  :key="item.slug"
                >
                  <td>{{ item.title }}</td>
                  <td>
                    <span
                      class="type-badge"
                      :class="item.type === 'program' ? 'type-badge--program' : 'type-badge--project'"
                    >
                      {{ item.type === 'program' ? 'Aide' : 'Projet' }}
                    </span>
                  </td>
                  <td>{{ fmt1(item.globalPct) }}%</td>
                  <td v-if="isFilterActive">{{ fmt1(item.subsetPct) }}%</td>
                  <td v-if="isFilterActive">
                    <span
                      class="ratio-badge"
                      :class="item.ratio >= 1.5 ? 'ratio-badge--high' : item.ratio >= 1 ? 'ratio-badge--mid' : 'ratio-badge--low'"
                    >
                      ×{{ fmt1(item.ratio) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="content-table__expand">
            <button
              class="expand-btn"
              @click="showAllContent = !showAllContent"
            >
              {{ showAllContent ? 'Voir moins' : 'Voir les 50 premiers' }}
            </button>
          </div>
        </section>

        <!-- ⑤ Operator conversions -->
        <section
          v-if="operatorStats.length"
          class="stat-section"
        >
          <h2 class="stat-section__title">
            Conversions par opérateur
            <span class="stat-section__subtitle">— clics externes + demandes liés à des programmes</span>
          </h2>

          <div class="content-table-wrap">
            <table class="content-table fr-table">
              <thead>
                <tr>
                  <th>Opérateur</th>
                  <th>Clics ext. (global)</th>
                  <th>Demandes (global)</th>
                  <th>Total (global)</th>
                  <th v-if="isFilterActive">Total (sélection)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="op in operatorStats"
                  :key="op.operator"
                >
                  <td>{{ op.operator }}</td>
                  <td>{{ op.globalClicks }}</td>
                  <td>{{ op.globalOpps }}</td>
                  <td>
                    <strong>{{ op.globalTotal }}</strong>
                  </td>
                  <td v-if="isFilterActive">
                    <strong>{{ op.subTotal }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <p
          v-if="data.generated_at"
          class="fr-text--xs fr-mt-4w generated-at"
        >
          Données générées le {{ formatDate(data.generated_at) }}
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { nafMapping } from '@tee/data/static'
import type { SectorStatsData, CompanyRecord } from '@tee/data/src/sector-stats/types'

definePageMeta({ layout: 'default' })
useHead({ title: 'Statistiques par secteur — TEE' })

// ── NAF lookup tables ────────────────────────────────────────────────────────

type NafEntry = { NIV1: string; NIV2: string; NIV3: string; NIV4: string; NIV5: string; label_vf: string }
const nafData = nafMapping as NafEntry[]

// First label seen per level (abbreviated for readability)
const DIV_LABEL: Record<string, string> = {}
const GRP_LABEL: Record<string, string> = {}
const CLS_LABEL: Record<string, string> = {}
const CODE_LABEL: Record<string, string> = {}
for (const e of nafData) {
  if (!DIV_LABEL[e.NIV2]) DIV_LABEL[e.NIV2] = e.label_vf.substring(0, 60)
  if (!GRP_LABEL[e.NIV3]) GRP_LABEL[e.NIV3] = e.label_vf.substring(0, 60)
  if (!CLS_LABEL[e.NIV4]) CLS_LABEL[e.NIV4] = e.label_vf.substring(0, 60)
  CODE_LABEL[e.NIV5] = e.label_vf
}

const SECTION_LABELS: Record<string, string> = {
  A: 'Agriculture, sylviculture et pêche',
  B: 'Industries extractives',
  C: 'Industrie manufacturière',
  D: "Production et distribution d'électricité, de gaz",
  E: "Production et distribution d'eau, assainissement",
  F: 'Construction',
  G: "Commerce, réparation d'automobiles",
  H: 'Transports et entreposage',
  I: 'Hébergement et restauration',
  J: 'Information et communication',
  K: "Activités financières et d'assurance",
  L: 'Activités immobilières',
  M: 'Activités spécialisées, scientifiques et techniques',
  N: 'Activités de services administratifs et de soutien',
  O: 'Administration publique',
  P: 'Enseignement',
  Q: 'Santé humaine et action sociale',
  R: 'Arts, spectacles et activités récréatives',
  S: 'Autres activités de services',
  T: "Activités des ménages en tant qu'employeurs",
  U: 'Activités extra-territoriales',
}

// INSEE 2023 approximate % of French establishments by section
const INSEE_SHARES: Record<string, number> = {
  A: 1.6, B: 0.2, C: 5.8, D: 0.1, E: 0.3, F: 15.8, G: 15.5, H: 4.2, I: 9.3,
  J: 4.1, K: 2.9, L: 10.2, M: 13.8, N: 5.7, O: 0.5, P: 3.5, Q: 7.1, R: 2.1,
  S: 4.9, T: 0.4, U: 0.01,
}

// ── Period presets ────────────────────────────────────────────────────────────

const PERIOD_PRESETS = [
  { key: '3m', label: '3 mois', months: 3 },
  { key: '6m', label: '6 mois', months: 6 },
  { key: '1y', label: '1 an', months: 12 },
]

// ── Size buckets ─────────────────────────────────────────────────────────────

const SIZE_BUCKETS = [
  { key: 'unknown', label: 'Taille inconnue', test: (min: number | null) => min === null },
  { key: '0', label: 'Sans salarié', test: (min: number | null, max: number | null) => min === 0 && max === 0 },
  { key: '1-9', label: '1–9 salariés', test: (min: number | null, max: number | null) => min !== null && min >= 1 && (max ?? 0) <= 9 },
  { key: '10-49', label: '10–49 salariés', test: (min: number | null, max: number | null) => min !== null && min >= 10 && (max ?? 0) <= 49 },
  { key: '50-249', label: '50–249 salariés', test: (min: number | null, max: number | null) => min !== null && min >= 50 && (max ?? 0) <= 249 },
  { key: '250+', label: '250+ salariés', test: (min: number | null) => min !== null && min >= 250 },
]

// ── Data ─────────────────────────────────────────────────────────────────────

const { data, pending, error } = useFetch<SectorStatsData>('/api/demo/secteurs')
const all = computed<CompanyRecord[]>(() => data.value?.companies ?? [])

// ── Filters ──────────────────────────────────────────────────────────────────

const filterNafSection = ref('')
const filterNafDivision = ref('')
const filterNafGroup = ref('')
const filterNafClass = ref('')
const filterNafCode = ref('')
const filterRegion = ref('')
const filterSize = ref('')
const filterPeriod = ref('')

const isFilterActive = computed(() =>
  !!(filterNafSection.value || filterNafDivision.value || filterNafGroup.value ||
     filterNafClass.value || filterNafCode.value || filterRegion.value || filterSize.value ||
     filterPeriod.value)
)

function clearFilters() {
  filterNafSection.value = ''
  filterNafDivision.value = ''
  filterNafGroup.value = ''
  filterNafClass.value = ''
  filterNafCode.value = ''
  filterRegion.value = ''
  filterSize.value = ''
  filterPeriod.value = ''
}

const periodCutoff = computed<Date | null>(() => {
  if (!filterPeriod.value) return null
  const preset = PERIOD_PRESETS.find((p) => p.key === filterPeriod.value)
  if (!preset) return null
  // Anchor on the last date in the dataset (or today as fallback)
  const anchor = data.value?.date_range?.last ? new Date(data.value.date_range.last) : new Date()
  const cutoff = new Date(anchor)
  cutoff.setMonth(cutoff.getMonth() - preset.months)
  return cutoff
})

const subset = computed<CompanyRecord[]>(() => {
  if (!isFilterActive.value) return all.value
  return all.value.filter((c) => {
    if (filterNafCode.value && c.naf_code !== filterNafCode.value) return false
    if (filterNafClass.value && c.naf_class !== filterNafClass.value) return false
    if (filterNafGroup.value && c.naf_group !== filterNafGroup.value) return false
    if (filterNafDivision.value && c.naf_division !== filterNafDivision.value) return false
    if (filterNafSection.value && c.naf_section !== filterNafSection.value) return false
    if (filterRegion.value && c.region !== filterRegion.value) return false
    if (filterSize.value) {
      const bucket = SIZE_BUCKETS.find((b) => b.key === filterSize.value)
      if (bucket && !bucket.test(c.wf_min, c.wf_max)) return false
    }
    if (periodCutoff.value && new Date(c.first_seen) < periodCutoff.value) return false
    return true
  })
})

// ── Filter option lists (derived from full dataset, always accurate) ─────────

const availableSections = computed(() => {
  const codes = new Set(all.value.map((c) => c.naf_section).filter(Boolean))
  return [...codes].sort().map((code) => ({ code, label: SECTION_LABELS[code] ?? code }))
})

const availableDivisions = computed(() => {
  const base = filterNafSection.value ? all.value.filter((c) => c.naf_section === filterNafSection.value) : all.value
  const codes = new Set(base.map((c) => c.naf_division).filter(Boolean))
  return [...codes].sort().map((code) => ({ code, label: DIV_LABEL[code] ?? code }))
})

const availableGroups = computed(() => {
  const base = all.value.filter(
    (c) => (!filterNafSection.value || c.naf_section === filterNafSection.value) &&
           (!filterNafDivision.value || c.naf_division === filterNafDivision.value)
  )
  const codes = new Set(base.map((c) => c.naf_group).filter(Boolean))
  return [...codes].sort().map((code) => ({ code, label: GRP_LABEL[code] ?? code }))
})

const availableClasses = computed(() => {
  const base = all.value.filter(
    (c) => (!filterNafSection.value || c.naf_section === filterNafSection.value) &&
           (!filterNafDivision.value || c.naf_division === filterNafDivision.value) &&
           (!filterNafGroup.value || c.naf_group === filterNafGroup.value)
  )
  const codes = new Set(base.map((c) => c.naf_class).filter(Boolean))
  return [...codes].sort().map((code) => ({ code, label: CLS_LABEL[code] ?? code }))
})

const availableCodes = computed(() => {
  const base = all.value.filter(
    (c) => (!filterNafSection.value || c.naf_section === filterNafSection.value) &&
           (!filterNafDivision.value || c.naf_division === filterNafDivision.value) &&
           (!filterNafGroup.value || c.naf_group === filterNafGroup.value) &&
           (!filterNafClass.value || c.naf_class === filterNafClass.value)
  )
  const codes = new Set(base.map((c) => c.naf_code).filter(Boolean))
  return [...codes].sort().map((code) => ({ code, label: CODE_LABEL[code] ?? code }))
})

const availableRegions = computed(() => {
  const regions = new Set(all.value.map((c) => c.region).filter(Boolean))
  return [...regions].sort()
})

// ── KPIs ─────────────────────────────────────────────────────────────────────

function countWorkingDays(from: string, to: string): number {
  const start = new Date(from)
  const end = new Date(to)
  let count = 0
  const cur = new Date(start)
  while (cur <= end) {
    const day = cur.getDay()
    if (day !== 0 && day !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return Math.max(count, 1)
}

function computeKPIs(companies: CompanyRecord[]) {
  const n = companies.length
  if (n === 0) return null
  const range = data.value?.date_range
  const workingDays = range ? countWorkingDays(range.first, range.last) : 1
  return {
    total: n,
    dailyAvg: n / workingDays,
    pctProject: (companies.filter((c) => c.visited_projects.length > 0).length / n) * 100,
    pctProgram: (companies.filter((c) => c.visited_programs.length > 0).length / n) * 100,
    pctClick: (companies.filter((c) => c.has_external_click).length / n) * 100,
    pctOpportunity: (companies.filter((c) => c.has_opportunity).length / n) * 100,
  }
}

const globalKpis = computed(() => computeKPIs(all.value))
const subsetKpis = computed(() => (isFilterActive.value ? computeKPIs(subset.value) : null))

function fmtDelta(sub: number, glob: number, isPct = true): { text: string; cls: string } {
  const delta = sub - glob
  const sign = delta >= 0 ? '+' : ''
  const text = isPct ? `${sign}${fmt1(delta)}pp` : `${sign}${fmt1(delta)}`
  const cls = delta > 0 ? 'delta--pos' : delta < 0 ? 'delta--neg' : 'delta--zero'
  return { text, cls }
}

const kpiCards = computed(() => {
  const g = globalKpis.value
  const s = subsetKpis.value
  if (!g) return []
  return [
    {
      label: 'Entreprises identifiées',
      globalValue: g.total.toLocaleString('fr-FR'),
      subsetValue: s ? s.total.toLocaleString('fr-FR') : '',
      delta: '',
      deltaClass: '',
      showDelta: false,
    },
    {
      label: 'Moyenne / jour ouvré',
      globalValue: fmt1(g.dailyAvg),
      subsetValue: s ? fmt1(s.dailyAvg) : '',
      delta: '',
      deltaClass: '',
      showDelta: false,
    },
    {
      label: 'Ont consulté un projet',
      globalValue: `${fmt1(g.pctProject)}%`,
      subsetValue: s ? `${fmt1(s.pctProject)}%` : '',
      delta: s ? fmtDelta(s.pctProject, g.pctProject).text : '',
      deltaClass: s ? fmtDelta(s.pctProject, g.pctProject).cls : '',
    },
    {
      label: "Ont consulté une aide",
      globalValue: `${fmt1(g.pctProgram)}%`,
      subsetValue: s ? `${fmt1(s.pctProgram)}%` : '',
      delta: s ? fmtDelta(s.pctProgram, g.pctProgram).text : '',
      deltaClass: s ? fmtDelta(s.pctProgram, g.pctProgram).cls : '',
    },
    {
      label: 'Ont cliqué un lien externe',
      globalValue: `${fmt1(g.pctClick)}%`,
      subsetValue: s ? `${fmt1(s.pctClick)}%` : '',
      delta: s ? fmtDelta(s.pctClick, g.pctClick).text : '',
      deltaClass: s ? fmtDelta(s.pctClick, g.pctClick).cls : '',
    },
    {
      label: 'Ont fait une demande',
      globalValue: `${fmt1(g.pctOpportunity)}%`,
      subsetValue: s ? `${fmt1(s.pctOpportunity)}%` : '',
      delta: s ? fmtDelta(s.pctOpportunity, g.pctOpportunity).text : '',
      deltaClass: s ? fmtDelta(s.pctOpportunity, g.pctOpportunity).cls : '',
    },
  ]
})

// ── Themes ───────────────────────────────────────────────────────────────────

const themeStats = computed(() => {
  const a = all.value
  const s = subset.value
  if (!a.length) return []
  const allThemes = new Set(a.flatMap((c) => c.themes))
  return [...allThemes]
    .map((theme) => {
      const globalPct = (a.filter((c) => c.themes.includes(theme)).length / a.length) * 100
      const subsetPct = s.length > 0 ? (s.filter((c) => c.themes.includes(theme)).length / s.length) * 100 : 0
      return { theme, globalPct, subsetPct, delta: subsetPct - globalPct }
    })
    .sort((x, y) => (isFilterActive.value ? y.subsetPct - x.subsetPct : y.globalPct - x.globalPct))
})

// ── Top content ───────────────────────────────────────────────────────────────

const showAllContent = ref(false)

const topContent = computed(() => {
  const a = all.value
  const s = subset.value
  const meta = data.value?.content_meta ?? {}
  if (!a.length) return []

  const items = Object.keys(meta).map((slug) => {
    const globalCount = a.filter((c) => c.visited_projects.includes(slug) || c.visited_programs.includes(slug)).length
    const subsetCount = s.filter((c) => c.visited_projects.includes(slug) || c.visited_programs.includes(slug)).length
    const globalPct = (globalCount / a.length) * 100
    const subsetPct = s.length > 0 ? (subsetCount / s.length) * 100 : 0
    const ratio = globalPct > 0 ? subsetPct / globalPct : 0
    return { slug, ...meta[slug], globalPct, subsetPct, ratio, globalCount, subsetCount }
  })

  const filtered = items.filter((i) => i.globalCount >= 2)
  filtered.sort(isFilterActive.value
    ? (a, b) => b.subsetPct - a.subsetPct || b.subsetCount - a.subsetCount
    : (a, b) => b.globalPct - a.globalPct
  )
  return filtered.slice(0, showAllContent.value ? 50 : 10)
})

// ── Operator conversions ──────────────────────────────────────────────────────

const operatorStats = computed(() => {
  const a = all.value
  const s = subset.value
  if (!a.length) return []
  const allOps = new Set(a.flatMap((c) => [...c.external_click_operators, ...c.opportunity_operators]))
  return [...allOps]
    .map((op) => ({
      operator: op,
      globalClicks: a.filter((c) => c.external_click_operators.includes(op)).length,
      globalOpps: a.filter((c) => c.opportunity_operators.includes(op)).length,
      globalTotal: a.filter((c) => [...c.external_click_operators, ...c.opportunity_operators].includes(op)).length,
      subClicks: s.filter((c) => c.external_click_operators.includes(op)).length,
      subOpps: s.filter((c) => c.opportunity_operators.includes(op)).length,
      subTotal: s.filter((c) => [...c.external_click_operators, ...c.opportunity_operators].includes(op)).length,
    }))
    .sort((a, b) => b.globalTotal - a.globalTotal)
})

// ── Sector distribution chart ─────────────────────────────────────────────────

const sectorChartCanvas = ref<HTMLCanvasElement | null>(null)
let sectorChart: any = null

async function drawSectorChart() {
  if (!sectorChartCanvas.value || !all.value.length) return
  const { default: Chart } = await import('chart.js/auto')
  if (sectorChart) { sectorChart.destroy(); sectorChart = null }
  const ctx = sectorChartCanvas.value.getContext('2d')
  if (!ctx) return

  const sections = Object.keys(INSEE_SHARES)
  const allCompanies = all.value
  const subCompanies = subset.value
  const total = allCompanies.length
  const subTotal = subCompanies.length
  const visitorShares = sections.map((code) =>
    total > 0 ? (allCompanies.filter((c) => c.naf_section === code).length / total) * 100 : 0
  )
  const inseeShares = sections.map((code) => INSEE_SHARES[code] ?? 0)
  const subsetShares = isFilterActive.value
    ? sections.map((code) =>
        subTotal > 0 ? (subCompanies.filter((c) => c.naf_section === code).length / subTotal) * 100 : 0
      )
    : null
  const selected = filterNafSection.value

  const datasets: any[] = [
    {
      label: 'Nos visiteurs (%)',
      data: visitorShares,
      backgroundColor: sections.map((s) => s === selected ? '#ff6f00' : '#000091'),
    },
    {
      label: 'Entreprises françaises — INSEE (%)',
      data: inseeShares,
      backgroundColor: sections.map((s) => s === selected ? '#ffb74d' : '#bdbdbd'),
    },
  ]

  if (subsetShares) {
    datasets.push({
      label: 'Sélection (%)',
      data: subsetShares,
      backgroundColor: sections.map((s) => s === selected ? '#e53935' : '#e57373'),
    })
  }

  sectorChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sections.map((s) => s),
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            title: (items) => {
              const code = items[0].label
              return `${code} — ${SECTION_LABELS[code] ?? code}`
            },
            label: (item) => ` ${item.dataset.label}: ${fmt1(item.parsed.y as number)}%`,
          },
        },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: '%' } },
      },
    },
  })
}

onMounted(() => { if (data.value) drawSectorChart() })
watch(data, () => drawSectorChart())
watch(subset, () => drawSectorChart())
onBeforeUnmount(() => { if (sectorChart) sectorChart.destroy() })

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt1(n: number): string {
  return (Math.round(n * 10) / 10).toLocaleString('fr-FR', { maximumFractionDigits: 1 })
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.secteurs-page {
  min-height: 100vh;
  background: var(--background-default-grey);
}

/* ── Filter bar ── */
.filters-bar {
  background: #fff;
  border-top: 1px solid var(--border-default-grey);
  border-bottom: 1px solid var(--border-default-grey);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.65rem 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.filters-bar__inner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.filters-bar__label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-mention-grey);
  flex-shrink: 0;
}

.filter-group {
  flex: 1;
  min-width: 140px;
  max-width: 230px;
}

.filter-select { margin-bottom: 0 !important; }

.filter-group--period {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: unset;
  max-width: unset;
  flex: 0 0 auto;
}

.period-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-mention-grey);
  white-space: nowrap;
}

.period-btns {
  display: flex;
  gap: 0.25rem;
}

.period-btn {
  font-size: 0.78rem;
  padding: 0.2em 0.65em;
  border: 1px solid var(--border-default-grey);
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  color: var(--text-default-grey);
  transition: background 0.15s, color 0.15s;
}

.period-btn:hover {
  background: var(--background-alt-blue-france);
}

.period-btn--active {
  background: #000091;
  color: #fff;
  border-color: #000091;
}

.filters-bar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.filters-bar__subset-count {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-action-high-blue-france);
}

.filters-bar__clear {
  font-size: 0.8rem;
  color: var(--text-action-high-blue-france);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

/* ── Sections ── */
.stat-section {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 1.75rem;
  margin-bottom: 1.5rem;
}

.stat-section__title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 1.25rem;
}

.stat-section__subtitle {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text-mention-grey);
}

.stat-section__hint {
  color: var(--text-mention-grey);
}

/* ── KPI grid ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.kpi-card {
  border: 1px solid var(--border-default-grey);
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.kpi-card__label {
  font-size: 0.75rem;
  color: var(--text-mention-grey);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.kpi-card__value {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  color: #000091;
}

.kpi-card__subset {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #ff6f00;
}

.kpi-card__delta {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.15em 0.4em;
  border-radius: 3px;
  align-self: flex-start;
}
.delta--pos { background: #dffee6; color: #1f8d49; }
.delta--neg { background: #ffe8e8; color: #ce0500; }
.delta--zero { background: #f2f2f2; color: var(--text-mention-grey); }

/* ── Chart ── */
.chart-wrapper {
  max-height: 420px;
}

/* ── Themes ── */
.themes-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.theme-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-row__name {
  width: 120px;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 600;
}

.theme-row__bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.theme-bar-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  height: 16px;
}

.theme-bar {
  height: 12px;
  border-radius: 2px;
  transition: width 0.3s ease;
  min-width: 2px;
}

.theme-bar--global { background: #000091; opacity: 0.7; }
.theme-bar--subset { background: #ff6f00; }

.theme-bar__pct {
  font-size: 0.75rem;
  color: var(--text-mention-grey);
  width: 40px;
  flex-shrink: 0;
}

.theme-delta {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.1em 0.35em;
  border-radius: 3px;
}
.theme-delta--pos { background: #dffee6; color: #1f8d49; }
.theme-delta--neg { background: #ffe8e8; color: #ce0500; }

.themes-legend {
  margin-top: 0.75rem;
  font-size: 0.78rem;
  color: var(--text-mention-grey);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
.legend-dot--global { background: #000091; opacity: 0.7; }
.legend-dot--subset { background: #ff6f00; }
.legend-dot--delta { background: #dffee6; border: 1px solid #1f8d49; }

/* ── Content table ── */
.content-table-wrap {
  overflow-x: auto;
}

.content-table {
  width: 100%;
  font-size: 0.85rem;
}

.type-badge {
  font-size: 0.7rem;
  padding: 0.15em 0.45em;
  border-radius: 3px;
  font-weight: 600;
}
.type-badge--program { background: #e3e3fd; color: #000091; }
.type-badge--project { background: #dffee6; color: #1f8d49; }

.ratio-badge {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.15em 0.4em;
  border-radius: 3px;
}
.ratio-badge--high { background: #fff3cd; color: #695240; }
.ratio-badge--mid { background: #f2f2f2; color: var(--text-default-grey); }
.ratio-badge--low { background: #ffe8e8; color: #ce0500; }

.content-table__expand {
  text-align: center;
  margin-top: 0.75rem;
}

.expand-btn {
  font-size: 0.82rem;
  color: var(--text-action-high-blue-france);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.generated-at {
  color: var(--text-mention-grey);
  text-align: right;
}
</style>
