import operatorsJson from '@/public/json/operator/operators.json'
import { EnrichedOperator } from '@tee/data'

export const enrichedOperators: EnrichedOperator[] = operatorsJson as unknown as EnrichedOperator[]

export const partners = [
  {
    label: 'ADEME',
    img: '/images/logos/ademe.svg',
    href: 'https://www.ademe.fr/'
  },
  {
    label: 'Bpifrance',
    img: '/images/logos/bpi-france.svg',
    href: 'https://www.bpifrance.fr/',
    format: 'webp'
  },
  {
    label: 'CCI France',
    img: '/images/logos/cci-france.svg',
    href: 'https://www.cci.fr/',
    width: '130px',
    format: 'webp'
  },
  {
    label: 'CMA France',
    img: '/images/logos/cma-france.png',
    href: 'https://www.artisanat.fr/'
  },
  {
    label: 'Office français de la biodiversité',
    img: '/images/logos/logo-ofb.webp',
    href: ' https://ofb.gouv.fr'
  }
]

export const otherPartner = {
  label: 'Conseiller Entreprise',
  img: '/images/logos/ce-logo.svg',
  href: 'https://conseillers-entreprises.service-public.fr/',
  format: 'webp'
}

export const partnersAll = [otherPartner, ...partners]
