import { ProgramAidType, ProgramType } from '@/types'

export class ProgramSorter {
  static byFinanceAidType(programs: ProgramType[]) {
    return programs.slice().sort((a, b) => {
      const aidKey = "nature de l'aide"
      switch (true) {
        case a[aidKey] === b[aidKey]:
          return a.titre.localeCompare(b.titre)
        case a[aidKey] === ProgramAidType.fund:
        case a[aidKey] === ProgramAidType.loan && b[aidKey] !== ProgramAidType.fund:
          return -1
        default:
          return 1
      }
    })
  }
}
