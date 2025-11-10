export type FeedbackButtonType = {
  formId: number
  buttonId: number
}

export enum FeedbackButtonPosition {
  Form = 'form',
  Footer = 'footer',
  AboutUs = 'qui-sommes-nous'
}

export type FeedbackType = {
  [K in FeedbackButtonPosition]: FeedbackButtonType
}
