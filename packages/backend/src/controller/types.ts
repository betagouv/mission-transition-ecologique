export interface ErrorJSON {
  message: string
}

export interface ValidateErrorJSON {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}
