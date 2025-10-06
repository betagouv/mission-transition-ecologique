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
            L’ADEME s’engage à rendre ses sites internet, intranet, extranet et ses applications mobiles, etc. accessibles conformément à
            l’article 47 de la loi n° 2005-102 du 11 février 2005.
          </p>
          <p>A cette fin, il met en œuvre la stratégie et les actions suivantes :</p>
          <ul>
            <li>
              <a
                href="https://librairie.ademe.fr/institutionnel/6794-schema-pluriannuel-de-mise-en-accessibilite-des-sites-web-de-l-ademe-2024-2026.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Schéma pluriannuel de mise en accessibilité des actifs numériques de l’ADEME pour 2021-2023
              </a>
            </li>
            <li>
              <a
                href="https://librairie.ademe.fr/institutionnel/6823-plan-annuel-de-mise-en-accessibilite-des-sites-web-de-l-ademe.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Plan d’action de l’année en cours(ouvre un nouvel onglet).
              </a>
            </li>
          </ul>
          <p>
            Cette déclaration d’accessibilité s’applique au site <a :href="navigation.baseUrl">{{ navigation.baseUrl }}</a>
          </p>

          <h2 class="fr-mt-3w fr-h4">État de conformité</h2>
          <p>
            En l’absence d’audit et dans l’attente de celui-ci, le site
            <a :href="navigation.baseUrl">{{ navigation.baseUrl }}</a> n’est pas en conformité avec le référentiel général d’amélioration de
            l’accessibilité. Les non-conformités et/ou les dérogations sont énumérées ci-dessous.
          </p>

          <h2 class="fr-mt-3w fr-h4">Contenus non accessibles</h2>
          <h5 class="fr-h6">Non-conformité</h5>
          <p>Néant</p>
          <h5 class="fr-h6">Dérogations pour charge disproportionnée</h5>
          <p>Néant</p>
          <h5 class="fr-h6">Contenus non soumis à l’obligation d’accessibilité</h5>
          <p>Néant</p>

          <h2 class="fr-mt-3w fr-h4">Établissement de cette déclaration d'accessibilité</h2>
          <p>Cette déclaration a été établie le <time datetime="2025-07-21">21 juillet 2025</time>.</p>
          <ul>
            <li>
              Technologies utilisées pour la réalisation du site web :
              <ul>
                <li>Infrastructure langage: HTML, CSS, JavaScript, Python</li>
                <li>Infrastructure CMS: Néant</li>
              </ul>
            </li>
            <li>
              Agents utilisateurs, technologies d’assistance et outils utilisés pour vérifier l’accessibilité
              <ul>
                <li>
                  Les tests des pages web ont été effectués avec les combinaisons de navigateurs web et lecteurs d’écran suivants : Néant
                </li>
                <li>Les outils suivants ont été utilisés lors de l’évaluation : Néant</li>
                <li>Pages du site ayant fait l’objet de la vérification de conformité : Néant</li>
              </ul>
            </li>
          </ul>

          <h2 class="fr-mt-3w fr-h4">Retour d’information et contact</h2>
          <p>
            Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable du site internet pour être
            orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
          </p>
          <ul>
            <li>
              <a href="mailto:rgaa@ademe.fr">Envoyer un message au référent accessibilité de l'ADEME</a>
            </li>
            <li>
              Contacter Estelle Ribot,
              <address class="fr-display--inline">ADEME, DEMTE — 20 avenue du Grésillé BP 90 406 – 49 004 Angers Cedex 01</address>
            </li>
          </ul>

          <h4 class="fr-mt-3w">Voies de recours</h4>
          <p>
            Cette procédure est à utiliser dans le cas suivant. Vous avez signalé au responsable du site internet un défaut d’accessibilité
            qui vous empêche d’accéder à un contenu ou à un des services du portail et vous n’avez pas obtenu de réponse satisfaisante.
          </p>
          <ul>
            <li>
              Écrire un message au Défenseur des droits (
              <a
                href="https://formulaire.defenseurdesdroits.fr"
                target="_blank"
                rel="noopener noreferrer"
                >https://formulaire.defenseurdesdroits.fr
              </a>
              )
            </li>
            <li>
              Contacter le délégué du Défenseur des droits dans votre région (
              <a
                href="https://www.defenseurdesdroits.fr/saisir/delegues"
                target="_blank"
                rel="noopener noreferrer"
                >https://www.defenseurdesdroits.fr/saisir/delegues
              </a>
              )
            </li>
            <li>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)
              <ul>
                <li>
                  Défenseur des droits
                  <address>Libre réponse 71120 75342 Paris Cedex 07</address>
                </li>
              </ul>
            </li>
          </ul>
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
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  path: '/accessibilite',
  name: RouteName.Accessibility
})

const navigation = new Navigation()

const description = "Informations relatives à l'accessibilité du site de la Mission Transition écologique des entreprises."
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
