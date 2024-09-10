<template>
  <div
    id="simple-page"
    class="fr-container fr-my-8w"
  >
    <div class="fr-grid-row--gutters">
      <div class="fr-grid-col">
        <h1>Données personnelles</h1>
        <p>
          Le site
          <RouterLink
            :to="{ name: RouteName.Homepage }"
            target="_blank"
          >
            https://mission-transition-ecologique.beta.gouv.fr
          </RouterLink>
          est soumis au Règlement général de protection des données (RGPD) et à la loi informatique et liberté.
        </p>

        <h4 class="fr-mt-3w">Données personnelles</h4>
        <p>Quelles sont les données personnelles collectées ? dans quel but ?</p>

        <h4 class="fr-mt-3w">Un cookie pour analyser les statistiques de fréquentation et de comportement utilisateur</h4>
        <p>
          Lors de la consultation du site
          <RouterLink :to="{ name: RouteName.Homepage }"> mission-transition-ecologique.beta.gouv.fr </RouterLink>, des témoins de
          connexion, dits « cookies », sont déposés sur votre ordinateur, votre mobile ou votre tablette. <br />Lors de votre première
          visite, un bandeau signale leur présence vous avez la possibilité de les accepter ou de les refuser.
        </p>
        <p>
          Ces cookies permettent aux gestionnaires du site d’établir des mesures statistiques de fréquentation et d’utilisation du site.
        </p>
        <ul>
          <li>les données collectées ne sont pas recoupées avec d’autres traitements ou fournies à d’autres partenaires ;</li>
          <li>le cookie déposé sert uniquement à la production de statistiques anonymes ;</li>
          <li>
            le cookie ne permet pas de suivre la navigation de l’internaute sur d’autres sites que celui du site
            <RouterLink :to="{ name: RouteName.Homepage }"> mission-transition-ecologique.beta.gouv.fr </RouterLink>
          </li>
          <li>L’outil de mesure d’audience déployé sur ce site est Matomo. Matomo est soumis à la loi informatique et libertés</li>
        </ul>

        <h4 class="fr-mt-3w">Paramétrage des cookies</h4>
        <p>
          Vous pouvez paramétrer votre navigateur afin qu’il vous signale la présence de cookies et vous propose de les accepter ou non.
          Vous pouvez accepter ou refuser les cookies au cas par cas ou bien les refuser une fois pour toutes. A noter, ce paramétrage est
          susceptible de modifier vos conditions d’accès aux services du site nécessitant l’utilisation de cookies.
        </p>
        <p>Les données sont collectées par</p>
        <ul>
          <li>Commissariat Général au Développement Durable<br />Tour Séquoia<br />92055 La Défense Cedex</li>
          <li>Directeur de publication : Monsieur Thomas Lesueur</li>
        </ul>

        <h4 class="fr-mt-3w">Le site de la société Posthog</h4>
        <p>
          <a
            href="https://posthog.com/eu"
            target="_blank"
            >CONSULTER SITE SOCIÉTÉ POSTHOG</a
          >
        </p>
        <div class="fr-mt-3w">
          <p>
            Pour s’informer sur le traitement des données réalisé par la société Posthog et/ou modifier vos préférences quant à la
            (dés)activation des cookies Posthog sur votre navigateur :
          </p>
          <p>
            <a
              href="https://posthog.com/privacy"
              target="_blank"
              >CONSULTER POSTHOG : PROTECTION DE LA VIE PRIVÉE</a
            >
          </p>
        </div>
        <div class="fr-mt-3w">
          <p>Pour s'informer sur la propriété des données par la société Posthog :</p>
          <p>
            <a
              href="https://posthog.com/terms"
              target="_blank"
              >CONSULTER POSTHOG : PROPRIÉTÉ DES DONNÉES</a
            >
          </p>
        </div>

        <h4 class="fr-mt-3w">Informatique et Libertés</h4>
        <p>
          Droit d’accès, modification, suppression des données personnelles vous concernant.<br />
          Pour nous contacter :
        </p>
        <ul>
          <li>
            merci de nous contacter par mail à : <a :href="Contact.mailTo">{{ Contact.email }}</a>
          </li>
          <li>
            ou écrire à :<br />
            <div class="fr-highlight fr-mt-3w">
              Données personnelles - Site
              <RouterLink :to="{ name: RouteName.Homepage }"> mission-transition-ecologique.beta.gouv.fr </RouterLink><br />
              Commissariat Général au Développement Durable<br />
              Tour Séquoia<br />
              92055 La Défense Cedex
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <ContactMail />
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeePersonalDataPage > FUNCTION_NAME > MSG_OR_VALUE :`)

import ContactMail from '@/components/contact/ContactMail.vue'
import Contact from '@/utils/contact'
import { RouteName } from '@/types/routeType'
</script>
