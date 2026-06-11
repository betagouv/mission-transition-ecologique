<template>
  <div class="leads-page">
    <!-- Main content -->
    <div class="leads-header">
      <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--middle fr-py-3w">
          <div class="fr-col">
            <h1 class="fr-h3 fr-mb-0">
              Leads —
              <span class="leads-date">{{ latestDate }}</span>
            </h1>
            <p
              v-if="data"
              class="fr-text--sm fr-mb-0 leads-subtitle"
            >
              {{ data.length }} entreprise{{ data.length > 1 ? 's' : '' }} ont saisi leur SIRET sans envoyer de formulaire
            </p>
          </div>
          <div class="fr-col-auto">
            <span class="fr-badge fr-badge--info fr-badge--no-icon"> {{ data?.length ?? 0 }} lead(s) </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter bar -->
    <div
      v-if="data && data.length"
      class="filters-bar"
    >
      <div class="fr-container">
        <div class="filters-bar__inner">
          <span class="filters-bar__label">Filtres</span>

          <!-- NAF: Section -->
          <div class="filter-group">
            <select
              v-model="filters.nafSection"
              class="fr-select filter-select"
              @change="filters.nafDivision = ''; filters.nafGroup = ''"
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

          <!-- NAF: Division (shown when section selected) -->
          <div
            v-if="filters.nafSection && availableDivisions.length > 1"
            class="filter-group"
          >
            <select
              v-model="filters.nafDivision"
              class="fr-select filter-select"
              @change="filters.nafGroup = ''"
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

          <!-- NAF: Group (shown when division selected) -->
          <div
            v-if="filters.nafDivision && availableGroups.length > 1"
            class="filter-group"
          >
            <select
              v-model="filters.nafGroup"
              class="fr-select filter-select"
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

          <!-- Region -->
          <div class="filter-group">
            <select
              v-model="filters.region"
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
              v-model="filters.size"
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

          <!-- Results count + clear -->
          <div class="filters-bar__actions">
            <span class="filters-bar__count"> {{ filteredLeads.length }} / {{ sortedLeads.length }} lead(s) </span>
            <button
              v-if="activeFilterCount > 0"
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
      <!-- Loading / error states -->
      <div
        v-if="pending"
        class="fr-py-8w fr-grid-row fr-grid-row--center"
      >
        <div class="fr-col-auto">
          <div class="fr-text--center">
            <span class="fr-icon-refresh-line fr-icon--lg" />
            <p class="fr-mt-2w">Chargement des leads…</p>
          </div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="fr-alert fr-alert--error fr-mb-4w"
      >
        <p>Impossible de charger les leads. Vérifiez que le fichier JSON est bien configuré.</p>
      </div>

      <div
        v-else-if="data && data.length === 0"
        class="fr-alert fr-alert--info"
      >
        <p>Aucun lead pour cette date.</p>
      </div>

      <div
        v-else-if="data && filteredLeads.length === 0"
        class="fr-alert fr-alert--warning fr-mb-4w"
      >
        <p>Aucun lead ne correspond aux filtres sélectionnés.</p>
      </div>

      <!-- Lead cards -->
      <div
        v-else-if="data"
        class="leads-grid"
      >
        <div
          v-for="lead in filteredLeads"
          :key="lead.siret"
          class="lead-card"
        >
          <!-- Card header -->
          <div class="lead-card__header">
            <div class="lead-card__identity">
              <p
                v-if="lead.denomination"
                class="lead-card__denomination"
              >
                {{ lead.denomination }}
              </p>
              <p class="lead-card__siret">SIRET {{ lead.siret }}</p>
              <!-- Line 1: region + size + time -->
              <div class="lead-card__meta">
                <span
                  v-if="lead.region"
                  class="fr-badge fr-badge--no-icon lead-badge lead-badge--region"
                >
                  <span class="fr-icon-map-pin-2-line fr-icon--xs fr-mr-1v" />
                  {{ lead.region }}
                </span>
                <span class="fr-badge fr-badge--no-icon lead-badge lead-badge--size">
                  {{ formatWorkforce(lead.workforce_min, lead.workforce_max) }}
                </span>
                <span class="fr-badge fr-badge--no-icon lead-badge lead-badge--time">
                  <span class="fr-icon-timer-line fr-icon--xs fr-mr-1v" />
                  {{ formatDuration(lead.time_spent_minutes) }} sur le site
                </span>
              </div>
              <!-- Line 2: NAF code + label -->
              <div class="lead-card__meta fr-mt-1v">
                <span class="fr-badge fr-badge--no-icon lead-badge lead-badge--sector">
                  {{ formatNaf(lead.naf_section, lead.naf_code) }}
                  <span
                    v-if="nafLabel(lead.naf_code)"
                    class="lead-naf-label"
                    >— {{ nafLabel(lead.naf_code) }}</span
                  >
                </span>
              </div>
            </div>
            <div class="lead-card__dates">
              <p class="fr-text--xs fr-mb-0 lead-card__date-label">Première visite</p>
              <p class="fr-text--sm fr-mb-0 lead-card__date-value">{{ formatTime(lead.first_seen) }}</p>
              <p class="fr-text--xs fr-mb-0 fr-mt-1v lead-card__date-label">Dernière activité</p>
              <p class="fr-text--sm fr-mb-0 lead-card__date-value">{{ formatTime(lead.last_seen) }}</p>
            </div>
          </div>

          <!-- Themes -->
          <div
            v-if="lead.themes.length"
            class="lead-card__section"
          >
            <p class="lead-card__section-title">Thèmes explorés</p>
            <div class="lead-card__tags">
              <span
                v-for="{ theme, count } in sortedThemeCounts(lead)"
                :key="theme"
                class="fr-badge fr-badge--no-icon lead-badge lead-badge--theme"
              >
                {{ theme }}
                <span class="theme-count">{{ count }}</span>
              </span>
            </div>
          </div>

          <!-- Content visited -->
          <div
            v-if="lead.content_visited.length"
            class="lead-card__section"
          >
            <p class="lead-card__section-title">Programmes &amp; projets consultés</p>
            <div class="lead-card__tags">
              <a
                v-for="item in visibleContent(lead)"
                :key="item.slug"
                :href="item.path"
                target="_blank"
                rel="noopener"
                class="lead-content-tag"
                :class="item.type === 'program' ? 'lead-content-tag--program' : 'lead-content-tag--project'"
              >
                <span class="lead-content-tag__type">{{ item.type === 'program' ? 'Aide' : 'Projet' }}</span>
                {{ item.title }}
                <span class="fr-icon-external-link-line fr-icon--xs" />
              </a>
            </div>
            <button
              v-if="lead.content_visited.length > CONTENT_PREVIEW"
              class="lead-card__show-more"
              @click="toggleContent(lead.siret)"
            >
              {{ expandedContent.has(lead.siret) ? 'Voir moins' : `+ ${lead.content_visited.length - CONTENT_PREVIEW} de plus` }}
            </button>
          </div>

          <!-- Contact -->
          <div class="lead-card__contact">
            <p class="lead-card__section-title">Contact entreprise</p>
            <p class="lead-card__activity">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Activité principale de l'entreprise à compléter par l'IA après
              recherche internet.
            </p>
            <div class="lead-card__contact-actions">
              <a
                :href="`tel:${lead.contact.phone.replace(/\s/g, '')}`"
                class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-phone-line"
              >
                {{ lead.contact.phone }}
              </a>
              <a
                :href="`mailto:${lead.contact.email}`"
                class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-mail-line"
              >
                {{ lead.contact.email }}
              </a>
            </div>
          </div>

          <!-- Actions (expandable) -->
          <div class="lead-card__actions-section">
            <button
              class="lead-card__toggle"
              :aria-expanded="expandedLeads.has(lead.siret)"
              @click="toggleLead(lead.siret)"
            >
              <span
                class="fr-icon-arrow-right-s-line"
                :class="{ rotated: expandedLeads.has(lead.siret) }"
              />
              {{ expandedLeads.has(lead.siret) ? 'Masquer' : 'Voir' }} toutes les actions
              <span class="lead-card__action-count">({{ lead.actions.length }})</span>
            </button>

            <div
              v-if="expandedLeads.has(lead.siret)"
              class="lead-card__actions-list"
            >
              <div
                v-for="(action, idx) in lead.actions"
                :key="idx"
                class="lead-action"
                :class="`lead-action--${getEventClass(action.event)}`"
              >
                <span class="lead-action__time">{{ formatTime(action.datetime) }}</span>
                <span class="lead-action__label">{{ action.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { nafMapping } from '@tee/data/static'

type NafEntry = { NIV1: string; NIV2: string; NIV3: string; NIV4: string; NIV5: string; label_vf: string }
const nafData = nafMapping as NafEntry[]

// label lookups by code level
const NAF_LOOKUP = Object.fromEntries(nafData.map((e) => [e.NIV5, e.label_vf]))
const NAF_FULL = Object.fromEntries(nafData.map((e) => [e.NIV5, e]))

// First label seen per division / group (for display)
const NAF_DIV_LABEL: Record<string, string> = {}
const NAF_GRP_LABEL: Record<string, string> = {}
for (const e of nafData) {
  if (!NAF_DIV_LABEL[e.NIV2]) NAF_DIV_LABEL[e.NIV2] = e.label_vf.substring(0, 48) + '…'
  if (!NAF_GRP_LABEL[e.NIV3]) NAF_GRP_LABEL[e.NIV3] = e.label_vf.substring(0, 48) + '…'
}

const NAF_SECTION_LABELS: Record<string, string> = {
  A: 'Agriculture, sylviculture et pêche',
  B: 'Industries extractives',
  C: 'Industrie manufacturière',
  D: 'Électricité, gaz, vapeur et air conditionné',
  E: 'Eau, assainissement, gestion des déchets',
  F: 'Construction',
  G: 'Commerce, réparation automobile',
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
  T: "Ménages en tant qu'employeurs",
  U: 'Activités extra-territoriales'
}

// ─── Size buckets ───────────────────────────────────────────────────────────

interface SizeBucket {
  key: string
  label: string
  test: (min: number | null, max: number | null) => boolean
}

const SIZE_BUCKETS: SizeBucket[] = [
  { key: 'unknown', label: 'Taille inconnue', test: (min) => min === null },
  { key: '0', label: 'Sans salarié', test: (min, max) => min === 0 && max === 0 },
  { key: 'micro', label: '1-9 salariés', test: (min, max) => min !== null && min >= 1 && (max ?? 0) <= 9 },
  { key: 'small', label: '10-49 salariés', test: (min, max) => min !== null && min >= 10 && (max ?? 0) <= 49 },
  { key: 'medium', label: '50-249 salariés', test: (min, max) => min !== null && min >= 50 && (max ?? 0) <= 249 },
  { key: 'large', label: '250-499 salariés', test: (min, max) => min !== null && min >= 250 && (max ?? 0) <= 499 },
  // eslint-disable-next-line unused-imports/no-unused-vars
  { key: 'xlarge', label: '500+ salariés', test: (min, max) => min !== null && min >= 500 }
]

definePageMeta({
  path: '/leads',
  layout: false
})

useHead({ title: 'Leads — TEE' })

// ─── Data fetching ─────────────────────────────────────────────────────────

const { data, pending, error } = useFetch<Lead[]>('/api/leads')

watch(error, (err) => {
  if (err) {
    console.error('Failed to load leads', err)
  }
})

// ─── UI state ──────────────────────────────────────────────────────────────

const expandedLeads = ref<Set<string>>(new Set())
const expandedContent = ref<Set<string>>(new Set())
const CONTENT_PREVIEW = 4

function toggleLead(siret: string) {
  const next = new Set(expandedLeads.value)
  next.has(siret) ? next.delete(siret) : next.add(siret)
  expandedLeads.value = next
}

function toggleContent(siret: string) {
  const next = new Set(expandedContent.value)
  next.has(siret) ? next.delete(siret) : next.add(siret)
  expandedContent.value = next
}

function visibleContent(lead: Lead) {
  return expandedContent.value.has(lead.siret) ? lead.content_visited : lead.content_visited.slice(0, CONTENT_PREVIEW)
}

// ─── Formatting ────────────────────────────────────────────────────────────

const latestDate = computed(() => data.value?.[0]?.date ?? '…')

const sortedLeads = computed(() => [...(data.value ?? [])].sort((a, b) => b.actions.length - a.actions.length))

// ─── Filters ────────────────────────────────────────────────────────────────

const filters = reactive({ nafSection: '', nafDivision: '', nafGroup: '', region: '', size: '' })

function clearFilters() {
  filters.nafSection = ''
  filters.nafDivision = ''
  filters.nafGroup = ''
  filters.region = ''
  filters.size = ''
}

const activeFilterCount = computed(
  () => [filters.nafSection, filters.nafDivision, filters.nafGroup, filters.region, filters.size].filter(Boolean).length
)

// Helpers to get NAF hierarchy codes from a lead's naf_code
function getNafEntry(code: string) {
  return NAF_FULL[code]
}

const availableSections = computed(() => {
  const codes = new Set(sortedLeads.value.map((l) => l.naf_section).filter(Boolean))
  return [...codes].sort().map((code) => ({ code, label: NAF_SECTION_LABELS[code] ?? code }))
})

const availableDivisions = computed(() => {
  if (!filters.nafSection) return []
  const codes = new Set(
    sortedLeads.value
      .filter((l) => l.naf_section === filters.nafSection)
      .map((l) => getNafEntry(l.naf_code)?.NIV2)
      .filter(Boolean) as string[]
  )
  return [...codes].sort().map((code) => ({ code, label: NAF_DIV_LABEL[code] ?? code }))
})

const availableGroups = computed(() => {
  if (!filters.nafDivision) return []
  const codes = new Set(
    sortedLeads.value
      .filter((l) => {
        const e = getNafEntry(l.naf_code)
        return e?.NIV1 === filters.nafSection && e?.NIV2 === filters.nafDivision
      })
      .map((l) => getNafEntry(l.naf_code)?.NIV3)
      .filter(Boolean) as string[]
  )
  return [...codes].sort().map((code) => ({ code, label: NAF_GRP_LABEL[code] ?? code }))
})

const availableRegions = computed(() => {
  const regions = new Set(sortedLeads.value.map((l) => l.region).filter(Boolean))
  return [...regions].sort()
})

const filteredLeads = computed(() => {
  return sortedLeads.value.filter((lead) => {
    if (filters.nafSection && lead.naf_section !== filters.nafSection) return false
    if (filters.nafDivision) {
      const e = getNafEntry(lead.naf_code)
      if (e?.NIV2 !== filters.nafDivision) return false
    }
    if (filters.nafGroup) {
      const e = getNafEntry(lead.naf_code)
      if (e?.NIV3 !== filters.nafGroup) return false
    }
    if (filters.region && lead.region !== filters.region) return false
    if (filters.size) {
      const bucket = SIZE_BUCKETS.find((b) => b.key === filters.size)
      if (bucket && !bucket.test(lead.workforce_min, lead.workforce_max)) return false
    }
    return true
  })
})

function sortedThemeCounts(lead: Lead): { theme: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const item of lead.content_visited) {
    for (const theme of item.themes) {
      counts[theme] = (counts[theme] ?? 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
}

function formatNaf(section: string, code: string): string {
  if (!section && !code) return 'Inconnu'
  if (section && code) return `NAF ${section}${code}`
  return `NAF ${section || code}`
}

function nafLabel(code: string): string {
  if (!code) return ''
  return NAF_LOOKUP[code] ?? ''
}

function formatWorkforce(min: number | null, max: number | null): string {
  if (min === null && max === null) return 'Taille inconnue'
  if (min === 0 && max === 0) return 'Sans salarié'
  if (min === 1 && max === 1) return '1 salarié'
  if (max !== null && max >= 10000) return `${min?.toLocaleString('fr-FR')}+ salariés`
  if (min !== null && max !== null) return `${min}-${max} salariés`
  return 'Taille inconnue'
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

function getEventClass(event: string): string {
  if (event === '$pageview') return 'pageview'
  if (event === 'detail_page_view') return 'detail'
  if (event.startsWith('send_')) return 'form'
  if (event === 'external_link_clicked_v2') return 'click'
  if (event.startsWith('register_')) return 'siret'
  return 'other'
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface ContentItem {
  type: 'program' | 'project'
  title: string
  slug: string
  path: string
  themes: string[]
}

interface Lead {
  date: string
  siret: string
  denomination: string
  naf_section: string
  naf_code: string
  region: string
  workforce_min: number | null
  workforce_max: number | null
  first_seen: string
  last_seen: string
  time_spent_minutes: number
  themes: string[]
  content_visited: ContentItem[]
  contact: { phone: string; email: string }
  actions: { datetime: string; event: string; label: string }[]
}
</script>

<style scoped>
.leads-page {
  min-height: 100vh;
  background: var(--background-default-grey);
}

/* Header */
.leads-header {
  background: #000091;
}
.leads-header h1,
.leads-header .leads-date {
  color: #fff !important;
  font-weight: 700;
}
.leads-date {
  font-weight: 400;
}
.leads-subtitle {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Grid */
.leads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(520px, 1fr));
  gap: 1.5rem;
}

/* Card */
.lead-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid var(--border-default-grey);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.lead-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid var(--border-default-grey);
  gap: 1rem;
}

.lead-card__denomination {
  font-size: 1.05rem;
  font-weight: 700;
  color: #000091;
  margin-bottom: 0.1rem;
}
.lead-card__siret {
  font-size: 0.8rem;
  color: var(--text-mention-grey);
  margin-bottom: 0.5rem;
  font-family: monospace;
}

.lead-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.lead-card__dates {
  text-align: right;
  flex-shrink: 0;
}

.lead-card__date-label {
  color: var(--text-mention-grey);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.lead-card__date-value {
  font-weight: 600;
  color: var(--text-default-grey);
}

/* Sections */
.lead-card__section {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-default-grey);
}

.lead-card__section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-mention-grey);
  margin-bottom: 0.6rem;
}

.lead-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

/* Badges */
.lead-badge {
  font-size: 0.75rem !important;
}
.lead-badge--region {
  background: #f0f0ff;
  color: #000091;
}
.lead-badge--size {
  background: #e5f0ff;
  color: #003189;
}
.lead-badge--sector {
  background: #fff4e5;
  color: #716043;
  max-width: 100%;
  white-space: normal;
  height: auto;
  line-height: 1.4;
  padding: 0.3rem 0.6rem;
}
.lead-naf-label {
  font-weight: 400;
  font-style: italic;
  opacity: 0.85;
}
.lead-badge--time {
  background: #e8f5e9;
  color: #1a6335;
}
.lead-badge--theme {
  background: #f0e6ff;
  color: #5e35b1;
  gap: 0.4rem;
}
.theme-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #5e35b1;
  color: #fff;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 1.2rem;
  height: 1.2rem;
  padding: 0 0.3rem;
}

/* Content tags */
.lead-content-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  border-radius: 3px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.15s;
  border: 1px solid transparent;
}
.lead-content-tag:hover {
  opacity: 0.8;
  text-decoration: none;
}
.lead-content-tag--program {
  background: #e8edff;
  color: #000091;
  border-color: #b6c0f5;
}
.lead-content-tag--project {
  background: #e3f4ec;
  color: #1a6335;
  border-color: #a8d5b8;
}
.lead-content-tag__type {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.lead-card__show-more {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  color: #000091;
  padding: 0.3rem 0;
  margin-top: 0.4rem;
  text-decoration: underline;
}
.lead-card__show-more:hover {
  color: #1212ff;
}

/* Contact */
.lead-card__activity {
  font-size: 0.85rem;
  color: var(--text-mention-grey);
  font-style: italic;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}
.lead-card__contact {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-default-grey);
  background: #f9f9f9;
}
.lead-card__contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* Actions toggle */
.lead-card__actions-section {
  padding: 0.75rem 1.5rem;
}

