import { addIcons as ovAddIcons, type CustomizeIconType } from 'oh-vue-icons'
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseCircleFill,
  RiCheckboxCircleFill,
  RiCheckboxLine,
  RiCheckboxBlankLine
} from 'oh-vue-icons/icons/ri'
import { MdRadiobuttonchecked, MdRadiobuttonunchecked } from 'oh-vue-icons/icons'

export function addIcons(): void {
  ovAddIcons(...listIcons())
}

export const listIcons = (): CustomizeIconType[] => {
  return [
    RiArrowLeftLine,
    RiArrowRightLine,
    RiCloseCircleFill,
    RiCheckboxCircleFill,
    RiCheckboxLine,
    RiCheckboxBlankLine,
    MdRadiobuttonchecked,
    MdRadiobuttonunchecked
  ] as CustomizeIconType[]
}
