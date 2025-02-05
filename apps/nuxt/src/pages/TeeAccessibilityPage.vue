<template>
  <div>
    <TeeDsfrBreadcrumb :links="[{ text: 'Accessibilité', to: { name: RouteName.Accessibility } }]" />
    <div
      id="simple-page"
      class="fr-container fr-mb-8w"
    >
      <div class="fr-grid-row">
        <div class="fr-grid-col">
          <h1>Déclaration d'accessibilité</h1>
          <p>
            Cette page n’est pas une page d’aide. Elle vise à présenter la politique d’accessibilité du site
            <a
              href="/"
              target="_blank"
              >https://mission-transition-ecologique.beta.gouv.fr</a
            >
            et à définir le niveau d’accessibilité général constaté sur le site conformément aux référentiels et à la réglementation.
          </p>
          <h4 class="fr-mt-3w">Qu’est-ce que l’accessibilité numérique ?</h4>
          <p>
            Un site web accessible est un site qui permet à tous les internautes d’accéder à ses contenus sans difficulté, y compris aux
            personnes qui présentent un handicap et utilisent des logiciels ou matériels spécialisés.<br />
            Un site accessible permet par exemple de :
          </p>
          <ul>
            <li>
              Naviguer avec des synthèses vocales ou des plages braille (notamment utilisées par les internautes aveugles ou malvoyants).
            </li>
            <li>Personnaliser l’affichage du site selon ses besoins (grossissement des caractères, modification des couleurs, etc.).</li>
            <li>Naviguer sans utiliser la souris, avec le clavier uniquement ou via un écran tactile.</li>
          </ul>

          <h4 class="fr-mt-3w">
            Politique d’accessibilité du site
            <a href="/">mission-transition-ecologique.beta.gouv.fr</a>
          </h4>
          <p>
            Le service numérique est porté par l'ADEME. L’ADEME s’engage à rendre ses sites internet, intranet, extranets accessibles
            conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005. À cette fin, il met en œuvre la stratégie et les actions
            suivantes :
          </p>
          <ul>
            <li>
              <a
                href="https://librairie.ademe.fr/institutionnel/6794-schema-pluriannuel-de-mise-en-accessibilite-des-sites-web-de-l-ademe.html"
                target="_blank"
              >
                Schéma pluriannuel de mise en accessibilité des actifs numériques de l’ADEME pour 2021-2023
              </a>
            </li>
            <li>
              <a
                href="https://librairie.ademe.fr/institutionnel/6823-plan-annuel-de-mise-en-accessibilite-des-sites-web-de-l-ademe.html"
                target="_blank"
              >
                Plan d’action de l’année en cours(ouvre un nouvel onglet).
              </a>
            </li>
          </ul>
          <p>
            Afin d’obtenir le meilleur résultat possible, l’accessibilité est prise en compte par l’ensemble des équipes impliquées dans le
            développement du site. Nos équipes sont également accompagnées par des experts tiers, notamment pour l’audit, les arbitrages et
            la vérification des corrections tout au long des phases de conception et de développement.
          </p>

          <p>
            De plus, nous adoptons une approche résolument pragmatique de l’accessibilité. Les choix effectués et les éléments mis en place
            priorisent l’expérience utilisateur plus que le strict respect du RGAA.
          </p>
          <p>
            C’est notamment le cas lorsque les solutions proposées par le RGAA ne sont pas compatibles avec les aides techniques - souvent
            en raison de bugs de navigateurs ou de systèmes d’exploitation - ou qu’elles rendent l’interface trop complexe à utiliser.
          </p>

          <h4 class="fr-mt-3w">Droit à la compensation</h4>
          <p>
            Il est important de rappeler qu’en vertu de l’article 11 de la loi de février 2005, la personne handicapée a droit à la
            compensation des conséquences de son handicap, quelles que soient l’origine et la nature de sa déficience, son âge ou son mode
            de vie.<br />
            De ce fait, chaque organisme a l’obligation de prendre les moyens nécessaires afin de donner accès, dans un délai raisonnable,
            aux informations et fonctionnalités recherchées par la personne handicapée, que le contenu fasse l’objet d’une dérogation ou
            non.
          </p>

          <h4 class="fr-mt-3w">Nous contacter</h4>
          <p>
            Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable du site internet pour être
            orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
          </p>
          <p>
            Contacter l'équipe <a :href="Contact.mailTo">{{ Contact.email }}par mail</a>
          </p>
          <p>Contacter Estelle Ribot, ADEME, DEMTE — 20 avenue du Grésillé BP 90 406 – 49 004 Angers Cedex 01</p>

          <h4 class="fr-mt-3w">Défenseur des droits</h4>
          <p>
            Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une fonctionnalité du site, que vous nous
            le signalez et que vous ne parvenez pas à obtenir une réponse rapide de notre part, vous êtes en droit de faire parvenir vos
            doléances ou une demande de saisine au Défenseur des droits.
          </p>

          <p>Plusieurs moyens sont à votre disposition :</p>
          <ul>
            <li>un formulaire de contact ;</li>
            <li>la liste des délégués de votre région avec leurs informations de contact directs ;</li>
            <li>un numéro de téléphone : le 09 69 39 00 00 du lundi au vendredi de 8h00 à 20h00 (coût d’un appel local) ;</li>
            <li>une adresse postale dans l’annuaire de l’administration</li>
          </ul>

          <h4 class="fr-mt-3w">Contenu du portail</h4>
          <p>
            Le Commissariat Général au Développement Durable ne saurait être tenue pour responsable de tout dommage, quelle qu’en soit la
            nature, des erreurs typographiques ou des inexactitudes techniques du portail qui pourrait survenir malgré tout le soin apporté
            par les équipes à la rédaction et la mise en ligne des informations et des documents.<br /><br />
            Les informations et les documents contenus sur le portail sont susceptibles de faire l’objet d’une mise à jour à tout moment. Le
            Commissariat Général au Développement Durable ne saurait être tenue pour responsable de tout dommage, quelle qu’en soit la
            nature, résultant de la mise à jour du site.<br /><br />
            Le Commissariat Général au Développement Durable s’efforce de permettre aux usagers d’avoir accès en continu au portail.
            Néanmoins, le Commissariat Général au Développement Durable ne garantit pas l’accessibilité à son site notamment en cas de panne
            et de maintenance ou de force majeure. Le Commissariat Général au Développement Durable ne saurait être tenue pour responsable
            de tout dommage, quelle qu’en soit la nature, résultant de l’indisponibilité du site.
          </p>

          <h4 class="fr-mt-3w">Data for Good</h4>
          <p>
            Mobilisation de data scientists bénévoles du programme Data for Good sur le off season 2021 et saison 10 qui ont accompagné
            pendant plusieurs mois l'équipe projet sur divers chantiers liés à une meilleure mobilisation et valorisation de la donnée (par
            exemple catégorisation automatique des aides publiques, extraction des critères d'éligibilité, structuration des informations
            des PDFs liés aux aides etc.).
          </p>
        </div>
      </div>
    </div>
    <ContactMail />
  </div>
</template>

<script setup lang="ts">
import ContactMail from '@/components/contact/ContactMail.vue'
import { RouteName } from '@/types'
import Contact from '@/tools/contact'

definePageMeta({
  path: '/accessibilite',
  name: RouteName.Accessibility
})
</script>
