import { FaqPage, FaqType } from '@/tools/faq/faqType'
import { Color } from '@/types'

export class FaqJson {
  static pages: FaqType = {
    [FaqPage.Faq]: [
      {
        title: 'Concrètement, comment marche cet outil ?',
        color: Color.green,
        questions: [
          {
            question: 'Est-ce que la plateforme Transition Écologique des Entreprises est gratuite ?',
            answer:
              'Oui ! L’outil est financé par des opérateurs publics et par l’État, c’est un service entièrement gratuit à destination des entreprises.'
          },
          {
            question: 'Pourquoi faut-il renseigner son entreprise / numéro SIRET ?',
            answer:
              'Votre SIRET contient de nombreuses informations, comme le secteur d’activité de votre entreprise, son effectif et sa situation géographique.\n\nEn renseignant le nom de votre entreprise ou votre SIRET, nous filtrons les aides afin de vous proposer uniquement celles qui correspondent à votre profil et qui sont disponibles dans votre zone géographique.\n\nNul besoin, par exemple, de vous proposer un financement destiné aux entreprises agricoles si vous possédez un salon de coiffure !'
          },
          {
            question: 'Qui sont les conseillers derrière cette plateforme ?',
            answer:
              'Les demandes que vous déposez sur notre plateforme sont immédiatement transmises à Conseillers Entreprises qui se charge alors d’identifier les bons interlocuteurs sur votre territoire et dans votre secteur d’activité pour vous répondre.'
          }
        ]
      },
      {
        title: 'Pour qui ?',
        color: Color.purple,
        questions: [
          {
            question: 'Les collectivités territoriales font-elles partie de votre cible ?',
            answer:
              'Non hélas. Nous ciblons les entreprises et nos aides s’adressent à elles en priorité. Les collectivités territoriales trouveront leur bonheur sur la [plateforme Agir](https://agirpourlatransition.ademe.fr/collectivites/).'
          },
          {
            question: 'Je suis micro-entrepreneur, suis-je concerné ?',
            answer:
              'Oui ! Certaines aides sont accessibles aux micro-entrepreneurs et d’autres non. Nous le précisons à chaque fois dans les conditions d’éligibilité.'
          },
          {
            question: 'Pour quelles tailles d’entreprises avez-vous le plus d’aides ?',
            answer:
              "Nous référençons des aides pour les entreprises de toutes tailles.\n\nMais parce que la transition écologique doit être accessible à toutes les entreprises, nous mettons un accent particulier sur les TPE et les PME, qui représentent la majorité des entreprises en France. Notre objectif : aider le plus grand nombre à passer à l’action, quels que soient les moyens ou la taille de la structure.\n\nSi le sujet vous intéresse, vous trouverez plus d’informations sur la [stratégie de l'ADEME pour accélérer la transition écologique des entreprises (2025-2028)](https://librairie.ademe.fr/institutionnel/7912-strategie-de-l-ademe-pour-accelerer-la-transition-ecologique-des-entreprises-9791029724121.html)."
          },
          {
            question: 'Mon secteur d’activité est-il concerné par les aides proposées ?',
            answer:
              'Une grande partie des aides de notre catalogue s’adresse à toutes les entreprises, quel que soit leur secteur. Des projets comme la réduction des consommations d’énergie, la gestion des déchets ou la mobilité concernent la plupart des activités professionnelles.\n\nCela dit, certaines aides sont bel et bien spécifiques à un secteur. Nous avons notamment identifié des dispositifs ciblés pour le tourisme, le transport, l’industrie, et d’autres secteurs suivront. Notre équipe enrichit le catalogue en continu pour que chacun puisse trouver des aides adaptées à son activité.'
          }
        ]
      }
    ],
    [FaqPage.Home]: [
      {
        title: 'Pourquoi ?',
        color: Color.red,
        questions: []
      },
      {
        title: 'Comment marche cet outil ?',
        color: Color.yellow,
        questions: []
      }
    ],
    [FaqPage.CatalogProgram]: [
      {
        title: 'Quelles aides ?',
        color: Color.red,
        questions: []
      }
    ],
    [FaqPage.CatalogProject]: [
      {
        title: 'Quels projets de transition écologique ?',
        color: Color.red,
        questions: []
      },
      {
        title: 'Quelles thématiques environnementales ?',
        color: Color.yellow,
        questions: []
      }
    ]
  }
}
