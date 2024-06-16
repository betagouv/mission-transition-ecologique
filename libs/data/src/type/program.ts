import type { Dispositif as ProgramWithoutId } from '../generated/program'

export type { ProgramWithoutId }
export type Program = ProgramWithoutId & { id: string }