.lead-card__toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #000091;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  transition: color 0.15s;
}
.lead-card__toggle:hover {
  color: #1212ff;
}
.lead-card__toggle .fr-icon-arrow-right-s-line {
  transition: transform 0.2s;
}
.lead-card__toggle .rotated {
  transform: rotate(90deg);
}
.lead-card__action-count {
  font-weight: 400;
  color: var(--text-mention-grey);
}

/* Actions list */
.lead-card__actions-list {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.lead-action {
  display: flex;
  gap: 0.75rem;
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  border-left: 3px solid transparent;
}
.lead-action__time {
  flex-shrink: 0;
  font-weight: 600;
  color: var(--text-mention-grey);
  font-variant-numeric: tabular-nums;
  width: 3rem;
}
.lead-action__label {
  color: var(--text-default-grey);
  word-break: break-word;
}

.lead-action--pageview {
  background: #f5f5ff;
  border-color: #c5c5f5;
}
.lead-action--detail {
  background: #e8edff;
  border-color: #000091;
}
.lead-action--click {
  background: #fff4e5;
  border-color: #d4aa70;
}
.lead-action--siret {
  background: #e8f5e9;
  border-color: #4caf50;
}
.lead-action--form {
  background: #fce4ec;
  border-color: #e91e63;
}
.lead-action--other {
  background: #f5f5f5;
  border-color: #ccc;
}

/* Filter bar */
.filters-bar {
  background: #fff;
  border-bottom: 1px solid var(--border-default-grey);
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.filters-bar__inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filters-bar__label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-mention-grey);
  flex-shrink: 0;
}

.filter-group {
  flex: 1;
  min-width: 160px;
  max-width: 260px;
}

.filter-select {
  font-size: 0.82rem !important;
  padding: 0.35rem 2rem 0.35rem 0.6rem !important;
  height: auto !important;
  min-height: unset !important;
  background-size: 1rem !important;
}

.filters-bar__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
  flex-shrink: 0;
}

.filters-bar__count {
  font-size: 0.82rem;
  color: var(--text-mention-grey);
  white-space: nowrap;
}

.filters-bar__clear {
  background: none;
  border: 1px solid var(--border-default-grey);
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
  cursor: pointer;
  color: #c9191e;
  transition: background 0.15s;
  white-space: nowrap;
}
.filters-bar__clear:hover {
  background: #fff0f0;
}

@media (max-width: 768px) {
  .leads-grid {
    grid-template-columns: 1fr;
  }
  .lead-card__header {
    flex-direction: column;
  }
  .lead-card__dates {
    text-align: left;
  }
  .filter-group {
    min-width: 140px;
    max-width: 100%;
    flex: 1 1 140px;
  }
  .filters-bar__actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
