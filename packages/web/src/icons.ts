// import icons
import { addIcons as ovAddIcons } from 'oh-vue-icons'
export { OhVueIcon } from 'oh-vue-icons'
import * as RiIcons from 'oh-vue-icons/icons/ri'
import {
  MdRadiobuttonchecked,
  MdRadiobuttonunchecked,
  MdCheckboxoutlineblank,
  MdCheckboxOutlined,
} from 'oh-vue-icons/icons'

export const addIcons = () => {
  const Ri = Object.values({ ...RiIcons })
  ovAddIcons(
    ...Ri,
    MdRadiobuttonchecked,
    MdRadiobuttonunchecked,
    MdCheckboxoutlineblank,
    MdCheckboxOutlined,
  )
}