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
        questions: [
          {
            question: "Qu'est-ce que la transition écologique ?",
            answer:
              'La transition écologique peut être définie comme **l’ensemble des mesures à prendre afin de limiter l’impact de nos activités sur l’environnement**.\n' +
              '\n' +
              'Elle vise à repenser nos modes de production, de consommation et d’organisation afin de les inscrire dans une logique de développement durable.\n' +
              '\n' +
              'Pour une entreprise, cela signifie adapter son activité à ces enjeux (énergie, déchets, mobilité, achats, numérique, infrastructures…) tout en garantissant sa pérennité dans un monde en mutation.'
          },
          {
            question: 'Pourquoi la transition écologique est-elle une question urgente ?',
            answer:
              'Agir pour **limiter l’impact négatif de l’activité humaine** est devenu un **impératif absolu**. \n' +
              '\n' +
              'La vie sur Terre est le produit de conditions exceptionnelles qui l’ont rendue propice. \n' +
              '\n' +
              'En 2009, une équipe de scientifiques (J. Rockström et W. Steffen) établit une liste de 9 conditions qui interagissent les uns avec les autres. Il s’agit de **9 limites planétaires** qui, si elles étaient dépassées, emballeraient le système d’une manière difficilement prévisible, avec des conséquences dramatiques et irréversibles, compromettant la possibilité de la vie sur Terre.\n' +
              '\n' +
              'Ces 9 limites planétaires sont :\n' +
              '\n' +
              '- Le changement d’occupation des sols\n' +
              '- Le cycle de l’eau douce\n' +
              '- La perturbation des cycles de l’azote et du phosphore\n' +
              '- L’érosion de la biodiversité\n' +
              '- Le changement climatique\n' +
              '- Les nouvelles entités dans la biosphère\n' +
              '- L’acidification des océans\n' +
              '- L’augmentation des aérosols dans l’atmosphère\n' +
              '- L’appauvrissement de la couche d’ozone\n' +
              '\n' +
              'Seules les trois dernières limites n’ont pas été dépassées depuis 2023. **Toutes les autres ont été franchies**.\n' +
              '\n' +
              'Pour les entreprises, l’enjeu est double : \n' +
              '\n' +
              '- Les entreprises peuvent agir à leur niveau pour **réaliser une transition écologique** sur différents plans (transformation du bâtiment, économies d’énergie, déchets, mobilité, aménagement de la chaîne de valeur…) et contribuer à **réduire les impacts négatifs de leur activité** sur les limites planétaires.\n' +
              '- Les entreprises doivent s’adapter sans tarder pour **pérenniser et adapter leur activité face à aux catastrophes climatiques** (canicules, inondations, tempêtes…) dont la fréquence ne cesse d’augmenter. Elles doivent également **se conformer à la mise en place de nouvelles règlementations**.'
          },
          {
            question: 'Pourquoi la transition écologique est une nécessité pour les entreprises ?',
            answer:
              'Pour les entreprises, les enjeux de la transition écologique sont multiples :\n' +
              '\n' +
              '- **Réduire leur impact environnemental** en agissant sur l’énergie, les bâtiments, les déchets, la mobilité ou encore la chaîne de valeur.\n' +
              '- **Faire face aux risques croissants** liés au dérèglement climatique (canicules, inondations, tempêtes…).\n' +
              '- **Se conformer à la mise en place de nouvelles réglementations,** notamment en matière de Responsabilité sociétale des entreprises (RSE) ou de durabilité.\n' +
              '- **Diminuer les coûts opérationnels** en réduisant leur consommation d’énergie, d’eau ou de matières premières.\n' +
              '- **Accéder à de nouvelles sources de financements** de plus en plus conditionnés à des critères environnementaux, sociaux ou de gouvernance.\n' +
              '- **Améliorer leur image de marque**, attirer les talents, renforcer la confiance des clients et des partenaires.\n' +
              '- **Innover et rester compétitives** dans un contexte de transformation économique rapide.'
          },
          {
            question: 'Comment rendre son entreprise plus écologique ?',
            answer:
              'La première étape pour engager une transition écologique est de comprendre où et comment votre entreprise impacte l’environnement. Cela passe par un **diagnostic environnemental** qui vous permet d’identifier vos principaux postes d’impact et de prioriser les actions à mener.\n' +
              '\n' +
              '**Si vous avez déjà un enjeu en tête** (énergie, déchets, mobilité, eau…), un diagnostic ciblé vous aidera à structurer votre plan d’action. Vous pouvez, par exemple, faire un bilan complet de votre consommation énergétique, de votre empreinte carbone, de votre politique de mobilité, de votre gestion des déchets, etc.\n' +
              '\n' +
              'Sinon, le [**Diagnostic 360°**](/projets-entreprise/diag-360/diagnostic-transition-ecologique), gratuit sous certaines conditions, vous offre une vision d’ensemble de vos impacts pour faire émerger vos priorités et initier la transition écologique de votre entreprise.'
          },
          {
            question: 'Quel est le rôle des aides aux entreprises dans la transition écologique ?',
            answer:
              'Les aides aux entreprises servent à financer la transition écologique et à accompagner les entreprises dans la mise en œuvre d’un projet, quel que soit son degré de maturité. \n' +
              '\n' +
              'Si vous ne savez pas par où commencer, une formation sur les enjeux de la transition écologique ou un diagnostic de vos consommations énergétiques constituent d’excellents points de départ.\n' +
              '\n' +
              'Si vous avez une idée plus précise, par exemple, installer une pompe à chaleur dans vos locaux ou engager une stratégie RSE, vous aurez sans doute besoin d’un financement ou d’un prêt à taux préférentiel. Les aides publiques sont là pour ça !'
          },
          {
            question: 'À qui s’adresser pour bénéficier d’aides aux entreprises pour la transition écologique ?',
            answer:
              '**Vous êtes au bon endroit !**\n' +
              '\n' +
              'Notre plateforme *Transition Écologique des Entreprises* a été conçue pour aider les entreprises à **trouver les aides et les subventions qui peuvent accompagner leur projet de transition écologique**, quel que soit son degré de maturité.\n' +
              '\n' +
              'Ainsi, nous mettons en relation les entreprises avec les **bons dispositifs** et les **bons interlocuteurs**.\n' +
              '\n' +
              'Les **aides aux entreprises** sont principalement proposées par des acteurs publics dont l’État, l’ADEME, les collectivités locales ou encore Bpifrance.'
          }
        ]
      }
    ],
    [FaqPage.CatalogProgram]: [
      {
        title: 'Quelles aides ?',
        color: Color.blue,
        questions: [
          {
            question: 'Quelles sont les aides et subventions auxquelles peut prétendre une entreprise ?',
            answer:
              'Il existe en France une multitude d’aides publiques et de subventions pour accompagner les entreprises à chaque étape de leur vie : création, développement, innovation, transition numérique, transition écologique...\n' +
              'Mais ces aides sont souvent éparpillées entre de nombreux acteurs, avec des critères et des démarches parfois complexes à identifier.\n' +
              '\n' +
              'La plateforme Transition Écologique des Entreprises se concentre exclusivement sur les aides dédiées à la transition environnementale. Elle permet de centraliser ces dispositifs en un seul endroit, de les rendre lisibles et de faciliter l’orientation vers les bons interlocuteurs.'
          },
          {
            question: "Quels sont les différents types d'aides et comment en bénéficier ?",
            answer:
              'Les aides disponibles sur la plateforme *Transition Écologique des Entreprises* sont de différentes natures. Faisons le point :\n' +
              '\n' +
              '- **Les études :** Ce sont des aides qui vous permettent d’évaluer, avec l’aide d’un expert la faisabilité d’un projet avant investissement. Certaines études peuvent être financées en partie ou intégralement.\n' +
              '- **Les formations :** Il peut s’agir de formations en ligne ou en présentiel, individuelles ou collectives. Elles portent sur une ou plusieurs thématiques de transition écologiques. Certaines formations peuvent donner droit à une labellisation.\n' +
              '- **Les financements :** Les aides financières contribuent, avant ou après travaux, à la réalisation d’un projet de transition écologique précis.\n' +
              '- **Les prêts :** Ils vous donnent droit à une avance de trésorerie à taux préférentiels, pour des investissements portant sur la transition écologique.\n' +
              '- **Les avantages fiscaux :** Il s’agit d’aides financières qui ne sont pas versées en monnaie sonnante et trébuchante, mais déduite de votre déclaration d’impôts l’année suivante.\n' +
              '- **Les appels à projets :** Ce sont des financements octroyés aux projets les plus pertinents sur une problématique donnée.'
          },
          {
            question: 'De quels opérateurs publics centralisez-vous les aides ?',
            answer:
              'Les principaux opérateurs publics dont les dispositifs sont répertoriés sont l’**ADEME, Bpifrance, CCI France, CMA, l’Office Français de la Biodiversité, la DDFIP**…\n' +
              '\n' +
              "Transition Écologique des Entreprises intègre également les aides principales portées par les régions (Provence-Alpes-Côte d'Azur, Grand Est, Bretagne…)."
          },
          {
            question: 'Est-ce que les subventions de l’ADEME sont présentes sur la plateforme ?',
            answer:
              "Oui, la plateforme *Transition Écologique des Entreprises* référence les subventions et dispositifs d'accompagnement proposés par l’ADEME (Agence de la transition écologique). Ces aides couvrent un large éventail de thématiques : plan bas carbone, audit énergétique, bilan carbone, Bonus Réparation, décarbonation… \n" +
              '\n' +
              'La plateforme permet de les filtrer en fonction de la taille de votre entreprise, de votre secteur d’activité et de votre région pour identifier rapidement celles qui peuvent vous concerner.'
          },
          {
            question: 'Est-ce que je peux retrouver l’exhaustivité des aides existantes sur Transition Écologique des Entreprises ?',
            answer:
              'Il existe des centaines d’aides (sans exagérer) à la transition écologique.\n' +
              '\n' +
              'Certaines durent plusieurs années, d’autres à peine quelques semaines. Certaines s’adressent à des milliers d’entreprises sur tout le territoire national, d’autres seulement à une poignée. Forcément, il a fallu faire du tri.\n' +
              '\n' +
              'Nous avons donné **la priorité aux aides destinées aux TPE et PME, aussi bien au niveau national que régional**. Transition Écologique des Entreprises est en constante évolution et nous ajoutons chaque jour de nouvelles aides. Si vous pensez qu’il en manque une, n’hésitez pas à nous écrire.'
          },
          {
            question: 'Pourquoi faire une étude avant de réaliser un investissement  ?',
            answer:
              'Avant de lancer des travaux importants, il est souvent nécessaire de réaliser une **étude de faisabilité**. Cette étape consiste à être accompagné par un expert qui analyse votre situation (infrastructures, contraintes techniques, réglementaires…) pour vérifier que le projet est viable, identifier les solutions techniques adaptées et estimer les bénéfices attendus, notamment sur votre consommation énergétique.\n' +
              '\n' +
              'Une fois cette étape validée, vous pouvez demander un **financement**, c’est-à-dire une aide financière (subvention, prêt à taux réduit, etc.) qui vous permet de couvrir tout ou partie du coût de vos travaux ou investissements.\n' +
              '\n' +
              'Certains opérateurs publics, comme l’ADEME, proposent des études de faisabilité partiellement financées. Réaliser cette étude facilite ensuite l’accès aux financements nécessaires pour concrétiser votre projet.'
          },
          {
            question: 'Faut-il faire les travaux avant ou après avoir reçu les financements ?',
            answer:
              'Ça dépend ! Certaines aides ne peuvent vous être accordées que si les travaux n’ont pas encore commencé. Il est donc essentiel d’en faire la demande avant d’engager toute dépense.\n' +
              '\n' +
              'D’autres aides, au contraire, sont attribuées sur présentation de la facture, une fois les travaux réalisés.\n' +
              '\n' +
              'C’est pourquoi il est important de **lire attentivement les conditions d’attribution de chaque aide**. En cas de doute, n’hésitez pas à cliquer sur « J’ai une question ».'
          },
          {
            question: 'Qu’est-ce qu’un appel à projets ?',
            answer:
              'Un appel à projets est un **financement** un peu particulier. L’appel à projets **met en concurrence des projets autour d’une problématique**, tout en vous laissant une certaine latitude quant à la manière d’y répondre. Si votre projet, parmi tous les projets ayant postulé, est retenu, vous bénéficiez du financement. \n' +
              '\n' +
              'Il peut s’agir, par exemple, d’un appel à projets pour décarboner l’industrie. L’opérateur public examinera donc tous les projets qui prétendent avoir un impact positif sur le bilan carbone du secteur industriel, et financera ceux qui lui semblent pertinents.'
          },
          {
            question: 'Quelle est la différence entre un financement par les CEE et un financement par un opérateur public ?',
            answer:
              'Les **Certificats d’Économies d’Énergie (CEE)** sont des aides financières émanant d’**acteurs privés**. Ils sont versés par les fournisseurs d’énergie (électricité, gaz, fioul, carburant…) dans le cadre d’une obligation légale visant à aider les particuliers, les entreprises et les associations (sans distinction) à mettre en place des économies d’énergie. Les [CEE](https://www.ecologie.gouv.fr/politiques-publiques/dispositif-certificats-deconomies-denergie) peuvent prendre la forme d’une prime, d’une réduction directe sur votre devis ou d’un remboursement après travaux. \n' +
              '\n' +
              'Les **financements provenant d’opérateurs publics** (ADEME, Bpifrance, CCI, CMA…), quant à eux, sont des **aides versées par l’État ou une collectivité territoriale**. Elles ne s’appliquent par à tous mais conditionnent leur versement à des critères bien spécifiques. Par exemple, certains financements ne seront attribués qu’à des entreprises de plus de 200 salariés dans le secteur de l’industrie et les particuliers ne pourront pas en bénéficier.'
          },
          {
            question: "Je ne trouve aucune aide pour financer mon projet. Qu'est-ce que ça signifie ?",
            answer:
              'Cela ne veut pas dire qu’il n’existe aucune aide pour votre projet, mais simplement qu’**aucune n’est actuellement visible** sur la plateforme *Transition Écologique des Entreprises* pour votre situation (secteur d’activité, localisation, taille d’entreprise…). \n' +
              'Notre base de données est **mise à jour en continu**, mais toutes les aides existantes n’y sont pas encore recensées.\n' +
              '\n' +
              'N’hésitez pas à **nous contacter** pour nous présenter votre projet : nous pourrons vous orienter vers des conseillers locaux qui connaissent bien les dispositifs disponibles dans votre territoire.\n' +
              '\n' +
              'Dans certains cas, il n’y a pas de budget public alloué à un projet. Mais il n’est pas disqualifié pour autant. Ce projet reste **pertinent d’un point de vue écologique et économique** pour votre entreprise. Isoler vos bâtiments peut, par exemple, vous faire réaliser d’importantes économies d’énergie et faire baisser considérablement votre facture, que le projet soit initialement financé ou non.'
          }
        ]
      }
    ],
    [FaqPage.CatalogProject]: [
      {
        title: 'Quels projets de transition écologique ?',
        color: Color.green,
        questions: [
          {
            question: 'Qu’est-ce qu’un projet écologique pour une entreprise ?',
            answer:
              'Un projet écologique en entreprise désigne toute action mise en place pour limiter son impact sur l’environnement. Cela peut concerner la consommation d’énergie, la gestion des déchets, les achats, la mobilité, la biodiversité ou encore la fabrication des produits.\n' +
              '\n' +
              'Il n’y a pas de définition unique, un projet « vert » peut être très \n' +
              'simple (installer un éclairage LED) ou plus structurant (rénover un bâtiment, repenser une chaîne logistique, adopter une démarche d’écoconception…).\n' +
              '\n' +
              'Ces projets peuvent répondre à différents objectifs :\n' +
              '- Réduire les consommations d’eau, d’énergie ou de matières premières.\n' +
              '- Limiter les émissions de gaz à effet de serre.\n' +
              '- Mieux gérer les déchets ou les emballages.\n' +
              '- Proposer des produits ou services plus durables.\n' +
              '\n' +
              'Pour transformer l’intention en action, ces projets peuvent être \n' +
              'soutenus par des aides publiques, des formations ciblées, des \n' +
              'subventions ou des diagnostics adaptés.'
          },
          {
            question: 'En quoi consistent les projets de transition écologique référencés sur cet outil ?',
            answer:
              'Nous avons pris le temps d’écouter les chefs d’entreprise pour comprendre leurs besoins et leurs ambitions en matière de transition écologique.\n' +
              '\n' +
              'Qu’il s’agisse d’installer des panneaux solaires, d’acheter de l’électroménager basse consommation, de mettre en place une flotte de vélos pour les salariés ou de lancer une politique RSE, la **diversité des projets** est grande — et elle s’enrichit chaque jour. Vous pouvez découvrir le [**catalogue complet ici**](/projets-entreprise).\n' +
              '\n' +
              'Pour chaque projet, vous trouverez des **ressources utiles** ainsi que les **aides publiques correspondantes**. En renseignant le nom de votre entreprise ou votre SIRET, vous saurez rapidement si vous êtes éligible.'
          },
          {
            question: "À quoi correspond l'ordre de priorité ?",
            answer:
              'Pour chaque thématique (énergie, rénovation, mobilité, eau…), nous avons identifié **un projet à faire en priorité**. \n' +
              '\n' +
              'Il peut s’agir d’un plan d’action à mener après un diagnostic approfondi, ou d’un projet simple à mettre en œuvre permettant d’obtenir un **impact maximal avec un investissement minimal**.\n' +
              '\n' +
              'Par exemple, si vous souhaitez rafraîchir vos bâtiments en été, plutôt que de penser directement à l’installation d’une pompe à chaleur réversible ou à une rénovation thermique complète, nous vous conseillons de commencer par revoir vos [**ouvrants et ombrages**](/projets-entreprise/ouvrants-ombrages?theme=building) (volets, films solaires, pergolas, voiles d’ombrage…). C’est un projet peu coûteux qui peut avoir un effet très significatif.'
          }
        ]
      },
      {
        title: 'Quelles thématiques environnementales ?',
        color: Color.yellow,
        questions: [
          {
            question: '⚡️ Qu’est-ce que l’efficacité énergétique ?',
            answer:
              'L’efficacité énergétique mesure le rapport entre l’énergie consommée et le service rendu. On parle d’efficacité lorsqu’un équipement, un bâtiment ou un véhicule **consomme moins d’énergie pour un même usage** : chauffer une pièce, produire un bien, éclairer un espace, etc.\n' +
              '\n' +
              'Remplacer une vieille chaudière par un modèle à haut rendement, installer des ampoules LED ou améliorer l’isolation sont autant d’actions d’efficacité énergétique.\n' +
              '\n' +
              'À ne pas confondre avec la **sobriété énergétique**, qui vise à **réduire les besoins en énergie** en modifiant les comportements (chauffer un peu moins, optimiser les déplacements…).\n' +
              '\n' +
              '👉 En entreprise, **combiner efficacité et sobriété** permet **d’engager concrètement la transition énergétique** tout en réduisant durablement vos consommations, vos coûts et votre empreinte carbone.'
          },
          {
            question: '💧 Comment puis-je réduire la consommation d’eau dans mon entreprise ?',
            answer:
              'L’augmentation des coûts et la raréfaction de l’eau sont deux raisons essentielles pour réduire la consommation d’eau au sein d’une entreprise. \n' +
              '\n' +
              'En entreprise, vous pouvez agir :\n' +
              '\n' +
              '- **En intérieur**, en installant des équipements économes (mitigeurs, double chasse d’eau) et en optimisant l’utilisation des machines (lave-linge, lave-vaisselle, etc.).\n' +
              '- **Dans vos process de production**, en adaptant les procédés pour consommer moins d’eau, recycler l’eau utilisée ou utiliser des alternatives moins gourmandes.\n' +
              '- **En extérieur**, en adoptant des systèmes d’arrosage économes (goutte-à-goutte, paillage), en récupérant l’eau de pluie, ou en installant des toilettes sèches.\n' +
              '\n' +
              "Les leviers d’action sont nombreux. Pour les identifier, vous pouvez commencer par effectuer un [**diagnostic ciblé** de votre consommation d'eau](/projets-entreprise/plan-action-eau?theme=water)."
          },
          {
            question: '🏢 Qu’est-ce qu’un bâtiment basse consommation ?',
            answer:
              'Un bâtiment basse consommation (BBC) consomme **moins d’énergie qu’un bâtiment standard** **pour être chauffé, rafraîchi, ventilé et éclairé**. En France, il respecte généralement la norme RT 2012 ou RE2020, avec une consommation inférieure à **50 kWh/m²/an**.\n' +
              '\n' +
              'Pour réduire la consommation énergétique d’un bâtiment, on peut agir sur :\n' +
              '\n' +
              '- son **isolation thermique** (par l’intérieur ou l’extérieur)\n' +
              '- la **performance de ses équipements** (chauffage, ventilation, éclairage…)\n' +
              '- sa **conception bioclimatique** (orientation, compacité, apports solaires…)\n' +
              '- son **mode de chauffage** (pompe à chaleur, géothermie…)\n' +
              '\n' +
              '👉 Un [audit énergétique](/projets-entreprise/audit-energetique) peut vous permettre de faire expertiser vos locaux professionnel afin de les rendre plus confortables, plus performants et de réaliser des économies durables dans le cadre d’une rénovation.'
          },
          {
            question: '🚲 Qu’est-ce que la mobilité douce en entreprise ?',
            answer:
              'La mobilité douce en entreprise désigne l’ensemble des **déplacements professionnels à faible impact environnemental** : marche, vélo, transports en commun, covoiturage, ou véhicules bas carbone.\n' +
              '\n' +
              'Elle vise à **remplacer les transports polluants**, routiers ou aériens, par des solutions plus durables, parfois alimentées en énergie renouvelable (véhicules électriques, ferroviaire…).\n' +
              '\n' +
              'Cela concerne :\n' +
              '\n' +
              '- les **trajets domicile-travail** de vos collaborateurs,\n' +
              '- le **transport de marchandises**,\n' +
              '- les **déplacements de vos fournisseurs**.\n' +
              '\n' +
              '👉 Le [**plan d’action mobilité**](/projets-entreprise/plan-mobilite?theme=mobility) est un outil clé pour organiser et développer la mobilité douce dans votre entreprise.'
          },
          {
            question: '🐝 Peut-on concilier développement économique et biodiversité ?',
            answer:
              'La biodiversité désigne l’ensemble des êtres vivants et les écosystèmes dans lesquels ils évoluent. Elle est essentielle pour l’agriculture, la santé, le climat, l’eau… \n' +
              '\n' +
              'Le modèle de développement économique actuel repose sur une **logique extractive et d’accroissement qui se heurte avec les limites planétaires**, limites que nous avons déjà en grande part dépassées. Il est donc impératif de repenser des modèles de développement économique qui ne supposent plus d’endommager de manière irrémédiable la biosphère, mais s’engagent dans une logique de **limitation des impacts négatifs, et plus encore de régénération du vivant et de la biodiversité**.\n' +
              '\n' +
              'Les entreprises font face à des défis climatiques et énergétiques majeurs. Il leur faut repenser leur feuille de route en tenant compte des questions environnementales et intégrer à leurs valeurs l’**adaptation**, la **résilience** et la **préservation des écosystèmes**.'
          },
          {
            question: '🧑‍🎓 Pourquoi votre stratégie RSE doit-elle intégrer la transition écologique ?',
            answer:
              'La transition écologique transforme en profondeur les façons de produire, de consommer et de travailler. Pour s’y engager durablement, les entreprises peuvent s’appuyer sur une démarche structurée : **la RSE (Responsabilité Sociétale des Entreprises).** \n' +
              '\n' +
              'La RSE permet de mobiliser vos salariés autour d’actions concrètes, de faire évoluer les comportements et de donner du sens à votre démarche de transition.\n' +
              '\n' +
              'Une stratégie RSE, même à l’échelle d’une TPE ou PME, vous aide à :\n' +
              '\n' +
              '- **sensibiliser** aux enjeux écologiques et sociaux,\n' +
              '- **former** vos équipes aux bons gestes,\n' +
              '- **construire** un plan d’action réaliste et partagé.\n' +
              '\n' +
              'C’est un moyen simple de **faire de la transition écologique une valeur partagée**, intégrée à la culture de votre entreprise.\n' +
              '\n' +
              '💡 Envie de structurer votre démarche ? Découvrez le [projet “stratégie RSE”](/projets-entreprise/strategie-rse?theme=rh)'
          },
          {
            question: '🔁 Qu’est-ce que l’écoconception et pourquoi l’adopter en entreprise ?',
            answer:
              'L’écoconception consiste à **intégrer l’impact environnemental** dès la conception d’un produit ou d’un service, en considérant tout son cycle de vie : de l’**extraction des matériaux** à la **fabrication**, jusqu’à la **fin de vie**.\n' +
              '\n' +
              'Cela peut se traduire par :\n' +
              '\n' +
              '- choisir des matériaux durables ou recyclés ;\n' +
              '- repenser un emballage trop volumineux ou polluant ;\n' +
              '- concevoir un produit réparable ou recyclable ;\n' +
              '- optimiser les transports pour réduire l’empreinte carbone.\n' +
              '\n' +
              'Les produits écoconçus peuvent aussi obtenir un label, valorisant votre démarche auprès de vos clients et renforçant la confiance en votre entreprise.\n' +
              '\n' +
              '💡 Découvrez comment passer à l’action en consultant [la fiche “éco-conception”](https://mission-transition-ecologique.beta.gouv.fr/projets-entreprise/ecoconception?theme=eco-design)'
          }
        ]
      }
    ]
  }
}
