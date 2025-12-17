import { Operator } from '../../operators/types/domain'
import { LoggerInterface, LogLevel } from '../logger/types'
import { AbstractBaserow } from './abstractBaserow'
import { ImageBaserow } from './imageBaserow'
import { BaserowOperator } from './types'

export class OperatorBaserow extends AbstractBaserow {
  constructor(
    private _imageDownloader: ImageBaserow | undefined = undefined,
    private _logger: LoggerInterface | undefined = undefined
  ) {
    super()
  }

  async getAll(): Promise<Operator[]> {
    const baserowOperators = await this._getTableData<BaserowOperator>(this._operatorTableId)
    const operators = []
    for (const baserowOperator of baserowOperators.filter((baserowOperatorFilter) => baserowOperatorFilter.Nom != '')) {
      operators.push(await this._convertToDomain(baserowOperator))
    }

    this._imageDownloader?.cleanup()

    return operators
  }

  private async _convertToDomain(baserowOperator: BaserowOperator): Promise<Operator> {
    return {
      id: baserowOperator.id,
      tag: baserowOperator.Tag,
      name: baserowOperator.Nom,
      siren: baserowOperator.siren,
      filterCategories: baserowOperator.Filtre.map((link) => link.value),
      normalizedName: baserowOperator['Nom Normalisé'],
      imagePath: await this._convertImage(baserowOperator)
    }
  }

  private async _convertImage(baserowOperator: BaserowOperator) {
    if (this._imageDownloader && this._logger) {
      const maybeImageName = await this._imageDownloader.handleImageFromImageTable(baserowOperator.Image)

      if (maybeImageName.isErr) {
        this._logger.log(LogLevel.Major, maybeImageName.error.message + '\n, no default image', baserowOperator.Nom, baserowOperator.id)
        return undefined
      } else {
        console.log(`Successfully downloaded image for operator ${baserowOperator.Nom}`, maybeImageName.value)
        return maybeImageName.value
      }
    }

    return undefined
  }
}
