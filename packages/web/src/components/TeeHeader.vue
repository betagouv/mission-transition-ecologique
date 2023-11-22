<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  RÉPUBLIQUE<br>FRANÇAISE
                </p>
              </div>
              <div class="fr-header__operator">
                <router-link
                  to="/" 
                  title="Accueil - Transition Ecologique des Entreprises - République Française">
                  <img 
                    class="fr-responsive-img"
                    style="width:3.5rem;"
                    src="@public/images/logos/mission-transition-logo-alone.png"
                    alt="Transition Ecologique des Entreprises" />
                  <!-- L’alternative de l’image (attribut alt) doit impérativement être renseignée et reprendre le texte visible dans l’image -->
                </router-link>
              </div>
              <div class="fr-header__navbar">
                <button 
                  class="fr-btn--menu fr-btn"
                  data-fr-opened="false"
                  aria-controls="modal-tee-header"
                  aria-haspopup="menu"
                  id="button-tee-header-burger"
                  title="Menu"
                  @click="showModal = !showModal">
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <router-link 
                to="/"
                title="Accueil - Transition Ecologique des Entreprises - ADEME">
                <p class="fr-header__service-title">
                  Transition écologique des entreprises
                </p>
              </router-link>
              <p class="fr-header__service-tagline">
                Allier écologie avec économies !
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
                  <button 
                    class="fr-btn"
                    @click="pushTo('catalog')">
                    Annuaire
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div 
      :class="`fr-header__menu fr-modal ${showModal ? 'fr-modal--opened' : ''}`"
      id="modal-tee-header" 
      aria-labelledby="button-tee-header-burger"
      :modal="showModal"
      :open="showModal"
      :role="showModal ? 'dialog' : ''">
      <div class="fr-container">
        <button 
          class="fr-btn--close fr-btn"
          aria-controls="modal-tee-header"
          title="Fermer"
          @click="showModal = false">
          Fermer
        </button>
        <div class="fr-header__menu-links">
          <ul class="fr-btns-group">
            <li>
              <router-link 
                class="fr-btn"
                to="/">
                Accueil
              </router-link>
            </li>
            <li>
              <button 
                class="fr-btn"
                @click="pushTo('catalogue')">
                Catalogue des aides
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">

import { ref } from 'vue'

import { tracksStore } from '../stores/tracks'
import { programsStore } from '../stores/programs'
import { navigationStore } from '../stores/navigation'
import { TrackId } from '@/types'

const nav = navigationStore()
const tracks = tracksStore()
const programs = programsStore()

const showModal = ref<boolean>(false)

const pushTo = async (ref: string) => {
  // await nav.routerRef.push(ref)
  nav.setRouterReady(false)
  
  tracks.resetUsedTracks()
  tracks.addToUsedTracks(TrackId.Results, TrackId.Results)
  programs.resetDetailResult()
  
  nav.setCurrentStep(1)
  nav.setCurrentTrackId(TrackId.Results)
  nav.resetQueries()
  nav.setRouterReady(true)
  nav.updateUrl(true, ref)
}
</script>