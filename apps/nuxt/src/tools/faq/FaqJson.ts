import { FaqPage, FaqType } from '@/tools/faq/faqType'
import { Color } from '@/types'

export class FaqJson {
  static pages: FaqType = {
    [FaqPage.Faq]: [
      {
        title: 'Comment marche cet outil ?',
        color: Color.green,
        questions: [
          {
            question: 'Qu’est-ce que la plateforme *Transition Écologique des Entreprises* ?',
            answer:
              'La plateforme *Transition Écologique des Entreprises* est un service public en ligne, gratuit, qui accompagne les entreprises dans leurs démarches de transition environnementale.\n' +
              '\n' +
              'Son rôle est de rendre visibles et accessibles les aides existantes pour financer des projets écologiques et orienter les entreprises vers les \n' +
              'bons interlocuteurs pour les accompagner dans leur transition.\n' +
              '\n' +
              'Concrètement, la plateforme permet de rechercher des aides adaptées à sa situation, de découvrir des projets inspirants et d’être mis en relation avec les bons acteurs pour passer à l’action plus facilement.\n' +
              '\n' +
              'Entre janvier et juin 2025, **plus de 4000 entreprises ont été orientées grâce à la plateforme** *Transition Écologique des Entreprises* !'
          },
          {
            question: 'Comment la plateforme peut-elle aider mon entreprise dans sa transition écologique ?',
            answer:
              'La plateforme *Transition Écologique des Entreprises* a été conçue pour simplifier l’accès à l’information et faire gagner du temps aux entreprises. \n' +
              '\n' +
              'En quelques étapes, elle vous permet : \n' +
              '\n' +
              '- D’identifier les aides publiques adaptées à votre entreprise.\n' +
              '- De comprendre rapidement les critères d’éligibilité et les démarches à effectuer.\n' +
              '- D’être mis en relation avec les bons interlocuteurs pour vous aider à avancer sereinement.\n' +
              '- De vous inspirer, si besoin, de projets similaires.\n' +
              '\n' +
              'Que vous en soyez au stade de l’idée ou déjà dans la mise en œuvre, la plateforme vous oriente vers les ressources et les contacts utiles pour faire progresser concrètement votre transition.'
          },
          {
            question: 'Pourquoi faut-il renseigner son entreprise / numéro SIRET ?',
            answer:
              'Votre SIRET contient de nombreuses informations, comme le **secteur d’activité** de votre entreprise, son **effectif** et sa **situation géographique**.\n' +
              '\n' +
              'En renseignant le nom de votre entreprise ou votre SIRET, nous **filtrons les aides** afin de vous proposer uniquement celles qui correspondent à votre profil et qui sont disponibles dans votre zone géographique.\n' +
              '\n' +
              'Nul besoin, par exemple, de vous proposer un financement destiné aux entreprises agricoles si vous possédez un salon de coiffure !'
          },
          {
            question: 'Qui sont les conseillers derrière cette plateforme ?',
            answer:
              'En renseignant le nom de votre entreprise ou votre SIRET, nous **filtrons les aides** afin de vous proposer uniquement celles qui correspondent à votre profil et qui sont disponibles dans votre zone géographique.\n' +
              '\n' +
              'Les demandes que vous déposez sur *Transition Écologique des Entreprises* sont immédiatement transmises à **Conseillers Entreprises** qui se charge alors d’identifier les **bons interlocuteurs sur votre territoire et dans votre secteur d’activité** pour vous répondre.'
          },
          {
            question: 'Est-ce que la plateforme *Transition Écologique des Entreprises* est gratuite ?',
            answer:
              'Oui ! L’outil est financé par des opérateurs publics et par l’État, c’est un service **entièrement gratuit** à destination des entreprises.'
          },
          {
            question: 'Quels types d’aides peut-on y trouver et comment y accéder ?',
            answer:
              'La plateforme *Transition Écologique des Entreprises* recense de nombreuses aides publiques destinées à soutenir les projets de transition des entreprises.\n' +
              '\n' +
              'La recherche d’aides se fait en quelques clics. Il vous suffit de renseigner votre SIRET ou de compléter vos informations manuellement (localisation, activité, effectif).\n' +
              '\n' +
              'En fonction de ces critères, la plateforme vous propose une sélection personnalisée d’aides et de dispositifs. Vous pouvez ensuite affiner les résultats à l’aide de filtres (thématique, type d’aide, niveau d’accompagnement, opérateurs).\n' +
              '\n' +
              'Chaque aide est présentée de manière claire avec ses critères d’éligibilité, les démarches à effectuer et la possibilité d’être mis en relation avec le bon interlocuteur.'
          }
        ]
      },
      {
        title: 'Pour qui ?',
        color: Color.purple,
        questions: [
          {
            question: 'À qui s’adresse la plateforme ?',
            answer:
              'La plateforme *Transition Écologique des Entreprises* référence des aides pour les entreprises de toutes tailles, du micro-entrepreneur à la grande entreprise.\n' +
              '\n' +
              'Mais parce que la transition écologique doit être accessible à toutes les entreprises, nous mettons un **accent particulier sur les TPE et les PME**, qui représentent la **majorité des entreprises en France**. Notre objectif : aider le plus grand nombre à passer à l’action, quels que soient les moyens ou la taille de la structure.\n' +
              '\n' +
              "Si le sujet vous intéresse, vous trouverez plus d’informations sur la [stratégie de l'ADEME pour accélérer la transition écologique des entreprises (2025-2028)](https://librairie.ademe.fr/institutionnel/7912-strategie-de-l-ademe-pour-accelerer-la-transition-ecologique-des-entreprises-9791029724121.html)"
          },
          {
            question: 'La plateforme s’adresse-t-elle aussi aux collectivités territoriales ?',
            answer:
              'La plateforme *Transition Écologique des Entreprises* est **dédiée en priorité aux entreprises**.\n' +
              '\n' +
              'Les collectivités territoriales disposent d’un espace qui leur est spécialement consacré : le volet collectivité de la [**plateforme Agir**](https://agirpourlatransition.ademe.fr/collectivites/). Elles y trouveront l’ensemble des aides et financements adaptés à leurs projets de transition écologique.'
          },
          {
            question: 'Je suis micro-entrepreneur, suis-je concerné ?',
            answer:
              'Oui, certaines aides sont accessibles aux micro-entrepreneurs, d’autres non. \n' +
              '\n' +
              'Les **conditions d’éligibilité** de chaque dispositif précisent systématiquement si ce statut est concerné.'
          },
          {
            question: 'Mon secteur d’activité est-il concerné par les aides proposées ?',
            answer:
              'Une grande partie des aides du catalogue de *Transition Écologique des Entreprises* s’adresse à **toutes les entreprises, quel que soit leur secteur**. Des projets comme la réduction des consommations d’énergie, la gestion des déchets ou la mobilité concernent la plupart des activités professionnelles.\n' +
              '\n' +
              'Cela dit, **certaines aides sont bel et bien spécifiques à un secteur**. Nous avons notamment identifié des dispositifs ciblés pour le **tourisme**, le **transport**, l’**industrie**, et d’autres secteurs suivront. Notre équipe enrichit le catalogue en continu pour que chacun puisse trouver des aides adaptées à son activité.'
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
