<script setup lang="ts">
const operators = [
  {
    label: 'ADEME',
    img: '/images/logos/ademe.svg',
    href: 'https://www.ademe.fr/'
  },
  {
    label: 'Bpifrance',
    img: '/images/logos/bpi-france.svg',
    href: 'https://www.bpifrance.fr/'
  },
  {
    label: 'CCI France',
    img: '/images/logos/cci-france.svg',
    href: 'https://www.cci.fr/',
    width: '130px'
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

const otherOperator = {
  label: 'Conseiller entreprise',
  img: '/images/logos/ce-logo.svg'
}
</script>

<template>
  <div class="fr-container fr-grid-row fr-grid-row--center fr-p-8v fr-hidden fr-unhidden-sm">
    <div class="fr-grid-row">
      <div class="fr-col-6 fr-col-sm-12 fr-col-lg-6 fr-px-10w fr-text-center fr-position--relative">
        <img
          :src="`/images/yellow-circle.svg`"
          class="circle-background"
          alt="yellow-circle-background"
        />
        <h4
          class="fr-text--blue-france fr-pb-2v"
          v-html="`Le point d'entrée vers les aides à la transition écologique <br/> des entreprises`"
        ></h4>
        <p>
          <i>Transition écologique des entreprises</i> vous permet <b>d'identifier la bonne aide</b> pour votre entreprise parmi les aides
          publiques nationales, régionales et territoriales issues de <b>l’ensemble des partenaires publics.</b>
        </p>
        <div class="fr-grid-row fr-col-justify--center fr-col-content--middle">
          <img
            v-for="operator in operators"
            :key="operator.label"
            class="fr-responsive-img fr-m-2v operator-logo"
            :src="operator.img"
            :width="operator.width ?? undefined"
            :alt="operator.label"
          />
        </div>
      </div>
      <div class="fr-col-6 fr-col-sm-12 fr-col-lg-6 fr-px-10w fr-text-center fr-position--relative">
        <img
          :src="`/images/green-circle.svg`"
          class="circle-background"
          alt="green-circle-background"
        />
        <h4
          class="fr-text--blue-france fr-pb-2v"
          v-html="`Des conseillers pour <br/> vous aider sur l'ensemble <br/> du territoire`"
        ></h4>
        <p>
          Pour vous accompagner dans vos réflexions et répondre à vos questions, nous vous mettons en relation avec
          <b>le conseiller compétent pour votre demande sur votre territoire.</b> Ce conseiller est référencé via le service public
          <i>Conseillers-Entreprises</i>.
        </p>
        <div class="fr-col-justify--center fr-grid-row fr-col-content--middle">
          <img
            class="fr-responsive-img fr-m-2v operator-logo"
            :src="otherOperator.img"
            :alt="otherOperator.label"
          />
        </div>
      </div>
    </div>
    <div class="fr-bg--blue--lightness fr-hidden-sm fr-col-12 fr-py-0-5v fr-mt-8v fr-mb-16v"></div>
  </div>
</template>

<style scoped lang="scss">
.circle-background {
  position: absolute;
  z-index: -1;
  left: 50px;
  top: -20px;
}

.operator-logo {
  max-height: 2.5rem;
  max-width: 3.8rem !important;
  width: revert-layer !important;
}
</style>
