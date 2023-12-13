// CONSOLE LOG TEMPLATE
// console.log(`utils.global > FUNCTION_NAME > MSG_OR_VALUE :`)
import jsonDataset from '../../public/data/generated/dataset_out.json'
import type { ImportMetaEnv } from '@/env'

export const metaEnv: ImportMetaEnv = import.meta.env as ImportMetaEnv
export const deployMode = metaEnv.MODE != 'development'
export const deployUrl = metaEnv.VITE_DEPLOY_URL
export const noDebugSwitch = metaEnv.VITE_NO_DEBUG_SWITCH
export const publicPath = `${deployUrl}/${metaEnv.BASE_URL}`
export const programsFromJson = jsonDataset


export const externalLinks = {
  placeDesEntreprises: 'https://place-des-entreprises.beta.gouv.fr/aide-entreprise/accueil/theme/environnement-transition-ecologique?mtm_campaign=orientation-partenaire&mtm_kwd=experimentation-te#section-breadcrumbs',
}
