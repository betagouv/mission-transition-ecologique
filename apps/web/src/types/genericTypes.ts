export type WithoutNullableKeys<Type> = {
  [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>
}

export type ValueOf<T> = T[keyof T]

export type Override<T, NewType extends { [K in keyof T]: NewType[K] }> = Omit<T, keyof NewType> & NewType
