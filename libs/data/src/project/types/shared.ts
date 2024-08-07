import { ThemeId } from '../../theme/types/shared'
import { projects } from '../../../static'

export interface Project {
  id: number
  title: string // titre
  slug: string
  nameTag: string // Affichage du projet s'il doit être mis en avant dans une thématique (étape "quel est votre objectif prioritaire")
  shortDescription: string // texte affiché sur les cartes projets (carte présentes sur l'annuaire)
  image: string // image associée au projet (par exemple affichée sur la carte présente sur l'annuaire)
  longDescription: string // qu'est ce que c'est
  moreDescription: string // Pour aller plus loin
  themes: ThemeId[] // liste tous les thèmes auxquels le projet appartient,
  mainTheme: ThemeId // nom du thème principal (pour l'instant, donne sa couleur dans la banèire)
  programs: string[] // liste des programmes associés au projet
  linkedProjects: ProjectId[] // liste de projets à afficher dans projets complémentaires, en bas de la page Projet
  priority: number // priorité d'affichage
}

export type ProjectId = (typeof projects)[number]['id']
