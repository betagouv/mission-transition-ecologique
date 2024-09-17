import { ProgramAidType } from './types/shared'

export class Program {
  public static getPrefixedProgramName(program: ProgramTypeWithPublicode) {
    let prefix = ''
    switch (program["nature de l'aide"]) {
      case ProgramAidType.study:
        prefix = `l'`
        break
      case ProgramAidType.train:
      case ProgramAidType.tax:
        prefix = `la `
        break
      case ProgramAidType.fund:
      case ProgramAidType.loan:
        prefix = `le `
        break
    }

    return `${prefix}${program["nature de l'aide"]} ${program.titre}`
  }
}

import type { Dispositif as ProgramWithoutId } from '../generated/program'

export type { ProgramWithoutId }
export type ProgramTypeWithPublicode = ProgramWithoutId & { id: string }
