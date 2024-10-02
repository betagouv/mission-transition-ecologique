import { OpportunityType } from '@tee/common'
import { ProgramType, Project } from '@tee/data'
import { CustomProject, OpportunityObjectDetails } from './types'

export class OpportunityObject {
  constructor(
    private _opportunityType: OpportunityType,
    private _opportunityObject: OpportunityObjectDetails
  ) {}

  public getProgram(): ProgramType {
    if (this.isProgram(this._opportunityObject)) {
      return this._opportunityObject
    }

    throw new Error('Program not found')
  }

  public getProject(): Project {
    if (this.isProject(this._opportunityObject)) {
      return this._opportunityObject
    }
    throw new Error('Project not found')
  }

  public getCustomProject(): CustomProject {
    if (this.isCustomProject(this._opportunityObject)) {
      return this._opportunityObject
    }
    throw new Error('The type of opportunity is not Custom Project')
  }

  public getProjectOrCustom(): Project | CustomProject {
    if (this.isProject(this._opportunityObject) || this.isCustomProject(this._opportunityObject)) {
      return this._opportunityObject
    }
    throw new Error('The type of opportunity is not Project or Custom Project')
  }

  public isProgram(programOrProject: OpportunityObjectDetails): programOrProject is ProgramType {
    return this._opportunityType === OpportunityType.Program && this._isDefined(programOrProject) && !this._hasTitle(programOrProject)
  }

  public isProject(programOrProject: OpportunityObjectDetails): programOrProject is Project {
    return this._opportunityType === OpportunityType.Project && this._hasTitle(programOrProject)
  }

  public isCustomProject(programOrProject: OpportunityObjectDetails): programOrProject is CustomProject {
    return this._opportunityType === OpportunityType.CustomProject
  }

  private _hasTitle(programOrProject: OpportunityObjectDetails): boolean {
    return this._isDefined(programOrProject) && 'title' in programOrProject
  }

  private _isDefined(programOrProject: OpportunityObjectDetails): programOrProject is ProgramType | Project {
    return programOrProject !== undefined
  }
}
