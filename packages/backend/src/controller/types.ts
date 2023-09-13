interface ErrorJSON {
  message: string
}

interface ValidateErrorJSON {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}
