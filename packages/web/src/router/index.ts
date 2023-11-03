import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'

import TeeLegal from '../components/pages/TeeLegal.vue'
import TeeHome from '../components/pages/TeeHome.vue'
// import TeeTrack from './components/TeeTrack.vue'
// import TeeProgramDetail from './components/TeeProgramDetail.vue'

// Instantiate router
// declare module 'pinia' {
//   export interface PiniaCustomProperties {
//     router: Router;
//   }
// }
export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    { 
      path: '/',
      name: 'homepage', 
      component: TeeHome,
      meta: {
        layout: ''
      }
    },
    { 
      path: '/mentions-legales', 
      name: 'legal',
      component: TeeLegal,
      meta: {
        layout: ''
      }
    },
    // { path: '/track/:trackId', component: TeeTrack },
    // { path: '/program/:programId', component: TeeProgramDetail },
  ]
})