<template>
  <section class="fr-my-3w">
    <h2>Les autres services de l’accélérateur de la transition écologique</h2>

    <div class="fr-grid-row">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="fr-col-12 fr-col-lg-6 fr-p-1w"
      >
        <TeeExternalLinkCard
          :image="card.image"
          :logo="card.logo"
          :description="card.description"
          :link="card.link"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const cards = [
  {
    image: "/images/about/Tee_about_other_services_quefairede.webp",
    imageAlt: "Image du site Que faire de mes déchets",
    logo: "/images/logos/cci-france.svg",
    logoAlt: "Logo du site Que faire de mes déchets",
    description: "Trouvez les adresses près de chez vous pour réduire vos déchets.",
    link: "https://www.ecologie.gouv.fr"
  },
  {
    image: "/images/about/Tee_about_other_services_gestesclimat.webp",
    imageAlt: "Image du site Nos Gestes Climat",
    logo: "/images/logos/cci-france.svg",
    logoAlt: "Logo du site Nos Gestes Climat",
    description: "Sensibilisez votre audience sur leur empreinte carbone et eau.",
    link: "https://nosgestesclimat.fr/"
  },
  {
    image: "/images/about/Tee_about_other_services_impactco2.webp",
    imageAlt: "Image du site Impact CO₂",
    logo: "/images/logos/cci-france.svg",
    logoAlt: "Logo du site Impact CO₂",
    description: "Communiquez sur l'impact carbone avec des outils thématiques.",
    link: "https://impactco2.fr/"
  },
  {
    image: "/images/about/Tee_about_other_services_plusfraiche.webp",
    imageAlt: "Image du site Plus Fraîche Ma Ville",
    logo: "/images/logos/cci-france.svg",
    logoAlt: "Logo du site Plus Fraîche Ma Ville",
    description: "Trouvez les bonnes solutions pour rafraîchir durablement votre collectivité.",
    link: "https://plusfraichemaville.fr/"
  }
]
</script>
