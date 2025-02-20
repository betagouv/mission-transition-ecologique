const projectFrDict = {
  project: {
    studyPrograms: 'Pour étudier votre projet :',
    noPrograms: {
      title: "Nous n'avons pas trouvé d’aide éligible à votre entreprise.",
      subtitle: "Contactez nous pour nous expliquer votre projet, nous pourrons sans doute vous aider à agir par d'autres moyens !"
    },
    projectRegisterHighlightText: 'Vous voulez voir uniquement les aides éligibles pour votre entreprise ?',
    financePrograms: 'Pour financer votre investissement :',
    result: {
      resume: 'Voici les actions par lesquelles commencer pour votre {effectif} du secteur {secteur} :'
    },
    linkedProjects: {
      title: 'En pré-requis à ce projet :',
      description:
        "Afin de réaliser ce projet, nous vous conseillons de vérifier le prérequis suivant. Une étape souvent obligatoire ou, au mieux, importante pour garantir la pertinence, l'efficacité et la durabilité du projet de transition écologique de votre entreprise."
    },
    form: {
      title: 'Vous avez une question sur ce projet ?',
      hint: '👋 Des experts de la transition écologique des entreprises sont là pour répondre à vos questions et vous orienter.',
      errorEmail: {
        subject: "[france-transition] Demande d'informations concernant le projet {titre}"
      },
      needs: `Bonjour,

Mon entreprise a une activité de type "{secteur}".
J'ai pour projet de ...
Le montant du projet est de ...
J'ai besoin d'être accompagné(e) sur ...

Merci d'avance pour votre appel`
    }
  },
  otherProject: {
    form: {
      title: 'Vous avez une question sur ce projet ?',
      hint: '👋 Des experts de la transition écologique des entreprises sont là pour répondre à vos questions et vous orienter.',
      errorEmail: {
        subject: "[france-transition] Demande d'informations concernant le projet {titre}"
      },
      needs: `Bonjour,

Mon entreprise a une activité de type "{secteur}".
J'ai pour projet de ...
J'ai recherché une aide pour ...

Merci d'avance pour votre retour`
    }
  }
}

export default projectFrDict
