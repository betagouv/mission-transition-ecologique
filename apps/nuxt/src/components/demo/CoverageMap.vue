<template>
  <div class="coverage-map">
    <div
      v-if="!geojson"
      class="coverage-map__loading fr-text--sm fr-text--mention"
    >
      Chargement de la carte…
    </div>
    <svg
      v-else
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      class="coverage-map__svg"
      aria-label="Carte de couverture des aides par région"
      role="img"
    >
      <g
        v-for="feature in features"
        :key="feature.name"
      >
        <path
          v-for="(pathD, i) in feature.paths"
          :key="i"
          :d="pathD"
          :fill="levelColor(feature.level)"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linejoin="round"
          class="region-path"
          :class="{ 'region-path--active': hoveredRegion === feature.name }"
          @mouseenter="hoveredRegion = feature.name"
          @mouseleave="hoveredRegion = null"
        />
      </g>

      <!-- Tooltip -->
      <g
        v-if="hoveredFeature"
        :transform="`translate(${tooltip.x}, ${tooltip.y})`"
        class="map-tooltip"
        pointer-events="none"
      >
        <rect
          x="-4"
          y="-18"
          :width="tooltipWidth"
          :height="26 + Math.min(hoveredFeature.programs.length, 4) * 13 + 8"
          rx="3"
          fill="rgba(0,0,0,0.75)"
        />
        <text
          x="4"
          y="-4"
          fill="#fff"
          font-size="11"
          font-weight="600"
        >
          {{ hoveredFeature.name }}
        </text>
        <text
          x="4"
          y="11"
          fill="#ddd"
          font-size="10"
        >
          {{ hoveredFeature.programs.length }} programme{{ hoveredFeature.programs.length !== 1 ? 's' : '' }}
        </text>
        <text
          v-for="(prog, idx) in hoveredFeature.programs.slice(0, 4)"
          :key="prog.id"
          x="4"
          :y="26 + idx * 13"
          fill="#fff"
          font-size="9"
        >
          · {{ prog.title.length > 38 ? prog.title.slice(0, 38) + '…' : prog.title }}
        </text>
        <text
          v-if="hoveredFeature.programs.length > 4"
          x="4"
          :y="26 + 4 * 13"
          fill="#aaa"
          font-size="9"
        >
          + {{ hoveredFeature.programs.length - 4 }} autres…
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { RegionCoverage, CoverageLevel } from '@/composables/useCoverage'

const props = defineProps<{
  coverageByRegion: RegionCoverage[]
}>()

const VIEW_W = 560
const VIEW_H = 520

interface GeoFeature {
  type: 'Feature'
  properties: { code: string; nom: string }
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

interface GeoJSON {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

const geojson = ref<GeoJSON | null>(null)
const hoveredRegion = ref<string | null>(null)

onMounted(async () => {
  const res = await fetch('/regions.geojson')
  geojson.value = await res.json()
})

// ── Projection ──────────────────────────────────────────────────────────────

interface BBox {
  minLon: number
  maxLon: number
  minLat: number
  maxLat: number
}

function computeBbox(features: GeoFeature[]): BBox {
  let minLon = Infinity,
    maxLon = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity
  for (const f of features) {
    const rings =
      f.geometry.type === 'Polygon' ? (f.geometry.coordinates as number[][][]) : (f.geometry.coordinates as number[][][][]).flat()
    for (const ring of rings) {
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon
        if (lon > maxLon) maxLon = lon
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
    }
  }
  return { minLon, maxLon, minLat, maxLat }
}

function makeProjector(bbox: BBox, padding = 20) {
  const meanLat = (bbox.minLat + bbox.maxLat) / 2
  const cosLat = Math.cos((meanLat * Math.PI) / 180)
  const lonRange = (bbox.maxLon - bbox.minLon) * cosLat
  const latRange = bbox.maxLat - bbox.minLat
  const scaleX = (VIEW_W - padding * 2) / lonRange
  const scaleY = (VIEW_H - padding * 2) / latRange
  const scale = Math.min(scaleX, scaleY)
  const offsetX = padding + (VIEW_W - padding * 2 - lonRange * scale) / 2
  const offsetY = padding + (VIEW_H - padding * 2 - latRange * scale) / 2
  return (lon: number, lat: number): [number, number] => [
    offsetX + (lon - bbox.minLon) * cosLat * scale,
    offsetY + (bbox.maxLat - lat) * scale
  ]
}

function ringToPath(ring: number[][], project: (lon: number, lat: number) => [number, number]): string {
  return (
    ring
      .map(([lon, lat], i) => {
        const [x, y] = project(lon, lat)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join('') + 'Z'
  )
}

// ── Derived features ─────────────────────────────────────────────────────────

const coverageMap = computed(() => {
  const map = new Map<string, RegionCoverage>()
  for (const r of props.coverageByRegion) map.set(r.region, r)
  return map
})

const features = computed(() => {
  if (!geojson.value) return []
  const bbox = computeBbox(geojson.value.features)
  const project = makeProjector(bbox)

  return geojson.value.features.map((f) => {
    const name = f.properties.nom
    const regionCov = coverageMap.value.get(name)
    const level: CoverageLevel = regionCov?.level ?? 'none'

    const polygons = f.geometry.type === 'Polygon' ? [f.geometry.coordinates as number[][][]] : (f.geometry.coordinates as number[][][][])

    const paths = polygons.map((poly) => poly.map((ring) => ringToPath(ring, project)).join(''))
    // centroid of first polygon for tooltip anchor
    const firstRing = polygons[0][0]
    const cx = firstRing.reduce((s, c) => s + c[0], 0) / firstRing.length
    const cy = firstRing.reduce((s, c) => s + c[1], 0) / firstRing.length
    const [tx, ty] = project(cx, cy)

    return { name, level, paths, programs: regionCov?.programs ?? [], cx: tx, cy: ty }
  })
})

const hoveredFeature = computed(() => features.value.find((f) => f.name === hoveredRegion.value) ?? null)

const tooltip = computed(() => {
  if (!hoveredFeature.value) return { x: 0, y: 0 }
  const x = Math.min(hoveredFeature.value.cx, VIEW_W - 160)
  const y = Math.max(hoveredFeature.value.cy - 10, 80)
  return { x, y }
})

const tooltipWidth = computed(() => {
  if (!hoveredFeature.value) return 0
  return 230
})

// ── Colors ────────────────────────────────────────────────────────────────────

function levelColor(level: CoverageLevel): string {
  const colors: Record<CoverageLevel, string> = {
    none: '#c9191e',
    'financement-gap': '#e4794a',
    'type-gap': '#d1b000',
    covered: '#18753c'
  }
  return colors[level] ?? '#e5e5e5'
}
</script>

<style scoped>
.coverage-map {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}
.coverage-map__svg {
  width: 100%;
  height: auto;
  display: block;
}
.region-path {
  transition: opacity 0.15s;
  cursor: pointer;
}
.region-path--active {
  opacity: 0.8;
  stroke-width: 2.5;
}
</style>
