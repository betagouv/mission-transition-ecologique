<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  ADEME
                </p>
              </div>
              <div class="fr-header__operator">
                <router-link to="/" title="Accueil - [À MODIFIER - texte alternatif de l’image : nom de l'opérateur ou du site serviciel] - République Française">
                  <img class="fr-responsive-img" style="width:3.5rem;" src="@public/images/logos/mission-transition-logo.png" alt="[À MODIFIER - texte alternatif de l’image]" />
                  <!-- L’alternative de l’image (attribut alt) doit impérativement être renseignée et reprendre le texte visible dans l’image -->
                </router-link>
              </div>
              <div class="fr-header__navbar">
                <button class="fr-btn--menu fr-btn" data-fr-opened="false" aria-controls="modal-499" aria-haspopup="menu" id="button-500" title="Menu">
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <router-link to="/" title="Accueil - [À MODIFIER - Nom du site / service] - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)">
                <p class="fr-header__service-title">
                  Transition écologique des entreprises
                </p>
              </router-link>
              <p class="fr-header__service-tagline">
                Faire rimer écologie avec économies !
              </p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-btns-group">
                <li>
                  <router-link 
                    class="fr-btn"
                    to="/">
                    Accueil
                  </router-link>
                </li>
                <li>
                  <router-link 
                    class="fr-btn"
                    :to="{
                      name: 'catalog'
                    }">
                    Catalogue des aides
                  </router-link>
                  <!-- <button 
                    class="fr-btn"
                    @click="pushTo('/catalogue')">
                    Catalogue des aides
                  </button> -->
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-header__menu fr-modal" id="modal-499" aria-labelledby="button-500">
      <div class="fr-container">
        <button class="fr-btn--close fr-btn" aria-controls="modal-499" title="Fermer">
          Fermer
        </button>
        <div class="fr-header__menu-links">
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { navigationStore } from '../stores/navigation'

const nav = navigationStore()

const pushTo = async (ref: string) => {
  await nav.routerRef.push(ref)
}
</script>