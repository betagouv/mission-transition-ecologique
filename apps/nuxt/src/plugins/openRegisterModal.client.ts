import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  router.afterEach((to, from, failure) => {
    if (!failure) {
      if (to.query['profil-entreprise'] === 'oui' && !CompanyData.hasCompanyData()) {
        Navigation.toggleRegisterModal(true)
      }
    }
  })
})
