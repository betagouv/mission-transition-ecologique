// CONSOLE LOG TEMPLATE
// console.log(`utils.global > FUNCTION_NAME > MSG_OR_VALUE :`)

// @ts-ignore
import jsonDataset from '../../public/data/generated/dataset_out.json'

// @ts-ignore
export const metaEnv = import.meta.env
export const deployMode = metaEnv.MODE != 'development'
export const deployUrl = metaEnv.VITE_DEPLOY_URL
export const noDebugSwitch = metaEnv.VITE_NO_DEBUG_SWITCH === 'true'
export const publicPath = `${deployUrl}/${metaEnv.BASE_URL}`

// @ts-ignore
export const programsFromJson = jsonDataset