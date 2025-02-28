import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'

export default defineNuxtRouteMiddleware((to, from) => {
  const modalQuery = to.query.modal
  if (modalQuery === 'true' && !CompanyData.hasCompanyData()) {
    Navigation.toggleRegisterModal()
  }
})
