import type { ProgramType } from '@/types'

export default class Program {
  static getEndDate(program: ProgramType | undefined): Date | undefined {
    if (program === undefined || !program['fin de validité']) {
      return undefined
    }

    const dateArr: string[] = (program['fin de validité'] as string).split('/')
    return new Date(`${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`)
  }

  static isAvailable(program: ProgramType | undefined) {
    const endDate = this.getEndDate(program)

    return endDate !== undefined ? endDate >= new Date() : true
  }
}
