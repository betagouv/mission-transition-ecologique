<template>
  <div
    id="track_needs"
    class="fr-grid-row"
  >
    <div class="fr-col fr-col-md-8 fr-col-lg-8 tee-track-has-image-right">
      <div class="fr-grid-row fr-grid-row--gutters fr-p-5v fr-p-sm-8v fr-p-md-20v">
        <div class="fr-col-12 fr-mb-4v fr-mx-0 fr-px-2v">
          <div
            class="fr-px-2v"
            style="background-color: transparent"
          >
            <div class="tee-track-callout fr-grid-row fr-grid-row--gutters">
              <div class="fr-col">
                <h2
                  style="color: rgb(102, 114, 248); font-size: 1.7rem; font-weight: bold; margin-bottom: 1.5rem"
                  class="tee-track-callout-header"
                >
                  TPE, PME,
                </h2>
                <h1
                  class="fr-mb-3 tee-track-callout-big-title"
                  style="font-size: 2.8rem"
                >
                  Trouvez comment allier écologie avec économies
                </h1>
                <p
                  class="fr-callout__text tee-track-callout-description"
                  style="font-size: 1.3rem; line-height: 2rem"
                >
                  Je complète mon profil en moins de 2 minutes, et j’accède à des propositions d’accompagnements et de financements pour
                  m'aider à réduire mon impact environnemental.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="fr-col-xl-8 fr-col-lg-10 fr-col-md-10 fr-col-sm-12 fr-col-xs-12">
          <router-link to="/questionnaire">
            <button
              class="fr-btn fr-btn--lg inline-flex fr-btn-fullwidth fr-btn-align-center"
              aria-disabled="false"
              style="font-weight: 1000; min-height: 3.5rem; font-size: 1.5rem"
            >
              <span> Je me lance ! </span>
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-4 fr-col-lg-4 tee-track-image-right">
      <img
        class="fr-responsive-img"
        src="/images/TEE-illustrationHP.png"
        alt="image / callout"
      />
    </div>
  </div>
</template>
