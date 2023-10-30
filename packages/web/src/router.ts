import { createRouter, createWebHistory } from 'vue-router'
// import type { Router } from 'vue-router'
import TeeTrack from './components/TeeTrack.vue'
import TeeProgramDetail from './components/TeeProgramDetail.vue'

// Instantiate router
// declare module 'pinia' {
//   export interface PiniaCustomProperties {
//     router: Router;
//   }
// }
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // { path: '/track/:trackId', component: TeeTrack },
    // { path: '/program/:programId', component: TeeProgramDetail },
  ]
})