import { OpportunityType } from '@tee/common'
import { ProgramType, Project } from '@tee/data'
import { CustomProject, OpportunityObjectDetails } from './types'

export class OpportunityObject {
  constructor(
    public _opportunityType: OpportunityType,
    public opportunityObject: OpportunityObjectDetails
  ) {}

  public isProgram(): this is { opportunityObject: ProgramType } {
    return this._opportunityType === OpportunityType.Program && this._isDefined() && !this._hasTitle()
  }

  public isProject(): this is { opportunityObject: Project } {
    return this._opportunityType === OpportunityType.Project && this._isDefined() && this._hasTitle()
  }

  public isCustomProject(): this is { opportunityObject: CustomProject } {
    return this._opportunityType === OpportunityType.CustomProject
  }

  private _hasTitle(): boolean {
    return this._isDefined() && 'title' in this.opportunityObject
  }

  private _isDefined(): boolean {
    return this.opportunityObject !== undefined
  }
}
