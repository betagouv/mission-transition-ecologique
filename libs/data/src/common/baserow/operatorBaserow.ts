import { Result } from 'true-myth'
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
      ...(await this._convertImage(baserowOperator))
    }
  }

  private async _convertImage(baserowOperator: BaserowOperator) {
    if (this._imageDownloader && this._logger) {
      const maybeImageName = (await this._imageDownloader.handleImageFromImageTable(baserowOperator.Image, true)) as Result<
        { imagePath: string; color: string },
        Error
      >

      if (maybeImageName.isErr) {
        this._logger.log(LogLevel.Major, maybeImageName.error.message + '\n, no default image', baserowOperator.Nom, baserowOperator.id)
        return { imagePath: undefined, color: undefined }
      } else {
        return maybeImageName.value
      }
    }

    return { imagePath: undefined, color: undefined }
  }
}
