// @ts-ignore
import jsonDataset from '../../public/data/generated/dataset_out.json'
// console.log('WidgetApp > jsonDataset :', jsonDataset)

// @ts-ignore
export const metaEnv = import.meta.env
// console.log('WidgetApp - metaEnv :', metaEnv)
export const deployMode = metaEnv.MODE != 'development'
export const deployUrl = metaEnv.VITE_DEPLOY_URL
export const noDebugSwitch = metaEnv.VITE_NO_DEBUG_SWITCH === 'true'
export const publicPath = `${deployUrl}/${metaEnv.BASE_URL}`
// console.log('WidgetApp - deployUrl :', deployUrl)
// console.log('WidgetApp - metaEnv.BASE_URL :', metaEnv.BASE_URL)
// console.log('WidgetApp - publicPath :', publicPath)

// @ts-ignore
export const programsFromJson = jsonDataset

export const externalLinks = {
  placeDesEntreprises: 'https://place-des-entreprises.beta.gouv.fr/aide-entreprise/accueil/theme/environnement-transition-ecologique?mtm_campaign=orientation-partenaire&mtm_kwd=experimentation-te#section-breadcrumbs',
}
