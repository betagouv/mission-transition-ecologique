import { EstablishmentFront } from '@tee/common'

export type StorageDataType = { [key: string]: string | EstablishmentFront | StorageDataType }
