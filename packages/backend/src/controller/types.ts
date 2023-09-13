export interface ErrorJSON {
  message: string
}

export interface ValidateErrorJSON {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}

export interface BrevoBody {
  email: string
  listIds: number[]
  attributes: ContactInfoBodyAttributes
}

export interface BrevoResponse {
  id: number
}
