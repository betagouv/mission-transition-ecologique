export type WithoutNullableKeys<Type> = {
  [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>
}

export type ValueOf<T> = T[keyof T]

export enum FieldType {
  Text = 'text',
  Number = 'number',
  Select = 'select',
  Radio = 'radio',
  Tag = 'tag',
  Checkbox = 'checkbox',
  Textarea = 'textarea',
  Email = 'email',
  Tel = 'tel',
  Date = 'date',
  Search = 'search'
}
