import { ContactInfoBodyAttributes } from '../../../domain/types'

export interface BrevoBody {
  email: string
  listIds: number[]
  attributes: object
}

export interface updateContactBody {
  attributes: ContactInfoBodyAttributes
}
