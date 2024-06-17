import type { Dispositif as ProgramWithoutId } from '../generated/program'

export type { ProgramWithoutId }
export type ProgramType = ProgramWithoutId & { id: string }
