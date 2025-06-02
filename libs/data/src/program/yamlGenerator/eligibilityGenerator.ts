import { LogLevel } from '../../common/logger/types'
import { DataProgram } from '../types/domain'
import { CoreGenerator } from './coreGenerator'
import { ProgramEligibility } from '../programEligibility'
import { LinkValidator } from '../../common/validators/linkValidator'

export async function setEligibility(generator: CoreGenerator) {
  const eligibility_conditions: { [key: string]: string[] } = {
    "taille de l'entreprise": [setEligibilitySize(generator.program), setMicroEntrepreneur(generator.program)],
    'secteur géographique': setEligibilityGeography(generator),
    "secteur d'activité": setEligibilitySector(generator),
    "nombre d'années d'activité": setEligibilityYears(generator.program)
  }
  if (generator.program['Eligibilité Spécifique']) {
    const otherEligibilities = await setOtherEligibilityCriteria(generator)
    if (otherEligibilities.length) {
      eligibility_conditions["autres critères d'éligibilité"] = otherEligibilities
    }
  }
  generator.yamlContent["conditions d'éligibilité"] = eligibility_conditions
}

async function setOtherEligibilityCriteria(generator: CoreGenerator): Promise<string[]> {
  const invalidLinks = await LinkValidator.findAndValidateLinks(generator.program['Eligibilité Spécifique'])
  for (const link of invalidLinks) {
    generator.logger.log(
      LogLevel.Minor,
      `Lien invalide détecté dans le champ "éligibilité spécifique" : ${link}`,
      generator.program['Id fiche dispositif'],
      generator.program.id
    )
  }

  const criteriaList = generator.program['Eligibilité Spécifique'].split('\n').map((criteria) => criteria.trim())
  if (criteriaList.filter((criteria) => !criteria.startsWith('- ')).length) {
    generator.logger.log(
      LogLevel.Major,
      'Problème de format du champ "éligibilité spécifique" qui doit être une liste !',
      generator.program['Id fiche dispositif'],
      generator.program.id,
      criteriaList
    )
    return []
  }
  return criteriaList.map((criteria) => criteria.substring(2))
}

function setEligibilityYears(program: DataProgram): string[] {
  if (program['Eligibilité Existence']) {
    return [program['Eligibilité Existence']]
  }
  return [ProgramEligibility.ELIGIBLE_FOR_ALL]
}

function setEligibilitySector(generator: CoreGenerator) {
  if (!generator.program['Eligibilité Sectorielle']) {
    generator.logger.log(
      LogLevel.Critic,
      'Eligibilité sectorielle manquante.',
      generator.program['Id fiche dispositif'],
      generator.program.id
    )
    generator.valid = false
  }
  if (generator.program['Eligibilité Naf']) {
    return [generator.program['Eligibilité Sectorielle'], generator.program['Eligibilité Naf']]
  }
  return [generator.program['Eligibilité Sectorielle']]
}

function setEligibilityGeography(generator: CoreGenerator) {
  if (generator.program['Couverture géographique'].Name == 'National') return ["France et territoires d'outre-mer"]

  if (generator.program['Zones Spécifiques (géographie)']) {
    generator.logger.log(
      LogLevel.Major,
      "Le champ zone géographique a été abandonné et n'est plus affiché. Merci de convertir la condition en un point de la liste du champ 'Eligibilité spécifique'",
      generator.program['Id fiche dispositif'],
      generator.program.id,
      generator.program['Zones Spécifiques (géographie)']
    )
  }

  return [
    generator.program['Zones géographiques']
      .map((geographicArea) => geographicArea.Name)
      .sort((a, b) => a.localeCompare(b, 'fr-FR'))
      .join(', ')
  ]
}

function setEligibilitySize(program: DataProgram): string {
  if (program['Eligibilité Taille']) {
    return program['Eligibilité Taille']
  }
  const minimumStaff = program.minEff
  const maximumStaff = program.maxEff
  if (minimumStaff && maximumStaff) {
    return `Effectif compris entre ${minimumStaff} et ${maximumStaff} employés`
  } else if (minimumStaff) {
    return `Effectif supérieur à ${minimumStaff} employés`
  } else if (maximumStaff) {
    return `Effectif inférieur à ${maximumStaff} employés`
  } else {
    return 'Toutes tailles'
  }
}

function setMicroEntrepreneur(program: DataProgram) {
  if (program.microEntrepreneur === 'oui') {
    return 'Éligible aux micro-entreprises'
  }
  return 'Non éligible aux micro-entreprises'
}
