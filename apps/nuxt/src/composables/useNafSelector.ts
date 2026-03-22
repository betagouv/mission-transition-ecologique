interface NafCode {
  NIV5: string
  NIV4: string
  NIV3: string
  NIV2: string
  NIV1: string
  label_vf: string
}

const NAF_SECTION_LABELS: Record<string, string> = {
  A: "Agriculture, sylviculture et pêche",
  B: "Industries extractives",
  C: "Industrie manufacturière",
  D: "Production et distribution d'électricité, gaz",
  E: "Production et distribution d'eau",
  F: "Construction",
  G: "Commerce",
  H: "Transports et entreposage",
  I: "Hébergement et restauration",
  J: "Information et communication",
  K: "Activités financières et d'assurance",
  L: "Activités immobilières",
  M: "Activités spécialisées, scientifiques et techniques",
  N: "Activités de services administratifs et de soutien",
  O: "Administration publique",
  P: "Enseignement",
  Q: "Santé humaine et action sociale",
  R: "Arts, spectacles et activités récréatives",
  S: "Autres activités de services",
  T: "Activités des ménages",
  U: "Activités extra-territoriales"
}

export const useNafSelector = () => {
  const nafCodes = ref<NafCode[]>([])

  onMounted(async () => {
    // eslint-disable-next-line @nx/enforce-module-boundaries
    const data = await import('../../../../libs/data/static/nafMapping.json')
    nafCodes.value = data.default as NafCode[]
  })

  const selectedSection = ref('')
  const selectedDivision = ref('')
  const selectedCode = ref('')

  const selectedNaf = computed(() => selectedCode.value || selectedDivision.value || selectedSection.value)

  const mainSections = computed(() => {
    const seen = new Map<string, { code: string; label: string }>()
    nafCodes.value.forEach((c) => {
      if (!seen.has(c.NIV1)) seen.set(c.NIV1, { code: c.NIV1, label: NAF_SECTION_LABELS[c.NIV1] || c.NIV1 })
    })
    return Array.from(seen.values()).sort((a, b) => a.code.localeCompare(b.code))
  })

  const filteredDivisions = computed(() => {
    if (!selectedSection.value) return []
    const seen = new Map<string, NafCode>()
    nafCodes.value
      .filter((c) => c.NIV1 === selectedSection.value)
      .forEach((c) => {
        if (!seen.has(c.NIV2)) {
          seen.set(c.NIV2, c)
        }
      })
    return Array.from(seen.values()).sort((a, b) => a.NIV2.localeCompare(b.NIV2))
  })

  const filteredCodes = computed(() => {
    if (!selectedDivision.value) return []
    return nafCodes.value
      .filter((c) => c.NIV2 === selectedDivision.value)
      .sort((a, b) => a.NIV5.localeCompare(b.NIV5))
  })

  const selectedNafLabel = computed(() => {
    if (!selectedNaf.value) return ''
    const map = new Map<string, NafCode>()
    nafCodes.value.forEach((c) => {
      map.set(c.NIV5, c)
      map.set(c.NIV4, c)
      map.set(c.NIV3, c)
      map.set(c.NIV2, c)
      map.set(c.NIV1, c)
    })
    return map.get(selectedNaf.value)?.label_vf || ''
  })

  const onSectionChange = () => {
    selectedDivision.value = ''
    selectedCode.value = ''
  }

  const onDivisionChange = () => {
    selectedCode.value = ''
  }

  return {
    selectedSection,
    selectedDivision,
    selectedCode,
    selectedNaf,
    selectedNafLabel,
    mainSections,
    filteredDivisions,
    filteredCodes,
    onSectionChange,
    onDivisionChange
  }
}
