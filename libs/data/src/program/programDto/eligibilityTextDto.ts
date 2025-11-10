import { LogLevel } from '../../common/logger/types'
import { DataProgram } from '../types/domain'
import { ProgramDto } from './programDto'
import { ProgramEligibility } from '../utils/shared/programEligibility'
import { LinkValidator } from '../../common/validators/linkValidator'

export async function setEligibilityTexts(generator: ProgramDto) {
  const eligibility_conditions: { [key: string]: string[] } = {
    "taille de l'entreprise": [setEligibilitySize(generator.rawProgram), setMicroEntrepreneur(generator.rawProgram)],
    'secteur géographique': setEligibilityGeography(generator),
    "secteur d'activité": setEligibilitySector(generator),
    "nombre d'années d'activité": setEligibilityYears(generator.rawProgram)
  }
  if (generator.rawProgram['Eligibilité Spécifique']) {
    const otherEligibilities = await setOtherEligibilityCriteria(generator)
    if (otherEligibilities.length) {
      eligibility_conditions["autres critères d'éligibilité"] = otherEligibilities
    }
  }
  generator.programData["conditions d'éligibilité"] = eligibility_conditions
}

async function setOtherEligibilityCriteria(generator: ProgramDto): Promise<string[]> {
  await LinkValidator.logInvalidLinks(
    generator.rawProgram['Eligibilité Spécifique'],
    generator.logger,
    LogLevel.Minor,
    'Eligibilité Spécifique',
    generator.rawProgram['Id fiche dispositif'],
    generator.rawProgram.id
  )
  const criteriaList = generator.rawProgram['Eligibilité Spécifique'].split('\n').map((criteria) => criteria.trim())
  if (criteriaList.filter((criteria) => !criteria.startsWith('- ')).length) {
    generator.logger.log(
      LogLevel.Major,
      'Problème de format du champ "éligibilité spécifique" qui doit être une liste !',
      generator.rawProgram['Id fiche dispositif'],
      generator.rawProgram.id,
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

function setEligibilitySector(generator: ProgramDto) {
  if (!generator.rawProgram['Eligibilité Sectorielle']) {
    generator.logger.log(
      LogLevel.Critic,
      'Eligibilité sectorielle manquante.',
      generator.rawProgram['Id fiche dispositif'],
      generator.rawProgram.id
    )
    generator.valid = false
  }
  if (generator.rawProgram['Eligibilité Naf']) {
    return [generator.rawProgram['Eligibilité Sectorielle'], generator.rawProgram['Eligibilité Naf']]
  }
  return [generator.rawProgram['Eligibilité Sectorielle']]
}

function setEligibilityGeography(generator: ProgramDto) {
  if (generator.rawProgram['Couverture géographique'].Name == 'National') {
    return ["France et territoires d'outre-mer"]
  }

  if (generator.rawProgram['Zones Spécifiques (géographie)']) {
    generator.logger.log(
      LogLevel.Major,
      "Le champ zone géographique a été abandonné et n'est plus affiché. Merci de convertir la condition en un point de la liste du champ 'Eligibilité spécifique'",
      generator.rawProgram['Id fiche dispositif'],
      generator.rawProgram.id,
      generator.rawProgram['Zones Spécifiques (géographie)']
    )
  }

  return [
    generator.rawProgram['Zones géographiques']
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
