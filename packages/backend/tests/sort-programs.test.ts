import { sortPrograms } from '@tee/backend/src/domain/sort-programs'
import { ProgramData } from '@tee/web/src/types'

describe(`
 GIVEN a list of programs
  WHEN sorting the programs
EXPECT that the programs respect a set of given rules
`, () => {
  test('', () => {
    const programs: ProgramData[] = []
    expect(sortPrograms(programs)).toHaveLength(0)
  })
})
