import Posthog from '@/tools/analytic/posthog'
import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'

export default defineNuxtPlugin(() => {
  Posthog.install()

  const router = useRouter()
  router.afterEach((to, from, failure) => {
    if (!failure) {
      if (to.query['profil-entreprise'] === 'oui' && !CompanyData.hasCompanyData()) {
        Navigation.toggleRegisterModal(true)
      }
    }
  })
})
