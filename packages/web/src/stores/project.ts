import ProjectApi from '@/service/api/projectApi'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useProjectStore = defineStore('project', () => {
  const projects = computed(async () => {
    return await getProjects()
  })

  async function getProjects() {
    return await new ProjectApi().get()
  }

  return {
    projects
  }
})
