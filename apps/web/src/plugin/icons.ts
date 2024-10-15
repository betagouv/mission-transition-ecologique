import { addIcons as ovAddIcons, type CustomizeIconType } from 'oh-vue-icons'
import { RiArrowRightLine } from 'oh-vue-icons/icons/ri'
import { MdRadiobuttonchecked, MdRadiobuttonunchecked } from 'oh-vue-icons/icons'

export function addIcons(): void {
  ovAddIcons(...listIcons())
}

export const listIcons = (): CustomizeIconType[] => {
  return [MdRadiobuttonchecked, MdRadiobuttonunchecked, RiArrowRightLine] as CustomizeIconType[]
}
