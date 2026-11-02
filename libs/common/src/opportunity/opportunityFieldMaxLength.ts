// Maximum lengths of the opportunity fields, shared by the API schema, the form and the API documentation
export const OpportunityFieldMaxLength = {
  firstName: 100,
  lastName: 100,
  email: 254,
  phoneNumber: 30,
  companySiret: 20,
  id: 200,
  titleMessage: 200,
  message: 10000,
  link: 2000
} as const
