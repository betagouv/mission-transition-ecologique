const projectFrDict = {
  project: {
    studyPrograms: 'Pour étudier votre projet :',
    noPrograms: {
      title: "Nous n'avons pas trouvé d’aide éligible à votre entreprise.",
      subtitle: "Contactez nous pour nous expliquer votre projet, nous pourrons sans doute vous aider à agir par d'autres moyens !"
    },
    projectRegisterHighlightText: 'Vous voulez uniquement voir les aides éligibles pour votre entreprise ?',
    financePrograms: 'Pour financer votre investissement :',
    result: {
      resume: 'Voici les actions par lesquelles commencer pour votre {effectif} du secteur {secteur} :'
    },
    form: {
      hint: '👋 Expliquez nous votre projet, nous vous mettrons en relation avec un conseiller compétent pour votre demande sur votre territoire.',
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
      hint: '👋 Expliquez nous votre projet, nous vous mettrons en relation avec un conseiller compétent pour votre demande sur votre territoire.',
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
