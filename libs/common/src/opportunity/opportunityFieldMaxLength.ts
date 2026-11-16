// Maximum lengths of the opportunity fields, shared by the API schema and the form.
// The OpenAPI documentation repeats them as literals: defineRouteMeta only accepts static values
export const OpportunityFieldMaxLength = {
  firstName: 100,
  lastName: 100,
  email: 254,
  phoneNumber: 20,
  companySiret: 20,
  companyName: 300,
  companySector: 300,
  id: 200,
  titleMessage: 200,
  message: 2500,
  link: 2000,
  // Serialized answers of the questionnaire
  otherData: 20000
} as const
