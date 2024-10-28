import { EstablishmentFront, StructureSize } from '@tee/common'

export enum CompanyDataStorageKey {
  Siret = 'siret',
  Size = 'structure_size'
}

export type CompanyDataType = {
  [CompanyDataStorageKey.Siret]: EstablishmentFront | null
  [CompanyDataStorageKey.Size]: StructureSize | null
}
