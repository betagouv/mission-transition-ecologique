export type FeedbackButtonType = {
  formId: number
  buttonId: number
}

export enum FeedbackButtonPosition {
  Form = 'form',
  Footer = 'footer'
}

export type FeedbackType = {
  [K in FeedbackButtonPosition]: FeedbackButtonType
}
