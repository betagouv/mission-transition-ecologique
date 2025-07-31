import { ConfigCommon } from '@tee/common'

export default class ConfigBaserow extends ConfigCommon {
  private static _TABLE_ID_CONDITIONAL_VALUES = 351202
  private static _TABLE_ID_GEOGRAPHIC_AREAS = 314474
  private static _TABLE_ID_GEOGRAPHIC_COVERAGE = 314470
  private static _TABLE_ID_IMAGE = 315189
  private static _TABLE_ID_OPERATOR = 314410
  private static _TABLE_ID_PROGRAM = 314437
  private static _TABLE_ID_PROJECT = 305253
  private static _TABLE_ID_TESTIMONIES = 399896
  private static _TABLE_ID_THEME = 305258

  public static get TOKEN() {
    return this.getEnvValue('BASEROW_TOKEN')
  }

  public static get CONDITIONAL_VALUES_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_CONDITIONAL_VALUES', this._TABLE_ID_CONDITIONAL_VALUES.toString()))
  }

  public static get GEOGRAPHIC_AREAS_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_GEOGRAPHIC_AREAS', this._TABLE_ID_GEOGRAPHIC_AREAS.toString()))
  }

  public static get GEOGRAPHIC_COVERAGE_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_GEOGRAPHIC_COVERAGE', this._TABLE_ID_GEOGRAPHIC_COVERAGE.toString()))
  }

  public static get IMAGE_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_IMAGE', this._TABLE_ID_IMAGE.toString()))
  }

  public static get OPERATOR_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_OPERATOR', this._TABLE_ID_OPERATOR.toString()))
  }

  public static get PROGRAM_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_PROGRAM', this._TABLE_ID_PROGRAM.toString()))
  }

  public static get PROJECT_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_PROJECT', this._TABLE_ID_PROJECT.toString()))
  }

  public static get TESTIMONIES_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_TESTIMONIES', this._TABLE_ID_TESTIMONIES.toString()))
  }

  public static get THEME_ID() {
    return parseInt(this.getEnvValue('BASEROW_TABLE_ID_THEME', this._TABLE_ID_THEME.toString()))
  }
}
