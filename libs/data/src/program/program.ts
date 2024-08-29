<<<<<<<< HEAD:libs/common/src/program/program.ts
import { ProgramAidType } from './types'
import { ProgramType } from '@tee/data'
========
import { ProgramAidType } from './types/shared'
>>>>>>>> main:libs/data/src/program/program.ts

export class Program {
  public static getPrefixedProgramName(program: ProgramType) {
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
export type ProgramType = ProgramWithoutId & { id: string }
