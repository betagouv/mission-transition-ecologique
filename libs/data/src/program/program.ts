import { ProgramAidType, ProgramType } from './types/shared'

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
