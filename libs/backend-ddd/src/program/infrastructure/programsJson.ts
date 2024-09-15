import { ProgramRepository } from '../domain/spi'
import { jsonPrograms } from '@tee/data/generated'
import { ProgramType } from '@tee/data'
import { QuestionnaireData } from '@tee/common'
import { Monitor } from '../../common'

export default class ProgramsJson implements ProgramRepository {
  private static instance: ProgramsJson
  private _programs: ProgramType[] = []

  private constructor() {
    this._programs = jsonPrograms as unknown as ProgramType[]
  }

  public static getInstance(): ProgramsJson {
    if (!ProgramsJson.instance) {
      ProgramsJson.instance = new ProgramsJson()
    }

    return ProgramsJson.instance
  }

  public getAll(): ProgramType[] {
    return this._programs
  }
  public getById = (id: string): ProgramType | undefined => {
    return this.getAll().find((programData: ProgramType) => programData.id === id)
  }

  public personalizePrograms = (allPrograms: ProgramType[], questionnaireData: QuestionnaireData): ProgramType[] => {
    console.log('dans personalize Programs')

    allPrograms.forEach((program) => {
      if (program['champs conditionnels']) {
        for (const conditionnalChange of program['champs conditionnels']) {
          console.log('checking une conditionnelle')
          console.log(conditionnalChange)
          if (!conditionnalChange['une de ces conditions']) {
            Monitor.error('Program conditionnal not handled')
          }
          for (const oneCondition of conditionnalChange['une de ces conditions']) {
            if (!oneCondition.startsWith('région = ')) {
              Monitor.error('Program conditionnal not handled')
            }

            const regionCondition = oneCondition.replace('région = ', '').trim()
            console.log(regionCondition)
            if (questionnaireData.region === regionCondition) {
              for (const key in conditionnalChange) {
                if (key !== 'une de ces conditions') {
                  this.rewriteProgramProperty(program, key, conditionnalChange[key])
                }
              }
            }
          }
        }
      }
    })
    return allPrograms
  }

  private rewriteProgramProperty = (program: ProgramType, key: string, value: unknown) => {
    if (key == 'promesse') {
      program.promesse = value as string
      return
    }
    if (key == 'URL externe') {
      program.url = value as string
      return
    }
    Monitor.error('Attempting to personalize a program property for which no rewrite method has been defined.')
  }
}
