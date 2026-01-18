import { EligibilityData, ProgramTypes, AbstractProgramType } from '../../program/types/shared'
import { AdemeProgramBaserow } from './types'

export class AdemeProgramBaserowToStaticConverter {
  convertToStatic(ademeProgram: AdemeProgramBaserow): AbstractProgramType {
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
      'début de validité': ademeProgram.DISPOSITIF_DATE_DEBUT
        ? new Date(ademeProgram.DISPOSITIF_DATE_DEBUT).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : undefined,
      'fin de validité': ademeProgram.DISPOSITIF_DATE_FIN
        ? new Date(ademeProgram.DISPOSITIF_DATE_FIN).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : undefined,
      'contact question': ademeProgram['Contact URL (auto)'],
      objectifs: [
        {
          description: 'Créez un compte ADEME pour pouvoir déposer votre dossier.',
          liens: [
            {
              lien: 'https://agirpourlatransition.ademe.fr/inscription',
              texte: 'Créer mon compte ADEME'
            }
          ]
        },
        {
          description:
            'Déposez votre dossier : informations administratives, description du projet, détails techniques et financiers, etc.',
          liens: [
            {
              lien:
                'https://agirpourlatransition.ademe.fr/entreprises/aides-financieres/catalogue/' +
                (ademeProgram["type d'aide (ADEME)"] === 'AAP' ? 'aap' : '2026') +
                '/' +
                ademeProgram['Id fiche dispositif'],
              texte: 'Déposer mon dossier'
            }
          ]
        }
      ],
      eligibilityData,
      "conditions d'éligibilité": {
        'secteur géographique': [ademeProgram['Zones Geo']],
        "autres critères d'éligibilité": ademeProgram.Eligibilité ? [ademeProgram.Eligibilité] : null
      },
      type: ProgramTypes.extAdeme
    }
  }

  convertToStaticArray(ademePrograms: AdemeProgramBaserow[]): AbstractProgramType[] {
    return ademePrograms.map((program) => this.convertToStatic(program))
  }

  private _parseZonesGeo(zonesGeoString: string): string[] | undefined {
    if (!zonesGeoString || zonesGeoString.trim() === '') {
      return undefined
    }
    return zonesGeoString.split(',').map((zone) => zone.trim())
  }
}
