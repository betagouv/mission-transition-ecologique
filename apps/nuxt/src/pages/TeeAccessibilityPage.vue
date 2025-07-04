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
          <p>Contacter l'équipe <a :href="Contact.mailTo">par mail</a></p>
          <p>Contacter Estelle Ribot, ADEME, DEMTE — 20 avenue du Grésillé BP 90 406 – 49 004 Angers Cedex 01</p>

          <h4 class="fr-mt-3w">Voies de recours</h4>
          <p>
            Cette procédure est à utiliser dans le cas suivant. Vous avez signalé au responsable du site internet un défaut d’accessibilité
            qui vous empêche d’accéder à un contenu ou à un des services du portail et vous n’avez pas obtenu de réponse satisfaisante.
          </p>
          <ul>
            <li>
              Écrire un message au Défenseur des droits (via le formulaire de contact(ouvre un nouvel onglet)) ; Contacter le délégué du
              Défenseur des droits dans votre région (https://www.defenseurdesdroits.fr/saisir/delegues(ouvre un nouvel onglet)) ;
            </li>
            <li>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) Défenseur des droits Libre réponse 71120 75342 Paris CEDEX
              07 ;
            </li>
            <li>Contacter le Défenseur des droits par téléphone : 09 69 39 00 00.</li>
          </ul>

          <h4 class="fr-mt-3w">Contenu du portail</h4>
          <p>
            L'ADEME ne saurait être tenue pour responsable de tout dommage, quelle qu’en soit la nature, des erreurs typographiques ou des
            inexactitudes techniques du portail qui pourrait survenir malgré tout le soin apporté par les équipes à la rédaction et la mise
            en ligne des informations et des documents.<br /><br />
            Les informations et les documents contenus sur le portail sont susceptibles de faire l’objet d’une mise à jour à tout moment.
            L'ADEME ne saurait être tenue pour responsable de tout dommage, quelle qu’en soit la nature, résultant de la mise à jour du
            site.<br /><br />
            L'ADEME s’efforce de permettre aux usagers d’avoir accès en continu au portail. Néanmoins, l'ADEME ne garantit pas
            l’accessibilité à son site notamment en cas de panne et de maintenance ou de force majeure. L'ADEME ne saurait être tenue pour
            responsable de tout dommage, quelle qu’en soit la nature, résultant de l’indisponibilité du site.
          </p>
        </div>
      </div>
    </div>
    <ContactMail />
  </div>
</template>

<script setup lang="ts">
import ContactMail from '@/components/contact/ContactMail.vue'
import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import { RouteName } from '@/types'
import Contact from '@/tools/contact'
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  path: '/accessibilite',
  name: RouteName.Accessibility
})

const navigation = new Navigation()

const description = "Informations relatives à l'accessibilité du site de la Mission Transition Écologique des Entreprises."
useSeoMeta(MetaSeo.get('Accessibilité', description))
useSchemaOrg(defineWebPage({ description: description }))

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.Accessibility)
    }
  ],
  ...MetaRobots.indexFollow()
})
</script>
