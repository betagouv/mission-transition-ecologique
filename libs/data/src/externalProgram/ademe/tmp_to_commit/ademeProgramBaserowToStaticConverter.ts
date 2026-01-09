import { AdemeProgramBaserow } from './tmpAdemeProgramBaserowType'
import { ProgramStaticBaseType, EligibilityData } from '../../../program/types/shared'

export class AdemeProgramBaserowToStaticConverter {
  convertToStatic(ademeProgram: AdemeProgramBaserow): ProgramStaticBaseType {
    const eligibilityData: EligibilityData = {
      validity: {
        start: ademeProgram.DISPOSITIF_DATE_DEBUT,
        end: ademeProgram.DISPOSITIF_DATE_FIN
      },
      company: {
        allowedNafSections: [],
        allowedRegion: this._parseZonesGeo(ademeProgram['Zones Geo'])
      }
    }

    return {
      id: ademeProgram['Id fiche dispositif'],
      titre: ademeProgram.Titre,
      promesse: '',
      description: ademeProgram['Description courte'],
      'description longue': ademeProgram['Description longue'],
      'opérateur de contact': 'ADEME',
      'autres opérateurs': [],
      'début de validité': ademeProgram.DISPOSITIF_DATE_DEBUT
        ? new Date(ademeProgram.DISPOSITIF_DATE_DEBUT).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : undefined,
      'fin de validité': ademeProgram.DISPOSITIF_DATE_FIN
        ? new Date(ademeProgram.DISPOSITIF_DATE_FIN).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : undefined,
      objectifs: [],
      eligibilityData,
      "conditions d'éligibilité": {
        'secteur géographique': [ademeProgram['Zones Geo']],
        "autres critères d'éligibilité": ademeProgram.Eligibilité ? [ademeProgram.Eligibilité] : null
      }
    }
  }

  convertToStaticArray(ademePrograms: AdemeProgramBaserow[]): ProgramStaticBaseType[] {
    return ademePrograms.map((program) => this.convertToStatic(program))
  }

  private _parseZonesGeo(zonesGeoString: string): string[] | undefined {
    if (!zonesGeoString || zonesGeoString.trim() === '') {
      return undefined
    }
    return zonesGeoString.split(',').map((zone) => zone.trim())
  }
}
