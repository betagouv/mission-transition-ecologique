# Documentation des Tests Fonctionnels

Ce document explique les tests fonctionnels automatisés qui sont effectués dans notre application pour garantir son bon fonctionnement. Ces tests simulent les actions d'un utilisateur réel et vérifient que l'application répond correctement.

## 1. Tests des Formulaires

Nos tests vérifient que les formulaires de contact fonctionnent correctement dans différents contextes :

### Formulaires testés avec succès :

1. **Formulaire d'aide depuis le catalogue** - Vérifie qu'un utilisateur peut demander des informations sur une aide spécifique (ex: "Baisse les watts").
2. **Formulaire de projet depuis un dispositif** - Vérifie qu'un utilisateur peut demander des informations sur un projet spécifique (ex: "Diag-360").
3. **Formulaire de projet depuis un projet** - Vérifie qu'après avoir rempli le questionnaire, un utilisateur peut demander des informations sur un projet recommandé.
4. **Formulaire d'aide depuis le questionnaire** - Vérifie qu'après avoir rempli le questionnaire, un utilisateur peut demander des informations sur une aide recommandée.
5. **Formulaire d'aide lié à un projet depuis le questionnaire** - Vérifie qu'un utilisateur peut demander des informations sur une aide liée à un projet recommandé.
6. **Formulaire de projet personnalisé** - Vérifie qu'un utilisateur peut créer et soumettre une demande pour un projet personnalisé.
7. **Formulaire d'aide avec informations manuelles** - Vérifie qu'un utilisateur peut remplir manuellement les informations de son entreprise pour demander une aide.

### Cas d'erreur testés :

1. **Conditions générales d'utilisation non acceptées** - Vérifie que le formulaire ne peut pas être soumis si l'utilisateur n'accepte pas les CGU.
2. **Email invalide** - Vérifie que le formulaire détecte et signale un format d'email incorrect.

Ces tests garantissent que tous les formulaires de contact fonctionnent correctement et que les validations appropriées sont en place.

## 2. Tests des Programmes d'Aide

Nos tests vérifient que les programmes d'aide sont correctement affichés et filtrés selon différents critères :

1. **Liste complète des programmes** - Vérifie que tous les programmes d'aide sont affichés sur la page principale des aides.
2. **Filtrage par profil d'entreprise** - Vérifie que les programmes sont correctement filtrés en fonction du profil de l'entreprise (taille, secteur, localisation).
3. **Filtrage par projet spécifique** - Vérifie que les programmes liés à un projet spécifique sont correctement affichés.
4. **Filtrage par réponses au questionnaire** - Vérifie que les programmes recommandés après avoir rempli le questionnaire correspondent aux réponses données.
5. **Ordre d'affichage des programmes** - Vérifie que les programmes sont affichés dans le bon ordre de pertinence.

Ces tests garantissent que les utilisateurs voient les programmes d'aide les plus pertinents pour leur situation.

## 3. Tests des Projets

Nos tests vérifient que les projets sont correctement affichés et filtrés selon différents critères :

1. **Liste complète des projets** - Vérifie que tous les projets sont affichés sur la page principale des projets.
2. **Filtrage par profil d'entreprise** - Vérifie que les projets sont correctement filtrés en fonction du profil de l'entreprise (taille, secteur, localisation).
3. **Filtrage par réponses au questionnaire** - Vérifie que les projets recommandés après avoir rempli le questionnaire correspondent aux réponses données.
4. **Affichage pour différents types d'organisations** - Vérifie que les projets appropriés sont affichés pour différents types d'organisations (TPE, PME, collectivités).

Ces tests garantissent que les utilisateurs voient les projets les plus pertinents pour leur situation.

## Conclusion

Ces tests fonctionnels automatisés nous permettent de :
- Vérifier que toutes les fonctionnalités principales de l'application fonctionnent correctement
- Détecter rapidement les régressions lors des mises à jour
- Garantir une expérience utilisateur cohérente sur différents navigateurs (Chrome, Firefox, Mobile)

Les tests sont exécutés régulièrement (à chaque Merge Request et sur les merges sur la branche principale `main`) dans notre environnement d'intégration continue, ce qui nous permet de maintenir un haut niveau de qualité pour notre application.
